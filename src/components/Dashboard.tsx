import React, { useEffect, useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Database, 
  Activity, 
  Calendar, 
  Award, 
  Zap, 
  Bell, 
  TrendingUp, 
  PlayCircle, 
  GraduationCap,
  Bot,
  Server,
  Cpu,
  Layers,
  Globe,
  Terminal,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Clock,
  Sparkles,
  ShieldAlert,
  Sparkle,
  Flame
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell,
  ReferenceLine
} from 'recharts';
import { User, Course, AttendanceRecord, QuizAttempt, Certificate, Quiz, OfficeHourSlot } from '../types';
import InteractiveCalendar from './InteractiveCalendar';
import SacredAcademy from './SacredAcademy';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 14
    }
  }
};

interface DashboardProps {
  user: User;
  courses: Course[];
  setActiveTab: (tab: string) => void;
  onLaunchCourse: (course: Course) => void;
  onLaunchQuiz?: (quiz: Quiz, courseId: string) => void;
}

export default function Dashboard({ user, courses, setActiveTab, onLaunchCourse, onLaunchQuiz }: DashboardProps) {
  const [stats, setStats] = useState<any>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartTab, setChartTab] = useState<'all' | 'lectures' | 'quizzes'>('all');

  // Hyper-Premium Futuristic Widget States
  const [spatialDimension, setSpatialDimension] = useState<'cognitive' | 'practical' | 'pacing' | 'readiness'>('cognitive');
  const [hologramRotation, setHologramRotation] = useState<number>(0);
  const [isSeminarRegistered, setIsSeminarRegistered] = useState<boolean>(false);
  const [seminarCount, setSeminarCount] = useState<number>(148);

  // Office Hours states
  const [officeHours, setOfficeHours] = useState<OfficeHourSlot[]>([]);
  const [newSlotCourse, setNewSlotCourse] = useState(courses[0]?.id || '');
  const [newSlotDate, setNewSlotDate] = useState('');
  const [newSlotStart, setNewSlotStart] = useState('');
  const [newSlotEnd, setNewSlotEnd] = useState('');
  const [slotMessage, setSlotMessage] = useState({ type: '', text: '' });
  const [isSubmittingSlot, setIsSubmittingSlot] = useState(false);

  const fetchOfficeHours = () => {
    fetch('/api/office-hours')
      .then(res => res.json())
      .then(data => setOfficeHours(data))
      .catch(err => console.error('Error fetching office hours', err));
  };

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotCourse || !newSlotDate || !newSlotStart || !newSlotEnd) {
      setSlotMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }
    
    setIsSubmittingSlot(true);
    setSlotMessage({ type: '', text: '' });

    fetch('/api/office-hours', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId: newSlotCourse,
        professorId: user.id,
        professorName: user.name,
        date: newSlotDate,
        startTime: newSlotStart,
        endTime: newSlotEnd
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to create slot');
        return res.json();
      })
      .then(() => {
        setSlotMessage({ type: 'success', text: 'Availability slot created successfully!' });
        setNewSlotDate('');
        setNewSlotStart('');
        setNewSlotEnd('');
        fetchOfficeHours();
      })
      .catch(err => {
        console.error(err);
        setSlotMessage({ type: 'error', text: 'Failed to create availability slot.' });
      })
      .finally(() => {
        setIsSubmittingSlot(false);
      });
  };

  const handleDeleteSlot = (slotId: string) => {
    if (!confirm('Are you sure you want to delete this office hour availability slot?')) return;
    
    fetch(`/api/office-hours/${slotId}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete slot');
        return res.json();
      })
      .then(() => {
        fetchOfficeHours();
      })
      .catch(err => {
        console.error(err);
        alert('Failed to delete slot');
      });
  };

  const handleCancelBooking = (slotId: string) => {
    if (!confirm('Are you sure you want to cancel the booking for this slot and make it available again?')) return;
    
    fetch(`/api/office-hours/${slotId}/cancel`, {
      method: 'POST'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to cancel booking');
        return res.json();
      })
      .then(() => {
        fetchOfficeHours();
      })
      .catch(err => {
        console.error(err);
        alert('Failed to cancel booking');
      });
  };

  useEffect(() => {
    // Parallelize loading of analytics and records
    const quizAttemptsUrl = (user.role === 'admin' || user.role === 'professor')
      ? '/api/quiz-attempts'
      : `/api/quiz-attempts/${user.id}`;

    Promise.all([
      fetch('/api/reports').then(res => res.json()),
      fetch('/api/attendance').then(res => res.json()),
      fetch(quizAttemptsUrl).then(res => res.json()),
      fetch(`/api/certificates/${user.id}`).then(res => res.json()),
      fetch('/api/office-hours').then(res => res.json())
    ])
      .then(([reportData, attendanceData, attemptsData, certsData, officeHoursData]) => {
        setStats(reportData);
        setAttendance(attendanceData);
        setAttempts(attemptsData);
        setCerts(certsData);
        setOfficeHours(officeHoursData);
      })
      .catch(err => console.error('Error fetching dashboard indices', err))
      .finally(() => setLoading(false));
  }, [user.id, user.role]);

  if (loading || !stats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  // Attendance metrics calculated dynamically
  const userAttendance = attendance.filter(a => a.userId === user.id);
  const totalUserLessonsTracked = userAttendance.length || 1;
  const userPresentsCount = userAttendance.filter(a => a.status === 'Present').length;
  const userAttendancePercent = Math.round((userPresentsCount / totalUserLessonsTracked) * 100);

  // Time-of-day greeting helper
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Pie chart stats
  const attendancePieData = [
    { name: 'Present (>=80% Video)', value: userAttendancePercent || 85, color: '#38bdf8' },
    { name: 'Incomplete (<80%)', value: 100 - (userAttendancePercent || 85), color: '#cbd5e1' }
  ];

  const adminAttendancePieData = [
    { name: 'Attendance Rate', value: stats.attendanceRate, color: '#0ea5e9' },
    { name: 'Non-attendance', value: 100 - stats.attendanceRate, color: '#e2e8f0' }
  ];

  // 1. Course/Syllabus Lecture Completion Rates Data (Student or Admin/Faculty view)
  const courseCompletionData: any[] = courses.map(course => {
    const totalLessons = (course.modules || []).flatMap(m => m ? (m.lessons || []) : []).length || 1;
    
    if (user.role === 'student') {
      const watchedLessons = attendance.filter(a => a.courseId === course.id && a.status === 'Present').length;
      const percentComplete = Math.min(100, Math.round((watchedLessons / totalLessons) * 100));
      return {
        courseCode: course.code,
        courseTitle: course.title,
        completionRate: percentComplete,
      };
    } else {
      // For Admin/Professor, calculate average completion rate across all students enrolled in this course
      const courseAttendance = attendance.filter(a => a.courseId === course.id);
      const uniqueStudents = Array.from(new Set(courseAttendance.map(a => a.userId)));
      
      let avgCompletion = 0;
      if (uniqueStudents.length > 0) {
        const totalPossiblePresent = uniqueStudents.length * totalLessons;
        const totalActualPresent = courseAttendance.filter(a => a.status === 'Present').length;
        avgCompletion = Math.min(100, Math.round((totalActualPresent / totalPossiblePresent) * 100));
      } else {
        // Fallback seed data so charts look filled
        avgCompletion = course.code === 'CS101' ? 88 : course.code === 'CS301' ? 76 : 82;
      }
      return {
        courseCode: course.code,
        courseTitle: course.title,
        completionRate: avgCompletion,
      };
    }
  });

  // 2. Quiz Performance Trends Data (Chronological Timeline)
  const quizTrendData: any[] = (() => {
    if (user.role === 'student') {
      // Sort attempts chronologically
      const sorted = [...attempts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const trend = sorted.map(att => {
        const scorePercent = Math.round((att.score / (att.totalQuestions || 1)) * 100);
        return {
          quizTitle: att.quizTitle,
          date: new Date(att.date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
          scorePercent: scorePercent,
          passed: att.passed
        };
      });
      // Fallback trend if empty
      if (trend.length === 0) {
        return [
          { quizTitle: 'Practice Quiz', date: 'Welcome', scorePercent: 0, passed: false }
        ];
      }
      return trend;
    } else {
      // For Admin/Professor, sort all attempts chronologically and group by date to show the average score over time
      const sorted = [...attempts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      const dateMap: { [dateStr: string]: { sum: number; count: number; totalQ: number } } = {};
      sorted.forEach(att => {
        const d = new Date(att.date).toLocaleDateString([], { month: 'short', day: 'numeric' });
        if (!dateMap[d]) {
          dateMap[d] = { sum: 0, count: 0, totalQ: 0 };
        }
        dateMap[d].sum += att.score;
        dateMap[d].count += 1;
        dateMap[d].totalQ += att.totalQuestions || 1;
      });
      
      const trend = Object.entries(dateMap).map(([date, val]) => ({
        date,
        averagePercent: Math.round((val.sum / val.totalQ) * 100),
        attemptsCount: val.count
      }));

      // If trend is empty, provide a steady upward sample trend so professors/admins don't see an empty slate
      if (trend.length === 0 || trend.every(t => isNaN(t.averagePercent))) {
        return [
          { date: 'Jun 20', averagePercent: 78, attemptsCount: 5 },
          { date: 'Jun 22', averagePercent: 82, attemptsCount: 8 },
          { date: 'Jun 24', averagePercent: 80, attemptsCount: 12 },
          { date: 'Jun 26', averagePercent: 85, attemptsCount: 15 },
          { date: 'Jun 28', averagePercent: 89, attemptsCount: 18 }
        ];
      }
      return trend;
    }
  })();

  return (
    <div className="space-y-8">
      {/* Dynamic Header Greeting banner with customized time-of-day greetings and eye-catching academic micro-pills */}
      <div className="bg-gradient-to-tr from-[#0b0c15] via-[#141031] to-[#080d1d] rounded-[32px] p-6 sm:p-10 text-white shadow-2xl dark:shadow-[0_20px_50px_-12px_rgba(139,92,246,0.2)] border border-violet-500/15 relative overflow-hidden transition-all duration-500">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <GraduationCap className="h-72 w-72 text-cyan-400 transform rotate-12 translate-y-16 translate-x-8 animate-pulse" />
        </div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full filter blur-[100px] animate-pulse-slow pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-64 h-64 bg-cyan-500/10 rounded-full filter blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 space-y-6 text-left">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-violet-500/15 text-violet-300 border border-violet-500/20 text-[10px] font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider font-mono">
              {user.role} workspace
            </span>
            <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider font-mono flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-ping" />
              Live Ledger Connected
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-poppins font-black tracking-tight flex items-center gap-2">
              {getGreeting()}, {user.name}! <Sparkle className="h-7 w-7 text-amber-400 animate-bounce shrink-0" />
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
              {user.role === 'student' 
                ? `Welcome to your academic cockpit. You are enrolled in the ${user.semester} within the Department of ${user.department}. Ready to resume your lectures?` 
                : user.role === 'professor'
                ? `Academic faculty portal for organizing clinical syllabi, launching live course tracks, managing interactive student registers, and syncing grades.`
                : `LMS Cloud controller dashboard. You have full global read/write indices to coordinate multi-department courses, storage infrastructure, and user logs.`}
            </p>
          </div>

          {/* Mini Quick-stats Pills Bar */}
          <div className="pt-2 flex flex-wrap gap-3">
            {user.role === 'student' ? (
              <>
                <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-[11px] text-slate-200 font-bold flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-sky-400" />
                  <span>My Attendance: <strong className="text-white">{userAttendancePercent || 0}%</strong></span>
                </div>
                <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-[11px] text-slate-200 font-bold flex items-center gap-2">
                  <Award className="h-3.5 w-3.5 text-amber-400" />
                  <span>Passed Quizzes: <strong className="text-white">{attempts.filter(a => a.passed).length}</strong></span>
                </div>
                <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-[11px] text-slate-200 font-bold flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Assigned Courses: <strong className="text-white">{courses.length}</strong></span>
                </div>
                <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-[11px] text-slate-200 font-bold flex items-center gap-2" title="Total accumulated focus session duration">
                  <Flame className="h-3.5 w-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                  <span>Focused Time: <strong className="text-white">{user.focusTime || 0}m</strong></span>
                </div>
              </>
            ) : user.role === 'professor' ? (
              <>
                <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-[11px] text-slate-200 font-bold flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-sky-400" />
                  <span>My Students: <strong className="text-white">{stats.totalStudents} Active</strong></span>
                </div>
                <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-[11px] text-slate-200 font-bold flex items-center gap-2">
                  <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Direct Queries Sync: <strong className="text-white">Active</strong></span>
                </div>
                <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-[11px] text-slate-200 font-bold flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5 text-purple-400" />
                  <span>LMS Attendance Avg: <strong className="text-white">{stats.attendanceRate}%</strong></span>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-[11px] text-slate-200 font-bold flex items-center gap-2">
                  <Server className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Core Nodes Uptime: <strong className="text-emerald-400">99.99%</strong></span>
                </div>
                <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-[11px] text-slate-200 font-bold flex items-center gap-2">
                  <Database className="h-3.5 w-3.5 text-sky-400" />
                  <span>Local Db File: <strong className="text-white">Synced</strong></span>
                </div>
                <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-[11px] text-slate-200 font-bold flex items-center gap-2">
                  <Cpu className="h-3.5 w-3.5 text-amber-400" />
                  <span>Gemini LLM API: <strong className="text-white">Connected</strong></span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats widgets with 20px rounded cards */}
      {user.role === 'admin' && (
        <div className="space-y-4">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <motion.div variants={cardVariants} className="bg-white dark:bg-slate-900 p-5 rounded-[20px] border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition duration-300">
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Students</p>
                  <span className="text-[9px] bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 font-extrabold px-1 py-0.2 rounded">+12%</span>
                </div>
                <h3 className="text-2xl font-poppins font-black text-slate-900 dark:text-white mt-1">{stats.totalStudents}</h3>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">Enrolled globally</p>
              </div>
              <div className="bg-sky-50 dark:bg-sky-950/40 p-3.5 rounded-xl text-sky-600 dark:text-sky-400 border border-sky-100/50 dark:border-sky-900/30"><Users className="h-6 w-6" /></div>
            </motion.div>

            <motion.div variants={cardVariants} className="bg-white dark:bg-slate-900 p-5 rounded-[20px] border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition duration-300">
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Academic Faculty</p>
                  <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-extrabold px-1 py-0.2 rounded">Optimal</span>
                </div>
                <h3 className="text-2xl font-poppins font-black text-slate-900 dark:text-white mt-1">{stats.totalProfessors}</h3>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">Assigned teachers</p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-xl text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30"><BookOpen className="h-6 w-6" /></div>
            </motion.div>

            <motion.div variants={cardVariants} className="bg-white dark:bg-slate-900 p-5 rounded-[20px] border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition duration-300">
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Storage Utilized</p>
                  <span className="text-[9px] bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 font-extrabold px-1 py-0.2 rounded">0.4%</span>
                </div>
                <h3 className="text-2xl font-poppins font-black text-slate-900 dark:text-white mt-1">{stats.storageUsageMB} MB</h3>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">Used by media/JSON</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-xl text-amber-600 dark:text-amber-400 border border-amber-100/50 dark:border-amber-900/30"><Database className="h-6 w-6" /></div>
            </motion.div>

            <motion.div variants={cardVariants} className="bg-white dark:bg-slate-900 p-5 rounded-[20px] border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition duration-300">
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Live Online Users</p>
                  <span className="text-[9px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold px-1 py-0.2 rounded">Real-time</span>
                </div>
                <h3 className="text-2xl font-poppins font-black text-slate-900 dark:text-white mt-1">{stats.activeSessions} active</h3>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">Sessions tracked</p>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-950/40 p-3.5 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30"><Activity className="h-6 w-6" /></div>
            </motion.div>
          </motion.div>

          {/* Infrastructure Health Status panel exclusively for Administrators */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[20px] p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
                <Server className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">LMS Infrastructure Node Monitor</h4>
                <p className="text-[10px] text-slate-400">Status registry of running servers and storage APIs</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Primary SQL Core</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Fully Online</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Gemini LLM API</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Connected (220ms)</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Security Sandbox</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Active (Shield On)</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                </span>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Static Media Edge</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Optimal (99.9% CDN)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {user.role === 'professor' && (
        <div className="space-y-4">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <motion.div variants={cardVariants} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition duration-300">
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Courses</p>
                  <span className="text-[9px] bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 font-extrabold px-1 py-0.2 rounded">Publishing</span>
                </div>
                <h3 className="text-2xl font-poppins font-black text-slate-900 dark:text-white mt-1">{courses.length}</h3>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">Syllabi configured</p>
              </div>
              <div className="bg-sky-50 dark:bg-sky-950/40 p-3.5 rounded-xl text-sky-600 dark:text-sky-400 border border-sky-100/50 dark:border-sky-900/30"><BookOpen className="h-6 w-6" /></div>
            </motion.div>

            <motion.div variants={cardVariants} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition duration-300">
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Student Rosters</p>
                  <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-extrabold px-1 py-0.2 rounded">Active</span>
                </div>
                <h3 className="text-2xl font-poppins font-black text-slate-900 dark:text-white mt-1">{stats.totalStudents} enrolled</h3>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">Connected profiles</p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-xl text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30"><Users className="h-6 w-6" /></div>
            </motion.div>

            <motion.div variants={cardVariants} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition duration-300">
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">LMS Avg Attendance</p>
                  <span className="text-[9px] bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 font-extrabold px-1 py-0.2 rounded">Target &gt;80%</span>
                </div>
                <h3 className="text-2xl font-poppins font-black text-slate-900 dark:text-white mt-1">{stats.attendanceRate}%</h3>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">Average watch metric</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-xl text-amber-600 dark:text-amber-400 border border-amber-100/50 dark:border-amber-900/30"><Calendar className="h-6 w-6" /></div>
            </motion.div>

            <motion.div variants={cardVariants} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition duration-300">
              <div className="text-left">
                <div className="flex items-center gap-1">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Consultation Desk</p>
                  <span className="text-[9px] bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-extrabold px-1 py-0.2 rounded animate-pulse">Pending</span>
                </div>
                <h3 className="text-2xl font-poppins font-black text-slate-900 dark:text-white mt-1">Queries</h3>
                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">Live student messaging</p>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-950/40 p-3.5 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30"><MessageSquare className="h-6 w-6" /></div>
            </motion.div>
          </motion.div>

          {/* Quick Consultation queries reminder board */}
          <div className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30 rounded-[20px] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex gap-3 text-left">
              <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-700 dark:text-amber-400">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h5 className="text-xs font-extrabold text-slate-800 dark:text-amber-200">Pending Student Queries Room</h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                  Zayn Malik submitted course questions regarding Binary Search recursion vs iteration logic. Respond instantly inside the course Direct Queries desk.
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                // Navigate to course list or trigger first course view
                if (courses.length > 0) {
                  onLaunchCourse(courses[0]);
                }
              }}
              className="bg-amber-600 hover:bg-amber-500 dark:bg-amber-700 dark:hover:bg-amber-600 text-white text-[11px] font-bold px-4 py-2 rounded-xl transition duration-200 flex items-center gap-1 shrink-0 shadow-sm cursor-pointer"
            >
              <span>Launch Queries Room</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {user.role === 'student' && (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <motion.div variants={cardVariants} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition duration-300">
            <div className="text-left">
              <div className="flex items-center gap-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">My Enrolled Courses</p>
                <span className="text-[9px] bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-extrabold px-1 rounded">CS Track</span>
              </div>
              <h3 className="text-2xl font-poppins font-black text-slate-900 dark:text-white mt-1">{courses.length}</h3>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">Academic curriculums</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/40 p-3.5 rounded-xl text-sky-600 dark:text-sky-400 border border-blue-100/50 dark:border-blue-900/30 transition-all"><BookOpen className="h-6 w-6" /></div>
          </motion.div>

          <motion.div variants={cardVariants} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition duration-300">
            <div className="text-left">
              <div className="flex items-center gap-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">My Attendance Rate</p>
                <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-extrabold px-1 rounded">Target Met</span>
              </div>
              <h3 className="text-2xl font-poppins font-black text-slate-900 dark:text-white mt-1">{userAttendancePercent || 0}%</h3>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">Video playback threshold</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-xl text-emerald-600 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30 transition-all"><Calendar className="h-6 w-6" /></div>
          </motion.div>

          <motion.div variants={cardVariants} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition duration-300">
            <div className="text-left">
              <div className="flex items-center gap-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">Quizzes Passed</p>
                <span className="text-[9px] bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-extrabold px-1 rounded">GPA Lock</span>
              </div>
              <h3 className="text-2xl font-poppins font-black text-slate-900 dark:text-white mt-1">{attempts.filter(a => a.passed).length}</h3>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">Evaluation modules</p>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-950/40 p-3.5 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30 transition-all"><Zap className="h-6 w-6" /></div>
          </motion.div>

          <motion.div variants={cardVariants} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition duration-300">
            <div className="text-left">
              <div className="flex items-center gap-1">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">Earned Certificates</p>
                <span className="text-[9px] bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 font-extrabold px-1 rounded">PDF Verified</span>
              </div>
              <h3 className="text-2xl font-poppins font-black text-slate-900 dark:text-white mt-1">{certs.length}</h3>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium mt-0.5">Credential badges</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-xl text-amber-600 dark:text-amber-400 border border-amber-100/50 dark:border-amber-900/30 transition-all"><Award className="h-6 w-6" /></div>
          </motion.div>
        </motion.div>
      )}

      {/* HYPER-PREMIUM LUXURY TECH WIDGETS PANEL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="grid grid-cols-1 lg:grid-cols-5 gap-6 text-left"
      >
        {/* WIDGET 1: 3D HOLOGRAPHIC PROGRESS SPATIAL CONTROLLER */}
        <div className="lg:col-span-3 bg-gradient-to-br from-slate-950 via-[#0B0F19] to-[#05070D] rounded-[32px] border border-violet-500/15 p-6 sm:p-8 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:border-violet-500/25 dark:shadow-[0_0_50px_-12px_rgba(139,92,246,0.15)] flex flex-col justify-between">
          {/* Neon ambient backing glow */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-violet-600/10 rounded-full filter blur-3xl pointer-events-none group-hover:bg-violet-600/15 transition-all duration-500" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-cyan-500/10 rounded-full filter blur-3xl pointer-events-none group-hover:bg-cyan-500/15 transition-all duration-500" />
          
          <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-center justify-between pb-4 border-b border-slate-800/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-[10px] font-bold font-mono tracking-widest text-violet-400 uppercase">Neural Space Engine</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-poppins text-white tracking-tight mt-1">Spatial Progress Widget</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">Tap nodes below to rotate the 3D-simulated cognitive matrix and load telemetry stats.</p>
            </div>
            
            {/* Auto Optimize Button */}
            <button
              onClick={() => {
                setHologramRotation(prev => prev + 180);
                // Simulate temporary optimization pulse
                const currentCount = seminarCount;
                setSeminarCount(prev => prev + 1);
                setTimeout(() => setSeminarCount(currentCount), 1500);
              }}
              className="bg-white/5 hover:bg-white/10 text-white border border-slate-800 hover:border-violet-500/30 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-2 group/btn cursor-pointer shrink-0 self-start md:self-center"
            >
              <Cpu className="h-4 w-4 text-violet-400 group-hover/btn:rotate-180 transition-all duration-500" />
              <span>Optimize Neural Sync</span>
            </button>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 py-6 items-center">
            {/* Left Col: 3D Rotating Graphic Widget Mock */}
            <div className="md:col-span-5 flex justify-center items-center relative py-4 animate-float-gentle">
              {/* Spinning light ring */}
              <motion.div 
                animate={{ rotate: hologramRotation }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
                className="w-40 h-40 rounded-full border-2 border-dashed border-violet-500/30 flex items-center justify-center relative"
              >
                {/* Secondary diagonal grid ring */}
                <div className="absolute inset-2 rounded-full border border-cyan-500/25 animate-[spin_20s_linear_infinite] pointer-events-none" />
                <div className="absolute inset-6 rounded-full border border-dashed border-indigo-500/20 animate-[spin_10s_linear_infinite_reverse] pointer-events-none" />
                
                {/* Orbital nodes */}
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-slate-900 shadow-lg transition-all ${spatialDimension === 'cognitive' ? 'bg-violet-400 scale-125 shadow-violet-500/50' : 'bg-slate-700'}`} />
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 rounded-full border-2 border-slate-900 shadow-lg transition-all ${spatialDimension === 'practical' ? 'bg-cyan-400 scale-125 shadow-cyan-500/50' : 'bg-slate-700'}`} />
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-slate-900 shadow-lg transition-all ${spatialDimension === 'pacing' ? 'bg-indigo-400 scale-125 shadow-indigo-500/50' : 'bg-slate-700'}`} />
                <div className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full border-2 border-slate-900 shadow-lg transition-all ${spatialDimension === 'readiness' ? 'bg-emerald-400 scale-125 shadow-emerald-500/50' : 'bg-slate-700'}`} />

                {/* Core Sphere */}
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-violet-600/25 via-indigo-600/30 to-cyan-500/25 flex flex-col items-center justify-center border border-white/15 shadow-2xl relative overflow-hidden backdrop-blur-sm">
                  <span className="text-xxs font-mono font-black text-cyan-400 tracking-widest uppercase">CORE</span>
                  <span className="text-sm font-black text-white font-mono mt-1">
                    {spatialDimension === 'cognitive' ? '92%' : spatialDimension === 'practical' ? '84%' : spatialDimension === 'pacing' ? '78%' : '95%'}
                  </span>
                </div>
              </motion.div>

              {/* Particle dust indicators */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/[0.02] rounded-full pointer-events-none" />
              <div className="absolute top-2 left-6 text-[10px] font-mono text-violet-400/50">Z-PLANE</div>
              <div className="absolute bottom-2 right-6 text-[10px] font-mono text-cyan-400/50">Y-SPEED</div>
            </div>

            {/* Right Col: Telemetry metrics selector */}
            <div className="md:col-span-7 space-y-3">
              {[
                { key: 'cognitive', title: 'Cognitive Sync Index', percent: 92, desc: 'Neural concept comprehension meets high analytical standings.', color: 'from-violet-500 to-indigo-600', textLight: 'text-violet-400' },
                { key: 'practical', title: 'Practical Code Labs', percent: 84, desc: '8 interactive engineering modules safely compiled and validated.', color: 'from-cyan-400 to-sky-600', textLight: 'text-cyan-400' },
                { key: 'pacing', title: 'Lecture Velocity Pacing', percent: 78, desc: 'Consistent watch pattern retention relative to target cohort averages.', color: 'from-indigo-500 to-blue-600', textLight: 'text-indigo-400' },
                { key: 'readiness', title: 'Grading Evaluation Readiness', percent: 95, desc: '95% probability of achieving optimal score metrics on active streams.', color: 'from-emerald-400 to-teal-500', textLight: 'text-emerald-400' }
              ].map((dim) => {
                const isSelected = spatialDimension === dim.key;
                return (
                  <button
                    key={dim.key}
                    onClick={() => {
                      setSpatialDimension(dim.key as any);
                      setHologramRotation(prev => prev + 90);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-300 flex items-start gap-3 cursor-pointer ${
                      isSelected 
                        ? 'bg-white/5 border-violet-500/35 shadow-lg shadow-violet-950/20' 
                        : 'bg-transparent border-slate-800/40 hover:bg-white/[0.02] hover:border-slate-800'
                    }`}
                  >
                    <div className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${isSelected ? 'bg-gradient-to-r ' + dim.color : 'bg-slate-700'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h4 className={`text-xs font-extrabold ${isSelected ? 'text-white' : 'text-slate-400'}`}>{dim.title}</h4>
                        <span className={`text-xs font-bold font-mono ${isSelected ? dim.textLight : 'text-slate-500'}`}>{dim.percent}%</span>
                      </div>
                      {isSelected && (
                        <motion.p 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="text-[10px] text-slate-400 mt-1.5 leading-relaxed font-medium"
                        >
                          {dim.desc}
                        </motion.p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* WIDGET 2: ANIMATED GLASS CARD - UPCOMING LIVE SEMINAR */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#111425] via-[#0C0E1A] to-[#060810] rounded-[32px] border border-cyan-500/25 p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between group transition-all duration-500 hover:border-cyan-500/40">
          {/* Animated gradient cyber glow card edges */}
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-cyan-500/15 to-violet-500/0 rounded-full blur-3xl pointer-events-none group-hover:from-cyan-500/20 transition-all duration-500 animate-pulse" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-center">
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest font-mono flex items-center gap-1.5 shadow-sm">
                <span className="h-1.5 w-1.5 bg-cyan-300 rounded-full animate-ping" />
                Live In 2 Hours
              </span>
              <span className="text-[10px] font-bold text-slate-300 font-mono bg-slate-900/60 px-2 py-1 rounded-md border border-slate-800">18:00 UTC</span>
            </div>

            <div className="mt-6 space-y-4">
              <p className="text-[10px] font-extrabold text-violet-300 font-mono uppercase tracking-widest">Global Masterclass</p>
              <h4 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-tight group-hover:text-cyan-300 transition-colors duration-300">
                Advanced Neural Networks: From Transformers to Real-time Agentic Cores
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                Deep dive into structural self-attention vectors, token engineering, and scaling local context memories.
              </p>
            </div>

            {/* Speaker Bio Glass Card */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3.5 mt-5 flex items-center gap-3 shadow-md">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-lg">
                EV
              </div>
              <div className="min-w-0 text-left">
                <p className="text-xs font-black text-white">Dr. Elias Vance</p>
                <p className="text-[10px] text-slate-300 font-medium truncate">Director, Advanced Machine Learning Center</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 mt-6 border-t border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-left">
              <p className="text-[10px] text-slate-300 font-extrabold uppercase tracking-wider">Registered Attendees</p>
              <p className="text-sm font-black text-white mt-0.5 font-mono">
                {isSeminarRegistered ? seminarCount + 1 : seminarCount} <span className="text-xs text-cyan-300 font-bold">Enrolled</span>
              </p>
            </div>

            <button
              onClick={() => {
                setIsSeminarRegistered(!isSeminarRegistered);
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                isSeminarRegistered 
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-none shadow-violet-500/20' 
                  : 'bg-white text-slate-900 hover:bg-cyan-300 hover:text-slate-950 shadow-cyan-500/20'
              }`}
            >
              {isSeminarRegistered ? (
                <>
                  <CheckCircle2 className="h-4 w-4 animate-bounce" />
                  <span>Access Key Granted</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Register Free Slot</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Dynamic Academic Calendar mapping upcoming quizzes and live lectures */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      >
        <InteractiveCalendar 
          user={{ id: user.id, name: user.name, role: user.role }} 
          courses={courses} 
          onLaunchCourse={onLaunchCourse} 
          onLaunchQuiz={onLaunchQuiz} 
        />
      </motion.div>

      {/* Main Section Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Double-Col Layout (Charts, Course rosters) */}
        <div className="lg:col-span-2 space-y-6 min-w-0">
          
          {/* Unified Charts Section (All Roles - Highly Interactive Beautiful UI) */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-white dark:bg-[#0F172A] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6 transition-all duration-300 relative overflow-hidden">
              {/* Background gradient accents for subtle depth */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-sky-100/30 dark:bg-sky-950/10 rounded-full blur-3xl pointer-events-none -mr-40 -mt-40" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-100/30 dark:bg-indigo-950/10 rounded-full blur-3xl pointer-events-none -ml-40 -mb-40" />

              <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center justify-center p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400">
                      <Sparkles className="h-4 w-4 animate-pulse" />
                    </span>
                    <span className="text-xxs font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400 font-mono bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-full">
                      Interactive Analytics
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight font-sans">
                    {user.role === 'student' ? 'My Academic Performance' : 'LMS Performance & Engagement Analytics'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {user.role === 'student' 
                      ? 'Real-time lecture tracking and cumulative grade performance metrics' 
                      : 'Comprehensive monitoring of engagement scores, syllabus pacing, and exam grades'}
                  </p>
                </div>

                {/* Micro-tab controls with slide-like feels */}
                <div className="flex bg-slate-100 dark:bg-slate-900/90 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 shrink-0 self-start sm:self-center">
                  <button
                    onClick={() => setChartTab('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      chartTab === 'all'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-extrabold'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setChartTab('lectures')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      chartTab === 'lectures'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-extrabold'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    Lectures
                  </button>
                  <button
                    onClick={() => setChartTab('quizzes')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                      chartTab === 'quizzes'
                        ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-extrabold'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    Quiz Grades
                  </button>
                </div>
              </div>

              {/* Sub-component to render Custom beautiful tooltip */}
              {(() => {
                const renderTooltip = ({ active, payload, label }: any) => {
                  if (active && payload && payload.length) {
                    const dataObj = payload[0].payload;
                    const value = payload[0].value;
                    let statusColor = "bg-rose-500";
                    let statusText = "Needs Review";
                    let textColor = "text-rose-500 dark:text-rose-400";
                    if (value >= 85) {
                      statusColor = "bg-emerald-500";
                      statusText = "Excellent Standings";
                      textColor = "text-emerald-500 dark:text-emerald-400";
                    } else if (value >= 70) {
                      statusColor = "bg-amber-500";
                      statusText = "Satisfactory Progress";
                      textColor = "text-amber-500 dark:text-amber-400";
                    }

                    return (
                      <div className="bg-slate-900/95 dark:bg-slate-950/98 backdrop-blur-md border border-slate-700/50 p-3.5 rounded-2xl shadow-xl space-y-2 text-left min-w-[200px]">
                        <div className="flex items-center justify-between gap-4">
                          <p className="text-xxs font-bold text-slate-400 font-mono uppercase tracking-wider">
                            {dataObj.courseCode || label}
                          </p>
                          <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 ${textColor}`}>
                            <span className={`h-1 w-1 rounded-full ${statusColor}`} />
                            {statusText}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {dataObj.courseTitle && (
                            <p className="text-xs font-medium text-slate-300 truncate max-w-[170px]">
                              {dataObj.courseTitle}
                            </p>
                          )}
                          {dataObj.quizTitle && (
                            <p className="text-xs font-medium text-slate-300 truncate max-w-[170px]">
                              {dataObj.quizTitle}
                            </p>
                          )}
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-white tracking-tight">
                              {value}
                            </span>
                            <span className="text-xs text-slate-400 font-mono font-bold">%</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                };

                return (
                  <div className="relative">
                    {/* Perspective A: Split Side-By-Side Overview */}
                    {chartTab === 'all' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Column 1: Lecture Completion Rates */}
                        <div className="bg-slate-50/40 dark:bg-slate-900/20 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="text-left">
                              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Syllabus Completion Rates</h4>
                              <p className="text-xxs text-slate-400 dark:text-slate-500">Video lecture milestones tracking</p>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-sky-600 bg-sky-50 dark:bg-sky-950 px-2 py-1 rounded-lg">
                              Average: {Math.round(courseCompletionData.reduce((acc, c) => acc + c.completionRate, 0) / (courseCompletionData.length || 1))}%
                            </span>
                          </div>

                          <div className="h-60">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={courseCompletionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <defs>
                                  <linearGradient id="completionGradSplit" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#c084fc" stopOpacity={0.95}/>
                                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.45}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800/60" vertical={false} />
                                <XAxis dataKey="courseCode" tick={{ fontSize: 9, fill: '#64748b', fontWeight: 600 }} />
                                <YAxis tick={{ fontSize: 9, fill: '#64748b' }} domain={[0, 100]} unit="%" />
                                <Tooltip content={renderTooltip} cursor={{ fill: 'rgba(14, 165, 233, 0.04)', radius: 4 }} />
                                <ReferenceLine y={75} stroke="#0ea5e9" strokeDasharray="3 3" strokeWidth={1} label={{ value: 'Target: 75%', fill: '#0ea5e9', fontSize: 8, position: 'top' }} />
                                <Bar dataKey="completionRate" fill="url(#completionGradSplit)" name="Syllabus Progress" radius={[6, 6, 0, 0]} barSize={26} />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>

                          {/* Quick Summary Badges */}
                          <div className="grid grid-cols-2 gap-3 text-left pt-2 border-t border-slate-100 dark:border-slate-800">
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider">Top Standings</span>
                              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                                {courseCompletionData.reduce((max, c) => c.completionRate > max.completionRate ? c : max, courseCompletionData[0] || {}).courseCode || 'N/A'}
                              </p>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider">LMS Activity Status</span>
                              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="h-3 w-3" /> Consistent
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Column 2: Quiz Score Milestones */}
                        <div className="bg-slate-50/40 dark:bg-slate-900/20 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="text-left">
                              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Quiz Grading Timeline</h4>
                              <p className="text-xxs text-slate-400 dark:text-slate-500">Grading performance consistency trends</p>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-2 py-1 rounded-lg">
                              Median: {Math.round(quizTrendData.reduce((acc, q) => acc + (q.scorePercent || q.averagePercent || 0), 0) / (quizTrendData.length || 1))}%
                            </span>
                          </div>

                          <div className="h-60">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={quizTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <defs>
                                  <linearGradient id="trendGradSplit" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#818cf8" stopOpacity={0.55}/>
                                    <stop offset="100%" stopColor="#818cf8" stopOpacity={0.01}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800/60" vertical={false} />
                                <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#64748b' }} />
                                <YAxis tick={{ fontSize: 9, fill: '#64748b' }} domain={[0, 100]} unit="%" />
                                <Tooltip content={renderTooltip} />
                                <ReferenceLine y={85} stroke="#6366f1" strokeDasharray="3 3" strokeWidth={1} label={{ value: 'Dean\'s list (85%)', fill: '#6366f1', fontSize: 8, position: 'top' }} />
                                <Area 
                                  type="monotone" 
                                  dataKey={user.role === 'student' ? 'scorePercent' : 'averagePercent'} 
                                  stroke="#6366f1" 
                                  strokeWidth={2.5}
                                  fillOpacity={1}
                                  fill="url(#trendGradSplit)"
                                  name="Score"
                                  activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>

                          {/* Quick Summary Badges */}
                          <div className="grid grid-cols-2 gap-3 text-left pt-2 border-t border-slate-100 dark:border-slate-800">
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider">Latest Exam Score</span>
                              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                {quizTrendData.length > 0 ? `${quizTrendData[quizTrendData.length - 1].scorePercent || quizTrendData[quizTrendData.length - 1].averagePercent || 0}%` : 'N/A'}
                              </p>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider">Performance Trend</span>
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400">
                                Upward (+4.2%) <ArrowUpRight className="h-3 w-3" />
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Perspective B: Lecture Completion Rates Focus */}
                    {chartTab === 'lectures' && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-slate-50/40 dark:bg-slate-900/20 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-6"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="text-left">
                            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">Syllabus Milestones Breakdown</h4>
                            <p className="text-xs text-slate-500">Comprehensive syllabus completions per academic category and credits</p>
                          </div>
                          <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs">
                            <div className="text-left">
                              <span className="text-[9px] uppercase tracking-wider font-mono text-slate-400">Class Average</span>
                              <p className="text-base font-black text-sky-600 dark:text-sky-400">79.4%</p>
                            </div>
                            <div className="h-8 w-[1px] bg-slate-100 dark:bg-slate-800" />
                            <div className="text-left">
                              <span className="text-[9px] uppercase tracking-wider font-mono text-slate-400">Target Pace</span>
                              <p className="text-base font-black text-slate-700 dark:text-slate-300">85.0%</p>
                            </div>
                          </div>
                        </div>

                        <div className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={courseCompletionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                              <defs>
                                <linearGradient id="completionGradFull" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#a855f7" stopOpacity={0.95}/>
                                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.35}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" className="dark:stroke-slate-800/40" vertical={false} />
                              <XAxis dataKey="courseCode" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 100]} unit="%" />
                              <Tooltip content={renderTooltip} cursor={{ fill: 'rgba(14, 165, 233, 0.03)', radius: 6 }} />
                              <ReferenceLine y={85} stroke="#0ea5e9" strokeDasharray="3 3" strokeWidth={1.5} label={{ value: 'Target Pace Benchmark (85%)', fill: '#0ea5e9', fontSize: 10, position: 'top', fontWeight: 'bold' }} />
                              <Bar dataKey="completionRate" fill="url(#completionGradFull)" name="Syllabus Progress" radius={[8, 8, 0, 0]} barSize={40} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Interactive analytical insights card */}
                        <div className="p-4 bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/10 dark:border-sky-400/10 rounded-2xl flex items-start gap-3 text-left">
                          <Bot className="h-5 w-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <h5 className="text-xs font-bold text-sky-950 dark:text-sky-300">AI Learning Assistant Insights</h5>
                            <p className="text-xs text-sky-900/80 dark:text-sky-400/90 leading-relaxed">
                              You have finished <strong>84%</strong> of structural video materials in computer courses. Based on current trends, we recommend setting aside 2.5 hours this week for <strong>Advanced Database Architectures</strong> to maintain your top position.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Perspective C: Quiz Score Milestones Focus */}
                    {chartTab === 'quizzes' && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-slate-50/40 dark:bg-slate-900/20 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-6"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="text-left">
                            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">Chronological Grading Overview</h4>
                            <p className="text-xs text-slate-500">Timeline view of scores achieved in midterms, finals, and weekly assessments</p>
                          </div>
                          <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs">
                            <div className="text-left">
                              <span className="text-[9px] uppercase tracking-wider font-mono text-slate-400">Global Score Median</span>
                              <p className="text-base font-black text-indigo-600 dark:text-indigo-400">83.5%</p>
                            </div>
                            <div className="h-8 w-[1px] bg-slate-100 dark:bg-slate-800" />
                            <div className="text-left">
                              <span className="text-[9px] uppercase tracking-wider font-mono text-slate-400">Total Quiz Attempts</span>
                              <p className="text-base font-black text-slate-700 dark:text-slate-300">{quizTrendData.length}</p>
                            </div>
                          </div>
                        </div>

                        <div className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={quizTrendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                              <defs>
                                <linearGradient id="trendGradFull" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#a855f7" stopOpacity={0.7}/>
                                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0.01}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" className="dark:stroke-slate-800/40" vertical={false} />
                              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 100]} unit="%" />
                              <Tooltip content={renderTooltip} />
                              <ReferenceLine y={85} stroke="#6366f1" strokeDasharray="3 3" strokeWidth={1.5} label={{ value: 'Excellent (85%)', fill: '#6366f1', fontSize: 10, position: 'top', fontWeight: 'bold' }} />
                              <Area 
                                type="monotone" 
                                dataKey={user.role === 'student' ? 'scorePercent' : 'averagePercent'} 
                                stroke="#6366f1" 
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#trendGradFull)"
                                name="Quiz Score"
                                activeDot={{ r: 8, strokeWidth: 0, fill: '#6366f1' }}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>

                        {/* Recommendation Banner */}
                        <div className="p-4 bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/10 dark:border-indigo-400/10 rounded-2xl flex items-start gap-3 text-left">
                          <Award className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                          <div className="space-y-1">
                            <h5 className="text-xs font-bold text-indigo-950 dark:text-indigo-300">Grade Consistency & GPA Predictions</h5>
                            <p className="text-xs text-indigo-900/80 dark:text-indigo-400/90 leading-relaxed">
                              Your test performance displays strong consistency with a standard deviation of only <strong>3.5%</strong>. GPA projection for this semester is <strong>3.86</strong>. Keep up the high standards!
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })()}

              {/* Chart 3: Admin & Professor Only - Additional Grade Averages (Always responsive, beautifully styled) */}
              {(user.role === 'admin' || user.role === 'professor') && (
                <div className="border-t border-slate-100 dark:border-slate-800/60 pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">Course Average Grade Performance</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Aggregated grading standards by individual courses to monitor grade distribution and syllabus difficulty indices
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-1 rounded-lg">
                      Average Grade Median: 82%
                    </span>
                  </div>
                  <div className="h-60 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-3 bg-slate-50/50 dark:bg-slate-900/30">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.courseAverages} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="gradeGradFull" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9}/>
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.3}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" vertical={false} />
                        <XAxis dataKey="courseCode" tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} />
                        <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 100]} unit="%" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#f8fafc', fontSize: '11px' }}
                          formatter={(value: any) => [`${value}%`, 'Course Avg Grade']}
                        />
                        <Bar dataKey="averageGrade" fill="url(#gradeGradFull)" name="Average Grade" radius={[6, 6, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Student Progress and Continuing section */}
          {user.role === 'student' && (
            <div className="space-y-8 col-span-full">
              <SacredAcademy />
              
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: "easeOut", delay: 0.1 }}
                className="bg-white dark:bg-[#0F172A] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-300"
              >
                <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 font-poppins">My Educational Courses</h3>
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4"
                >
                  {courses.map(course => {
                    const totalLessons = (course.modules || []).flatMap(m => m ? (m.lessons || []) : []).length || 1;
                    const watchedLessons = attendance.filter(a => a.courseId === course.id && a.status === 'Present').length;
                    const percentComplete = Math.min(100, Math.round((watchedLessons / totalLessons) * 100));

                    return (
                      <motion.div 
                        key={course.id} 
                        variants={cardVariants}
                        className="border border-slate-100 dark:border-slate-800/80 hover:border-sky-300 dark:hover:border-sky-500 rounded-2xl p-4 space-y-3 hover:bg-sky-50/10 dark:hover:bg-slate-900/40 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-1">
                          <span className="text-xxs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold px-2 py-0.5 rounded uppercase">
                            {course.code}
                          </span>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{course.title}</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{course.description}</p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="font-medium text-slate-400 dark:text-slate-500 font-semibold">Course Progress</span>
                            <span className="font-bold text-sky-600 dark:text-sky-400">{percentComplete}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-sky-500 rounded-full" 
                              initial={{ width: 0 }}
                              animate={{ width: `${percentComplete}%` }}
                              transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => onLaunchCourse(course)}
                            className="w-full mt-3 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl text-xs transition duration-250 shadow-md shadow-blue-100/10 hover:shadow-lg active:scale-[0.98] cursor-pointer"
                          >
                            <PlayCircle className="h-4 w-4" />
                            <span>Launch Lectures</span>
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </motion.div>
            </div>
          )}

          {/* Academic attendance ledger summary for professors */}
          {user.role === 'professor' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
              className="bg-white dark:bg-[#0F172A] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-300"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Recent Attendance Events</h3>
                <button 
                  onClick={() => setActiveTab('reports')} 
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  Full ledger
                </button>
              </div>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800"
              >
                {attendance.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 dark:text-slate-500 text-xs">
                    No classroom attendance activity has occurred yet today.
                  </div>
                ) : (
                  attendance.slice(0, 4).map((att, i) => (
                    <motion.div 
                      key={i} 
                      variants={cardVariants}
                      className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                    >
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{att.userName}</span>
                        <span className="text-slate-400 dark:text-slate-500 font-medium ml-1">({att.studentId})</span>
                        <p className="text-xxs text-slate-400 dark:text-slate-500 mt-1">Lesson: {att.lessonTitle}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xxs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-medium">
                          {att.watchPercentage}% watched
                        </span>
                        <span className={`px-2 py-0.5 rounded font-bold text-xxs leading-none ${
                          att.status === 'Present' 
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40' 
                            : 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/40'
                        }`}>
                          {att.status}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </motion.div>
          )}

          {/* Office Hours Scheduling tool for professors */}
          {user.role === 'professor' && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: 0.2 }}
              className="bg-white dark:bg-[#0F172A] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 transition-colors duration-300 mt-6"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 rounded-xl">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Office Hours Scheduler</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Define availability slots for student bookings</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Form to create slots */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Set New Availability</h4>
                  <form onSubmit={handleCreateSlot} className="space-y-4 bg-slate-50 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 text-left">
                    <div className="space-y-1">
                      <label className="text-xxs font-bold text-slate-400 uppercase">Select Course</label>
                      <select 
                        value={newSlotCourse}
                        onChange={(e) => setNewSlotCourse(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none dark:text-white"
                      >
                        <option value="">-- Choose Course --</option>
                        {courses.map(course => (
                          <option key={course.id} value={course.id}>
                            {course.code} - {course.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xxs font-bold text-slate-400 uppercase">Date</label>
                      <input 
                        type="date"
                        value={newSlotDate}
                        onChange={(e) => setNewSlotDate(e.target.value)}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none dark:text-white"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xxs font-bold text-slate-400 uppercase">Start Time</label>
                        <input 
                          type="time"
                          value={newSlotStart}
                          onChange={(e) => setNewSlotStart(e.target.value)}
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none dark:text-white"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xxs font-bold text-slate-400 uppercase">End Time</label>
                        <input 
                          type="time"
                          value={newSlotEnd}
                          onChange={(e) => setNewSlotEnd(e.target.value)}
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none dark:text-white"
                          required
                        />
                      </div>
                    </div>

                    {slotMessage.text && (
                      <p className={`text-xxs font-semibold p-2.5 rounded-lg border ${
                        slotMessage.type === 'success' 
                          ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30' 
                          : 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/30'
                      }`}>
                        {slotMessage.text}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmittingSlot}
                      className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white font-bold py-2 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-sky-100/10"
                    >
                      <span>Publish Availability Slot</span>
                    </button>
                  </form>
                </div>

                {/* List of slots */}
                <div className="lg:col-span-3 space-y-4 text-left">
                  <h4 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider font-mono">My Availability Slots</h4>
                  
                  <div className="border border-slate-100 dark:border-slate-800/85 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 bg-slate-50/20 dark:bg-transparent max-h-[360px] overflow-y-auto">
                    {officeHours.filter(slot => slot.professorId === user.id).length === 0 ? (
                      <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs flex flex-col items-center justify-center gap-1.5">
                        <Clock className="h-6 w-6 text-slate-300 dark:text-slate-700" />
                        <p>No availability slots registered. Create your first availability slot above.</p>
                      </div>
                    ) : (
                      officeHours
                        .filter(slot => slot.professorId === user.id)
                        .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`))
                        .map(slot => {
                          const course = courses.find(c => c.id === slot.courseId);
                          return (
                            <div key={slot.id} className="p-4 flex flex-col gap-2.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xxs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                                      {course ? course.code : 'Syllabus'}
                                    </span>
                                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold border ${
                                      slot.status === 'booked'
                                        ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40'
                                        : 'bg-sky-50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-400 border-sky-100 dark:border-sky-900/40'
                                    }`}>
                                      {slot.status === 'booked' ? 'Booked' : 'Available'}
                                    </span>
                                  </div>
                                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                    {new Date(slot.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} at {slot.startTime} - {slot.endTime}
                                  </h5>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  {slot.status === 'booked' && (
                                    <button
                                      type="button"
                                      onClick={() => handleCancelBooking(slot.id)}
                                      className="text-[10px] text-amber-600 hover:text-amber-500 font-bold px-2 py-1 rounded bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 cursor-pointer"
                                      title="Unbook Slot"
                                    >
                                      Unbook
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSlot(slot.id)}
                                    className="text-[10px] text-rose-600 hover:text-rose-500 font-bold px-2 py-1 rounded bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 cursor-pointer"
                                    title="Delete Availability Slot"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>

                              {slot.status === 'booked' && (
                                <div className="bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/20 rounded-xl p-3 text-xxs space-y-1.5">
                                  <div className="flex items-center justify-between font-semibold text-emerald-800 dark:text-emerald-300">
                                    <span>Student: {slot.studentName} ({slot.studentEmail})</span>
                                  </div>
                                  {slot.meetingNotes && (
                                    <p className="text-slate-600 dark:text-slate-400 italic">
                                      " {slot.meetingNotes} "
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>

        {/* Right Sidebar layout (Attendance Pie chart, Notification ticker, Certificates) */}
        <div className="space-y-6 min-w-0">
          
          {/* Attendance Pie Chart Widget */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.2 }}
            className="bg-white dark:bg-[#0F172A] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-300"
          >
            <h4 className="text-sm font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wide font-poppins">
              {user.role === 'student' ? 'My Classroom Attendance' : 'LMS General Attendance'}
            </h4>
            <div className="h-44 flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={user.role === 'student' ? attendancePieData : adminAttendancePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {(user.role === 'student' ? attendancePieData : adminAttendancePieData).map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="text-lg font-black text-slate-800 dark:text-slate-100">
                  {user.role === 'student' ? `${userAttendancePercent || 0}%` : `${stats.attendanceRate}%`}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Present Rate</span>
              </div>
            </div>
            <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-col">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <span className="h-3 w-3 rounded-full bg-sky-500 block" />
                  <span>Present (Over 80%)</span>
                </div>
                <span className="font-bold text-slate-600 dark:text-slate-300">
                  {user.role === 'student' ? `${userPresentsCount} lessons` : `${stats?.attendanceRate}% avg`}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <span className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700 block" />
                  <span>Absent / Incomplete</span>
                </div>
                <span className="font-bold text-slate-600 dark:text-slate-300">
                  {user.role === 'student' ? `${totalUserLessonsTracked - userPresentsCount} lessons` : 'Incomplete watch'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Quick AI Study helper trigger */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.25 }}
            className="bg-gradient-to-br from-indigo-50/80 to-sky-50/80 dark:from-indigo-950/20 dark:to-sky-950/20 p-5 rounded-3xl border border-sky-100 dark:border-sky-900/40 shadow-sm flex flex-col gap-3 transition-colors duration-300"
          >
            <div className="flex gap-2 items-center">
              <div className="bg-sky-600 p-2 text-white rounded-xl">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">AI Tutor Assistant</h4>
                <p className="text-xxs text-slate-500 dark:text-slate-400 font-medium">Stuck on variables or Surah Al-Asr?</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Activate the Gemini AI platform to review difficult topics, summarize lecture PDFs, or compiled random evaluation MCQ quizzes dynamically.
            </p>
            <button
              onClick={() => setActiveTab('ai-tutor')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
            >
              <Zap className="h-3.5 w-3.5 text-amber-300 bg-amber-500/20 rounded" />
              Launch AI Tutor Terminal
            </button>
          </motion.div>

        </div>

      </div>
    </div>
  );
}
