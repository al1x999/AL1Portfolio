import React, { useState } from 'react';
import {
  X,
  Lock,
  Unlock,
  Video,
  Layers,
  Share2,
  Star,
  Cpu,
  Settings,
  Plus,
  Trash2,
  Edit3,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  Film,
  Key,
  Palette,
  Sun,
  Moon,
  Camera,
  Play,
  FileText,
  MessageCircle,
  BookOpen,
  Info,
  ShieldCheck,
  Cloud,
  UploadCloud,
  RefreshCw,
  Copy,
  ExternalLink,
  Database,
} from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { generateInitialDataTs } from '../../services/cloudSync';
import type {
  VideoProject,
  HubLink,
  ClientReview,
  SoftwareSkill,
  AspectRatio,
  AccentColor,
  LinkIconType,
  PolicyRule,
  PinColor,
} from '../../types/portfolio';

const YouTubeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={`fill-current ${className}`} viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const GithubIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={`fill-current ${className}`} viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

import { extractYouTubeId } from '../../utils/youtube';

const SOCIAL_PRESETS: {
  name: string;
  icon: LinkIconType;
  color: string;
  defaultTitle: string;
  defaultSubtitle: string;
  urlPrefix: string;
  defaultBadge: string;
}[] = [
  {
    name: 'YouTube',
    icon: 'youtube',
    color: '#ef4444',
    defaultTitle: 'YouTube Channel',
    defaultSubtitle: 'Watch long-form edits & client breakdowns',
    urlPrefix: 'https://youtube.com/@',
    defaultBadge: 'Main Hub',
  },
  {
    name: 'TikTok',
    icon: 'tiktok',
    color: '#f43f5e',
    defaultTitle: 'TikTok Viral Reels',
    defaultSubtitle: 'High retention hooks & trending shorts',
    urlPrefix: 'https://tiktok.com/@',
    defaultBadge: '14M+ Views',
  },
  {
    name: 'WhatsApp',
    icon: 'whatsapp',
    color: '#10b981',
    defaultTitle: 'Instant WhatsApp Chat',
    defaultSubtitle: 'Fastest response time (< 15 mins for project quotes)',
    urlPrefix: 'https://wa.me/',
    defaultBadge: 'Direct Contact',
  },
  {
    name: 'Instagram',
    icon: 'instagram',
    color: '#ec4899',
    defaultTitle: 'Instagram Profile',
    defaultSubtitle: 'Timeline screenshots & behind the scenes',
    urlPrefix: 'https://instagram.com/',
    defaultBadge: 'Visuals',
  },
  {
    name: 'Discord',
    icon: 'discord',
    color: '#5865F2',
    defaultTitle: 'Discord Community',
    defaultSubtitle: 'Creator hangouts & timeline peer review',
    urlPrefix: 'https://discord.gg/',
    defaultBadge: 'Community',
  },
  {
    name: 'Telegram',
    icon: 'telegram',
    color: '#229ED9',
    defaultTitle: 'Telegram Channel',
    defaultSubtitle: 'Direct project updates & asset drops',
    urlPrefix: 'https://t.me/',
    defaultBadge: 'Fast Updates',
  },
  {
    name: 'X / Twitter',
    icon: 'x',
    color: '#ffffff',
    defaultTitle: 'X (Twitter)',
    defaultSubtitle: 'Daily video editing tips & thoughts',
    urlPrefix: 'https://x.com/',
    defaultBadge: 'Follow',
  },
  {
    name: 'Facebook',
    icon: 'facebook',
    color: '#3b82f6',
    defaultTitle: 'Facebook Page',
    defaultSubtitle: 'Client releases & studio announcements',
    urlPrefix: 'https://facebook.com/',
    defaultBadge: 'Official',
  },
  {
    name: 'Twitch',
    icon: 'twitch',
    color: '#9146FF',
    defaultTitle: 'Twitch Stream',
    defaultSubtitle: 'Live editing sessions & gameplay',
    urlPrefix: 'https://twitch.tv/',
    defaultBadge: 'Live',
  },
  {
    name: 'Spotify',
    icon: 'spotify',
    color: '#1ED760',
    defaultTitle: 'Spotify Playlist',
    defaultSubtitle: 'Editing focus & sound design soundtrack',
    urlPrefix: 'https://open.spotify.com/',
    defaultBadge: 'Music',
  },
  {
    name: 'GitHub',
    icon: 'github',
    color: '#f0f6fc',
    defaultTitle: 'GitHub Profile',
    defaultSubtitle: 'Open-source tools & automation scripts',
    urlPrefix: 'https://github.com/',
    defaultBadge: 'Dev',
  },
  {
    name: 'Steam',
    icon: 'steam',
    color: '#66c0f4',
    defaultTitle: 'Steam Profile',
    defaultSubtitle: 'Gaming highlights & esports frag clips',
    urlPrefix: 'https://steamcommunity.com/id/',
    defaultBadge: 'Gamer',
  },
  {
    name: 'Email',
    icon: 'mail',
    color: '#06b6d4',
    defaultTitle: 'Business Email',
    defaultSubtitle: 'contact@al1studio.com',
    urlPrefix: 'mailto:',
    defaultBadge: 'Official',
  },
];

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AdminTab = 'videos' | 'policy' | 'categories' | 'links' | 'reviews' | 'skills' | 'settings';

export const AdminModal: React.FC<AdminModalProps> = ({ isOpen, onClose }) => {
  const {
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
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<AdminTab>('videos');

  // Auth form state
  const [passInput, setPassInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Password change state
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passFeedback, setPassFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // In-UI Safe Delete Confirmation States (NO popup blocker issues!)
  const [deleteConfirmVideoId, setDeleteConfirmVideoId] = useState<string | null>(null);
  const [deleteConfirmLinkId, setDeleteConfirmLinkId] = useState<string | null>(null);
  const [deleteConfirmCatId, setDeleteConfirmCatId] = useState<string | null>(null);
  const [deleteConfirmReviewId, setDeleteConfirmReviewId] = useState<string | null>(null);
  const [deleteConfirmSkillId, setDeleteConfirmSkillId] = useState<string | null>(null);

  // Video form state
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [videoForm, setVideoForm] = useState<{
    title: string;
    youtubeInput: string;
    category: string;
    aspectRatio: AspectRatio;
    client: string;
    duration: string;
    views: string;
    thumbnail: string;
    isFeatured: boolean;
  }>({
    title: '',
    youtubeInput: '',
    category: categories[1]?.slug || 'shorts',
    aspectRatio: '16:9',
    client: '',
    duration: '01:30',
    views: '1.2M',
    thumbnail: '',
    isFeatured: false,
  });

  // Inline Quick Add Category inside Video Form
  const [inlineNewCatName, setInlineNewCatName] = useState('');
  const [showInlineCatInput, setShowInlineCatInput] = useState(false);

  // Category form state
  const [newCatName, setNewCatName] = useState('');
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [editingCatName, setEditingCatName] = useState('');

  // Link form state
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [linkForm, setLinkForm] = useState<{
    title: string;
    subtitle: string;
    url: string;
    icon: LinkIconType;
    badge: string;
    accentColor: string;
    isActive: boolean;
  }>({
    title: '',
    subtitle: '',
    url: '',
    icon: 'youtube',
    badge: '',
    accentColor: '#ef4444',
    isActive: true,
  });

  // Review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [reviewForm, setReviewForm] = useState<{
    clientName: string;
    clientRole: string;
    rating: number;
    text: string;
    projectReference: string;
    clientPhoto: string;
    platformBadge: string;
    accentColor: string;
    isVerified: boolean;
    date: string;
  }>({
    clientName: '',
    clientRole: '',
    rating: 5,
    text: '',
    projectReference: '',
    clientPhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    platformBadge: 'YouTube Creator',
    accentColor: '#06b6d4',
    isVerified: true,
    date: 'Recent',
  });

  // Skill form state
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [skillForm, setSkillForm] = useState<{
    name: string;
    proficiency: number;
    badge: string;
    icon: string;
  }>({
    name: '',
    proficiency: 95,
    badge: 'Video Editing',
    icon: 'Film',
  });

  // Policy form state
  const [showPolicyForm, setShowPolicyForm] = useState(false);
  const [editingPolicyId, setEditingPolicyId] = useState<string | null>(null);
  const [deleteConfirmPolicyId, setDeleteConfirmPolicyId] = useState<string | null>(null);
  const [policyForm, setPolicyForm] = useState<{
    ruleNumber: string;
    title: string;
    description: string;
    hadithReference: string;
    detailedExplanation: string;
    youtubeUrl: string;
    pinColor: PinColor;
  }>({
    ruleNumber: '01',
    title: '',
    description: '',
    hadithReference: '',
    detailedExplanation: '',
    youtubeUrl: '',
    pinColor: 'red',
  });
  const [noticeInput, setNoticeInput] = useState(policyNotice);
  const [noticeSaved, setNoticeSaved] = useState(false);

  // Brand form state
  const [brandForm, setBrandForm] = useState(brand);
  const [brandSaved, setBrandSaved] = useState(false);

  // Backup / Import state
  const [importJson, setImportJson] = useState('');
  const [importMessage, setImportMessage] = useState<{ success: boolean; msg: string } | null>(null);

  // Cloud Database & Multi-Browser Sync state
  const [cloudForm, setCloudForm] = useState(cloudConfig);
  const [cloudFeedback, setCloudFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [copiedTs, setCopiedTs] = useState(false);
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [showFirebaseGuide, setShowFirebaseGuide] = useState(false);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

  if (!isOpen) return null;

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(passInput)) {
      setLoginError('');
      setPassInput('');
    } else {
      setLoginError('Incorrect password. Default PIN is: admin123');
    }
  };

  // Password change handler
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (oldPass !== adminPassword) {
      setPassFeedback({ type: 'error', msg: 'Current password does not match.' });
      return;
    }
    if (newPass.length < 4) {
      setPassFeedback({ type: 'error', msg: 'New password must be at least 4 characters.' });
      return;
    }
    updateAdminPassword(newPass);
    setOldPass('');
    setNewPass('');
    setPassFeedback({ type: 'success', msg: 'Admin password updated successfully!' });
    setTimeout(() => setPassFeedback(null), 3000);
  };

  // Brand save handler
  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    updateBrand(brandForm);
    setBrandSaved(true);
    setTimeout(() => setBrandSaved(false), 2000);
  };

  // Cloud Database Handlers
  const handleSaveCloudConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateCloudConfig(cloudForm);
    setCloudFeedback({ type: 'success', msg: 'Cloud settings saved successfully!' });
    setTimeout(() => setCloudFeedback(null), 3500);
  };

  const handleManualSyncNow = async () => {
    setIsCloudSyncing(true);
    updateCloudConfig(cloudForm);
    const res = await syncToCloudNow();
    setIsCloudSyncing(false);
    setCloudFeedback({ type: res.success ? 'success' : 'error', msg: res.message });
    setTimeout(() => setCloudFeedback(null), 6000);
  };

  const handleManualFetchNow = async () => {
    setIsCloudSyncing(true);
    updateCloudConfig(cloudForm);
    const ok = await fetchFromCloudNow();
    setIsCloudSyncing(false);
    setCloudFeedback({
      type: ok ? 'success' : 'error',
      msg: ok ? 'Successfully downloaded latest portfolio data from cloud!' : 'Could not fetch cloud data. Check URL/connection.',
    });
    setTimeout(() => setCloudFeedback(null), 5000);
  };

  const handleCopyInitialDataTs = () => {
    const fullData = {
      brand,
      skills,
      videos,
      categories,
      links,
      reviews,
      policyRules,
      policyNotice,
      theme,
    };
    const code = generateInitialDataTs(fullData);
    navigator.clipboard.writeText(code);
    setCopiedTs(true);
    setTimeout(() => setCopiedTs(false), 3000);
  };

  const handleDownloadCloudConfigJson = () => {
    const cfg = {
      provider: cloudForm.provider,
      firebaseUrl: cloudForm.firebaseUrl,
      customRestUrl: cloudForm.customRestUrl,
    };
    const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cloudConfig.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 3000);
  };

  const handleDownloadPortfolioDataJson = () => {
    const fullData = {
      brand,
      skills,
      videos,
      categories,
      links,
      reviews,
      policyRules,
      policyNotice,
      theme,
      updatedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolioData.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Live YouTube Input Handler (Auto-extract ID + auto thumbnail + auto 9:16 detection)
  const handleYouTubeInputChange = (val: string) => {
    const id = extractYouTubeId(val);
    const isShort = val.toLowerCase().includes('/shorts/');
    const autoThumb = id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : '';

    setVideoForm((prev) => ({
      ...prev,
      youtubeInput: val,
      aspectRatio: isShort ? '9:16' : prev.aspectRatio,
      thumbnail: autoThumb || prev.thumbnail,
      title: prev.title || (id ? `AL1 Edit - ${id}` : ''),
    }));
  };

  // Video save action
  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const ytId = extractYouTubeId(videoForm.youtubeInput);
    if (!ytId) {
      alert('Please enter a valid YouTube URL or 11-character video ID');
      return;
    }

    const ytUrl = `https://www.youtube.com/watch?v=${ytId}`;
    const autoThumb =
      videoForm.thumbnail.trim() || `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
    const finalTitle = videoForm.title.trim() || `AL1 Project - ${ytId}`;
    const finalCategory = videoForm.category || categories[1]?.slug || 'shorts';

    if (editingVideoId) {
      updateVideo(editingVideoId, {
        title: finalTitle,
        youtubeId: ytId,
        youtubeUrl: ytUrl,
        thumbnail: autoThumb,
        category: finalCategory,
        aspectRatio: videoForm.aspectRatio,
        client: videoForm.client || 'AL1 Client',
        duration: videoForm.duration || '01:30',
        views: videoForm.views || '1.2M',
        isFeatured: videoForm.isFeatured,
      });
    } else {
      addVideo({
        title: finalTitle,
        youtubeId: ytId,
        youtubeUrl: ytUrl,
        thumbnail: autoThumb,
        category: finalCategory,
        aspectRatio: videoForm.aspectRatio,
        client: videoForm.client || 'AL1 Client',
        duration: videoForm.duration || '01:30',
        views: videoForm.views || '1.2M',
        isFeatured: videoForm.isFeatured,
      });
    }

    setShowVideoForm(false);
    setEditingVideoId(null);
    setVideoForm({
      title: '',
      youtubeInput: '',
      category: categories[1]?.slug || 'shorts',
      aspectRatio: '16:9',
      client: '',
      duration: '01:30',
      views: '1.2M',
      thumbnail: '',
      isFeatured: false,
    });
  };

  const handleEditVideo = (v: VideoProject) => {
    setVideoForm({
      title: v.title,
      youtubeInput: v.youtubeId,
      category: v.category,
      aspectRatio: v.aspectRatio,
      client: v.client,
      duration: v.duration,
      views: v.views,
      thumbnail: v.thumbnail,
      isFeatured: v.isFeatured,
    });
    setEditingVideoId(v.id);
    setShowVideoForm(true);
  };

  const handleMoveVideo = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= videos.length) return;
    const copy = [...videos];
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;
    reorderVideos(copy);
  };

  // Inline Category Add inside Video Form
  const handleInlineAddCategory = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!inlineNewCatName.trim()) return;
    const name = inlineNewCatName.trim();
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    addCategory(name);
    setVideoForm((prev) => ({ ...prev, category: slug }));
    setInlineNewCatName('');
    setShowInlineCatInput(false);
  };

  // Category actions
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim());
    setNewCatName('');
  };

  const handleSaveEditCategory = (id: string) => {
    if (!editingCatName.trim()) return;
    updateCategory(id, editingCatName.trim());
    setEditingCatId(null);
  };

  const handleMoveCategory = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= categories.length) return;
    const copy = [...categories];
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;
    reorderCategories(copy);
  };

  // Link actions & Guns.lol presets
  const applyLinkPreset = (preset: (typeof SOCIAL_PRESETS)[0]) => {
    setLinkForm({
      title: preset.defaultTitle,
      subtitle: preset.defaultSubtitle,
      url: preset.urlPrefix,
      icon: preset.icon,
      badge: preset.defaultBadge,
      accentColor: preset.color,
      isActive: true,
    });
    setShowLinkForm(true);
  };

  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkForm.title.trim() || !linkForm.url.trim()) return;

    if (editingLinkId) {
      updateLink(editingLinkId, linkForm);
    } else {
      addLink(linkForm);
    }

    setShowLinkForm(false);
    setEditingLinkId(null);
    setLinkForm({
      title: '',
      subtitle: '',
      url: '',
      icon: 'youtube',
      badge: '',
      accentColor: '#ef4444',
      isActive: true,
    });
  };

  const handleEditLink = (l: HubLink) => {
    setLinkForm({
      title: l.title,
      subtitle: l.subtitle || '',
      url: l.url,
      icon: l.icon,
      badge: l.badge || '',
      accentColor: l.accentColor || '#ef4444',
      isActive: l.isActive,
    });
    setEditingLinkId(l.id);
    setShowLinkForm(true);
  };

  const handleMoveLink = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= links.length) return;
    const copy = [...links];
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;
    reorderLinks(copy);
  };

  // Review actions
  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewForm.clientName.trim() || !reviewForm.text.trim()) return;

    const finalReview = {
      clientName: reviewForm.clientName.trim(),
      clientRole: reviewForm.clientRole.trim() || 'Verified Client',
      rating: reviewForm.rating,
      text: reviewForm.text.trim(),
      projectReference: reviewForm.projectReference.trim() || 'Custom Edit',
      clientPhoto: reviewForm.clientPhoto.trim() || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      platformBadge: reviewForm.platformBadge.trim() || 'Verified Client',
      accentColor: reviewForm.accentColor || '#06b6d4',
      isVerified: reviewForm.isVerified,
      date: reviewForm.date.trim() || 'Recent',
    };

    if (editingReviewId) {
      updateReview(editingReviewId, finalReview);
    } else {
      addReview(finalReview);
    }

    setShowReviewForm(false);
    setEditingReviewId(null);
    setReviewForm({
      clientName: '',
      clientRole: '',
      rating: 5,
      text: '',
      projectReference: '',
      clientPhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      platformBadge: 'YouTube Creator',
      accentColor: '#06b6d4',
      isVerified: true,
      date: 'Recent',
    });
  };

  const handleEditReview = (r: ClientReview) => {
    setReviewForm({
      clientName: r.clientName,
      clientRole: r.clientRole,
      rating: r.rating,
      text: r.text,
      projectReference: r.projectReference,
      clientPhoto: r.clientPhoto,
      platformBadge: r.platformBadge || 'YouTube Creator',
      accentColor: r.accentColor || '#06b6d4',
      isVerified: r.isVerified !== false,
      date: r.date || 'Recent',
    });
    setEditingReviewId(r.id);
    setShowReviewForm(true);
  };

  const handleMoveReview = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= reviews.length) return;
    const copy = [...reviews];
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;
    reorderReviews(copy);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setReviewForm((prev) => ({ ...prev, clientPhoto: reader.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Skill actions
  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.name.trim()) return;

    if (editingSkillId) {
      updateSkill(editingSkillId, skillForm);
    } else {
      addSkill(skillForm);
    }

    setShowSkillForm(false);
    setEditingSkillId(null);
    setSkillForm({
      name: '',
      proficiency: 95,
      badge: 'Video Editing',
      icon: 'Film',
    });
  };

  const handleEditSkill = (s: SoftwareSkill) => {
    setSkillForm({
      name: s.name,
      proficiency: s.proficiency,
      badge: s.badge,
      icon: s.icon,
    });
    setEditingSkillId(s.id);
    setShowSkillForm(true);
  };

  const handleMoveSkill = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= skills.length) return;
    const copy = [...skills];
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;
    reorderSkills(copy);
  };

  // Policy actions
  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyForm.title.trim() || !policyForm.description.trim()) {
      alert('Please enter both title and description');
      return;
    }
    if (editingPolicyId) {
      updatePolicyRule(editingPolicyId, {
        ruleNumber: policyForm.ruleNumber,
        title: policyForm.title,
        description: policyForm.description,
        hadithReference: policyForm.hadithReference.trim(),
        detailedExplanation: policyForm.detailedExplanation.trim(),
        youtubeUrl: policyForm.youtubeUrl.trim(),
        pinColor: policyForm.pinColor,
      });
    } else {
      addPolicyRule({
        ruleNumber: policyForm.ruleNumber || `0${policyRules.length + 1}`,
        title: policyForm.title,
        description: policyForm.description,
        hadithReference: policyForm.hadithReference.trim(),
        detailedExplanation: policyForm.detailedExplanation.trim(),
        youtubeUrl: policyForm.youtubeUrl.trim(),
        pinColor: policyForm.pinColor,
      });
    }
    setShowPolicyForm(false);
    setEditingPolicyId(null);
    setPolicyForm({
      ruleNumber: `0${policyRules.length + 2}`,
      title: '',
      description: '',
      hadithReference: '',
      detailedExplanation: '',
      youtubeUrl: '',
      pinColor: 'red',
    });
  };

  const handleEditPolicy = (p: PolicyRule) => {
    setPolicyForm({
      ruleNumber: p.ruleNumber,
      title: p.title,
      description: p.description,
      hadithReference: p.hadithReference || '',
      detailedExplanation: p.detailedExplanation || '',
      youtubeUrl: p.youtubeUrl || '',
      pinColor: p.pinColor || 'red',
    });
    setEditingPolicyId(p.id);
    setShowPolicyForm(true);
  };

  const handleMovePolicy = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= policyRules.length) return;
    const copy = [...policyRules];
    const temp = copy[idx];
    copy[idx] = copy[targetIdx];
    copy[targetIdx] = temp;
    reorderPolicyRules(copy);
  };

  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    updatePolicyNotice(noticeInput);
    setNoticeSaved(true);
    setTimeout(() => setNoticeSaved(false), 2000);
  };

  const accentOptions: { name: string; value: AccentColor; hex: string }[] = [
    { name: 'Neon Cyan', value: 'cyan', hex: '#06b6d4' },
    { name: 'Cyber Purple', value: 'purple', hex: '#a855f7' },
    { name: 'Emerald VFX', value: 'emerald', hex: '#10b981' },
    { name: 'Amber Sunset', value: 'amber', hex: '#f59e0b' },
    { name: 'Crimson Rose', value: 'rose', hex: '#f43f5e' },
    { name: 'Electric Indigo', value: 'indigo', hex: '#6366f1' },
  ];

  const currentYtId = extractYouTubeId(videoForm.youtubeInput);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/85 backdrop-blur-xl" onClick={onClose} />

      {/* Main Admin Modal Window */}
      <div
        className="relative z-10 w-full max-w-5xl glass-panel rounded-3xl border border-white/15 bg-neutral-950/95 text-neutral-100 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-neutral-900/60">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center border bg-black p-0.5"
              style={{
                borderColor: 'var(--accent)',
                boxShadow: '0 0 15px var(--accent-glow)',
              }}
            >
              <img src="/logo.png" alt="AL1 Studio Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-base text-white">AL1 Studio Dashboard</h2>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    isAdmin
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                      : 'border-amber-500/40 bg-amber-500/10 text-amber-400'
                  }`}
                >
                  {isAdmin ? 'Authenticated' : 'Locked'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Core Portfolio & Link-Hub Content Management System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={logoutAdmin}
                className="px-3 py-1.5 rounded-xl glass-panel border border-white/10 hover:border-white/20 text-xs text-neutral-400 hover:text-white transition-all flex items-center gap-1.5"
                title="Lock Dashboard"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lock</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl glass-panel border border-white/10 hover:border-white/25 text-neutral-400 hover:text-white transition-all"
              title="Close Dashboard"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* If Not Authenticated: PIN Login View */}
        {!isAdmin ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center my-auto">
            <div
              className="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center border-2 mb-4 bg-black p-1 shadow-2xl"
              style={{
                borderColor: 'var(--accent)',
                boxShadow: '0 0 25px var(--accent-glow)',
              }}
            >
              <img src="/logo.png" alt="AL1 Studio" className="w-full h-full object-contain" />
            </div>

            <h3 className="font-heading font-bold text-2xl text-white">Admin Access Required</h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-sm">
              Enter your master studio password to manage videos, categories, social hub links, reviews, and theme.
            </p>

            <form onSubmit={handleLogin} className="mt-6 w-full max-w-sm space-y-3">
              <div>
                <input
                  type="password"
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                  placeholder="Enter Password (demo: admin123)"
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl glass-panel border border-white/15 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 text-center tracking-widest transition-all"
                />
              </div>

              {loginError && (
                <p className="text-xs text-rose-400 font-medium">{loginError}</p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  backgroundColor: 'var(--accent)',
                  boxShadow: '0 0 20px var(--accent-glow)',
                }}
              >
                <Unlock className="w-4 h-4" />
                <span>Unlock Dashboard</span>
              </button>

              <p className="text-[11px] text-neutral-500 pt-2">
                Default PIN: <code className="text-neutral-300">admin123</code> (modifiable in Settings)
              </p>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <>
            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 px-6 py-2.5 border-b border-white/10 bg-neutral-900/40 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('videos')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === 'videos'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Video className="w-3.5 h-3.5" style={{ color: activeTab === 'videos' ? 'var(--accent)' : undefined }} />
                <span>Video Manager</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 font-mono">
                  {videos.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('policy')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === 'policy'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>কাজের নীতিমালা (Rules)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 font-mono">
                  {policyRules.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === 'categories'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Layers className="w-3.5 h-3.5" style={{ color: activeTab === 'categories' ? 'var(--accent)' : undefined }} />
                <span>Categories</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 font-mono">
                  {categories.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('links')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === 'links'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" style={{ color: activeTab === 'links' ? 'var(--accent)' : undefined }} />
                <span>Link Hub (guns.lol)</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 font-mono">
                  {links.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === 'reviews'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span>Reviews</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 font-mono">
                  {reviews.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('skills')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === 'skills'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" style={{ color: activeTab === 'skills' ? 'var(--accent)' : undefined }} />
                <span>Skills & Software</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 font-mono">
                  {skills.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === 'settings'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Settings className="w-3.5 h-3.5" style={{ color: activeTab === 'settings' ? 'var(--accent)' : undefined }} />
                <span>Site & Theme</span>
              </button>
            </div>

            {/* Tab Body Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* TAB 1: VIDEOS */}
              {activeTab === 'videos' && (
                <div className="space-y-6">
                  {/* Action Bar */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-lg text-white">Video Portfolio Manager</h3>
                      <p className="text-xs text-neutral-400">
                        Paste any YouTube link — thumbnails and IDs are detected automatically! Create categories on the fly.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingVideoId(null);
                        setVideoForm({
                          title: '',
                          youtubeInput: '',
                          category: categories[1]?.slug || 'shorts',
                          aspectRatio: '16:9',
                          client: '',
                          duration: '01:30',
                          views: '1.2M',
                          thumbnail: '',
                          isFeatured: false,
                        });
                        setShowVideoForm(!showVideoForm);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>{showVideoForm ? 'Cancel Form' : 'Add New Video'}</span>
                    </button>
                  </div>

                  {/* Add / Edit Video Form */}
                  {showVideoForm && (
                    <form
                      onSubmit={handleSaveVideo}
                      className="p-5 rounded-2xl glass-card border border-white/15 space-y-4 animate-in fade-in zoom-in-95 duration-200"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                          <Video className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                          {editingVideoId ? 'Edit Video Project' : 'Add Video by YouTube URL'}
                        </h4>
                        <span className="text-[11px] text-cyan-400">Paste URL → Auto Thumbnail & ID</span>
                      </div>

                      {/* YouTube URL Input with Auto Detection */}
                      <div>
                        <label className="block text-neutral-300 font-semibold mb-1 text-xs">
                          YouTube Video URL or ID * (e.g. https://youtu.be/... or https://youtube.com/shorts/...)
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={videoForm.youtubeInput}
                            onChange={(e) => handleYouTubeInputChange(e.target.value)}
                            placeholder="Paste YouTube link here..."
                            className="w-full px-4 py-2.5 rounded-xl glass-panel border border-white/15 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 font-mono"
                          />
                          {currentYtId.length === 11 && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Check className="w-3 h-3" /> ID: {currentYtId}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Live Thumbnail Preview & Auto Settings */}
                      {currentYtId.length === 11 && (
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-center gap-4">
                          <div
                            className={`rounded-lg overflow-hidden border border-white/15 relative bg-black shrink-0 ${
                              videoForm.aspectRatio === '9:16' ? 'w-20 h-32' : 'w-36 h-20'
                            }`}
                          >
                            <img
                              src={`https://img.youtube.com/vi/${currentYtId}/hqdefault.jpg`}
                              alt="Thumbnail Preview"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80';
                              }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                              <Play className="w-5 h-5 text-white fill-current opacity-80" />
                            </div>
                          </div>

                          <div className="text-xs text-neutral-300 space-y-1 w-full">
                            <p className="font-semibold text-white flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              Auto Thumbnail & Stream Link Connected!
                            </p>
                            <p className="text-[11px] text-neutral-400 font-mono truncate">
                              https://www.youtube.com/watch?v={currentYtId}
                            </p>
                            <p className="text-[11px] text-cyan-400">
                              Detected format: {videoForm.aspectRatio === '9:16' ? '9:16 Vertical Short / Reel' : '16:9 Widescreen HD'}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block text-neutral-300 font-semibold mb-1">Project Title</label>
                          <input
                            type="text"
                            value={videoForm.title}
                            onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                            placeholder="e.g. MrBeast Style Viral Reel (or leave empty for auto)"
                            className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none"
                          />
                        </div>

                        {/* Category Selector with Inline Category Creator */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-neutral-300 font-semibold">Video Category *</label>
                            <button
                              type="button"
                              onClick={() => setShowInlineCatInput(!showInlineCatInput)}
                              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                            >
                              <Plus className="w-3 h-3" />
                              <span>{showInlineCatInput ? 'Hide' : '+ New Category'}</span>
                            </button>
                          </div>

                          {showInlineCatInput ? (
                            <div className="flex gap-1.5">
                              <input
                                type="text"
                                value={inlineNewCatName}
                                onChange={(e) => setInlineNewCatName(e.target.value)}
                                placeholder="New category name (e.g. Podcasts)..."
                                className="flex-1 px-3 py-1.5 rounded-xl glass-panel border border-cyan-500 text-white text-xs focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={handleInlineAddCategory}
                                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 font-bold text-xs"
                              >
                                Add
                              </button>
                            </div>
                          ) : (
                            <select
                              value={videoForm.category}
                              onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white bg-neutral-900 focus:outline-none focus:border-cyan-500"
                            >
                              {categories
                                .filter((c) => c.slug !== 'all')
                                .map((cat) => (
                                  <option key={cat.id} value={cat.slug}>
                                    {cat.name}
                                  </option>
                                ))}
                            </select>
                          )}
                        </div>

                        <div>
                          <label className="block text-neutral-300 font-semibold mb-1">Aspect Ratio</label>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setVideoForm({ ...videoForm, aspectRatio: '16:9' })}
                              className={`flex-1 py-2 rounded-xl border text-xs font-semibold ${
                                videoForm.aspectRatio === '16:9'
                                  ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                                  : 'border-white/10 glass-panel text-neutral-400'
                              }`}
                            >
                              16:9 Widescreen
                            </button>
                            <button
                              type="button"
                              onClick={() => setVideoForm({ ...videoForm, aspectRatio: '9:16' })}
                              className={`flex-1 py-2 rounded-xl border text-xs font-semibold ${
                                videoForm.aspectRatio === '9:16'
                                  ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                                  : 'border-white/10 glass-panel text-neutral-400'
                              }`}
                            >
                              9:16 Short/Reel
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-neutral-300 font-semibold mb-1">Client / Channel Name</label>
                          <input
                            type="text"
                            value={videoForm.client}
                            onChange={(e) => setVideoForm({ ...videoForm, client: e.target.value })}
                            placeholder="e.g. CyberCore Tech or Apex Esports"
                            className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 font-semibold mb-1">Duration & Views</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={videoForm.duration}
                              onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                              placeholder="01:45"
                              className="w-1/2 px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none"
                            />
                            <input
                              type="text"
                              value={videoForm.views}
                              onChange={(e) => setVideoForm({ ...videoForm, views: e.target.value })}
                              placeholder="2.4M"
                              className="w-1/2 px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-neutral-300 font-semibold mb-1">
                            Custom Thumbnail URL (Optional)
                          </label>
                          <input
                            type="text"
                            value={videoForm.thumbnail}
                            onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                            placeholder="Leave empty for auto YouTube thumbnail"
                            className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none text-xs"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                          <input
                            type="checkbox"
                            checked={videoForm.isFeatured}
                            onChange={(e) => setVideoForm({ ...videoForm, isFeatured: e.target.checked })}
                            className="rounded border-white/20 text-cyan-500 focus:ring-0"
                          />
                          <span className="font-semibold">Featured / Pin to Top of Portfolio</span>
                        </label>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowVideoForm(false);
                              setEditingVideoId(null);
                            }}
                            className="px-4 py-2 rounded-xl glass-panel border border-white/10 text-xs text-neutral-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-xl text-black font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all"
                            style={{ backgroundColor: 'var(--accent)' }}
                          >
                            {editingVideoId ? 'Update Project' : 'Save Project'}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* Videos Table/List with Fail-Safe Inline Deletion */}
                  <div className="space-y-3">
                    {videos.map((vid, idx) => (
                      <div
                        key={vid.id}
                        className="p-3.5 rounded-2xl glass-card border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          {/* Order buttons */}
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleMoveVideo(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded bg-white/5 hover:bg-white/10 text-neutral-400 disabled:opacity-20"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleMoveVideo(idx, 'down')}
                              disabled={idx === videos.length - 1}
                              className="p-1 rounded bg-white/5 hover:bg-white/10 text-neutral-400 disabled:opacity-20"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Thumbnail */}
                          <div className="w-16 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-neutral-900 relative">
                            <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                            {vid.aspectRatio === '9:16' && (
                              <span className="absolute bottom-0.5 right-0.5 text-[8px] bg-black/80 px-1 rounded text-cyan-400 font-mono">
                                9:16
                              </span>
                            )}
                          </div>

                          {/* Info */}
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-heading font-bold text-xs sm:text-sm text-white max-w-xs truncate">
                                {vid.title}
                              </h4>
                              {vid.isFeatured && (
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300">
                                  ★ Featured
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-neutral-400 mt-0.5">
                              <span className="font-semibold text-neutral-300">{vid.client}</span>
                              <span>•</span>
                              <span className="text-cyan-400">{vid.category}</span>
                              <span>•</span>
                              <span>{vid.duration}</span>
                              <span>•</span>
                              <span>{vid.views} views</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions with Fail-Proof Safe Delete */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          <button
                            onClick={() => toggleFeatured(vid.id)}
                            className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-all ${
                              vid.isFeatured
                                ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                                : 'border-white/10 glass-panel text-neutral-400 hover:text-white'
                            }`}
                            title="Toggle Featured Status"
                          >
                            {vid.isFeatured ? 'Pinned' : 'Pin'}
                          </button>

                          <button
                            onClick={() => handleEditVideo(vid)}
                            className="p-2 rounded-xl glass-panel border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white transition-all text-xs"
                            title="Edit Video"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {deleteConfirmVideoId === vid.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  deleteVideo(vid.id);
                                  setDeleteConfirmVideoId(null);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs animate-pulse"
                              >
                                Confirm Delete?
                              </button>
                              <button
                                onClick={() => setDeleteConfirmVideoId(null)}
                                className="px-2 py-1.5 rounded-xl bg-neutral-800 text-neutral-400 text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmVideoId(vid.id)}
                              className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all text-xs"
                              title="Delete Video"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: POLICY & GUIDELINES (কাজের নীতিমালা) */}
              {activeTab === 'policy' && (
                <div className="space-y-6">
                  {/* Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-heading font-bold text-lg text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-amber-400" />
                        <span>কাজের নীতিমালা ও ইসলামিক শরীয়াহ রুলস</span>
                      </h3>
                      <p className="text-xs text-neutral-400">
                        হালাল ও শরীয়াহ সম্মত কাজের শর্তাবলী কাস্টমাইজ করুন। প্রতিটি নিয়মে রেফারেন্স ইউটিউব লিংক যুক্ত করতে পারেন।
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingPolicyId(null);
                        setPolicyForm({
                          ruleNumber: `0${policyRules.length + 1}`,
                          title: '',
                          description: '',
                          hadithReference: '',
                          detailedExplanation: '',
                          youtubeUrl: '',
                          pinColor: 'red',
                        });
                        setShowPolicyForm(!showPolicyForm);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 transition-all shrink-0"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>{showPolicyForm ? 'Cancel Form' : 'Add New Rule'}</span>
                    </button>
                  </div>

                  {/* Add / Edit Policy Form */}
                  {showPolicyForm && (
                    <form
                      onSubmit={handleSavePolicy}
                      className="p-5 rounded-2xl glass-card border border-white/15 space-y-4 animate-in fade-in zoom-in-95 duration-200"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                          <FileText className="w-4 h-4 text-amber-400" />
                          <span>{editingPolicyId ? 'Edit Policy Rule' : 'নতুন কাজের নীতিমালা যোগ করুন'}</span>
                        </h4>
                        <span className="text-[11px] text-amber-400">শরীয়াহ গাইডলাইন</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        {/* Rule Number */}
                        <div>
                          <label className="block text-neutral-300 font-semibold mb-1 text-xs">
                            নম্বর / ক্রম *
                          </label>
                          <input
                            type="text"
                            required
                            value={policyForm.ruleNumber}
                            onChange={(e) => setPolicyForm({ ...policyForm, ruleNumber: e.target.value })}
                            placeholder="01"
                            className="w-full px-3 py-2 rounded-xl glass-panel border border-white/15 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-mono"
                          />
                        </div>

                        {/* Title */}
                        <div className="sm:col-span-3">
                          <label className="block text-neutral-300 font-semibold mb-1 text-xs">
                            শিরোনাম (Title) *
                          </label>
                          <input
                            type="text"
                            required
                            value={policyForm.title}
                            onChange={(e) => setPolicyForm({ ...policyForm, title: e.target.value })}
                            placeholder="যেমন: গান ও বাদ্যযন্ত্র, নারীর ছবি ও অশ্লীলতা..."
                            className="w-full px-3 py-2 rounded-xl glass-panel border border-white/15 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-neutral-300 font-semibold mb-1 text-xs">
                          বিস্তারিত বিবরণ (Policy Description) *
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={policyForm.description}
                          onChange={(e) => setPolicyForm({ ...policyForm, description: e.target.value })}
                          placeholder="কোনো প্রকার গান বা বাদ্যযন্ত্র দেওয়া যাবে না। তবে প্রয়োজনে সাউন্ড ইফেক্ট (SFX) ব্যবহার করা যাবে..."
                          className="w-full px-3 py-2 rounded-xl glass-panel border border-white/15 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 resize-none"
                        />
                      </div>

                      {/* Hadith / Quranic Reference */}
                      <div>
                        <label className="block text-neutral-300 font-semibold mb-1 text-xs flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                          <span>হাদিস ও কুরআনের দলিল (Hadith Reference)</span>
                        </label>
                        <textarea
                          rows={2}
                          value={policyForm.hadithReference}
                          onChange={(e) => setPolicyForm({ ...policyForm, hadithReference: e.target.value })}
                          placeholder="যেমন: রাসুলুল্লাহ (সা.) বলেছেন: 'আমার উম্মতের মধ্যে অবশ্যই এমন কিছু লোক সৃষ্টি হবে যারা গান-বাদ্যকে হালাল মনে করবে।' (সহীহ বুখারী: ৫৫৯০)"
                          className="w-full px-3 py-2 rounded-xl glass-panel border border-white/15 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-400 resize-none font-serif"
                        />
                        <p className="text-[10px] text-neutral-500 mt-1">
                          (ঐচ্ছিক কিন্তু অত্যন্ত কার্যকরী) সহীহ হাদিস বা কুরআনের আয়াত নম্বরসহ রেফারেন্স দিন।
                        </p>
                      </div>

                      {/* Detailed Islamic Explanation */}
                      <div>
                        <label className="block text-neutral-300 font-semibold mb-1 text-xs flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-amber-400" />
                          <span>কেন হারাম ও বিস্তারিত শরীয়াহ বিধান (Detailed Islamic Explanation)</span>
                        </label>
                        <textarea
                          rows={3}
                          value={policyForm.detailedExplanation}
                          onChange={(e) => setPolicyForm({ ...policyForm, detailedExplanation: e.target.value })}
                          placeholder="কেন এটি হারাম এবং ক্লায়েন্টকে কীভাবে হালাল পদ্ধতিতে সার্ভিস দেওয়া হবে তার বিস্তারিত ব্যাখ্যা লিখুন..."
                          className="w-full px-3 py-2 rounded-xl glass-panel border border-white/15 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* YouTube Reference Link */}
                        <div>
                          <label className="block text-neutral-300 font-semibold mb-1 text-xs flex items-center gap-1.5">
                            <YouTubeIcon className="w-3.5 h-3.5 text-red-500" />
                            <span>রেফারেন্স ইউটিউব ভিডিও লিংক (কেন হারাম/বিধান)</span>
                          </label>
                          <input
                            type="text"
                            value={policyForm.youtubeUrl}
                            onChange={(e) => setPolicyForm({ ...policyForm, youtubeUrl: e.target.value })}
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full px-3 py-2 rounded-xl glass-panel border border-white/15 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 font-mono"
                          />
                          <p className="text-[10px] text-neutral-500 mt-1">
                            (ঐচ্ছিক) ক্লায়েন্টকে ইসলামিক ব্যাখ্যা বোঝাতে ইউটিউব লিংক দিন।
                          </p>
                        </div>

                        {/* Pushpin Style Color */}
                        <div>
                          <label className="block text-neutral-300 font-semibold mb-1 text-xs">
                            পিন ও কার্ডের কালার (Pin Style)
                          </label>
                          <div className="grid grid-cols-6 gap-1.5 mt-1">
                            {(['red', 'blue', 'purple', 'orange', 'cyan', 'emerald'] as PinColor[]).map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => setPolicyForm({ ...policyForm, pinColor: c })}
                                className={`py-1.5 rounded-lg border text-[10px] font-semibold flex flex-col items-center gap-1 transition-all ${
                                  policyForm.pinColor === c
                                    ? 'border-white bg-white/15 scale-105'
                                    : 'border-white/10 hover:border-white/30 text-neutral-400'
                                }`}
                              >
                                <span
                                  className={`w-3.5 h-3.5 rounded-full ${
                                    c === 'red'
                                      ? 'bg-red-500'
                                      : c === 'blue'
                                      ? 'bg-blue-600'
                                      : c === 'purple'
                                      ? 'bg-purple-600'
                                      : c === 'orange'
                                      ? 'bg-orange-500'
                                      : c === 'cyan'
                                      ? 'bg-cyan-500'
                                      : 'bg-emerald-500'
                                  }`}
                                />
                                <span className="capitalize">{c[0]}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => {
                            setShowPolicyForm(false);
                            setEditingPolicyId(null);
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white glass-panel border border-white/10"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md"
                          style={{ backgroundColor: 'var(--accent)' }}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{editingPolicyId ? 'Update Rule' : 'Save Rule'}</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Bottom Notice Customizer */}
                  <form onSubmit={handleSaveNotice} className="p-4 rounded-2xl glass-panel border border-orange-500/30 bg-orange-500/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-bold text-xs text-orange-400 flex items-center gap-1.5">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>বিস্তারিত জানার জন্য ব্যানার নোটিশ এডিট করুন</span>
                      </h4>
                      {noticeSaved && (
                        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Saved!
                        </span>
                      )}
                    </div>
                    <textarea
                      rows={2}
                      value={noticeInput}
                      onChange={(e) => setNoticeInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl glass-panel border border-white/15 text-xs text-white focus:outline-none focus:border-orange-400 resize-none"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-black font-bold text-xs transition-colors"
                      >
                        Update Notice Text
                      </button>
                    </div>
                  </form>

                  {/* Policy Rules List */}
                  <div className="space-y-3">
                    {policyRules.map((rule, idx) => (
                      <div
                        key={rule.id}
                        className="p-4 rounded-2xl glass-card border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-white/20 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          {/* Reorder Arrows */}
                          <div className="flex flex-col gap-1 pt-0.5">
                            <button
                              onClick={() => handleMovePolicy(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded bg-white/5 hover:bg-white/10 text-neutral-400 disabled:opacity-20"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleMovePolicy(idx, 'down')}
                              disabled={idx === policyRules.length - 1}
                              className="p-1 rounded bg-white/5 hover:bg-white/10 text-neutral-400 disabled:opacity-20"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Number & Pin */}
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-3.5 h-3.5 rounded-full shrink-0 shadow-sm ${
                                rule.pinColor === 'red'
                                  ? 'bg-red-500'
                                  : rule.pinColor === 'blue'
                                  ? 'bg-blue-600'
                                  : rule.pinColor === 'purple'
                                  ? 'bg-purple-600'
                                  : rule.pinColor === 'orange'
                                  ? 'bg-orange-500'
                                  : rule.pinColor === 'cyan'
                                  ? 'bg-cyan-500'
                                  : 'bg-emerald-500'
                              }`}
                            />
                            <span className="font-mono font-bold text-sm text-neutral-300">
                              {rule.ruleNumber}
                            </span>
                          </div>

                          {/* Rule Title & Content */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-heading font-bold text-sm text-white flex flex-wrap items-center gap-2">
                              <span>{rule.title}</span>
                              {rule.hadithReference && (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
                                  <BookOpen className="w-2.5 h-2.5" />
                                  <span>হাদিস রেফারেন্সযুক্ত</span>
                                </span>
                              )}
                              {rule.youtubeUrl && (
                                <a
                                  href={rule.youtubeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 inline-flex items-center gap-1 hover:bg-red-500/20"
                                >
                                  <YouTubeIcon className="w-2.5 h-2.5 fill-current" />
                                  <span>ভিডিও লিংক</span>
                                </a>
                              )}
                            </h4>
                            <p className="text-xs text-neutral-400 mt-0.5 line-clamp-2">
                              {rule.description}
                            </p>
                            {rule.hadithReference && (
                              <p className="text-[11px] text-emerald-300/80 mt-1 italic font-serif line-clamp-1 border-l-2 border-emerald-500/40 pl-2">
                                "{rule.hadithReference}"
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                          <button
                            onClick={() => handleEditPolicy(rule)}
                            className="p-2 rounded-xl glass-panel border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white transition-all text-xs"
                            title="Edit Rule"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {deleteConfirmPolicyId === rule.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  deletePolicyRule(rule.id);
                                  setDeleteConfirmPolicyId(null);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs animate-pulse"
                              >
                                Confirm?
                              </button>
                              <button
                                onClick={() => setDeleteConfirmPolicyId(null)}
                                className="px-2 py-1.5 rounded-xl bg-neutral-800 text-neutral-400 text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmPolicyId(rule.id)}
                              className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all text-xs"
                              title="Delete Rule"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: CATEGORIES */}
              {activeTab === 'categories' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-heading font-bold text-lg text-white">Custom Category Manager</h3>
                    <p className="text-xs text-neutral-400">
                      Create, rename, or delete video categories (e.g. Shorts/Reels, Vlogs, Commercials, 3D VFX).
                    </p>
                  </div>

                  {/* Add Category Form */}
                  <form onSubmit={handleAddCategory} className="flex gap-2">
                    <input
                      type="text"
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      placeholder="New Category Name (e.g., Drone Cinematography)..."
                      className="flex-1 px-4 py-2.5 rounded-xl glass-panel border border-white/15 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shrink-0"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Category</span>
                    </button>
                  </form>

                  {/* Categories List with Fail-Proof Safe Delete */}
                  <div className="space-y-2.5">
                    {categories.map((cat, idx) => {
                      const count =
                        cat.slug === 'all'
                          ? videos.length
                          : videos.filter((v) => v.category === cat.slug).length;

                      return (
                        <div
                          key={cat.id}
                          className="p-3.5 rounded-2xl glass-card border border-white/10 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col gap-1">
                              <button
                                onClick={() => handleMoveCategory(idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 rounded bg-white/5 hover:bg-white/10 text-neutral-400 disabled:opacity-20"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleMoveCategory(idx, 'down')}
                                disabled={idx === categories.length - 1}
                                className="p-1 rounded bg-white/5 hover:bg-white/10 text-neutral-400 disabled:opacity-20"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                            </div>

                            {editingCatId === cat.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={editingCatName}
                                  onChange={(e) => setEditingCatName(e.target.value)}
                                  className="px-3 py-1 rounded-lg glass-panel border border-cyan-500 text-xs text-white"
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleSaveEditCategory(cat.id)}
                                  className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-semibold"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingCatId(null)}
                                  className="px-2 py-1 text-xs text-neutral-400"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div>
                                <span className="font-heading font-bold text-sm text-white">{cat.name}</span>
                                <span className="ml-2 text-xs font-mono text-neutral-400">/{cat.slug}</span>
                                <span className="ml-3 text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
                                  {count} projects
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5">
                            {editingCatId !== cat.id && (
                              <button
                                onClick={() => {
                                  setEditingCatId(cat.id);
                                  setEditingCatName(cat.name);
                                }}
                                className="p-2 rounded-xl glass-panel border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white text-xs"
                                title="Rename Category"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {cat.slug !== 'all' && (
                              <>
                                {deleteConfirmCatId === cat.id ? (
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => {
                                        deleteCategory(cat.id);
                                        setDeleteConfirmCatId(null);
                                      }}
                                      className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs"
                                    >
                                      Delete?
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirmCatId(null)}
                                      className="px-2 py-1 rounded-lg bg-neutral-800 text-neutral-400 text-xs"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setDeleteConfirmCatId(cat.id)}
                                    className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs"
                                    title="Delete Category"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: LINK & SOCIAL HUB (guns.lol style) */}
              {activeTab === 'links' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-lg text-white">
                        Social & Link Hub (guns.lol Style)
                      </h3>
                      <p className="text-xs text-neutral-400">
                        Click any platform preset below to quickly add TikTok, YouTube, WhatsApp, Instagram, Telegram, etc.!
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingLinkId(null);
                        setLinkForm({
                          title: '',
                          subtitle: '',
                          url: '',
                          icon: 'youtube',
                          badge: '',
                          accentColor: '#ef4444',
                          isActive: true,
                        });
                        setShowLinkForm(!showLinkForm);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5 shadow-md shrink-0"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>{showLinkForm ? 'Cancel' : 'Custom Link'}</span>
                    </button>
                  </div>

                  {/* 1-Click Platform Presets (guns.lol style) */}
                  <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-2">
                    <p className="text-xs font-semibold text-neutral-300">
                      ⚡ Quick Add by Platform (Auto Fills Icon, Brand Color & URL Prefix):
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SOCIAL_PRESETS.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => applyLinkPreset(preset)}
                          className="px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
                          style={{
                            backgroundColor: `${preset.color}15`,
                            borderColor: `${preset.color}35`,
                            color: preset.color,
                          }}
                        >
                          <Plus className="w-3 h-3" />
                          <span>{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add / Edit Link Form */}
                  {showLinkForm && (
                    <form
                      onSubmit={handleSaveLink}
                      className="p-5 rounded-2xl glass-card border border-white/15 space-y-4 animate-in fade-in zoom-in-95 duration-200"
                    >
                      <h4 className="font-heading font-bold text-sm text-white">
                        {editingLinkId ? 'Edit Link Button' : 'Add New Hub Link'}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block text-neutral-300 font-semibold mb-1">Title *</label>
                          <input
                            type="text"
                            required
                            value={linkForm.title}
                            onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                            placeholder="e.g. YouTube Channel or WhatsApp Direct"
                            className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 font-semibold mb-1">Subtitle / Note</label>
                          <input
                            type="text"
                            value={linkForm.subtitle}
                            onChange={(e) => setLinkForm({ ...linkForm, subtitle: e.target.value })}
                            placeholder="e.g. Fast response (< 15 mins) or 14M+ Views"
                            className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-neutral-300 font-semibold mb-1">Destination URL *</label>
                          <input
                            type="url"
                            required
                            value={linkForm.url}
                            onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 font-semibold mb-1">Icon Platform</label>
                          <select
                            value={linkForm.icon}
                            onChange={(e) => setLinkForm({ ...linkForm, icon: e.target.value as LinkIconType })}
                            className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white bg-neutral-900 focus:outline-none"
                          >
                            <option value="youtube">YouTube</option>
                            <option value="tiktok">TikTok</option>
                            <option value="whatsapp">WhatsApp</option>
                            <option value="instagram">Instagram</option>
                            <option value="facebook">Facebook</option>
                            <option value="discord">Discord</option>
                            <option value="telegram">Telegram</option>
                            <option value="x">X / Twitter</option>
                            <option value="twitch">Twitch</option>
                            <option value="spotify">Spotify</option>
                            <option value="github">GitHub</option>
                            <option value="steam">Steam</option>
                            <option value="mail">Email</option>
                            <option value="globe">Website / Globe</option>
                            <option value="link">Generic Link</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-neutral-300 font-semibold mb-1">Pill Badge (Optional)</label>
                          <input
                            type="text"
                            value={linkForm.badge}
                            onChange={(e) => setLinkForm({ ...linkForm, badge: e.target.value })}
                            placeholder="e.g., Main Hub, 14M+ Views, Direct, 24/7"
                            className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-neutral-300 font-semibold mb-1">Accent Glow Color</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={linkForm.accentColor}
                              onChange={(e) => setLinkForm({ ...linkForm, accentColor: e.target.value })}
                              className="w-9 h-9 rounded-lg cursor-pointer bg-transparent border-0"
                            />
                            <input
                              type="text"
                              value={linkForm.accentColor}
                              onChange={(e) => setLinkForm({ ...linkForm, accentColor: e.target.value })}
                              className="flex-1 px-3 py-2 rounded-xl glass-panel border border-white/10 text-white font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300">
                          <input
                            type="checkbox"
                            checked={linkForm.isActive}
                            onChange={(e) => setLinkForm({ ...linkForm, isActive: e.target.checked })}
                            className="rounded border-white/20 text-cyan-500 focus:ring-0"
                          />
                          <span>Visible in Link Hub</span>
                        </label>

                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowLinkForm(false);
                              setEditingLinkId(null);
                            }}
                            className="px-4 py-2 rounded-xl glass-panel border border-white/10 text-xs text-neutral-400"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 rounded-xl text-black font-bold text-xs uppercase tracking-wider"
                            style={{ backgroundColor: 'var(--accent)' }}
                          >
                            {editingLinkId ? 'Update Link' : 'Save Link'}
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* Links List with Fail-Proof Safe Delete */}
                  <div className="space-y-2.5">
                    {links.map((link, idx) => (
                      <div
                        key={link.id}
                        className={`p-3.5 rounded-2xl glass-card border flex items-center justify-between ${
                          link.isActive ? 'border-white/10' : 'border-white/5 opacity-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleMoveLink(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded bg-white/5 hover:bg-white/10 text-neutral-400 disabled:opacity-20"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleMoveLink(idx, 'down')}
                              disabled={idx === links.length - 1}
                              className="p-1 rounded bg-white/5 hover:bg-white/10 text-neutral-400 disabled:opacity-20"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>

                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 text-xs font-bold uppercase"
                            style={{
                              backgroundColor: `${link.accentColor || '#ef4444'}20`,
                              borderColor: `${link.accentColor || '#ef4444'}40`,
                              color: link.accentColor || '#ef4444',
                            }}
                          >
                            {link.icon.slice(0, 3)}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-heading font-bold text-sm text-white">{link.title}</h4>
                              {link.badge && (
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
                                  {link.badge}
                                </span>
                              )}
                              {!link.isActive && (
                                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
                                  Hidden
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-neutral-400 truncate max-w-sm">{link.url}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggleLinkActive(link.id)}
                            className="p-2 rounded-xl glass-panel border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white text-xs"
                            title={link.isActive ? 'Hide Link' : 'Show Link'}
                          >
                            {link.isActive ? (
                              <Eye className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <EyeOff className="w-3.5 h-3.5 text-neutral-500" />
                            )}
                          </button>

                          <button
                            onClick={() => handleEditLink(link)}
                            className="p-2 rounded-xl glass-panel border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white text-xs"
                            title="Edit Link"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {deleteConfirmLinkId === link.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  deleteLink(link.id);
                                  setDeleteConfirmLinkId(null);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs"
                              >
                                Delete?
                              </button>
                              <button
                                onClick={() => setDeleteConfirmLinkId(null)}
                                className="px-2 py-1 rounded-lg bg-neutral-800 text-neutral-400 text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmLinkId(link.id)}
                              className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs"
                              title="Delete Link"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: REVIEWS */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-lg text-white">Client Review & Testimonial Manager</h3>
                      <p className="text-xs text-neutral-400">
                        Add, edit client photos and ratings, modify client quotes, or remove feedback.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingReviewId(null);
                        setReviewForm({
                          clientName: '',
                          clientRole: '',
                          rating: 5,
                          text: '',
                          projectReference: '',
                          clientPhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
                          platformBadge: 'YouTube Creator',
                          accentColor: '#06b6d4',
                          isVerified: true,
                          date: 'Recent',
                        });
                        setShowReviewForm(!showReviewForm);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5 shadow-md shrink-0 hover:scale-105 active:scale-95 transition-all"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>{showReviewForm ? 'Cancel' : 'Add Custom Review'}</span>
                    </button>
                  </div>

                  {/* Add / Edit Review Form */}
                  {showReviewForm && (
                    <form
                      onSubmit={handleSaveReview}
                      className="p-5 sm:p-6 rounded-2xl glass-card border border-white/20 bg-neutral-900/90 space-y-5 shadow-2xl"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <h4 className="font-heading font-bold text-sm sm:text-base text-white flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-400" />
                          <span>{editingReviewId ? 'Edit Custom Client Review' : 'Create Custom Client Review'}</span>
                        </h4>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
                          Admin Exclusive
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        {/* Client Name & Verified Checkbox */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-neutral-300 font-semibold">Client / Channel Name *</label>
                            <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-cyan-400 hover:text-cyan-300">
                              <input
                                type="checkbox"
                                checked={reviewForm.isVerified}
                                onChange={(e) => setReviewForm({ ...reviewForm, isVerified: e.target.checked })}
                                className="rounded border-white/20 text-cyan-500 focus:ring-0"
                              />
                              <ShieldCheck className="w-3.5 h-3.5 fill-current" />
                              <span>Verified Client</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            required
                            value={reviewForm.clientName}
                            onChange={(e) => setReviewForm({ ...reviewForm, clientName: e.target.value })}
                            placeholder="e.g., Marcus Reynolds / TechVibe"
                            className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        {/* Client Role / Channel Subtitle */}
                        <div>
                          <label className="block text-neutral-300 font-semibold mb-1">Client Role / Subtitle</label>
                          <input
                            type="text"
                            value={reviewForm.clientRole}
                            onChange={(e) => setReviewForm({ ...reviewForm, clientRole: e.target.value })}
                            placeholder="e.g., Apex Tech Reviews (2.8M Subs)"
                            className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        {/* Platform / Category Badge */}
                        <div>
                          <label className="block text-neutral-300 font-semibold mb-1">Platform Badge</label>
                          <input
                            type="text"
                            value={reviewForm.platformBadge}
                            onChange={(e) => setReviewForm({ ...reviewForm, platformBadge: e.target.value })}
                            placeholder="e.g., YouTube Creator, Esports Gaming, Commercial Brand"
                            className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                          />
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {['YouTube Creator', 'Esports Gaming', 'Commercial Brand', 'TikTok Viral', 'Agency Client'].map(
                              (p) => (
                                <button
                                  key={p}
                                  type="button"
                                  onClick={() => setReviewForm({ ...reviewForm, platformBadge: p })}
                                  className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white border border-white/5 transition-colors"
                                >
                                  {p}
                                </button>
                              )
                            )}
                          </div>
                        </div>

                        {/* Card Glow / Accent Color */}
                        <div>
                          <label className="block text-neutral-300 font-semibold mb-1">
                            Card Accent Color (Glow & Border)
                          </label>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5">
                              {[
                                { name: 'Cyan', hex: '#06b6d4' },
                                { name: 'Emerald', hex: '#10b981' },
                                { name: 'Purple', hex: '#a855f7' },
                                { name: 'Amber', hex: '#f59e0b' },
                                { name: 'Rose', hex: '#f43f5e' },
                                { name: 'Blue', hex: '#3b82f6' },
                              ].map((c) => (
                                <button
                                  key={c.hex}
                                  type="button"
                                  onClick={() => setReviewForm({ ...reviewForm, accentColor: c.hex })}
                                  className={`w-6 h-6 rounded-full border transition-all ${
                                    reviewForm.accentColor === c.hex
                                      ? 'border-white scale-125 shadow-md'
                                      : 'border-transparent opacity-60 hover:opacity-100'
                                  }`}
                                  style={{ backgroundColor: c.hex }}
                                  title={c.name}
                                />
                              ))}
                            </div>
                            <input
                              type="color"
                              value={reviewForm.accentColor}
                              onChange={(e) => setReviewForm({ ...reviewForm, accentColor: e.target.value })}
                              className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0 ml-1"
                              title="Pick Custom Color"
                            />
                            <input
                              type="text"
                              value={reviewForm.accentColor}
                              onChange={(e) => setReviewForm({ ...reviewForm, accentColor: e.target.value })}
                              className="w-20 px-2 py-1 rounded-lg glass-panel border border-white/10 text-white font-mono text-[11px]"
                            />
                          </div>
                        </div>

                        {/* Star Rating */}
                        <div>
                          <label className="block text-neutral-300 font-semibold mb-1">Star Rating (1 - 5)</label>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/10">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                  className="p-1 hover:scale-125 transition-transform"
                                >
                                  <Star
                                    className={`w-5 h-5 ${
                                      star <= reviewForm.rating
                                        ? 'text-amber-400 fill-amber-400'
                                        : 'text-neutral-700'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                            <span className="text-xs font-bold text-amber-400 font-mono">
                              {reviewForm.rating} / 5 Stars
                            </span>
                          </div>
                        </div>

                        {/* Project Reference & Date */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-neutral-300 font-semibold mb-1">Project Reference</label>
                            <input
                              type="text"
                              value={reviewForm.projectReference}
                              onChange={(e) => setReviewForm({ ...reviewForm, projectReference: e.target.value })}
                              placeholder="e.g. YouTube Long-Form"
                              className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                          <div>
                            <label className="block text-neutral-300 font-semibold mb-1">Date / Period</label>
                            <input
                              type="text"
                              value={reviewForm.date}
                              onChange={(e) => setReviewForm({ ...reviewForm, date: e.target.value })}
                              placeholder="e.g. February 2026"
                              className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                        </div>

                        {/* Client Photo Profile & Presets */}
                        <div className="sm:col-span-2">
                          <label className="block text-neutral-300 font-semibold mb-1">
                            Client Profile Photo / Avatar
                          </label>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <div
                              className="w-14 h-14 rounded-2xl overflow-hidden border-2 p-0.5 shrink-0 bg-neutral-900 shadow-md"
                              style={{ borderColor: reviewForm.accentColor }}
                            >
                              <img
                                src={reviewForm.clientPhoto}
                                alt="Client Avatar Preview"
                                className="w-full h-full object-cover rounded-xl"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
                                }}
                              />
                            </div>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={reviewForm.clientPhoto}
                                  onChange={(e) => setReviewForm({ ...reviewForm, clientPhoto: e.target.value })}
                                  placeholder="Image URL https://..."
                                  className="flex-1 px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none text-xs"
                                />
                                <label className="px-3.5 py-2 rounded-xl glass-panel border border-white/15 hover:border-white/30 text-neutral-200 hover:text-white cursor-pointer flex items-center gap-1.5 shrink-0 transition-all">
                                  <Camera className="w-3.5 h-3.5 text-cyan-400" />
                                  <span className="font-semibold">Upload Photo</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                  />
                                </label>
                              </div>

                              {/* Quick 1-Click Avatar Presets */}
                              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                                <span className="text-[10px] text-neutral-400 shrink-0">Quick Presets:</span>
                                {[
                                  { label: 'Creator (M)', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80' },
                                  { label: 'Creator (F)', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80' },
                                  { label: 'Executive', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
                                  { label: 'Brand Dir', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
                                  { label: 'Gaming Lead', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80' },
                                ].map((p) => (
                                  <button
                                    key={p.label}
                                    type="button"
                                    onClick={() => setReviewForm({ ...reviewForm, clientPhoto: p.url })}
                                    className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 border border-white/5 whitespace-nowrap transition-colors"
                                  >
                                    {p.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Review Testimonial Text */}
                        <div className="sm:col-span-2">
                          <label className="block text-neutral-300 font-semibold mb-1">
                            Review Testimonial Text *
                          </label>
                          <textarea
                            rows={3}
                            required
                            value={reviewForm.text}
                            onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                            placeholder="Write the custom client review here... (e.g., 'AL1 Studio delivered flawless retention pacing and sound design...')"
                            className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none focus:border-cyan-400 text-xs resize-none leading-relaxed"
                          />
                        </div>
                      </div>

                      {/* Form Actions */}
                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => {
                            setShowReviewForm(false);
                            setEditingReviewId(null);
                          }}
                          className="px-4 py-2 rounded-xl glass-panel border border-white/10 text-xs text-neutral-400 hover:text-white"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl text-black font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all"
                          style={{ backgroundColor: 'var(--accent)' }}
                        >
                          {editingReviewId ? 'Update Review' : 'Save Custom Review'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Reviews List with Safe Delete & Full Preview */}
                  <div className="space-y-3">
                    {reviews.map((rev, idx) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl glass-card border border-white/10 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:border-white/20 transition-all"
                        style={{
                          borderLeft: `4px solid ${rev.accentColor || '#06b6d4'}`,
                        }}
                      >
                        <div className="flex items-start gap-3.5">
                          {/* Reorder Arrows */}
                          <div className="flex flex-col gap-1 mt-1">
                            <button
                              onClick={() => handleMoveReview(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded bg-white/5 hover:bg-white/10 text-neutral-400 disabled:opacity-20"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleMoveReview(idx, 'down')}
                              disabled={idx === reviews.length - 1}
                              className="p-1 rounded bg-white/5 hover:bg-white/10 text-neutral-400 disabled:opacity-20"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Avatar with Glow Border */}
                          <div
                            className="w-12 h-12 rounded-xl overflow-hidden border-2 p-0.5 shrink-0 bg-neutral-900 shadow-md"
                            style={{ borderColor: rev.accentColor || '#06b6d4' }}
                          >
                            <img src={rev.clientPhoto} alt={rev.clientName} className="w-full h-full object-cover rounded-lg" />
                          </div>

                          {/* Info */}
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-heading font-bold text-sm text-white flex items-center gap-1.5">
                                <span>{rev.clientName}</span>
                                {rev.isVerified !== false && (
                                  <span title="Verified Client">
                                    <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400/20" />
                                  </span>
                                )}
                              </h4>

                              {rev.platformBadge && (
                                <span
                                  className="text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold"
                                  style={{
                                    backgroundColor: `${rev.accentColor || '#06b6d4'}15`,
                                    borderColor: `${rev.accentColor || '#06b6d4'}40`,
                                    color: rev.accentColor || '#06b6d4',
                                  }}
                                >
                                  {rev.platformBadge}
                                </span>
                              )}

                              <div className="flex items-center gap-0.5">
                                {[...Array(rev.rating)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                                ))}
                              </div>
                            </div>

                            <p className="text-xs text-neutral-400 mt-0.5">
                              {rev.clientRole} • <span className="text-white font-medium">{rev.projectReference}</span>
                              {rev.date && <span className="text-neutral-500 font-mono ml-2">({rev.date})</span>}
                            </p>
                            <p className="text-xs text-neutral-300 mt-1 italic line-clamp-2">"{rev.text}"</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                          <button
                            onClick={() => handleEditReview(rev)}
                            className="p-2 rounded-xl glass-panel border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white text-xs transition-all"
                            title="Edit Review"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {deleteConfirmReviewId === rev.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  deleteReview(rev.id);
                                  setDeleteConfirmReviewId(null);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs animate-pulse"
                              >
                                Delete?
                              </button>
                              <button
                                onClick={() => setDeleteConfirmReviewId(null)}
                                className="px-2 py-1 rounded-lg bg-neutral-800 text-neutral-400 text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmReviewId(rev.id)}
                              className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs transition-all"
                              title="Delete Review"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: SKILLS & SOFTWARE */}
              {activeTab === 'skills' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-lg text-white">Skills & Software Expertise Manager</h3>
                      <p className="text-xs text-neutral-400">
                        Update NLE video editing software badges, icons, and proficiency percentages.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setEditingSkillId(null);
                        setSkillForm({
                          name: '',
                          proficiency: 95,
                          badge: 'Video Editing',
                          icon: 'Film',
                        });
                        setShowSkillForm(!showSkillForm);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5 shadow-md shrink-0"
                      style={{ backgroundColor: 'var(--accent)' }}
                    >
                      <Plus className="w-4 h-4" />
                      <span>{showSkillForm ? 'Cancel' : 'Add Skill'}</span>
                    </button>
                  </div>

                  {/* Add / Edit Skill Form */}
                  {showSkillForm && (
                    <form
                      onSubmit={handleSaveSkill}
                      className="p-5 rounded-2xl glass-card border border-white/15 space-y-4"
                    >
                      <h4 className="font-heading font-bold text-sm text-white">
                        {editingSkillId ? 'Edit Software Skill' : 'Add Software Skill'}
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div>
                          <label className="block text-neutral-300 font-semibold mb-1">Software Name *</label>
                          <input
                            type="text"
                            required
                            value={skillForm.name}
                            onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                            placeholder="e.g. DaVinci Resolve or Premiere Pro"
                            className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 font-semibold mb-1">Specialty Badge *</label>
                          <input
                            type="text"
                            required
                            value={skillForm.badge}
                            onChange={(e) => setSkillForm({ ...skillForm, badge: e.target.value })}
                            placeholder="e.g., Lead NLE & Pacing, VFX, Color Grading"
                            className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 font-semibold mb-1">
                            Proficiency ({skillForm.proficiency}%)
                          </label>
                          <input
                            type="range"
                            min="50"
                            max="100"
                            value={skillForm.proficiency}
                            onChange={(e) => setSkillForm({ ...skillForm, proficiency: Number(e.target.value) })}
                            className="w-full accent-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="block text-neutral-300 font-semibold mb-1">Icon Style</label>
                          <select
                            value={skillForm.icon}
                            onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white bg-neutral-900 focus:outline-none"
                          >
                            <option value="Film">Film (NLE / Premiere / FCPX)</option>
                            <option value="Layers">Layers (After Effects / Motion)</option>
                            <option value="Sliders">Sliders (DaVinci / Color)</option>
                            <option value="Smartphone">Smartphone (CapCut / Reels)</option>
                            <option value="Box">Box (Blender / 3D)</option>
                            <option value="Cpu">Cpu (General / Tech)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                        <button
                          type="button"
                          onClick={() => {
                            setShowSkillForm(false);
                            setEditingSkillId(null);
                          }}
                          className="px-4 py-2 rounded-xl glass-panel border border-white/10 text-xs text-neutral-400"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl text-black font-bold text-xs uppercase tracking-wider"
                          style={{ backgroundColor: 'var(--accent)' }}
                        >
                          {editingSkillId ? 'Update Skill' : 'Save Skill'}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Skills List with Safe Delete */}
                  <div className="space-y-2.5">
                    {skills.map((skill, idx) => (
                      <div
                        key={skill.id}
                        className="p-3.5 rounded-2xl glass-card border border-white/10 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col gap-1">
                            <button
                              onClick={() => handleMoveSkill(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded bg-white/5 hover:bg-white/10 text-neutral-400 disabled:opacity-20"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleMoveSkill(idx, 'down')}
                              disabled={idx === skills.length - 1}
                              className="p-1 rounded bg-white/5 hover:bg-white/10 text-neutral-400 disabled:opacity-20"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>

                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center border font-bold"
                            style={{
                              backgroundColor: 'rgba(var(--accent-rgb), 0.15)',
                              borderColor: 'var(--accent)',
                              color: 'var(--accent)',
                            }}
                          >
                            <Film className="w-4 h-4" />
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-heading font-bold text-sm text-white">{skill.name}</h4>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-neutral-300">
                                {skill.badge}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400">
                              <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${skill.proficiency}%`,
                                    backgroundColor: 'var(--accent)',
                                  }}
                                />
                              </div>
                              <span className="font-mono text-cyan-400">{skill.proficiency}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleEditSkill(skill)}
                            className="p-2 rounded-xl glass-panel border border-white/10 hover:border-white/20 text-neutral-300 hover:text-white text-xs"
                            title="Edit Skill"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {deleteConfirmSkillId === skill.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  deleteSkill(skill.id);
                                  setDeleteConfirmSkillId(null);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs"
                              >
                                Delete?
                              </button>
                              <button
                                onClick={() => setDeleteConfirmSkillId(null)}
                                className="px-2 py-1 rounded-lg bg-neutral-800 text-neutral-400 text-xs"
                              >
                                ✕
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmSkillId(skill.id)}
                              className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs"
                              title="Delete Skill"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: SITE & THEME SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-8">
                  {/* Brand Settings */}
                  <form onSubmit={handleSaveBrand} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-heading font-bold text-base text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                        Studio Brand Information
                      </h4>
                      {brandSaved && (
                        <span className="text-xs text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Saved!
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-neutral-300 font-semibold mb-1">Brand Name *</label>
                        <input
                          type="text"
                          required
                          value={brandForm.name}
                          onChange={(e) => setBrandForm({ ...brandForm, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-300 font-semibold mb-1">Tagline *</label>
                        <input
                          type="text"
                          required
                          value={brandForm.tagline}
                          onChange={(e) => setBrandForm({ ...brandForm, tagline: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-neutral-300 font-semibold mb-1">Status / Availability Text</label>
                        <input
                          type="text"
                          value={brandForm.statusText}
                          onChange={(e) => setBrandForm({ ...brandForm, statusText: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-neutral-300 font-semibold mb-1">Bio / Intro Text</label>
                        <textarea
                          rows={2}
                          value={brandForm.bio}
                          onChange={(e) => setBrandForm({ ...brandForm, bio: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl text-black font-bold text-xs uppercase tracking-wider"
                        style={{ backgroundColor: 'var(--accent)' }}
                      >
                        Update Brand Info
                      </button>
                    </div>
                  </form>

                  {/* Theme & Color Engine Settings */}
                  <div className="pt-6 border-t border-white/10 space-y-4">
                    <h4 className="font-heading font-bold text-base text-white flex items-center gap-2">
                      <Palette className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                      Site & Global Color Defaults
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-neutral-300 font-semibold mb-1">Default Mode</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => updateTheme({ mode: 'dark' })}
                            className={`flex-1 py-2 rounded-xl border flex items-center justify-center gap-2 ${
                              theme.mode === 'dark'
                                ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                                : 'border-white/10 glass-panel text-neutral-400'
                            }`}
                          >
                            <Moon className="w-3.5 h-3.5" />
                            <span>Dark Mode</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => updateTheme({ mode: 'light' })}
                            className={`flex-1 py-2 rounded-xl border flex items-center justify-center gap-2 ${
                              theme.mode === 'light'
                                ? 'border-amber-500 bg-amber-500/20 text-amber-300'
                                : 'border-white/10 glass-panel text-neutral-400'
                            }`}
                          >
                            <Sun className="w-3.5 h-3.5" />
                            <span>Light Mode</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-neutral-300 font-semibold mb-1">Background Particles</label>
                        <div className="flex gap-1.5">
                          {(['off', 'low', 'medium', 'high'] as const).map((lvl) => (
                            <button
                              key={lvl}
                              type="button"
                              onClick={() => updateTheme({ particleIntensity: lvl })}
                              className={`flex-1 py-2 rounded-xl border text-[11px] uppercase font-semibold capitalize ${
                                theme.particleIntensity === lvl
                                  ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                                  : 'border-white/10 glass-panel text-neutral-400'
                              }`}
                            >
                              {lvl}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-neutral-300 font-semibold mb-2">Accent Glow Color</label>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {accentOptions.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => updateTheme({ accent: opt.value, customHex: undefined })}
                              className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 text-[11px] font-semibold transition-all ${
                                theme.accent === opt.value
                                  ? 'border-white bg-white/15 text-white scale-105 shadow-md'
                                  : 'border-white/10 glass-panel text-neutral-400 hover:text-white'
                              }`}
                            >
                              <span
                                className="w-4 h-4 rounded-full shadow"
                                style={{ backgroundColor: opt.hex, boxShadow: `0 0 10px ${opt.hex}80` }}
                              />
                              <span className="truncate">{opt.name.split(' ')[0]}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Admin Password Change */}
                  <form onSubmit={handleChangePassword} className="pt-6 border-t border-white/10 space-y-4">
                    <h4 className="font-heading font-bold text-base text-white flex items-center gap-2">
                      <Key className="w-4 h-4 text-emerald-400" />
                      Security & Admin Password
                    </h4>

                    {passFeedback && (
                      <p
                        className={`text-xs font-semibold ${
                          passFeedback.type === 'success' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {passFeedback.msg}
                      </p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-neutral-300 font-semibold mb-1">Current Password *</label>
                        <input
                          type="password"
                          required
                          value={oldPass}
                          onChange={(e) => setOldPass(e.target.value)}
                          placeholder="Current PIN..."
                          className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-300 font-semibold mb-1">New Password *</label>
                        <input
                          type="password"
                          required
                          value={newPass}
                          onChange={(e) => setNewPass(e.target.value)}
                          placeholder="Enter new PIN / password..."
                          className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl glass-panel border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20 font-bold text-xs uppercase tracking-wider"
                      >
                        Change Password
                      </button>
                    </div>
                  </form>

                  {/* LIVE CLOUD DATABASE & MULTI-BROWSER SYNC */}
                  <div className="pt-6 border-t border-white/10 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-heading font-bold text-base text-white flex items-center gap-2">
                          <Cloud className="w-4 h-4 text-cyan-400" />
                          Cloud Database & Multi-Browser Sync (সব ব্রাউজারে লাইভ আপডেট)
                        </h4>
                        <p className="text-[11px] text-neutral-400 mt-0.5">
                          Admin Panel এ পরিবর্তন করলে তা যাতে সব ব্রাউজার, মোবাইল ও ভিজিটরদের কাছে সাথে সাথে আপডেট হয়।
                        </p>
                      </div>

                      {/* Connection status badge */}
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                          {syncStatus === 'syncing' ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 animate-pulse">
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              Syncing...
                            </span>
                          ) : cloudConfig.firebaseUrl || cloudConfig.customRestUrl ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                              Live Cloud Active
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-neutral-800 text-neutral-400 border border-white/10 flex items-center gap-1.5">
                              <Database className="w-3 h-3" />
                              Local Cache Only
                            </span>
                          )}
                        </div>
                        {syncMessage && (
                          <span className="text-[10px] text-neutral-400">
                            {syncMessage}
                          </span>
                        )}
                      </div>
                    </div>

                    {cloudFeedback && (
                      <div
                        className={`p-3 rounded-xl text-xs font-semibold border ${
                          cloudFeedback.type === 'success'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                        }`}
                      >
                        {cloudFeedback.msg}
                      </div>
                    )}

                    {/* Method Selector */}
                    <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setCloudForm({ ...cloudForm, provider: 'firebase' })}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            cloudForm.provider === 'firebase'
                              ? 'border-cyan-500 bg-cyan-500/15 text-white'
                              : 'border-white/5 bg-white/[0.02] text-neutral-400 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 font-bold text-xs text-cyan-300 mb-1">
                            <Cloud className="w-4 h-4" />
                            Firebase Realtime DB
                          </div>
                          <p className="text-[10px] text-neutral-400 leading-tight">
                            ১০০% ফ্রি, সার্ভারলেস। যেকোনো ব্রাউজারে সাথে সাথে লাইভ আপডেট।
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCloudForm({ ...cloudForm, provider: 'github' })}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            cloudForm.provider === 'github'
                              ? 'border-purple-500 bg-purple-500/15 text-white'
                              : 'border-white/5 bg-white/[0.02] text-neutral-400 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 font-bold text-xs text-purple-300 mb-1">
                            <GithubIcon className="w-4 h-4" />
                            GitHub Direct Sync
                          </div>
                          <p className="text-[10px] text-neutral-400 leading-tight">
                            সরাসরি গিটহাবে কমিট হবে এবং Vercel অটো রি-ডিপ্লয় করবে।
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCloudForm({ ...cloudForm, provider: 'custom_rest' })}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            cloudForm.provider === 'custom_rest'
                              ? 'border-emerald-500 bg-emerald-500/15 text-white'
                              : 'border-white/5 bg-white/[0.02] text-neutral-400 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 font-bold text-xs text-emerald-300 mb-1">
                            <Database className="w-4 h-4" />
                            Custom REST API
                          </div>
                          <p className="text-[10px] text-neutral-400 leading-tight">
                            কাস্টম সার্ভার বা নিজের যেকোনো API এন্ডপয়েন্ট।
                          </p>
                        </button>
                      </div>

                      {/* Provider Details Form */}
                      {cloudForm.provider === 'firebase' && (
                        <div className="space-y-3 pt-2">
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-neutral-300 font-semibold text-xs">
                                Firebase Realtime Database URL:
                              </label>
                              <button
                                type="button"
                                onClick={() => setShowFirebaseGuide(!showFirebaseGuide)}
                                className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                              >
                                <Info className="w-3 h-3" />
                                {showFirebaseGuide ? 'Hide Guide' : '২ মিনিটে ফ্রি Firebase সেটআপ গাইড'}
                              </button>
                            </div>
                            <input
                              type="url"
                              value={cloudForm.firebaseUrl}
                              onChange={(e) => setCloudForm({ ...cloudForm, firebaseUrl: e.target.value })}
                              placeholder="https://your-portfolio-default-rtdb.firebaseio.com"
                              className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-cyan-500"
                            />
                          </div>

                          {showFirebaseGuide && (
                            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-[11px] text-cyan-200/90 space-y-1.5 leading-relaxed">
                              <p className="font-bold text-white flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                মাত্র ৩ ধাপে বিনামূল্যে Firebase Realtime DB চালু করুন:
                              </p>
                              <ol className="list-decimal pl-4 space-y-1">
                                <li>
                                  <a
                                    href="https://console.firebase.google.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-cyan-300 underline font-semibold inline-flex items-center gap-0.5"
                                  >
                                    console.firebase.google.com <ExternalLink className="w-2.5 h-2.5" />
                                  </a>{' '}
                                  এ গিয়ে <b>Add Project</b> দিয়ে যেকোনো প্রজেক্ট খুলুন (ফ্রি Spark প্ল্যান)।
                                </li>
                                <li>
                                  বামপাশের মেনু থেকে <b>Build &gt; Realtime Database</b> সিলেক্ট করে <b>Create Database</b> চাপুন।
                                </li>
                                <li>
                                  Security Rules এ <b>Start in test mode</b> সিলেক্ট করে Done দিন। উপরে তৈরি হওয়া ডাটাবেস URL (যেমন <code>https://xxx-rtdb.firebaseio.com</code>) কপি করে এই বক্সে বসিয়ে নিচের বাটন চাপুন!
                                </li>
                              </ol>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs pt-1">
                            <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={cloudForm.autoSync}
                                onChange={(e) => setCloudForm({ ...cloudForm, autoSync: e.target.checked })}
                                className="rounded text-cyan-500 focus:ring-0"
                              />
                              <span>Admin Panel এ যেকোনো পরিবর্তন সাথে সাথে অটোমেটিক সেভ হবে</span>
                            </label>
                          </div>
                        </div>
                      )}

                      {cloudForm.provider === 'github' && (
                        <div className="space-y-3 pt-2 text-xs">
                          <div>
                            <label className="block text-neutral-300 font-semibold mb-1">
                              GitHub Personal Access Token (PAT):
                            </label>
                            <input
                              type="password"
                              value={cloudForm.githubToken}
                              onChange={(e) => setCloudForm({ ...cloudForm, githubToken: e.target.value })}
                              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                              className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white font-mono text-xs focus:outline-none"
                            />
                            <p className="text-[10px] text-neutral-500 mt-1">
                              Repo write permission সহ একটি GitHub Token প্রয়োজন। এটি সরাসরি রিপোজিটরিতে <code>public/portfolioData.json</code> ফাইল কমিট করবে।
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-neutral-400 mb-1 text-[11px]">Repository</label>
                              <input
                                type="text"
                                value={cloudForm.githubRepo}
                                onChange={(e) => setCloudForm({ ...cloudForm, githubRepo: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-xl glass-panel border border-white/10 text-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-neutral-400 mb-1 text-[11px]">Branch</label>
                              <input
                                type="text"
                                value={cloudForm.githubBranch}
                                onChange={(e) => setCloudForm({ ...cloudForm, githubBranch: e.target.value })}
                                className="w-full px-3 py-1.5 rounded-xl glass-panel border border-white/10 text-white text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {cloudForm.provider === 'custom_rest' && (
                        <div className="space-y-3 pt-2 text-xs">
                          <div>
                            <label className="block text-neutral-300 font-semibold mb-1">
                              Custom API Endpoint URL (GET/PUT):
                            </label>
                            <input
                              type="url"
                              value={cloudForm.customRestUrl}
                              onChange={(e) => setCloudForm({ ...cloudForm, customRestUrl: e.target.value })}
                              placeholder="https://api.yourdomain.com/portfolio"
                              className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white font-mono text-xs focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-neutral-300 font-semibold mb-1">
                              API Key / Secret Token (Optional):
                            </label>
                            <input
                              type="password"
                              value={cloudForm.customApiKey}
                              onChange={(e) => setCloudForm({ ...cloudForm, customApiKey: e.target.value })}
                              placeholder="Bearer token or secret..."
                              className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white font-mono text-xs focus:outline-none"
                            />
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/10">
                        <button
                          type="button"
                          onClick={handleSaveCloudConfig}
                          className="px-4 py-2 rounded-xl text-black font-bold text-xs uppercase tracking-wider"
                          style={{ backgroundColor: 'var(--accent)' }}
                        >
                          Save Cloud Settings
                        </button>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            disabled={isCloudSyncing}
                            onClick={handleManualSyncNow}
                            className="px-3.5 py-2 rounded-xl glass-panel border border-cyan-500/40 hover:bg-cyan-500/20 text-cyan-300 font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
                          >
                            <UploadCloud className="w-3.5 h-3.5" />
                            <span>{isCloudSyncing ? 'Syncing...' : 'Sync Now to Cloud'}</span>
                          </button>

                          <button
                            type="button"
                            disabled={isCloudSyncing}
                            onClick={handleManualFetchNow}
                            className="px-3.5 py-2 rounded-xl glass-panel border border-white/15 hover:bg-white/10 text-neutral-300 font-bold text-xs flex items-center gap-1.5 disabled:opacity-50"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isCloudSyncing ? 'animate-spin' : ''}`} />
                            <span>Fetch Latest</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Offline / Code Export Options (Always work 100% without any DB) */}
                    <div className="p-4 rounded-2xl glass-panel border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className="font-heading font-bold text-xs text-white flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          ডাটাবেজ ছাড়া সরাসরি কোডে পার্মানেন্ট সেভ করার বিকল্প অপশন:
                        </h5>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        আপনি চাইলে ডাটাবেজ ছাড়াও বর্তমান সব চেঞ্জ সহ কোড কপি করে নিতে পারেন অথবা <code>portfolioData.json</code> ফাইল ডাউনলোড করে আপনার প্রজেক্টের <code>public/</code> ফোল্ডারে রিপ্লেস করে গিটহাবে পুশ করলেই সবার জন্য পার্মানেন্ট হয়ে যাবে।
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleCopyInitialDataTs}
                          className="px-3.5 py-2 rounded-xl glass-panel border border-amber-500/40 hover:bg-amber-500/20 text-amber-300 text-xs font-bold flex items-center gap-1.5"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>{copiedTs ? 'Copied initialData.ts!' : 'Copy Code as initialData.ts'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleDownloadPortfolioDataJson}
                          className="px-3.5 py-2 rounded-xl glass-panel border border-white/15 hover:bg-white/10 text-neutral-200 text-xs font-bold flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download portfolioData.json</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleDownloadCloudConfigJson}
                          className="px-3.5 py-2 rounded-xl glass-panel border border-cyan-500/30 hover:bg-cyan-500/15 text-cyan-300 text-xs font-bold flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>{copiedConfig ? 'Downloaded!' : 'Download cloudConfig.json'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Data Backup & Restore */}
                  <div className="pt-6 border-t border-white/10 space-y-4">
                    <h4 className="font-heading font-bold text-base text-white flex items-center gap-2">
                      <Download className="w-4 h-4 text-cyan-400" />
                      Backup & Data Migration
                    </h4>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={exportPortfolioData}
                        className="px-4 py-2.5 rounded-xl glass-panel border border-cyan-500/40 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export Backup (JSON)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Reset all videos, categories, links, and reviews to default AL1 Studio data?')) {
                            resetToDefaultData();
                            alert('Reset successfully to default studio data!');
                          }
                        }}
                        className="px-4 py-2.5 rounded-xl glass-panel border border-rose-500/30 hover:bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Reset To Defaults</span>
                      </button>
                    </div>

                    <div className="mt-3">
                      <label className="block text-neutral-400 font-semibold mb-1 text-xs">
                        Import Data from JSON Backup:
                      </label>
                      <textarea
                        rows={2}
                        value={importJson}
                        onChange={(e) => setImportJson(e.target.value)}
                        placeholder="Paste exported JSON here..."
                        className="w-full px-3 py-2 rounded-xl glass-panel border border-white/10 text-white font-mono text-[11px] resize-none"
                      />
                      {importMessage && (
                        <p
                          className={`text-xs mt-1 ${
                            importMessage.success ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {importMessage.msg}
                        </p>
                      )}
                      {importJson.trim() && (
                        <button
                          type="button"
                          onClick={() => {
                            const success = importPortfolioData(importJson);
                            if (success) {
                              setImportMessage({ success: true, msg: 'Data imported successfully!' });
                              setImportJson('');
                            } else {
                              setImportMessage({ success: false, msg: 'Invalid JSON format. Please verify.' });
                            }
                          }}
                          className="mt-2 px-4 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 text-xs font-bold"
                        >
                          Apply Imported Data
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
