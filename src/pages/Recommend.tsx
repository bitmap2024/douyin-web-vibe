import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import { useNavigate } from "react-router-dom";
import { useAllKnowledgeBases } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share, Bookmark } from "lucide-react";

const Recommend: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { data: knowledgeBases, isLoading } = useAllKnowledgeBases();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };
  
  // 模拟视频数据
  const videoContents = [
    "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWklMjBicmFpbnxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWklMjBicmFpbnxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1620330989164-870d89a04dd0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YWklMjBicmFpbnxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1562408590-e32931084e23?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHJvYm90fGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cm9ib3R8ZW58MHx8MHx8fDA%3D"
  ];
  
  const handleNext = () => {
    if (knowledgeBases && currentIndex < knowledgeBases.length - 1) {
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
  }, [currentIndex, knowledgeBases]); // eslint-disable-line react-hooks/exhaustive-deps
  
  if (isLoading || !knowledgeBases) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white">加载中...</div>
      </div>
    );
  }
  
  const currentKB = knowledgeBases[currentIndex];
  const videoSrc = videoContents[currentIndex % videoContents.length];
  
  return (
    <div className="min-h-screen bg-[#121212]">
      <Header onLoginClick={handleLoginClick} />
      <LeftSidebar />
      
      {/* 主体内容区域，右侧主区域布局 */}
      <div className="ml-64 mt-16 h-[calc(100vh-4rem)] bg-black flex items-center">
        <div className="relative h-full w-full">
          {/* 视频区域 */}
          <div className="relative h-full w-full bg-gray-900 overflow-hidden">
            <img 
              src={videoSrc} 
              alt={currentKB.title}
              className="w-full h-full object-cover"
            />
            
            {/* 视频控制按钮区域 */}
            <div className="absolute inset-0 flex">
              {/* 上一个视频区域 */}
              <div 
                className="w-1/2 h-full cursor-pointer flex items-center justify-start pl-8 opacity-0 hover:opacity-100 transition-opacity"
                onClick={handlePrevious}
              >
                {currentIndex > 0 && (
                  <div className="bg-gray-800/50 rounded-full p-4 transform -translate-x-4 hover:translate-x-0 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </div>
                )}
              </div>
              
              {/* 下一个视频区域 */}
              <div 
                className="w-1/2 h-full cursor-pointer flex items-center justify-end pr-8 opacity-0 hover:opacity-100 transition-opacity"
                onClick={handleNext}
              >
                {knowledgeBases && currentIndex < knowledgeBases.length - 1 && (
                  <div className="bg-gray-800/50 rounded-full p-4 transform translate-x-4 hover:translate-x-0 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                )}
              </div>
            </div>
            
            {/* 知识库信息区域 */}
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent">
              <div className="max-w-4xl mb-4">
                <h3 
                  className="text-white text-3xl font-bold mb-4 cursor-pointer"
                  onClick={() => handleKnowledgeBaseClick(currentKB.id)}
                >
                  {currentKB.title}
                </h3>
                <p className="text-gray-300 text-lg max-w-2xl">{currentKB.description}</p>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {currentKB.tags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-800/50 text-sm rounded-full text-blue-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* 用户信息区域 */}
              <div 
                className="flex items-center mb-8 cursor-pointer"
                onClick={() => navigate(`/user/${currentKB.userId}`)}
              >
                <div className="w-12 h-12 rounded-full bg-blue-500 overflow-hidden mr-3">
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentKB.userId}`} 
                    alt="用户头像" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-white font-medium text-lg">用户{currentKB.userId}</div>
                  <div className="text-gray-400">
                    {currentKB.papers.length} 篇论文 • {currentKB.stars} 收藏
                  </div>
                </div>
              </div>
            </div>
            
            {/* 右侧操作按钮 */}
            <div className="absolute right-8 bottom-1/4 flex flex-col items-center space-y-8">
              <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full bg-gray-800/50 text-white">
                <Heart className="h-8 w-8" />
              </Button>
              <div className="text-white">128</div>
              
              <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full bg-gray-800/50 text-white">
                <MessageSquare className="h-8 w-8" />
              </Button>
              <div className="text-white">24</div>
              
              <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full bg-gray-800/50 text-white">
                <Share className="h-8 w-8" />
              </Button>
              <div className="text-white">56</div>
              
              <Button variant="ghost" size="icon" className="h-14 w-14 rounded-full bg-gray-800/50 text-white">
                <Bookmark className="h-8 w-8" />
              </Button>
              <div className="text-white">收藏</div>
            </div>
            
            {/* 当前索引/总数指示器 */}
            <div className="absolute top-8 right-8 bg-gray-800/50 px-4 py-2 rounded-full text-white text-sm">
              {currentIndex + 1}/{knowledgeBases.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommend; 