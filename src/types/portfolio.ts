export type ThemeMode = 'STEALTH_MONO' | 'GLITCH_ACID' | 'AMBER_PHOSPHOR';

export type FontFamily = 'JetBrains Mono' | 'IBM Plex Mono' | 'Fira Code';

export type PlaybackMode = 'always' | 'hover';

export type CanvasDensity = 'compact' | 'standard' | 'dense';

export interface DevTweaksConfig {
  font: FontFamily;
  theme: ThemeMode;
  glitchIntensity: number; // 0 to 100
  asciiFps: number; // 6 to 24
  playbackMode: PlaybackMode;
  canvasDensity: CanvasDensity;
  scanlines: boolean;
  letterSpacing: number; // 0 to 0.12 (em)
}

export interface BootLogEntry {
  timestamp: string;
  message: string;
  status: string;
}

export interface QuickFact {
  key: string;
  label: string;
  value: string;
}

export interface SkillGroup {
  id: string;
  dirName: string;
  permissions: string;
  items: string[];
  note?: string;
}

export type AsciiAnimationId =
  | 'monogram'
  | 'ebpfKernel'
  | 'canBusWave'
  | 'wifiRadar'
  | 'sbomGraph'
  | 'hpcCluster';

export interface ProjectLink {
  label: string;
  url: string;
}

export interface FeaturedProject {
  hexId: string;
  slug: string;
  title: string;
  shortTitle: string;
  category: string;
  stack: string[];
  realWorldUseCase: string;
  summary: [string, string];
  asciiId: AsciiAnimationId;
  repoUrl?: string;
  demoUrl?: string;
  pdfUrl?: string;
  labType?: string;
  extraLinks?: ProjectLink[];
}

export type SecondaryCategory =
  | 'ALL'
  | 'IOT_&_NET'
  | 'MOBILE_&_APPSEC'
  | 'SIEM_&_INFRA'
  | 'CRYPTO_&_SYS';

export interface SecondaryProject {
  hexId: string;
  title: string;
  category: string;
  filterGroup: Exclude<SecondaryCategory, 'ALL'>;
  stack: string[];
  summary: string;
  links: ProjectLink[];
  academicLab?: boolean;
}

export interface ExperienceItem {
  role: string;
  company: string;
  companyUrl: string;
  location: string;
  period: string;
  bullets: string[];
  recommendation: {
    quote: string;
    author: string;
    title: string;
  };
}

export interface EducationItem {
  id: string;
  degree: string;
  url?: string;
  institution: string;
  period: string;
  details: string[];
}

export interface CredentialItem {
  id: string;
  category: 'CERTIFICATION' | 'COMPETITION' | 'HONOR' | 'EXTRACURRICULAR' | 'PUBLICATION';
  title: string;
  issuerOrContext: string;
  date?: string;
  detail?: string;
  url?: string;
  linkLabel?: string;
}

export interface PortfolioData {
  identity: {
    name: string;
    shortHandle: string;
    titleLine: string;
    subtitle: string;
    shortIntro: string;
    bio: string;
    focusSummary: string;
    locationMatrix: string;
    availabilityNotice: string;
    email: string;
    githubUrl: string;
    linkedinUrl: string;
    mediumUrl: string;
    cvPdfPath: string;
  };
  bootLogs: BootLogEntry[];
  quickFacts: QuickFact[];
  skillGroups: SkillGroup[];
  featuredProjects: FeaturedProject[];
  secondaryProjects: SecondaryProject[];
  experience: ExperienceItem[];
  education: EducationItem[];
  credentials: CredentialItem[];
  contact: {
    headline: string;
    text: string;
  };
}
