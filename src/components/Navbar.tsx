import React, { useState, useEffect } from "react";
import { SITE_CONFIG } from "../config/siteConfig";
import { Menu, X, Shield, ArrowUpRight } from "lucide-react";

export type PageId = "home" | "about" | "projects" | "services" | "careers" | "contact" | "admin";

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId, projectId?: string) => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, isAdminLoggedIn }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks: { id: PageId; label: string }[] = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "services", label: "Services" },
    { id: "careers", label: "Careers" },
    { id: "contact", label: "Contact" },
  ];

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#07090D]/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/40"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (4-6 nav links) - Zone 3 (1 Primary Action) */}
        <div className="flex items-center justify-between gap-6 lg:gap-8 h-20">
          {/* ZONE 1: Brand Wordmark with PB Monogram Logo */}
          <button
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-3.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-xl p-1 transition-all"
            aria-label="PB World Home"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-slate-950 border border-slate-700/80 shadow-lg shadow-black/60 group-hover:border-sky-400/70 group-hover:shadow-sky-500/20 transition-all duration-300 flex items-center justify-center shrink-0">
              <img
                src={SITE_CONFIG.logoPath}
                alt="PB Monogram Logo"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback if custom image fails to load
                  (e.target as HTMLImageElement).src = "/pb-logo.svg";
                }}
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-cinzel tracking-wider text-xl font-bold text-white group-hover:text-sky-300 transition-colors whitespace-nowrap leading-tight">
                {SITE_CONFIG.companyName}
              </span>
              <span className="text-[10px] tracking-[0.25em] uppercase text-slate-400 font-mono font-medium">
                Studio
              </span>
            </div>
          </button>

          {/* ZONE 2: Clean Single-Line Text Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 text-sm ${
                    isActive
                      ? "text-white font-semibold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ZONE 3: 1 Primary Action + Admin Access */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Admin Portal Quick Switch */}
            <button
              onClick={() => handleNavClick("admin")}
              title={isAdminLoggedIn ? "Admin Dashboard (Logged In)" : "Admin Portal Access"}
              className={`p-2 rounded-lg border transition-colors ${
                currentPage === "admin"
                  ? "bg-sky-500/10 border-sky-500/50 text-sky-400"
                  : isAdminLoggedIn
                  ? "bg-emerald-950/40 border-emerald-700/50 text-emerald-400 hover:bg-emerald-900/40"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
              }`}
              aria-label="Admin Portal"
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => handleNavClick("contact")}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-sky-600 to-indigo-600 rounded-lg hover:from-sky-500 hover:to-indigo-500 shadow-sm shadow-sky-950 transition-all active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              <span>Work With Us</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg bg-slate-900/60 border border-slate-800"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0D14]/98 border-b border-slate-800 backdrop-blur-xl px-6 pt-4 pb-6 transition-all">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left py-2.5 px-3 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === link.id
                    ? "bg-slate-800/80 text-white font-semibold"
                    : "text-slate-300 hover:bg-slate-900/60 hover:text-white"
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleNavClick("admin")}
                className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 py-1 px-2"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Suite</span>
              </button>
              <button
                onClick={() => handleNavClick("contact")}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-gradient-to-r from-sky-600 to-indigo-600 rounded-lg"
              >
                Work With Us
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
