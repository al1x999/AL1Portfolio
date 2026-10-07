import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { VideoProject } from '../types/portfolio';
import { usePortfolio } from '../context/PortfolioContext';

// Declare global YT interface for TypeScript
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

interface VideoModalProps {
  video: VideoProject | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  const { pauseBackgroundMusic, resumeBackgroundMusic } = usePortfolio();
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [playbackQuality, setPlaybackQuality] = useState<string>('1080p HD');
  const [isBuffering, setIsBuffering] = useState<boolean>(true);
  const [playActionFlash, setPlayActionFlash] = useState<'play' | 'pause' | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeContainerRef = useRef<HTMLDivElement>(null);
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const hideControlsTimerRef = useRef<any>(null);
  const timeUpdateIntervalRef = useRef<any>(null);

  const isVertical = video?.aspectRatio === '9:16';
  const isDirectVideo = video?.youtubeUrl
    ? /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(video.youtubeUrl)
    : false;

  // Pause background music while video modal is open, resume on close
  useEffect(() => {
    if (video) {
      pauseBackgroundMusic();
      return () => {
        resumeBackgroundMusic();
      };
    }
  }, [video, pauseBackgroundMusic, resumeBackgroundMusic]);

  // Format seconds into MM:SS
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Auto-hide controls logic
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimerRef.current) {
      clearTimeout(hideControlsTimerRef.current);
    }
    if (isPlaying) {
      hideControlsTimerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2400);
    }
  }, [isPlaying]);

  // Load YouTube Iframe API if not loaded
  const loadYouTubeAPI = (): Promise<void> => {
    return new Promise((resolve) => {
      if (window.YT && window.YT.Player) {
        resolve();
        return;
      }
      const existingScript = document.getElementById('yt-iframe-api-script');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        resolve();
      };
    });
  };

  // Keyboard shortcut listener (ESC to close, Space to Play/Pause, M to mute, F to fullscreen)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        } else {
          onClose();
        }
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    if (video) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [video, isPlaying, isMuted]);

  // Enforce Highest Playback Quality on YouTube Player
  const enforceHighestQuality = (player: any) => {
    if (!player) return;
    try {
      if (typeof player.getAvailableQualityLevels === 'function') {
        const levels: string[] = player.getAvailableQualityLevels();
        if (levels && levels.length > 0) {
          // Find the best quality among highres, hd2160, hd1440, hd1080
          const best =
            levels.find((l) => ['highres', 'hd2160', 'hd1440', 'hd1080'].includes(l)) ||
            levels[0];
          player.setPlaybackQuality(best);
          if (best === 'highres' || best === 'hd2160') setPlaybackQuality('4K Ultra HD');
          else if (best === 'hd1440') setPlaybackQuality('1440p QHD');
          else if (best === 'hd1080') setPlaybackQuality('1080p HD');
          else setPlaybackQuality(`${best.replace('hd', '')}p HD`);
        } else {
          player.setPlaybackQuality('hd1080');
          setPlaybackQuality('1080p HD');
        }
      } else if (typeof player.setPlaybackQuality === 'function') {
        player.setPlaybackQuality('hd1080');
      }
    } catch (err) {
      // Ignore cross-origin warnings
    }
  };

  // Initialize Video Player when modal opens
  useEffect(() => {
    if (!video) return;

    setIsPlaying(true);
    setIsBuffering(true);
    setCurrentTime(0);
    setDuration(0);
    resetControlsTimer();

    // Direct Video handling
    if (isDirectVideo) {
      const vid = videoElementRef.current;
      if (vid) {
        vid.currentTime = 0;
        vid.play().catch(() => {});
      }
      return;
    }

    // YouTube API initialization
    let isCancelled = false;
    const playerId = `yt-player-${video.id}`;

    loadYouTubeAPI().then(() => {
      if (isCancelled || !iframeContainerRef.current) return;

      // Clean existing player instance
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch (e) {}
      }

      // Create a fresh div container for YT.Player
      iframeContainerRef.current.innerHTML = `<div id="${playerId}" class="w-full h-full"></div>`;

      try {
        ytPlayerRef.current = new window.YT.Player(playerId, {
          videoId: video.youtubeId,
          playerVars: {
            autoplay: 1,
            controls: 0, // HIDE ALL YOUTUBE NATIVE CONTROLS
            modestbranding: 1, // REMOVE YOUTUBE LOGO
            rel: 0, // NO RELATED VIDEOS
            showinfo: 0,
            iv_load_policy: 3, // DISABLE ANNOTATIONS
            fs: 0, // CUSTOM FULLSCREEN
            disablekb: 1, // DISABLE YOUTUBE INTERNAL KEYBOARD
            playsinline: 1,
            vq: 'hd1080', // FORCE 1080P
            origin: window.location.origin,
          },
          events: {
            onReady: (event: any) => {
              if (isCancelled) return;
              event.target.playVideo();
              enforceHighestQuality(event.target);
              setIsBuffering(false);
              setIsPlaying(true);
              setDuration(event.target.getDuration() || 0);
            },
            onStateChange: (event: any) => {
              if (isCancelled) return;
              // 1 = PLAYING, 2 = PAUSED, 3 = BUFFERING, 0 = ENDED
              if (event.data === 1) {
                setIsPlaying(true);
                setIsBuffering(false);
                enforceHighestQuality(event.target);
                setDuration(event.target.getDuration() || 0);
              } else if (event.data === 2) {
                setIsPlaying(false);
                setIsBuffering(false);
              } else if (event.data === 3) {
                setIsBuffering(true);
              } else if (event.data === 0) {
                setIsPlaying(false);
                setIsBuffering(false);
              }
            },
            onPlaybackQualityChange: (event: any) => {
              if (event.data) {
                const q = event.data;
                if (q === 'highres' || q === 'hd2160') setPlaybackQuality('4K Ultra HD');
                else if (q === 'hd1440') setPlaybackQuality('1440p QHD');
                else if (q === 'hd1080') setPlaybackQuality('1080p HD');
                else setPlaybackQuality(`${q.replace('hd', '')}p`);
              }
            },
          },
        });
      } catch (err) {
        console.error('Error creating YouTube player:', err);
      }
    });

    // Interval to track current playback time
    timeUpdateIntervalRef.current = setInterval(() => {
      if (isDirectVideo) {
        if (videoElementRef.current) {
          setCurrentTime(videoElementRef.current.currentTime);
          setDuration(videoElementRef.current.duration || 0);
        }
      } else if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
        try {
          const curr = ytPlayerRef.current.getCurrentTime();
          const dur = ytPlayerRef.current.getDuration();
          if (typeof curr === 'number') setCurrentTime(curr);
          if (typeof dur === 'number' && dur > 0) setDuration(dur);
        } catch (e) {}
      }
    }, 250);

    return () => {
      isCancelled = true;
      if (timeUpdateIntervalRef.current) clearInterval(timeUpdateIntervalRef.current);
      if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
      if (ytPlayerRef.current) {
        try {
          ytPlayerRef.current.destroy();
        } catch (e) {}
        ytPlayerRef.current = null;
      }
    };
  }, [video?.id, isDirectVideo]);

  if (!video) return null;

  // Toggle Play / Pause
  const togglePlay = () => {
    if (isDirectVideo) {
      const vid = videoElementRef.current;
      if (vid) {
        if (vid.paused) {
          vid.play();
          setIsPlaying(true);
          flashAction('play');
        } else {
          vid.pause();
          setIsPlaying(false);
          flashAction('pause');
        }
      }
    } else if (ytPlayerRef.current) {
      try {
        if (isPlaying) {
          ytPlayerRef.current.pauseVideo();
          setIsPlaying(false);
          flashAction('pause');
        } else {
          ytPlayerRef.current.playVideo();
          enforceHighestQuality(ytPlayerRef.current);
          setIsPlaying(true);
          flashAction('play');
        }
      } catch (e) {}
    }
    resetControlsTimer();
  };

  const flashAction = (action: 'play' | 'pause') => {
    setPlayActionFlash(action);
    setTimeout(() => setPlayActionFlash(null), 600);
  };

  // Toggle Mute / Unmute
  const toggleMute = () => {
    if (isDirectVideo) {
      const vid = videoElementRef.current;
      if (vid) {
        vid.muted = !isMuted;
        setIsMuted(!isMuted);
      }
    } else if (ytPlayerRef.current) {
      try {
        if (isMuted) {
          ytPlayerRef.current.unMute();
          setIsMuted(false);
        } else {
          ytPlayerRef.current.mute();
          setIsMuted(true);
        }
      } catch (e) {}
    }
    resetControlsTimer();
  };

  // Scrub timeline
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (isDirectVideo) {
      if (videoElementRef.current) videoElementRef.current.currentTime = newTime;
    } else if (ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
      try {
        ytPlayerRef.current.seekTo(newTime, true);
      } catch (e) {}
    }
    resetControlsTimer();
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
    resetControlsTimer();
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 overflow-hidden select-none"
        onMouseMove={resetControlsTimer}
        onTouchStart={resetControlsTimer}
      >
        {/* Deep Backdrop Blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/92 backdrop-blur-2xl transition-all"
        />

        {/* Floating Minimal Close Button (Top Right) */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: showControls ? 1 : 0, scale: 1 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 p-3 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-white/15 shadow-2xl backdrop-blur-md cursor-pointer transition-all hover:scale-110 active:scale-95"
          title="Close (ESC)"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </motion.button>

        {/* Pure Cinema Video Player Container (No Clutter, No YouTube UI) */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          className={`relative z-10 w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-black flex items-center justify-center ${
            isVertical
              ? 'h-[80vh] sm:h-[84vh] max-h-[840px] aspect-[9/16] mx-auto shadow-cyan-500/10'
              : 'max-w-5xl aspect-video mx-auto shadow-cyan-500/15'
          }`}
          onClick={togglePlay}
        >
          {/* Direct HTML5 Video Player */}
          {isDirectVideo ? (
            <video
              ref={videoElementRef}
              src={video.youtubeUrl}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              onEnded={() => setIsPlaying(false)}
            />
          ) : (
            /* YouTube Player Container with native controls removed via API */
            <div className="w-full h-full pointer-events-none relative flex items-center justify-center">
              <div ref={iframeContainerRef} className="w-full h-full pointer-events-none" />
            </div>
          )}

          {/* Action Flash Indicator (Play / Pause in Center) */}
          <AnimatePresence>
            {playActionFlash && (
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1.1 }}
                exit={{ opacity: 0, scale: 1.4 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl text-white">
                  {playActionFlash === 'play' ? (
                    <Play className="w-8 h-8 ml-1 fill-white" />
                  ) : (
                    <Pause className="w-8 h-8 fill-white" />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Buffering Indicator */}
          {isBuffering && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 bg-black/30 backdrop-blur-xs">
              <div className="w-12 h-12 rounded-full border-3 border-white/20 border-t-cyan-400 animate-spin" />
            </div>
          )}

          {/* Minimal Floating Cinema Control Bar (ONLY Video Controls, Auto-Hiding) */}
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{
              opacity: showControls || !isPlaying ? 1 : 0,
              y: showControls || !isPlaying ? 0 : 20,
            }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 inset-x-0 p-3 sm:p-5 z-40 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col gap-2.5"
          >
            {/* Minimal Custom Progress Slider */}
            <div className="relative group/progress flex items-center w-full">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 hover:h-2.5 bg-white/20 hover:bg-white/30 rounded-full appearance-none cursor-pointer transition-all accent-cyan-400 focus:outline-none"
                style={{
                  background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%, rgba(255,255,255,0.2) 100%)`,
                }}
              />
            </div>

            {/* Bottom Controls Row: Play/Pause, Time, Quality Badge, Mute, Fullscreen */}
            <div className="flex items-center justify-between gap-3 text-white">
              {/* Left: Play/Pause + Time */}
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 active:scale-95 flex items-center justify-center transition-all cursor-pointer text-white border border-white/10"
                  title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-white" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5 fill-white" />
                  )}
                </button>

                <div className="text-xs font-mono text-neutral-300 tracking-wider">
                  <span className="text-white font-semibold">{formatTime(currentTime)}</span>
                  <span className="text-neutral-500 mx-1.5">/</span>
                  <span className="text-neutral-400">{formatTime(duration)}</span>
                </div>
              </div>

              {/* Right: Quality Badge + Mute + Fullscreen */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Enforced Highest Quality Badge */}
                <div
                  className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold tracking-wider text-cyan-300 bg-cyan-950/70 border border-cyan-500/40 shadow-sm flex items-center gap-1.5"
                  title="Highest Quality Stream Active"
                >
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>{playbackQuality}</span>
                </div>

                {/* Mute / Unmute */}
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-all cursor-pointer border border-white/10"
                  title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                >
                  {isMuted ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>

                {/* Fullscreen Toggle */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white transition-all cursor-pointer border border-white/10"
                  title={isFullscreen ? 'Exit Fullscreen (F)' : 'Fullscreen (F)'}
                >
                  {isFullscreen ? (
                    <Minimize className="w-4 h-4" />
                  ) : (
                    <Maximize className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

