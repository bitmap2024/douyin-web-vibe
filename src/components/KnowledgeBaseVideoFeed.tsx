import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Share, Bookmark } from "lucide-react";
import { useAllKnowledgeBases, useCurrentUser, getUserByUsername } from "@/lib/api";
import UserAvatar from "@/components/UserAvatar";

interface KnowledgeBase {
  id: number;
  title: string;
  description: string;
  tags: string[];
  papers: any[];
  stars: number;
  forks: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

interface KnowledgeBaseVideoFeedProps {
  sourceType: "recommend" | "friends" | "following";
}

const KnowledgeBaseVideoFeed: React.FC<KnowledgeBaseVideoFeedProps> = ({ sourceType }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: knowledgeBases, isLoading } = useAllKnowledgeBases();
  const { data: currentUser } = useCurrentUser();
  const navigate = useNavigate();
  const [filteredKnowledgeBases, setFilteredKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [owners, setOwners] = useState<Record<number, any>>({});
  
  // 模拟视频数据
  const videoContents = [
    "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWklMjBicmFpbnxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWklMjBicmFpbnxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1620330989164-870d89a04dd0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YWklMjBicmFpbnxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1562408590-e32931084e23?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHJvYm90fGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cm9ib3R8ZW58MHx8MHx8fDA%3D"
  ];

  // 根据sourceType过滤知识库
  useEffect(() => {
    if (!knowledgeBases || !currentUser) return;

    let filtered: KnowledgeBase[] = [];
    
    if (sourceType === "recommend") {
      // 推荐：随机排序或按照收藏数排序的知识库
      filtered = [...knowledgeBases].sort((a, b) => b.stars - a.stars);
    } else if (sourceType === "following") {
      // 关注：只显示用户关注的创作者创建的知识库
      // 这里使用followingList来模拟用户关注的创作者
      if (currentUser.followingList) {
        filtered = knowledgeBases.filter(kb => 
          currentUser.followingList?.includes(kb.userId)
        );
      }
    } else if (sourceType === "friends") {
      // 朋友：相互关注的用户创建的知识库
      // 假设朋友是双向关注的关系
      if (currentUser.followingList) {
        filtered = knowledgeBases.filter(kb => {
          // 获取知识库创建者
          const creator = { id: kb.userId, followingList: [] };
          // 检查创建者是否也关注了当前用户
          return currentUser.followingList?.includes(kb.userId) && 
                 creator.followingList.includes(currentUser.id);
        });
      }
    }

    // 如果筛选后没有内容，默认显示推荐
    if (filtered.length === 0) {
      filtered = [...knowledgeBases].sort((a, b) => b.stars - a.stars);
    }

    setFilteredKnowledgeBases(filtered);
    
    // 获取所有知识库创建者的信息
    const fetchOwners = async () => {
      const ownersMap: Record<number, any> = {};
      for (const kb of filtered) {
        try {
          const user = await getUserByUsername(`用户${kb.userId}`);
          ownersMap[kb.userId] = user;
        } catch (error) {
          console.error(`获取用户信息失败: ${kb.userId}`, error);
        }
      }
      setOwners(ownersMap);
    };
    
    fetchOwners();
  }, [knowledgeBases, currentUser, sourceType]);
  
  const handleNext = () => {
    if (filteredKnowledgeBases && currentIndex < filteredKnowledgeBases.length - 1) {
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
  }, [currentIndex, filteredKnowledgeBases]); // eslint-disable-line react-hooks/exhaustive-deps
  
  if (isLoading || !knowledgeBases || filteredKnowledgeBases.length === 0) {
    return (
      <div className="h-[calc(100vh-4rem)] bg-black flex items-center justify-center">
        <div className="text-white">加载中...</div>
      </div>
    );
  }
  
  const currentKB = filteredKnowledgeBases[currentIndex];
  const videoSrc = videoContents[currentIndex % videoContents.length];
  const owner = owners[currentKB.userId] || { 
    username: `用户${currentKB.userId}`, 
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentKB.userId}` 
  };
  
  return (
    <div className="h-[calc(100vh-4rem)] bg-black flex items-center">
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
              {filteredKnowledgeBases && currentIndex < filteredKnowledgeBases.length - 1 && (
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
            <div className="flex items-center mb-8">
              <UserAvatar 
                username={owner.username}
                avatarSrc={owner.avatar}
                size="lg"
                className="w-12 h-12 mr-3" 
              />
              <div>
                <div className="text-white font-medium text-lg">{owner.username}</div>
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
            {currentIndex + 1}/{filteredKnowledgeBases.length}
          </div>

          {/* 来源标识 */}
          <div className="absolute top-8 left-8 bg-gray-800/50 px-4 py-2 rounded-full text-white text-sm">
            {sourceType === "recommend" && "为您推荐"}
            {sourceType === "following" && "关注更新"}
            {sourceType === "friends" && "好友动态"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBaseVideoFeed; 