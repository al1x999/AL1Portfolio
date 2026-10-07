export type AspectRatio = '16:9' | '9:16';
export type AccentColor = 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose' | 'indigo';

export interface BrandInfo {
  name: string;
  tagline: string;
  bio: string;
  location: string;
  statusText: string;
}

export interface SoftwareSkill {
  id: string;
  name: string;
  proficiency: number; // 0 - 100
  badge: string;
  icon: string;
  order: number;
}

export interface VideoProject {
  id: string;
  title: string;
  youtubeId: string;
  youtubeUrl: string;
  thumbnail: string;
  category: string;
  duration: string;
  views: string;
  client: string;
  aspectRatio: AspectRatio;
  isFeatured: boolean;
  order: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
}

export type LinkIconType =
  | 'youtube'
  | 'tiktok'
  | 'whatsapp'
  | 'instagram'
  | 'facebook'
  | 'discord'
  | 'telegram'
  | 'twitter'
  | 'x'
  | 'twitch'
  | 'spotify'
  | 'github'
  | 'steam'
  | 'mail'
  | 'globe'
  | 'link';

export interface HubLink {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  icon: LinkIconType;
  badge?: string;
  accentColor?: string;
  isActive: boolean;
  order: number;
}

export interface ClientReview {
  id: string;
  clientName: string;
  clientPhoto: string;
  clientRole: string;
  rating: number; // 1 - 5
  text: string;
  projectReference: string;
  date?: string;
  platformBadge?: string;
  accentColor?: string;
  isVerified?: boolean;
  order: number;
}

export type PinColor = 'red' | 'blue' | 'purple' | 'orange' | 'cyan' | 'emerald';

export interface PolicyRule {
  id: string;
  ruleNumber: string;
  title: string;
  description: string;
  hadithReference?: string;
  hadithReferences?: string[];
  detailedExplanation?: string;
  youtubeUrl?: string;
  youtubeUrls?: string[];
  pinColor?: PinColor;
  order: number;
}

export function getPolicyHadiths(rule: PolicyRule): string[] {
  const list: string[] = [];
  if (rule.hadithReferences && Array.isArray(rule.hadithReferences)) {
    rule.hadithReferences.forEach((h) => {
      if (h && typeof h === 'string' && h.trim()) list.push(h.trim());
    });
  }
  if (list.length === 0 && rule.hadithReference?.trim()) {
    list.push(rule.hadithReference.trim());
  }
  return list;
}

export function getPolicyYouTubeUrls(rule: PolicyRule): string[] {
  const list: string[] = [];
  if (rule.youtubeUrls && Array.isArray(rule.youtubeUrls)) {
    rule.youtubeUrls.forEach((u) => {
      if (u && typeof u === 'string' && u.trim()) list.push(u.trim());
    });
  }
  if (list.length === 0 && rule.youtubeUrl?.trim()) {
    list.push(rule.youtubeUrl.trim());
  }
  return list;
}

export interface ThemeConfig {
  mode: 'dark' | 'light';
  accent: AccentColor;
  customHex?: string;
  particleIntensity: 'low' | 'medium' | 'high' | 'off';
  cursorTrail?: boolean;
}

