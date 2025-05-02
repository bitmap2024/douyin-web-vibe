
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import { useCurrentUser } from "@/lib/api";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import EmailLoginForm from "@/components/EmailLoginForm";

const LikedVideos = () => {
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { data: currentUser, isLoading } = useCurrentUser();
  
  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-white">加载中...</div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#121212] flex">
        <Header onLoginClick={handleLoginClick} />
        <LeftSidebar />
        <div className="flex-1 ml-64 mt-16 flex flex-col items-center justify-center text-white">
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="mt-6 text-2xl font-bold">请登录查看</h2>
            <p className="mt-2 text-gray-400">登录后才能查看你喜欢的视频</p>
            <button 
              onClick={handleLoginClick}
              className="mt-6 bg-[#fe2c55] text-white px-8 py-3 rounded-full hover:bg-[#fe2c55]/90 transition"
            >
              立即登录
            </button>
          </div>
        </div>
        
        <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
          <DialogContent className="sm:max-w-md">
            <EmailLoginForm onClose={() => setIsLoginOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212]">
      <Header onLoginClick={handleLoginClick} />
      <LeftSidebar />
      <div className="ml-64 mt-16 p-8">
        <h1 className="text-2xl font-bold text-white mb-6">我喜欢的视频</h1>
        
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <svg width="64" height="64" fill="none" viewBox="0 0 48 48">
            <rect width="48" height="48" rx="24" fill="#232526"/>
            <path d="M24 16v8m0 0v4m0-4h4m-4 0h-4" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="12" y="28" width="24" height="8" rx="2" fill="#232526" stroke="#666" strokeWidth="2"/>
          </svg>
          <p className="mt-4">暂无喜欢的视频</p>
        </div>
      </div>
    </div>
  );
};

export default LikedVideos;
