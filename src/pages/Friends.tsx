import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import { useNavigate } from "react-router-dom";
import { useFollowingList, useAllKnowledgeBases } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share, Bookmark, ChevronUp, ChevronDown, Plus, Users } from "lucide-react";
import { KnowledgeBase } from "@/lib/types";

const Friends = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { data: followingUsers, isLoading: isFollowingLoading } = useFollowingList();
  const { data: allKnowledgeBases, isLoading: isKnowledgeBasesLoading } = useAllKnowledgeBases();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };
  
  // 模拟视频数据
  const videoContents = [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dGVhbXxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHRlYW18ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHRlYW18ZW58MHx8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHRlYW18ZW58MHx8MHx8fDA%3D"
  ];

  // 模拟互动数据
  const interactionData = [
    { likes: "2.8千", comments: 146, favorites: 982, shares: 654 },
    { likes: "5.1千", comments: 212, favorites: 1748, shares: 1023 },
    { likes: "7.3千", comments: 305, favorites: 2543, shares: 1896 },
    { likes: "3.4千", comments: 178, favorites: 1245, shares: 890 }
  ];
  
  // 模拟互相关注的好友用户ID（真实应用中应从API获取）
  const mutualFollowIds = [1, 3, 5]; // 假设这些是互相关注的用户ID
  
  // 筛选出互相关注的好友的知识库
  const filterFriendsKnowledgeBases = (): KnowledgeBase[] => {
    if (!allKnowledgeBases) return [];
    
    return allKnowledgeBases.filter(kb => mutualFollowIds.includes(kb.userId));
  };
  
  const friendsKnowledgeBases = filterFriendsKnowledgeBases();
  
  const handleNext = () => {
    if (friendsKnowledgeBases && currentIndex < friendsKnowledgeBases.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => prevIndex - 1);
    }
  };
  
  const handleKnowledgeBaseClick = (kbId: number) => {
    navigate(`/knowledge-base/${kbId}`);
  };

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        handlePrevious();
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, friendsKnowledgeBases]); // eslint-disable-line react-hooks/exhaustive-deps
  
  if (isFollowingLoading || isKnowledgeBasesLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white">加载中...</div>
      </div>
    );
  }
  
  if (friendsKnowledgeBases.length === 0) {
    return (
      <div className="min-h-screen bg-[#121212]">
        <Header onLoginClick={handleLoginClick} />
        <LeftSidebar />
        <div className="ml-64 mt-16 p-6 flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="bg-gray-800 rounded-full p-8 inline-block mb-6">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">还没有互相关注的朋友</h2>
            <p className="text-gray-400 mb-8">当你和其他用户互相关注后，他们的更新会显示在这里</p>
            <Button 
              onClick={() => navigate('/featured')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              寻找朋友
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  const currentKB = friendsKnowledgeBases[currentIndex];
  const videoSrc = videoContents[currentIndex % videoContents.length];
  const interactions = interactionData[currentIndex % interactionData.length];
  
  return (
    <div className="min-h-screen bg-[#121212]">
      <Header onLoginClick={handleLoginClick} />
      <LeftSidebar />
      
      {/* 主体内容区域，右侧主区域布局 */}
      <div className="ml-64 mt-16 h-[calc(100vh-4rem)] bg-black">
        <div className="relative h-full w-full">
          {/* 视频区域 */}
          <div className="relative h-full w-full bg-gray-900 overflow-hidden">
            <img 
              src={videoSrc} 
              alt={currentKB.title}
              className="w-full h-full object-cover"
            />
            
            {/* 垂直导航指示器 */}
            <div className="absolute top-1/2 left-6 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity">
              <div className="flex flex-col space-y-6">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full bg-gray-800/50 text-white"
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                >
                  <ChevronUp className="h-6 w-6" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full bg-gray-800/50 text-white"
                  onClick={handleNext}
                  disabled={!friendsKnowledgeBases || currentIndex === friendsKnowledgeBases.length - 1}
                >
                  <ChevronDown className="h-6 w-6" />
                </Button>
              </div>
            </div>
            
            {/* 知识库信息区域 */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pt-20 bg-gradient-to-t from-black to-transparent">
              <div className="max-w-4xl mb-4">
                <h3 
                  className="text-white text-2xl font-bold mb-3 cursor-pointer"
                  onClick={() => handleKnowledgeBaseClick(currentKB.id)}
                >
                  {currentKB.title}
                </h3>
                <p className="text-gray-300 text-base mb-3">{currentKB.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentKB.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-800/50 text-xs rounded-full text-blue-300">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* 用户信息区域 */}
              <div className="flex items-center mb-4">
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => navigate(`/user/${currentKB.userId}`)}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-500 overflow-hidden mr-3 border-2 border-blue-300">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentKB.userId}`} 
                      alt="用户头像" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-white font-medium">@用户{currentKB.userId} <span className="text-blue-300 text-xs ml-1">朋友</span></div>
                    <div className="text-gray-400 text-sm">
                      {new Date(currentKB.updatedAt).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="ml-auto rounded-full bg-blue-500 hover:bg-blue-600 text-white px-5"
                  size="sm"
                >
                  互相关注
                </Button>
              </div>
            </div>
            
            {/* 右侧操作按钮 */}
            <div className="absolute right-5 bottom-32 flex flex-col items-center space-y-6">
              <div className="flex flex-col items-center">
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-gray-800/30 text-white">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentKB.userId}`} 
                    alt="用户头像" 
                    className="w-8 h-8 rounded-full"
                  />
                </Button>
                <div className="w-6 h-6 -mt-2 rounded-full bg-blue-500 flex items-center justify-center">
                  <Plus size={14} className="text-white" />
                </div>
              </div>
              
              <div className="flex flex-col items-center">
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-gray-800/30 text-white">
                  <Heart className="h-7 w-7" />
                </Button>
                <div className="text-white text-xs mt-1">{interactions.likes}</div>
              </div>
              
              <div className="flex flex-col items-center">
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-gray-800/30 text-white">
                  <MessageSquare className="h-7 w-7" />
                </Button>
                <div className="text-white text-xs mt-1">{interactions.comments}</div>
              </div>
              
              <div className="flex flex-col items-center">
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-gray-800/30 text-white">
                  <Bookmark className="h-7 w-7" />
                </Button>
                <div className="text-white text-xs mt-1">{interactions.favorites}</div>
              </div>
              
              <div className="flex flex-col items-center">
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-gray-800/30 text-white">
                  <Share className="h-7 w-7" />
                </Button>
                <div className="text-white text-xs mt-1">{interactions.shares}</div>
              </div>
            </div>
            
            {/* 当前索引/总数指示器 */}
            <div className="absolute top-20 right-5 bg-gray-800/50 px-2 py-1 rounded-full text-white text-xs">
              {currentIndex + 1}/{friendsKnowledgeBases.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends; 