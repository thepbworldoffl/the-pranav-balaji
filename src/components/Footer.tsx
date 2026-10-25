import React from "react";
import { SITE_CONFIG } from "../config/siteConfig";
import { PageId } from "./Navbar";
import {
  Youtube,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  ArrowUpRight,
  Shield,
  ExternalLink,
} from "lucide-react";

interface FooterProps {
  onNavigate: (page: PageId, projectId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const isPlaceholder = (url: string) => url.startsWith("[ADD_") || url === "";

  const socialItems = [
    {
      name: "YouTube",
      url: SITE_CONFIG.socials.youtube,
      icon: <Youtube className="w-4 h-4" />,
    },
    {
      name: "LinkedIn",
      url: SITE_CONFIG.socials.linkedin,
      icon: <Linkedin className="w-4 h-4" />,
    },
    {
      name: "X / Twitter",
      url: SITE_CONFIG.socials.x,
      icon: <Twitter className="w-4 h-4" />,
    },
    {
      name: "Instagram",
      url: SITE_CONFIG.socials.instagram,
      icon: <Instagram className="w-4 h-4" />,
    },
    {
      name: "Threads",
      url: SITE_CONFIG.socials.threads,
      icon: <span className="text-sm font-bold font-mono leading-none tracking-tight">@</span>,
    },
  ];

  return (
    <footer className="bg-[#05070B] border-t border-slate-900 text-slate-400">
      {/* Upper Footer: Brand & Core Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg p-0.5 bg-gradient-to-br from-slate-700/80 to-slate-900 border border-slate-700/60 flex items-center justify-center shrink-0">
                <img
                  src={SITE_CONFIG.logoPath}
                  alt="PB Monogram Logo"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-cinzel text-xl font-bold tracking-wider text-white">
                {SITE_CONFIG.companyName}
              </span>
            </div>
            <p className="text-sm text-slate-300 font-medium italic">
              "{SITE_CONFIG.tagline}"
            </p>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              An ambitious creative technology studio dedicated to original game concepts,
              animated feature stories, cutting-edge visual effects, and resilient digital applications.
            </p>
            <div className="pt-2">
              <a
                href={
                  isPlaceholder(SITE_CONFIG.socials.officialEmail)
                    ? "#"
                    : `mailto:${SITE_CONFIG.socials.officialEmail}`
                }
                onClick={(e) => {
                  if (isPlaceholder(SITE_CONFIG.socials.officialEmail)) {
                    e.preventDefault();
                    onNavigate("contact");
                  }
                }}
                className="inline-flex items-center gap-2 text-xs text-sky-400 hover:text-sky-300 transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>
                  {isPlaceholder(SITE_CONFIG.socials.officialEmail)
                    ? "Official Studio Mailbox (Configure in siteConfig)"
                    : SITE_CONFIG.socials.officialEmail}
                </span>
              </a>
            </div>
          </div>

          {/* Studio Disciplines */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Studio Disciplines
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate("services")}
                  className="hover:text-white transition-colors"
                >
                  Game Development
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("services")}
                  className="hover:text-white transition-colors"
                >
                  Animation & Film
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("services")}
                  className="hover:text-white transition-colors"
                >
                  Visual Effects (VFX)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("services")}
                  className="hover:text-white transition-colors"
                >
                  App Development
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate("projects")}
                  className="hover:text-white transition-colors"
                >
                  Original Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("about")}
                  className="hover:text-white transition-colors"
                >
                  About the Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("careers")}
                  className="hover:text-white transition-colors"
                >
                  Join PB World (Careers)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("contact")}
                  className="hover:text-white transition-colors"
                >
                  Client & Partner Inquiries
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("admin")}
                  className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
                >
                  <Shield className="w-3 h-3" />
                  <span>Admin Dashboard</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Social Channels */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Connect With PB
            </h4>
            <p className="text-xs text-slate-400">
              Follow development updates, concept art releases, and production milestones.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {socialItems.map((soc) => {
                const placeholder = isPlaceholder(soc.url);
                return (
                  <a
                    key={soc.name}
                    href={placeholder ? "#" : soc.url}
                    target={placeholder ? "_self" : "_blank"}
                    rel="noopener noreferrer"
                    title={
                      placeholder
                        ? `${soc.name}: Configure URL in src/config/siteConfig.ts`
                        : `${soc.name} Official Channel`
                    }
                    onClick={(e) => {
                      if (placeholder) {
                        e.preventDefault();
                        alert(
                          `${soc.name} placeholder configured. Update this link in src/config/siteConfig.ts or via the Admin Settings tab!`
                        );
                      }
                    }}
                    className={`p-2.5 rounded-xl border text-xs flex items-center justify-center transition-all ${
                      placeholder
                        ? "bg-slate-900/50 border-slate-800 text-slate-500 hover:text-slate-300 hover:border-slate-700"
                        : soc.name === "Instagram"
                        ? "bg-slate-900 border-slate-700/80 text-white hover:text-pink-400 hover:border-pink-500/60 hover:shadow-md hover:shadow-pink-500/10 active:scale-95"
                        : soc.name === "LinkedIn"
                        ? "bg-slate-900 border-slate-700/80 text-white hover:text-sky-400 hover:border-sky-500/60 hover:shadow-md hover:shadow-sky-500/10 active:scale-95"
                        : soc.name === "Threads"
                        ? "bg-slate-900 border-slate-700/80 text-white hover:text-white hover:border-slate-400 hover:shadow-md hover:shadow-white/10 active:scale-95"
                        : soc.name === "YouTube"
                        ? "bg-slate-900 border-slate-700/80 text-white hover:text-red-400 hover:border-red-500/60 hover:shadow-md hover:shadow-red-500/10 active:scale-95"
                        : soc.name === "X / Twitter"
                        ? "bg-slate-900 border-slate-700/80 text-white hover:text-white hover:border-slate-400 hover:shadow-md hover:shadow-white/10 active:scale-95"
                        : "bg-slate-900 border-slate-700/80 text-slate-300 hover:text-white hover:border-sky-500/50 hover:bg-slate-800 active:scale-95"
                    }`}
                  >
                    {soc.icon}
                  </a>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400">
              Links configurable in <code className="text-slate-400">siteConfig.ts</code>
            </p>
          </div>
        </div>

        {/* Lower Footer: Integrity Notice & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} PB World. All rights reserved.
          </p>
          <p className="text-center md:text-right max-w-xl text-[11px] text-slate-400">
            PB World is an ambitious independent creative technology venture in concept and pre-production.
            All project lore, concept art, and gameplay specifications represent original creative development.
          </p>
        </div>
      </div>
    </footer>
  );
};
