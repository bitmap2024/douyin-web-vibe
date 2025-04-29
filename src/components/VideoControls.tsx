
import React from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface VideoControlsProps {
  playing: boolean;
  muted: boolean;
  progress: number;
  togglePlay: () => void;
  toggleMute: () => void;
}

const VideoControls: React.FC<VideoControlsProps> = ({
  playing,
  muted,
  progress,
  togglePlay,
  toggleMute,
}) => {
  return (
    <div className="absolute bottom-4 left-2 right-2 flex items-center space-x-2 opacity-80 transition-opacity hover:opacity-100">
      <button
        onClick={togglePlay}
        className="rounded-full bg-black/30 p-1.5"
      >
        {playing ? (
          <Pause className="h-4 w-4 text-white" />
        ) : (
          <Play className="h-4 w-4 text-white" />
        )}
      </button>
      <button
        onClick={toggleMute}
        className="rounded-full bg-black/30 p-1.5"
      >
        {muted ? (
          <VolumeX className="h-4 w-4 text-white" />
        ) : (
          <Volume2 className="h-4 w-4 text-white" />
        )}
      </button>
      <div className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-white"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default VideoControls;
