import { motion } from "motion/react";
import { Trophy, Medal, Award, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Leaderboard() {
  const currentUser = { id: 4, name: "艺术学子", points: 1250, rank: 4, avatar: localStorage.getItem("userAvatar") || "https://picsum.photos/seed/me/100/100", badge: "7-Day Streak" };

  const leaderboard = [
    { id: 1, name: "考研必胜", points: 3420, rank: 1, avatar: "https://picsum.photos/seed/user1/100/100", badge: "Renaissance Expert" },
    { id: 2, name: "追梦的梵高", points: 2890, rank: 2, avatar: "https://picsum.photos/seed/user2/100/100", badge: "Art History Master" },
    { id: 3, name: "美院等我", points: 2100, rank: 3, avatar: "https://picsum.photos/seed/user3/100/100", badge: "Dedicated Scholar" },
    currentUser,
    { id: 5, name: "星夜", points: 1100, rank: 5, avatar: "https://picsum.photos/seed/user5/100/100", badge: "Art History Novice" },
    { id: 6, name: "向日葵", points: 950, rank: 6, avatar: "https://picsum.photos/seed/user6/100/100", badge: "Art History Novice" },
  ];

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-semibold text-art-primary">学习排行榜</h2>
      </div>

      {/* Top 3 Podium */}
      <div className="flex justify-center items-end gap-2 mt-8 mb-6 h-48">
        {[leaderboard[1], leaderboard[0], leaderboard[2]].map((user, i) => {
          const isFirst = i === 1;
          const isSecond = i === 0;
          const isThird = i === 2;
          
          return (
            <motion.div 
              key={user.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isFirst ? 0.3 : isSecond ? 0.4 : 0.5 }}
              className="flex flex-col items-center relative"
            >
              {isFirst && <Trophy size={32} className="text-yellow-500 absolute -top-10 drop-shadow-md" />}
              
              <div className={cn(
                "relative rounded-full overflow-hidden border-4 z-10 bg-art-surface",
                isFirst ? "w-20 h-20 border-yellow-400" : 
                isSecond ? "w-16 h-16 border-slate-300" : 
                "w-16 h-16 border-amber-600"
              )}>
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              
              <div className={cn(
                "w-24 flex flex-col items-center justify-start pt-6 rounded-t-xl -mt-4 border border-b-0 shadow-inner",
                isFirst ? "h-32 bg-gradient-to-t from-yellow-100 to-yellow-50 border-yellow-200" : 
                isSecond ? "h-24 bg-gradient-to-t from-slate-100 to-slate-50 border-slate-200" : 
                "h-20 bg-gradient-to-t from-amber-100 to-amber-50 border-amber-200"
              )}>
                <span className="font-bold text-art-text text-sm truncate w-full text-center px-1">{user.name}</span>
                <span className="text-xs font-medium text-art-primary mt-1">{user.points}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Current User Rank Sticky */}
      <div className="bg-art-primary text-white p-4 rounded-2xl shadow-lg flex items-center justify-between sticky top-20 z-20">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold w-6 text-center">{currentUser.rank}</span>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <h4 className="font-medium">我的排名</h4>
            <p className="text-xs text-white/80 flex items-center gap-1">
              <Flame size={12} className="text-orange-400" /> 距离上一名还差 {leaderboard[2].points - currentUser.points} 分
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-art-accent">{currentUser.points}</span>
          <p className="text-[10px] text-white/70">总积分</p>
        </div>
      </div>

      {/* Rest of Leaderboard */}
      <div className="flex flex-col gap-3 mt-2">
        {leaderboard.slice(3).map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className={cn(
              "flex items-center justify-between p-4 rounded-2xl border transition-all",
              user.id === currentUser.id 
                ? "bg-art-accent/10 border-art-accent/30" 
                : "bg-art-surface border-art-border"
            )}
          >
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold text-art-muted w-6 text-center">{user.rank}</span>
              <div className="w-10 h-10 rounded-full overflow-hidden border border-art-border">
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h4 className="font-medium text-art-text text-sm">{user.name}</h4>
                <p className="text-[10px] text-art-muted flex items-center gap-1 mt-0.5">
                  <Medal size={10} className="text-art-accent" /> {user.badge || "Art History Novice"}
                </p>
              </div>
            </div>
            <span className="font-bold text-art-primary">{user.points}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
