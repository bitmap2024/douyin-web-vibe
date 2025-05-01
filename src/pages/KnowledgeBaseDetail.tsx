import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import { useKnowledgeBase, useUser } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Star, 
  GitFork, 
  Clock, 
  Tag, 
  FileText, 
  ExternalLink, 
  ChevronLeft,
  Plus
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
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
import EmailLoginForm from "@/components/EmailLoginForm";

const KnowledgeBaseDetail: React.FC = () => {
  const { kbId } = useParams<{ kbId: string }>();
  const { toast } = useToast();
  const [isAddPaperOpen, setIsAddPaperOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [newPaper, setNewPaper] = useState({
    title: "",
    authors: "",
    abstract: "",
    publishDate: "",
    doi: "",
    url: ""
  });
  
  // 获取知识库数据
  const { data: kbData, isLoading: isKbLoading } = useKnowledgeBase(parseInt(kbId || "0"));
  
  // 获取知识库所有者数据
  const { data: ownerData } = useUser(kbData?.userId || 0);
  
  // 处理登录点击
  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };
  
  // 处理添加论文
  const handleAddPaper = () => {
    // 在实际应用中，这里应该调用API添加论文
    setIsAddPaperOpen(false);
    toast({
      title: "添加成功",
      description: "论文已添加到知识库",
    });
  };
  
  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPaper(prev => ({ ...prev, [name]: value }));
  };
  
  if (isKbLoading || !kbData) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white">加载中...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-[#121212]">
      <Header onLoginClick={handleLoginClick} />
      <div className="pt-16 px-4 max-w-6xl mx-auto">
        {/* 返回按钮 */}
        <Link to={`/user/${ownerData?.username || ""}`} className="inline-flex items-center text-gray-400 hover:text-white mt-4">
          <ChevronLeft className="h-4 w-4 mr-1" />
          返回用户主页
        </Link>
        
        {/* 知识库标题和操作 */}
        <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{kbData.title}</h1>
            <p className="text-gray-400 mt-1">{kbData.description}</p>
          </div>
          <div className="flex mt-4 md:mt-0">
            <Button variant="outline" className="mr-2 text-white border-gray-700 hover:bg-gray-800">
              <Star className="h-4 w-4 mr-1" />
              收藏 ({kbData.stars})
            </Button>
            <Button variant="outline" className="text-white border-gray-700 hover:bg-gray-800">
              <GitFork className="h-4 w-4 mr-1" />
              复制 ({kbData.forks})
            </Button>
          </div>
        </div>
        
        {/* 知识库信息 */}
        <div className="mt-6 flex flex-wrap items-center text-sm text-gray-400">
          <div className="flex items-center mr-4">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={ownerData?.avatar} />
              <AvatarFallback>{ownerData?.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Link to={`/user/${ownerData?.username || ""}`} className="hover:text-white">
              {ownerData?.username}
            </Link>
          </div>
          <div className="flex items-center mr-4">
            <Clock className="h-4 w-4 mr-1" />
            更新于 {kbData.updatedAt}
          </div>
          <div className="flex items-center">
            <Tag className="h-4 w-4 mr-1" />
            {kbData.tags.map(tag => (
              <Badge key={tag} variant="outline" className="mr-1 bg-gray-800 text-gray-300 border-gray-700">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        
        {/* 标签页 */}
        <Tabs defaultValue="papers" className="mt-8">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="papers" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
              <FileText className="h-4 w-4 mr-1" />
              论文 ({kbData.papers.length})
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white">
              关于
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="papers" className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">论文列表</h2>
              <Button 
                onClick={() => setIsAddPaperOpen(true)}
                className="bg-primary text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                添加论文
              </Button>
            </div>
            
            <div className="space-y-4">
              {kbData.papers.map(paper => (
                <div key={paper.id} className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-white">{paper.title}</h3>
                  <p className="text-gray-400 text-sm mt-1">
                    作者: {paper.authors.join(", ")}
                  </p>
                  <p className="text-gray-400 text-sm">
                    发表日期: {paper.publishDate}
                  </p>
                  <p className="text-gray-300 mt-2">{paper.abstract}</p>
                  <div className="mt-3 flex items-center">
                    {paper.doi && (
                      <span className="text-gray-400 text-sm mr-4">
                        DOI: {paper.doi}
                      </span>
                    )}
                    {paper.url && (
                      <a 
                        href={paper.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm flex items-center"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        查看原文
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="about" className="mt-4">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-white mb-4">关于此知识库</h2>
              <p className="text-gray-300 mb-4">{kbData.description}</p>
              <div className="text-gray-400 text-sm">
                <p>创建于: {kbData.createdAt}</p>
                <p>最后更新: {kbData.updatedAt}</p>
                <p>收藏数: {kbData.stars}</p>
                <p>复制数: {kbData.forks}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* 添加论文对话框 */}
      <Dialog open={isAddPaperOpen} onOpenChange={setIsAddPaperOpen}>
        <DialogContent className="sm:max-w-md bg-[#1e1e1e] text-white">
          <DialogHeader>
            <DialogTitle>添加论文</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">标题</Label>
              <Input
                id="title"
                name="title"
                value={newPaper.title}
                onChange={handleInputChange}
                className="col-span-3 bg-[#2a2a2a] border-gray-700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="authors" className="text-right">作者</Label>
              <Input
                id="authors"
                name="authors"
                value={newPaper.authors}
                onChange={handleInputChange}
                className="col-span-3 bg-[#2a2a2a] border-gray-700"
                placeholder="用逗号分隔多个作者"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="publishDate" className="text-right">发表日期</Label>
              <Input
                id="publishDate"
                name="publishDate"
                value={newPaper.publishDate}
                onChange={handleInputChange}
                className="col-span-3 bg-[#2a2a2a] border-gray-700"
                placeholder="YYYY-MM-DD"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="doi" className="text-right">DOI</Label>
              <Input
                id="doi"
                name="doi"
                value={newPaper.doi}
                onChange={handleInputChange}
                className="col-span-3 bg-[#2a2a2a] border-gray-700"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">URL</Label>
              <Input
                id="url"
                name="url"
                value={newPaper.url}
                onChange={handleInputChange}
                className="col-span-3 bg-[#2a2a2a] border-gray-700"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="abstract" className="text-right pt-2">摘要</Label>
              <Textarea
                id="abstract"
                name="abstract"
                value={newPaper.abstract}
                onChange={handleInputChange}
                className="col-span-3 bg-[#2a2a2a] border-gray-700"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPaperOpen(false)} className="border-gray-700 text-white">
              取消
            </Button>
            <Button onClick={handleAddPaper} className="bg-primary text-white">
              添加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 登录对话框 */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <EmailLoginForm onClose={() => setIsLoginOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KnowledgeBaseDetail; 