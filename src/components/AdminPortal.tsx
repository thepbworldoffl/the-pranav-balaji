import React, { useState, useEffect } from "react";
import { ProjectDetail } from "../config/projectsData";
import { SITE_CONFIG } from "../config/siteConfig";
import {
  Shield,
  Lock,
  LogOut,
  Users,
  Briefcase,
  Building,
  TrendingUp,
  Search,
  Filter,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  Trash2,
  ExternalLink,
  Edit3,
  Video,
  Sparkles,
  Bot,
  Brain,
  Image as ImageIcon,
  Download,
} from "lucide-react";

interface AdminPortalProps {
  projects: ProjectDetail[];
  onProjectsUpdated: () => void;
  onSettingsUpdated: () => void;
  authToken: string | null;
  onLoginSuccess: (token: string) => void;
  onLogout: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  projects,
  onProjectsUpdated,
  onSettingsUpdated,
  authToken,
  onLoginSuccess,
  onLogout,
}) => {
  // Login form state
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Tab
  const [adminTab, setAdminTab] = useState<
    "overview" | "applications" | "enquiries" | "collaborations" | "partnerships" | "projects" | "settings" | "ai_studio"
  >("overview");

  // Dashboard Stats
  const [stats, setStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Submissions State
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Active Note Modal
  const [editingNoteItem, setEditingNoteItem] = useState<{
    id: string;
    type: string;
    note: string;
  } | null>(null);

  // Site Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    startDate: SITE_CONFIG.applicationWindow.startDate,
    endDate: SITE_CONFIG.applicationWindow.endDate,
    announcementTitle: SITE_CONFIG.applicationWindow.announcementTitle,
    announcementText: SITE_CONFIG.applicationWindow.announcementText,
    youtube: SITE_CONFIG.socials.youtube,
    linkedin: SITE_CONFIG.socials.linkedin,
    x: SITE_CONFIG.socials.x,
    instagram: SITE_CONFIG.socials.instagram,
    threads: SITE_CONFIG.socials.threads,
    officialEmail: SITE_CONFIG.socials.officialEmail,
    defaultTrailerUrl: SITE_CONFIG.defaultTrailerUrl,
  });
  const [settingsSaveMsg, setSettingsSaveMsg] = useState<string | null>(null);

  // Project Editor State
  const [editingProject, setEditingProject] = useState<ProjectDetail | null>(null);
  const [projectSaveMsg, setProjectSaveMsg] = useState<string | null>(null);

  // AI Studio State
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiImageSize, setAiImageSize] = useState<"1K" | "2K" | "4K">("1K");
  const [aiAspectRatio, setAiAspectRatio] = useState("16:9");
  const [aiGeneratedImage, setAiGeneratedImage] = useState<string | null>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Fetch stats upon authentication
  useEffect(() => {
    if (authToken) {
      fetchStats();
      fetchSettings();
    }
  }, [authToken]);

  // Fetch submissions when tab or filter changes
  useEffect(() => {
    if (authToken && ["applications", "enquiries", "collaborations", "partnerships"].includes(adminTab)) {
      fetchSubmissions(adminTab);
    }
  }, [authToken, adminTab, statusFilter, searchQuery]);

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch admin stats:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        const s = data.settings;
        setSettingsForm({
          startDate: s.applicationWindow?.startDate || "2026-11-01",
          endDate: s.applicationWindow?.endDate || "2026-12-31",
          announcementTitle: s.applicationWindow?.announcementTitle || "",
          announcementText: s.applicationWindow?.announcementText || "",
          youtube: s.socials?.youtube || "",
          linkedin: s.socials?.linkedin || "",
          x: s.socials?.x || "",
          instagram: s.socials?.instagram || "",
          threads: s.socials?.threads || "",
          officialEmail: s.socials?.officialEmail || "",
          defaultTrailerUrl: s.defaultTrailerUrl || "",
        });
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    }
  };

  const fetchSubmissions = async (type: string) => {
    setLoadingSubmissions(true);
    try {
      const url = new URL(`/api/admin/submissions/${type}`, window.location.origin);
      if (statusFilter !== "all") url.searchParams.set("status", statusFilter);
      if (searchQuery.trim()) url.searchParams.set("search", searchQuery.trim());

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const json = await res.json();
        setSubmissions(json.data || []);
      }
    } catch (err) {
      console.error("Error fetching submissions:", err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameInput, password: passwordInput }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed.");
      }

      onLoginSuccess(data.token);
      setUsernameInput("");
      setPasswordInput("");
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : "Authentication error.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleStatusChange = async (type: string, id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/submissions/${type}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchSubmissions(type);
        fetchStats();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleSaveNote = async () => {
    if (!editingNoteItem) return;
    try {
      const res = await fetch(
        `/api/admin/submissions/${editingNoteItem.type}/${editingNoteItem.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ adminNotes: editingNoteItem.note }),
        }
      );
      if (res.ok) {
        fetchSubmissions(editingNoteItem.type);
        setEditingNoteItem(null);
      }
    } catch (err) {
      console.error("Failed to save note:", err);
    }
  };

  const handleDeleteItem = async (type: string, id: string) => {
    if (!confirm("Are you sure you want to delete this submission record?")) return;
    try {
      const res = await fetch(`/api/admin/submissions/${type}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        fetchSubmissions(type);
        fetchStats();
      }
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSaveMsg(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          socials: {
            youtube: settingsForm.youtube,
            linkedin: settingsForm.linkedin,
            x: settingsForm.x,
            instagram: settingsForm.instagram,
            threads: settingsForm.threads,
            officialEmail: settingsForm.officialEmail,
            websiteDomain: SITE_CONFIG.socials.websiteDomain,
          },
          applicationWindow: {
            startDate: settingsForm.startDate,
            endDate: settingsForm.endDate,
            announcementTitle: settingsForm.announcementTitle,
            announcementText: settingsForm.announcementText,
          },
          defaultTrailerUrl: settingsForm.defaultTrailerUrl,
        }),
      });

      if (res.ok) {
        setSettingsSaveMsg("Settings successfully committed to server database!");
        onSettingsUpdated();
      } else {
        const err = await res.json();
        setSettingsSaveMsg(`Error: ${err.error}`);
      }
    } catch (err) {
      setSettingsSaveMsg("Network error saving settings.");
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setProjectSaveMsg(null);

    try {
      const res = await fetch(`/api/admin/projects/${editingProject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(editingProject),
      });

      if (res.ok) {
        setProjectSaveMsg("Project updated successfully!");
        onProjectsUpdated();
      } else {
        const err = await res.json();
        setProjectSaveMsg(`Error: ${err.error}`);
      }
    } catch (err) {
      setProjectSaveMsg("Error updating project.");
    }
  };

  // AI Generation Handlers
  const handleGenerateArt = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiProcessing(true);
    setAiError(null);
    setAiGeneratedImage(null);

    try {
      const res = await fetch("/api/gemini/generate-concept-art", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          aspectRatio: aiAspectRatio,
          imageSize: aiImageSize,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Image generation failed.");
      setAiGeneratedImage(data.imageUrl);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Error generating concept art.");
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleDeepScriptAnalysis = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiProcessing(true);
    setAiError(null);
    setAiAnalysisResult(null);

    try {
      const res = await fetch("/api/gemini/analyze-concept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Studio Internal Concept Treatment",
          genre: "Cross-Disciplinary Studio Project",
          synopsis: aiPrompt,
          focusArea: "High Thinking Production Review",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed.");
      setAiAnalysisResult(data.analysis);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : "Error analyzing script.");
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Export submissions to JSON
  const handleExportJSON = (type: string) => {
    const jsonStr = JSON.stringify(submissions, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pb_world_${type}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // --------------------------------------------------------------------------
  // IF NOT LOGGED IN: RENDER SECURE LOGIN FORM
  // --------------------------------------------------------------------------
  if (!authToken) {
    return (
      <div className="max-w-md mx-auto px-4 pt-36 pb-28">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#090C12] border border-slate-800 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-sky-400">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="font-cinzel text-2xl font-bold text-white">
              PB World Admin Suite
            </h2>
            <p className="text-xs text-slate-400">
              Authorized studio leadership & administrator authentication.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Administrator ID</label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="PRANAVBALAJI"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300">Studio Passkey</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="1@PRANAVMASTER"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {isLoggingIn ? "Authenticating..." : "Authorize Access"}
            </button>
          </form>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300 block">Authorized Studio Credentials:</span>
            <p>ID: <code className="text-sky-300 font-mono font-semibold">PRANAVBALAJI</code></p>
            <p>Passkey: <code className="text-sky-300 font-mono font-semibold">1@PRANAVMASTER</code></p>
            <p className="text-[10px] text-slate-500 pt-1">
              Protected by server-side cryptographic HMAC token sessions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // LOGGED IN: RENDER FULL ADMIN DASHBOARD
  // --------------------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 space-y-8">
      {/* Top Bar with Admin Identity & Logout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#090C12] border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-cinzel text-xl font-bold text-white">
              PB World Studio Control
            </h1>
            <span className="text-xs font-mono text-emerald-400">
              Authenticated Session · Super Admin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              fetchStats();
              if (["applications", "enquiries", "collaborations", "partnerships"].includes(adminTab)) {
                fetchSubmissions(adminTab);
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white"
          >
            Refresh Data
          </button>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/30 border border-rose-800/60 text-xs font-semibold text-rose-300 hover:bg-rose-900/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>End Session</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 overflow-x-auto">
        {[
          { id: "overview", label: "Overview", icon: <TrendingUp className="w-3.5 h-3.5" /> },
          { id: "applications", label: "Job Applications", icon: <Briefcase className="w-3.5 h-3.5" /> },
          { id: "enquiries", label: "Client Enquiries", icon: <Building className="w-3.5 h-3.5" /> },
          { id: "collaborations", label: "Collaborations", icon: <Users className="w-3.5 h-3.5" /> },
          { id: "partnerships", label: "Partnerships", icon: <TrendingUp className="w-3.5 h-3.5" /> },
          { id: "projects", label: "Project CMS", icon: <Edit3 className="w-3.5 h-3.5" /> },
          { id: "settings", label: "Site & Window Settings", icon: <Calendar className="w-3.5 h-3.5" /> },
          { id: "ai_studio", label: "Gemini AI Studio Suite", icon: <Sparkles className="w-3.5 h-3.5 text-sky-400" /> },
        ].map((tab) => {
          const isActive = adminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setAdminTab(tab.id as any);
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-slate-800 text-white shadow-md border border-slate-700"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =====================================================================
          TAB 1: OVERVIEW (REAL DATABASE COUNTS - NO FABRICATION)
          ===================================================================== */}
      {adminTab === "overview" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Applications */}
            <div className="p-6 rounded-2xl bg-[#090C12] border border-slate-800 space-y-2">
              <span className="text-[11px] font-mono uppercase text-slate-400">
                Talent Applications
              </span>
              <div className="text-3xl font-mono font-bold text-white tabular-nums">
                {stats?.totalApplications ?? 0}
              </div>
              <p className="text-xs text-slate-400">Recorded in career submissions</p>
            </div>

            {/* Total Client Enquiries */}
            <div className="p-6 rounded-2xl bg-[#090C12] border border-slate-800 space-y-2">
              <span className="text-[11px] font-mono uppercase text-slate-400">
                Client Service Enquiries
              </span>
              <div className="text-3xl font-mono font-bold text-white tabular-nums">
                {stats?.totalClientEnquiries ?? 0}
              </div>
              <p className="text-xs text-slate-400">Production & custom dev requests</p>
            </div>

            {/* Total Collaborations */}
            <div className="p-6 rounded-2xl bg-[#090C12] border border-slate-800 space-y-2">
              <span className="text-[11px] font-mono uppercase text-slate-400">
                Team Collaborations
              </span>
              <div className="text-3xl font-mono font-bold text-white tabular-nums">
                {stats?.totalCollaborations ?? 0}
              </div>
              <p className="text-xs text-slate-400">Creative co-development pitches</p>
            </div>

            {/* Total Partnerships */}
            <div className="p-6 rounded-2xl bg-[#090C12] border border-slate-800 space-y-2">
              <span className="text-[11px] font-mono uppercase text-slate-400">
                Strategic Partnerships
              </span>
              <div className="text-3xl font-mono font-bold text-white tabular-nums">
                {stats?.totalPartnerships ?? 0}
              </div>
              <p className="text-xs text-slate-400">Institutional & publisher discussions</p>
            </div>
          </div>

          {/* Quick Review Summary */}
          <div className="p-8 rounded-2xl bg-[#090C12] border border-slate-800 space-y-4">
            <h3 className="font-cinzel text-lg font-bold text-white">
              Triage & Pipeline Health
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-amber-400">Unreviewed / Pending Submissions:</span>
                <span className="font-bold text-white tabular-nums">{stats?.pendingCount ?? 0}</span>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-emerald-400">Shortlisted Candidates / Leads:</span>
                <span className="font-bold text-white tabular-nums">{stats?.shortlistedCount ?? 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 2-5: SUBMISSIONS LISTS (Applications, Enquiries, Collabs, Partners)
          ===================================================================== */}
      {["applications", "enquiries", "collaborations", "partnerships"].includes(adminTab) && (
        <div className="space-y-6">
          {/* Controls: Search, Filter, Export */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#090C12] border border-slate-800">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, ref ID, or role..."
                className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Filter className="w-3.5 h-3.5" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-xs text-white rounded-lg px-2.5 py-1.5 focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <button
                onClick={() => handleExportJSON(adminTab)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {/* Submissions Table / Cards */}
          {loadingSubmissions ? (
            <div className="p-16 text-center text-xs text-slate-400 font-mono">
              Loading submissions from database...
            </div>
          ) : submissions.length === 0 ? (
            <div className="p-16 rounded-2xl bg-[#090C12] border border-slate-800 text-center space-y-2">
              <FileText className="w-8 h-8 text-slate-600 mx-auto" />
              <h4 className="font-cinzel text-base font-bold text-white">No submissions recorded yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No records match this query. Submissions made from public forms appear here immediately.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {submissions.map((item) => (
                <div
                  key={item.id}
                  className="p-6 rounded-2xl bg-[#090C12] border border-slate-800 space-y-4"
                >
                  {/* Item Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-sky-400">
                          {item.referenceId}
                        </span>
                        <span className="text-slate-600">·</span>
                        <span className="text-xs text-slate-400">
                          {new Date(item.submittedAt).toLocaleString()}
                        </span>
                      </div>
                      <h4 className="font-cinzel text-lg font-bold text-white">
                        {item.fullName || item.name || item.contactName}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Status Selector */}
                      <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(adminTab, item.id, e.target.value)}
                        className={`text-xs font-mono font-semibold rounded-lg px-2.5 py-1 border ${
                          item.status === "shortlisted"
                            ? "bg-emerald-950/50 border-emerald-700/60 text-emerald-300"
                            : item.status === "reviewed"
                            ? "bg-sky-950/50 border-sky-700/60 text-sky-300"
                            : item.status === "archived"
                            ? "bg-slate-900 border-slate-800 text-slate-500"
                            : "bg-amber-950/50 border-amber-700/60 text-amber-300"
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="archived">Archived</option>
                      </select>

                      <button
                        onClick={() => handleDeleteItem(adminTab, item.id)}
                        title="Delete submission"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Submission Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block">Email:</span>
                      <a href={`mailto:${item.email}`} className="text-sky-400 hover:underline">
                        {item.email}
                      </a>
                    </div>
                    {item.phone && (
                      <div>
                        <span className="text-slate-400 block">Phone:</span>
                        <span className="text-white">{item.phone}</span>
                      </div>
                    )}
                    {item.cityCountry && (
                      <div>
                        <span className="text-slate-400 block">Location:</span>
                        <span className="text-white">{item.cityCountry}</span>
                      </div>
                    )}
                    {item.desiredRole && (
                      <div>
                        <span className="text-slate-400 block">Desired Role:</span>
                        <span className="text-white font-semibold">{item.desiredRole}</span>
                      </div>
                    )}
                    {item.skills && (
                      <div className="sm:col-span-2">
                        <span className="text-slate-400 block">Skills:</span>
                        <span className="text-slate-300">{item.skills}</span>
                      </div>
                    )}
                    {item.projectTitle && (
                      <div>
                        <span className="text-slate-400 block">Project Title:</span>
                        <span className="text-white font-semibold">{item.projectTitle}</span>
                      </div>
                    )}
                    {item.organization && (
                      <div>
                        <span className="text-slate-400 block">Organization / Role:</span>
                        <span className="text-white">{item.organization} ({item.role})</span>
                      </div>
                    )}
                    {item.portfolioUrl && (
                      <div className="sm:col-span-2">
                        <span className="text-slate-400 block">Portfolio / Links:</span>
                        <a
                          href={item.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sky-400 hover:underline inline-flex items-center gap-1"
                        >
                          <span>{item.portfolioUrl}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Message / Statement Body */}
                  <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {item.message || item.description}
                  </div>

                  {/* Private Admin Notes */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Private Notes:</span>
                      <span className="text-slate-300 italic">
                        {item.adminNotes ? item.adminNotes : "No private note added yet."}
                      </span>
                    </div>
                    <button
                      onClick={() =>
                        setEditingNoteItem({
                          id: item.id,
                          type: adminTab,
                          note: item.adminNotes || "",
                        })
                      }
                      className="text-sky-400 hover:text-sky-300 font-semibold"
                    >
                      {item.adminNotes ? "Edit Note" : "+ Add Note"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 6: PROJECT CMS (Edit Synopses, Trailers, Status, Images)
          ===================================================================== */}
      {adminTab === "projects" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-cinzel text-xl font-bold text-white">
              Project Lore & Trailer Management
            </h3>
            {projectSaveMsg && (
              <span className="text-xs text-emerald-400 font-mono">
                {projectSaveMsg}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-6 rounded-2xl bg-[#090C12] border border-slate-800 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-sky-400">{proj.category}</span>
                  <span className="text-xs font-mono text-slate-400">{proj.statusBadge}</span>
                </div>

                <h4 className="font-cinzel text-xl font-bold text-white">{proj.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{proj.oneLiner}</p>

                <div className="text-xs space-y-1 font-mono text-slate-400 pt-2 border-t border-slate-800">
                  <div>Trailer Link: <span className="text-slate-300">{proj.trailerUrl ? "Active" : "Coming Soon"}</span></div>
                  <div>Status: <span className="text-white">{proj.status}</span></div>
                </div>

                <button
                  onClick={() => setEditingProject({ ...proj })}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-white transition-colors"
                >
                  Edit Project Details
                </button>
              </div>
            ))}
          </div>

          {/* Project Edit Modal */}
          {editingProject && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#090C12] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="font-cinzel text-xl font-bold text-white">
                    Edit: {editingProject.title}
                  </h3>
                  <button
                    onClick={() => setEditingProject(null)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>

                <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Project Title</label>
                    <input
                      type="text"
                      value={editingProject.title}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, title: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">One-Line Hook</label>
                    <input
                      type="text"
                      value={editingProject.oneLiner}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, oneLiner: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Development Status</label>
                    <input
                      type="text"
                      value={editingProject.status}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, status: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">
                      Trailer URL (YouTube / Vimeo Embed URL)
                    </label>
                    <input
                      type="url"
                      value={editingProject.trailerUrl || ""}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, trailerUrl: e.target.value })
                      }
                      placeholder="Leave empty for 'Coming Soon' panel"
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Concept Artwork Path</label>
                    <input
                      type="text"
                      value={editingProject.heroImage}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, heroImage: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-medium">Synopsis & Overview</label>
                    <textarea
                      rows={5}
                      value={editingProject.overview}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, overview: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-white resize-y"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setEditingProject(null)}
                      className="px-4 py-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 7: SITE & APPLICATION WINDOW SETTINGS
          ===================================================================== */}
      {adminTab === "settings" && (
        <form
          onSubmit={handleSaveSettings}
          className="p-8 sm:p-10 rounded-3xl bg-[#090C12] border border-slate-800 space-y-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-cinzel text-xl font-bold text-white">
                Website, Social URLs & Application Window Settings
              </h3>
              <p className="text-xs text-slate-400">
                Any modifications made here write immediately to server-side persistence.
              </p>
            </div>
            {settingsSaveMsg && (
              <span className="text-xs font-mono text-emerald-400">
                {settingsSaveMsg}
              </span>
            )}
          </div>

          {/* Application Window Configuration */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase text-sky-400 font-semibold tracking-wider">
              Careers Application Window Dates
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Window Start Date (YYYY-MM-DD)
                </label>
                <input
                  type="date"
                  value={settingsForm.startDate}
                  onChange={(e) => setSettingsForm({ ...settingsForm, startDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Window End Date (YYYY-MM-DD)
                </label>
                <input
                  type="date"
                  value={settingsForm.endDate}
                  onChange={(e) => setSettingsForm({ ...settingsForm, endDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Announcement Title
                </label>
                <input
                  type="text"
                  value={settingsForm.announcementTitle}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, announcementTitle: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-medium text-slate-300">
                  Announcement Details
                </label>
                <textarea
                  rows={2}
                  value={settingsForm.announcementText}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, announcementText: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Social Links Configuration */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-mono uppercase text-sky-400 font-semibold tracking-wider">
              Social Media Channels & Official Email
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Official Email</label>
                <input
                  type="text"
                  value={settingsForm.officialEmail}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, officialEmail: e.target.value })
                  }
                  placeholder="contact@pbworld.studio"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">YouTube Channel URL</label>
                <input
                  type="text"
                  value={settingsForm.youtube}
                  onChange={(e) => setSettingsForm({ ...settingsForm, youtube: e.target.value })}
                  placeholder="https://youtube.com/@pbworld"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">LinkedIn URL</label>
                <input
                  type="text"
                  value={settingsForm.linkedin}
                  onChange={(e) => setSettingsForm({ ...settingsForm, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/company/pbworld"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">X / Twitter URL</label>
                <input
                  type="text"
                  value={settingsForm.x}
                  onChange={(e) => setSettingsForm({ ...settingsForm, x: e.target.value })}
                  placeholder="https://x.com/pbworld"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Instagram URL</label>
                <input
                  type="text"
                  value={settingsForm.instagram}
                  onChange={(e) => setSettingsForm({ ...settingsForm, instagram: e.target.value })}
                  placeholder="https://instagram.com/pbworld"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Threads URL</label>
                <input
                  type="text"
                  value={settingsForm.threads}
                  onChange={(e) => setSettingsForm({ ...settingsForm, threads: e.target.value })}
                  placeholder="https://threads.net/@pbworld"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-xs font-semibold hover:from-sky-500 hover:to-indigo-500 transition-all active:scale-95"
            >
              Save Studio Settings
            </button>
          </div>
        </form>
      )}

      {/* =====================================================================
          TAB 8: GEMINI AI STUDIO SUITE (Gemini 4 Argon, Nano Banana 2.1, 1K/2K/4K)
          ===================================================================== */}
      {adminTab === "ai_studio" && (
        <div className="p-8 sm:p-10 rounded-3xl bg-[#090C12] border border-slate-800 space-y-8">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-sky-400">
              <Sparkles className="w-4 h-4" />
              <span>Google Gemini AI Intelligence Suite</span>
            </div>
            <h3 className="font-cinzel text-2xl font-bold text-white">
              Studio Concept Synthesis & Art Generation
            </h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Utilize Gemini 4 Argon with High Thinking for narrative reasoning or generate 1K/2K/4K concept art via Gemini 3 Pro Image.
            </p>
          </div>

          {aiError && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{aiError}</span>
            </div>
          )}

          <div className="space-y-4">
            <label className="text-xs font-medium text-slate-300">
              Prompt / Concept Description
            </label>
            <textarea
              rows={4}
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g., A soaring aerial shot of an ancient floating fortress in Aethergard surrounded by storm clouds and lightning..."
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-y"
            />

            {/* Resolution and Aspect Ratio Controls */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Resolution:</span>
                {(["1K", "2K", "4K"] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setAiImageSize(sz)}
                    className={`px-3 py-1 rounded-lg border ${
                      aiImageSize === sz
                        ? "bg-sky-500/20 border-sky-500 text-sky-300 font-bold"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">Aspect:</span>
                {["16:9", "4:3", "1:1"].map((asp) => (
                  <button
                    key={asp}
                    type="button"
                    onClick={() => setAiAspectRatio(asp)}
                    className={`px-3 py-1 rounded-lg border ${
                      aiAspectRatio === asp
                        ? "bg-indigo-500/20 border-indigo-500 text-indigo-300 font-bold"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {asp}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={handleGenerateArt}
                disabled={isAiProcessing || !aiPrompt.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-xs font-semibold flex items-center gap-2 hover:from-sky-500 hover:to-indigo-500 transition-all active:scale-95 disabled:opacity-50"
              >
                <ImageIcon className="w-4 h-4" />
                <span>{isAiProcessing ? "Generating..." : `Generate ${aiImageSize} Concept Art`}</span>
              </button>

              <button
                type="button"
                onClick={handleDeepScriptAnalysis}
                disabled={isAiProcessing || !aiPrompt.trim()}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors active:scale-95 disabled:opacity-50"
              >
                <Brain className="w-4 h-4 text-purple-400" />
                <span>Deep Script Analysis (Gemini 4 Argon Thinking)</span>
              </button>
            </div>
          </div>

          {/* AI Output Section */}
          {aiGeneratedImage && (
            <div className="space-y-2 pt-6 border-t border-slate-800">
              <span className="text-xs font-mono text-sky-400">Generated Visual Artwork ({aiImageSize}):</span>
              <div className="rounded-2xl overflow-hidden border border-slate-700 max-w-2xl bg-black">
                <img
                  src={aiGeneratedImage}
                  alt="AI Concept Art"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          )}

          {aiAnalysisResult && (
            <div className="space-y-2 pt-6 border-t border-slate-800">
              <span className="text-xs font-mono text-purple-400">
                Gemini 4 Argon High-Thinking Analysis:
              </span>
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {aiAnalysisResult}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Private Note Modal */}
      {editingNoteItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#090C12] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4">
            <h3 className="font-cinzel text-lg font-bold text-white">
              Private Administrator Note
            </h3>
            <p className="text-xs text-slate-400">
              Notes are stored privately in the studio database and never displayed publicly.
            </p>
            <textarea
              rows={4}
              value={editingNoteItem.note}
              onChange={(e) =>
                setEditingNoteItem({ ...editingNoteItem, note: e.target.value })
              }
              placeholder="e.g., Interview conducted on Oct 26; recommended for Phase 2 gameplay prototype..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-y"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEditingNoteItem(null)}
                className="px-4 py-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs"
              >
                Save Private Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
