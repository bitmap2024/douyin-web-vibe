import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import { AlertCircle, CheckCircle, Eye, EyeOff, Trash2, Edit, Search } from "lucide-react";
import UserAvatar from "@/components/UserAvatar";
import api from "@/lib/realApi";
import { useToast } from "@/components/ui/use-toast";

// 帖子类型定义
interface Post {
  id: number;
  title: string;
  author: {
    id: number;
    username: string;
    avatar: string | null;
  };
  likes: number;
  views: number;
  comments_count: number;
  is_approved: boolean;
  is_hidden: boolean;
  created_at: string;
}

// 评论类型定义
interface Comment {
  id: number;
  content: string;
  author: {
    id: number;
    username: string;
    avatar: string | null;
  };
  post_id: number;
  is_approved: boolean;
  is_hidden: boolean;
  likes: number;
  created_at: string;
}

// 分页响应类型
interface PageResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

const CommunityManagement: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [posts, setPosts] = useState<Post[]>([]);
  const [pendingPosts, setPendingPosts] = useState<Post[]>([]);
  const [hiddenPosts, setHiddenPosts] = useState<Post[]>([]);
  const [pendingComments, setPendingComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewPostDetails, setViewPostDetails] = useState<Post | null>(null);
  const [postComments, setPostComments] = useState<Comment[]>([]);

  // 加载帖子
  const fetchPosts = async (page = 1, tab = activeTab) => {
    setIsLoading(true);
    try {
      let response;
      
      switch (tab) {
        case "pending":
          response = await api.get<PageResponse<Post>>("/posts/pending", {
            params: { skip: (page - 1) * 10, limit: 10 }
          });
          setPendingPosts(response.data.items);
          setTotalPages(response.data.total_pages);
          break;
        case "hidden":
          response = await api.get<PageResponse<Post>>("/posts/hidden", {
            params: { skip: (page - 1) * 10, limit: 10 }
          });
          setHiddenPosts(response.data.items);
          setTotalPages(response.data.total_pages);
          break;
        default:
          response = await api.get<PageResponse<Post>>("/posts", {
            params: { 
              skip: (page - 1) * 10, 
              limit: 10,
              approved_only: false 
            }
          });
          setPosts(response.data.items);
          setTotalPages(response.data.total_pages);
          break;
      }
      
      setCurrentPage(page);
    } catch (error) {
      console.error("加载帖子失败:", error);
      toast({
        title: "错误",
        description: "加载帖子失败，请重试",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 加载待审核评论
  const fetchPendingComments = async () => {
    try {
      // 这里应该调用专门获取待审核评论的API
      // 由于我们没有单独的接口，这里模拟一下
      // 实际开发中应当添加相应的后端接口
      const pendingCommentsList: Comment[] = [];
      
      // 获取所有帖子
      const response = await api.get<PageResponse<Post>>("/posts", {
        params: { 
          skip: 0, 
          limit: 100,
          approved_only: false 
        }
      });
      
      // 遍历帖子获取评论
      for (const post of response.data.items) {
        if (post.comments_count > 0) {
          const commentsResponse = await api.get<Comment[]>(`/posts/${post.id}/comments`);
          const pending = commentsResponse.data.filter(c => !c.is_approved && !c.is_hidden);
          if (pending.length > 0) {
            pendingCommentsList.push(...pending);
          }
        }
      }
      
      setPendingComments(pendingCommentsList);
    } catch (error) {
      console.error("加载待审核评论失败:", error);
    }
  };

  // 加载帖子的所有评论
  const fetchPostComments = async (postId: number) => {
    try {
      const response = await api.get<Comment[]>(`/posts/${postId}/comments`);
      setPostComments(response.data);
    } catch (error) {
      console.error("加载评论失败:", error);
      toast({
        title: "错误",
        description: "加载评论失败，请重试",
        variant: "destructive"
      });
    }
  };

  // 初次加载
  useEffect(() => {
    fetchPosts(1, activeTab);
    fetchPendingComments();
  }, []);

  // 标签切换时重新加载
  useEffect(() => {
    fetchPosts(1, activeTab);
  }, [activeTab]);

  // 切换帖子审核状态
  const handleToggleApprove = async (postId: number) => {
    try {
      await api.post(`/posts/${postId}/approve`);
      toast({
        title: "成功",
        description: "已更新帖子审核状态",
      });
      // 重新加载当前标签的数据
      fetchPosts(currentPage, activeTab);
      // 如果是待审核标签，还需要重新加载待审核帖子
      if (activeTab !== "pending") {
        fetchPosts(1, "pending");
      }
    } catch (error) {
      console.error("更新审核状态失败:", error);
      toast({
        title: "错误",
        description: "更新审核状态失败，请重试",
        variant: "destructive"
      });
    }
  };

  // 切换帖子隐藏状态
  const handleToggleHide = async (postId: number) => {
    try {
      await api.post(`/posts/${postId}/hide`);
      toast({
        title: "成功",
        description: "已更新帖子显示状态",
      });
      // 重新加载当前标签的数据
      fetchPosts(currentPage, activeTab);
      // 如果是隐藏标签，还需要重新加载隐藏帖子
      if (activeTab !== "hidden") {
        fetchPosts(1, "hidden");
      }
    } catch (error) {
      console.error("更新显示状态失败:", error);
      toast({
        title: "错误",
        description: "更新显示状态失败，请重试",
        variant: "destructive"
      });
    }
  };

  // 删除帖子
  const handleDeletePost = async (postId: number) => {
    if (!confirm("确定要删除这个帖子吗？此操作不可撤销。")) {
      return;
    }
    
    try {
      await api.delete(`/posts/${postId}`);
      toast({
        title: "成功",
        description: "已删除帖子",
      });
      // 重新加载当前标签的数据
      fetchPosts(currentPage, activeTab);
    } catch (error) {
      console.error("删除帖子失败:", error);
      toast({
        title: "错误",
        description: "删除帖子失败，请重试",
        variant: "destructive"
      });
    }
  };

  // 切换评论审核状态
  const handleToggleApproveComment = async (commentId: number) => {
    try {
      await api.post(`/posts/comments/${commentId}/approve`);
      toast({
        title: "成功",
        description: "已更新评论审核状态",
      });
      // 如果在查看帖子详情，刷新评论
      if (viewPostDetails) {
        fetchPostComments(viewPostDetails.id);
      }
      // 刷新待审核评论
      fetchPendingComments();
    } catch (error) {
      console.error("更新评论审核状态失败:", error);
      toast({
        title: "错误",
        description: "更新评论审核状态失败，请重试",
        variant: "destructive"
      });
    }
  };

  // 切换评论隐藏状态
  const handleToggleHideComment = async (commentId: number) => {
    try {
      await api.post(`/posts/comments/${commentId}/hide`);
      toast({
        title: "成功",
        description: "已更新评论显示状态",
      });
      // 如果在查看帖子详情，刷新评论
      if (viewPostDetails) {
        fetchPostComments(viewPostDetails.id);
      }
      // 刷新待审核评论
      fetchPendingComments();
    } catch (error) {
      console.error("更新评论显示状态失败:", error);
      toast({
        title: "错误",
        description: "更新评论显示状态失败，请重试",
        variant: "destructive"
      });
    }
  };

  // 删除评论
  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("确定要删除这条评论吗？此操作不可撤销。")) {
      return;
    }
    
    try {
      await api.delete(`/posts/comments/${commentId}`);
      toast({
        title: "成功",
        description: "已删除评论",
      });
      // 如果在查看帖子详情，刷新评论
      if (viewPostDetails) {
        fetchPostComments(viewPostDetails.id);
      }
      // 刷新待审核评论
      fetchPendingComments();
    } catch (error) {
      console.error("删除评论失败:", error);
      toast({
        title: "错误",
        description: "删除评论失败，请重试",
        variant: "destructive"
      });
    }
  };

  // 查看帖子详情
  const handleViewPostDetails = (post: Post) => {
    setViewPostDetails(post);
    fetchPostComments(post.id);
  };

  // 渲染帖子列表
  const renderPosts = (postList: Post[]) => {
    return (
      <div className="space-y-4">
        {postList.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            没有找到帖子
          </div>
        ) : (
          postList.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <UserAvatar 
                      username={post.author.username}
                      avatarSrc={post.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author.username}`}
                      size="sm"
                    />
                    <div>
                      <p className="font-medium">{post.author.username}</p>
                      <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {!post.is_approved && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        待审核
                      </Badge>
                    )}
                    {post.is_hidden && (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        已隐藏
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg mt-2 hover:text-blue-600 cursor-pointer" onClick={() => handleViewPostDetails(post)}>
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4 text-sm text-gray-500">
                    <span>👁️ {post.views}</span>
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments_count}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleToggleApprove(post.id)}
                      className={post.is_approved ? "text-green-600" : "text-gray-600"}
                    >
                      <CheckCircle size={16} className="mr-1" />
                      {post.is_approved ? "已审核" : "审核"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleToggleHide(post.id)}
                      className={post.is_hidden ? "text-amber-600" : "text-gray-600"}
                    >
                      {post.is_hidden ? <Eye size={16} className="mr-1" /> : <EyeOff size={16} className="mr-1" />}
                      {post.is_hidden ? "显示" : "隐藏"}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-600"
                    >
                      <Trash2 size={16} className="mr-1" />
                      删除
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
        
        {/* 分页 */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <Button
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => fetchPosts(currentPage - 1, activeTab)}
            >
              上一页
            </Button>
            <div className="flex items-center px-4">
              {currentPage} / {totalPages}
            </div>
            <Button
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => fetchPosts(currentPage + 1, activeTab)}
            >
              下一页
            </Button>
          </div>
        )}
      </div>
    );
  };

  // 渲染待审核评论
  const renderPendingComments = () => {
    return (
      <div className="space-y-4">
        {pendingComments.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            没有待审核的评论
          </div>
        ) : (
          pendingComments.map((comment) => (
            <Card key={comment.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <UserAvatar 
                      username={comment.author.username}
                      avatarSrc={comment.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author.username}`}
                      size="sm"
                    />
                    <div>
                      <p className="font-medium">{comment.author.username}</p>
                      <p className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{comment.content}</p>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleToggleApproveComment(comment.id)}
                    className="text-green-600"
                  >
                    <CheckCircle size={16} className="mr-1" />
                    审核通过
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleToggleHideComment(comment.id)}
                    className="text-amber-600"
                  >
                    <EyeOff size={16} className="mr-1" />
                    隐藏
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-red-600"
                  >
                    <Trash2 size={16} className="mr-1" />
                    删除
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      <Header />
      <LeftSidebar />
      <div className="pt-16 pl-64">
        <div className="container mx-auto py-6 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">社区管理</h1>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="搜索帖子..."
                  className="pl-8 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">全部帖子</TabsTrigger>
              <TabsTrigger value="pending">待审核帖子</TabsTrigger>
              <TabsTrigger value="hidden">隐藏帖子</TabsTrigger>
              <TabsTrigger value="comments">待审核评论</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {renderPosts(posts)}
            </TabsContent>
            
            <TabsContent value="pending">
              {renderPosts(pendingPosts)}
            </TabsContent>
            
            <TabsContent value="hidden">
              {renderPosts(hiddenPosts)}
            </TabsContent>
            
            <TabsContent value="comments">
              {renderPendingComments()}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 帖子详情对话框 */}
      {viewPostDetails && (
        <Dialog open={!!viewPostDetails} onOpenChange={(open) => !open && setViewPostDetails(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{viewPostDetails.title}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="flex items-center space-x-3">
                <UserAvatar 
                  username={viewPostDetails.author.username}
                  avatarSrc={viewPostDetails.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${viewPostDetails.author.username}`}
                  size="sm"
                />
                <div>
                  <p className="font-medium">{viewPostDetails.author.username}</p>
                  <p className="text-xs text-gray-500">{new Date(viewPostDetails.created_at).toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Badge variant={viewPostDetails.is_approved ? "outline" : "secondary"}>
                  {viewPostDetails.is_approved ? "已审核" : "待审核"}
                </Badge>
                {viewPostDetails.is_hidden && (
                  <Badge variant="destructive">已隐藏</Badge>
                )}
              </div>
              
              <div className="flex space-x-4 text-sm text-gray-500">
                <span>👁️ {viewPostDetails.views}</span>
                <span>❤️ {viewPostDetails.likes}</span>
                <span>💬 {viewPostDetails.comments_count}</span>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-2">评论 ({postComments.length})</h3>
                
                {postComments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">暂无评论</p>
                ) : (
                  <div className="space-y-4">
                    {postComments.map(comment => (
                      <div key={comment.id} className="border-b pb-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <UserAvatar 
                              username={comment.author.username}
                              avatarSrc={comment.author.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.author.username}`}
                              size="xs"
                            />
                            <div>
                              <p className="font-medium">{comment.author.username}</p>
                              <p className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            {!comment.is_approved && (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                待审核
                              </Badge>
                            )}
                            {comment.is_hidden && (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                已隐藏
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="mt-2 text-gray-700">{comment.content}</p>
                        
                        <div className="flex justify-end mt-2 space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleToggleApproveComment(comment.id)}
                            className={comment.is_approved ? "text-green-600" : "text-gray-600"}
                          >
                            <CheckCircle size={16} className="mr-1" />
                            {comment.is_approved ? "已审核" : "审核"}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleToggleHideComment(comment.id)}
                            className={comment.is_hidden ? "text-amber-600" : "text-gray-600"}
                          >
                            {comment.is_hidden ? <Eye size={16} className="mr-1" /> : <EyeOff size={16} className="mr-1" />}
                            {comment.is_hidden ? "显示" : "隐藏"}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-600"
                          >
                            <Trash2 size={16} className="mr-1" />
                            删除
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter className="mt-4">
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => handleToggleApprove(viewPostDetails.id)}
                  className={viewPostDetails.is_approved ? "text-green-600" : "text-gray-600"}
                >
                  <CheckCircle size={16} className="mr-1" />
                  {viewPostDetails.is_approved ? "已审核" : "审核"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleToggleHide(viewPostDetails.id)}
                  className={viewPostDetails.is_hidden ? "text-amber-600" : "text-gray-600"}
                >
                  {viewPostDetails.is_hidden ? <Eye size={16} className="mr-1" /> : <EyeOff size={16} className="mr-1" />}
                  {viewPostDetails.is_hidden ? "显示" : "隐藏"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleDeletePost(viewPostDetails.id)}
                  className="text-red-600"
                >
                  <Trash2 size={16} className="mr-1" />
                  删除
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CommunityManagement; 