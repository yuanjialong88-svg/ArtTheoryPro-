import { motion } from "motion/react";
import { MessageSquare, Heart, Share2, Edit3, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Community() {
  const posts = [
    {
      id: 1,
      author: "艺考上岸人",
      avatar: "https://picsum.photos/seed/art1/100/100",
      time: "2小时前",
      content: "今天终于把艺术门类这一章啃下来了！大家觉得最难背的是哪一部分？我觉得实用艺术的特征真的很容易混淆...",
      likes: 128,
      comments: 45,
      tags: ["打卡", "艺术门类"],
      image: "https://picsum.photos/seed/study/400/300"
    },
    {
      id: 2,
      author: "追梦的梵高",
      avatar: "https://picsum.photos/seed/art2/100/100",
      time: "5小时前",
      content: "分享一个整理好的艺术本质论思维导图，希望能帮到大家！考研路上一起加油💪",
      likes: 356,
      comments: 89,
      tags: ["资料分享", "思维导图"],
      image: null
    },
    {
      id: 3,
      author: "美院等我",
      avatar: "https://picsum.photos/seed/art3/100/100",
      time: "昨天",
      content: "求助：论述题总是写不长怎么办？感觉知识点都背了，但是一到写论述就词穷，有没有什么好的答题框架推荐？",
      likes: 42,
      comments: 112,
      tags: ["答疑", "论述题"],
      image: null
    }
  ];

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-semibold text-art-primary">交流社区</h2>
        <button className="p-2 bg-art-primary text-white rounded-full shadow-md hover:bg-art-primary/90 transition-colors">
          <Edit3 size={20} />
        </button>
      </div>

      {/* Trending Tags */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
        {["# 每日打卡", "# 资料分享", "# 答疑解惑", "# 考研经验", "# 院校资讯"].map((tag, i) => (
          <button
            key={i}
            className="whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium bg-art-surface border border-art-border text-art-primary hover:bg-art-bg transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Posts Feed */}
      <div className="flex flex-col gap-5">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-art-surface p-5 rounded-3xl border border-art-border shadow-sm"
          >
            {/* Author Info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-art-border">
                <img src={post.avatar} alt={post.author} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <h4 className="font-medium text-sm text-art-text">{post.author}</h4>
                <p className="text-[10px] text-art-muted">{post.time}</p>
              </div>
            </div>

            {/* Content */}
            <p className="text-sm text-art-text leading-relaxed mb-3">
              {post.content}
            </p>

            {/* Optional Image */}
            {post.image && (
              <div className="w-full h-48 rounded-2xl overflow-hidden mb-3 border border-art-border">
                <img src={post.image} alt="Post content" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            )}

            {/* Tags */}
            <div className="flex gap-2 mb-4">
              {post.tags.map(tag => (
                <span key={tag} className="text-[10px] text-art-accent bg-art-accent/10 px-2 py-1 rounded-md font-medium">
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-art-border/50 text-art-muted">
              <button className="flex items-center gap-1.5 hover:text-rose-500 transition-colors">
                <Heart size={18} />
                <span className="text-xs font-medium">{post.likes}</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-art-primary transition-colors">
                <MessageSquare size={18} />
                <span className="text-xs font-medium">{post.comments}</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-art-primary transition-colors">
                <Share2 size={18} />
                <span className="text-xs font-medium">分享</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
