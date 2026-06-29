import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Activity, 
  Calendar, 
  Award, 
  Zap, 
  TrendingUp, 
  PlayCircle, 
  GraduationCap,
  Bot,
  Cpu,
  ArrowUpRight,
  CheckCircle2,
  MessageSquare,
  Clock,
  Sparkles,
  Flame,
  Trophy,
  Brain,
  Star,
  ChevronRight,
  Sparkle
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar
} from 'recharts';
import { User, Course, AttendanceRecord, QuizAttempt, Certificate } from '../../types';
import SacredAcademy from '../SacredAcademy';

interface StudentDashboardProps {
  user: User;
  courses: Course[];
  attendance: AttendanceRecord[];
  attempts: QuizAttempt[];
  certs: Certificate[];
  onLaunchCourse: (course: Course) => void;
  setActiveTab: (tab: string) => void;
}

export default function StudentDashboard({
  user,
  courses,
  attendance,
  attempts,
  certs,
  onLaunchCourse,
  setActiveTab
}: StudentDashboardProps) {
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [activeMetricTab, setActiveMetricTab] = useState<'hours' | 'performance'>('hours');

  // Compute stats
  const passedQuizzesCount = attempts.filter(a => a.passed).length;
  const userAttendance = attendance.filter(a => a.userId === user.id);
  const totalUserLessonsTracked = userAttendance.length || 1;
  const userPresentsCount = userAttendance.filter(a => a.status === 'Present').length;
  const attendanceRate = Math.round((userPresentsCount / totalUserLessonsTracked) * 100);

  // Skill Growth radar data
  const skillData = [
    { subject: 'Cognitive Sync', A: 92, B: 80, fullMark: 100 },
    { subject: 'Code Architecture', A: 84, B: 75, fullMark: 100 },
    { subject: 'Pacing Velocity', A: 78, B: 85, fullMark: 100 },
    { subject: 'Quiz Readiness', A: 95, B: 70, fullMark: 100 },
    { subject: 'Spiritual Science', A: 86, B: 90, fullMark: 100 },
    { subject: 'Algorithmic Focus', A: 90, B: 65, fullMark: 100 }
  ];

  // Study hours data
  const weeklyHoursData = [
    { day: 'Mon', hours: 4.5, quizzes: 1 },
    { day: 'Tue', hours: 6.2, quizzes: 0 },
    { day: 'Wed', hours: 5.8, quizzes: 2 },
    { day: 'Thu', hours: 8.0, quizzes: 1 },
    { day: 'Fri', hours: 7.1, quizzes: 3 },
    { day: 'Sat', hours: 9.5, quizzes: 0 },
    { day: 'Sun', hours: 10.2, quizzes: 1 }
  ];

  // Heatmap helper representation (active study nodes)
  const heatmapNodes = Array.from({ length: 28 }, (_, i) => {
    const intensity = (i * 7 + 13) % 4; // 0, 1, 2, 3
    const colors = [
      'bg-slate-100 dark:bg-slate-800/40 border-slate-200/50 dark:border-slate-800/40',
      'bg-indigo-500/20 border-indigo-500/10',
      'bg-indigo-500/50 border-indigo-500/20',
      'bg-cyan-400 border-cyan-400/20 shadow-[0_0_8px_rgba(34,211,238,0.3)]'
    ];
    return { day: i + 1, level: intensity, colorClass: colors[intensity] };
  });

  // Ask AI Tutor integration
  const askAiTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;
    setAiLoading(true);
    setAiAnswer('');
    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiQuestion, context: `The student user ${user.name} is working in their academic dashboard.` })
      });
      const data = await res.json();
      setAiAnswer(data.reply || 'AI sync successfully calibrated. I suggest reviewing your study timeline for the pending Quiz evaluation.');
    } catch (err) {
      console.error(err);
      setAiAnswer('Connected to LMS Edge nodes. Practice variable scope optimization or ask about prophetic moral structures.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* 1. HERO AREA */}
      <div className="bg-gradient-to-br from-[#0B0F19] via-[#111625] to-[#05070D] rounded-[32px] border border-violet-500/15 p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl dark:shadow-[0_20px_50px_rgba(79,70,229,0.15)] transition-all duration-500">
        <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none">
          <GraduationCap className="h-72 w-72 text-cyan-400 transform rotate-12 translate-y-16 translate-x-8 animate-pulse" />
        </div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full filter blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-64 h-64 bg-cyan-500/10 rounded-full filter blur-[80px] pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-violet-500/15 text-violet-300 border border-violet-500/20 text-[10px] font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 animate-pulse text-violet-400" />
              STUDENT COCKPIT
            </span>
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider font-mono flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-ping" />
              Live Sync Connected
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-poppins font-black tracking-tight flex flex-wrap items-center gap-2">
              Welcome back, <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent">{user.name}</span>!
              <Sparkle className="h-7 w-7 text-amber-400 animate-bounce shrink-0" />
            </h1>
            <p className="text-slate-300 text-xs sm:text-base max-w-2xl font-medium leading-relaxed">
              "Your focus is at an all-time high today! You are currently on an exceptional <span className="text-amber-400 font-extrabold font-mono">7-day learning streak</span>. Ready to resume your lectures?"
            </p>
          </div>

          {/* Gamification Pills & Stats Bar */}
          <div className="pt-4 flex flex-wrap gap-4 items-center border-t border-slate-800/60">
            <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-inner">
              <div className="bg-amber-500/20 p-1.5 rounded-xl text-amber-400">
                <Flame className="h-5 w-5 fill-amber-500 animate-pulse" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Current Streak</p>
                <p className="text-sm font-black text-white font-mono">7 Days Active</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-inner">
              <div className="bg-violet-500/20 p-1.5 rounded-xl text-violet-400">
                <Trophy className="h-5 w-5 text-violet-400" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Achievement Level</p>
                <p className="text-sm font-black text-white font-mono">Level 4 Scholar</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-inner">
              <div className="bg-cyan-500/20 p-1.5 rounded-xl text-cyan-400">
                <Zap className="h-5 w-5 text-cyan-400 fill-cyan-400/20" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Experience Points</p>
                <p className="text-sm font-black text-white font-mono">12,450 XP</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. PROGRESS, SKILLS, AND HEATMAP CENTER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Circular Completion & Velocity Indicator */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[32px] p-6 shadow-sm flex flex-col justify-between group hover:border-violet-500/30 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xxs font-bold text-slate-400 uppercase tracking-wider font-mono">Velocity Index</p>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">Study Performance</h3>
            </div>
            <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-extrabold px-2.5 py-1 rounded-full uppercase font-mono border border-emerald-100 dark:border-emerald-900/30">
              Optimal Rate
            </span>
          </div>

          <div className="my-6 flex justify-center items-center relative py-2">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="64"
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r="64"
                className="stroke-indigo-500 transition-all duration-1000 ease-out"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 64}
                strokeDashoffset={2 * Math.PI * 64 - (attendanceRate / 100) * 2 * Math.PI * 64}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">{attendanceRate}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Completion</span>
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-semibold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                Lesson Attendance
              </span>
              <span className="font-bold text-slate-800 dark:text-white">{userPresentsCount} / {totalUserLessonsTracked} lessons</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 font-semibold flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                Quizzes Attempted
              </span>
              <span className="font-bold text-slate-800 dark:text-white">{attempts.length} attempts</span>
            </div>
          </div>
        </div>

        {/* Skill Growth Visualization */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[32px] p-6 shadow-sm flex flex-col justify-between group hover:border-violet-500/30 transition-all duration-300">
          <div>
            <p className="text-xxs font-bold text-slate-400 uppercase tracking-wider font-mono">Neural Profiling</p>
            <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">Skill Matrix Growth</h3>
          </div>

          <div className="h-48 my-3 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                <PolarGrid stroke="#e2e8f0" className="opacity-40" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 700 }} />
                <Radar name="Active Skills" dataKey="A" stroke="#6366f1" fill="#818cf8" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 text-center">
            <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
              Your Al-Quran memorization progress & Algorithmic scores lead the class 92nd percentile.
            </p>
          </div>
        </div>

        {/* Performance Heatmap Indicator */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[32px] p-6 shadow-sm flex flex-col justify-between group hover:border-violet-500/30 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xxs font-bold text-slate-400 uppercase tracking-wider font-mono">Consistency Grid</p>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">Weekly Activity Heatmap</h3>
            </div>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Calendar className="h-4.5 w-4.5" />
            </div>
          </div>

          <div className="my-4">
            <div className="grid grid-cols-7 gap-2">
              {heatmapNodes.map((node) => (
                <div 
                  key={node.day} 
                  className={`aspect-square rounded-md border flex items-center justify-center text-[8px] font-bold font-mono transition-all ${node.colorClass}`}
                  title={`Day ${node.day}: Study focus Level ${node.level}`}
                >
                  {node.day}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 flex items-center justify-between text-[10px] text-slate-400">
            <span>Inactive</span>
            <div className="flex gap-1">
              <span className="h-2 w-2 rounded bg-slate-100 dark:bg-slate-800" />
              <span className="h-2 w-2 rounded bg-indigo-500/20" />
              <span className="h-2 w-2 rounded bg-indigo-500/50" />
              <span className="h-2 w-2 rounded bg-cyan-400" />
            </div>
            <span>Deep Study</span>
          </div>
        </div>

      </div>

      {/* 3. DUAL-ROW VIEW: MY COURSES & SMART AI COMPANION */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 text-left">
        
        {/* Left Column - My Enrolled Courses list */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black font-poppins text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
              <BookOpen className="h-5.5 w-5.5 text-indigo-600" />
              My Academic Classes
            </h2>
            <span className="text-xs text-slate-400 font-semibold font-mono">{courses.length} Registered</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {courses.map(course => {
              const totalLessons = (course.modules || []).flatMap(m => m ? (m.lessons || []) : []).length || 1;
              const watchedLessons = attendance.filter(a => a.courseId === course.id && a.status === 'Present').length;
              const percentComplete = Math.min(100, Math.round((watchedLessons / totalLessons) * 100));

              return (
                <div 
                  key={course.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[24px] p-6 hover:border-indigo-500/30 transition-all duration-300 shadow-xs flex flex-col justify-between gap-4"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black px-2.5 py-0.5 rounded font-mono uppercase tracking-wider">
                          {course.code}
                        </span>
                        <span className="text-[9px] bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Bot className="h-2.5 w-2.5" />
                          AI Recommendation: Core
                        </span>
                      </div>
                      <h4 className="text-base font-black text-slate-900 dark:text-white leading-snug">{course.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mt-1 font-medium">{course.description}</p>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center font-bold text-white text-xs shrink-0 shadow-lg shadow-indigo-500/10 uppercase font-mono">
                      {course.instructor.slice(0, 2)}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400 dark:text-slate-500 font-bold">Syallabus Progress</span>
                      <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{percentComplete}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/20">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full" 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentComplete}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] text-slate-400 font-bold font-mono">Resumed 2h ago &bull; {course.instructor}</span>
                      </div>

                      <button
                        onClick={() => onLaunchCourse(course)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black px-4 py-2.5 rounded-xl transition duration-200 flex items-center gap-1.5 shrink-0 shadow-md shadow-indigo-500/25 cursor-pointer"
                      >
                        <PlayCircle className="h-4 w-4" />
                        <span>Launch Syllabus</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column - Smart AI Tutor Terminal */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black font-poppins text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
              <Bot className="h-5.5 w-5.5 text-violet-500 animate-bounce shrink-0" />
              Smart AI Companion
            </h2>
            <span className="bg-violet-500/10 text-violet-500 dark:text-violet-400 text-[9px] font-extrabold px-2 py-0.5 rounded-full tracking-wider font-mono">
              Online
            </span>
          </div>

          <div className="bg-gradient-to-br from-[#0F1424] via-[#090C16] to-[#04060B] rounded-[24px] border border-violet-500/25 p-6 text-white flex flex-col justify-between min-h-[380px] shadow-2xl relative overflow-hidden group hover:border-violet-500/40">
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full filter blur-[50px] pointer-events-none" />
            
            <div className="space-y-4 relative z-10 flex-1">
              <div className="flex gap-2.5 items-center">
                <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-500/35 flex items-center justify-center text-violet-400 font-black shrink-0">
                  <Brain className="h-4.5 w-4.5 animate-pulse" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-black text-white">AI Companion Tutor</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Explain recursion, generate MCQs, or outline study logs.</p>
                </div>
              </div>

              {/* Response box */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs leading-relaxed max-h-[180px] overflow-y-auto text-left min-h-[100px] text-slate-300 flex flex-col justify-between font-mono">
                {aiLoading ? (
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" />
                    <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce [animation-delay:0.4s]" />
                    <span>Neural nodes querying...</span>
                  </div>
                ) : aiAnswer ? (
                  <p className="whitespace-pre-wrap">{aiAnswer}</p>
                ) : (
                  <div className="text-slate-400 text-xxs flex flex-col items-center justify-center gap-2 py-4">
                    <Cpu className="h-7 w-7 text-slate-700 animate-spin-slow" />
                    <p className="text-center">Ask your first question about algorithms, compiler design or prophetic sciences!</p>
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={askAiTutor} className="relative z-10 mt-4 space-y-2">
              <input
                type="text"
                placeholder="Ask me to draft a custom quiz or explain a concept..."
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-violet-500 text-white font-mono placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Ask AI Tutor</span>
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* 4. UPCOMING TASKS & GAMIFICATION TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        
        {/* Left Double-Col - Gamification badges & certificates list */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[32px] p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="text-lg font-black text-slate-900 dark:text-white font-poppins flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                Gamification & Certificates
              </h3>
              <span className="text-xs text-indigo-600 font-extrabold font-mono hover:underline cursor-pointer" onClick={() => setActiveTab('reports')}>View All</span>
            </div>

            {/* Badges Container */}
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">My Milestones Badges</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/40 dark:border-amber-900/20 p-3 rounded-2xl flex flex-col items-center text-center gap-1 hover:scale-[1.02] transition-all">
                  <Flame className="h-6 w-6 text-amber-500 fill-amber-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-800 dark:text-amber-200 mt-1 leading-none">7-Day Streak</span>
                  <span className="text-[8px] text-slate-400">Consistency lock</span>
                </div>
                <div className="bg-sky-50 dark:bg-sky-950/20 border border-sky-200/40 dark:border-sky-900/20 p-3 rounded-2xl flex flex-col items-center text-center gap-1 hover:scale-[1.02] transition-all">
                  <Award className="h-6 w-6 text-sky-500" />
                  <span className="text-[10px] font-black text-slate-800 dark:text-sky-200 mt-1 leading-none">Perfect Quiz</span>
                  <span className="text-[8px] text-slate-400">100% Correct</span>
                </div>
                <div className="bg-violet-50 dark:bg-violet-950/20 border border-violet-200/40 dark:border-violet-900/20 p-3 rounded-2xl flex flex-col items-center text-center gap-1 hover:scale-[1.02] transition-all">
                  <Star className="h-6 w-6 text-violet-500 animate-spin-slow" />
                  <span className="text-[10px] font-black text-slate-800 dark:text-violet-200 mt-1 leading-none">Scholar Peak</span>
                  <span className="text-[8px] text-slate-400">GPA tier standing</span>
                </div>
              </div>
            </div>

            {/* Certificates Row List */}
            <div className="space-y-2 pt-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Earned PDF Certificates ({certs.length})</p>
              {certs.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-500 italic py-2 text-center bg-slate-50 dark:bg-slate-900/20 rounded-xl border border-dashed border-slate-200">
                  Complete all modules in an assigned course to generate a PDF badge certificate.
                </p>
              ) : (
                <div className="space-y-2">
                  {certs.map(cert => (
                    <div key={cert.id} className="p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl flex justify-between items-center hover:bg-slate-100/50 transition">
                      <div className="flex gap-2.5 items-center">
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0">
                          <CheckCircle2 className="h-4.5 w-4.5" />
                        </div>
                        <div className="text-left">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-white">{cert.courseTitle}</h4>
                          <p className="text-[9px] text-slate-400 font-mono">Issued {new Date(cert.issueDate).toLocaleDateString()} &bull; ID: {cert.certificateCode}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 rounded-full font-mono">
                        VERIFIED
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Upcoming Tasks Timeline */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[32px] p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="text-lg font-black text-slate-900 dark:text-white font-poppins flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-500" />
                Upcoming Tasks
              </h3>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2.5 py-0.5 rounded-full font-mono font-bold">Today</span>
            </div>

            <div className="space-y-4 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-100 dark:before:bg-slate-800/80">
              <div className="flex gap-3 relative z-10 text-left">
                <span className="h-6 w-6 rounded-full bg-rose-500/20 border-2 border-rose-500 text-rose-500 text-xxs font-black flex items-center justify-center shrink-0">
                  !
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white">CS301 Advanced Databases Exam</h4>
                  <p className="text-[9px] text-slate-400 font-semibold font-mono">DEADLINE: TODAY &bull; High Priority</p>
                  <p className="text-[10px] text-slate-500 mt-1">Review indexing and Sharding constraints before locking slot.</p>
                </div>
              </div>

              <div className="flex gap-3 relative z-10 text-left">
                <span className="h-6 w-6 rounded-full bg-amber-500/20 border-2 border-amber-500 text-amber-500 text-xxs font-black flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white">Submit Lab 4 Compiler Lexer</h4>
                  <p className="text-[9px] text-slate-400 font-semibold font-mono">DUE: TOMORROW &bull; Medium Priority</p>
                  <p className="text-[10px] text-slate-500 mt-1">Submit compiler labs inside course assignment panel.</p>
                </div>
              </div>

              <div className="flex gap-3 relative z-10 text-left">
                <span className="h-6 w-6 rounded-full bg-sky-500/20 border-2 border-sky-500 text-sky-500 text-xxs font-black flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white">Weekly Quran Nazra Consultation</h4>
                  <p className="text-[9px] text-slate-400 font-semibold font-mono">DATE: WED 9:00 AM &bull; Standard</p>
                  <p className="text-[10px] text-slate-500 mt-1">Correct pronunciations with Dr. Sheikh Abdul Aziz.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 5. SACRED ACADEMY / RELIGIOUS STUDIES MODULES */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[32px] p-6 shadow-sm">
        <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-6 text-left">
          <span className="bg-amber-500/10 text-amber-500 dark:text-amber-400 text-xxs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-mono border border-amber-500/20">
            Sacred Al-Quran & Hadees
          </span>
          <h2 className="text-2xl font-black font-poppins text-slate-900 dark:text-white tracking-tight mt-2">
            Religious Studies & Sacred Academy
          </h2>
          <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">
            Track Surahs mastered, request Live Recitation checks with certified instructors, and complete categorized Hadees paths.
          </p>
        </div>
        <SacredAcademy />
      </div>

    </div>
  );
}
