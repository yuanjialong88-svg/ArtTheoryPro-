import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { User, Settings, LogOut, ChevronRight, Award, BookOpen, Clock, Camera, Medal, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Profile() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedAvatar = localStorage.getItem("userAvatar");
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userAvatar");
    navigate("/auth");
  };

  const menuItems = [
    { icon: BookOpen, label: "我的资料库", value: "已收藏 24 份", onClick: () => navigate('/knowledge') },
    { icon: Clock, label: "学习历史", value: "累计 128 小时", onClick: () => {} },
    { icon: Settings, label: "系统设置", value: "", onClick: () => {} },
  ];

  const badges = [
    { id: 1, name: "Art History Novice", icon: Medal, color: "text-slate-500", bg: "bg-slate-100" },
    { id: 2, name: "Renaissance Expert", icon: Trophy, color: "text-yellow-600", bg: "bg-yellow-100" },
    { id: 3, name: "7-Day Streak", icon: Award, color: "text-orange-500", bg: "bg-orange-100" },
  ];

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-semibold text-art-primary">个人中心</h2>
      </div>

      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-art-surface p-6 rounded-3xl border border-art-border shadow-sm flex flex-col gap-4"
      >
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-art-primary/20 bg-art-bg flex items-center justify-center">
              {avatar ? (
                <img src={avatar} alt="User Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={32} className="text-art-muted" />
              )}
            </div>
            <button 
              onClick={() => navigate('/auth')}
              className="absolute bottom-0 right-0 p-1.5 bg-art-primary text-white rounded-full shadow-md hover:bg-art-primary/90 transition-colors"
            >
              <Camera size={12} />
            </button>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-serif font-semibold text-art-text mb-1">艺术学子</h3>
            <p className="text-xs text-art-muted mb-2">"艺术是情感的客观化。"</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-art-accent/10 text-art-accent px-2 py-1 rounded-md font-medium border border-art-accent/20">
                积分: 1250
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md font-medium border border-emerald-100">
                排名: 4
              </span>
            </div>
          </div>
        </div>

        {/* Learning Progress */}
        <div className="mt-2 pt-4 border-t border-art-border/50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-art-text">总体学习进度</span>
            <span className="text-xs font-bold text-art-primary">68%</span>
          </div>
          <div className="w-full h-2 bg-art-bg rounded-full overflow-hidden">
            <div className="h-full bg-art-primary rounded-full" style={{ width: '68%' }} />
          </div>
        </div>
      </motion.div>

      {/* Badges Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-lg font-serif font-semibold text-art-primary mb-3">我的成就</h3>
        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge, index) => (
            <div key={badge.id} className="bg-art-surface p-3 rounded-2xl border border-art-border shadow-sm flex flex-col items-center text-center gap-2">
              <div className={cn("p-3 rounded-full", badge.bg, badge.color)}>
                <badge.icon size={24} />
              </div>
              <span className="text-[10px] font-medium text-art-text leading-tight">{badge.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Menu List */}
      <div className="flex flex-col gap-3">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            onClick={item.onClick}
            className="bg-art-surface p-4 rounded-2xl border border-art-border shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-art-bg rounded-xl text-art-primary group-hover:bg-art-primary group-hover:text-white transition-colors">
                <item.icon size={20} />
              </div>
              <span className="font-medium text-art-text">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.value && <span className="text-xs text-art-muted">{item.value}</span>}
              <ChevronRight size={16} className="text-art-muted group-hover:text-art-primary transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Logout Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        onClick={handleLogout}
        className="mt-4 flex items-center justify-center gap-2 bg-rose-50 text-rose-600 border border-rose-100 py-4 rounded-2xl font-medium hover:bg-rose-100 transition-all active:scale-95"
      >
        <LogOut size={20} />
        <span>退出登录</span>
      </motion.button>
    </div>
  );
}
