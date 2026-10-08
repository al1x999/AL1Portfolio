import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import type {
  BrandInfo,
  SoftwareSkill,
  VideoProject,
  Category,
  HubLink,
  ClientReview,
  ThemeConfig,
  PolicyRule,
  BackgroundMusicConfig,
  IntroScreenConfig,
} from '../types/portfolio';
import {
  INITIAL_BRAND,
  INITIAL_SKILLS,
  INITIAL_VIDEOS,
  INITIAL_CATEGORIES,
  INITIAL_LINKS,
  INITIAL_REVIEWS,
  INITIAL_THEME,
  INITIAL_POLICY_RULES,
  INITIAL_POLICY_NOTICE,
  INITIAL_BACKGROUND_MUSIC,
  INITIAL_INTRO_CONFIG,
} from '../data/initialData';
import {
  type FullPortfolioData,
  type CloudSyncConfig,
  loadCloudConfig,
  saveCloudConfig,
  fetchFromCloud,
  saveToCloud,
} from '../services/cloudSync';

interface PortfolioContextType {
  // Brand
  brand: BrandInfo;
  updateBrand: (updates: Partial<BrandInfo>) => void;

  // Skills
  skills: SoftwareSkill[];
  addSkill: (skill: Omit<SoftwareSkill, 'id' | 'order'>) => void;
  updateSkill: (id: string, updates: Partial<SoftwareSkill>) => void;
  deleteSkill: (id: string) => void;
  reorderSkills: (newSkills: SoftwareSkill[]) => void;

  // Videos
  videos: VideoProject[];
  addVideo: (video: Omit<VideoProject, 'id' | 'order'>) => void;
  updateVideo: (id: string, updates: Partial<VideoProject>) => void;
  deleteVideo: (id: string) => void;
  reorderVideos: (newVideos: VideoProject[]) => void;
  toggleFeatured: (id: string) => void;

  // Categories
  categories: Category[];
  addCategory: (name: string) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  reorderCategories: (newCategories: Category[]) => void;

  // Social & Link Hub
  links: HubLink[];
  addLink: (link: Omit<HubLink, 'id' | 'order'>) => void;
  updateLink: (id: string, updates: Partial<HubLink>) => void;
  deleteLink: (id: string) => void;
  reorderLinks: (newLinks: HubLink[]) => void;
  toggleLinkActive: (id: string) => void;

  // Reviews
  reviews: ClientReview[];
  addReview: (review: Omit<ClientReview, 'id' | 'order'>) => void;
  updateReview: (id: string, updates: Partial<ClientReview>) => void;
  deleteReview: (id: string) => void;
  reorderReviews: (newReviews: ClientReview[]) => void;

  // Policy & Guidelines (কাজের নীতিমালা)
  policyRules: PolicyRule[];
  policyNotice: string;
  addPolicyRule: (rule: Omit<PolicyRule, 'id' | 'order'>) => void;
  updatePolicyRule: (id: string, updates: Partial<PolicyRule>) => void;
  deletePolicyRule: (id: string) => void;
  reorderPolicyRules: (newRules: PolicyRule[]) => void;
  updatePolicyNotice: (notice: string) => void;

  // Theme
  theme: ThemeConfig;
  updateTheme: (updates: Partial<ThemeConfig>) => void;

  // Background Music & Ambient Sound
  backgroundMusic: BackgroundMusicConfig;
  updateBackgroundMusic: (updates: Partial<BackgroundMusicConfig>) => void;

  // Intro Screen
  introConfig: IntroScreenConfig;
  updateIntroConfig: (updates: Partial<IntroScreenConfig>) => void;

  // Lightbox Modal
  activeVideo: VideoProject | null;
  openVideoModal: (video: VideoProject) => void;
  closeVideoModal: () => void;

  // Media Playback Coordination (Background Music vs Portfolio Video)
  isVideoPlaying: boolean;
  setIsVideoPlaying: (playing: boolean) => void;
  pauseBackgroundMusic: () => void;
  resumeBackgroundMusic: () => void;
  startBackgroundMusic: () => void;
  registerBackgroundMusicControls: (controls: {
    pause: () => void;
    resume: () => void;
    isPlaying: () => boolean;
  } | null) => void;

  // Admin Auth
  isAdmin: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  adminPassword: string;
  updateAdminPassword: (newPass: string) => void;

  // Backup & Restore
  exportPortfolioData: () => void;
  importPortfolioData: (jsonData: string) => boolean;
  resetToDefaultData: () => void;

  // Cloud Database & Multi-Browser Sync
  cloudConfig: CloudSyncConfig;
  updateCloudConfig: (updates: Partial<CloudSyncConfig>) => void;
  syncStatus: 'idle' | 'syncing' | 'synced' | 'error';
  syncMessage: string | null;
  syncToCloudNow: () => Promise<{ success: boolean; message: string }>;
  fetchFromCloudNow: () => Promise<boolean>;
}

const STORAGE_KEYS = {
  BRAND: 'al1_studio_brand_v1',
  SKILLS: 'al1_studio_skills_v1',
  VIDEOS: 'al1_studio_videos_v1',
  CATEGORIES: 'al1_studio_categories_v1',
  LINKS: 'al1_studio_links_v1',
  REVIEWS: 'al1_studio_reviews_v1',
  POLICY_RULES: 'al1_studio_policy_rules_v1',
  POLICY_NOTICE: 'al1_studio_policy_notice_v1',
  THEME: 'al1_studio_theme_v1',
  ADMIN_PASS: 'al1_studio_admin_pass_v1',
  BACKGROUND_MUSIC: 'al1_studio_bg_music_v1',
  INTRO: 'al1_studio_intro_v1',
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Brand state
  const [brand, setBrand] = useState<BrandInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BRAND);
      return saved ? JSON.parse(saved) : INITIAL_BRAND;
    } catch {
      return INITIAL_BRAND;
    }
  });

  // Skills state
  const [skills, setSkills] = useState<SoftwareSkill[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SKILLS);
      return saved ? JSON.parse(saved) : INITIAL_SKILLS;
    } catch {
      return INITIAL_SKILLS;
    }
  });

  // Videos state
  const [videos, setVideos] = useState<VideoProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VIDEOS);
      return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
    } catch {
      return INITIAL_VIDEOS;
    }
  });

  // Categories state
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  // Social Link Hub state
  const [links, setLinks] = useState<HubLink[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LINKS);
      return saved ? JSON.parse(saved) : INITIAL_LINKS;
    } catch {
      return INITIAL_LINKS;
    }
  });

  // Reviews state
  const [reviews, setReviews] = useState<ClientReview[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  // Policy rules & notice state
  const [policyRules, setPolicyRules] = useState<PolicyRule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POLICY_RULES);
      return saved ? JSON.parse(saved) : INITIAL_POLICY_RULES;
    } catch {
      return INITIAL_POLICY_RULES;
    }
  });

  const [policyNotice, setPolicyNotice] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POLICY_NOTICE);
      return saved || INITIAL_POLICY_NOTICE;
    } catch {
      return INITIAL_POLICY_NOTICE;
    }
  });

  // Theme state
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      return saved ? JSON.parse(saved) : INITIAL_THEME;
    } catch {
      return INITIAL_THEME;
    }
  });

  // Background Music state
  const [backgroundMusic, setBackgroundMusic] = useState<BackgroundMusicConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BACKGROUND_MUSIC);
      return saved ? { ...INITIAL_BACKGROUND_MUSIC, ...JSON.parse(saved) } : INITIAL_BACKGROUND_MUSIC;
    } catch {
      return INITIAL_BACKGROUND_MUSIC;
    }
  });

  const updateBackgroundMusic = (updates: Partial<BackgroundMusicConfig>) => {
    setBackgroundMusic((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEYS.BACKGROUND_MUSIC, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Intro Screen state
  const [introConfig, setIntroConfig] = useState<IntroScreenConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INTRO);
      return saved ? { ...INITIAL_INTRO_CONFIG, ...JSON.parse(saved) } : INITIAL_INTRO_CONFIG;
    } catch {
      return INITIAL_INTRO_CONFIG;
    }
  });

  const updateIntroConfig = (updates: Partial<IntroScreenConfig>) => {
    setIntroConfig((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_KEYS.INTRO, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Admin password & auth state
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_PASS) || 'admin123';
    } catch {
      return 'admin123';
    }
  });
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('al1_studio_auth') === 'true';
  });

  // Active Lightbox Modal
  const [activeVideo, setActiveVideo] = useState<VideoProject | null>(null);

  // Media Playback Coordination (Background Music vs Portfolio Video)
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const bgControlsRef = useRef<{
    pause: () => void;
    resume: () => void;
    isPlaying: () => boolean;
  } | null>(null);

  const registerBackgroundMusicControls = useCallback(
    (controls: { pause: () => void; resume: () => void; isPlaying: () => boolean } | null) => {
      bgControlsRef.current = controls;
    },
    []
  );

  const pauseBackgroundMusic = useCallback(() => {
    setIsVideoPlaying(true);
    if (bgControlsRef.current) {
      bgControlsRef.current.pause();
    }
    window.dispatchEvent(new CustomEvent('al1:pause-bg-music'));
  }, []);

  const resumeBackgroundMusic = useCallback(() => {
    setIsVideoPlaying(false);
    if (bgControlsRef.current) {
      bgControlsRef.current.resume();
    }
    window.dispatchEvent(new CustomEvent('al1:resume-bg-music'));
  }, []);

  const startBackgroundMusic = useCallback(() => {
    (window as any).__al1UserInteracted = true;
    if (bgControlsRef.current) {
      if (typeof (bgControlsRef.current as any).play === 'function') {
        (bgControlsRef.current as any).play();
      } else {
        bgControlsRef.current.resume();
      }
    }
    window.dispatchEvent(new CustomEvent('al1:start-music'));
    if (typeof (window as any).__unlockBgAudio === 'function') {
      try {
        (window as any).__unlockBgAudio();
      } catch {}
    }
  }, []);

  // Cloud Database & Multi-Browser Sync state
  const [cloudConfig, setCloudConfig] = useState<CloudSyncConfig>(() => loadCloudConfig());
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle');
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const hasHydratedRef = useRef(false);
  const syncTimerRef = useRef<any>(null);

  // Apply Theme to Document root
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme.mode);
    root.setAttribute('data-accent', theme.accent);

    if (theme.customHex) {
      root.style.setProperty('--accent', theme.customHex);
    } else {
      root.style.removeProperty('--accent');
    }

    try {
      localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(theme));
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  // Brand updater
  const updateBrand = (updates: Partial<BrandInfo>) => {
    const updated = { ...brand, ...updates };
    setBrand(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.BRAND, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Skills handlers
  const addSkill = (skillData: Omit<SoftwareSkill, 'id' | 'order'>) => {
    const newSkill: SoftwareSkill = {
      ...skillData,
      id: `skill-${Date.now()}`,
      order: skills.length + 1,
    };
    const updated = [...skills, newSkill];
    setSkills(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const updateSkill = (id: string, updates: Partial<SoftwareSkill>) => {
    const updated = skills.map((s) => (s.id === id ? { ...s, ...updates } : s));
    setSkills(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteSkill = (id: string) => {
    const updated = skills.filter((s) => s.id !== id);
    setSkills(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const reorderSkills = (newSkills: SoftwareSkill[]) => {
    const updated = newSkills.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSkills(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Videos handlers
  const addVideo = (videoData: Omit<VideoProject, 'id' | 'order'>) => {
    const newVideo: VideoProject = {
      ...videoData,
      id: `vid-${Date.now()}`,
      order: 1, // Add to top
    };
    const updated = [newVideo, ...videos.map((v) => ({ ...v, order: v.order + 1 }))];
    setVideos(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const updateVideo = (id: string, updates: Partial<VideoProject>) => {
    const updated = videos.map((v) => (v.id === id ? { ...v, ...updates } : v));
    setVideos(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteVideo = (id: string) => {
    const updated = videos.filter((v) => v.id !== id);
    setVideos(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const reorderVideos = (newVideos: VideoProject[]) => {
    const updated = newVideos.map((v, idx) => ({ ...v, order: idx + 1 }));
    setVideos(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleFeatured = (id: string) => {
    const updated = videos.map((v) => (v.id === id ? { ...v, isFeatured: !v.isFeatured } : v));
    setVideos(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Categories handlers
  const addCategory = (name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      order: categories.length + 1,
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const updateCategory = (id: string, name: string) => {
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const updated = categories.map((c) => (c.id === id ? { ...c, name, slug } : c));
    setCategories(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteCategory = (id: string) => {
    const updated = categories.filter((c) => c.id !== id);
    setCategories(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const reorderCategories = (newCategories: Category[]) => {
    const updated = newCategories.map((c, idx) => ({ ...c, order: idx + 1 }));
    setCategories(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Link Hub handlers
  const addLink = (linkData: Omit<HubLink, 'id' | 'order'>) => {
    const newLink: HubLink = {
      ...linkData,
      id: `link-${Date.now()}`,
      order: links.length + 1,
    };
    const updated = [...links, newLink];
    setLinks(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const updateLink = (id: string, updates: Partial<HubLink>) => {
    const updated = links.map((l) => (l.id === id ? { ...l, ...updates } : l));
    setLinks(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteLink = (id: string) => {
    const updated = links.filter((l) => l.id !== id);
    setLinks(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const reorderLinks = (newLinks: HubLink[]) => {
    const updated = newLinks.map((l, idx) => ({ ...l, order: idx + 1 }));
    setLinks(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleLinkActive = (id: string) => {
    const updated = links.map((l) => (l.id === id ? { ...l, isActive: !l.isActive } : l));
    setLinks(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Reviews handlers
  const addReview = (reviewData: Omit<ClientReview, 'id' | 'order'>) => {
    const newRev: ClientReview = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      order: reviews.length + 1,
    };
    const updated = [newRev, ...reviews];
    setReviews(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const updateReview = (id: string, updates: Partial<ClientReview>) => {
    const updated = reviews.map((r) => (r.id === id ? { ...r, ...updates } : r));
    setReviews(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const deleteReview = (id: string) => {
    const updated = reviews.filter((r) => r.id !== id);
    setReviews(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const reorderReviews = (newReviews: ClientReview[]) => {
    const updated = newReviews.map((r, idx) => ({ ...r, order: idx + 1 }));
    setReviews(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Policy Rules handlers
  const addPolicyRule = (ruleData: Omit<PolicyRule, 'id' | 'order'>) => {
    const newRule: PolicyRule = {
      ...ruleData,
      id: `rule-${Date.now()}`,
      order: policyRules.length + 1,
    };
    const updated = [...policyRules, newRule];
    setPolicyRules(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.POLICY_RULES, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const updatePolicyRule = (id: string, updates: Partial<PolicyRule>) => {
    const updated = policyRules.map((r) => (r.id === id ? { ...r, ...updates } : r));
    setPolicyRules(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.POLICY_RULES, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const deletePolicyRule = (id: string) => {
    const updated = policyRules.filter((r) => r.id !== id);
    setPolicyRules(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.POLICY_RULES, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const reorderPolicyRules = (newRules: PolicyRule[]) => {
    const updated = newRules.map((r, idx) => ({ ...r, order: idx + 1 }));
    setPolicyRules(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.POLICY_RULES, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const updatePolicyNotice = (notice: string) => {
    setPolicyNotice(notice);
    try {
      localStorage.setItem(STORAGE_KEYS.POLICY_NOTICE, notice);
    } catch (e) {
      console.error(e);
    }
  };

  // Theme
  const updateTheme = (updates: Partial<ThemeConfig>) => {
    setTheme((prev) => ({ ...prev, ...updates }));
  };

  // Lightbox
  const openVideoModal = (video: VideoProject) => {
    pauseBackgroundMusic();
    setActiveVideo(video);
  };

  const closeVideoModal = () => {
    setActiveVideo(null);
    resumeBackgroundMusic();
  };

  // Admin Auth
  const loginAdmin = (password: string) => {
    if (password === adminPassword) {
      setIsAdmin(true);
      sessionStorage.setItem('al1_studio_auth', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('al1_studio_auth');
  };

  const updateAdminPassword = (newPass: string) => {
    setAdminPassword(newPass);
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_PASS, newPass);
    } catch (e) {
      console.error(e);
    }
  };

  // Export / Import / Reset
  const exportPortfolioData = () => {
    const data = {
      brand,
      skills,
      videos,
      categories,
      links,
      reviews,
      policyRules,
      policyNotice,
      theme,
      backgroundMusic,
      introConfig,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `al1_studio_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const applyAllData = (parsed: Partial<FullPortfolioData>) => {
    try {
      if (parsed.brand) {
        setBrand(parsed.brand);
        localStorage.setItem(STORAGE_KEYS.BRAND, JSON.stringify(parsed.brand));
      }
      if (parsed.skills && Array.isArray(parsed.skills)) {
        setSkills(parsed.skills);
        localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(parsed.skills));
      }
      if (parsed.videos && Array.isArray(parsed.videos)) {
        setVideos(parsed.videos);
        localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(parsed.videos));
      }
      if (parsed.categories && Array.isArray(parsed.categories)) {
        setCategories(parsed.categories);
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(parsed.categories));
      }
      if (parsed.links && Array.isArray(parsed.links)) {
        setLinks(parsed.links);
        localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(parsed.links));
      }
      if (parsed.reviews && Array.isArray(parsed.reviews)) {
        setReviews(parsed.reviews);
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(parsed.reviews));
      }
      if (parsed.policyRules && Array.isArray(parsed.policyRules)) {
        setPolicyRules(parsed.policyRules);
        localStorage.setItem(STORAGE_KEYS.POLICY_RULES, JSON.stringify(parsed.policyRules));
      }
      if (parsed.policyNotice && typeof parsed.policyNotice === 'string') {
        setPolicyNotice(parsed.policyNotice);
        localStorage.setItem(STORAGE_KEYS.POLICY_NOTICE, parsed.policyNotice);
      }
      if (parsed.theme) {
        setTheme(parsed.theme);
        localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(parsed.theme));
      }
      if (parsed.backgroundMusic) {
        setBackgroundMusic((prev) => ({ ...prev, ...parsed.backgroundMusic }));
        localStorage.setItem(STORAGE_KEYS.BACKGROUND_MUSIC, JSON.stringify(parsed.backgroundMusic));
      }
      if (parsed.introConfig) {
        setIntroConfig((prev) => ({ ...prev, ...parsed.introConfig }));
        localStorage.setItem(STORAGE_KEYS.INTRO, JSON.stringify(parsed.introConfig));
      }
    } catch (e) {
      console.error('Failed to apply data:', e);
    }
  };

  const importPortfolioData = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      applyAllData(parsed);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  const resetToDefaultData = () => {
    setBrand(INITIAL_BRAND);
    setSkills(INITIAL_SKILLS);
    setVideos(INITIAL_VIDEOS);
    setCategories(INITIAL_CATEGORIES);
    setLinks(INITIAL_LINKS);
    setReviews(INITIAL_REVIEWS);
    setPolicyRules(INITIAL_POLICY_RULES);
    setPolicyNotice(INITIAL_POLICY_NOTICE);
    setTheme(INITIAL_THEME);
    setBackgroundMusic(INITIAL_BACKGROUND_MUSIC);
    setIntroConfig(INITIAL_INTRO_CONFIG);
    localStorage.removeItem(STORAGE_KEYS.BRAND);
    localStorage.removeItem(STORAGE_KEYS.SKILLS);
    localStorage.removeItem(STORAGE_KEYS.VIDEOS);
    localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
    localStorage.removeItem(STORAGE_KEYS.LINKS);
    localStorage.removeItem(STORAGE_KEYS.REVIEWS);
    localStorage.removeItem(STORAGE_KEYS.POLICY_RULES);
    localStorage.removeItem(STORAGE_KEYS.POLICY_NOTICE);
    localStorage.removeItem(STORAGE_KEYS.THEME);
    localStorage.removeItem(STORAGE_KEYS.BACKGROUND_MUSIC);
    localStorage.removeItem(STORAGE_KEYS.INTRO);
  };

  // Update Cloud Sync Config
  const updateCloudConfig = (updates: Partial<CloudSyncConfig>) => {
    setCloudConfig((prev) => {
      const next = { ...prev, ...updates };
      saveCloudConfig(next);
      return next;
    });
  };

  // Sync current state to Cloud DB
  const syncToCloudNow = async (): Promise<{ success: boolean; message: string }> => {
    setSyncStatus('syncing');
    setSyncMessage('Saving portfolio data to cloud database...');
    const payload: FullPortfolioData = {
      brand,
      skills,
      videos,
      categories,
      links,
      reviews,
      policyRules,
      policyNotice,
      theme,
      backgroundMusic,
    };
    const res = await saveToCloud(cloudConfig, payload);
    if (res.success) {
      setSyncStatus('synced');
      setSyncMessage(res.message);
      updateCloudConfig({ lastSyncedAt: new Date().toISOString() });
    } else {
      setSyncStatus('error');
      setSyncMessage(res.message);
    }
    return res;
  };

  // Fetch latest updates from Cloud DB
  const fetchFromCloudNow = async (): Promise<boolean> => {
    setSyncStatus('syncing');
    setSyncMessage('Fetching latest updates from cloud...');
    const data = await fetchFromCloud(cloudConfig);
    if (data) {
      applyAllData(data);
      setSyncStatus('synced');
      setSyncMessage('Synced with cloud database successfully.');
      return true;
    } else {
      setSyncStatus('error');
      setSyncMessage('Could not fetch cloud data. Verify your database URL or network.');
      return false;
    }
  };

  // Initial Cloud Hydration: Runs on every browser load
  useEffect(() => {
    let isMounted = true;
    const hydrate = async () => {
      try {
        let activeConfig = cloudConfig;
        // Check if there is a shared public config file on the server
        if (!activeConfig.firebaseUrl) {
          try {
            const cfgRes = await fetch('/cloudConfig.json', { cache: 'no-store' });
            if (cfgRes.ok) {
              const cfgData = await cfgRes.json();
              if (cfgData.firebaseUrl) {
                activeConfig = { ...activeConfig, ...cfgData };
                setCloudConfig(activeConfig);
              }
            }
          } catch {}
        }

        const remote = await fetchFromCloud(activeConfig);
        if (remote && isMounted) {
          applyAllData(remote);
          setSyncStatus('synced');
          setSyncMessage('Portfolio content synchronized with cloud.');
        }
      } catch (err) {
        console.warn('Initial cloud sync check:', err);
      } finally {
        if (isMounted) {
          hasHydratedRef.current = true;
        }
      }
    };

    hydrate();
    return () => {
      isMounted = false;
    };
  }, []);

  // Debounced Auto-Sync: When admin edits content, automatically push to cloud DB
  useEffect(() => {
    if (!hasHydratedRef.current) return;
    if (!cloudConfig.autoSync) return;
    const hasEndpoint =
      (cloudConfig.provider === 'firebase' && !!cloudConfig.firebaseUrl?.trim()) ||
      (cloudConfig.provider === 'custom_rest' && !!cloudConfig.customRestUrl?.trim());

    if (!hasEndpoint) return;

    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    syncTimerRef.current = setTimeout(async () => {
      setSyncStatus('syncing');
      const payload: FullPortfolioData = {
        brand,
        skills,
        videos,
        categories,
        links,
        reviews,
        policyRules,
        policyNotice,
        theme,
        backgroundMusic,
      };
      const res = await saveToCloud(cloudConfig, payload);
      if (res.success) {
        setSyncStatus('synced');
        setSyncMessage('Changes auto-synced to cloud database!');
        updateCloudConfig({ lastSyncedAt: new Date().toISOString() });
      } else {
        setSyncStatus('error');
        setSyncMessage(res.message);
      }
    }, 2000);

    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    };
  }, [brand, skills, videos, categories, links, reviews, policyRules, policyNotice, theme, backgroundMusic]);

  return (
    <PortfolioContext.Provider
      value={{
        brand,
        updateBrand,
        skills,
        addSkill,
        updateSkill,
        deleteSkill,
        reorderSkills,
        videos,
        addVideo,
        updateVideo,
        deleteVideo,
        reorderVideos,
        toggleFeatured,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategories,
        links,
        addLink,
        updateLink,
        deleteLink,
        reorderLinks,
        toggleLinkActive,
        reviews,
        addReview,
        updateReview,
        deleteReview,
        reorderReviews,
        policyRules,
        policyNotice,
        addPolicyRule,
        updatePolicyRule,
        deletePolicyRule,
        reorderPolicyRules,
        updatePolicyNotice,
        theme,
        updateTheme,
        backgroundMusic,
        updateBackgroundMusic,
        introConfig,
        updateIntroConfig,
        activeVideo,
        openVideoModal,
        closeVideoModal,
        isVideoPlaying,
        setIsVideoPlaying,
        pauseBackgroundMusic,
        resumeBackgroundMusic,
        startBackgroundMusic,
        registerBackgroundMusicControls,
        isAdmin,
        loginAdmin,
        logoutAdmin,
        adminPassword,
        updateAdminPassword,
        exportPortfolioData,
        importPortfolioData,
        resetToDefaultData,
        cloudConfig,
        updateCloudConfig,
        syncStatus,
        syncMessage,
        syncToCloudNow,
        fetchFromCloudNow,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};

