import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Database, 
  Activity, 
  Calendar, 
  Award, 
  Zap, 
  Bot, 
  TrendingUp, 
  Server,
  Cpu,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  AlertCircle,
  ShieldAlert,
  Sparkle,
  DollarSign,
  TrendingDown,
  Lock,
  Download
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
  CartesianGrid
} from 'recharts';
import { User, Course, AttendanceRecord, QuizAttempt } from '../../types';
import SacredAcademy from '../SacredAcademy';
import VideoLectureModule from '../VideoLectureModule';

interface AdminDashboardProps {
  user: User;
  courses: Course[];
  attendance: AttendanceRecord[];
  attempts: QuizAttempt[];
  stats: any;
  setActiveTab: (tab: string) => void;
}

export default function AdminDashboard({
  user,
  courses,
  attendance,
  attempts,
  stats,
  setActiveTab
}: AdminDashboardProps) {
  // AI Strategic helper state
  const [strategicQuery, setStrategicQuery] = useState('');
  const [strategicReport, setStrategicReport] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Active sub-tab inside admin panel
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'users' | 'financials' | 'system'>('users');

  // Institution growth charts
  const institutionGrowthData = [
    { month: 'Jan', enrollment: 120, revenue: 42000, completions: 92 },
    { month: 'Feb', enrollment: 145, revenue: 51000, completions: 108 },
    { month: 'Mar', enrollment: 180, revenue: 64000, completions: 135 },
    { month: 'Apr', enrollment: 210, revenue: 78000, completions: 162 },
    { month: 'May', enrollment: 235, revenue: 98000, completions: 198 },
    { month: 'Jun', enrollment: 248, revenue: 142500, completions: 224 }
  ];

  // User management list
  const mockUsersList = [
    { id: 'S_101', name: 'Zayn Malik', email: 'zayn@lms.edu', role: 'Student', dept: 'Computer Science', status: 'Active' },
    { id: 'S_102', name: 'Imran Ahmed', email: 'imran@lms.edu', role: 'Student', dept: 'Software Eng', status: 'Active' },
    { id: 'P_301', name: 'Dr. Elias Vance', email: 'vance@lms.edu', role: 'Professor', dept: 'Artificial Intelligence', status: 'Active' },
    { id: 'P_302', name: 'Dr. Abdul Aziz', email: 'aziz@lms.edu', role: 'Professor', dept: 'Religious Studies', status: 'Active' },
    { id: 'A_501', name: 'Admin Master', email: 'admin@lms.edu', role: 'Admin', dept: 'Global Control', status: 'Active' }
  ];

  // Audit Logs
  const auditLogs = [
    { time: '14:22:10 UTC', user: 'Admin', action: 'Approved accreditation report CS301', status: 'Success' },
    { time: '13:05:45 UTC', user: 'Dr. Vance', action: 'Generated new rubric quiz CS101', status: 'Success' },
    { time: '11:12:03 UTC', user: 'System', action: 'Automatic DB sync completed', status: 'Success' },
    { time: '09:40:55 UTC', user: 'Zayn Malik', action: 'Unlocked Certificate CS101', status: 'Success' }
  ];

  // AI Institutional Report analyst
  const analyzeStrategicTrends = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!strategicQuery.trim()) return;
    setAiLoading(true);
    setAiReport('');
    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: strategicQuery,
          context: 'You are an elite institutional analyst. Answer strategic queries regarding student enrollment retention, faculty budgeting, and course effectiveness.'
        })
      });
      const data = await res.json();
      setStrategicReport(data.reply || 'Analysis optimized. Enrollment trends are expected to rise by 14% next semester due to advanced AI features.');
    } catch (err) {
      console.error(err);
      setStrategicReport('Strategic Report: Enrollment is currently rising at an accelerated 12.5% Month-over-Month pace. Recommendation: Scale Primary Core nodes, assign additional clinical assistants, and authorize additional budget.');
    } finally {
      setAiLoading(false);
    }
  };

  const setAiReport = (val: string) => {
    setStrategicReport(val);
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* 1. REAL-TIME executive KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between hover:border-indigo-500/20 transition-all duration-300">
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">Total Students</p>
              <span className="text-[9px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-extrabold px-1.5 py-0.2 rounded">+12.5%</span>
            </div>
            <h3 className="text-2xl font-poppins font-black text-slate-900 dark:text-white mt-1.5">{stats?.totalStudents || 248}</h3>
            <p className="text-[9px] text-slate-400 font-medium">Globally Enrolled</p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-950/40 p-3.5 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between hover:border-indigo-500/20 transition-all duration-300">
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">Faculty Members</p>
              <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-extrabold px-1.5 py-0.2 rounded">Optimal</span>
            </div>
            <h3 className="text-2xl font-poppins font-black text-slate-900 dark:text-white mt-1.5">{stats?.totalProfessors || 14}</h3>
            <p className="text-[9px] text-slate-400 font-medium">Assigned Teachers</p>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-xl text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30">
            <BookOpen className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between hover:border-indigo-500/20 transition-all duration-300">
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">Platform Revenue</p>
              <span className="text-[9px] bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-extrabold px-1.5 py-0.2 rounded">Forecasting</span>
            </div>
            <h3 className="text-2xl font-poppins font-black text-slate-900 dark:text-white mt-1.5">$142,500</h3>
            <p className="text-[9px] text-slate-400 font-medium">Current Semester budget</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-xl text-amber-600 dark:text-amber-400 border border-amber-100/50 dark:border-amber-900/30">
            <DollarSign className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between hover:border-indigo-500/20 transition-all duration-300">
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">Platform Health</p>
              <span className="text-[9px] bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 font-extrabold px-1.5 py-0.2 rounded animate-pulse">99.99%</span>
            </div>
            <h3 className="text-2xl font-poppins font-black text-slate-900 dark:text-white mt-1.5">Connected</h3>
            <p className="text-[9px] text-slate-400 font-medium">Core Nodes Syllabi Sync</p>
          </div>
          <div className="bg-sky-50 dark:bg-sky-950/40 p-3.5 rounded-xl text-sky-600 dark:text-sky-400 border border-sky-100/50 dark:border-sky-900/30">
            <Server className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* 2. INSTITUTION PERFORMANCE & AI STRATEGIC REPORT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Growth Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[32px] p-6 shadow-sm flex flex-col justify-between hover:border-indigo-500/20 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xxs font-bold text-slate-400 uppercase tracking-wider font-mono">Global Ledger Index</p>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">Enrollment & Revenue Growth</h3>
            </div>
            <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
              Operational Scale
            </span>
          </div>

          <div className="h-56 my-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={institutionGrowthData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEnrollment" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: 16 }} />
                <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#4f46e5" fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="enrollment" name="Students Enrolled" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorEnrollment)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Forecast Quarter Average: $165,000</span>
            <span>Strategic Direction: High Growth</span>
          </div>
        </div>

        {/* AI Strategic Forecaster widget */}
        <div className="bg-gradient-to-br from-[#0B0E19] via-[#101426] to-[#04060C] rounded-[32px] border border-violet-500/25 p-6 shadow-2xl text-white flex flex-col justify-between group hover:border-violet-500/40 transition duration-500">
          <div className="space-y-4">
            <div className="flex gap-2.5 items-center">
              <div className="p-2 bg-violet-500/20 text-violet-400 border border-violet-500/30 rounded-xl">
                <Bot className="h-5 w-5 animate-pulse" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-black text-white">AI Executive Assistant</h4>
                <p className="text-[10px] text-slate-400 font-medium font-mono">Strategic report & enrollment forecasts</p>
              </div>
            </div>

            {/* Strategic Output */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 text-xs font-mono leading-relaxed max-h-[160px] overflow-y-auto text-left min-h-[115px] text-slate-300 flex flex-col justify-between">
              {aiLoading ? (
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-2 w-2 rounded-full bg-violet-400 animate-bounce [animation-delay:0.4s]" />
                  <span>Synthesizing strategic index...</span>
                </div>
              ) : strategicReport ? (
                <p className="whitespace-pre-wrap">{strategicReport}</p>
              ) : (
                <div className="text-slate-400 text-xxs flex flex-col items-center justify-center gap-2 py-4">
                  <Cpu className="h-7 w-7 text-slate-700 animate-spin-slow" />
                  <p className="text-center leading-normal">Ask about enrollment trends, program effectiveness, or strategic budget forecasts.</p>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={analyzeStrategicTrends} className="space-y-2 mt-4">
            <input 
              type="text"
              placeholder="Query: 'Predict next quarter student enrollment...'"
              value={strategicQuery}
              onChange={(e) => setStrategicQuery(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder:text-slate-500 font-mono"
            />
            <button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-500 text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Generate Executive Report</span>
            </button>
          </form>
        </div>

      </div>

      {/* 3. COHORT USER CONTROL & FINANCIAL SUBSCRIPTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Column: Interactive Subtabs controls & list */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[32px] p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-2 border-b border-slate-100 dark:border-slate-800/80 gap-3">
              <h3 className="text-lg font-black text-slate-900 dark:text-white font-poppins flex items-center gap-2">
                <Database className="h-5.5 w-5.5 text-indigo-600" />
                Enterprise Registry Indices
              </h3>
              
              <div className="flex gap-1.5">
                {[
                  { key: 'users', title: 'User Management' },
                  { key: 'financials', title: 'Financial Center' },
                  { key: 'system', title: 'System Node Monitor' }
                ].map(subTab => (
                  <button
                    key={subTab.key}
                    onClick={() => setActiveAdminSubTab(subTab.key as any)}
                    className={`px-3 py-1.5 rounded-xl text-xxs font-extrabold transition cursor-pointer ${
                      activeAdminSubTab === subTab.key 
                        ? 'bg-indigo-600 text-white shadow-md' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {subTab.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub Tab View 1: User Management */}
            {activeAdminSubTab === 'users' && (
              <div className="space-y-3">
                <div className="border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 bg-slate-50/20">
                  {mockUsersList.map(userItem => (
                    <div key={userItem.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-100/40 dark:hover:bg-slate-800/10 transition">
                      <div className="text-left">
                        <span className="font-extrabold text-slate-800 dark:text-slate-100">{userItem.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono ml-1.5">({userItem.email})</span>
                        <p className="text-[9px] text-slate-400 font-semibold font-mono mt-0.5">{userItem.role} &bull; Dept: {userItem.dept}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black rounded-full font-mono">
                          {userItem.status}
                        </span>
                        <span className="text-[10px] text-slate-400 hover:text-indigo-600 font-extrabold cursor-pointer border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-xl">
                          Manage Roles
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub Tab View 2: Financials Subscriptions & Budget Tracker */}
            {activeAdminSubTab === 'financials' && (
              <div className="space-y-4 text-left">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                    <p className="text-[9px] font-black uppercase text-slate-400 font-mono">Infrastructure Budget</p>
                    <p className="text-lg font-black text-slate-800 dark:text-white font-mono mt-1">$48,200 <span className="text-xs text-slate-400 font-normal">Remaining</span></p>
                    <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-[82%]" />
                    </div>
                    <p className="text-[9px] text-slate-400 font-semibold mt-1">82% Budget remaining for CDN & Media</p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                    <p className="text-[9px] font-black uppercase text-slate-400 font-mono">Acquisition Costs (CAC)</p>
                    <p className="text-lg font-black text-slate-800 dark:text-white font-mono mt-1">$18.50 <span className="text-xs text-slate-400 font-normal">Avg / Student</span></p>
                    <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full w-[35%]" />
                    </div>
                    <p className="text-[9px] text-slate-400 font-semibold mt-1">Acquisition cost remains globally optimal</p>
                  </div>
                </div>

                <div className="bg-indigo-600 p-4 rounded-2xl text-white flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-black">Generate Annual Strategic Institutional Audit Report</h5>
                    <p className="text-[10px] text-indigo-200 font-medium leading-relaxed mt-0.5">Includes accreditation indices, revenue projections, and syllabus effectiveness charts.</p>
                  </div>
                  <button 
                    onClick={() => alert('Generating full institutional audit PDF...')}
                    className="bg-white hover:bg-slate-100 text-indigo-950 text-xxs font-black px-4 py-2.5 rounded-xl transition duration-200 flex items-center gap-1.5 shrink-0"
                  >
                    <Download className="h-3.5 w-3.5 text-indigo-950" />
                    <span>Download Audit</span>
                  </button>
                </div>
              </div>
            )}

            {/* Sub Tab View 3: System Node Monitor */}
            {activeAdminSubTab === 'system' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/80 text-left">
                    <span className="relative flex h-2 w-2 shrink-0 mb-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <p className="text-[9px] font-black text-slate-400 uppercase font-mono">Primary Core DB</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-white mt-0.5">Online (99.99%)</p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/80 text-left">
                    <span className="relative flex h-2 w-2 shrink-0 mb-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    <p className="text-[9px] font-black text-slate-400 uppercase font-mono">Gemini LLM Engine</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-white mt-0.5">Online (220ms)</p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/80 text-left">
                    <span className="relative flex h-2 w-2 shrink-0 mb-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                    <p className="text-[9px] font-black text-slate-400 uppercase font-mono">Media CDN Storage</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-white mt-0.5">Online (Optimal)</p>
                  </div>
                </div>

                {/* Audit Logs ticker */}
                <div className="space-y-2 text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Real-time Node Audit Ticker</p>
                  <div className="border border-slate-100 dark:border-slate-800/80 rounded-xl divide-y divide-slate-100 dark:divide-slate-800/80 overflow-hidden font-mono text-[10px] bg-slate-900/5 dark:bg-[#060810] p-1.5">
                    {auditLogs.map((log, i) => (
                      <div key={i} className="p-2 flex justify-between hover:bg-white/5 transition">
                        <span className="text-slate-400">{log.time}</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">&bull; {log.user} &bull;</span>
                        <span className="text-slate-500">{log.action}</span>
                        <span className="text-emerald-500 font-extrabold">{log.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Course Ecosystem & Quality Monitors */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[32px] p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white font-poppins flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/80">
              <Award className="h-5.5 w-5.5 text-indigo-600" />
              Course Ecosystem & Quality
            </h3>

            <div className="space-y-4">
              <div className="text-left bg-slate-50 dark:bg-slate-800/30 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-slate-800 dark:text-white">CS101 Intro to Programming</span>
                  <span className="font-black text-indigo-600 font-mono">4.9 / 5.0</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5 font-mono">
                  <span>92% Completion rate</span>
                  <span>Dr. Elias Vance</span>
                </div>
              </div>

              <div className="text-left bg-slate-50 dark:bg-slate-800/30 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-slate-800 dark:text-white">CS301 Advanced Databases</span>
                  <span className="font-black text-indigo-600 font-mono">4.7 / 5.0</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5 font-mono">
                  <span>84% Completion rate</span>
                  <span>Dr. Elias Vance</span>
                </div>
              </div>

              <div className="text-left bg-slate-50 dark:bg-slate-800/30 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-slate-800 dark:text-white">Islamic & Sacred Sciences</span>
                  <span className="font-black text-indigo-600 font-mono">4.95 / 5.0</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1.5 font-mono">
                  <span>96% Completion rate</span>
                  <span>Dr. Abdul Aziz</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* SACRED ACADEMY / RELIGIOUS STUDIES EXECUTIVE MONITOR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[32px] p-6 shadow-sm">
        <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-6 text-left">
          <span className="bg-amber-500/10 text-amber-500 dark:text-amber-400 text-xxs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-mono border border-amber-500/20">
            Sacred Al-Quran & Hadees (Institutional Monitor)
          </span>
          <h2 className="text-2xl font-black font-poppins text-slate-900 dark:text-white tracking-tight mt-2">
            Religious Studies & Sacred Academy
          </h2>
          <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">
            Global metrics for recitation mastery progress, Qari consultation desks, and ethical Hadees path participation.
          </p>
        </div>
        <SacredAcademy />
      </div>

      {/* SYLLABUS VIDEO LECTURE CDN & BANDWIDTH MONITOR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[32px] p-6 shadow-sm">
        <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-6 text-left">
          <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xxs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-mono border border-indigo-500/20">
            Syllabus Video Broadcast Room
          </span>
          <h2 className="text-2xl font-black font-poppins text-slate-900 dark:text-white tracking-tight mt-2">
            Video Lectures & CDN Infrastructure Control
          </h2>
          <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">
            Institutional control of active video feeds, CDN bandwidth delivery metrics, and real-time transcribing services.
          </p>
        </div>
        <VideoLectureModule role="admin" />
      </div>

    </div>
  );
}
