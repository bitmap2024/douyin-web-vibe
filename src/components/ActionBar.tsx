
import React, { useState } from "react";
import { Heart, MessageCircle, Share } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionBarProps {
  likes: number;
  comments: number;
  shares: number;
  onComment: () => void;
}

const ActionBar: React.FC<ActionBarProps> = ({
  likes: initialLikes,
  comments,
  shares,
  onComment,
}) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [animate, setAnimate] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 500);
  };

  return (
    <div className="absolute right-3 bottom-32 flex flex-col items-center space-y-6">
      <div className="flex flex-col items-center">
        <button
          onClick={handleLike}
          className="bg-black/30 rounded-full p-2.5 backdrop-blur-sm"
        >
          <Heart
            fill={liked ? "rgb(254, 44, 85)" : "transparent"}
            className={cn(
              "h-6 w-6",
              liked ? "text-primary" : "text-white",
              animate ? "animate-pulse-heart" : ""
            )}
          />
        </button>
        <span className="text-white text-xs mt-1">{formatNumber(likes)}</span>
      </div>
      <div className="flex flex-col items-center">
        <button
          onClick={onComment}
          className="bg-black/30 rounded-full p-2.5 backdrop-blur-sm"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </button>
        <span className="text-white text-xs mt-1">{formatNumber(comments)}</span>
      </div>
      <div className="flex flex-col items-center">
        <button className="bg-black/30 rounded-full p-2.5 backdrop-blur-sm">
          <Share className="h-6 w-6 text-white" />
        </button>
        <span className="text-white text-xs mt-1">{formatNumber(shares)}</span>
      </div>
    </div>
  );
};

// Helper function to format large numbers
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "m";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  } else {
    return num.toString();
  }
};

export default ActionBar;
