import React, { useState, useEffect } from "react";
import { Navbar, PageId } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ServicesPage } from "./pages/ServicesPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { CareersPage } from "./pages/CareersPage";
import { ContactPage } from "./pages/ContactPage";
import { AdminPortal } from "./components/AdminPortal";
import { INITIAL_PROJECTS, SERVICES_CATALOG, ProjectDetail } from "./config/projectsData";
import { SITE_CONFIG } from "./config/siteConfig";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>("home");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [projects, setProjects] = useState<ProjectDetail[]>(INITIAL_PROJECTS);
  const [applicationWindow, setApplicationWindow] = useState(SITE_CONFIG.applicationWindow);
  const [authToken, setAuthToken] = useState<string | null>(() => {
    return localStorage.getItem("pb_admin_token") || null;
  });

  // Load canonical projects and dynamic settings from backend
  const loadData = async () => {
    try {
      const [projRes, setRes] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/settings"),
      ]);

      if (projRes.ok) {
        const pData = await projRes.json();
        if (pData.projects && pData.projects.length > 0) {
          setProjects(pData.projects);
        }
      }

      if (setRes.ok) {
        const sData = await setRes.json();
        if (sData.settings?.applicationWindow) {
          setApplicationWindow(sData.settings.applicationWindow);
        }
      }
    } catch (err) {
      console.warn("Backend API not reachable yet, using static initial catalog:", err);
    }
  };

  useEffect(() => {
    loadData();

    // Check URL hash for direct links (e.g., #careers, #projects, #admin)
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "").trim();
      if (!hash) {
        setCurrentPage("home");
        setSelectedProjectId(null);
        return;
      }

      if (hash.startsWith("project/")) {
        const pSlug = hash.replace("project/", "");
        const matched = projects.find((p) => p.slug === pSlug || p.id === pSlug);
        setCurrentPage("projects");
        if (matched) setSelectedProjectId(matched.id);
      } else if (
        ["home", "about", "projects", "services", "careers", "contact", "admin"].includes(hash)
      ) {
        setCurrentPage(hash as PageId);
        if (hash !== "projects") setSelectedProjectId(null);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleNavigate = (page: PageId, projectId?: string) => {
    setCurrentPage(page);
    if (projectId) {
      setSelectedProjectId(projectId);
      window.location.hash = `#project/${projectId}`;
    } else {
      setSelectedProjectId(null);
      window.location.hash = `#${page}`;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectProject = (projectId: string | null) => {
    setSelectedProjectId(projectId);
    setCurrentPage("projects");
    if (projectId) {
      window.location.hash = `#project/${projectId}`;
    } else {
      window.location.hash = "#projects";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLoginSuccess = (token: string) => {
    setAuthToken(token);
    localStorage.setItem("pb_admin_token", token);
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem("pb_admin_token");
    setCurrentPage("home");
    window.location.hash = "#home";
  };

  return (
    <div className="min-h-screen bg-[#07090D] text-[#E2E8F0] flex flex-col font-sans selection:bg-sky-500/20 selection:text-white">
      {/* Universal Top Navigation conforming to Top Bar Contract */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isAdminLoggedIn={Boolean(authToken)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === "home" && (
          <HomePage
            projects={projects}
            services={SERVICES_CATALOG}
            onNavigate={handleNavigate}
            onSelectProject={handleSelectProject}
          />
        )}

        {currentPage === "about" && <AboutPage onNavigate={handleNavigate} />}

        {currentPage === "services" && (
          <ServicesPage services={SERVICES_CATALOG} onNavigate={handleNavigate} />
        )}

        {currentPage === "projects" && (
          <ProjectsPage
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={handleSelectProject}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === "careers" && (
          <CareersPage applicationWindow={applicationWindow} />
        )}

        {currentPage === "contact" && <ContactPage />}

        {currentPage === "admin" && (
          <AdminPortal
            projects={projects}
            onProjectsUpdated={loadData}
            onSettingsUpdated={loadData}
            authToken={authToken}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Universal Quiet Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
