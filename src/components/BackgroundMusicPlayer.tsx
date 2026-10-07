import React, { useEffect, useRef, useState, useCallback } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { extractYouTubeId, loadYouTubeIframeApi } from '../utils/youtube';
import { Play, Pause, Volume2, VolumeX, Music, ExternalLink, ChevronDown } from 'lucide-react';

export const BackgroundMusicPlayer: React.FC = () => {
  const { backgroundMusic, isVideoPlaying, registerBackgroundMusicControls } = usePortfolio();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false);
  const [currentVolume, setCurrentVolume] = useState<number>(backgroundMusic?.volume ?? 40);
  const [isMinimized, setIsMinimized] = useState(false);

  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const endPointCheckRef = useRef<any>(null);
  const wasPlayingBeforeVideoRef = useRef<boolean>(false);
  const isVideoPlayingRef = useRef<boolean>(isVideoPlaying);

  useEffect(() => {
    isVideoPlayingRef.current = isVideoPlaying;
  }, [isVideoPlaying]);

  const videoId = extractYouTubeId(backgroundMusic?.youtubeUrl || 'https://www.youtube.com/watch?v=HNvpASy9m5s');

  // Keep local volume in sync with admin config
  useEffect(() => {
    if (backgroundMusic?.volume !== undefined) {
      setCurrentVolume(backgroundMusic.volume);
      if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
        playerRef.current.setVolume(backgroundMusic.volume);
      }
    }
  }, [backgroundMusic?.volume]);

  // Audio unlock function (unmute & ensure playback)
  const unlockAudio = useCallback(() => {
    if (isVideoPlayingRef.current) return;
    if (!playerRef.current) return;
    try {
      // Resume WebAudio context if present
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
      }

      if (typeof playerRef.current.unMute === 'function') {
        playerRef.current.unMute();
      }
      if (typeof playerRef.current.setVolume === 'function') {
        playerRef.current.setVolume(currentVolume);
      }
      if (typeof playerRef.current.playVideo === 'function') {
        playerRef.current.playVideo();
      }

      setIsPlaying(true);
      setIsMuted(false);
      setNeedsInteraction(false);
    } catch (e) {
      console.warn('Unlock audio attempt:', e);
    }
  }, [currentVolume]);

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
    });
    return () => {
      registerBackgroundMusicControls(null);
    };
  }, [registerBackgroundMusicControls, pauseBgMusic, resumeBgMusic]);

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

  // One-time interaction unlock listener on initial page load only
  const initialUnlockedRef = useRef(false);
  useEffect(() => {
    if (!backgroundMusic?.enabled || !backgroundMusic?.autoPlay) return;

    const handleInitialUnlock = () => {
      if (initialUnlockedRef.current) return;
      if (isVideoPlayingRef.current) return;

      initialUnlockedRef.current = true;
      unlockAudio();
      removeListeners();
    };

    const removeListeners = () => {
      window.removeEventListener('click', handleInitialUnlock);
      window.removeEventListener('touchstart', handleInitialUnlock);
      window.removeEventListener('keydown', handleInitialUnlock);
    };

    window.addEventListener('click', handleInitialUnlock, { passive: true });
    window.addEventListener('touchstart', handleInitialUnlock, { passive: true });
    window.addEventListener('keydown', handleInitialUnlock, { passive: true });

    return () => {
      removeListeners();
    };
  }, [backgroundMusic?.enabled, backgroundMusic?.autoPlay, unlockAudio]);

  // Initialize YouTube Iframe Player
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
        const targetVol = backgroundMusic.volume ?? 40;

        playerRef.current = new window.YT.Player('yt-bg-audio-slot', {
          height: '180',
          width: '320',
          videoId: videoId,
          playerVars: {
            autoplay: 1, // Autoplay requested
            mute: 1,     // Muted initial start guarantees 100% browser autoplay acceptance
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

              // Expose for inspection/debugging
              (window as any).__bgPlayer = event.target;

              // Ensure iframe attributes
              const iframe = containerRef.current?.querySelector('iframe');
              if (iframe) {
                iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
              }

              // Seek to start position if defined
              if (backgroundMusic.startPoint && backgroundMusic.startPoint > 0) {
                event.target.seekTo(backgroundMusic.startPoint, true);
              }

              // Always start video stream immediately (guaranteed by mute: 1)
              event.target.playVideo();
              setIsPlaying(true);

              // Immediately try to unmute with target volume
              try {
                event.target.setVolume(targetVol);
                event.target.unMute();

                // Check if browser permitted unmuting right away
                const isCurrentlyMuted = typeof event.target.isMuted === 'function' ? event.target.isMuted() : false;
                if (!isCurrentlyMuted) {
                  setIsMuted(false);
                  setNeedsInteraction(false);
                } else {
                  setIsMuted(true);
                  setNeedsInteraction(true);
                }
              } catch {
                setIsMuted(true);
                setNeedsInteraction(true);
              }
            },
            onStateChange: (event: any) => {
              if (isCancelled) return;
              // 1 = PLAYING
              if (event.data === 1) {
                setIsPlaying(true);
                if (typeof event.target.isMuted === 'function' && !event.target.isMuted()) {
                  setIsMuted(false);
                  setNeedsInteraction(false);
                }
              }
              // 2 = PAUSED
              else if (event.data === 2) {
                setIsPlaying(false);
              }
              // 0 = ENDED
              else if (event.data === 0) {
                if (backgroundMusic.repeat) {
                  event.target.seekTo(backgroundMusic.startPoint || 0, true);
                  event.target.playVideo();
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
    if (!playerRef.current) return;
    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
        wasPlayingBeforeVideoRef.current = false;
      } else {
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
        unlockAudio();
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    } catch {}
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentVolume(val);
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      try {
        playerRef.current.setVolume(val);
        if (val > 0 && isMuted) {
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
        In-viewport container (320x180px, opacity 0.01, z-[-1]):
        This prevents browser power-saving or media-throttling from pausing audio!
      */}
      <div
        ref={containerRef}
        className="fixed bottom-0 right-0 w-[320px] h-[180px] opacity-[0.01] pointer-events-none z-[-1] overflow-hidden"
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
            {isPlaying && !isVideoPlaying ? (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            ) : isVideoPlaying ? (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            ) : null}
            <Music className={`w-4 h-4 ${isPlaying && !isMuted && !isVideoPlaying ? 'text-emerald-400' : isVideoPlaying ? 'text-cyan-400' : 'text-purple-400'}`} />
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
                  : 'bg-purple-600 text-white shadow-lg shadow-purple-600/40 hover:bg-purple-500'
              }`}
              title={
                isPlaying && !isMuted && !isVideoPlaying
                  ? 'Pause Background Music'
                  : isVideoPlaying
                  ? 'Resume Background Music'
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
                    Auto Playing Live
                  </span>
                ) : needsInteraction || isMuted ? (
                  <span className="text-amber-300 font-medium flex items-center gap-1 cursor-pointer" onClick={unlockAudio}>
                    <VolumeX className="w-2.5 h-2.5 text-amber-300" />
                    <span>Sound Ready • Tap anywhere</span>
                  </span>
                ) : (
                  <span>Paused</span>
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
