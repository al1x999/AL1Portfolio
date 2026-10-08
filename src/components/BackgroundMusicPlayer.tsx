import React, { useEffect, useRef, useState, useCallback } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { extractYouTubeId, loadYouTubeIframeApi } from '../utils/youtube';
import { Play, Pause, Volume2, VolumeX, Music, ExternalLink, ChevronDown } from 'lucide-react';

export const BackgroundMusicPlayer: React.FC = () => {
  const { backgroundMusic, isVideoPlaying, registerBackgroundMusicControls } = usePortfolio();
  const [isPlaying, setIsPlaying] = useState(false); // Do NOT play by default until user clicks!
  const [isMuted, setIsMuted] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [currentVolume, setCurrentVolume] = useState<number>(backgroundMusic?.volume ?? 40);
  const [isMinimized, setIsMinimized] = useState(false);

  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const endPointCheckRef = useRef<any>(null);
  const wasPlayingBeforeVideoRef = useRef<boolean>(false);
  const isVideoPlayingRef = useRef<boolean>(isVideoPlaying);
  const isUserExplicitlyMutedRef = useRef<boolean>(false);
  const isUserExplicitlyPausedRef = useRef<boolean>(false);
  const hasUserInteractedRef = useRef<boolean>(false);
  const currentVolumeRef = useRef<number>(backgroundMusic?.volume ?? 40);

  useEffect(() => {
    isVideoPlayingRef.current = isVideoPlaying;
  }, [isVideoPlaying]);

  const videoId = extractYouTubeId(backgroundMusic?.youtubeUrl || 'https://www.youtube.com/watch?v=HNvpASy9m5s');

  // Keep local volume in sync with admin config
  useEffect(() => {
    if (backgroundMusic?.volume !== undefined) {
      setCurrentVolume(backgroundMusic.volume);
      currentVolumeRef.current = backgroundMusic.volume;
      if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
        try {
          playerRef.current.setVolume(backgroundMusic.volume);
        } catch {}
      }
    }
  }, [backgroundMusic?.volume]);

  // Audio start & unlock function (only runs on user click)
  const unlockAudio = useCallback(() => {
    if (isVideoPlayingRef.current) return;
    (window as any).__al1UserInteracted = true;
    hasUserInteractedRef.current = true;
    isUserExplicitlyPausedRef.current = false;
    isUserExplicitlyMutedRef.current = false;

    try {
      // 1. Resume WebAudio context if present
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
      }

      // 2. Play YouTube player unmuted
      if (playerRef.current) {
        const vol = currentVolumeRef.current > 0 ? currentVolumeRef.current : 40;
        if (typeof playerRef.current.unMute === 'function') {
          playerRef.current.unMute();
        }
        if (typeof playerRef.current.setVolume === 'function') {
          playerRef.current.setVolume(vol);
        }
        if (typeof playerRef.current.playVideo === 'function') {
          playerRef.current.playVideo();
        }

        setIsPlaying(true);
        setIsMuted(false);
        setNeedsInteraction(false);
      }
    } catch (e) {
      console.warn('Unlock audio attempt:', e);
    }
  }, []);

  // Synchronous pause and resume handlers for video events
  const pauseBgMusic = useCallback(() => {
    if (playerRef.current) {
      try {
        const state = typeof playerRef.current.getPlayerState === 'function'
          ? playerRef.current.getPlayerState()
          : -1;
        // YT.PlayerState.PLAYING is 1, BUFFERING is 3
        if (state === 1 || state === 3) {
          wasPlayingBeforeVideoRef.current = true;
        }
        if (typeof playerRef.current.pauseVideo === 'function') {
          playerRef.current.pauseVideo();
        }
      } catch (e) {
        console.warn('Error pausing background player:', e);
      }
    }
    setIsPlaying(false);
  }, []);

  const resumeBgMusic = useCallback(() => {
    if (wasPlayingBeforeVideoRef.current && backgroundMusic?.enabled) {
      wasPlayingBeforeVideoRef.current = false;
      if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
        try {
          if (!isUserExplicitlyMutedRef.current && typeof playerRef.current.unMute === 'function') {
            playerRef.current.unMute();
          }
          playerRef.current.playVideo();
          setIsPlaying(true);
        } catch (e) {
          console.warn('Error resuming background player:', e);
        }
      }
    }
  }, [backgroundMusic?.enabled]);

  // Register controls with PortfolioContext
  useEffect(() => {
    registerBackgroundMusicControls({
      play: () => {
        wasPlayingBeforeVideoRef.current = true;
        isUserExplicitlyPausedRef.current = false;
        isUserExplicitlyMutedRef.current = false;
        unlockAudio();
      },
      pause: pauseBgMusic,
      resume: resumeBgMusic,
      isPlaying: () => {
        if (!playerRef.current) return false;
        try {
          return playerRef.current.getPlayerState() === 1;
        } catch {
          return false;
        }
      },
    } as any);
    return () => {
      registerBackgroundMusicControls(null);
    };
  }, [registerBackgroundMusicControls, pauseBgMusic, resumeBgMusic, unlockAudio]);

  // Window event listeners for immediate fallback
  useEffect(() => {
    const handlePauseEvent = () => pauseBgMusic();
    const handleResumeEvent = () => resumeBgMusic();

    window.addEventListener('al1:pause-bg-music', handlePauseEvent);
    window.addEventListener('al1:resume-bg-music', handleResumeEvent);

    return () => {
      window.removeEventListener('al1:pause-bg-music', handlePauseEvent);
      window.removeEventListener('al1:resume-bg-music', handleResumeEvent);
    };
  }, [pauseBgMusic, resumeBgMusic]);

  // Handle immediate intro enter event (triggered when user clicks to enter the site)
  useEffect(() => {
    const handleStartAudio = () => {
      wasPlayingBeforeVideoRef.current = true;
      isUserExplicitlyPausedRef.current = false;
      isUserExplicitlyMutedRef.current = false;
      unlockAudio();
    };
    (window as any).__unlockBgAudio = handleStartAudio;
    window.addEventListener('al1:start-music', handleStartAudio);

    return () => {
      window.removeEventListener('al1:start-music', handleStartAudio);
      delete (window as any).__unlockBgAudio;
    };
  }, [unlockAudio]);

  // Respond ONLY to changes in isVideoPlaying transition (false -> true or true -> false)
  const prevIsVideoPlayingRef = useRef(false);
  useEffect(() => {
    if (isVideoPlaying && !prevIsVideoPlayingRef.current) {
      pauseBgMusic();
    } else if (!isVideoPlaying && prevIsVideoPlayingRef.current) {
      resumeBgMusic();
    }
    prevIsVideoPlayingRef.current = isVideoPlaying;
  }, [isVideoPlaying, pauseBgMusic, resumeBgMusic]);

  // Global user click listener: only triggers on initial user interaction
  useEffect(() => {
    if (!backgroundMusic?.enabled) return;

    const handleInitialClick = () => {
      (window as any).__al1UserInteracted = true;
      hasUserInteractedRef.current = true;

      // If user paused explicitly or video modal is active, do not force-play
      if (isUserExplicitlyPausedRef.current || isVideoPlayingRef.current) {
        return;
      }

      // If player is already playing, do nothing
      if (playerRef.current) {
        try {
          if (playerRef.current.getPlayerState() === 1) {
            return;
          }
        } catch {}
      }

      // Start audio playback on this click
      unlockAudio();
    };

    window.addEventListener('click', handleInitialClick, { passive: true });
    window.addEventListener('touchstart', handleInitialClick, { passive: true });

    return () => {
      window.removeEventListener('click', handleInitialClick);
      window.removeEventListener('touchstart', handleInitialClick);
    };
  }, [backgroundMusic?.enabled, unlockAudio]);

  // Initialize YouTube Iframe Player (LOADED BUT NOT PLAYING UNTIL CLICK)
  useEffect(() => {
    if (!backgroundMusic?.enabled || !videoId) {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch {}
        playerRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    let isCancelled = false;

    loadYouTubeIframeApi().then(() => {
      if (isCancelled || !containerRef.current) return;

      // Clean up existing instance
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch {}
        playerRef.current = null;
      }

      containerRef.current.innerHTML = '<div id="yt-bg-audio-slot"></div>';

      try {
        const targetVol = currentVolumeRef.current > 0 ? currentVolumeRef.current : 40;

        playerRef.current = new window.YT.Player('yt-bg-audio-slot', {
          height: '200',
          width: '200',
          videoId: videoId,
          playerVars: {
            autoplay: 0, // CRITICAL: Do NOT autoplay on page load before user click!
            mute: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            playsinline: 1,
            modestbranding: 1,
            rel: 0,
            start: backgroundMusic.startPoint || 0,
            enablejsapi: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (event: any) => {
              if (isCancelled) return;
              playerRef.current = event.target;
              (window as any).__bgPlayer = event.target;

              // Ensure iframe attributes
              const iframe = containerRef.current?.querySelector('iframe');
              if (iframe) {
                iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
                iframe.style.width = '200px';
                iframe.style.height = '200px';
              }

              // Seek to start position
              if (backgroundMusic.startPoint && backgroundMusic.startPoint > 0) {
                try {
                  event.target.seekTo(backgroundMusic.startPoint, true);
                } catch {}
              } else {
                try {
                  event.target.seekTo(0, true);
                } catch {}
              }

              // Configure volume
              try {
                event.target.setVolume(targetVol);
              } catch {}

              // If user has ALREADY clicked while player was loading, start now!
              const alreadyClicked = Boolean((window as any).__al1UserInteracted || hasUserInteractedRef.current);
              if (alreadyClicked && !isUserExplicitlyPausedRef.current) {
                try {
                  event.target.unMute();
                  event.target.playVideo();
                  setIsPlaying(true);
                  setIsMuted(false);
                  setNeedsInteraction(false);
                } catch {}
              } else {
                // Otherwise, keep PAUSED and wait for user click!
                try {
                  event.target.pauseVideo();
                } catch {}
                setIsPlaying(false);
                setIsMuted(false);
                setNeedsInteraction(false);
              }
            },
            onStateChange: (event: any) => {
              if (isCancelled) return;
              // 1 = PLAYING
              if (event.data === 1) {
                setIsPlaying(true);
                if (!isUserExplicitlyMutedRef.current) {
                  try {
                    event.target.unMute();
                    setIsMuted(false);
                    setNeedsInteraction(false);
                  } catch {}
                }
              }
              // 2 = PAUSED
              else if (event.data === 2) {
                setIsPlaying(false);
              }
              // 0 = ENDED
              else if (event.data === 0) {
                if (backgroundMusic.repeat) {
                  try {
                    event.target.seekTo(backgroundMusic.startPoint || 0, true);
                    event.target.playVideo();
                  } catch {}
                } else {
                  setIsPlaying(false);
                }
              }
            },
            onError: (err: any) => {
              console.warn('YouTube Audio Player Notice:', err);
            },
          },
        });
      } catch (err) {
        console.warn('Error creating YouTube player:', err);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [videoId, backgroundMusic?.enabled, backgroundMusic?.startPoint, backgroundMusic?.repeat]);

  // Monitor endPoint timing loop (polled every 50ms for millisecond accuracy)
  useEffect(() => {
    if (endPointCheckRef.current) clearInterval(endPointCheckRef.current);

    if (backgroundMusic?.enabled && backgroundMusic?.endPoint && backgroundMusic.endPoint > 0) {
      endPointCheckRef.current = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          try {
            const currentTime = playerRef.current.getCurrentTime();
            if (currentTime >= backgroundMusic.endPoint!) {
              if (backgroundMusic.repeat) {
                playerRef.current.seekTo(backgroundMusic.startPoint || 0, true);
                playerRef.current.playVideo();
              } else {
                playerRef.current.pauseVideo();
                setIsPlaying(false);
              }
            }
          } catch {}
        }
      }, 50);
    }

    return () => {
      if (endPointCheckRef.current) clearInterval(endPointCheckRef.current);
    };
  }, [backgroundMusic?.enabled, backgroundMusic?.endPoint, backgroundMusic?.repeat, backgroundMusic?.startPoint]);

  // Interactive controls
  const handleTogglePlay = () => {
    if (!playerRef.current) {
      unlockAudio();
      return;
    }
    try {
      if (isPlaying) {
        isUserExplicitlyPausedRef.current = true;
        playerRef.current.pauseVideo();
        setIsPlaying(false);
        wasPlayingBeforeVideoRef.current = false;
      } else {
        isUserExplicitlyPausedRef.current = false;
        isUserExplicitlyMutedRef.current = false;
        wasPlayingBeforeVideoRef.current = true;
        unlockAudio();
      }
    } catch {
      unlockAudio();
    }
  };

  const handleToggleMute = () => {
    if (!playerRef.current) return;
    try {
      if (isMuted) {
        isUserExplicitlyMutedRef.current = false;
        unlockAudio();
      } else {
        isUserExplicitlyMutedRef.current = true;
        playerRef.current.mute();
        setIsMuted(true);
      }
    } catch {}
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentVolume(val);
    currentVolumeRef.current = val;
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      try {
        playerRef.current.setVolume(val);
        if (val > 0 && isMuted) {
          isUserExplicitlyMutedRef.current = false;
          playerRef.current.unMute();
          setIsMuted(false);
          setNeedsInteraction(false);
        }
      } catch {}
    }
  };

  if (!backgroundMusic?.enabled) {
    return null;
  }

  return (
    <>
      {/* 
        In-viewport, non-occluded audio frame container:
        Keeps opacity ~1.0 and z-10 inside a tiny 10px box so Chrome/Edge never suspends it!
      */}
      <div
        ref={containerRef}
        className="fixed bottom-0 right-0 w-2.5 h-2.5 overflow-hidden pointer-events-none z-10"
        style={{ opacity: 0.99 }}
        aria-hidden="true"
      />

      {/* Floating Compact Audio Player at Bottom */}
      <div
        className={`fixed z-40 transition-all duration-300 ease-out ${
          isMinimized
            ? 'bottom-20 md:bottom-4 right-4'
            : 'bottom-20 md:bottom-4 right-3 md:right-4 max-w-[calc(100vw-24px)] md:max-w-md'
        }`}
      >
        {isMinimized ? (
          /* Minimized Round Bubble */
          <button
            onClick={() => setIsMinimized(false)}
            className="group relative p-3 rounded-full bg-neutral-950/90 hover:bg-neutral-900 border border-purple-500/40 hover:border-purple-400 text-white shadow-2xl backdrop-blur-xl flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
            title="Expand Background Music Player"
          >
            {isPlaying && !isVideoPlaying && !isMuted ? (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            ) : isMuted ? (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
            ) : isVideoPlaying ? (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            ) : null}
            <Music className={`w-4 h-4 ${isPlaying && !isMuted && !isVideoPlaying ? 'text-emerald-400' : isMuted ? 'text-amber-400' : isVideoPlaying ? 'text-cyan-400' : 'text-purple-400'}`} />
          </button>
        ) : (
          /* Full Compact Bar */
          <div className="p-2.5 sm:p-3 rounded-2xl bg-neutral-950/90 border border-white/15 hover:border-purple-500/40 shadow-2xl backdrop-blur-2xl flex items-center gap-3 transition-all animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* Play/Pause Main Button */}
            <button
              onClick={handleTogglePlay}
              className={`p-2 sm:p-2.5 rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                isPlaying && !isMuted && !isVideoPlaying
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30 hover:bg-emerald-400'
                  : isVideoPlaying
                  ? 'bg-cyan-600/80 text-white shadow-lg shadow-cyan-600/30 hover:bg-cyan-500'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/40 hover:brightness-110'
              }`}
              title={
                isPlaying && !isMuted && !isVideoPlaying
                  ? 'Pause Background Music'
                  : isVideoPlaying
                  ? 'Resume Background Music'
                  : isMuted
                  ? 'Click to Unmute Audio'
                  : 'Play Background Music'
              }
            >
              {isPlaying && !isMuted && !isVideoPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-black" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
              )}
            </button>

            {/* Track Info & Animated Wave Bars */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5">
                {/* Visualizer Bars */}
                <div className="flex items-end gap-0.5 h-3 shrink-0">
                  <span
                    className={`w-0.5 rounded-full transition-all duration-200 ${
                      isPlaying && !isMuted && !isVideoPlaying ? 'bg-emerald-400 h-full animate-pulse' : 'bg-neutral-600 h-1'
                    }`}
                  />
                  <span
                    className={`w-0.5 rounded-full transition-all duration-200 ${
                      isPlaying && !isMuted && !isVideoPlaying ? 'bg-emerald-400 h-2/3 animate-bounce' : 'bg-neutral-600 h-1.5'
                    }`}
                  />
                  <span
                    className={`w-0.5 rounded-full transition-all duration-200 ${
                      isPlaying && !isMuted && !isVideoPlaying ? 'bg-emerald-400 h-4/5 animate-pulse' : 'bg-neutral-600 h-1'
                    }`}
                  />
                  <span
                    className={`w-0.5 rounded-full transition-all duration-200 ${
                      isPlaying && !isMuted && !isVideoPlaying ? 'bg-emerald-400 h-1/2 animate-bounce' : 'bg-neutral-600 h-2'
                    }`}
                  />
                </div>

                <span className="text-[11px] sm:text-xs font-semibold text-white truncate">
                  {backgroundMusic.title || 'Background Music'}
                </span>

                <span className="text-[9px] px-1.5 py-0.2 rounded-full font-mono bg-white/10 text-neutral-300 shrink-0">
                  {currentVolume}%
                </span>
              </div>

              {/* Status / YouTube Credit link */}
              <div className="flex items-center gap-2 mt-0.5 text-[10px] text-neutral-400 truncate">
                {isVideoPlaying ? (
                  <span className="text-cyan-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse inline-block" />
                    Video Playing • Music Paused
                  </span>
                ) : isPlaying && !isMuted ? (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                    Playing Live
                  </span>
                ) : isMuted || needsInteraction ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      unlockAudio();
                    }}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[9px] font-semibold transition-all hover:scale-105 cursor-pointer shadow-sm animate-pulse"
                    title="Click to enable and unmute background sound"
                  >
                    <VolumeX className="w-2.5 h-2.5 text-amber-300" />
                    <span>Click to Unmute 🔊</span>
                  </button>
                ) : (
                  <span>Ready to Play</span>
                )}
                <span className="text-neutral-600">•</span>
                <a
                  href={backgroundMusic.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-purple-400 inline-flex items-center gap-0.5 transition-colors"
                  title="Watch / Listen on YouTube"
                >
                  <span>YouTube</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-1.5 shrink-0 pl-1 border-l border-white/10">
              <button
                onClick={handleToggleMute}
                className="p-1 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || currentVolume === 0 ? (
                  <VolumeX className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-neutral-300" />
                )}
              </button>

              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : currentVolume}
                onChange={handleVolumeChange}
                className="w-14 sm:w-18 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
                title={`Volume: ${currentVolume}%`}
              />
            </div>

            {/* Minimize Button */}
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer shrink-0"
              title="Minimize Player"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};
