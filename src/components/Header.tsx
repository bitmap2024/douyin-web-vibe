import React, { useState } from "react";
import { Search, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HeaderProps {
  onLoginClick?: () => void;
  onSearch?: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onLoginClick = () => {}, 
  onSearch 
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#121212] z-50 flex items-center justify-between px-4 border-b border-gray-800">
      <Link to="/" className="flex items-center space-x-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 48 48" fill="none">
          <path d="M24.8 20.43C25.74 19.55 26.26 18.34 26.26 17C26.26 14.52 24.24 12.5 21.76 12.5C19.28 12.5 17.26 14.52 17.26 17H20.26C20.26 16.17 20.93 15.5 21.76 15.5C22.59 15.5 23.26 16.17 23.26 17C23.26 17.83 22.59 18.5 21.76 18.5H21V21.5H21.76C22.59 21.5 23.26 22.17 23.26 23C23.26 23.83 22.59 24.5 21.76 24.5C20.93 24.5 20.26 23.83 20.26 23H17.26C17.26 25.48 19.28 27.5 21.76 27.5C24.24 27.5 26.26 25.48 26.26 23C26.26 21.86 25.67 20.62 24.8 20.43Z" fill="white"/>
          <rect x="17" y="29" width="10" height="3" fill="white"/>
          <path d="M37.5 28V19C37.5 11.56 31.44 5.5 24 5.5C16.56 5.5 10.5 11.56 10.5 19V28C10.5 35.44 16.56 41.5 24 41.5C31.44 41.5 37.5 35.44 37.5 28ZM33.5 19.17V27.83C33.5 33.23 29.4 37.5 24 37.5C18.6 37.5 14.5 33.23 14.5 27.83V19.17C14.5 13.77 18.6 9.5 24 9.5C29.4 9.5 33.5 13.77 33.5 19.17Z" fill="#00F2EA"/>
        </svg>
        <span className="text-white text-xl font-bold">Spark Hub</span>
      </Link>
      
      <div className="flex-1 max-w-md mx-auto">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input 
            type="text"
            placeholder="搜索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#2a2a2a] rounded-full py-2 pl-4 pr-10 text-white focus:outline-none"
          />
          <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white">
            <Search className="h-5 w-5" />
          </button>
        </form>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-5">
          {/* <Link to="/pricing" className="text-gray-300 text-sm hover:text-white cursor-pointer">定价</Link> */}
          <a href="https://discord.gg/sparkhub" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white flex items-center space-x-1 cursor-pointer">
            <MessageSquare className="h-5 w-5" />
            <span className="text-sm">Discord</span>
          </a>
        </div>
        <Button 
          onClick={onLoginClick}
          className="bg-[#fe2c55] hover:bg-[#fe2c55]/90 text-white rounded-full px-6"
        >
          登录
        </Button>
      </div>
    </header>
  );
};

export default Header;