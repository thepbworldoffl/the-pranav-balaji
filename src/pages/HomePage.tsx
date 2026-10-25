import React from "react";
import { SITE_CONFIG } from "../config/siteConfig";
import { ProjectDetail, ServiceDetail } from "../config/projectsData";
import { ProjectCard } from "../components/ProjectCard";
import { PageId } from "../components/Navbar";
import {
  Compass,
  ArrowRight,
  Sparkles,
  Layers,
  Cpu,
  Clapperboard,
  Gamepad2,
  Code2,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

interface HomePageProps {
  projects: ProjectDetail[];
  services: ServiceDetail[];
  onNavigate: (page: PageId, projectId?: string) => void;
  onSelectProject: (projectId: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  projects,
  services,
  onNavigate,
  onSelectProject,
}) => {
  // Aetherfall is 1st, then Animation Movies
  const featuredProjects = [...projects].sort((a, b) => a.order - b.order).slice(0, 4);

  const serviceIcons: Record<string, React.ReactNode> = {
    "serv_game_dev": <Gamepad2 className="w-5 h-5 text-sky-400" />,
    "serv_animation_film": <Clapperboard className="w-5 h-5 text-indigo-400" />,
    "serv_vfx": <Sparkles className="w-5 h-5 text-purple-400" />,
    "serv_app_dev": <Code2 className="w-5 h-5 text-emerald-400" />,
  };

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      {/* =====================================================================
          1. CINEMATIC HERO SECTION
          ===================================================================== */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background Atmosphere Image with Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/pb_hero_cinematic_1792945952387.jpg"
            alt="PB World Studio Atmosphere"
            className="w-full h-full object-cover opacity-30 scale-105 filter brightness-75"
            referrerPolicy="no-referrer"
          />
          {/* Multi-layered dark vignette scrim */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#07090D]/80 via-[#07090D]/60 to-[#07090D]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#07090D_90%)]" />
        </div>

        {/* Hero Foreground Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 py-16">
          {/* Logo & Brand Kicker */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-700/60 shadow-xl backdrop-blur-md">
            <img
              src={SITE_CONFIG.logoPath}
              alt="PB Logo Monogram"
              className="w-6 h-6 object-contain"
              referrerPolicy="no-referrer"
            />
            <span className="text-xs font-mono uppercase tracking-widest text-slate-300">
              Creative Technology & Worldbuilding Studio
            </span>
          </div>

          {/* Primary Cinematic Headline */}
          <div className="space-y-4">
            <h1 className="font-cinzel text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white text-balance leading-none">
              Building Worlds. <br />
              <span className="bg-gradient-to-r from-white via-slate-200 to-sky-300 bg-clip-text text-transparent">
                Creating Stories.
              </span>
            </h1>
            <p className="font-cinzel text-xl sm:text-2xl text-sky-400 font-medium tracking-wide">
              Developing Possibilities.
            </p>
          </div>

          {/* Honest Studio Introduction */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            PB World is an ambitious creative technology venture dedicated to original
            fantasy game concepts, animated cinematic stories, advanced visual effects,
            and high-performance digital software.
          </p>

          {/* Dual Primary Call-to-Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate("projects")}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-sm font-semibold tracking-wide shadow-lg shadow-sky-950/60 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
            >
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate("contact")}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 text-sm font-semibold tracking-wide transition-all active:scale-[0.98]"
            >
              Contact PB World
            </button>
          </div>

          {/* Honest Pre-Production Anchor Bar */}
          <div className="pt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-slate-400 font-mono">
            <span>· Unreal Engine 5 Pipeline</span>
            <span>· Stylized 3D & 2.5D Film Previs</span>
            <span>· Procedural Simulation Systems</span>
            <span>· Dedicated Full-Stack Tooling</span>
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. STUDIO PHILOSOPHY & VISION
          ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#090C12] border border-slate-800/80 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs uppercase font-mono tracking-widest text-sky-400">
                01. Studio Vision
              </span>
              <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white text-balance leading-snug">
                The Confluence of Narrative and Systemic Craft
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed border-t lg:border-t-0 lg:border-l border-slate-800 lg:pl-8 pt-6 lg:pt-0">
              <p>
                PB World was conceived with a deliberate ambition: to build rich, original
                intellectual properties where world lore, aesthetic majesty, and computational
                engineering reinforce one another.
              </p>
              <p className="text-slate-400 text-sm">
                Rather than treating games, cinema, and software as isolated disciplines, we treat
                them as connected expressions of worldbuilding. Every environment, combat rule,
                and screenplay beat is crafted with long-term narrative coherence.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate("about")}
                  className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 group"
                >
                  <span>Learn more about our methodology</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. FOUR CORE CAPABILITIES (SERVICES)
          ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs uppercase font-mono tracking-widest text-sky-400">
              02. Studio Capabilities
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white">
              Disciplines of Creation
            </h2>
          </div>
          <button
            onClick={() => onNavigate("services")}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 self-start md:self-auto group"
          >
            <span>View Full Service Specs</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((serv) => (
            <div
              key={serv.id}
              onClick={() => onNavigate("services")}
              className="p-6 rounded-2xl bg-[#090C12] border border-slate-800 hover:border-slate-700 transition-all duration-300 cursor-pointer group flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-slate-700 transition-colors">
                    {serviceIcons[serv.id] || <Layers className="w-5 h-5 text-sky-400" />}
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {serv.orderNumber}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] font-mono uppercase text-sky-400/90 tracking-wider">
                    {serv.categoryTag}
                  </span>
                  <h3 className="font-cinzel text-lg font-bold text-white group-hover:text-sky-400 transition-colors">
                    {serv.title}
                  </h3>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {serv.tagline}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-900/80 flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-sky-400 transition-colors">
                <span>Explore Discipline</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          4. FEATURED PROJECTS (GAMES FIRST, ANIMATION SECOND)
          ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs uppercase font-mono tracking-widest text-sky-400">
              03. Original Intellectual Properties
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white">
              Featured Concepts in Development
            </h2>
          </div>
          <button
            onClick={() => onNavigate("projects")}
            className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 self-start md:self-auto group"
          >
            <span>All Projects Directory</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Featured Projects Grid: Aetherfall is in 1st spot, followed by Animation films */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={onSelectProject}
            />
          ))}
        </div>
      </section>

      {/* =====================================================================
          5. COMPANY STORY & PRODUCTION ETHOS
          ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-[#090C12] via-[#0A0D15] to-[#0D111A] border border-slate-800 space-y-8">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs uppercase font-mono tracking-widest text-sky-400">
              04. The PB World Story
            </span>
            <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white leading-snug">
              Constructed From The Ground Up
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-slate-800/80">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white">Pre-Production Discipline</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Before writing millions of lines of code or commencing asset crunch, we rigorously
                flesh out story bibles, biome ecosystems, combat state machines, and narrative arcs.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white">Transparent Progress</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                We speak honestly about our milestones. We do not make false claims regarding company
                size, phantom investors, or release guarantees. We let our creative depth speak.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white">Zero-Compromise Technology</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Leveraging Unreal Engine 5, procedural Houdini pipelines, and modern full-stack web
                frameworks to build resilient systems for both internal tools and global audiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          6. COLLABORATION CALL-TO-ACTION STRIP
          ===================================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-sky-950/40 via-indigo-950/30 to-purple-950/40 border border-sky-800/30 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
              Ready to Shape Worlds With Us?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Whether you are an aspiring artist, gameplay programmer, creative studio,
              or prospective partner, we welcome meaningful connections.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate("careers")}
              className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs font-semibold text-white transition-colors"
            >
              Careers & Talent
            </button>
            <button
              onClick={() => onNavigate("contact")}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-md transition-all active:scale-95"
            >
              Start a Conversation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
