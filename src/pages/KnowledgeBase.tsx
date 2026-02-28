import { useState } from "react";
import { motion } from "motion/react";
import { Search, Book, FileText, Video, ChevronRight, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

export default function KnowledgeBase() {
  const [activeTab, setActiveTab] = useState("all");

  const categories = [
    { id: "all", label: "全部资料" },
    { id: "core", label: "核心考点" },
    { id: "notes", label: "学长笔记" },
    { id: "video", label: "视频课程" },
  ];

  const materials = [
    { id: 1, title: "艺术学概论（彭吉象版）核心笔记", type: "notes", icon: FileText, views: "2.4k", saved: true },
    { id: 2, title: "第一章：艺术的本质与特征", type: "core", icon: Book, views: "1.8k", saved: false },
    { id: 3, title: "历年真题名词解释汇总 (2015-2023)", type: "core", icon: Book, views: "3.2k", saved: true },
    { id: 4, title: "王宏建《艺术概论》精讲视频", type: "video", icon: Video, views: "5.6k", saved: false },
    { id: 5, title: "中外美术史常考知识点串讲", type: "video", icon: Video, views: "1.1k", saved: false },
    { id: 6, title: "论述题答题框架与模板", type: "notes", icon: FileText, views: "4.5k", saved: true },
  ];

  const filteredMaterials = activeTab === "all" ? materials : materials.filter(m => m.type === activeTab);

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-semibold text-art-primary">知识资料库</h2>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={18} className="text-art-muted" />
        </div>
        <input
          type="text"
          placeholder="搜索知识点、真题或笔记..."
          className="w-full bg-art-surface border border-art-border rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-art-primary/20 transition-all shadow-sm"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
        {categories.map((cat) => (
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

      {/* Materials List */}
      <div className="flex flex-col gap-4">
        {filteredMaterials.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group flex items-center gap-4 p-4 bg-art-surface rounded-2xl border border-art-border shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className={cn(
              "p-3 rounded-xl",
              item.type === 'video' ? "bg-blue-50 text-blue-600" :
              item.type === 'notes' ? "bg-amber-50 text-amber-600" :
              "bg-emerald-50 text-emerald-600"
            )}>
              <item.icon size={20} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-art-text truncate mb-1 group-hover:text-art-primary transition-colors">
                {item.title}
              </h4>
              <div className="flex items-center gap-3 text-xs text-art-muted">
                <span>{item.views} 浏览</span>
                <span className="w-1 h-1 rounded-full bg-art-border" />
                <span>{item.type === 'video' ? '视频' : item.type === 'notes' ? '笔记' : '文档'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className={cn(
                "p-2 rounded-full transition-colors",
                item.saved ? "text-art-accent bg-art-accent/10" : "text-art-muted hover:bg-art-bg"
              )}>
                <Bookmark size={16} fill={item.saved ? "currentColor" : "none"} />
              </button>
              <ChevronRight size={16} className="text-art-muted group-hover:text-art-primary transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
