
import React from "react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  count?: number;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick, count }) => {
  return (
    <button
      className={cn(
        "flex items-center px-6 py-4 w-full rounded-lg",
        isActive ? "bg-gray-800/50" : "hover:bg-gray-800/30"
      )}
      onClick={onClick}
    >
      <div className="mr-3 text-xl">{icon}</div>
      <span className={cn("text-base", isActive ? "text-white" : "text-gray-400")}>
        {label}
      </span>
      {count !== undefined && (
        <span className="ml-2 text-gray-400">{count}</span>
      )}
    </button>
  );
};

const LeftSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("recommend");

  const NavItemsList = [
    { icon: "🔎", label: "精选", id: "featured" },
    { icon: "👍", label: "推荐", id: "recommend" },
    { icon: "👤", label: "关注", id: "following" },
    { icon: "👥", label: "朋友", id: "friends" },
    { icon: "👤", label: "我的", id: "profile" },
    { icon: "💰", label: "定价", id: "pricing" },
    { icon: "📺", label: "直播", id: "live" },
    { icon: "🎬", label: "放映厅", id: "theater" },
    { icon: "🎭", label: "短剧", id: "drama" },
  ];

  return (
    <div className="fixed left-0 top-16 bottom-0 w-64 bg-[#121212] border-r border-gray-800 overflow-y-auto pt-4 pb-20 z-40">
      {NavItemsList.map((item) => (
        <NavItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          isActive={activeTab === item.id}
          onClick={() => setActiveTab(item.id)}
        />
      ))}
    </div>
  );
};

export default LeftSidebar;
