import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  startTime?: number; // Start time in seconds
  onProgress?: (progress: { currentTime: number; duration: number; percentage: number }) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster, title, autoPlay = false, startTime = 0, onProgress }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const controlTimeoutRef = useRef<number | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Show loader when src changes
    setShowLoader(true);
    setIsPlaying(false);
    
    // Simulate Netflix-style loading/buffering
    const timer = setTimeout(() => {
        setShowLoader(false);
        if (autoPlay) {
            videoRef.current?.play().catch(() => {});
            setIsPlaying(true);
        }
    }, 2000);

    return () => clearTimeout(timer);
  }, [src, autoPlay]);

  useEffect(() => {
    if (videoRef.current) {
        // CRITICAL FIX: Always apply startTime, even if it is 0.
        // This ensures new videos start at the beginning.
        if (Number.isFinite(startTime)) {
            videoRef.current.currentTime = startTime;
        }
    }
  }, [src, startTime]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      const percentage = (current / duration) * 100;
      
      setProgress(percentage);

      // Report progress to parent
      if (onProgress && !isNaN(duration) && duration > 0) {
          onProgress({
              currentTime: current,
              duration: duration,
              percentage: percentage
          });
      }
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = time;
      setProgress(parseFloat(e.target.value));
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      try {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
        
        // Attempt to lock orientation to landscape on mobile
        // @ts-ignore
        if (screen.orientation && screen.orientation.lock) {
            // @ts-ignore
            await screen.orientation.lock('landscape').catch(() => {});
        }
      } catch (err) {
        console.error("Error attempting to enable fullscreen:", err);
      }
    } else {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsFullscreen(false);
        // @ts-ignore
        if (screen.orientation && screen.orientation.unlock) {
             // @ts-ignore
            screen.orientation.unlock();
        }
      }
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlTimeoutRef.current) {
      window.clearTimeout(controlTimeoutRef.current);
    }
    controlTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  return (
    <div 
      ref={containerRef}
      className="relative group w-full h-full bg-black overflow-hidden flex items-center justify-center rounded-lg shadow-2xl"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Streamix Loader */}
      {showLoader && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center animate-in fade-in duration-300">
             <div className="flex items-center gap-2 transform scale-125 animate-pulse">
                 <div className="text-blue-600">
                   <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M5 3L19 12L5 21V3Z" />
                   </svg>
                 </div>
                 <div className="font-bold text-4xl tracking-tight">
                    <span className="text-white">Stream</span><span className="text-blue-600">ix</span>
                 </div>
              </div>
              <div className="mt-8 w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlay}
      />

      {/* Overlay Title */}
      {title && showControls && !showLoader && (
        <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black/80 to-transparent z-10 transition-opacity duration-300">
            <h3 className="text-white font-medium text-lg shadow-black drop-shadow-md">{title}</h3>
        </div>
      )}

      {/* Controls */}
      <div className={`absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 transition-opacity duration-300 ${showControls && !showLoader ? 'opacity-100' : 'opacity-0'}`}>
        {/* Progress Bar */}
        <div className="w-full mb-4 flex items-center gap-2 group/progress">
            <input
                type="range"
                min="0"
                max="100"
                value={progress || 0}
                onChange={handleProgressChange}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer hover:h-2 transition-all accent-blue-600"
            />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={togglePlay} className="text-white hover:text-blue-400 transition-colors">
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
            </button>
            
            <div className="flex items-center gap-2 group/volume">
              <button onClick={toggleMute} className="text-white hover:text-blue-400 transition-colors">
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.1" 
                value={isMuted ? 0 : volume}
                onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setVolume(val);
                    if(videoRef.current) videoRef.current.volume = val;
                    setIsMuted(val === 0);
                }}
                className="w-0 overflow-hidden group-hover/volume:w-20 transition-all duration-300 h-1 accent-white bg-gray-600 rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-gray-300 hover:text-white">
                <Settings size={20} />
            </button>
            <button onClick={toggleFullscreen} className="text-white hover:text-blue-400 transition-colors">
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};