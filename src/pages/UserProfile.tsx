import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Heart, UserPlus, UserMinus, MessageSquare } from "lucide-react";
import { useUser, useFollowUser, useUnfollowUser, isFollowing, useCurrentUser, useUserKnowledgeBases, useUserKnowledgeBasesByUsername, useUserByUsername } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import MessageButton from "@/components/MessageButton";
import { User, KnowledgeBase } from "@/lib/types";

interface UserProfileProps {
  isCurrentUser?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ isCurrentUser = false }) => {
  const { username } = useParams<{ username: string }>();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"knowledgeBases" | "likes">("knowledgeBases");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // 获取当前用户数据
  const { data: currentUserData, isLoading: isCurrentUserLoading } = useCurrentUser();
  
  // 根据用户名获取用户信息
  const { data: userDataByUsername, isLoading: isUserByUsernameLoading } = useUserByUsername(isCurrentUser ? "" : username || "");
  
  // 从用户名获取用户ID（在实际应用中，这应该从API获取）
  const userId = isCurrentUser ? 0 : (userDataByUsername?.id || parseInt(username?.replace(/\D/g, '') || "1"));
  
  // 获取用户数据
  const { data: userData, isLoading: isUserLoading } = isCurrentUser 
    ? { data: currentUserData, isLoading: isCurrentUserLoading } 
    : userDataByUsername 
      ? { data: userDataByUsername, isLoading: isUserByUsernameLoading } 
      : useUser(userId);
  
  // 关注/取消关注功能
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();
  
  // 检查是否已关注
  const [isUserFollowing, setIsUserFollowing] = useState(false);
  
  // 获取用户的知识库列表
  const { data: knowledgeBases, isLoading: isKnowledgeBasesLoading } = isCurrentUser 
    ? useUserKnowledgeBases(0) 
    : useUserKnowledgeBasesByUsername(username || "");
  
  useEffect(() => {
    const checkFollowing = async () => {
      if (userData && !isCurrentUser) {
        const following = await isFollowing(userData.id);
        setIsUserFollowing(following);
      }
    };
    checkFollowing();
  }, [userData, isCurrentUser]);

  const [editForm, setEditForm] = useState({
    gender: "男",
    age: "25",
    school: "北京大学",
    experience: "热爱生活，热爱分享，记录美好瞬间"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // 在实际应用中，这里应该调用API保存用户资料
    setIsEditOpen(false);
    toast({
      title: "保存成功",
      description: "您的个人资料已更新",
    });
  };

  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };
  
  // 处理发送私信
  const handleSendMessage = () => {
    if (!currentUserData) {
      setIsLoginOpen(true);
      return;
    }
    
    navigate(`/messages/${userId}`);
  };

  const handleFollow = async () => {
    if (!currentUserData) {
      setIsLoginOpen(true);
      return;
    }
    
    try {
      if (isUserFollowing) {
        await unfollowMutation.mutate(userData.id, {
          onSuccess: () => {
            setIsUserFollowing(false);
            toast({
              title: "已取消关注",
              description: `您已取消关注 ${userData.username}`,
            });
          }
        });
      } else {
        await followMutation.mutate(userData.id, {
          onSuccess: () => {
            setIsUserFollowing(true);
            toast({
              title: "关注成功",
              description: `您已关注 ${userData.username}`,
            });
          }
        });
      }
    } catch (error) {
      console.error("关注操作失败:", error);
    }
  };

  if (isUserLoading || isCurrentUserLoading || !userData) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <Header onLoginClick={handleLoginClick} />
      <LeftSidebar />
      {/* 主体内容区域，右侧主区域布局 */}
      <div className="ml-64 mt-16">
        {/* 顶部横向大卡片 */}
        <div className="relative bg-gradient-to-r from-[#232526] to-[#414345] h-56 flex items-end px-12 pb-6">
          <img className="h-28 w-28 rounded-full border-4 border-white object-cover" src={userData.avatar} alt={userData.username} />
          <div className="ml-8 text-white">
            <div className="text-2xl font-bold">{userData.username}</div>
            <div className="mt-2 text-gray-300">抖音号：{userData.id}</div>
            <div className="flex gap-6 mt-2 text-gray-200">
              <span>关注 <b>{userData.following}</b></span>
              <span>粉丝 <b>{userData.followers}</b></span>
              <span>获赞 <b>0</b></span>
            </div>
          </div>
          {isCurrentUser && (
            <Button className="absolute right-12 bottom-6" variant="outline" onClick={() => setIsEditOpen(true)}>
              编辑资料
            </Button>
          )}
        </div>
        {/* 下方Tab和内容区 */}
        <div className="max-w-full px-8">
          <div className="flex border-b border-gray-800 mb-6">
            <button 
              className={`py-3 px-6 font-medium border-b-2 ${
                activeTab === "knowledgeBases" 
                  ? "text-white border-primary" 
                  : "text-gray-400 border-transparent"
              }`}
              onClick={() => setActiveTab("knowledgeBases")}
            >
              知识库 {knowledgeBases?.length || 0}
            </button>
            <button 
              className={`py-3 px-6 font-medium border-b-2 ${
                activeTab === "likes" 
                  ? "text-white border-primary" 
                  : "text-gray-400 border-transparent"
              }`}
              onClick={() => setActiveTab("likes")}
            >
              喜欢 0
            </button>
          </div>
          <div className="mt-6">
            {activeTab === "knowledgeBases" ? (
              isKnowledgeBasesLoading ? (
                <div className="flex justify-center items-center h-64">
                  <p>加载中...</p>
                </div>
              ) : knowledgeBases && knowledgeBases.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {knowledgeBases.map((kb) => (
                    <Link 
                      key={kb.id} 
                      to={`/knowledge-base/${kb.id}`}
                      className="block"
                    >
                      <div className="bg-card rounded-lg p-5 border border-gray-700 hover:border-gray-600 transition-colors h-full">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-blue-400 truncate mr-2">{kb.title}</h3>
                          <div className="flex items-center space-x-3 text-sm shrink-0">
                            <div className="flex items-center text-yellow-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                              <span>{kb.stars}</span>
                            </div>
                            <div className="flex items-center text-blue-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                              </svg>
                              <span>{kb.forks}</span>
                            </div>
                            <div className="flex items-center text-purple-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                              <span>{kb.papers.length}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-300 mb-4 line-clamp-2">{kb.description}</p>
                        
                        <div className="flex items-center mb-3 text-xs text-gray-400">
                          <div className="mr-4 whitespace-nowrap">更新于: {new Date(kb.updatedAt).toLocaleDateString('zh-CN')}</div>
                          <div className="whitespace-nowrap">创建于: {new Date(kb.createdAt).toLocaleDateString('zh-CN')}</div>
                        </div>
                        
                        <div className="mb-3">
                          {kb.papers.length > 0 && (
                            <div className="text-sm text-gray-300 border-t border-gray-700 pt-3 pb-2">
                              <div className="font-medium mb-2">最近论文:</div>
                              {kb.papers.slice(0, 1).map((paper) => (
                                <div key={paper.id} className="flex items-center mb-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <div className="truncate max-w-[200px]">
                                    <span className="text-blue-400 truncate">{paper.title}</span>
                                    <span className="text-xs text-gray-500 ml-2 truncate">（{paper.authors.join(", ")}）</span>
                                  </div>
                                </div>
                              ))}
                              {kb.papers.length > 1 && (
                                <div className="text-xs text-gray-500 italic">还有 {kb.papers.length - 1} 篇论文...</div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-auto">
                          {kb.tags.slice(0, 3).map((tag, index) => (
                            <span 
                              key={index} 
                              className="px-2 py-1 bg-gray-800 text-xs rounded-full text-blue-300"
                            >
                              {tag}
                            </span>
                          ))}
                          {kb.tags.length > 3 && (
                            <span className="text-xs text-gray-500 self-center">+{kb.tags.length - 3}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center h-64 text-gray-400">
                  <svg width="64" height="64" fill="none" viewBox="0 0 48 48"><rect width="48" height="48" rx="24" fill="#232526"/><path d="M24 16v8m0 0v4m0-4h4m-4 0h-4" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="12" y="28" width="24" height="8" rx="2" fill="#232526" stroke="#666" strokeWidth="2"/></svg>
                  <p className="mt-4">暂无内容<br/>该账号还未发布过作品哦~</p>
                </div>
              )
            ) : (
              <div className="flex flex-col justify-center items-center h-64 text-gray-400">
                <svg width="64" height="64" fill="none" viewBox="0 0 48 48"><rect width="48" height="48" rx="24" fill="#232526"/><path d="M24 16v8m0 0v4m0-4h4m-4 0h-4" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="12" y="28" width="24" height="8" rx="2" fill="#232526" stroke="#666" strokeWidth="2"/></svg>
                <p className="mt-4">暂无喜欢的内容</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* 编辑资料对话框 */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-card text-white">
          <DialogHeader>
            <DialogTitle>编辑个人资料</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gender" className="text-right">性别</Label>
              <Select 
                value={editForm.gender} 
                onValueChange={(value) => handleSelectChange("gender", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择性别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="男">男</SelectItem>
                  <SelectItem value="女">女</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="age" className="text-right">年龄</Label>
              <Input
                id="age"
                name="age"
                value={editForm.age}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="school" className="text-right">学校</Label>
              <Input
                id="school"
                name="school"
                value={editForm.school}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="experience" className="text-right">经历</Label>
              <Textarea
                id="experience"
                name="experience"
                value={editForm.experience}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>取消</Button>
            <Button onClick={handleSave}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 登录对话框 */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="bg-card text-white">
          <DialogHeader>
            <DialogTitle>登录</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">用户名</Label>
              <Input
                id="username"
                className="col-span-3"
                placeholder="请输入用户名"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">密码</Label>
              <Input
                id="password"
                type="password"
                className="col-span-3"
                placeholder="请输入密码"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLoginOpen(false)}>取消</Button>
            <Button>登录</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserProfile;