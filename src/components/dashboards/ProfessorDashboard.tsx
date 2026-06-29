import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Activity, 
  Calendar, 
  Award, 
  Zap, 
  TrendingUp, 
  Bot,
  Cpu,
  ArrowUpRight,
  CheckCircle2,
  MessageSquare,
  Clock,
  Sparkles,
  ChevronRight,
  AlertCircle,
  PlusCircle,
  Sparkle,
  Trash2,
  ListFilter
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';
import { User, Course, AttendanceRecord, QuizAttempt, OfficeHourSlot } from '../../types';
import SacredAcademy from '../SacredAcademy';
import VideoLectureModule from '../VideoLectureModule';

interface ProfessorDashboardProps {
  user: User;
  courses: Course[];
  attendance: AttendanceRecord[];
  attempts: QuizAttempt[];
  officeHours: OfficeHourSlot[];
  onLaunchCourse: (course: Course) => void;
  setActiveTab: (tab: string) => void;
  handleCreateSlot: (e: React.FormEvent) => void;
  handleDeleteSlot: (id: string) => void;
  newSlotCourse: string;
  setNewSlotCourse: (val: string) => void;
  newSlotDate: string;
  setNewSlotDate: (val: string) => void;
  newSlotStart: string;
  setNewSlotStart: (val: string) => void;
  newSlotEnd: string;
  setNewSlotEnd: (val: string) => void;
  slotMessage: { type: string; text: string };
  isSubmittingSlot: boolean;
}

export default function ProfessorDashboard({
  user,
  courses,
  attendance,
  attempts,
  officeHours,
  onLaunchCourse,
  setActiveTab,
  handleCreateSlot,
  handleDeleteSlot,
  newSlotCourse,
  setNewSlotCourse,
  newSlotDate,
  setNewSlotDate,
  newSlotStart,
  setNewSlotStart,
  newSlotEnd,
  setNewSlotEnd,
  slotMessage,
  isSubmittingSlot
}: ProfessorDashboardProps) {
  // AI assistant simulation state
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // New feedback / grading state
  const [selectedStudent, setSelectedStudent] = useState('Zayn Malik');
  const [gradeInput, setGradeInput] = useState('95');
  const [feedbackInput, setFeedbackInput] = useState('Outstanding recursive optimization!');
  const [gradingSuccess, setGradingSuccess] = useState(false);

  // Announcement broadcaster state
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Class analytics data
  const classPerformanceData = [
    { name: 'CS101 Intro', classAvg: 84, retention: 96, riskCount: 1 },
    { name: 'CS301 Adv DB', classAvg: 79, retention: 91, riskCount: 3 },
    { name: 'Syllabus Core', classAvg: 90, retention: 98, riskCount: 0 },
    { name: 'Quran Nazra', classAvg: 95, retention: 100, riskCount: 0 }
  ];

  // Live student direct query mock
  const directQueries = [
    { id: '1', studentName: 'Zayn Malik', courseCode: 'CS101', question: 'How do you handle stack limits in deep recursive binary searches?', time: '20 mins ago' },
    { id: '2', studentName: 'Imran Ahmed', courseCode: 'CS301', question: 'Could you clarify the database sharding replication strategy for primary instances?', time: '1 hour ago' },
    { id: '3', studentName: 'Amina Yousuf', courseCode: 'Syllabus', question: 'Are we submitting the Surah Al-Kahf verses recording before Wednesday?', time: '3 hours ago' }
  ];

  // AI Assistant generator
  const generateTeachingMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiOutput('');
    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: aiPrompt, 
          context: `You are an AI teaching assistant for Professor ${user.name}. Generate assignment descriptions, quiz rubrics, or summaries.` 
        })
      });
      const data = await res.json();
      setAiOutput(data.reply || 'Teaching sync completed. Successfully optimized the syllabus parameters.');
    } catch (err) {
      console.error(err);
      setAiOutput('Successfully draft: Binary Search recursive challenge. Rubric: Complexity analysis (40%), Stack overflow safety (30%), Compilation sanity tests (30%).');
    } finally {
      setAiLoading(false);
    }
  };

  // Submit mock grading action
  const submitGrade = (e: React.FormEvent) => {
    e.preventDefault();
    setGradingSuccess(true);
    setTimeout(() => {
      setGradingSuccess(false);
      setFeedbackInput('');
      setGradeInput('');
    }, 2500);
  };

  // Broadcaster action
  const broadcastAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    setBroadcastSuccess(true);
    setTimeout(() => {
      setBroadcastSuccess(false);
      setBroadcastMessage('');
    }, 2500);
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* 1. HERO AREA */}
      <div className="bg-gradient-to-br from-[#080D1E] via-[#0E152F] to-[#040713] rounded-[32px] border border-indigo-500/15 p-6 sm:p-10 text-white relative overflow-hidden shadow-2xl dark:shadow-[0_20px_50px_rgba(79,70,229,0.15)] transition-all duration-500">
        <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none">
          <BookOpen className="h-72 w-72 text-indigo-400 transform rotate-12 translate-y-16 translate-x-8 animate-pulse" />
        </div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full filter blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-64 h-64 bg-emerald-500/10 rounded-full filter blur-[80px] pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 text-[10px] font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 animate-pulse text-indigo-400" />
              FACULTY COMMAND HUB
            </span>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider font-mono flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-ping" />
              Professor Sync Mode
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-poppins font-black tracking-tight flex flex-wrap items-center gap-2">
              Welcome back, <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-300 bg-clip-text text-transparent">{user.name}</span>!
              <Sparkle className="h-7 w-7 text-amber-400 animate-bounce shrink-0" />
            </h1>
            <p className="text-slate-300 text-xs sm:text-base max-w-2xl font-medium leading-relaxed">
              "Manage clinical lectures, generate automated quiz evaluations, check direct queries, and lock strategic grade boundaries effortlessly inside your dashboard."
            </p>
          </div>

          {/* Core teaching KPI pills */}
          <div className="pt-4 flex flex-wrap gap-4 items-center border-t border-slate-800/60">
            <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl flex items-center gap-3">
              <div className="bg-indigo-500/20 p-1.5 rounded-xl text-indigo-400">
                <Users className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Active Students</p>
                <p className="text-sm font-black text-white font-mono">248 Enrolled</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl flex items-center gap-3">
              <div className="bg-emerald-500/20 p-1.5 rounded-xl text-emerald-400">
                <Activity className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Class Engagement Score</p>
                <p className="text-sm font-black text-white font-mono">94% Optimal</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl flex items-center gap-3">
              <div className="bg-sky-500/20 p-1.5 rounded-xl text-sky-400">
                <Award className="h-5 w-5 text-sky-400" />
              </div>
              <div className="text-left">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">LMS Grade Average</p>
                <p className="text-sm font-black text-white font-mono">82.4% GPA</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. COURSE MANAGEMENT HUB & STUDENT PERFORMANCE ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Course Effectiveness Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[32px] p-6 shadow-sm flex flex-col justify-between hover:border-indigo-500/20 transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xxs font-bold text-slate-400 uppercase tracking-wider font-mono font-bold">Class Standing Analytics</p>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">Course Effectiveness & Outcomes</h3>
            </div>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
          </div>

          <div className="h-56 my-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="opacity-30" />
                <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Tooltip contentStyle={{ borderRadius: 16 }} />
                <Bar dataKey="classAvg" name="Class Average %" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="retention" name="Retention Rate %" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Critical Risks: <strong className="text-rose-500">4 students flagged</strong></span>
            <span>Accreditation Standing: Perfect</span>
          </div>
        </div>

        {/* AI Teaching Assistant Generator tool */}
        <div className="bg-gradient-to-br from-[#0D1225] via-[#070A16] to-[#03040B] rounded-[32px] border border-indigo-500/25 p-6 shadow-2xl text-white flex flex-col justify-between group hover:border-indigo-500/40 transition-all duration-500">
          <div className="space-y-4">
            <div className="flex gap-2.5 items-center">
              <div className="p-2 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl">
                <Bot className="h-5 w-5 animate-pulse" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-black text-white">AI Teaching Assistant</h4>
                <p className="text-[10px] text-slate-400 font-medium font-mono">MCQ and Assignment Synthesizer</p>
              </div>
            </div>

            {/* Response Output Box */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3.5 text-xs font-mono leading-relaxed max-h-[160px] overflow-y-auto text-left min-h-[110px] text-slate-300 flex flex-col justify-between">
              {aiLoading ? (
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="h-2 w-2 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
                  <span>Synthesizing material...</span>
                </div>
              ) : aiOutput ? (
                <p className="whitespace-pre-wrap">{aiOutput}</p>
              ) : (
                <div className="text-slate-400 text-xxs flex flex-col items-center justify-center gap-2 py-4">
                  <Cpu className="h-7 w-7 text-slate-700 animate-spin-slow" />
                  <p className="text-center leading-normal">Prompt me to draft lesson MCQs, grading rubrics, or classroom discussion summaries.</p>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={generateTeachingMaterial} className="space-y-2 mt-4">
            <input 
              type="text"
              placeholder="Prompt: 'Generate a 3-question MCQ quiz on recursion...'"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-500 font-mono"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Draft Material</span>
            </button>
          </form>
        </div>

      </div>

      {/* 3. ASSIGNMENT CENTER & COMMUNICATION DIRECT QUERIES ROOM */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Column: Direct Queries Room / Communication Hub */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[32px] p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/80">
              <h3 className="text-lg font-black text-slate-900 dark:text-white font-poppins flex items-center gap-2">
                <MessageSquare className="h-5.5 w-5.5 text-indigo-600" />
                Direct Queries Inbox
              </h3>
              <span className="text-[10px] bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400 font-bold px-2.5 py-0.5 rounded-full font-mono">
                3 Pending
              </span>
            </div>

            <div className="space-y-3">
              {directQueries.map(query => (
                <div 
                  key={query.id}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/80 hover:border-indigo-500/20 transition-all text-left flex flex-col gap-1.5"
                >
                  <div className="flex justify-between items-baseline">
                    <span className="font-extrabold text-slate-800 dark:text-slate-100 text-xs">{query.studentName}</span>
                    <span className="text-[9px] font-mono text-slate-400">{query.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-bold font-mono bg-indigo-500/10 text-indigo-500 px-1.5 py-0.2 rounded">
                      {query.courseCode}
                    </span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold italic truncate">
                      "{query.question}"
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedStudent(query.studentName);
                      setFeedbackInput(`Regarding: "${query.question.slice(0, 30)}..." - Yes, you can structure it via...`);
                    }}
                    className="self-end text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-0.5"
                  >
                    <span>Draft Response</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Mini Assignment Review & Feedback center */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[32px] p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white font-poppins flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/80">
              <Award className="h-5.5 w-5.5 text-indigo-600 animate-pulse" />
              Pending Evaluations
            </h3>

            <form onSubmit={submitGrade} className="space-y-3 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 font-mono">Selected Student</label>
                <select 
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Zayn Malik">Zayn Malik - Lab 4 Lexer</option>
                  <option value="Imran Ahmed">Imran Ahmed - SQL Sharding Analysis</option>
                  <option value="Amina Yousuf">Amina Yousuf - Surah Recitation Practice</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 font-mono">Assigned Score %</label>
                  <input 
                    type="number"
                    max="100"
                    min="0"
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    placeholder="e.g. 95"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 font-mono">Evaluation Mode</label>
                  <span className="h-9 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl text-xxs font-bold flex items-center justify-center font-mono">
                    MANUAL GRADING
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 font-mono">Feedback Notes</label>
                <textarea 
                  rows={2}
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Outstanding optimization notes..."
                  required
                />
              </div>

              {gradingSuccess && (
                <p className="text-xxs font-extrabold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg text-center">
                  Score and rubric notes logged successfully to global index!
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Save Grade & Feedback</span>
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* 4. ANNOUNCEMENTS BROADCASTER & OFFICE HOURS SLOT ALLOCATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Course Broadcast Board */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[32px] p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white font-poppins flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/80">
              <Zap className="h-5.5 w-5.5 text-amber-500 animate-pulse" />
              Announcements Broadcaster
            </h3>

            <form onSubmit={broadcastAnnouncement} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 font-mono">Broadcast Room Channel</label>
                <span className="h-9 border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-black flex items-center justify-center gap-1">
                  <PlusCircle className="h-4 w-4" />
                  Syllabus Global Board Track
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 font-mono">Announcement Message</label>
                <textarea 
                  rows={3}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="Hey cohort, mid-term evaluations are set for Wednesday. Use the AI tutor to lock your syllabus preparation..."
                  required
                />
              </div>

              {broadcastSuccess && (
                <p className="text-xxs font-extrabold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg text-center animate-bounce">
                  Announcement broadcasted over SMS and push indicators!
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>Broadcast Live Sync</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Office Hours Slot Allocator */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[32px] p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white font-poppins flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800/80">
              <Calendar className="h-5.5 w-5.5 text-indigo-600" />
              Office Hours Availability Allocator
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              
              {/* Creator Form */}
              <div className="md:col-span-2">
                <form onSubmit={handleCreateSlot} className="space-y-3 bg-slate-50 dark:bg-slate-900/30 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/60 text-left">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 font-mono">Course Track</label>
                    <select 
                      value={newSlotCourse}
                      onChange={(e) => setNewSlotCourse(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xxs focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white"
                      required
                    >
                      <option value="">-- Select --</option>
                      {courses.map(course => (
                        <option key={course.id} value={course.id}>{course.code}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 font-mono">Date</label>
                    <input 
                      type="date"
                      value={newSlotDate}
                      onChange={(e) => setNewSlotDate(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xxs focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 font-mono">Start</label>
                      <input 
                        type="time"
                        value={newSlotStart}
                        onChange={(e) => setNewSlotStart(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xxs focus:outline-none"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-400 font-mono">End</label>
                      <input 
                        type="time"
                        value={newSlotEnd}
                        onChange={(e) => setNewSlotEnd(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-xxs focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {slotMessage.text && (
                    <p className="text-[9px] font-bold text-center text-indigo-600">{slotMessage.text}</p>
                  )}

                  <button 
                    type="submit" 
                    disabled={isSubmittingSlot}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1.5 rounded-lg text-[10px] cursor-pointer"
                  >
                    Publish Slot
                  </button>
                </form>
              </div>

              {/* Slots List */}
              <div className="md:col-span-3 space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Active Slots</p>
                <div className="space-y-2 max-h-[220px] overflow-y-auto border border-slate-100 dark:border-slate-800/80 rounded-2xl p-2 bg-slate-50/20">
                  {officeHours.filter(slot => slot.professorId === user.id).length === 0 ? (
                    <p className="text-[10px] text-slate-400 italic text-center py-6">No availability slots published yet.</p>
                  ) : (
                    officeHours
                      .filter(slot => slot.professorId === user.id)
                      .map(slot => {
                        const course = courses.find(c => c.id === slot.courseId);
                        return (
                          <div key={slot.id} className="p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between hover:bg-slate-50">
                            <div className="text-left">
                              <span className="text-[8px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.2 rounded font-mono font-bold">
                                {course ? course.code : 'Syllabus'}
                              </span>
                              <h5 className="text-[10px] font-bold text-slate-800 dark:text-slate-200 mt-1">
                                {slot.date} &bull; {slot.startTime}-{slot.endTime}
                              </h5>
                              <span className={`text-[8px] px-1 rounded font-bold ${slot.status === 'booked' ? 'bg-emerald-50 text-emerald-600' : 'bg-sky-50 text-sky-600'}`}>
                                {slot.status === 'booked' ? 'Booked' : 'Available'}
                              </span>
                            </div>
                            <button 
                              onClick={() => handleDeleteSlot(slot.id)}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 transition cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* SACRED ACADEMY / RELIGIOUS STUDIES INSTRUCTOR VIEW */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[32px] p-6 shadow-sm">
        <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-6 text-left">
          <span className="bg-amber-500/10 text-amber-500 dark:text-amber-400 text-xxs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-mono border border-amber-500/20">
            Sacred Al-Quran & Hadees (Instructor View)
          </span>
          <h2 className="text-2xl font-black font-poppins text-slate-900 dark:text-white tracking-tight mt-2">
            Religious Studies & Sacred Academy
          </h2>
          <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">
            Review student Nazra Recitations, manage makhraj pronunciation guides, and review authentic Hadees pathways.
          </p>
        </div>
        <SacredAcademy />
      </div>

      {/* SYLLABUS VIDEO LECTURE PUBLISHER & BROADCASTER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[32px] p-6 shadow-sm">
        <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4 mb-6 text-left">
          <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xxs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-mono border border-indigo-500/20">
            Syllabus Video Broadcast Room
          </span>
          <h2 className="text-2xl font-black font-poppins text-slate-900 dark:text-white tracking-tight mt-2">
            Video Lectures & AI Subtitle Publisher
          </h2>
          <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">
            Upload course video content to CDN, review video streams, and configure transcripts.
          </p>
        </div>
        <VideoLectureModule role="professor" />
      </div>

    </div>
  );
}
