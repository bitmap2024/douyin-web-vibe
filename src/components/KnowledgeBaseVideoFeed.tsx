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
  const [isDataGenerated, setIsDataGenerated] = useState(false);
  
  // 添加更多视频内容
  const videoContents = [
    "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YWklMjBicmFpbnxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWklMjBicmFpbnxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1620330989164-870d89a04dd0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8YWklMjBicmFpbnxlbnwwfHwwfHx8MA%3D%3D",
    "https://images.unsplash.com/photo-1562408590-e32931084e23?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHJvYm90fGVufDB8fDB8fHww",
    "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cm9ib3R8ZW58MHx8MHx8fDA%3D",
    // 添加更多图片
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1535378620166-273708d44e4c?auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1677442135137-3743cad5025d?auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1675514576762-bc0f50221607?auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1633412802994-5c058f151b66?auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  ];

  // 创建一个函数来生成大量知识库数据
  const generateKnowledgeBases = (originalData: KnowledgeBase[], minCount: number): KnowledgeBase[] => {
    if (!originalData || originalData.length === 0) return [];
    
    if (originalData.length >= minCount) {
      return originalData;
    }
    
    console.log(`生成数据，原有数量: ${originalData.length}，目标数量: ${minCount}`);
    
    // 复制现有数据并修改以创建更多条目
    const extraNeeded = minCount - originalData.length;
    let result = [...originalData];
    
    for (let i = 0; i < extraNeeded; i++) {
      const original = originalData[i % originalData.length];
      const newKB: KnowledgeBase = {
        ...original,
        id: original.id + 10000 + i, // 创建新的唯一ID
        title: `${original.title} - 变体 ${i + 1}`, // 修改标题
        stars: Math.floor(original.stars * (0.5 + Math.random())), // 随机修改星数
        description: `${original.description} (${i + 1})`, // 修改描述
        createdAt: new Date(new Date(original.createdAt).getTime() + i * 86400000).toISOString().split('T')[0], // 每个项目日期+1天
        updatedAt: new Date(new Date(original.updatedAt).getTime() + i * 86400000).toISOString().split('T')[0]
      };
      result.push(newKB);
    }
    
    console.log(`生成完成，新数据量: ${result.length}`);
    return result;
  };

  // 根据sourceType过滤知识库
  useEffect(() => {
    if (!knowledgeBases || !currentUser) return;

    let filtered: KnowledgeBase[] = [];
    
    if (sourceType === "recommend") {
      // 推荐：随机排序或按照收藏数排序的知识库
      filtered = [...knowledgeBases].sort((a, b) => b.stars - a.stars);
    } else if (sourceType === "following") {
      // 关注：只显示用户关注的创作者创建的知识库
      if (currentUser.followingList && currentUser.followingList.length > 0) {
        filtered = knowledgeBases.filter(kb => 
          currentUser.followingList?.includes(kb.userId)
        );
      } else {
        // 如果没有关注任何人，默认显示一些知识库
        filtered = [...knowledgeBases].sort(() => Math.random() - 0.5).slice(0, 10);
      }
    } else if (sourceType === "friends") {
      // 朋友：相互关注的用户创建的知识库
      // 假设朋友是双向关注的关系
      if (currentUser.followingList && currentUser.followingList.length > 0) {
        filtered = knowledgeBases.filter(kb => {
          // 获取知识库创建者
          const creator = { id: kb.userId, followingList: [] };
          // 检查创建者是否也关注了当前用户
          return currentUser.followingList?.includes(kb.userId) && 
                 creator.followingList.includes(currentUser.id);
        });
        
        // 如果没有朋友关系，默认显示一些知识库
        if (filtered.length === 0) {
          filtered = [...knowledgeBases].sort(() => Math.random() - 0.5).slice(0, 10);
        }
      } else {
        // 默认显示一些随机知识库
        filtered = [...knowledgeBases].sort(() => Math.random() - 0.5).slice(0, 10);
      }
    }

    // 如果筛选后没有内容，默认显示推荐
    if (filtered.length === 0) {
      filtered = [...knowledgeBases].sort((a, b) => b.stars - a.stars);
    }
    
    // 确保有足够多的数据
    const minItemCount = sourceType === "recommend" ? 120 : 30;
    const generatedData = generateKnowledgeBases(filtered, minItemCount);
    
    // 随机打乱顺序，使体验更加真实
    if (sourceType === "recommend") {
      generatedData.sort((a, b) => b.stars - a.stars);
    } else {
      generatedData.sort(() => Math.random() - 0.5);
    }
    
    setFilteredKnowledgeBases(generatedData);
    setIsDataGenerated(true);
    
    // 获取所有知识库创建者的信息
    const fetchOwners = async () => {
      const ownersMap: Record<number, any> = {};
      // 只获取前20个知识库的创建者信息，避免过多API调用
      const kbsToFetch = generatedData.slice(0, 20);
      for (const kb of kbsToFetch) {
        try {
          const user = await getUserByUsername(`用户${kb.userId}`);
          ownersMap[kb.userId] = user;
        } catch (error) {
          console.error(`获取用户信息失败: ${kb.userId}`, error);
          // 创建默认用户信息
          ownersMap[kb.userId] = { 
            username: `用户${kb.userId}`, 
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${kb.userId}` 
          };
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