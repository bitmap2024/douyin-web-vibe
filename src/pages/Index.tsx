
import React from "react";
import VideoFeed from "@/components/VideoFeed";
import SideNav from "@/components/SideNav";

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <VideoFeed />
      <SideNav />
    </div>
  );
};

export default Index;
