import React from "react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { useCurrentUser } from "@/lib/api";

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

// 检查用户是否为管理员的函数
const isUserAdmin = (user: any): boolean => {
  // 检查user是否存在，并且is_superuser属性为true
  return !!user && (user.is_superuser === true);
};

const LeftSidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: currentUser } = useCurrentUser();
  const isAdmin = isUserAdmin(currentUser);

  // 获取当前路径并确定活动标签
  const getActiveTab = () => {
    const path = location.pathname;
    if (path.includes("/following")) return "following";
    if (path.includes("/friends")) return "friends";
    if (path.includes("/user/me")) return "profile";
    if (path.includes("/trending")) return "trending";
    if (path.includes("/featured")) return "featured";
    if (path.includes("/spark")) return "spark";
    if (path.includes("/community/manage")) return "community-manage";
    if (path.includes("/community")) return "community";
    // 默认为推荐
    return "recommend";
  };

  const [activeTab, setActiveTab] = React.useState(getActiveTab());

  // 当路由变化时更新activeTab
  React.useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location]);

  const NavItemsList = [
    { icon: "✨", label: "Spark", id: "spark" },
    { icon: "🔎", label: "精选", id: "featured" },
    { icon: "👍", label: "推荐", id: "recommend" },
    { icon: "📈", label: "趋势", id: "trending" },
    { icon: "👥", label: "朋友", id: "friends" },
    { icon: "👤", label: "关注", id: "following" },
    { icon: "💬", label: "社区", id: "community" },
    ...(isAdmin ? [{ icon: "🛠️", label: "社区管理", id: "community-manage" }] : []),
    { icon: "👤", label: "我的", id: "profile" },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    
    // 根据不同的导航项执行不同的操作
    switch (id) {
      case "following":
        navigate("/following");
        break;
      case "friends":
        navigate("/friends");
        break;
      case "profile":
        navigate("/user/me");
        break;
      case "trending":
        navigate("/trending");
        break;
      case "recommend":
        navigate("/recommend");
        break;
      case "featured":
        navigate("/featured");
        break;
      case "spark":
        navigate("/spark");
        break;
      case "community":
        navigate("/community");
        break;
      case "community-manage":
        navigate("/community/manage");
        break;
      // 其他导航项的处理可以在这里添加
      default:
        // 默认行为，可以留空或添加其他逻辑
        break;
    }
  };

  return (
    <div className="fixed left-0 top-16 bottom-0 w-64 bg-[#121212] border-r border-gray-800 overflow-y-auto pt-4 pb-20 z-40">
      {NavItemsList.map((item) => (
        <NavItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          isActive={activeTab === item.id}
          onClick={() => handleNavClick(item.id)}
        />
      ))}
    </div>
  );
};

export default LeftSidebar;
