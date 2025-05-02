import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import UserProfile from "@/components/UserProfile";
import { useUserByUsername } from "@/lib/api";

const UserPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { data: userData, isLoading } = useUserByUsername(username || "");
  
  if (isLoading || !userData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">加载中...</div>
      </div>
    );
  }

  return (
    <UserProfile
      username={userData.username || "山与"}
      followers={userData.followers || 7876400}
      following={userData.following || 231}
      likes={userData.likes || 39000}
      userId={userData.id?.toString() || "342779261"}
      avatarSrc={userData.avatar || "https://p16-sign-sg.tiktokcdn.com/aweme/100x100/tos-alisg-avt-0068/3c1fc3adecedc993d79950a82fb34f82.jpeg?lk3s=a5d48078&x-expires=1703678400&x-signature=c%2FrTBusBcR1HjRvu0pYqMPZhxbo%3D"}
      description={userData.experience || "黄豆酱是一种感觉😊😄😃👍🔥 恋爱: @为脸面 @有个流"}
      location={userData.location || "海南"}
    />
  );
};

export default UserPage; 