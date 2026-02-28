import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Circle, Clock, BookOpen, Flame, ChevronRight, AlertCircle, PlayCircle, PenTool, Award } from "lucide-react";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [checkedIn, setCheckedIn] = useState(false);
  const [streak, setStreak] = useState(12);
  const [points, setPoints] = useState(1250);
  const navigate = useNavigate();
  const today = new Date();

  const handleCheckIn = () => {
    setCheckedIn(true);
    setStreak(prev => prev + 1);
    setPoints(prev => prev + 10);
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Greeting & Date */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-end"
      >
        <div>
          <p className="text-art-muted text-sm font-medium mb-1">
            {format(today, "yyyy年MM月dd日 EEEE", { locale: zhCN })}
          </p>
          <h2 className="text-3xl font-serif font-semibold text-art-primary">
            早安，未来的艺术家
          </h2>
        </div>
        <div className="flex flex-col items-center bg-art-surface px-3 py-2 rounded-2xl shadow-sm border border-art-border">
          <Flame size={20} className="text-orange-500 mb-1" />
          <span className="text-xs font-bold text-art-primary">{streak}天</span>
        </div>
      </motion.div>

      {/* Daily Check-in Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className={cn(
          "relative overflow-hidden rounded-3xl p-6 shadow-lg transition-all duration-500",
          checkedIn ? "bg-art-primary text-white" : "bg-art-surface border border-art-border"
        )}
      >
        <div className="relative z-10 flex flex-col items-center text-center">
          <h3 className={cn("text-xl font-serif font-semibold mb-2", checkedIn ? "text-white" : "text-art-primary")}>
            {checkedIn ? "今日打卡完成" : "今日学习打卡"}
          </h3>
          <p className={cn("text-sm mb-6 flex items-center gap-1", checkedIn ? "text-white/80" : "text-art-muted")}>
            {checkedIn ? (
              <>已获得 <Award size={14} className="text-yellow-400" /> +10 积分</>
            ) : "完成今日学习任务后点击打卡"}
          </p>
          
          <button
            onClick={handleCheckIn}
            disabled={checkedIn}
            className={cn(
              "flex items-center justify-center gap-2 py-3 px-8 rounded-full font-medium transition-all active:scale-95 shadow-md",
              checkedIn 
                ? "bg-white/20 text-white cursor-default" 
                : "bg-art-primary text-white hover:bg-art-primary/90"
            )}
          >
            {checkedIn ? <CheckCircle2 size={20} /> : <Clock size={20} />}
            <span>{checkedIn ? "已打卡" : "立即打卡"}</span>
          </button>
        </div>
        
        {/* Decorative background circle */}
        <div className={cn(
          "absolute -right-10 -bottom-10 w-40 h-40 rounded-full opacity-10 pointer-events-none transition-all duration-1000",
          checkedIn ? "bg-white scale-150" : "bg-art-primary"
        )} />
      </motion.div>

      {/* Quick Access */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 gap-4 mt-2"
      >
        <button 
          onClick={() => navigate('/courses')}
          className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center gap-3 hover:bg-blue-100 transition-colors text-left"
        >
          <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
            <PlayCircle size={20} />
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900">录播课程</h4>
            <p className="text-[10px] text-blue-600/80 mt-0.5">继续观看</p>
          </div>
        </button>
        <button 
          onClick={() => navigate('/exercises')}
          className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex items-center gap-3 hover:bg-orange-100 transition-colors text-left"
        >
          <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
            <PenTool size={20} />
          </div>
          <div>
            <h4 className="text-sm font-medium text-orange-900">课后习题</h4>
            <p className="text-[10px] text-orange-600/80 mt-0.5">2项待完成</p>
          </div>
        </button>
      </motion.div>

      {/* Today's Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-serif font-semibold text-art-primary flex items-center gap-2">
            <BookOpen size={18} />
            今日任务
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => navigate('/courses')}
            className="flex items-center gap-4 p-4 rounded-2xl bg-art-surface border-art-border shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <PlayCircle size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-art-text truncate">
                观看：第三章 艺术的功能
              </p>
              <p className="text-xs text-art-muted mt-1 flex items-center gap-1">
                <Clock size={12} /> 52分钟
              </p>
            </div>
            <ChevronRight size={16} className="text-art-muted" />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => navigate('/exercises')}
            className="flex items-center gap-4 p-4 rounded-2xl bg-art-surface border-art-border shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
              <PenTool size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-art-text truncate">
                完成：第一章课后习题
              </p>
              <p className="text-xs text-art-muted mt-1 flex items-center gap-1">
                <Award size={12} /> +50 积分
              </p>
            </div>
            <ChevronRight size={16} className="text-art-muted" />
          </motion.div>
        </div>
      </motion.div>
      
      {/* Quote of the day */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-4 p-6 rounded-3xl bg-[#F5F2ED] border border-[#EAE5D9] text-center relative overflow-hidden"
      >
        <div className="absolute top-2 left-4 text-4xl text-art-accent/30 font-serif">"</div>
        <p className="font-serif text-art-primary italic relative z-10 text-lg leading-relaxed">
          艺术的伟大意义，基本上在于它能显示人的真正感情、内心生活的奥秘和热情的世界。
        </p>
        <p className="text-xs text-art-secondary mt-3 font-medium tracking-widest uppercase">— 罗曼·罗兰</p>
      </motion.div>
    </div>
  );
}
