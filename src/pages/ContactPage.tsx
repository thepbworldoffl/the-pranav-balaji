import React, { useState } from "react";
import { SITE_CONFIG } from "../config/siteConfig";
import {
  Mail,
  Send,
  Building,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  ExternalLink,
} from "lucide-react";

export const ContactPage: React.FC = () => {
  const [formMode, setFormMode] = useState<"client" | "partnership">("client");

  // Client Enquiry State
  const [clientData, setClientData] = useState({
    name: "",
    email: "",
    phoneOrCompany: "",
    projectCategory: "Game Development",
    projectDescription: "",
    requiredDeliverables: "",
    preferredTimeline: "3-6 Months",
    budgetRange: "To be discussed",
    message: "",
  });

  // Partnership & Investment State
  const [partnerData, setPartnerData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    role: "",
    website: "",
    enquiryType: "Strategic Partnership" as const,
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<{
    referenceId: string;
    message: string;
  } | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Submit Client Form
  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit client enquiry.");
      }

      setSubmitSuccess({
        referenceId: data.referenceId,
        message: data.message || "Enquiry recorded in PB World database.",
      });

      setClientData({
        name: "",
        email: "",
        phoneOrCompany: "",
        projectCategory: "Game Development",
        projectDescription: "",
        requiredDeliverables: "",
        preferredTimeline: "3-6 Months",
        budgetRange: "To be discussed",
        message: "",
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error submitting enquiry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Partnership Form
  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/partnerships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partnerData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit partnership discussion request.");
      }

      setSubmitSuccess({
        referenceId: data.referenceId,
        message: data.message || "Partnership inquiry registered.",
      });

      setPartnerData({
        name: "",
        email: "",
        phone: "",
        organization: "",
        role: "",
        website: "",
        enquiryType: "Strategic Partnership",
        message: "",
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Error submitting inquiry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEmailPlaceholder = SITE_CONFIG.socials.officialEmail.startsWith("[ADD_");

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 space-y-16">
      {/* Header */}
      <section className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-sky-400 font-mono">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Connect & Collaborate</span>
        </div>
        <h1 className="font-cinzel text-4xl sm:text-5xl font-bold text-white tracking-tight">
          Contact PB World
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Whether discussing production services, licensing concepts, co-development,
          or strategic alliances, we look forward to the dialogue.
        </p>
      </section>

      {/* Official Direct Contact Strip (Honest: No fake physical addresses) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl bg-[#090C12] border border-slate-800 space-y-2">
          <span className="text-[11px] font-mono uppercase text-sky-400 tracking-wider">
            Official Studio Mailbox
          </span>
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Mail className="w-4 h-4 text-slate-400" />
            <span>
              {isEmailPlaceholder
                ? "[ADD_OFFICIAL_EMAIL] (Configure in siteConfig)"
                : SITE_CONFIG.socials.officialEmail}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            For direct correspondence and verified communications.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#090C12] border border-slate-800 space-y-2">
          <span className="text-[11px] font-mono uppercase text-indigo-400 tracking-wider">
            Digital Studio Model
          </span>
          <p className="text-sm font-semibold text-white">
            Distributed Production & Remote Collaboration
          </p>
          <p className="text-xs text-slate-400">
            PB World operates as a borderless creative technology collective across digital workstations.
          </p>
        </div>
      </section>

      {/* Form Mode Selector */}
      <div className="flex items-center justify-center">
        <div className="p-1 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
          <button
            onClick={() => {
              setFormMode("client");
              setSubmitSuccess(null);
              setSubmitError(null);
            }}
            className={`px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
              formMode === "client"
                ? "bg-slate-800 text-white shadow-md border border-slate-700"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Client & Production Enquiry</span>
          </button>
          <button
            onClick={() => {
              setFormMode("partnership");
              setSubmitSuccess(null);
              setSubmitError(null);
            }}
            className={`px-5 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
              formMode === "partnership"
                ? "bg-slate-800 text-white shadow-md border border-slate-700"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Partnership & Strategic Discussions</span>
          </button>
        </div>
      </div>

      {/* Success Banner */}
      {submitSuccess && (
        <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-700/60 text-emerald-300 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Enquiry Successfully Registered!</span>
          </div>
          <p className="text-xs text-emerald-200 leading-relaxed">
            {submitSuccess.message}
          </p>
          <div className="text-xs font-mono text-emerald-300 pt-2 border-t border-emerald-800/60">
            Tracking Reference ID: <span className="font-bold underline">{submitSuccess.referenceId}</span>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {submitError && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* CLIENT ENQUIRY FORM */}
      {formMode === "client" && (
        <form
          onSubmit={handleClientSubmit}
          className="p-8 sm:p-10 rounded-3xl bg-[#090C12] border border-slate-800 space-y-8"
        >
          <div className="space-y-1">
            <h3 className="font-cinzel text-2xl font-bold text-white">
              Client & Service Project Enquiry
            </h3>
            <p className="text-xs text-slate-400">
              For teams requiring custom 3D art, Unreal Engine prototyping, VFX simulations, or software tools.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Your Name <span className="text-sky-400">*</span>
              </label>
              <input
                type="text"
                required
                value={clientData.name}
                onChange={(e) => setClientData({ ...clientData, name: e.target.value })}
                placeholder="e.g., Alex Mercer"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Work Email <span className="text-sky-400">*</span>
              </label>
              <input
                type="email"
                required
                value={clientData.email}
                onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                placeholder="alex@company.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Phone or Company */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Phone Number or Company <span className="text-slate-500">(Optional)</span>
              </label>
              <input
                type="text"
                value={clientData.phoneOrCompany}
                onChange={(e) => setClientData({ ...clientData, phoneOrCompany: e.target.value })}
                placeholder="Company Name or Phone"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Project Category <span className="text-sky-400">*</span>
              </label>
              <select
                value={clientData.projectCategory}
                onChange={(e) => setClientData({ ...clientData, projectCategory: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Game Development">Game Development & Systems Prototyping</option>
                <option value="Animation & Film">Cinematic Animation & Previs</option>
                <option value="VFX">Visual Effects (VFX) & Simulation</option>
                <option value="App Development">App Development & Studio Tooling</option>
                <option value="Consulting">Technical Architecture Consulting</option>
              </select>
            </div>

            {/* Preferred Timeline */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Preferred Timeline <span className="text-sky-400">*</span>
              </label>
              <select
                value={clientData.preferredTimeline}
                onChange={(e) => setClientData({ ...clientData, preferredTimeline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Immediate (1-2 Months)">Immediate (1-2 Months)</option>
                <option value="3-6 Months">3-6 Months</option>
                <option value="6-12 Months">6-12 Months</option>
                <option value="Flexible / Exploration">Flexible / Early Exploration</option>
              </select>
            </div>

            {/* Budget Range */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Estimated Budget Range <span className="text-slate-500">(Optional)</span>
              </label>
              <input
                type="text"
                value={clientData.budgetRange}
                onChange={(e) => setClientData({ ...clientData, budgetRange: e.target.value })}
                placeholder="e.g., $10K-$25K, or 'To be estimated'"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Required Deliverables */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-slate-300">
                Required Deliverables <span className="text-sky-400">*</span>
              </label>
              <input
                type="text"
                required
                value={clientData.requiredDeliverables}
                onChange={(e) => setClientData({ ...clientData, requiredDeliverables: e.target.value })}
                placeholder="e.g., Unreal Engine playable greybox, 3D character model with rig, 30s teaser animatic"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Message / Description */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-slate-300">
                Project Scope & Message <span className="text-sky-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={clientData.message}
                onChange={(e) =>
                  setClientData({
                    ...clientData,
                    message: e.target.value,
                    projectDescription: e.target.value,
                  })
                }
                placeholder="Detail your requirements, project background, technical constraints, and desired outcomes."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-y"
              />
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
            <p className="text-[11px] text-slate-500">
              Validated on server with spam defense and persistent reference tracking.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Client Enquiry"}
            </button>
          </div>
        </form>
      )}

      {/* PARTNERSHIP & INVESTMENT FORM */}
      {formMode === "partnership" && (
        <form
          onSubmit={handlePartnerSubmit}
          className="p-8 sm:p-10 rounded-3xl bg-[#090C12] border border-slate-800 space-y-8"
        >
          <div className="space-y-1">
            <h3 className="font-cinzel text-2xl font-bold text-white">
              Strategic Partnership & Investment Discussions
            </h3>
            <p className="text-xs text-slate-400">
              For institutions, publishers, investors, and technology partners. Submitting does not promise or obligate any funding or legal partnership.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Full Name <span className="text-sky-400">*</span>
              </label>
              <input
                type="text"
                required
                value={partnerData.name}
                onChange={(e) => setPartnerData({ ...partnerData, name: e.target.value })}
                placeholder="e.g., Jonathan Sterling"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Institutional Email <span className="text-sky-400">*</span>
              </label>
              <input
                type="email"
                required
                value={partnerData.email}
                onChange={(e) => setPartnerData({ ...partnerData, email: e.target.value })}
                placeholder="jonathan@venture.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Organization */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Organization / Firm <span className="text-sky-400">*</span>
              </label>
              <input
                type="text"
                required
                value={partnerData.organization}
                onChange={(e) => setPartnerData({ ...partnerData, organization: e.target.value })}
                placeholder="Venture Capital, Studio, or Publisher"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Role */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Your Role <span className="text-sky-400">*</span>
              </label>
              <input
                type="text"
                required
                value={partnerData.role}
                onChange={(e) => setPartnerData({ ...partnerData, role: e.target.value })}
                placeholder="Partner, Director of Strategy, Principal"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Website (Optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Organization Website <span className="text-slate-500">(Optional)</span>
              </label>
              <input
                type="url"
                value={partnerData.website}
                onChange={(e) => setPartnerData({ ...partnerData, website: e.target.value })}
                placeholder="https://organization.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Enquiry Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Discussion Category <span className="text-sky-400">*</span>
              </label>
              <select
                value={partnerData.enquiryType}
                onChange={(e) => setPartnerData({ ...partnerData, enquiryType: e.target.value as any })}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
              >
                <option value="Strategic Partnership">Strategic Studio Partnership</option>
                <option value="Investment Discussion">Investment & Seed Discussion</option>
                <option value="Technology Collaboration">Technology & Hardware Collaboration</option>
                <option value="Publishing / Co-Production">Publishing & Co-Production</option>
                <option value="Other">Other Strategic Opportunity</option>
              </select>
            </div>

            {/* Message */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-medium text-slate-300">
                Proposal & Strategic Context <span className="text-sky-400">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={partnerData.message}
                onChange={(e) => setPartnerData({ ...partnerData, message: e.target.value })}
                placeholder="Outline your interest, investment thesis, partnership parameters, or collaborative agenda."
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-y"
              />
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
            <p className="text-[11px] text-slate-500">
              Strictly confidential. Direct transmission to studio leadership.
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Transmitting..." : "Initiate Strategic Discussion"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
