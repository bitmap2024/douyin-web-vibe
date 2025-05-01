import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// 模拟数据
const mockTrendingVideos = [
  {
    id: 1,
    title: "2024年最热门的编程语言",
    thumbnail: "https://via.placeholder.com/300x200",
    views: 125000,
    likes: 12000,
    author: {
      id: 101,
      name: "科技达人",
      avatar: "https://via.placeholder.com/50",
    },
  },
  {
    id: 2,
    title: "人工智能最新突破",
    thumbnail: "https://via.placeholder.com/300x200",
    views: 98000,
    likes: 8500,
    author: {
      id: 102,
      name: "AI研究员",
      avatar: "https://via.placeholder.com/50",
    },
  },
  {
    id: 3,
    title: "Web开发最佳实践",
    thumbnail: "https://via.placeholder.com/300x200",
    views: 75000,
    likes: 6200,
    author: {
      id: 103,
      name: "前端专家",
      avatar: "https://via.placeholder.com/50",
    },
  },
];

const mockTrendingUsers = [
  {
    id: 201,
    name: "科技达人",
    avatar: "https://via.placeholder.com/50",
    followers: 125000,
    bio: "分享最新科技资讯和编程技巧",
  },
  {
    id: 202,
    name: "AI研究员",
    avatar: "https://via.placeholder.com/50",
    followers: 98000,
    bio: "人工智能领域的研究者和教育者",
  },
  {
    id: 203,
    name: "前端专家",
    avatar: "https://via.placeholder.com/50",
    followers: 75000,
    bio: "专注于前端开发和用户体验设计",
  },
];

const TrendingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("videos");
  const navigate = useNavigate();
  
  const handleLoginClick = () => {
    // 实现登录功能
  };

  const handleVideoClick = (videoId: number) => {
    navigate(`/video/${videoId}`);
  };

  const handleUserClick = (userId: number) => {
    navigate(`/user/${userId}`);
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <Header onLoginClick={handleLoginClick} />
      <LeftSidebar />
      {/* 主体内容区域，右侧主区域布局 */}
      <div className="ml-64 mt-16 p-6">
        <h1 className="text-3xl font-bold mb-6">趋势</h1>
        
        <Tabs defaultValue="videos" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="videos">趋势视频</TabsTrigger>
            <TabsTrigger value="users">趋势用户</TabsTrigger>
          </TabsList>
          
          <TabsContent value="videos" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTrendingVideos.map((video) => (
                <Card key={video.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleVideoClick(video.id)}>
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{video.title}</h3>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={video.author.avatar} />
                          <AvatarFallback>{video.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <span>{video.author.name}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span>{video.views.toLocaleString()} 次观看</span>
                        <span>{video.likes.toLocaleString()} 点赞</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTrendingUsers.map((user) => (
                <Card key={user.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleUserClick(user.id)}>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <Avatar className="h-16 w-16 mr-4">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-xl">{user.name}</h3>
                        <p className="text-gray-500">{user.followers.toLocaleString()} 粉丝</p>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-4">{user.bio}</p>
                    <Button variant="outline" className="w-full">关注</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TrendingPage; 