import React, { useEffect, useRef } from 'react';
import { X, Maximize2 } from 'lucide-react';
import { loadYouTubeIframeApi } from '../utils/youtube';
import type { VideoProject } from '../types/portfolio';

interface InlineVideoPlayerProps {
  video: VideoProject;
  onEnded: () => void;
  onClose: () => void;
  onExpand?: () => void;
}

export const InlineVideoPlayer: React.FC<InlineVideoPlayerProps> = ({
  video,
  onEnded,
  onClose,
  onExpand,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const isDirect = video.youtubeUrl && /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(video.youtubeUrl);

  // Initialize YouTube Iframe Player
  useEffect(() => {
    if (isDirect) return;

    let isCancelled = false;
    const domId = `inline-yt-${video.id}`;

    loadYouTubeIframeApi().then(() => {
      if (isCancelled || !containerRef.current) return;

      // Clean existing player
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch {}
        playerRef.current = null;
      }

      containerRef.current.innerHTML = `<div id="${domId}" class="w-full h-full"></div>`;

      try {
        playerRef.current = new window.YT.Player(domId, {
          height: '100%',
          width: '100%',
          videoId: video.youtubeId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            enablejsapi: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (event: any) => {
              if (isCancelled) return;
              event.target.playVideo();
            },
            onStateChange: (event: any) => {
              if (isCancelled) return;
              // 0 = YT.PlayerState.ENDED
              if (event.data === 0) {
                onEnded();
              }
            },
            onError: (err: any) => {
              console.warn('Inline YouTube Player notice:', err);
            },
          },
        });
      } catch (e) {
        console.warn('Error instantiating YouTube player:', e);
      }
    });

    return () => {
      isCancelled = true;
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch {}
        playerRef.current = null;
      }
    };
  }, [video.id, video.youtubeId, isDirect, onEnded]);



  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      {/* Direct HTML5 video */}
      {isDirect ? (
        <video
          src={video.youtubeUrl}
          autoPlay
          controls
          playsInline
          onEnded={onEnded}
          className="w-full h-full object-cover"
        />
      ) : (
        /* YouTube player slot with fallback iframe */
        <div ref={containerRef} className="w-full h-full">
          <iframe
            id={`fallback-iframe-${video.id}`}
            src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1&controls=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>
      )}

      {/* Floating Top Controls Overlay */}
      <div className="absolute top-2.5 right-2.5 z-30 flex items-center gap-1.5 pointer-events-auto">
        {onExpand && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExpand();
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/80 hover:bg-neutral-800 text-white/90 hover:text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-xl hover:scale-105 active:scale-95 backdrop-blur-md"
            title="Expand to Cinema Modal"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/80 hover:bg-rose-950/80 text-white/90 hover:text-rose-300 flex items-center justify-center border border-white/20 hover:border-rose-500/40 transition-all cursor-pointer shadow-xl hover:scale-105 active:scale-95 backdrop-blur-md"
          title="Close Video (Resumes Music)"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
