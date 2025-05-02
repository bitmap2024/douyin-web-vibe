import React, { useState } from "react";
import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import EmailLoginForm from "@/components/EmailLoginForm";
import KnowledgeBaseVideoFeed from "@/components/KnowledgeBaseVideoFeed";

const Friends: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };
  
  return (
    <div className="min-h-screen bg-[#121212]">
      <Header onLoginClick={handleLoginClick} />
      <LeftSidebar />
      
      {/* 主体内容区域，右侧主区域布局 */}
      <div className="ml-64 mt-16">
        <KnowledgeBaseVideoFeed sourceType="friends" />
      </div>
      
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <EmailLoginForm onClose={() => setIsLoginOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Friends; 