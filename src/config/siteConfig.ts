/**
 * ============================================================================
 * PB WORLD — MASTER CONFIGURATION FILE
 * ============================================================================
 * 
 * Welcome to the central configuration for PB World.
 * You can edit your social media URLs, official contact email, logo paths,
 * project artwork paths, application window dates, and trailer settings directly here.
 * Any update made in this file automatically propagates across the entire site.
 */

export interface SocialLinks {
  instagram: string;
  threads: string;
  youtube: string;
  linkedin: string;
  x: string;
  officialEmail: string;
  websiteDomain: string;
}

export interface ApplicationWindowConfig {
  startDate: string; // ISO format YYYY-MM-DD
  endDate: string;   // ISO format YYYY-MM-DD
  announcementTitle: string;
  announcementText: string;
}

export interface SiteConfig {
  companyName: string;
  brandInitials: string;
  tagline: string;
  subtagline: string;
  logoPath: string;
  faviconPath: string;
  socials: SocialLinks;
  applicationWindow: ApplicationWindowConfig;
  defaultTrailerUrl: string;
}

export const SITE_CONFIG: SiteConfig = {
  // Brand Identity
  companyName: "PB World",
  brandInitials: "PB",
  tagline: "Building Worlds. Creating Stories. Developing Possibilities.",
  subtagline:
    "An ambitious creative technology studio engineering immersive fantasy worlds, cinematic storytelling, next-generation visual effects, and advanced applications.",

  // --------------------------------------------------------------------------
  // LOGO PATH
  // --------------------------------------------------------------------------
  logoPath: "/src/assets/images/regenerated_image_1792947343162.jpg",
  faviconPath: "/src/assets/images/regenerated_image_1792947343162.jpg",

  // --------------------------------------------------------------------------
  // SOCIAL MEDIA & CONTACT LINKS (UPDATE THESE PLACEHOLDERS)
  // --------------------------------------------------------------------------
  socials: {
    instagram: "https://www.instagram.com/_the_p.b_world_offl_?cplk=MTVqYno5OG1rdDJi",

    threads: "https://www.threads.com/@pranav__balaji__offl",

    youtube: "https://youtube.com/@the_p.b_world_offl?si=7PWa4nVdD3duT5o5",

    linkedin: "https://www.linkedin.com/in/pranav-balaji-6124b0433?utm_source=share_via&utm_content=profile&utm_medium=member_android",

    x: "https://x.com/_pranav_balaji_",

    // Replace '[ADD_OFFICIAL_EMAIL]' with your official studio mailbox (e.g., 'contact@pbworld.studio')
    officialEmail: "[ADD_OFFICIAL_EMAIL]",

    // Replace '[ADD_DOMAIN_LATER]' with your production domain (e.g., 'https://pbworld.studio')
    websiteDomain: "[ADD_DOMAIN_LATER]",
  },

  // --------------------------------------------------------------------------
  // CAREERS APPLICATION WINDOW (ADMIN EDITABLE)
  // --------------------------------------------------------------------------
  // The system checks the current date against this window to automatically
  // switch between 'Open' and 'Closed' states on both client and backend.
  applicationWindow: {
    startDate: "2026-11-01", // 1 November 2026
    endDate: "2026-12-31",   // 31 December 2026
    announcementTitle: "Winter 2026 Talent Window",
    announcementText:
      "Submissions for 3D art, concept design, gameplay engineering, and VFX pipeline development are scheduled for 1 November 2026 through 31 December 2026.",
  },

  // --------------------------------------------------------------------------
  // TRAILER SETTINGS
  // --------------------------------------------------------------------------
  // Target date for Aetherfall teaser reveal: 25 December 2026 (explicitly planned target)
  defaultTrailerUrl: "", // Paste your YouTube / Vimeo embed URL here once the trailer is rendered
};

/**
 * Checks whether the application window is currently active based on client date.
 */
export function isApplicationWindowOpen(
  startDateStr: string = SITE_CONFIG.applicationWindow.startDate,
  endDateStr: string = SITE_CONFIG.applicationWindow.endDate
): { isOpen: boolean; statusLabel: string; daysRemaining?: number } {
  try {
    const now = new Date();
    const start = new Date(startDateStr + "T00:00:00Z");
    const end = new Date(endDateStr + "T23:59:59Z");

    if (now < start) {
      const daysUntil = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return {
        isOpen: false,
        statusLabel: `Opening Soon (in ${daysUntil} days)`,
      };
    }

    if (now > end) {
      return {
        isOpen: false,
        statusLabel: "Window Closed",
      };
    }

    const daysRemaining = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    return {
      isOpen: true,
      statusLabel: "Submissions Open",
      daysRemaining,
    };
  } catch {
    return { isOpen: false, statusLabel: "Window Closed" };
  }
}
