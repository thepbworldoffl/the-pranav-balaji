import React from "react";
import { SITE_CONFIG } from "../config/siteConfig";
import { PageId } from "../components/Navbar";
import {
  Compass,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Cpu,
  ArrowRight,
} from "lucide-react";

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-20">
      {/* Header Statement */}
      <section className="space-y-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-sky-400 font-mono">
          <span>Creative Technology & Systems</span>
        </div>
        <h1 className="font-cinzel text-4xl sm:text-6xl font-bold text-white text-balance tracking-tight">
          Crafting The Architectures of Wonder
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
          PB World is an ambitious creative technology venture working purposefully toward
          original games, animated filmmaking, visual effects, and bespoke applications.
        </p>
      </section>

      {/* Honest Reality & Ambition Statement */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#090C12] border border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs uppercase font-mono tracking-widest text-sky-400">
              Identity & Integrity
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
              An Independent Venture in Pure Creative Motion
            </h2>
          </div>
          <div className="lg:col-span-7 space-y-4 text-slate-300 text-sm leading-relaxed border-t lg:border-t-0 lg:border-l border-slate-800 lg:pl-8 pt-6 lg:pt-0">
            <p>
              PB World makes no false claims. We are an ambitious, early-stage creative technology
              enterprise in the active concept and pre-production stages. We do not pretend to possess
              hundreds of employees or millions in venture capital. Instead, we invest our relentless
              energy into original IP codices, worldbuilding depth, mechanics design, and production pipelines.
            </p>
            <p className="text-slate-400">
              Our long-term journey begins with foundational rigor: constructing deep mythologies,
              testing prototypes, designing resilient technical tools, and cultivating honest relationships
              with passionate creators and collaborators worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-mono tracking-widest text-sky-400">
            Guiding Tenets
          </span>
          <h2 className="font-cinzel text-3xl font-bold text-white">
            The Pillars of PB World
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-[#090C12] border border-slate-800 space-y-4">
            <div className="p-3 w-fit rounded-xl bg-slate-900 border border-slate-800 text-sky-400">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-cinzel text-xl font-bold text-white">
              Narrative Coherence
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every story, level, and character we develop must belong to a living world.
              Lore is not an afterthought; it dictates combat weight, architecture, and creature ecology.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#090C12] border border-slate-800 space-y-4">
            <div className="p-3 w-fit rounded-xl bg-slate-900 border border-slate-800 text-indigo-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-cinzel text-xl font-bold text-white">
              Systemic Scalability
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We design game systems, rendering workflows, and software tools to scale
              transparently across high-end PCs, virtual production volumes, and mobile platforms.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[#090C12] border border-slate-800 space-y-4">
            <div className="p-3 w-fit rounded-xl bg-slate-900 border border-slate-800 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-cinzel text-xl font-bold text-white">
              Truth in Execution
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We respect our community. Target dates are clearly designated as targets;
              pre-production features are described as conceptual intentions rather than shipping claims.
            </p>
          </div>
        </div>
      </section>

      {/* Production Pipeline Stack */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#090C12] border border-slate-800 space-y-8">
        <div className="space-y-2">
          <span className="text-xs uppercase font-mono tracking-widest text-sky-400">
            Pipeline & Tooling
          </span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-white">
            Modern Technical Stack
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Selected for high-fidelity worldbuilding, physical simulation accuracy, and robust engineering.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-sky-400 font-semibold block">Game Engines</span>
            <span className="text-slate-300">Unreal Engine 5 & C++</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-indigo-400 font-semibold block">VFX & Sim</span>
            <span className="text-slate-300">SideFX Houdini & Nuke</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-purple-400 font-semibold block">Modeling & 3D</span>
            <span className="text-slate-300">Blender, ZBrush & Maya</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <span className="text-emerald-400 font-semibold block">Application Stack</span>
            <span className="text-slate-300">TypeScript, React, Node.js</span>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="text-center p-10 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-4">
        <h3 className="font-cinzel text-2xl font-bold text-white">
          Join Us On The Frontier
        </h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          We are assembling foundational creators, technical artists, and strategic allies.
        </p>
        <div className="pt-2 flex justify-center gap-4">
          <button
            onClick={() => onNavigate("careers")}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-xs font-semibold hover:from-sky-500 hover:to-indigo-500 transition-all active:scale-95"
          >
            Review Career Roles
          </button>
          <button
            onClick={() => onNavigate("contact")}
            className="px-6 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            Direct Inquiry
          </button>
        </div>
      </section>
    </div>
  );
};
