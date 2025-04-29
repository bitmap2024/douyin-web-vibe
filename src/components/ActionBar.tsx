
import React, { useState } from "react";
import { Heart, MessageCircle, Star, Share } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface ActionBarProps {
  video: {
    likes: number;
    comments: number;
    favorites: number;
    shares: number;
    username?: string;
  };
}

const ActionBar: React.FC<ActionBarProps> = ({ video }) => {
  const [liked, setLiked] = useState(false);
  const [favorited, setFavorited] = useState(false);
  const [likes, setLikes] = useState(video.likes);
  const [favorites, setFavorites] = useState(video.favorites);
  const [animate, setAnimate] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 500);
  };

  const handleFavorite = () => {
    setFavorited(!favorited);
    setFavorites(favorited ? favorites - 1 : favorites + 1);
  };

  return (
    <div className="absolute right-4 bottom-40 flex flex-col items-center space-y-8 z-20">
      <div className="flex flex-col items-center">
        <button onClick={handleLike} className="bg-transparent p-2 rounded-full">
          <Heart
            fill={liked ? "#fff" : "transparent"}
            className={cn(
              "h-8 w-8 text-white",
              animate ? "animate-pulse-heart" : ""
            )}
          />
        </button>
        <span className="text-white text-sm font-medium mt-1">
          {formatNumber(likes)}
        </span>
      </div>

      <div className="flex flex-col items-center">
        <button className="bg-transparent p-2 rounded-full">
          <MessageCircle className="h-8 w-8 text-white" />
        </button>
        <span className="text-white text-sm font-medium mt-1">
          {video.comments}
        </span>
      </div>

      <div className="flex flex-col items-center">
        <button onClick={handleFavorite} className="bg-transparent p-2 rounded-full">
          <Star
            fill={favorited ? "#fff" : "transparent"}
            className="h-8 w-8 text-white"
          />
        </button>
        <span className="text-white text-sm font-medium mt-1">
          {formatNumber(favorites)}
        </span>
      </div>

      <div className="flex flex-col items-center">
        <button className="bg-transparent p-2 rounded-full">
          <Share className="h-8 w-8 text-white" />
        </button>
        <span className="text-white text-sm font-medium mt-1">
          {formatNumber(video.shares)}
        </span>
      </div>

      <div className="flex flex-col items-center relative">
        <Link 
          to={`/user/${video.username || 'default'}`} 
          className="rounded-full bg-white p-2"
        >
          <img 
            src="public/lovable-uploads/f4eba2f8-ee2a-41e8-82bf-7eaa3c9461f8.png" 
            alt="Profile" 
            className="h-8 w-8 rounded-full object-cover"
          />
        </Link>
        <span className="bg-[#fe2c55] rounded-full h-5 w-5 flex items-center justify-center text-white text-xs absolute -top-1 -right-1">+</span>
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
