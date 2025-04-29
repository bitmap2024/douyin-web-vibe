
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface UserInfoProps {
  username: string;
  nickname: string;
  caption: string;
  avatarSrc: string;
}

const UserInfo: React.FC<UserInfoProps> = ({
  username,
  nickname,
  caption,
  avatarSrc,
}) => {
  return (
    <div className="absolute bottom-20 left-3 right-20 z-20">
      <div className="flex items-center space-x-2 mb-2">
        <Avatar className="h-10 w-10 border-2 border-white">
          <AvatarImage src={avatarSrc} />
          <AvatarFallback>{username.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-bold text-white">
            {username}
            <span className="ml-2 font-normal text-white/80 text-sm">
              {nickname}
            </span>
          </p>
        </div>
        <Button variant="outline" size="sm" className="rounded-full border-primary text-primary hover:bg-primary/10">
          关注
        </Button>
      </div>
      <p className="text-white text-sm">{caption}</p>
    </div>
  );
};

export default UserInfo;
