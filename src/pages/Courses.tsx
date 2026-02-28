import { useState } from "react";
import { motion } from "motion/react";
import { PlayCircle, Clock, CheckCircle2, ChevronRight, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Courses() {
  const [activeTab, setActiveTab] = useState("all");
  const [playingCourse, setPlayingCourse] = useState<number | null>(null);

  const courses = [
    { id: 1, title: "第一章：艺术的本质与特征", duration: "45:20", progress: 100, locked: false, type: "core" },
    { id: 2, title: "第二章：艺术的起源", duration: "38:15", progress: 60, locked: false, type: "core" },
    { id: 3, title: "第三章：艺术的功能与艺术教育", duration: "52:10", progress: 0, locked: false, type: "core" },
    { id: 4, title: "第四章：文化系统中的艺术", duration: "41:30", progress: 0, locked: true, type: "core" },
    { id: 5, title: "论述题高分答题技巧串讲", duration: "65:00", progress: 0, locked: false, type: "advanced" },
  ];

  const filteredCourses = activeTab === "all" ? courses : courses.filter(c => c.type === activeTab);

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-semibold text-art-primary">录播课程</h2>
      </div>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
        {[
          { id: "all", label: "全部课程" },
          { id: "core", label: "基础精讲" },
          { id: "advanced", label: "冲刺拔高" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={cn(
              "whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all",
              activeTab === cat.id
                ? "bg-art-primary text-white shadow-md"
                : "bg-art-surface border border-art-border text-art-muted hover:text-art-primary"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Course List */}
      <div className="flex flex-col gap-4">
        {filteredCourses.map((course, index) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => !course.locked && setPlayingCourse(course.id)}
            className={cn(
              "group flex flex-col gap-3 p-4 rounded-2xl border shadow-sm transition-all",
              course.locked ? "bg-art-bg/50 border-art-border/50 opacity-75" : "bg-art-surface border-art-border hover:shadow-md cursor-pointer"
            )}
          >
            {playingCourse === course.id ? (
              <div className="w-full rounded-xl overflow-hidden bg-black mb-2 relative">
                <video 
                  src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" 
                  controls 
                  autoPlay 
                  className="w-full aspect-video object-contain"
                />
                <button 
                  onClick={(e) => { e.stopPropagation(); setPlayingCourse(null); }}
                  className="absolute top-2 right-2 bg-black/50 text-white px-3 py-1 rounded-full text-xs hover:bg-black/70 transition-colors"
                >
                  收起
                </button>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-art-border shrink-0">
                  <img src={`https://picsum.photos/seed/course${course.id}/200/150`} alt="Course thumbnail" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    {course.locked ? <Lock size={20} className="text-white/80" /> : <PlayCircle size={24} className="text-white/90" />}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-art-text mb-1 line-clamp-2 leading-snug group-hover:text-art-primary transition-colors">
                    {course.title}
                  </h4>
                  <div className="flex items-center gap-3 text-xs text-art-muted">
                    <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Bar */}
            {!course.locked && (
              <div className="flex items-center gap-3 mt-1">
                <div className="flex-1 h-1.5 bg-art-bg rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full transition-all duration-500", course.progress === 100 ? "bg-emerald-500" : "bg-art-accent")}
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
                <span className="text-[10px] font-medium text-art-muted w-8 text-right">
                  {course.progress}%
                </span>
                {course.progress === 100 && <CheckCircle2 size={14} className="text-emerald-500" />}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
