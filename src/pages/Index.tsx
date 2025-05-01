import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface IndexProps {
  openLogin: () => void;
}

const Index: React.FC<IndexProps> = ({ openLogin }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // 自动重定向到推荐页面
    navigate("/recommend");
  }, [navigate]);
  
  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center">
      <div className="text-white">加载中...</div>
    </div>
  );
};

export default Index;
