import React, { useState } from "react";
import { ServiceDetail } from "../config/projectsData";
import { PageId } from "../components/Navbar";
import {
  Gamepad2,
  Clapperboard,
  Sparkles,
  Code2,
  CheckCircle,
  ArrowRight,
  Terminal,
  Layers,
  Wrench,
} from "lucide-react";

interface ServicesPageProps {
  services: ServiceDetail[];
  onNavigate: (page: PageId) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ services, onNavigate }) => {
  const [selectedServiceId, setSelectedServiceId] = useState<string>(services[0]?.id || "serv_game_dev");

  const serviceIcons: Record<string, React.ReactNode> = {
    "serv_game_dev": <Gamepad2 className="w-5 h-5 text-sky-400" />,
    "serv_animation_film": <Clapperboard className="w-5 h-5 text-indigo-400" />,
    "serv_vfx": <Sparkles className="w-5 h-5 text-purple-400" />,
    "serv_app_dev": <Code2 className="w-5 h-5 text-emerald-400" />,
  };

  const currentService = services.find((s) => s.id === selectedServiceId) || services[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-16">
      {/* Services Header */}
      <section className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-sky-400 font-mono">
          <span>Disciplines of Execution</span>
        </div>
        <h1 className="font-cinzel text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Creative Capabilities & Engineering
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Four interconnected disciplines united by worldbuilding excellence, precision software,
          and cinematic visual fidelity.
        </p>
      </section>

      {/* Interactive Discipline Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 w-fit">
        {services.map((serv) => {
          const isActive = serv.id === selectedServiceId;
          return (
            <button
              key={serv.id}
              onClick={() => setSelectedServiceId(serv.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? "bg-slate-800 text-white shadow-md shadow-black/40 border border-slate-700"
                  : "text-slate-400 hover:text-white hover:bg-slate-900/60"
              }`}
            >
              {serviceIcons[serv.id]}
              <span>{serv.title}</span>
            </button>
          );
        })}
      </div>

      {/* Featured Service Deep Dive Box */}
      {currentService && (
        <section className="p-8 sm:p-12 rounded-3xl bg-[#090C12] border border-slate-800 space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/80 pb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-400">{currentService.orderNumber}</span>
                <span className="text-xs font-mono uppercase text-sky-400 tracking-wider">
                  {currentService.categoryTag}
                </span>
              </div>
              <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-white">
                {currentService.title}
              </h2>
              <p className="text-sm text-sky-200/80 font-medium">
                {currentService.tagline}
              </p>
            </div>

            <button
              onClick={() => onNavigate("contact")}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95 shrink-0"
            >
              Enquire for this Service
            </button>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Discipline Overview
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
              {currentService.description}
            </p>
          </div>

          {/* Technical Capabilities Grid */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-sky-400" />
              <span>Technical Capabilities & Focus Areas</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentService.technicalCapabilities.map((cap, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3"
                >
                  <CheckCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-300 leading-relaxed">{cap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline Tools & Delivery Phases */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-800/80">
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Wrench className="w-3.5 h-3.5 text-indigo-400" />
                <span>Primary Toolchain</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentService.pipelineTools.map((tool, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Production Phases</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {currentService.deliveryPhases.map((phase, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300"
                  >
                    {phase}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Grid of All 4 Services for Quick Reference */}
      <section className="space-y-6">
        <h3 className="font-cinzel text-2xl font-bold text-white">
          All Service Disciplines
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((serv) => (
            <div
              key={serv.id}
              onClick={() => setSelectedServiceId(serv.id)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                serv.id === selectedServiceId
                  ? "bg-slate-900/90 border-sky-500/60 shadow-lg"
                  : "bg-[#090C12] border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="space-y-3">
                <span className="text-xs font-mono text-slate-400">{serv.orderNumber}</span>
                <h4 className="font-cinzel text-lg font-bold text-white">{serv.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {serv.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
