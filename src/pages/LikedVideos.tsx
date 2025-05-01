import React from "react";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, Play, User } from "lucide-react";

const LikedVideos: React.FC = () => {
  const navigate = useNavigate();
  
  // 模拟点赞视频数据
  const likedVideos = [
    {
      id: 1,
      title: "超萌猫咪日常",
      author: "猫咪爱好者",
      authorAvatar: "",
      thumbnail: "https://placehold.co/300x400/333/FFF?text=猫咪视频",
      likes: 12500,
      views: 45000,
      duration: "0:45"
    },
    {
      id: 2,
      title: "美食制作教程",
      author: "美食达人",
      authorAvatar: "",
      thumbnail: "https://placehold.co/300x400/333/FFF?text=美食视频",
      likes: 8900,
      views: 32000,
      duration: "3:20"
    },
    {
      id: 3,
      title: "旅行日记 - 日本",
      author: "旅行家",
      authorAvatar: "",
      thumbnail: "https://placehold.co/300x400/333/FFF?text=旅行视频",
      likes: 15600,
      views: 52000,
      duration: "5:15"
    },
    {
      id: 4,
      title: "舞蹈表演",
      author: "舞蹈工作室",
      authorAvatar: "",
      thumbnail: "https://placehold.co/300x400/333/FFF?text=舞蹈视频",
      likes: 21000,
      views: 78000,
      duration: "2:30"
    },
    {
      id: 5,
      title: "科技产品评测",
      author: "科技达人",
      authorAvatar: "",
      thumbnail: "https://placehold.co/300x400/333/FFF?text=科技视频",
      likes: 9800,
      views: 35000,
      duration: "8:45"
    },
    {
      id: 6,
      title: "搞笑日常",
      author: "搞笑博主",
      authorAvatar: "",
      thumbnail: "https://placehold.co/300x400/333/FFF?text=搞笑视频",
      likes: 32000,
      views: 120000,
      duration: "1:15"
    }
  ];

  const handleVideoClick = (videoId: number) => {
    // 在实际应用中，这里会导航到视频详情页
    console.log(`查看视频 ${videoId}`);
  };

  const handleAuthorClick = (author: string) => {
    // 在实际应用中，这里会导航到作者主页
    navigate(`/user/${author}`);
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <Header />
      <div className="pt-16 px-4">
        <div className="flex items-center mt-6">
          <h1 className="text-2xl font-bold text-white">我点赞的视频</h1>
          <div className="ml-4 flex items-center text-gray-400">
            <Heart className="h-5 w-5 mr-1" />
            <span>{likedVideos.length} 个视频</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {likedVideos.map((video) => (
            <div 
              key={video.id} 
              className="bg-[#1e1e1e] rounded-lg overflow-hidden cursor-pointer hover:bg-[#2a2a2a] transition-colors"
              onClick={() => handleVideoClick(video.id)}
            >
              <div className="relative">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1 py-0.5 rounded">
                  {video.duration}
                </div>
                <div className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full">
                  <Play className="h-4 w-4" />
                </div>
              </div>
              <div className="p-3">
                <h3 className="text-white font-medium line-clamp-2">{video.title}</h3>
                <div 
                  className="flex items-center mt-2 text-gray-400 text-sm cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAuthorClick(video.author);
                  }}
                >
                  <Avatar className="h-5 w-5 mr-2">
                    <AvatarImage src={video.authorAvatar} />
                    <AvatarFallback className="text-xs">{video.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{video.author}</span>
                </div>
                <div className="flex items-center mt-2 text-gray-400 text-xs">
                  <Heart className="h-3 w-3 mr-1" />
                  <span>{video.likes.toLocaleString()}</span>
                  <span className="mx-2">•</span>
                  <span>{video.views.toLocaleString()} 次观看</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LikedVideos; 