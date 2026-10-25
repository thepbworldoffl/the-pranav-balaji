import React, { useState } from "react";
import { ProjectDetail, ProjectCategory } from "../config/projectsData";
import { ProjectCard } from "../components/ProjectCard";
import { TrailerSection } from "../components/TrailerSection";
import { PageId } from "../components/Navbar";
import {
  ArrowLeft,
  Sparkles,
  Layers,
  Clock,
  Compass,
  Sword,
  Bot,
  Brain,
  CheckCircle2,
  Share2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface ProjectsPageProps {
  projects: ProjectDetail[];
  selectedProjectId: string | null;
  onSelectProject: (projectId: string | null) => void;
  onNavigate: (page: PageId) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  onNavigate,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Filters ordered as requested: Games in first position, Animation & Film in second
  const filterCategories = ["All", "Games", "Animation & Film", "VFX", "Apps"];

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === "All") return true;
    return p.category === activeFilter;
  });

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  // Handle Gemini Concept Analysis via backend API
  const handleAnalyzeConcept = async (proj: ProjectDetail) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    setAiAnalysis(null);

    try {
      const res = await fetch("/api/gemini/analyze-concept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: proj.title,
          genre: proj.genre,
          synopsis: proj.overview,
          focusArea: "Comprehensive Narrative & Mechanics Feasibility",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Analysis failed.");
      }
      setAiAnalysis(data.analysis);
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : "Error analyzing concept with Gemini.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // If a project is selected, render its dedicated Project Detail Page
  if (selectedProject) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-24 space-y-12">
        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              onSelectProject(null);
              setAiAnalysis(null);
            }}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors py-2 px-3 rounded-lg bg-slate-900 border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects Directory</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>{selectedProject.category}</span>
            <span>/</span>
            <span className="text-white">{selectedProject.title}</span>
          </div>
        </div>

        {/* Project Header & Hero Artwork */}
        <section className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-xs font-mono text-sky-400">
                {selectedProject.status}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {selectedProject.genre}
              </span>
            </div>

            <h1 className="font-cinzel text-4xl sm:text-6xl font-bold text-white tracking-tight">
              {selectedProject.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-medium max-w-3xl leading-relaxed">
              {selectedProject.oneLiner}
            </p>
          </div>

          {/* Hero Concept Art Area */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
            <img
              src={selectedProject.heroImage}
              alt={`${selectedProject.title} Concept Visual`}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07090D] via-transparent to-transparent opacity-70" />
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-xs font-mono text-slate-400 bg-black/60 px-3 py-1.5 rounded-lg border border-slate-800">
              Concept Artwork · PB World Creative Pre-Production
            </div>
          </div>
        </section>

        {/* Cinematic Trailer Section (for Aetherfall or projects with target dates) */}
        {selectedProject.id === "proj_aetherfall" && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-cinzel text-2xl font-bold text-white flex items-center gap-2">
                <span>Cinematic Trailer & Teaser</span>
              </h2>
              <span className="text-xs font-mono text-sky-400">
                Target: 25 December 2026 (Planned Target)
              </span>
            </div>
            <TrailerSection
              projectTitle={selectedProject.title}
              targetDate={selectedProject.targetDate}
              trailerUrl={selectedProject.trailerUrl}
              heroImage={selectedProject.heroImage}
            />
          </section>
        )}

        {/* Detailed Overview */}
        <section className="p-8 sm:p-10 rounded-2xl bg-[#090C12] border border-slate-800 space-y-4">
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
            Concept Synopsis & Overview
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {selectedProject.overview}
          </p>
          {selectedProject.disclaimer && (
            <p className="text-xs text-slate-400 font-mono italic pt-2 border-t border-slate-800/80">
              Note: {selectedProject.disclaimer}
            </p>
          )}
        </section>

        {/* Deep Dive Pillars (World, Combat, Creatures, Progression, Multiplayer, Roadmap for Aetherfall; Narrative & Visuals for Films) */}
        {selectedProject.deepDiveSections && selectedProject.deepDiveSections.length > 0 && (
          <section className="space-y-6">
            <h2 className="font-cinzel text-2xl font-bold text-white">
              Creative Architecture & Deep-Dive
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {selectedProject.deepDiveSections.map((sec, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-[#090C12] border border-slate-800 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <h3 className="font-cinzel text-lg font-bold text-sky-300">
                      {sec.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {sec.description}
                    </p>
                  </div>

                  {sec.points && sec.points.length > 0 && (
                    <ul className="space-y-1.5 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                      {sec.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2">
                          <span className="text-sky-500 font-bold">›</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Specifications Matrix */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#090C12] border border-slate-800 space-y-4">
          <h3 className="font-cinzel text-lg font-bold text-white">
            Project Specifications & Platform Ambition
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedProject.specifications.map((spec, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1"
              >
                <span className="text-[11px] font-mono uppercase text-slate-400 block">
                  {spec.label}
                </span>
                <span className="text-xs font-semibold text-white">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* AI Studio Concept Intelligence Assistant */}
        <section className="p-8 rounded-2xl bg-gradient-to-br from-slate-950 via-[#0A0E18] to-indigo-950/40 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-mono uppercase text-sky-400 tracking-wider">
                  AI Concept Intelligence
                </span>
              </div>
              <h3 className="font-cinzel text-xl font-bold text-white">
                Studio Creative Feasibility Review
              </h3>
              <p className="text-xs text-slate-400 max-w-xl">
                Run server-side evaluation of world lore, technical bottlenecks, and narrative arc powered by Gemini 4 Argon with High Thinking.
              </p>
            </div>

            <button
              onClick={() => handleAnalyzeConcept(selectedProject)}
              disabled={isAnalyzing}
              className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50 shrink-0"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Analyzing with High Thinking...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Concept</span>
                </>
              )}
            </button>
          </div>

          {/* Analysis Error State */}
          {analysisError && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{analysisError}</span>
            </div>
          )}

          {/* Analysis Output Box */}
          {aiAnalysis && (
            <div className="p-6 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono text-sky-300 font-semibold">
                  Gemini 4 Argon Evaluation Summary
                </span>
                <span className="text-[10px] font-mono text-slate-500">
                  ThinkingLevel.HIGH
                </span>
              </div>
              <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-sans">
                {aiAnalysis}
              </div>
            </div>
          )}
        </section>

        {/* Project Inquiries CTA */}
        <div className="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-cinzel text-lg font-bold text-white">
              Interested in Collaborating on {selectedProject.title}?
            </h4>
            <p className="text-xs text-slate-400">
              Submit a project proposal or connect with the development team.
            </p>
          </div>
          <button
            onClick={() => onNavigate("contact")}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95 shrink-0"
          >
            Submit Collaboration Proposal
          </button>
        </div>
      </div>
    );
  }

  // Otherwise, render the Projects Directory with Category Filters
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-16">
      {/* Directory Header */}
      <section className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-sky-400 font-mono">
          <span>Original Concepts & IP</span>
        </div>
        <h1 className="font-cinzel text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Studio Projects Directory
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Explore PB World's original 3D fantasy games, animated film stories, and technical prototypes.
          All projects are in active pre-production or conceptual development.
        </p>
      </section>

      {/* Interactive Category Filter Tabs (Games 1st, Animation & Film 2nd) */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 w-fit">
        {filterCategories.map((cat) => {
          const isActive = activeFilter === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? "bg-slate-800 text-white shadow-md shadow-black/40 border border-slate-700"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Showing {filteredProjects.length} Concept(s)</span>
          <span>Category: {activeFilter}</span>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onSelect={(id) => onSelectProject(id)}
              />
            ))}
          </div>
        ) : (
          <div className="p-16 rounded-3xl bg-[#090C12] border border-slate-800 text-center space-y-3">
            <Layers className="w-8 h-8 text-slate-600 mx-auto" />
            <h4 className="font-cinzel text-lg font-bold text-white">No concepts in this category yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Our VFX and application toolkits are being integrated. Check out our Games and Animation projects!
            </p>
            <button
              onClick={() => setActiveFilter("All")}
              className="mt-2 px-4 py-2 rounded-lg bg-slate-900 text-xs font-semibold text-sky-400 hover:text-white border border-slate-800"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
