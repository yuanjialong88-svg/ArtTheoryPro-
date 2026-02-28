import { useState } from "react";
import { motion } from "motion/react";
import { Calendar as CalendarIcon, Plus, MoreVertical, CheckCircle2, Circle } from "lucide-react";
import { format, addDays, startOfWeek } from "date-fns";
import { zhCN } from "date-fns/locale";
import { cn } from "@/lib/utils";

export default function Plan() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Generate week days
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  const plans = [
    { id: 1, time: "08:00 - 09:30", title: "艺术本质论复习", type: "review", completed: true },
    { id: 2, time: "10:00 - 11:30", title: "艺术门类精读", type: "read", completed: false },
    { id: 3, time: "14:00 - 16:00", title: "历年真题演练 (2021-2022)", type: "practice", completed: false },
    { id: 4, time: "19:30 - 21:00", title: "错题整理与背诵", type: "review", completed: false },
  ];

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'review': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'read': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'practice': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'review': return '复习';
      case 'read': return '阅读';
      case 'practice': return '练习';
      default: return '其他';
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-semibold text-art-primary">学习计划</h2>
        <button className="p-2 bg-art-primary text-white rounded-full shadow-md hover:bg-art-primary/90 transition-colors">
          <Plus size={20} />
        </button>
      </div>

      {/* Calendar Strip */}
      <div className="bg-art-surface rounded-3xl p-4 shadow-sm border border-art-border">
        <div className="flex justify-between items-center mb-4 px-2">
          <span className="font-medium text-art-primary">
            {format(selectedDate, "yyyy年MM月", { locale: zhCN })}
          </span>
          <CalendarIcon size={18} className="text-art-muted" />
        </div>
        <div className="flex justify-between">
          {weekDays.map((day, i) => {
            const isSelected = day.getDate() === selectedDate.getDate();
            const isToday = day.getDate() === new Date().getDate();
            
            return (
              <button
                key={i}
                onClick={() => setSelectedDate(day)}
                className={cn(
                  "flex flex-col items-center justify-center w-10 h-14 rounded-2xl transition-all",
                  isSelected 
                    ? "bg-art-primary text-white shadow-md" 
                    : "hover:bg-art-bg text-art-text"
                )}
              >
                <span className={cn("text-[10px] mb-1", isSelected ? "text-white/80" : "text-art-muted")}>
                  {format(day, "E", { locale: zhCN })}
                </span>
                <span className={cn("text-sm font-semibold", isToday && !isSelected && "text-art-accent")}>
                  {format(day, "d")}
                </span>
                {isToday && <div className={cn("w-1 h-1 rounded-full mt-1", isSelected ? "bg-white" : "bg-art-accent")} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div className="mt-2 relative">
        <div className="absolute left-[27px] top-4 bottom-4 w-px bg-art-border" />
        
        <div className="flex flex-col gap-6">
          {plans.map((plan, index) => (
            <motion.div 
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4 relative"
            >
              <div className="flex flex-col items-center mt-1">
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 z-10 bg-art-surface",
                  plan.completed ? "border-art-secondary" : "border-art-primary"
                )}>
                  {plan.completed && <div className="w-full h-full bg-art-secondary rounded-full scale-50" />}
                </div>
              </div>
              
              <div className={cn(
                "flex-1 bg-art-surface p-4 rounded-2xl border shadow-sm transition-all",
                plan.completed ? "opacity-70 border-art-border" : "border-art-border hover:shadow-md"
              )}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-art-muted tracking-wider">{plan.time}</span>
                  <button className="text-art-muted hover:text-art-primary">
                    <MoreVertical size={16} />
                  </button>
                </div>
                <h4 className={cn(
                  "font-medium mb-3",
                  plan.completed ? "line-through text-art-muted" : "text-art-text"
                )}>
                  {plan.title}
                </h4>
                <div className="flex justify-between items-center">
                  <span className={cn("text-[10px] px-2 py-1 rounded-md border", getTypeColor(plan.type))}>
                    {getTypeLabel(plan.type)}
                  </span>
                  <button className={cn(
                    "transition-colors",
                    plan.completed ? "text-art-secondary" : "text-art-muted hover:text-art-primary"
                  )}>
                    {plan.completed ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
