import { useEffect, useState } from 'react';

/**
 * Lightweight Asset & Media Protection Hook for AL1 Portfolio
 * Prevents casual image drag-and-drop theft and context-menu downloading of media assets,
 * while strictly preserving normal user accessibility, text selection, screen readers, and SEO.
 * Official Brand: AL1
 */
export function useAssetProtection() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let toastTimeout: any = null;

    const showToast = (msg: string) => {
      setToastMessage(msg);
      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        setToastMessage(null);
      }, 2500);
    };

    // 1. Prevent casual image / video drag-and-drop save
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'IMG' || target.tagName === 'VIDEO' || target.closest('img') || target.closest('video'))) {
        e.preventDefault();
        showToast('© 2026 AL1 — Media assets are legally protected.');
      }
    };

    // 2. Prevent right-click context menu specifically on imagery/media assets
    // Keeps context menu completely active for normal text, paragraphs, and links
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'IMG' ||
          target.tagName === 'VIDEO' ||
          target.closest('img') ||
          target.closest('video') ||
          target.classList.contains('protected-asset'))
      ) {
        e.preventDefault();
        showToast('© 2026 AL1 — Media assets & designs are copyrighted.');
      }
    };

    window.addEventListener('dragstart', handleDragStart, { passive: false });
    window.addEventListener('contextmenu', handleContextMenu, { passive: false });

    return () => {
      window.removeEventListener('dragstart', handleDragStart);
      window.removeEventListener('contextmenu', handleContextMenu);
      if (toastTimeout) clearTimeout(toastTimeout);
    };
  }, []);

  return { toastMessage };
}
