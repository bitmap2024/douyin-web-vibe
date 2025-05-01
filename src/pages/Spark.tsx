import React, { useState } from "react";
import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, Import, Globe, ChevronUp } from "lucide-react";

// 模拟项目类型
interface ProjectType {
  id: string;
  icon: string;
  title: string;
}

const Spark: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };
  
  // 模拟项目类型数据
  const projectTypes: ProjectType[] = [
    { id: "weather", icon: "⏱️", title: "知识探索" },
    { id: "habit", icon: "📅", title: "论文分析" },
    { id: "website", icon: "🖥️", title: "个人知识库" },
    { id: "editor", icon: "📝", title: "研究笔记" },
  ];
  
  return (
    <div className="min-h-screen bg-[#121212]">
      <Header onLoginClick={handleLoginClick} />
      <LeftSidebar />
      
      {/* 主体内容区域 */}
      <div className="ml-64 mt-16 min-h-[calc(100vh-4rem)] bg-gradient-to-b from-[#1a2336] via-[#2a2b59] to-[#b9366c] p-8 flex flex-col items-center">
        <div className="max-w-4xl w-full mx-auto text-center mt-16 mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            创建知识库 <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-blue-500">♥ Spark</span>
          </h1>
          <p className="text-xl text-white/80 mb-16">
            从想法到知识库，与您的个人AI助手一起探索学术前沿
          </p>
          
          {/* 搜索框 */}
          <div className="relative w-full mb-16 bg-[#1e1e1e]/80 rounded-xl p-1 border border-gray-800 shadow-xl">
            <div className="p-4 text-left">
              <textarea
                placeholder="开始创建知识库，描述您的研究领域、兴趣或想法..."
                className="w-full bg-transparent text-white border-none focus:outline-none text-lg min-h-[140px] resize-none"
              />
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-lg border-gray-700 text-gray-300">
                    <Paperclip size={16} />
                    <span>附件</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2 rounded-lg border-gray-700 text-gray-300">
                    <Import size={16} />
                    <span>导入数据</span>
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 text-gray-400">
                    <Globe size={16} />
                    <span>公开</span>
                  </Button>
                  <Button variant="default" className="bg-gradient-to-r from-blue-600 to-pink-600 text-white rounded-lg px-6">
                    创建
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* 模板选择 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full mt-4">
            {projectTypes.map((type) => (
              <Button
                key={type.id}
                variant="outline"
                className="flex flex-col items-center justify-center h-24 bg-[#1e1e1e]/50 border-gray-700 hover:bg-[#1e1e1e]/80 rounded-xl"
              >
                <span className="text-2xl mb-2">{type.icon}</span>
                <span className="text-white">{type.title}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Spark; 