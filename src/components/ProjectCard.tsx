import React, { useState } from "react";
import { ProjectDetail } from "../config/projectsData";
import { ArrowRight, ImageOff } from "lucide-react";

interface ProjectCardProps {
  project: ProjectDetail;
  onSelect: (projectId: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <article
      onClick={() => onSelect(project.id)}
      className="group cursor-pointer rounded-2xl overflow-hidden bg-[#0A0D14] border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-black/50"
    >
      <div>
        {/* Media Container with 16:9 Aspect Ratio */}
        <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
          {!imageError ? (
            <img
              src={project.heroImage}
              alt={`${project.title} Concept Artwork`}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-slate-500 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950">
              <ImageOff className="w-8 h-8 mb-2 opacity-50" />
              <span className="text-xs font-mono">{project.title} Concept Visual</span>
            </div>
          )}

          {/* Measured gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14] via-transparent to-transparent opacity-80" />

          {/* Clean Unboxed Status Indicator in Corner (No candy badge) */}
          <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono text-slate-300 border border-slate-700/60">
            {project.statusBadge}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-3">
          {/* Metadata Row: Clean Unboxed Text with Separators */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>{project.category}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-sky-400/90">{project.genre}</span>
          </div>

          <h3 className="font-cinzel text-xl font-bold text-white group-hover:text-sky-400 transition-colors">
            {project.title}
          </h3>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {project.oneLiner}
          </p>
        </div>
      </div>

      {/* Footer Row */}
      <div className="px-6 pb-6 pt-2 border-t border-slate-900/80 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-sky-400 transition-colors">
        <span>Explore Concept</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </article>
  );
};
