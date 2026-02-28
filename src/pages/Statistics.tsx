import { motion } from "motion/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, Clock, Target, Award } from "lucide-react";

export default function Statistics() {
  const studyData = [
    { name: "周一", hours: 2.5 },
    { name: "周二", hours: 3.8 },
    { name: "周三", hours: 4.2 },
    { name: "周四", hours: 3.1 },
    { name: "周五", hours: 5.0 },
    { name: "周六", hours: 6.5 },
    { name: "周日", hours: 4.8 },
  ];

  const scoreData = [
    { month: "7月", score: 65 },
    { month: "8月", score: 72 },
    { month: "9月", score: 85 },
    { month: "10月", score: 92 },
  ];

  return (
    <div className="flex flex-col gap-6 pb-20">
      <h2 className="text-2xl font-serif font-semibold text-art-primary">学习数据</h2>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-art-surface p-4 rounded-3xl border border-art-border shadow-sm flex flex-col gap-2"
        >
          <div className="flex items-center gap-2 text-art-muted mb-1">
            <Clock size={16} />
            <span className="text-xs font-medium">累计学习</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-serif font-bold text-art-primary">128</span>
            <span className="text-sm text-art-muted">小时</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-art-surface p-4 rounded-3xl border border-art-border shadow-sm flex flex-col gap-2"
        >
          <div className="flex items-center gap-2 text-art-muted mb-1">
            <Target size={16} />
            <span className="text-xs font-medium">计划完成率</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-serif font-bold text-art-primary">85</span>
            <span className="text-sm text-art-muted">%</span>
          </div>
        </motion.div>
      </div>

      {/* Weekly Study Hours Chart */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-art-surface p-5 rounded-3xl border border-art-border shadow-sm"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-serif font-semibold text-art-primary">本周学习时长</h3>
          <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md flex items-center gap-1 font-medium">
            <TrendingUp size={12} /> +12%
          </span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={studyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5DF" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#8E8E8E' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#8E8E8E' }} 
              />
              <Tooltip 
                cursor={{ fill: '#fdfbf7' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
              />
              <Bar dataKey="hours" fill="#5A5A40" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Mock Exam Score Trend */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-art-surface p-5 rounded-3xl border border-art-border shadow-sm"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-serif font-semibold text-art-primary">模考成绩趋势</h3>
          <Award size={18} className="text-art-accent" />
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scoreData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E5DF" />
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#8E8E8E' }} 
                dy={10}
              />
              <YAxis 
                domain={[0, 100]} 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#8E8E8E' }} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#C4A484" 
                strokeWidth={3}
                dot={{ r: 4, fill: '#C4A484', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, fill: '#5A5A40', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
