
import React, { useState } from "react";
import { Heart, MessageCircle, Share } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
    <div className="absolute right-2 bottom-36 flex flex-col items-center space-y-5">
      <Avatar className="h-12 w-12 border-2 border-white">
        <AvatarFallback>DP</AvatarFallback>
      </Avatar>
      <div className="flex flex-col items-center">
        <button
          onClick={handleLike}
          className="bg-transparent p-2 rounded-full"
        >
          <Heart
            fill={liked ? "rgb(254, 44, 85)" : "transparent"}
            className={cn(
              "h-7 w-7",
              liked ? "text-[#fe2c55]" : "text-white",
              animate ? "animate-pulse-heart" : ""
            )}
            strokeWidth={liked ? 0 : 2}
          />
        </button>
        <span className="text-white text-xs font-semibold mt-1">{formatNumber(likes)}</span>
      </div>
      <div className="flex flex-col items-center">
        <button
          onClick={onComment}
          className="bg-transparent p-2 rounded-full"
        >
          <MessageCircle className="h-7 w-7 text-white" />
        </button>
        <span className="text-white text-xs font-semibold mt-1">{formatNumber(comments)}</span>
      </div>
      <div className="flex flex-col items-center">
        <button className="bg-transparent p-2 rounded-full">
          <Share className="h-7 w-7 text-white" />
        </button>
        <span className="text-white text-xs font-semibold mt-1">{formatNumber(shares)}</span>
      </div>
    </div>
  );
};

// Helper function to format large numbers
const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + "万";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "千";
  } else {
    return num.toString();
  }
};

export default ActionBar;
