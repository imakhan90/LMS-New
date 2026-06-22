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
  Bot
} from 'lucide-react';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { User, Course, AttendanceRecord, QuizAttempt, Certificate, Quiz } from '../types';
import InteractiveCalendar from './InteractiveCalendar';

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

  useEffect(() => {
    // Parallelize loading of analytics and records
    Promise.all([
      fetch('/api/reports').then(res => res.json()),
      fetch('/api/attendance').then(res => res.json()),
      fetch(`/api/quiz-attempts/${user.id}`).then(res => res.json()),
      fetch(`/api/certificates/${user.id}`).then(res => res.json())
    ])
      .then(([reportData, attendanceData, attemptsData, certsData]) => {
        setStats(reportData);
        setAttendance(attendanceData);
        setAttempts(attemptsData);
        setCerts(certsData);
      })
      .catch(err => console.error('Error fetching dashboard indices', err))
      .finally(() => setLoading(false));
  }, [user.id]);

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

  // Pie chart stats
  const attendancePieData = [
    { name: 'Present (>=80% Video)', value: userAttendancePercent || 85, color: '#0284c7' },
    { name: 'Incomplete (<80%)', value: 100 - (userAttendancePercent || 85), color: '#cbd5e1' }
  ];

  const adminAttendancePieData = [
    { name: 'Attendance Rate', value: stats.attendanceRate, color: '#0ea5e9' },
    { name: 'Non-attendance', value: 100 - stats.attendanceRate, color: '#e2e8f0' }
  ];

  return (
    <div className="space-y-6">
      {/* Dynamic Header Greeting banner with Poppins/Inter and Light Blue Theme */}
      <div className="bg-gradient-to-tr from-primary via-[#4F8CFF] to-secondary rounded-[20px] p-6 sm:p-8 text-white shadow-xl shadow-primary/10 border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <GraduationCap className="h-64 w-6 map-icon transform rotate-12 translate-y-20 translate-x-10" />
        </div>
        <div className="relative z-10 space-y-2 text-left">
          <span className="bg-white/20 backdrop-blur-md text-white border border-white/10 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider font-poppins">
            {user.role} workspace
          </span>
          <h1 className="text-2xl sm:text-4xl font-poppins font-black tracking-tight">
            Welcome back, {user.name}!
          </h1>
          <p className="text-blue-50 text-sm max-w-2xl font-medium leading-relaxed">
            {user.role === 'student' 
              ? `You are enrolled in the ${user.semester} within the Department of ${user.department}. Continue learning where you left off!` 
              : `Access clinical lectures, student grades, attendance rules, and automated course reporting engines.`}
          </p>
        </div>
      </div>

      {/* KPI Stats widgets with 20px rounded cards */}
      {user.role === 'admin' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-[20px] border border-slate-200/65 shadow-sm flex items-center justify-between">
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Students</p>
              <h3 className="text-2xl font-poppins font-black text-slate-900 mt-1">{stats.totalStudents}</h3>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl text-primary border border-blue-100/50"><Users className="h-6 w-6" /></div>
          </div>
          <div className="bg-white p-5 rounded-[20px] border border-slate-200/65 shadow-sm flex items-center justify-between">
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Academic Faculty</p>
              <h3 className="text-2xl font-poppins font-black text-slate-900 mt-1">{stats.totalProfessors}</h3>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl text-accent-emerald border border-emerald-100/50"><BookOpen className="h-6 w-6" /></div>
          </div>
          <div className="bg-white p-5 rounded-[20px] border border-slate-200/65 shadow-sm flex items-center justify-between">
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Storage Usage</p>
              <h3 className="text-2xl font-poppins font-black text-slate-900 mt-1">{stats.storageUsageMB} MB</h3>
            </div>
            <div className="bg-amber-50 p-3 rounded-xl text-amber-600 border border-amber-100/50"><Database className="h-6 w-6" /></div>
          </div>
          <div className="bg-white p-5 rounded-[20px] border border-slate-200/65 shadow-sm flex items-center justify-between">
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Latency Sessions</p>
              <h3 className="text-2xl font-poppins font-black text-slate-900 mt-1">{stats.activeSessions} online</h3>
            </div>
            <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 border border-indigo-100/50"><Activity className="h-6 w-6" /></div>
          </div>
        </div>
      )}

      {user.role === 'professor' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-[20px] border border-slate-200/65 shadow-sm flex items-center justify-between">
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Courses</p>
              <h3 className="text-2xl font-poppins font-black text-slate-900 mt-1">{courses.length}</h3>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl text-primary border border-blue-100/50"><BookOpen className="h-6 w-6" /></div>
          </div>
          <div className="bg-white p-5 rounded-[20px] border border-slate-200/65 shadow-sm flex items-center justify-between">
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Student Rosters</p>
              <h3 className="text-2xl font-poppins font-black text-slate-900 mt-1">{stats.totalStudents} enrolled</h3>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl text-accent-emerald border border-emerald-100/50"><Users className="h-6 w-6" /></div>
          </div>
          <div className="bg-white p-5 rounded-[20px] border border-slate-200/65 shadow-sm flex items-center justify-between">
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">LMS Average Attendance</p>
              <h3 className="text-2xl font-poppins font-black text-slate-900 mt-1">{stats.attendanceRate}%</h3>
            </div>
            <div className="bg-amber-50 p-3 rounded-xl text-amber-600 border border-amber-100/50"><Calendar className="h-6 w-6" /></div>
          </div>
          <div className="bg-white p-5 rounded-[20px] border border-slate-200/65 shadow-sm flex items-center justify-between">
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Online Nodes</p>
              <h3 className="text-2xl font-poppins font-black text-slate-900 mt-1">Live</h3>
            </div>
            <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 border border-indigo-100/50"><Activity className="h-6 w-6" /></div>
          </div>
        </div>
      )}

      {user.role === 'student' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-5 rounded-[20px] border border-slate-200/65 shadow-sm flex items-center justify-between">
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">My Enrolled Courses</p>
              <h3 className="text-2xl font-poppins font-black text-slate-900 mt-1">{courses.length}</h3>
            </div>
            <div className="bg-blue-50 p-3 rounded-xl text-primary border border-blue-100/50 transition-all"><BookOpen className="h-6 w-6" /></div>
          </div>
          <div className="bg-white p-5 rounded-[20px] border border-slate-200/65 shadow-sm flex items-center justify-between">
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">My Attendance Rate</p>
              <h3 className="text-2xl font-poppins font-black text-slate-900 mt-1">{userAttendancePercent || 0}%</h3>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl text-accent-emerald border border-emerald-100/50 transition-all"><Calendar className="h-6 w-6" /></div>
          </div>
          <div className="bg-white p-5 rounded-[20px] border border-slate-200/65 shadow-sm flex items-center justify-between">
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quizzes Passed</p>
              <h3 className="text-2xl font-poppins font-black text-slate-900 mt-1">{attempts.filter(a => a.passed).length}</h3>
            </div>
            <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 border border-indigo-100/50 transition-all"><Zap className="h-6 w-6" /></div>
          </div>
          <div className="bg-white p-5 rounded-[20px] border border-slate-200/65 shadow-sm flex items-center justify-between">
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Earned Certificates</p>
              <h3 className="text-2xl font-poppins font-black text-slate-900 mt-1">{certs.length}</h3>
            </div>
            <div className="bg-amber-50 p-3 rounded-xl text-amber-600 border border-amber-100/50 transition-all"><Award className="h-6 w-6" /></div>
          </div>
        </div>
      )}

      {/* Dynamic Academic Calendar mapping upcoming quizzes and live lectures */}
      <InteractiveCalendar 
        user={{ id: user.id, name: user.name, role: user.role }} 
        courses={courses} 
        onLaunchCourse={onLaunchCourse} 
        onLaunchQuiz={onLaunchQuiz} 
      />

      {/* Main Section Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Double-Col Layout (Charts, Course rosters) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Charts Widget (Admin & Professor view) */}
          {(user.role === 'admin' || user.role === 'professor') && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">LMS Grade Performance Metrics</h3>
                  <p className="text-xs text-slate-500">Academic quiz score averages by department courses</p>
                </div>
                <TrendingUp className="h-5 w-5 text-sky-600" />
              </div>
              <div className="h-64 border border-slate-100 rounded-2xl p-2 bg-slate-50/50">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.courseAverages}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="courseCode" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="averageGrade" fill="#0ea5e9" name="Average Grade %" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Student Progress and Continuing section */}
          {user.role === 'student' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-extrabold text-slate-800">My Educational Courses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map(course => {
                  const totalLessons = course.modules.flatMap(m => m.lessons).length || 1;
                  const watchedLessons = attendance.filter(a => a.courseId === course.id && a.status === 'Present').length;
                  const percentComplete = Math.min(100, Math.round((watchedLessons / totalLessons) * 100));

                  return (
                    <div 
                      key={course.id} 
                      className="border border-slate-100 hover:border-sky-300 rounded-2xl p-4 space-y-3 hover:bg-sky-50/10 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <span className="text-xxs bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded uppercase">
                          {course.code}
                        </span>
                        <h4 className="text-sm font-bold text-slate-800 line-clamp-1">{course.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2">{course.description}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-medium text-slate-400">Course Progress</span>
                          <span className="font-bold text-sky-600">{percentComplete}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-sky-500 rounded-full transition-all duration-500" 
                            style={{ width: `${percentComplete}%` }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => onLaunchCourse(course)}
                          className="w-full mt-3 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl text-xs transition duration-250 shadow-md shadow-blue-100 hover:shadow-lg hover:shadow-blue-200 active:scale-[0.98] cursor-pointer"
                        >
                          <PlayCircle className="h-4 w-4" />
                          <span>Launch Lectures</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Academic attendance ledger summary for professors */}
          {user.role === 'professor' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Recent Attendance Events</h3>
                <button 
                  onClick={() => setActiveTab('reports')} 
                  className="text-xs font-semibold text-sky-600 hover:underline"
                >
                  Full ledger
                </button>
              </div>
              <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100">
                {attendance.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-xs text-slate-400">
                    No classroom attendance activity has occurred yet today.
                  </div>
                ) : (
                  attendance.slice(0, 4).map((att, i) => (
                    <div key={i} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50">
                      <div>
                        <span className="font-bold text-slate-800">{att.userName}</span>
                        <span className="text-slate-400 font-medium ml-1">({att.studentId})</span>
                        <p className="text-xxs text-slate-400 mt-0.5 mt-1">Lesson: {att.lessonTitle}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xxs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                          {att.watchPercentage}% watched
                        </span>
                        <span className={`px-2 py-0.5 rounded font-bold text-xxs leading-none ${
                          att.status === 'Present' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {att.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* Right Sidebar layout (Attendance Pie chart, Notification ticker, Certificates) */}
        <div className="space-y-6">
          
          {/* Attendance Pie Chart Widget */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-extrabold text-slate-700 uppercase tracking-wide">
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
                <span className="text-lg font-black text-slate-800">
                  {user.role === 'student' ? `${userAttendancePercent || 0}%` : `${stats.attendanceRate}%`}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Present Rate</span>
              </div>
            </div>
            <div className="space-y-2 border-t border-slate-100 pt-3 flex flex-col">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <span className="h-3 w-3 rounded-full bg-sky-500 block" />
                  <span>Present (Over 80%)</span>
                </div>
                <span className="font-bold text-slate-600">
                  {user.role === 'student' ? `${userPresentsCount} lessons` : `${stats?.attendanceRate}% avg`}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-500">
                  <span className="h-3 w-3 rounded-full bg-slate-300 block" />
                  <span>Absent / Incomplete</span>
                </div>
                <span className="font-bold text-slate-600">
                  {user.role === 'student' ? `${totalUserLessonsTracked - userPresentsCount} lessons` : 'Incomplete watch'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick AI Study helper trigger */}
          <div className="bg-gradient-to-br from-indigo-50 to-sky-50 p-5 rounded-3xl border border-sky-100 shadow-sm flex flex-col gap-3">
            <div className="flex gap-2 items-center">
              <div className="bg-sky-600 p-2 text-white rounded-xl">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">AI Tutor Assistant</h4>
                <p className="text-xxs text-slate-500 font-medium">Stuck on variables or Surah Al-Asr?</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Activate the Gemini AI platform to review difficult topics, summarize lecture PDFs, or compiled random evaluation MCQ quizzes dynamically.
            </p>
            <button
              onClick={() => setActiveTab('ai-tutor')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
            >
              <Zap className="h-3.5 w-3.5 text-amber-300 bg-amber-500/20 rounded" />
              Launch AI Tutor Terminal
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
