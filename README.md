# 🎬 Alex Vance | Ultra-Modern 3D / Glassmorphism Portfolio & CMS

A state-of-the-art, interactive portfolio website for a **Senior Video Editor & Visual Storyteller**, built with React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, and Lucide Icons.

---

## ✨ Features & Architecture

### 1. 🌌 Design Aesthetics & Theme Engine
- **Sleek Dark Mode (Default) & Light Mode**: Seamless toggling with smooth transitions.
- **Dynamic Neon Accent Glow Picker**: Choose between 6 curated neon presets:
  - ⚡ **Neon Cyan** (`#06b6d4`)
  - 🔮 **Cyber Purple** (`#a855f7`)
  - 🌿 **Emerald VFX** (`#10b981`)
  - 🌅 **Amber Sunset** (`#f59e0b`)
  - 🌹 **Crimson Rose** (`#f43f5e`)
  - 🌀 **Electric Indigo** (`#6366f1`)
- **Interactive Background**: Dynamic HTML5 canvas with real-time audio/video timeline waveforms and particle mesh reacting to mouse movement.
- **Dynamic Neon Cursor Follower**: Dual-ring neon cursor with magnetic expansion on interactive targets (automatically disabled on mobile/touch devices).
- **Glassmorphism & Depth**: Multi-layer frosted glass panels, subtle borders, specular highlights, and 3D hover effects.

---

### 2. 🚀 Hero Section
- **Kinetic Typewriter Typography**: Dynamic roles cycling through *Viral YouTube Retention Specialist*, *Commercial & Brand Video Editor*, *3D Motion & VFX Artist*, and *DaVinci Colorist*.
- **Video Editor Timeline Visualizer**: Live audio waveform peak bars, timecode indicator (`00:14:38:22`), and 24 FPS / 4K ProRes badges.
- **Quick Stats Counter Cards**:
  - **150+** Projects Completed
  - **4,500+** Timeline Hours
  - **99.4%** Client Retention & Satisfaction
  - **120M+** Total YouTube Views Driven
- **Action CTAs**: Smooth-scroll direct links to **"Explore My Work"** and **"Hire Me / Instant Chat"**.

---

### 3. 🎥 YouTube Video Showcase (Core Feature)
- **Theater Lightbox Modal**: Zero-clutter, distraction-free custom YouTube iframe player with autoplay, high-resolution playback, and direct booking CTA.
- **Aspect Ratio Versatility**: Full support for both **16:9 Widescreen (4K/HD)** and **9:16 Vertical Shorts/Reels/TikToks**.
- **Categorization Bar**: Filter by *All Work*, *Commercial & Ads*, *Gaming Highlights*, *Reels & TikToks*, *Cinematic Films*, *Motion Graphics*, *Music Videos*, and *Story & Vlogs* with count pills.
- **Real-Time Live Search**: Instantly filter projects by title, client name, software used, or custom tags with highlight feedback.
- **Sorting Controls**: Sort by *Featured First*, *Most Viewed*, or *Newest Additions*.
- **Rich Card Previews**: Video duration badges, view counters, client tags, category pills, software stack badges, and animated play overlays.

---

### 4. 🎛️ Interactive Raw vs Final Color Grade Slider
- **Draggable Split-Screen Slider**: Smoothly drag the vertical glowing divider to inspect flat camera RAW sensor feeds (`saturate(0.35) contrast(0.68)`) against the finalized theatrical master grade.
- **Multi-Scene Presets**: Switch between *Cyberpunk Commercial Grade* and *Dramatic Mountain Drone Cinema*.
- **Color Science Badges**: Technical specifications showcasing ACEScc color space, custom 3D LUTs, power window masking, and highlight rolloff curves.

---

### 5. ⚡ About, Skills & Editing Philosophy
- **Interactive Software Cards**: Animated proficiency meters for *Adobe Premiere Pro* (98%), *After Effects* (95%), *DaVinci Resolve Studio* (92%), *Blender 3D* (84%), *Sound Design & Foley* (96%), and *CapCut Pro* (97%).
- **Experience Timeline**: Career milestones tracking collaborations with 5M+ subscriber creators, global streetwear brands, and esports organizations.
- **Hardware Rig Specs**: Overview of production workstations, calibrated OLED monitoring, and high-speed NVMe RAID pipelines.
- **The 4 Pillars of Retention Video Editing**: The 3-second hook, rhythm and pacing curve, multi-layered Foley sound design, and theatrical color psychology.

---

### 6. ⭐ Client Testimonials Carousel
- Verified collaboration badges, 5-star ratings, creator avatars, subscriber counts, and tangible retention highlights (e.g. *+65% Average View Duration*, *5.8M Views in 48 Hours*).

---

### 7. 📬 Social & Contact Hub
- **Instant WhatsApp Chat**: Direct click-to-chat button pre-configured with URL-encoded greeting message.
- **Direct Email Launcher**: One-click `mailto:` launcher with pre-filled inquiry template.
- **Discord Creative Hub**: Click-to-copy Discord handle with instant copied toast notification.
- **Interactive Project Inquiry Form**: Real-time validation for Name, Email, Project Category, Budget Tier, Footage URL, and Message.
- **Confetti Celebration**: Dynamic multi-color confetti explosion upon successful submission.
- **Floating Speed Dial Dock**: Expandable quick-access launcher for WhatsApp, Email, and Back to Top.
- **Mobile Bottom Navigation**: Floating dock optimized for smartphones with direct shortcuts.

---

### 8. 🛡️ Powerful CMS Admin Dashboard
Access via the **"Admin"** button in the navbar or mobile dock.

> 🔑 **Master Admin Password (Demo Default):** `admin123`  
> *(Can be changed anytime under the Theme & Presets tab)*

#### Admin Features:
1. **Analytics & Leads Overview**:
   - Total Portfolio Site Visits counter.
   - Total Video Player Lightbox clicks.
   - Client inquiry leads table with full contact details, budgets, and timestamps.
2. **Video Projects Manager**:
   - **Add Video via YouTube URL / Video ID**: Paste any YouTube link (e.g., `https://youtu.be/...`, `https://youtube.com/watch?v=...`, `shorts/...`, or raw 11-char ID). Automatically configures max-res thumbnails (`img.youtube.com/vi/<id>/maxresdefault.jpg`).
   - Assign categories, aspect ratio (`16:9` or `9:16`), duration, views, client, description, software, and tags.
   - Reorder videos (move priority up / down).
   - Toggle visibility (*Draft* vs *Published*).
   - Toggle *Featured* status.
   - Edit and delete existing videos.
3. **Category Manager**: Add, edit, or delete portfolio categories dynamically with custom slugs.
4. **Social Links & WhatsApp Manager**: Update WhatsApp phone number, pre-filled greeting message, email, YouTube, TikTok, Instagram, Discord, and LinkedIn handles.
5. **Theme & Presets Manager**: Choose default theme mode (Dark / Light), accent glow preset, particle density, and neon cursor trail toggle.
6. **Data Backup & Cloud Sync**:
   - **Export Data (JSON)**: Download full portfolio backup file.
   - **Import Data (JSON)**: Paste JSON backup to restore custom portfolio state.
   - **Reset to Defaults**: Restore initial high-tier sample projects.
   - **Production Cloud Sync**: LocalStorage persistence out-of-the-box with direct compatibility for Supabase / Firebase.

---

## 🛠️ Running Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Dev Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173/](http://localhost:5173/) in your browser.

3. **Build for Production**:
   ```bash
   npm run build
   ```
