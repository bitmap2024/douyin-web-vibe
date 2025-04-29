
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
    <div className="absolute bottom-4 left-3 right-3 flex items-center space-x-2">
      <button
        onClick={togglePlay}
        className="rounded-full bg-black/40 p-2 backdrop-blur-sm"
      >
        {playing ? (
          <Pause className="h-4 w-4 text-white" />
        ) : (
          <Play className="h-4 w-4 text-white" />
        )}
      </button>
      <button
        onClick={toggleMute}
        className="rounded-full bg-black/40 p-2 backdrop-blur-sm"
      >
        {muted ? (
          <VolumeX className="h-4 w-4 text-white" />
        ) : (
          <Volume2 className="h-4 w-4 text-white" />
        )}
      </button>
      <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default VideoControls;
