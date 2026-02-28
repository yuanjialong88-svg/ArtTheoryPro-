import { useState } from "react";
import { motion } from "motion/react";
import { PenTool, CheckCircle2, Circle, Clock, Award, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export default function Exercises() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");

  const exercises = [
    { id: 1, title: "第一章课后习题：艺术的本质", type: "名词解释/简答", dueDate: "今天 23:59", points: 50, status: "pending" },
    { id: 2, title: "历年真题演练：艺术的特征", type: "论述题", dueDate: "明天 23:59", points: 100, status: "pending" },
    { id: 3, title: "随堂测验：艺术的起源", type: "选择/填空", dueDate: "已截止", points: 30, status: "completed", score: 28 },
  ];

  const filteredExercises = exercises.filter(e => e.status === activeTab);

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-semibold text-art-primary">课后习题</h2>
        <button 
          onClick={() => navigate('/mistakes')}
          className="text-sm font-medium text-art-accent hover:text-art-primary transition-colors"
        >
          错题本
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-art-surface p-1 rounded-2xl border border-art-border shadow-sm">
        <button
          onClick={() => setActiveTab("pending")}
          className={cn(
            "flex-1 py-2 text-sm font-medium rounded-xl transition-all",
            activeTab === "pending" ? "bg-art-primary text-white shadow-md" : "text-art-muted hover:text-art-text"
          )}
        >
          待完成
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={cn(
            "flex-1 py-2 text-sm font-medium rounded-xl transition-all",
            activeTab === "completed" ? "bg-art-primary text-white shadow-md" : "text-art-muted hover:text-art-text"
          )}
        >
          已完成
        </button>
      </div>

      {/* Exercise List */}
      <div className="flex flex-col gap-4">
        {filteredExercises.length === 0 ? (
          <div className="text-center py-10 text-art-muted">
            <CheckCircle2 size={48} className="mx-auto mb-3 opacity-20" />
            <p>太棒了！所有习题都已完成。</p>
          </div>
        ) : (
          filteredExercises.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-art-surface p-5 rounded-2xl border border-art-border shadow-sm hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] px-2 py-1 rounded-md border font-medium bg-orange-50 text-orange-700 border-orange-100">
                  {exercise.type}
                </span>
                {exercise.status === 'completed' ? (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    得分: {exercise.score}/{exercise.points}
                  </span>
                ) : (
                  <span className="text-xs font-medium text-art-accent flex items-center gap-1">
                    <Award size={14} /> +{exercise.points} 积分
                  </span>
                )}
              </div>
              
              <h4 className="font-medium text-art-text mb-3 group-hover:text-art-primary transition-colors">
                {exercise.title}
              </h4>
              
              <div className="flex justify-between items-center pt-3 border-t border-art-border/50">
                <span className={cn(
                  "text-xs flex items-center gap-1",
                  exercise.status === 'completed' ? "text-art-muted" : "text-rose-500 font-medium"
                )}>
                  <Clock size={12} /> {exercise.status === 'completed' ? '已提交' : `截止: ${exercise.dueDate}`}
                </span>
                <button className={cn(
                  "flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full transition-colors",
                  exercise.status === 'completed' 
                    ? "bg-art-bg text-art-muted hover:text-art-primary" 
                    : "bg-art-primary text-white hover:bg-art-primary/90"
                )}>
                  {exercise.status === 'completed' ? '查看解析' : '去完成'}
                  <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
