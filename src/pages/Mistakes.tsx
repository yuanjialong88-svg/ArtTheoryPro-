import { useState } from "react";
import { motion } from "motion/react";
import { AlertCircle, Clock, ChevronRight, Filter, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Mistakes() {
  const [filter, setFilter] = useState("all");

  const mistakes = [
    { id: 1, question: "简述艺术的审美特征。", type: "简答题", date: "2023-10-15", status: "need_review", ebbinghaus: "第3次复习 (7天)", errorRate: "高频" },
    { id: 2, question: "名词解释：意境", type: "名词解释", date: "2023-10-12", status: "reviewed", ebbinghaus: "第4次复习 (15天)", errorRate: "中频" },
    { id: 3, question: "论述艺术与道德的关系。", type: "论述题", date: "2023-10-10", status: "need_review", ebbinghaus: "第2次复习 (2天)", errorRate: "高频" },
    { id: 4, question: "名词解释：艺术流派", type: "名词解释", date: "2023-10-08", status: "reviewed", ebbinghaus: "第5次复习 (30天)", errorRate: "低频" },
  ];

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-semibold text-art-primary">错题与记忆曲线</h2>
        <button className="p-2 bg-art-surface border border-art-border text-art-primary rounded-full shadow-sm hover:bg-art-bg transition-colors">
          <Filter size={18} />
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-art-surface p-4 rounded-3xl border border-art-border shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-serif font-bold text-art-accent mb-1">24</span>
          <span className="text-xs text-art-muted font-medium">待复习错题</span>
        </div>
        <div className="bg-art-primary p-4 rounded-3xl shadow-md flex flex-col items-center justify-center text-center text-white">
          <span className="text-3xl font-serif font-bold mb-1">128</span>
          <span className="text-xs text-white/80 font-medium">累计收录错题</span>
        </div>
      </div>

      {/* Review Reminder */}
      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex items-start gap-3">
        <BrainCircuit className="text-orange-500 shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="text-sm font-medium text-orange-800 mb-1">艾宾浩斯记忆曲线提醒</h4>
          <p className="text-xs text-orange-600/80 leading-relaxed">
            系统已根据遗忘曲线为您安排了今日的复习任务。有 2 道高频错题已达到复习临界点，请及时巩固。
          </p>
          <button className="mt-3 text-xs font-medium bg-orange-500 text-white px-4 py-1.5 rounded-full hover:bg-orange-600 transition-colors">
            开始智能复习
          </button>
        </div>
      </div>

      {/* Mistake List */}
      <div className="flex flex-col gap-4 mt-2">
        <h3 className="text-lg font-serif font-semibold text-art-primary mb-1">专属错题本</h3>
        
        {mistakes.map((mistake, index) => (
          <motion.div
            key={mistake.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-art-surface p-4 rounded-2xl border border-art-border shadow-sm hover:shadow-md transition-all group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-3">
              <span className={cn(
                "text-[10px] px-2 py-1 rounded-md border font-medium",
                mistake.type === '名词解释' ? "bg-blue-50 text-blue-700 border-blue-100" :
                mistake.type === '简答题' ? "bg-purple-50 text-purple-700 border-purple-100" :
                "bg-rose-50 text-rose-700 border-rose-100"
              )}>
                {mistake.type}
              </span>
              <div className="flex items-center gap-2 text-xs">
                <span className={cn(
                  "flex items-center gap-1 font-medium",
                  mistake.status === 'need_review' ? "text-orange-500" : "text-emerald-500"
                )}>
                  <Clock size={12} />
                  {mistake.ebbinghaus}
                </span>
              </div>
            </div>
            
            <h4 className="font-medium text-art-text mb-3 line-clamp-2 leading-relaxed group-hover:text-art-primary transition-colors">
              {mistake.question}
            </h4>
            
            <div className="flex justify-between items-center pt-3 border-t border-art-border/50">
              <span className="text-xs text-art-muted">{mistake.date} 加入</span>
              <div className="flex items-center gap-1 text-art-muted group-hover:text-art-primary transition-colors">
                <span className="text-xs font-medium">查看解析与AI辅导</span>
                <ChevronRight size={14} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
