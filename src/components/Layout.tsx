import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Home, PlayCircle, PenTool, Trophy, User, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Layout() {
  const navigate = useNavigate();
  const navItems = [
    { to: "/", icon: Home, label: "首页" },
    { to: "/courses", icon: PlayCircle, label: "课程" },
    { to: "/exercises", icon: PenTool, label: "习题" },
    { to: "/leaderboard", icon: Trophy, label: "排行" },
    { to: "/profile", icon: User, label: "我的" },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-art-bg shadow-2xl relative overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-art-surface/80 backdrop-blur-md z-10 sticky top-0 border-b border-art-border">
        <h1 className="text-2xl font-serif font-semibold text-art-primary tracking-wide">
          ArtTheory<span className="text-art-accent italic">Pro</span>
        </h1>
        <NavLink to="/profile" className="p-2 rounded-full bg-art-bg border border-art-border text-art-primary hover:bg-art-primary hover:text-white transition-colors">
          <User size={20} />
        </NavLink>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
        <Outlet />
      </main>

      {/* AI Tutor FAB */}
      <button 
        onClick={() => navigate('/ai-tutor')}
        className="absolute bottom-24 right-6 w-14 h-14 bg-art-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-art-primary/90 transition-all active:scale-95 z-30 border-4 border-art-surface"
      >
        <MessageCircle size={24} />
      </button>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full bg-art-surface border-t border-art-border px-6 py-3 pb-safe flex justify-between items-center z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] rounded-t-3xl">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300",
                isActive 
                  ? "text-art-primary scale-110" 
                  : "text-art-muted hover:text-art-secondary"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                <span className={cn("text-[10px] font-medium transition-all", isActive ? "opacity-100" : "opacity-0 h-0")}>
                  {item.label}
                </span>
                {isActive && (
                  <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-art-primary" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
