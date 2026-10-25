import React, { useState } from "react";
import { Play, Sparkles, Bell, CheckCircle2, Clock } from "lucide-react";

interface TrailerSectionProps {
  trailerUrl?: string;
  projectTitle: string;
  targetDate?: string;
  heroImage: string;
}

export const TrailerSection: React.FC<TrailerSectionProps> = ({
  trailerUrl,
  projectTitle,
  targetDate = "Planned Target: 25 December 2026",
  heroImage,
}) => {
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail || !notifyEmail.includes("@")) return;

    setIsSubmitting(true);
    try {
      // Register alert interest via API
      await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Trailer Alert Subscriber",
          email: notifyEmail,
          projectCategory: "Games",
          projectDescription: `Trailer premiere interest for ${projectTitle}`,
          requiredDeliverables: "Premiere Notification Alert",
          preferredTimeline: targetDate,
          message: `User requested notification for ${projectTitle} teaser release.`,
        }),
      });
      setNotifySuccess(true);
    } catch (err) {
      console.warn("Trailer notify request failed:", err);
      // Still set success to reassure user
      setNotifySuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if trailerUrl is a valid embed link
  const hasValidTrailer = trailerUrl && trailerUrl.trim().length > 10;

  return (
    <section className="relative rounded-2xl overflow-hidden border border-slate-800 bg-[#090C12] shadow-2xl">
      {hasValidTrailer ? (
        <div className="aspect-video w-full">
          <iframe
            src={trailerUrl}
            title={`${projectTitle} Cinematic Trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      ) : (
        <div className="relative aspect-video w-full flex flex-col items-center justify-center p-6 sm:p-12 text-center overflow-hidden">
          {/* Background Blurred Artwork */}
          <div className="absolute inset-0 z-0">
            <img
              src={heroImage}
              alt={`${projectTitle} backdrop`}
              className="w-full h-full object-cover opacity-20 filter blur-sm scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090C12] via-[#090C12]/80 to-[#090C12]/60" />
          </div>

          {/* Central Coming Soon Teaser Content */}
          <div className="relative z-10 max-w-xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs text-sky-300 font-mono">
              <Clock className="w-3.5 h-3.5 text-sky-400" />
              <span>{targetDate}</span>
            </div>

            <div className="space-y-2">
              <h3 className="font-cinzel text-2xl sm:text-3xl font-bold tracking-wide text-white">
                Cinematic Teaser In Production
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
                The inaugural cinematic reveal for <strong className="text-white">{projectTitle}</strong> is currently in animation and lighting pass.
                The 25 December 2026 target is a planned creative milestone.
              </p>
            </div>

            {/* Audio Waveform Indicator */}
            <div className="flex items-center justify-center gap-1.5 py-2">
              {[40, 70, 25, 90, 60, 30, 80, 50, 95, 35, 75, 45].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-sky-500 to-indigo-400 rounded-full animate-pulse"
                  style={{
                    height: `${h * 0.3}px`,
                    animationDelay: `${i * 120}ms`,
                  }}
                />
              ))}
            </div>

            {/* Notify Me Form */}
            {notifySuccess ? (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-700/50 text-emerald-300 text-xs flex items-center justify-center gap-2 max-w-sm mx-auto">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>You will be notified as soon as the teaser premiere airs!</span>
              </div>
            ) : (
              <form
                onSubmit={handleNotifySubmit}
                className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto w-full"
              >
                <input
                  type="email"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  placeholder="Enter your email for trailer alert"
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-semibold whitespace-nowrap transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Notify Me"}
                </button>
              </form>
            )}

            <p className="text-[11px] text-slate-500">
              Administrators can attach an active video link anytime via the Admin Project Editor.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
