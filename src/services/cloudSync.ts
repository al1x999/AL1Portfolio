import type {
  BrandInfo,
  SoftwareSkill,
  VideoProject,
  Category,
  HubLink,
  ClientReview,
  PolicyRule,
  ThemeConfig,
} from '../types/portfolio';

export interface FullPortfolioData {
  brand: BrandInfo;
  skills: SoftwareSkill[];
  videos: VideoProject[];
  categories: Category[];
  links: HubLink[];
  reviews: ClientReview[];
  policyRules: PolicyRule[];
  policyNotice: string;
  theme: ThemeConfig;
  updatedAt?: string;
}

export interface CloudSyncConfig {
  provider: 'firebase' | 'github' | 'custom_rest';
  firebaseUrl: string; // e.g. https://al1-portfolio-default-rtdb.firebaseio.com
  customRestUrl: string;
  customApiKey: string;
  githubToken: string;
  githubRepo: string; // default: 'al1x999/AL1Portfolio'
  githubBranch: string; // default: 'main'
  autoSync: boolean;
  lastSyncedAt?: string;
}

export const DEFAULT_CLOUD_CONFIG: CloudSyncConfig = {
  provider: 'firebase',
  firebaseUrl: '',
  customRestUrl: '',
  customApiKey: '',
  githubToken: '',
  githubRepo: 'al1x999/AL1Portfolio',
  githubBranch: 'main',
  autoSync: true,
};

const CLOUD_CONFIG_STORAGE_KEY = 'al1_studio_cloud_config_v1';

export function loadCloudConfig(): CloudSyncConfig {
  try {
    const saved = localStorage.getItem(CLOUD_CONFIG_STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_CLOUD_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load cloud config', e);
  }
  return DEFAULT_CLOUD_CONFIG;
}

export function saveCloudConfig(config: CloudSyncConfig): void {
  try {
    localStorage.setItem(CLOUD_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save cloud config', e);
  }
}

// Normalize Firebase Realtime Database URL
function getFirebaseEndpoint(baseUrl: string): string {
  let clean = baseUrl.trim().replace(/\/+$/, '');
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    clean = `https://${clean}`;
  }
  if (!clean.endsWith('.json')) {
    clean = `${clean}/portfolio.json`;
  }
  return clean;
}

// Fetch latest data from Cloud Database
export async function fetchFromCloud(config: CloudSyncConfig): Promise<FullPortfolioData | null> {
  // 1. Firebase Provider
  if (config.provider === 'firebase' && config.firebaseUrl?.trim()) {
    try {
      const url = getFirebaseEndpoint(config.firebaseUrl);
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object' && (data.brand || data.videos || data.reviews)) {
          return data as FullPortfolioData;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch from Firebase Cloud DB', e);
    }
  }

  // 2. Custom REST Provider
  if (config.provider === 'custom_rest' && config.customRestUrl?.trim()) {
    try {
      const headers: Record<string, string> = { 'Accept': 'application/json' };
      if (config.customApiKey?.trim()) {
        headers['Authorization'] = `Bearer ${config.customApiKey.trim()}`;
        headers['x-api-key'] = config.customApiKey.trim();
      }
      const res = await fetch(config.customRestUrl.trim(), { headers, cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          return data as FullPortfolioData;
        }
      }
    } catch (e) {
      console.warn('Failed to fetch from Custom REST', e);
    }
  }

  // 3. Fallback: Check static public JSON file deployed with site
  try {
    const res = await fetch('/portfolioData.json', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data === 'object' && (data.brand || data.videos)) {
        return data as FullPortfolioData;
      }
    }
  } catch {
    // Ignore fallback failure
  }

  return null;
}

// Save data to Cloud Database
export async function saveToCloud(
  config: CloudSyncConfig,
  data: FullPortfolioData
): Promise<{ success: boolean; message: string }> {
  const payload = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  // 1. Firebase Realtime Database
  if (config.provider === 'firebase') {
    if (!config.firebaseUrl?.trim()) {
      return {
        success: false,
        message: 'Firebase Realtime Database URL not provided. Please enter your Firebase URL.',
      };
    }

    try {
      const url = getFirebaseEndpoint(config.firebaseUrl);
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        return {
          success: false,
          message: `Firebase error (${res.status}): ${errText || 'Permission denied or invalid URL'}`,
        };
      }

      return {
        success: true,
        message: 'Successfully synced to Firebase Realtime Database! All browsers now see this update.',
      };
    } catch (e: any) {
      return {
        success: false,
        message: `Network error connecting to Firebase: ${e.message || String(e)}`,
      };
    }
  }

  // 2. Custom REST Provider
  if (config.provider === 'custom_rest') {
    if (!config.customRestUrl?.trim()) {
      return {
        success: false,
        message: 'Custom REST URL not provided.',
      };
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (config.customApiKey?.trim()) {
        headers['Authorization'] = `Bearer ${config.customApiKey.trim()}`;
        headers['x-api-key'] = config.customApiKey.trim();
      }

      const res = await fetch(config.customRestUrl.trim(), {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        return {
          success: false,
          message: `Custom API error (${res.status})`,
        };
      }

      return {
        success: true,
        message: 'Successfully updated Custom Cloud endpoint!',
      };
    } catch (e: any) {
      return {
        success: false,
        message: `Error connecting to Custom REST: ${e.message || String(e)}`,
      };
    }
  }

  // 3. GitHub Direct Sync (Commits JSON to repository to auto-redeploy Vercel)
  if (config.provider === 'github') {
    if (!config.githubToken?.trim()) {
      return {
        success: false,
        message: 'GitHub Personal Access Token is required to commit to repository.',
      };
    }

    try {
      const repo = config.githubRepo?.trim() || 'al1x999/AL1Portfolio';
      const branch = config.githubBranch?.trim() || 'main';
      const filePath = 'public/portfolioData.json';
      const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;

      const headers = {
        Authorization: `Bearer ${config.githubToken.trim()}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      };

      // Get current SHA if file exists
      let sha: string | undefined;
      try {
        const getRes = await fetch(`${apiUrl}?ref=${branch}`, { headers });
        if (getRes.ok) {
          const fileData = await getRes.json();
          sha = fileData.sha;
        }
      } catch {}

      // UTF-8 base64 encoding
      const jsonStr = JSON.stringify(payload, null, 2);
      const encoded = btoa(unescape(encodeURIComponent(jsonStr)));

      const commitBody: any = {
        message: `Update portfolio content via Admin Panel [skip ci] (${new Date().toLocaleDateString()})`,
        content: encoded,
        branch,
      };
      if (sha) commitBody.sha = sha;

      const putRes = await fetch(apiUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify(commitBody),
      });

      if (!putRes.ok) {
        const err = await putRes.text();
        return {
          success: false,
          message: `GitHub commit failed (${putRes.status}): ${err}`,
        };
      }

      return {
        success: true,
        message: 'Committed to GitHub! Vercel will automatically redeploy the latest changes to your live domain in ~1 minute.',
      };
    } catch (e: any) {
      return {
        success: false,
        message: `GitHub Sync error: ${e.message || String(e)}`,
      };
    }
  }

  return { success: false, message: 'No valid cloud provider selected.' };
}

// Helper to generate full initialData.ts TypeScript source code from current state
export function generateInitialDataTs(data: FullPortfolioData): string {
  return `import type {
  BrandInfo,
  SoftwareSkill,
  VideoProject,
  Category,
  HubLink,
  ClientReview,
  ThemeConfig,
  PolicyRule,
} from '../types/portfolio';

export const INITIAL_BRAND: BrandInfo = ${JSON.stringify(data.brand, null, 2)};

export const INITIAL_SKILLS: SoftwareSkill[] = ${JSON.stringify(data.skills, null, 2)};

export const INITIAL_CATEGORIES: Category[] = ${JSON.stringify(data.categories, null, 2)};

export const INITIAL_VIDEOS: VideoProject[] = ${JSON.stringify(data.videos, null, 2)};

export const INITIAL_LINKS: HubLink[] = ${JSON.stringify(data.links, null, 2)};

export const INITIAL_REVIEWS: ClientReview[] = ${JSON.stringify(data.reviews, null, 2)};

export const INITIAL_POLICY_RULES: PolicyRule[] = ${JSON.stringify(data.policyRules, null, 2)};

export const INITIAL_POLICY_NOTICE: string = ${JSON.stringify(data.policyNotice)};

export const INITIAL_THEME: ThemeConfig = ${JSON.stringify(data.theme, null, 2)};
`;
}
