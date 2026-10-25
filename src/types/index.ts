import { ProjectCategory } from "../config/projectsData";

export type SubmissionStatus = "pending" | "reviewed" | "shortlisted" | "archived";

export interface JobApplication {
  id: string;
  referenceId: string;
  fullName: string;
  email: string;
  phone?: string;
  cityCountry: string;
  desiredRole: string;
  skills: string;
  programmingLanguages?: string;
  education: string;
  experienceYears: string;
  previousCompany?: string;
  portfolioUrl?: string;
  message: string;
  status: SubmissionStatus;
  adminNotes?: string;
  submittedAt: string;
  ipHash?: string;
}

export interface ProjectCollaboration {
  id: string;
  referenceId: string;
  contactName: string;
  email: string;
  teamOrCompany?: string;
  projectTitle: string;
  category: ProjectCategory | "Other";
  description: string;
  currentStage: string;
  helpNeeded: string;
  portfolioOrProjectLink?: string;
  message: string;
  status: SubmissionStatus;
  adminNotes?: string;
  submittedAt: string;
}

export interface ClientEnquiry {
  id: string;
  referenceId: string;
  name: string;
  email: string;
  phoneOrCompany?: string;
  projectCategory: ProjectCategory | "Consulting";
  projectDescription: string;
  requiredDeliverables: string;
  preferredTimeline: string;
  budgetRange?: string;
  message: string;
  status: SubmissionStatus;
  adminNotes?: string;
  submittedAt: string;
}

export interface PartnershipEnquiry {
  id: string;
  referenceId: string;
  name: string;
  email: string;
  phone?: string;
  organization: string;
  role: string;
  website?: string;
  enquiryType: "Strategic Partnership" | "Investment Discussion" | "Technology Collaboration" | "Publishing / Co-Production" | "Other";
  message: string;
  status: SubmissionStatus;
  adminNotes?: string;
  submittedAt: string;
}

export interface AdminStats {
  totalApplications: number;
  totalClientEnquiries: number;
  totalCollaborations: number;
  totalPartnerships: number;
  pendingCount: number;
  shortlistedCount: number;
  applicationWindowStatus: {
    isOpen: boolean;
    startDate: string;
    endDate: string;
  };
}

export interface AdminAuthSession {
  token: string;
  username: string;
  role: "super_admin" | "admin";
  expiresAt: number;
}
