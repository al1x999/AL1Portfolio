# Implementation Plan: AL1 Studio Portfolio Upgrades & Fixes

## 1. Overview & User Goals
1. **Video Layout Fix**: In the "All" section, long videos (16:9) had awkward black letterboxing and appeared cut-off in vertical grids. Reorganize so **Long Videos (16:9 widescreen)** appear on top in their own 16:9 grid without any cut-offs or black bars, and **Reels / Shorts (9:16)** appear below in a dedicated smartphone reel grid.
2. **Remove guns.lol Section**: Remove the guns.lol style link hub section from the Hero and main application page.
3. **Terms of Service (কাজের নীতিমালা) Enhancements**:
   - In the top navbar, change the section name to English: **"Terms of Service"** (or **"Terms"**).
   - Make each policy card interactive: clicking a card opens an in-depth details modal showing **Hadith / Quranic References (হাদিস ও কুরআনের দলিল)**, **Detailed Islamic Explanations (কেন হারাম / শরীয়তের বিধান)**, SFX/Halal alternative guidelines, and the reference YouTube video.
   - Make all detailed info, Hadiths, and references fully customizable from the Admin Panel.
4. **Logo Update & Sizing**:
   - Use the black-background AL1 logo provided by the user (`media_1791174807971.png`).
   - Slight zoom (`scale-125` / `scale-130`) inside a sleek black rounded container so it fills the badge without looking like an inset rectangular box.

---

## 2. Step-by-Step Execution Plan

### Step 1: Update Logo File & Styling
- Copy `media_1791174807971.png` to `public/logo.png`.
- In `Navbar.tsx`, `HeaderHero.tsx`, `TermsPolicySection.tsx`, `AdminModal.tsx`, `Footer.tsx`:
  - Wrap logo in a pure black container `bg-black border border-white/10`.
  - Zoom the logo slightly (`scale-125 transition-transform duration-300 group-hover:scale-135`).

### Step 2: Update Types & Initial Data
- In `src/types/portfolio.ts`:
  - Extend `PolicyRule` with:
    - `hadithReference?: string;` (হাদিস / কুরআনের দলিল)
    - `detailedExplanation?: string;` (বিস্তারিত ব্যাখ্যা)
- In `src/data/initialData.ts`:
  - Enrich initial rules 01 to 06 with authentic Hadith references & detailed explanations:
    1. **গান ও বাদ্যযন্ত্র**: সহীহ বুখারী ৫৫৯০ (বাদ্যযন্ত্র হারাম সংক্রান্ত বিখ্যাত হাদিস), বিস্তারিত বিধান ও সাউন্ড ইফেক্ট (SFX) ব্যবহারের শর্ত।
    2. **নারীর ছবি ও অশ্লীলতা**: সূরা আন-নূর ৩০-৩১ ও সহীহ হাদিস, পর্দা ও অনাবৃত ছবি পরিহারের ব্যাখ্যা।
    3. **হারাম পণ্য**: মদ, জুয়া, লটারি, সুদ ও যেকোনো নিষিদ্ধ পণ্যের প্রচারণা হারাম হওয়ার দলিল।
    4. **পণ্য ও রেফারেন্স ইমেজ**: কপিরাইট, আমানতদারিতা ও অনুমোদিত রয়্যালটি-ফ্রি উপাদানের বিধান।
    5. **মিথ্যা ও ধোঁকাবাজি**: "যে ব্যক্তি ধোঁকা দেয় সে আমার দলভুক্ত নয়" (সহীহ মুসলিম ১০২) - কালার গ্রেডিং বা এডিটিংয়ে মিথ্যা প্রচারের নিষেধাজ্ঞা।
    6. **শির্ক ও পৌত্তলিক উপাদান**: শির্ক ও গায়রুল্লাহর প্রতীক ব্যবহারের নিষেধাজ্ঞা।

### Step 3: Video Showcase Section Reorganization (`VideoShowcase.tsx`)
- Separate long videos (`aspectRatio === '16:9'`) and vertical reels (`aspectRatio === '9:16'`).
- In **"All Projects"** view:
  - Top Sub-section: **"Long Form & Commercials (16:9)"**
    - Rendered in true `aspect-video` (16:9) responsive grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`).
    - Zero black bars or vertical letterboxing.
  - Bottom Sub-section: **"Vertical Shorts & Reels (9:16)"**
    - Rendered in sleek smartphone `aspect-[9/16]` grid (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`).
- Category tabs:
  - "All Projects"
  - "Long Form (16:9)"
  - "Reels & Shorts (9:16)"
  - Category-specific filters.

### Step 4: Remove guns.lol Section
- In `src/App.tsx`:
  - Remove `<SocialLinkHub />` from `<main>`.
- In `src/components/HeaderHero.tsx`:
  - Remove guns.lol profile/link hub card.
  - Retain direct CTA buttons: "Explore Portfolio" and "Terms of Service".
- In `src/components/Navbar.tsx`:
  - Remove "Social & Links" from navigation links.
  - Change "কাজের নীতিমালা" to **"Terms of Service"**.
- In `src/components/MobileBottomNav.tsx`:
  - Remove "Links" button and keep Videos, Terms, Reviews, Admin.

### Step 5: Interactive Terms of Service & Detailed Hadith Modal (`TermsPolicySection.tsx`)
- Navbar and section title: English **"Terms of Service"** in the top navigation.
- Interactive card click:
  - Clicking any card opens a rich modal dialog (`PolicyDetailModal`):
    - Rule number, Title, Summary
    - **হাদিস ও কুরআনের দলিল (Hadith Reference)** with book name & number
    - **কেন হারাম / বিস্তারিত শরীয়াহ বিধান (Detailed Islamic Explanation)**
    - **হালাল বিকল্প ও SFX নির্দেশনা (Halal Alternatives)**
    - **রেফারেন্স ইউটিউব ভিডিও প্লেয়ার (Embedded YouTube Player)**
    - **সরাসরি যোগাযোগের বাটন (Direct WhatsApp Consultation)**
- Interactive hover effects on cards indicating clickability ("বিস্তারিত জানতে ক্লিক করুন").

### Step 6: Admin Panel Customization (`AdminModal.tsx`)
- Update Policy Rule Form to allow adding/editing:
  - Rule Number
  - Title
  - Summary Description
  - Hadith / Quranic Reference (হাদিস / কুরআনের দলিল)
  - Detailed Explanation (কেন হারাম / বিস্তারিত বিধান)
  - YouTube Reference URL
  - Pin Color
- Save changes to `localStorage` via `PortfolioContext`.

### Step 7: Testing & Verification
- Compile with `tsc -b` and build with `npm run build`.
- Verify dev server output and test UI responsiveness across desktop and mobile.
