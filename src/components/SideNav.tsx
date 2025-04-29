
import React from "react";
import { Home, Search, Plus, User, Music } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive, onClick }) => {
  return (
    <button
      className={cn(
        "flex flex-col items-center justify-center py-2 w-full",
        isActive ? "text-primary" : "text-muted-foreground"
      )}
      onClick={onClick}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
};

const SideNav: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState("home");

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex justify-around">
        <NavItem
          icon={<Home className="h-5 w-5" />}
          label="首页"
          isActive={activeTab === "home"}
          onClick={() => setActiveTab("home")}
        />
        <NavItem
          icon={<Search className="h-5 w-5" />}
          label="发现"
          isActive={activeTab === "discover"}
          onClick={() => setActiveTab("discover")}
        />
        <NavItem
          icon={
            <div className="bg-primary rounded-lg p-1">
              <Plus className="h-4 w-4 text-white" />
            </div>
          }
          label=""
          onClick={() => {}}
        />
        <NavItem
          icon={<Music className="h-5 w-5" />}
          label="消息"
          isActive={activeTab === "inbox"}
          onClick={() => setActiveTab("inbox")}
        />
        <NavItem
          icon={<User className="h-5 w-5" />}
          label="我"
          isActive={activeTab === "profile"}
          onClick={() => setActiveTab("profile")}
        />
      </div>
    </div>
  );
};

export default SideNav;
