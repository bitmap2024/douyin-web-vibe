
import React from "react";
import VideoFeed from "@/components/VideoFeed";
import LeftSidebar from "@/components/LeftSidebar";
import Header from "@/components/Header";
import VideoControls from "@/components/VideoControls";

interface IndexProps {
  openLogin: () => void;
}

const Index: React.FC<IndexProps> = ({ openLogin }) => {
  return (
    <div className="min-h-screen bg-[#121212]">
      <Header />
      <div className="flex">
        <LeftSidebar />
        <div className="flex-1">
          <VideoFeed />
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-transparent">
        <VideoControls />
      </div>
    </div>
  );
};

export default Index;
