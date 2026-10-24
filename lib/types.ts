export type LinkItem = {
  id: string;
  label: string;
  url: string;
  kind: "github" | "live" | "paper" | "doi" | "youtube" | "instagram" | "linkedin" | "website" | "custom";
};

export type MediaItem = {
  id: string;
  url: string;
  type: "image" | "video" | "pdf";
  alt: string;
  caption?: string;
  thumbnailUrl?: string;
};

export type CaseStudySection = { id: string; title: string; body: string };

export type ContentItem = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  summary: string;
  description?: string;
  organization?: string;
  role?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  date?: string;
  status?: string;
  category?: string;
  coverImage?: string;
  featured: boolean;
  published: boolean;
  tags: string[];
  highlights: string[];
  metrics?: string[];
  media: MediaItem[];
  links: LinkItem[];
  sections?: CaseStudySection[];
};

export type SkillGroup = {
  id: string;
  title: string;
  description: string;
  skills: string[];
};

export type PortfolioContent = {
  settings: {
    siteTitle: string;
    siteDescription: string;
    accent: string;
  };
  profile: {
    name: string;
    shortName: string;
    role: string;
    eyebrow: string;
    heroTitle: string;
    introduction: string;
    location: string;
    email: string;
    phone: string;
    availability: string;
    avatarUrl: string;
    logoUrl: string;
    resumeUrl: string;
    resumeUpdatedAt: string;
    socials: LinkItem[];
  };
  about: {
    heading: string;
    paragraphs: string[];
    principles: string[];
    interests: string[];
  };
  skills: SkillGroup[];
  projects: ContentItem[];
  papers: ContentItem[];
  certificates: ContentItem[];
  events: ContentItem[];
  education: ContentItem[];
  experience: ContentItem[];
  updates: ContentItem[];
  club: {
    enabled: boolean;
    name: string;
    role: string;
    summary: string;
    description: string;
    media: MediaItem[];
    links: LinkItem[];
  };
};

export type CollectionName = "projects" | "papers" | "certificates" | "events" | "education" | "experience" | "updates";
