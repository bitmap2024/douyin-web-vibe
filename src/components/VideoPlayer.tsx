
import React, { useState, useRef, useEffect } from "react";
import VideoControls from "./VideoControls";

interface VideoPlayerProps {
  src: string;
  isActive: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, isActive }) => {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  // Handle mute/unmute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  // Update progress bar
  const updateProgress = () => {
    if (videoRef.current) {
      const percentage = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(percentage);
    }
  };

  // Play/pause based on visibility
  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => {
          // Autoplay was prevented, do nothing
        });
        setPlaying(true);
      } else {
        videoRef.current.pause();
        setPlaying(false);
      }
    }
  }, [isActive]);

  return (
    <div className="relative h-full w-full">
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        loop
        playsInline
        muted={muted}
        onClick={togglePlay}
        onTimeUpdate={updateProgress}
        src={src}
      />
      <div 
        className="absolute inset-0 video-overlay"
        onClick={togglePlay}
      />
      <VideoControls
        playing={playing}
        muted={muted}
        progress={progress}
        togglePlay={togglePlay}
        toggleMute={toggleMute}
      />
    </div>
  );
};

export default VideoPlayer;
