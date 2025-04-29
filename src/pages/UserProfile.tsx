
import React from "react";
import Header from "@/components/Header";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const UserProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  
  // Mock user data - in a real app, this would come from an API
  const userData = {
    username: username || "用户",
    nickname: "抖音用户",
    avatarSrc: "",
    followers: "10.2万",
    following: 128,
    likes: "52.8万",
    bio: "这是一个抖音用户主页",
    videos: 42
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <Header />
      <div className="pt-16 px-4">
        <div className="flex items-start mt-6">
          <Avatar className="h-20 w-20 border-2 border-white">
            <AvatarImage src={userData.avatarSrc} />
            <AvatarFallback className="text-xl">{userData.username.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="ml-4 flex-1">
            <h1 className="text-xl font-bold text-white">{userData.username}</h1>
            <p className="text-gray-400">@{userData.nickname}</p>
            <div className="flex items-center mt-4">
              <Button variant="outline" className="rounded-full text-white border-primary hover:bg-primary/10">
                关注
              </Button>
              <Button variant="ghost" className="rounded-full text-white ml-2">
                消息
              </Button>
            </div>
          </div>
        </div>

        <div className="flex mt-6 text-white border-b border-gray-800 pb-3">
          <div className="mr-6">
            <span className="font-bold">{userData.followers}</span>
            <p className="text-gray-400 text-sm">粉丝</p>
          </div>
          <div className="mr-6">
            <span className="font-bold">{userData.following}</span>
            <p className="text-gray-400 text-sm">关注</p>
          </div>
          <div>
            <span className="font-bold">{userData.likes}</span>
            <p className="text-gray-400 text-sm">获赞</p>
          </div>
        </div>

        <div className="mt-4 text-white text-sm">{userData.bio}</div>

        <div className="mt-8">
          <div className="flex justify-around border-b border-gray-800">
            <button className="py-3 px-6 text-white font-medium border-b-2 border-primary">
              作品 {userData.videos}
            </button>
            <button className="py-3 px-6 text-gray-400">
              点赞
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-1 mt-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-800 rounded-md flex items-center justify-center text-gray-400">
                暂无视频
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
