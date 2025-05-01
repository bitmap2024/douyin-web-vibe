import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useFollowingList } from "@/lib/api";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";

const Following = () => {
  const { data: followingUsers, isLoading } = useFollowingList();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  
  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#121212]">
      <Header onLoginClick={handleLoginClick} />
      <LeftSidebar />
      <div className="ml-64 mt-16 p-6">
        <h1 className="text-2xl font-bold mb-6 text-white">我关注的用户</h1>
        
        {isLoading ? (
          <div className="text-white">加载中...</div>
        ) : followingUsers && followingUsers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {followingUsers.map((user) => (
              <Link to={`/user/${user.id}`} key={user.id}>
                <Card className="hover:bg-gray-800/30 transition-colors">
                  <CardContent className="p-4 flex items-center">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-lg font-medium text-white">{user.username}</h2>
                      <p className="text-sm text-gray-400">点击查看用户主页</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-white text-center py-8">
            <p>您还没有关注任何用户</p>
            <p className="text-gray-400 text-sm mt-2">关注用户后，他们将显示在这里</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Following; 