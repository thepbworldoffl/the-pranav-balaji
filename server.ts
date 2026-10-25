import express, { Request, Response, NextFunction } from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import { INITIAL_PROJECTS } from "./src/config/projectsData";
import { SITE_CONFIG } from "./src/config/siteConfig";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === "production";

app.use(express.json({ limit: "5mb" }));

// ----------------------------------------------------------------------------
// PERSISTENT DATABASE ENGINE (Atomic File Store)
// ----------------------------------------------------------------------------
const DATA_DIR = path.resolve(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

interface DatabaseSchema {
  applications: any[];
  collaborations: any[];
  enquiries: any[];
  partnerships: any[];
  projects: any[];
  settings: {
    socials: typeof SITE_CONFIG.socials;
    applicationWindow: typeof SITE_CONFIG.applicationWindow;
    defaultTrailerUrl: string;
  };
  adminSessions: { token: string; expiresAt: number; username: string }[];
  auditLogs: { timestamp: string; action: string; details: any }[];
}

function ensureDbInitialized(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const defaultDb: DatabaseSchema = {
    applications: [],
    collaborations: [],
    enquiries: [],
    partnerships: [],
    projects: INITIAL_PROJECTS,
    settings: {
      socials: { ...SITE_CONFIG.socials },
      applicationWindow: { ...SITE_CONFIG.applicationWindow },
      defaultTrailerUrl: SITE_CONFIG.defaultTrailerUrl,
    },
    adminSessions: [],
    auditLogs: [],
  };

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), "utf-8");
    return defaultDb;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    // Ensure all collections exist
    return {
      applications: parsed.applications || [],
      collaborations: parsed.collaborations || [],
      enquiries: parsed.enquiries || [],
      partnerships: parsed.partnerships || [],
      projects: parsed.projects && parsed.projects.length > 0 ? parsed.projects : INITIAL_PROJECTS,
      settings: parsed.settings || defaultDb.settings,
      adminSessions: parsed.adminSessions || [],
      auditLogs: parsed.auditLogs || [],
    };
  } catch (err) {
    console.error("Error reading database file, resetting to defaults:", err);
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), "utf-8");
    return defaultDb;
  }
}

function readDb(): DatabaseSchema {
  return ensureDbInitialized();
}

function writeDb(data: DatabaseSchema): void {
  const tmpFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tmpFile, DB_FILE);
}

// ----------------------------------------------------------------------------
// SECURITY & SANITIZATION HELPERS
// ----------------------------------------------------------------------------
const recentSubmissions = new Map<string, number>();

function sanitizeString(str: unknown, maxLen = 2000): string {
  if (typeof str !== "string") return "";
  return str.trim().slice(0, maxLen).replace(/<[^>]*>?/gm, "");
}

function generateRefId(prefix: string): string {
  const randomChars = crypto.randomBytes(3).toString("hex").toUpperCase();
  const year = new Date().getFullYear();
  return `PB-${prefix}-${year}-${randomChars}`;
}

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "PRANAVBALAJI";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "1@PRANAVMASTER";
const AUTH_SECRET = process.env.AUTH_SECRET || "pbworld-secret-studio-token-salt-2026";

function createAuthToken(username: string): string {
  const payload = `${username}:${Date.now()}:${crypto.randomBytes(16).toString("hex")}`;
  const hmac = crypto.createHmac("sha256", AUTH_SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${hmac}`).toString("base64");
}

function verifyAuthToken(token: string): boolean {
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length < 4) return false;
    const [username, timestampStr, nonce, hmac] = parts;
    const payload = `${username}:${timestampStr}:${nonce}`;
    const expectedHmac = crypto.createHmac("sha256", AUTH_SECRET).update(payload).digest("hex");
    if (hmac !== expectedHmac) return false;
    const tokenAge = Date.now() - Number(timestampStr);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    return tokenAge < maxAge;
  } catch {
    return false;
  }
}

function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized. Admin session required." });
    return;
  }
  const token = authHeader.split(" ")[1];
  if (!verifyAuthToken(token)) {
    res.status(403).json({ error: "Forbidden or expired session. Please log in again." });
    return;
  }
  next();
}

// ----------------------------------------------------------------------------
// GEMINI SDK CLIENT SETUP (Server-Side Only)
// ----------------------------------------------------------------------------
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// ----------------------------------------------------------------------------
// PUBLIC API ENDPOINTS
// ----------------------------------------------------------------------------

// 1. Get Site Settings (Socials, Application Window, Trailer URL)
app.get("/api/settings", (_req: Request, res: Response) => {
  const db = readDb();
  res.json({
    settings: db.settings,
    company: {
      name: SITE_CONFIG.companyName,
      tagline: SITE_CONFIG.tagline,
      subtagline: SITE_CONFIG.subtagline,
      logoPath: SITE_CONFIG.logoPath,
    },
  });
});

// 2. Get Canonical Projects
app.get("/api/projects", (_req: Request, res: Response) => {
  const db = readDb();
  res.json({ projects: db.projects });
});

// 3. Submit Careers Job Application
app.post("/api/applications", (req: Request, res: Response) => {
  const db = readDb();
  const windowSettings = db.settings.applicationWindow;

  // Server-side enforcement of application window dates
  const now = new Date();
  const start = new Date(windowSettings.startDate + "T00:00:00Z");
  const end = new Date(windowSettings.endDate + "T23:59:59Z");

  if (now < start || now > end) {
    res.status(403).json({
      error: `The career application window is currently closed. Submissions are accepted from ${windowSettings.startDate} to ${windowSettings.endDate}.`,
    });
    return;
  }

  const {
    fullName,
    email,
    phone,
    cityCountry,
    desiredRole,
    skills,
    programmingLanguages,
    education,
    experienceYears,
    previousCompany,
    portfolioUrl,
    message,
  } = req.body;

  // Strict field validation
  if (!fullName || !email || !cityCountry || !desiredRole || !skills || !education || !experienceYears || !message) {
    res.status(400).json({ error: "Please complete all required application fields." });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: "Please provide a valid email address." });
    return;
  }

  // Duplicate / Spam Protection
  const dedupeKey = `app:${email.toLowerCase()}`;
  const lastTime = recentSubmissions.get(dedupeKey);
  if (lastTime && Date.now() - lastTime < 300_000) {
    // 5 minutes duplicate protection
    res.status(429).json({ error: "A recent application from this email was already received. Please wait before submitting again." });
    return;
  }
  recentSubmissions.set(dedupeKey, Date.now());

  const referenceId = generateRefId("APP");
  const newApp = {
    id: `app_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
    referenceId,
    fullName: sanitizeString(fullName, 120),
    email: sanitizeString(email, 120),
    phone: phone ? sanitizeString(phone, 40) : undefined,
    cityCountry: sanitizeString(cityCountry, 120),
    desiredRole: sanitizeString(desiredRole, 100),
    skills: sanitizeString(skills, 500),
    programmingLanguages: programmingLanguages ? sanitizeString(programmingLanguages, 300) : undefined,
    education: sanitizeString(education, 150),
    experienceYears: sanitizeString(experienceYears, 50),
    previousCompany: previousCompany ? sanitizeString(previousCompany, 150) : undefined,
    portfolioUrl: portfolioUrl ? sanitizeString(portfolioUrl, 300) : undefined,
    message: sanitizeString(message, 3000),
    status: "pending",
    adminNotes: "",
    submittedAt: new Date().toISOString(),
  };

  db.applications.unshift(newApp);
  writeDb(db);

  res.status(201).json({
    success: true,
    referenceId,
    message: "Application submitted successfully to PB World database.",
  });
});

// 4. Submit Project Collaboration
app.post("/api/collaborations", (req: Request, res: Response) => {
  const {
    contactName,
    email,
    teamOrCompany,
    projectTitle,
    category,
    description,
    currentStage,
    helpNeeded,
    portfolioOrProjectLink,
    message,
  } = req.body;

  if (!contactName || !email || !projectTitle || !category || !description || !currentStage || !helpNeeded || !message) {
    res.status(400).json({ error: "Please complete all required fields for collaboration." });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: "Please provide a valid email address." });
    return;
  }

  const db = readDb();
  const referenceId = generateRefId("COL");

  const newCollab = {
    id: `col_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
    referenceId,
    contactName: sanitizeString(contactName, 120),
    email: sanitizeString(email, 120),
    teamOrCompany: teamOrCompany ? sanitizeString(teamOrCompany, 150) : undefined,
    projectTitle: sanitizeString(projectTitle, 150),
    category: sanitizeString(category, 60),
    description: sanitizeString(description, 3000),
    currentStage: sanitizeString(currentStage, 100),
    helpNeeded: sanitizeString(helpNeeded, 500),
    portfolioOrProjectLink: portfolioOrProjectLink ? sanitizeString(portfolioOrProjectLink, 300) : undefined,
    message: sanitizeString(message, 3000),
    status: "pending",
    adminNotes: "",
    submittedAt: new Date().toISOString(),
  };

  db.collaborations.unshift(newCollab);
  writeDb(db);

  res.status(201).json({
    success: true,
    referenceId,
    message: "Collaboration proposal received by PB World.",
  });
});

// 5. Submit Client Enquiry
app.post("/api/enquiries", (req: Request, res: Response) => {
  const {
    name,
    email,
    phoneOrCompany,
    projectCategory,
    projectDescription,
    requiredDeliverables,
    preferredTimeline,
    budgetRange,
    message,
  } = req.body;

  if (!name || !email || !projectCategory || !projectDescription || !requiredDeliverables || !preferredTimeline || !message) {
    res.status(400).json({ error: "Please fill out all required fields for the client enquiry." });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: "Please enter a valid email address." });
    return;
  }

  const db = readDb();
  const referenceId = generateRefId("ENQ");

  const newEnquiry = {
    id: `enq_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
    referenceId,
    name: sanitizeString(name, 120),
    email: sanitizeString(email, 120),
    phoneOrCompany: phoneOrCompany ? sanitizeString(phoneOrCompany, 150) : undefined,
    projectCategory: sanitizeString(projectCategory, 80),
    projectDescription: sanitizeString(projectDescription, 3000),
    requiredDeliverables: sanitizeString(requiredDeliverables, 500),
    preferredTimeline: sanitizeString(preferredTimeline, 100),
    budgetRange: budgetRange ? sanitizeString(budgetRange, 100) : undefined,
    message: sanitizeString(message, 3000),
    status: "pending",
    adminNotes: "",
    submittedAt: new Date().toISOString(),
  };

  db.enquiries.unshift(newEnquiry);
  writeDb(db);

  res.status(201).json({
    success: true,
    referenceId,
    message: "Client enquiry confirmed in PB World database.",
  });
});

// 6. Submit Partnership & Investment Enquiry
app.post("/api/partnerships", (req: Request, res: Response) => {
  const { name, email, phone, organization, role, website, enquiryType, message } = req.body;

  if (!name || !email || !organization || !role || !enquiryType || !message) {
    res.status(400).json({ error: "Please provide all required partnership information." });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: "Please enter a valid email address." });
    return;
  }

  const db = readDb();
  const referenceId = generateRefId("PRT");

  const newPartner = {
    id: `prt_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`,
    referenceId,
    name: sanitizeString(name, 120),
    email: sanitizeString(email, 120),
    phone: phone ? sanitizeString(phone, 50) : undefined,
    organization: sanitizeString(organization, 150),
    role: sanitizeString(role, 100),
    website: website ? sanitizeString(website, 200) : undefined,
    enquiryType: sanitizeString(enquiryType, 100),
    message: sanitizeString(message, 3000),
    status: "pending",
    adminNotes: "",
    submittedAt: new Date().toISOString(),
  };

  db.partnerships.unshift(newPartner);
  writeDb(db);

  res.status(201).json({
    success: true,
    referenceId,
    message: "Partnership enquiry registered.",
  });
});

// ----------------------------------------------------------------------------
// AUTHENTICATION ENDPOINTS
// ----------------------------------------------------------------------------

app.post("/api/auth/login", (req: Request, res: Response) => {
  const { username, password } = req.body;

  const isValidUser =
    typeof username === "string" &&
    username.trim().toUpperCase() === ADMIN_USERNAME.toUpperCase();
  const isValidPass =
    typeof password === "string" && password === ADMIN_PASSWORD;

  if (isValidUser && isValidPass) {
    const token = createAuthToken(ADMIN_USERNAME);
    const db = readDb();
    db.adminSessions.push({
      token,
      username,
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    // keep max 50 sessions
    if (db.adminSessions.length > 50) db.adminSessions.shift();
    writeDb(db);

    res.json({
      success: true,
      token,
      username,
      role: "super_admin",
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });
    return;
  }

  res.status(401).json({ error: "Invalid administrator credentials." });
});

app.get("/api/auth/verify", (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.json({ authenticated: false });
    return;
  }
  const token = authHeader.split(" ")[1];
  const valid = verifyAuthToken(token);
  res.json({ authenticated: valid, username: valid ? ADMIN_USERNAME : null });
});

// ----------------------------------------------------------------------------
// PROTECTED ADMIN ENDPOINTS
// ----------------------------------------------------------------------------

// 1. Dashboard Overview Stats
app.get("/api/admin/stats", requireAdminAuth, (_req: Request, res: Response) => {
  const db = readDb();
  const allSubmissions = [
    ...db.applications,
    ...db.collaborations,
    ...db.enquiries,
    ...db.partnerships,
  ];

  const pendingCount = allSubmissions.filter((s) => s.status === "pending").length;
  const shortlistedCount = allSubmissions.filter((s) => s.status === "shortlisted").length;

  res.json({
    stats: {
      totalApplications: db.applications.length,
      totalClientEnquiries: db.enquiries.length,
      totalCollaborations: db.collaborations.length,
      totalPartnerships: db.partnerships.length,
      pendingCount,
      shortlistedCount,
      applicationWindowStatus: {
        startDate: db.settings.applicationWindow.startDate,
        endDate: db.settings.applicationWindow.endDate,
      },
    },
  });
});

// 2. Fetch Submissions by Collection
app.get("/api/admin/submissions/:type", requireAdminAuth, (req: Request, res: Response) => {
  const { type } = req.params;
  const { search, status } = req.query;
  const db = readDb();

  let list: any[] = [];
  if (type === "applications") list = db.applications;
  else if (type === "collaborations") list = db.collaborations;
  else if (type === "enquiries") list = db.enquiries;
  else if (type === "partnerships") list = db.partnerships;
  else {
    res.status(400).json({ error: "Invalid submission collection requested." });
    return;
  }

  // Filter by status
  if (status && typeof status === "string" && status !== "all") {
    list = list.filter((item) => item.status === status);
  }

  // Filter by search query
  if (search && typeof search === "string" && search.trim() !== "") {
    const q = search.toLowerCase();
    list = list.filter((item) => {
      return (
        item.referenceId?.toLowerCase().includes(q) ||
        item.fullName?.toLowerCase().includes(q) ||
        item.name?.toLowerCase().includes(q) ||
        item.contactName?.toLowerCase().includes(q) ||
        item.email?.toLowerCase().includes(q) ||
        item.desiredRole?.toLowerCase().includes(q) ||
        item.projectTitle?.toLowerCase().includes(q)
      );
    });
  }

  res.json({ data: list });
});

// 3. Update Status and Admin Notes
app.patch("/api/admin/submissions/:type/:id", requireAdminAuth, (req: Request, res: Response) => {
  const { type, id } = req.params;
  const { status, adminNotes } = req.body;
  const db = readDb();

  let collection: any[] | null = null;
  if (type === "applications") collection = db.applications;
  else if (type === "collaborations") collection = db.collaborations;
  else if (type === "enquiries") collection = db.enquiries;
  else if (type === "partnerships") collection = db.partnerships;

  if (!collection) {
    res.status(400).json({ error: "Invalid collection." });
    return;
  }

  const item = collection.find((i) => i.id === id);
  if (!item) {
    res.status(404).json({ error: "Submission not found." });
    return;
  }

  if (status) item.status = status;
  if (typeof adminNotes === "string") item.adminNotes = adminNotes;

  writeDb(db);
  res.json({ success: true, item });
});

// 4. Delete Submission
app.delete("/api/admin/submissions/:type/:id", requireAdminAuth, (req: Request, res: Response) => {
  const { type, id } = req.params;
  const db = readDb();

  let key: keyof DatabaseSchema | null = null;
  if (type === "applications") key = "applications";
  else if (type === "collaborations") key = "collaborations";
  else if (type === "enquiries") key = "enquiries";
  else if (type === "partnerships") key = "partnerships";

  if (!key) {
    res.status(400).json({ error: "Invalid collection." });
    return;
  }

  (db[key] as any[]) = (db[key] as any[]).filter((i) => i.id !== id);
  writeDb(db);
  res.json({ success: true, message: "Submission removed." });
});

// 5. Update Site Settings (Window Dates, Social URLs, Trailer URL)
app.put("/api/admin/settings", requireAdminAuth, (req: Request, res: Response) => {
  const { socials, applicationWindow, defaultTrailerUrl } = req.body;
  const db = readDb();

  if (socials) {
    db.settings.socials = { ...db.settings.socials, ...socials };
  }
  if (applicationWindow) {
    db.settings.applicationWindow = { ...db.settings.applicationWindow, ...applicationWindow };
  }
  if (typeof defaultTrailerUrl === "string") {
    db.settings.defaultTrailerUrl = defaultTrailerUrl;
  }

  writeDb(db);
  res.json({ success: true, settings: db.settings });
});

// 6. Update Project Details
app.put("/api/admin/projects/:id", requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  const db = readDb();

  const projIndex = db.projects.findIndex((p) => p.id === id);
  if (projIndex === -1) {
    res.status(404).json({ error: "Project not found." });
    return;
  }

  db.projects[projIndex] = { ...db.projects[projIndex], ...updates };
  writeDb(db);
  res.json({ success: true, project: db.projects[projIndex] });
});

// ----------------------------------------------------------------------------
// GEMINI AI STUDIO INTELLIGENCE SUITE (Server-Side @google/genai)
// ----------------------------------------------------------------------------

// A. High-Thinking Deep Concept & Script Analysis (gemini-4-argon with ThinkingLevel.HIGH)
app.post("/api/gemini/analyze-concept", async (req: Request, res: Response) => {
  if (!ai) {
    res.status(503).json({
      error: "Gemini API key is not configured. Add GEMINI_API_KEY in the Secrets panel to activate AI intelligence.",
    });
    return;
  }

  const { title, genre, synopsis, focusArea } = req.body;
  if (!title || !synopsis) {
    res.status(400).json({ error: "Title and synopsis are required." });
    return;
  }

  try {
    const prompt = `You are a Principal Creative Director & Systems Architect at PB World (a studio specializing in Game Development, Animation & Film, VFX, and App Development).
Analyze the following project concept thoroughly:

Project Title: ${title}
Genre: ${genre || "Fantasy / Adventure"}
Focus Area: ${focusArea || "Comprehensive Narrative & Mechanics Feasibility"}
Concept / Synopsis:
${synopsis}

Please provide a structured, professional evaluation covering:
1. Executive Creative Assessment (Strengths, thematic originality, emotional resonance)
2. Worldbuilding & Lore Expansion (Specific environmental factions, ancient lore anchors)
3. Technical Feasibility & Production Considerations (Unreal Engine 5 / Houdini / Stylized pipeline requirements)
4. Key Recommendations & Next Milestone Actions for PB World.`;

    const response = await ai.models.generateContent({
      model: "gemini-4-argon",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
      },
    });

    res.json({
      success: true,
      analysis: response.text,
      modelUsed: "gemini-4-argon (ThinkingLevel.HIGH)",
    });
  } catch (error) {
    console.error("Gemini concept analysis error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Error running Gemini concept analysis.",
    });
  }
});

// B. High-Quality Image Generation (gemini-3-pro-image with 1K, 2K, 4K resolution affordance)
app.post("/api/gemini/generate-concept-art", async (req: Request, res: Response) => {
  if (!ai) {
    res.status(503).json({
      error: "Gemini API key is not configured. Add GEMINI_API_KEY to enable image generation.",
    });
    return;
  }

  const { prompt, aspectRatio = "16:9", imageSize = "1K" } = req.body;
  if (!prompt) {
    res.status(400).json({ error: "Prompt is required." });
    return;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image",
      contents: {
        parts: [
          {
            text: `PB World cinematic concept art: ${prompt}. Atmospheric lighting, studio quality, high fantasy and sci-fi technology, 8k resolution, photorealistic cinematic grade.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: imageSize as any, // 1K, 2K, 4K affordance
        },
      },
    });

    let imageUrl = "";
    let commentary = "";

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        imageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
      } else if (part.text) {
        commentary += part.text;
      }
    }

    if (!imageUrl) {
      res.status(500).json({ error: "No image data returned from image model." });
      return;
    }

    res.json({
      success: true,
      imageUrl,
      commentary,
      imageSize,
      aspectRatio,
      modelUsed: "gemini-3-pro-image",
    });
  } catch (error) {
    console.error("Gemini image generation error:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Image generation failed.",
    });
  }
});

// C. Video Content & Trailer Concept Analyzer (gemini-4-argon)
app.post("/api/gemini/analyze-video", async (req: Request, res: Response) => {
  if (!ai) {
    res.status(503).json({ error: "Gemini API key required." });
    return;
  }

  const { videoTitle, treatmentNotes, targetReleaseDate } = req.body;
  try {
    const prompt = `You are a Senior Cinematic Director analyzing trailer sequencing and video content for PB World.
Video / Trailer Title: ${videoTitle || "Aetherfall Reveal Teaser"}
Target Date: ${targetReleaseDate || "25 December 2026 (Planned Target)"}
Treatment Script & Beats:
${treatmentNotes || "Opening with atmospheric silence in an ancient mossy stone shrine, followed by rumbling earth as a primordial titan emerges from the cloud cover."}

Analyze:
1. Pacing & Tension Curve (0:00 to 1:45 breakdown)
2. Audio Design & Foley Palette (Orchestral crescendos, low-frequency titan steps)
3. Key Teaser Hooks to ensure maximum player anticipation without overpromising unfinished mechanics.`;

    const response = await ai.models.generateContent({
      model: "gemini-4-argon",
      contents: prompt,
    });

    res.json({
      success: true,
      analysis: response.text,
      modelUsed: "gemini-4-argon",
    });
  } catch (error) {
    console.error("Video analysis error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Failed to analyze video." });
  }
});

// D. Fast Assistant / Candidate & Enquiry Triage (gemini-3.1-flash-lite)
app.post("/api/gemini/fast-assist", async (req: Request, res: Response) => {
  if (!ai) {
    res.status(503).json({ error: "Gemini API key required." });
    return;
  }

  const { query, contextType } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: `You are the PB World internal studio intelligence assistant.
Context: ${contextType || "Studio Query"}
Query: ${query}
Answer concisely, accurately, and professionally.`,
    });

    res.json({
      success: true,
      reply: response.text,
      modelUsed: "gemini-3.1-flash-lite",
    });
  } catch (error) {
    console.error("Fast assist error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Fast assist failed." });
  }
});

// ----------------------------------------------------------------------------
// SERVER LAUNCH & VITE MIDDLEWARE MOUNT
// ----------------------------------------------------------------------------
async function startServer() {
  ensureDbInitialized();

  if (!IS_PROD) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[PB World Server] Running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start PB World server:", err);
});
