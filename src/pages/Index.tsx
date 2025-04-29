
import React from "react";
import VideoFeed from "@/components/VideoFeed";
import SideNav from "@/components/SideNav";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-screen-md mx-auto relative">
        <VideoFeed />
        <SideNav />
      </div>
    </div>
  );
};

export default Index;
