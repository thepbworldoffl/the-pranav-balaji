import React, { useState } from "react";
import { SITE_CONFIG, isApplicationWindowOpen } from "../config/siteConfig";
import {
  Briefcase,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Info,
} from "lucide-react";

interface CareersPageProps {
  applicationWindow?: typeof SITE_CONFIG.applicationWindow;
}

export const CareersPage: React.FC<CareersPageProps> = ({
  applicationWindow = SITE_CONFIG.applicationWindow,
}) => {
  const [activeTab, setActiveTab] = useState<"job" | "collaboration">("job");

  // Check window status
  const windowStatus = isApplicationWindowOpen(
    applicationWindow.startDate,
    applicationWindow.endDate
  );

  // Job Application Form State
  const [jobFormData, setJobFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    cityCountry: "",
    desiredRole: "Gameplay Programmer (Unreal / C++)",
    skills: "",
    programmingLanguages: "",
    education: "",
    experienceYears: "1-3 Years",
    previousCompany: "",
    portfolioUrl: "",
    message: "",
  });

  // Collaboration Form State
  const [collabFormData, setCollabFormData] = useState({
    contactName: "",
    email: "",
    teamOrCompany: "",
    projectTitle: "",
    category: "Games",
    description: "",
    currentStage: "Conceptual Treatment",
    helpNeeded: "",
    portfolioOrProjectLink: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<{
    referenceId: string;
    message: string;
  } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Handle Job Form Submit
  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    if (!windowStatus.isOpen) {
      setSubmitError(
        `Submissions are currently closed. The talent window runs from ${applicationWindow.startDate} through ${applicationWindow.endDate}.`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobFormData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Submission failed. Please check your inputs.");
      }

      setSubmitSuccess({
        referenceId: data.referenceId,
        message: data.message || "Application successfully recorded in PB World database.",
      });

      // Clear form on success
      setJobFormData({
        fullName: "",
        email: "",
        phone: "",
        cityCountry: "",
        desiredRole: "Gameplay Programmer (Unreal / C++)",
        skills: "",
        programmingLanguages: "",
        education: "",
        experienceYears: "1-3 Years",
        previousCompany: "",
        portfolioUrl: "",
        message: "",
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error submitting application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Collaboration Form Submit
  const handleCollabSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/collaborations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(collabFormData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit collaboration request.");
      }

      setSubmitSuccess({
        referenceId: data.referenceId,
        message: data.message || "Collaboration proposal registered in PB World database.",
      });

      // Clear form on success
      setCollabFormData({
        contactName: "",
        email: "",
        teamOrCompany: "",
        projectTitle: "",
        category: "Games",
        description: "",
        currentStage: "Conceptual Treatment",
        helpNeeded: "",
        portfolioOrProjectLink: "",
        message: "",
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error submitting collaboration proposal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-16">
      {/* Careers Header */}
      <section className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-sky-400 font-mono">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Talent & Creative Alliances</span>
        </div>
        <h1 className="font-cinzel text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Join PB World
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          We are inviting passionate concept artists, Unreal Engine programmers, 3D animators,
          and systems architects to participate in our pre-production creative journey.
        </p>
      </section>

      {/* Application Window Status Banner */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[#090C12] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  windowStatus.isOpen ? "bg-emerald-400 shadow-sm shadow-emerald-400" : "bg-amber-400"
                }`}
              />
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Application Window Status
              </span>
              <span
                className={`text-xs font-mono font-bold ${
                  windowStatus.isOpen ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                [{windowStatus.statusLabel}]
              </span>
            </div>
            <h3 className="font-cinzel text-lg font-bold text-white">
              {applicationWindow.announcementTitle}
            </h3>
            <p className="text-xs text-slate-400">
              Active Window: <strong className="text-slate-200">{applicationWindow.startDate}</strong> through{" "}
              <strong className="text-slate-200">{applicationWindow.endDate}</strong>.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 max-w-xs space-y-1">
            <span className="text-slate-300 font-semibold block">Window Schedule</span>
            <p className="text-[11px] leading-relaxed text-slate-400">
              {applicationWindow.announcementText}
            </p>
          </div>
        </div>
      </section>

      {/* Strict Legal & Transparency Disclaimer */}
      <section className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3 text-xs text-slate-400 leading-relaxed">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200">Notice of Consideration: </strong>
          Submitting an application or collaboration proposal does not guarantee employment, a paid role, contract,
          or selection. All submissions are reviewed on a rolling basis according to studio milestones and project resource needs.
        </div>
      </section>

      {/* Dual Tab Switcher: Job Application vs Team Collaboration */}
      <div className="flex items-center justify-center">
        <div className="p-1 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab("job");
              setSubmitSuccess(null);
              setSubmitError(null);
            }}
            className={`px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeTab === "job"
                ? "bg-slate-800 text-white shadow-md border border-slate-700"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Individual Job Application</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("collaboration");
              setSubmitSuccess(null);
              setSubmitError(null);
            }}
            className={`px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeTab === "collaboration"
                ? "bg-slate-800 text-white shadow-md border border-slate-700"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Team / Project Collaboration</span>
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {submitSuccess && (
        <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-700/60 text-emerald-300 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Submission Confirmed!</span>
          </div>
          <p className="text-xs text-emerald-200 leading-relaxed">
            {submitSuccess.message}
          </p>
          <div className="text-xs font-mono text-emerald-300 pt-2 border-t border-emerald-800/60">
            Reference Tracking ID: <span className="font-bold underline">{submitSuccess.referenceId}</span>
          </div>
        </div>
      )}

      {/* Error Notification Banner */}
      {submitError && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* FORM 1: INDIVIDUAL JOB APPLICATION */}
      {activeTab === "job" && (
        <form
          onSubmit={handleJobSubmit}
          className="p-8 sm:p-10 rounded-3xl bg-[#090C12] border border-slate-800 space-y-8"
        >
          <div className="space-y-1">
            <h3 className="font-cinzel text-2xl font-bold text-white">
              Talent Application Form
            </h3>
            <p className="text-xs text-slate-400">
              Provide your details, core disciplines, and portfolio links. Required fields are indicated.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Full Name <span className="text-sky-400">*</span>
              </label>
              <input
                type="text"
                required
                value={jobFormData.fullName}
                onChange={(e) => setJobFormData({ ...jobFormData, fullName: e.target.value })}
                placeholder="e.g., Sarah Vance"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Email Address <span className="text-sky-400">*</span>
              </label>
              <input
                type="email"
                required
                value={jobFormData.email}
                onChange={(e) => setJobFormData({ ...jobFormData, email: e.target.value })}
                placeholder="sarah@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Phone (Optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Phone Number <span className="text-slate-500">(Optional)</span>
              </label>
              <input
                type="tel"
                value={jobFormData.phone}
                onChange={(e) => setJobFormData({ ...jobFormData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* City / Country */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                City & Country <span className="text-sky-400">*</span>
              </label>
              <input
                type="text"
                required
                value={jobFormData.cityCountry}
                onChange={(e) => setJobFormData({ ...jobFormData, cityCountry: e.target.value })}
                placeholder="e.g., London, United Kingdom / Remote"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Desired Role */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Desired Role <span className="text-sky-400">*</span>
              </label>
              <select
                value={jobFormData.desiredRole}
                onChange={(e) => setJobFormData({ ...jobFormData, desiredRole: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Gameplay Programmer (Unreal / C++)">Gameplay Programmer (Unreal Engine / C++)</option>
                <option value="3D Concept Artist & Worldbuilder">3D Concept Artist & Worldbuilder</option>
                <option value="Cinematic Animator (2.5D / 3D)">Cinematic Animator (2.5D / 3D)</option>
                <option value="VFX Simulation Artist (Houdini)">VFX Simulation Artist (Houdini)</option>
                <option value="Full-Stack Pipeline Engineer">Full-Stack Pipeline Engineer</option>
                <option value="Sound Designer & Composer">Sound Designer & Composer</option>
                <option value="Narrative Designer / Writer">Narrative Designer / Writer</option>
                <option value="General Creative Associate">General Creative Associate</option>
              </select>
            </div>

            {/* Years of Experience */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Experience Level <span className="text-sky-400">*</span>
              </label>
              <select
                value={jobFormData.experienceYears}
                onChange={(e) => setJobFormData({ ...jobFormData, experienceYears: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Student / Aspiring">Student / Aspiring Creator</option>
                <option value="1-3 Years">1-3 Years</option>
                <option value="4-7 Years">4-7 Years</option>
                <option value="8+ Years (Senior / Lead)">8+ Years (Senior / Lead)</option>
              </select>
            </div>

            {/* Education */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Education / Training <span className="text-sky-400">*</span>
              </label>
              <input
                type="text"
                required
                value={jobFormData.education}
                onChange={(e) => setJobFormData({ ...jobFormData, education: e.target.value })}
                placeholder="Degree, Self-taught, or Bootcamp / Guild"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Previous Company (Optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Previous Studio or Company <span className="text-slate-500">(Optional)</span>
              </label>
              <input
                type="text"
                value={jobFormData.previousCompany}
                onChange={(e) => setJobFormData({ ...jobFormData, previousCompany: e.target.value })}
                placeholder="e.g., Freelance, Studio Name, or Independent"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Programming Languages (Optional) */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-slate-300">
                Programming Languages / Pipeline Tools <span className="text-slate-500">(Where relevant)</span>
              </label>
              <input
                type="text"
                value={jobFormData.programmingLanguages}
                onChange={(e) => setJobFormData({ ...jobFormData, programmingLanguages: e.target.value })}
                placeholder="e.g., C++, Python, HLSL, TypeScript, Unreal Blueprints, Houdini VEX"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Skills & Disciplines */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-slate-300">
                Core Skills & Proficiencies <span className="text-sky-400">*</span>
              </label>
              <input
                type="text"
                required
                value={jobFormData.skills}
                onChange={(e) => setJobFormData({ ...jobFormData, skills: e.target.value })}
                placeholder="e.g., 3D Character Rigging, Niagara Particles, Nanite optimization, Storyboarding"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Portfolio Link */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-slate-300">
                Portfolio, ArtStation, GitHub, or Resume Link <span className="text-slate-500">(Recommended)</span>
              </label>
              <input
                type="url"
                value={jobFormData.portfolioUrl}
                onChange={(e) => setJobFormData({ ...jobFormData, portfolioUrl: e.target.value })}
                placeholder="https://artstation.com/yourhandle or https://github.com/yourhandle"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Statement of Interest */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-slate-300">
                Statement of Interest & Introduction <span className="text-sky-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={jobFormData.message}
                onChange={(e) => setJobFormData({ ...jobFormData, message: e.target.value })}
                placeholder="Tell us about yourself, what drew you to PB World, and what kind of worlds you yearn to build."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-y"
              />
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
            <p className="text-[11px] text-slate-500">
              Database confirmed write. Inputs are sanitized and stored securely.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting Application..." : "Submit Application"}
            </button>
          </div>
        </form>
      )}

      {/* FORM 2: TEAM OR PROJECT COLLABORATION */}
      {activeTab === "collaboration" && (
        <form
          onSubmit={handleCollabSubmit}
          className="p-8 sm:p-10 rounded-3xl bg-[#090C12] border border-slate-800 space-y-8"
        >
          <div className="space-y-1">
            <h3 className="font-cinzel text-2xl font-bold text-white">
              Project Collaboration Form
            </h3>
            <p className="text-xs text-slate-400">
              For independent teams, co-creators, or studios proposing collaborative ventures.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Contact Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Contact Name <span className="text-sky-400">*</span>
              </label>
              <input
                type="text"
                required
                value={collabFormData.contactName}
                onChange={(e) => setCollabFormData({ ...collabFormData, contactName: e.target.value })}
                placeholder="Your Name"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Email Address <span className="text-sky-400">*</span>
              </label>
              <input
                type="email"
                required
                value={collabFormData.email}
                onChange={(e) => setCollabFormData({ ...collabFormData, email: e.target.value })}
                placeholder="contact@studio.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Team or Company */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Team, Collective or Company <span className="text-slate-500">(Optional)</span>
              </label>
              <input
                type="text"
                value={collabFormData.teamOrCompany}
                onChange={(e) => setCollabFormData({ ...collabFormData, teamOrCompany: e.target.value })}
                placeholder="e.g., Mythos Collective"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Project Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Project Title <span className="text-sky-400">*</span>
              </label>
              <input
                type="text"
                required
                value={collabFormData.projectTitle}
                onChange={(e) => setCollabFormData({ ...collabFormData, projectTitle: e.target.value })}
                placeholder="Proposed or existing IP name"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Discipline Category <span className="text-sky-400">*</span>
              </label>
              <select
                value={collabFormData.category}
                onChange={(e) => setCollabFormData({ ...collabFormData, category: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Games">Games (3D / RPG / Action)</option>
                <option value="Animation & Film">Animation & Film</option>
                <option value="VFX">Visual Effects (VFX)</option>
                <option value="Apps">Software & Studio Tooling</option>
                <option value="Other">Cross-Disciplinary</option>
              </select>
            </div>

            {/* Current Stage */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Current Development Stage <span className="text-sky-400">*</span>
              </label>
              <select
                value={collabFormData.currentStage}
                onChange={(e) => setCollabFormData({ ...collabFormData, currentStage: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Conceptual Treatment">Conceptual Treatment / Story Bible</option>
                <option value="Pre-Production & Concept Art">Pre-Production & Concept Art</option>
                <option value="Playable Prototype / Greybox">Playable Prototype / Greybox</option>
                <option value="Vertical Slice / Previs">Vertical Slice / Previs</option>
              </select>
            </div>

            {/* Help Needed */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-slate-300">
                How PB World Can Collaborate <span className="text-sky-400">*</span>
              </label>
              <input
                type="text"
                required
                value={collabFormData.helpNeeded}
                onChange={(e) => setCollabFormData({ ...collabFormData, helpNeeded: e.target.value })}
                placeholder="e.g., Worldbuilding co-development, Unreal Engine 5 shader pipeline, sound design"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Portfolio Link */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-slate-300">
                Project Pitch Deck / Video / Repository Link <span className="text-slate-500">(Optional)</span>
              </label>
              <input
                type="url"
                value={collabFormData.portfolioOrProjectLink}
                onChange={(e) => setCollabFormData({ ...collabFormData, portfolioOrProjectLink: e.target.value })}
                placeholder="https://drive.google.com/... or pitch site URL"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Project Description & Message */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-slate-300">
                Synopsis & Collaboration Message <span className="text-sky-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={collabFormData.message}
                onChange={(e) =>
                  setCollabFormData({
                    ...collabFormData,
                    message: e.target.value,
                    description: e.target.value,
                  })
                }
                placeholder="Describe your creative vision, the technical requirements, and how our teams could align."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-y"
              />
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
            <p className="text-[11px] text-slate-500">
              All shared treatments and materials remain confidential under standard studio ethics.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Sending Proposal..." : "Submit Collaboration Proposal"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
