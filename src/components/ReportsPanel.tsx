import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Award, 
  CheckCircle, 
  Download, 
  X, 
  Printer, 
  TrendingUp, 
  Table,
  BarChart3,
  LineChart as LineChartIcon
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { User, Course, AttendanceRecord, QuizAttempt, Certificate } from '../types';

interface ReportsPanelProps {
  user: User;
  courses: Course[];
}

export default function ReportsPanel({ user, courses = [] }: ReportsPanelProps) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  
  // High fidelity Certificate Viewer overlay inside reports
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);

  useEffect(() => {
    const isStudent = user.role === 'student';
    const attemptsUrl = isStudent ? `/api/quiz-attempts/${user.id}` : `/api/quiz-attempts`;
    const certsUrl = isStudent ? `/api/certificates/${user.id}` : `/api/certificates`;

    Promise.all([
      fetch('/api/attendance').then(res => res.json()),
      fetch(attemptsUrl).then(res => res.json()),
      fetch(certsUrl).then(res => res.json())
    ])
      .then(([attendanceData, attemptsData, certsData]) => {
        setAttendance(attendanceData);
        setAttempts(attemptsData);
        setCerts(certsData);
      })
      .catch(err => console.error('Error fetching academic report logs', err))
      .finally(() => setLoading(false));
  }, [user.id, user.role]);

  const handleExportCSV = () => {
    // Elegant mock export logic trigger
    const header = 'Student,ID,Course,Lecture Lesson,Date,Watch %,Status\n';
    const rows = attendance
      .map(a => `"${a.userName}","${a.studentId}","${a.courseTitle}","${a.lessonTitle}","${a.date}",${a.watchPercentage}%,"${a.status}"`)
      .join('\n');
    
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `academic_attendance_report_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 animate-pulse text-sky-600">
        Syncing academic grade ledgers...
      </div>
    );
  }

  // Filter lists based on role
  const finalAttendance = user.role === 'student' 
    ? attendance.filter(a => a.userId === user.id)
    : attendance;

  // Data for Bar Chart: Course assignment/quiz completion rates
  const barChartData = courses.map(course => {
    const quizLessons = course.modules?.flatMap(m => m.lessons || []).filter(l => l.type === 'quiz' || l.quiz) || [];
    const totalQuizzes = quizLessons.length;
    
    let rate = 0;
    let label = 'Quizzes';
    let totalItems = totalQuizzes;

    if (totalQuizzes > 0) {
      if (user.role === 'student') {
        const passedAttempts = attempts.filter(att => att.courseId === course.id && att.passed && att.userId === user.id).length;
        rate = Math.round((passedAttempts / totalQuizzes) * 100);
      } else {
        const courseAttempts = attempts.filter(att => att.courseId === course.id);
        const passedAttempts = courseAttempts.filter(att => att.passed).length;
        rate = courseAttempts.length > 0 ? Math.round((passedAttempts / courseAttempts.length) * 100) : 85;
      }
    } else {
      // Fallback to lessons completion
      const totalLessons = course.modules?.flatMap(m => m.lessons || []).length || 1;
      totalItems = totalLessons;
      label = 'Lectures';
      const completedLessons = attendance.filter(a => a.courseId === course.id && a.status === 'Present' && (user.role === 'student' ? a.userId === user.id : true)).length;
      rate = Math.round((completedLessons / totalLessons) * 100);
    }

    // Clamp rate between 0 and 100
    rate = Math.max(0, Math.min(100, rate));

    return {
      name: course.code || course.title.slice(0, 8),
      fullName: course.title,
      "Completion Rate": rate,
      "TotalItems": totalItems || 1,
      "Type": label
    };
  });

  // Safe fallback if courses are empty
  const finalBarChartData = barChartData.length > 0 ? barChartData : [
    { name: 'QUR-101', "Completion Rate": 85, "TotalItems": 4, "Type": 'Quizzes', fullName: 'Quran Studies Intro' },
    { name: 'ARB-201', "Completion Rate": 70, "TotalItems": 5, "Type": 'Quizzes', fullName: 'Arabic Language II' },
    { name: 'HIS-301', "Completion Rate": 90, "TotalItems": 3, "Type": 'Quizzes', fullName: 'Islamic History' },
    { name: 'FIQ-401', "Completion Rate": 60, "TotalItems": 2, "Type": 'Quizzes', fullName: 'Islamic Jurisprudence' }
  ];

  // Data for Line Chart: Attendance Trends over Time
  const processAttendanceTrends = () => {
    if (finalAttendance.length === 0) {
      return [
        { date: '06/18', "Attendance Rate": 85 },
        { date: '06/19', "Attendance Rate": 88 },
        { date: '06/20', "Attendance Rate": 82 },
        { date: '06/21', "Attendance Rate": 95 },
        { date: '06/22', "Attendance Rate": 90 },
        { date: '06/23', "Attendance Rate": 94 },
      ];
    }

    // Group by date string
    const dateMap: { [key: string]: { total: number; present: number } } = {};
    
    finalAttendance.forEach(r => {
      let displayDate = r.date;
      // Convert standard ISO date or date string to short version if possible
      if (r.date && r.date.includes('-')) {
        const parts = r.date.split('-');
        if (parts.length >= 3) {
          // e.g. "2026-06-23" -> "06/23"
          displayDate = `${parts[1]}/${parts[2].slice(0, 2)}`;
        }
      } else if (r.date && r.date.includes('/')) {
        const parts = r.date.split('/');
        if (parts.length >= 2) {
          // e.g. "06/23/2026" -> "06/23"
          displayDate = `${parts[0]}/${parts[1]}`;
        }
      }
      
      if (!dateMap[displayDate]) {
        dateMap[displayDate] = { total: 0, present: 0 };
      }
      dateMap[displayDate].total += 1;
      if (r.status === 'Present') {
        dateMap[displayDate].present += 1;
      }
    });

    const sortedDates = Object.keys(dateMap).sort((a, b) => {
      return a.localeCompare(b);
    });

    return sortedDates.map(date => {
      const data = dateMap[date];
      const rate = data.total > 0 ? Math.round((data.present / data.total) * 100) : 0;
      return {
        date,
        "Attendance Rate": rate,
        "Present Logs": data.present,
        "Total Logs": data.total
      };
    });
  };

  const lineChartData = processAttendanceTrends();

  return (
    <div className="space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Academic Reports &amp; Analytics</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {user.role === 'student' 
              ? 'Review personal quiz averages, attendance logs, and earned diplomas' 
              : 'Enterprise analytics, classroom attendance sheets, and export toolkits'}
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1 transition shadow-xs cursor-pointer"
        >
          <Download className="h-4 w-4" />
          Export Attendance (CSV)
        </button>
      </div>

      {/* Analytics Charts Overview Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Course Assignment / Quiz Completion Rate Chart */}
        <div className="bg-white dark:bg-[#0F172A] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-sky-50 dark:bg-sky-950/20 rounded-xl text-sky-600 dark:text-sky-400">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">Syllabus Completion Rates</h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Course assignment &amp; lecture completion percentage</p>
              </div>
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={finalBarChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '12px', 
                    border: 'none',
                    color: '#f8fafc',
                    fontSize: '11px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value: any, name: any, props: any) => {
                    const row = props.payload;
                    return [`${value}% Completed`, `${row.fullName} (${row.TotalItems} ${row.Type})`];
                  }}
                  labelStyle={{ fontWeight: 'bold', color: '#38bdf8' }}
                />
                <Bar dataKey="Completion Rate" fill="#0284c7" radius={[6, 6, 0, 0]}>
                  {finalBarChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry["Completion Rate"] > 80 ? '#0284c7' : entry["Completion Rate"] > 50 ? '#0ea5e9' : '#38bdf8'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attendance Trend Line Chart */}
        <div className="bg-white dark:bg-[#0F172A] p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                <LineChartIcon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">Attendance Trends over Time</h3>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">Daily average attendance rate history (%)</p>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderRadius: '12px', 
                    border: 'none',
                    color: '#f8fafc',
                    fontSize: '11px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }}
                  labelStyle={{ fontWeight: 'bold', color: '#34d399' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Attendance Rate" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, fill: '#ffffff' }}
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Double-Col: Grade books, Quizzes attempts, and Attendance table lists */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Class Attendance Ledger table sheet */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-700 uppercase tracking-widest flex items-center gap-2">
              <Table className="h-4 w-4 text-sky-600" />
              Classroom Attendance Ledger
            </h3>

            <div className="border border-slate-100 rounded-2xl overflow-hidden overflow-x-auto">
              <table className="w-full text-left font-sans text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    {user.role !== 'student' && <th className="p-3">Student Name</th>}
                    <th className="p-3">Subject / Course</th>
                    <th className="p-3">Lecture Lesson</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-center">Watch %</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {finalAttendance.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-slate-400 text-xxs">No attendance records documented on the LMS.</td>
                    </tr>
                  ) : (
                    finalAttendance.map((record, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        {user.role !== 'student' && (
                          <td className="p-3">
                            <span className="font-bold text-slate-800">{record.userName}</span>
                            <span className="text-[10px] text-slate-400 block">{record.studentId}</span>
                          </td>
                        )}
                        <td className="p-3 font-semibold text-slate-700">{record.courseTitle}</td>
                        <td className="p-3 text-slate-500 line-clamp-1">{record.lessonTitle}</td>
                        <td className="p-3 text-slate-400 font-mono">{record.date}</td>
                        <td className="p-3 text-center font-bold text-slate-600">{record.watchPercentage}%</td>
                        <td className="p-3 text-right">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            record.status === 'Present' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                              : 'bg-rose-50 text-rose-700 border border-rose-100'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Student Specific: Quiz Attempt Scores history */}
          {user.role === 'student' && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-700 uppercase tracking-widest flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-sky-600" />
                Undergraduate Quiz Assessment Records
              </h3>

              <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100">
                {attempts.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-xxs bg-slate-50/30">
                    You have not submitted any quiz assessments yet. Launch a lecture lesson to get started!
                  </div>
                ) : (
                  attempts.map((att, idx) => (
                    <div key={idx} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2 hover:bg-slate-50/20">
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">{att.quizTitle}</h4>
                        <span className="text-[10px] text-slate-400 font-medium">Submitted: {new Date(att.date).toLocaleDateString()}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-500">Grade Score:</span>
                        <span className={`text-base font-black ${att.passed ? 'text-emerald-600' : 'text-rose-500'}`}>
                          {att.score}%
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-extrabold border ${
                          att.passed 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {att.passed ? 'Passed' : 'Incomplete'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* Right Sidebar: Certificates Cabinets */}
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-700 uppercase tracking-widest flex items-center gap-1.5 border-b pb-2">
              <Award className="h-4.5 w-4.5 text-sky-600 animate-bounce" />
              LMS Academic Diplomas Cabinets
            </h3>

            {certs.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xxs px-4 space-y-2">
                <Award className="h-8 w-8 text-slate-300 mx-auto" />
                <p>Earned certificates will appear here once you pass study assessments with over 70%.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {certs.map((cert) => (
                  <div 
                    key={cert.id} 
                    onClick={() => setActiveCert(cert)}
                    className="border border-slate-100 hover:border-amber-300 rounded-2xl p-4 bg-amber-50/5 hover:bg-amber-50/15 cursor-pointer transition flex items-center justify-between gap-3"
                  >
                    <div className="space-y-0.5 max-w-[80%]">
                      <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{cert.courseTitle}</h4>
                      <span className="text-[10px] font-mono font-medium text-amber-900 block">{cert.certificateCode}</span>
                    </div>
                    <Award className="h-5 w-5 text-amber-700 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Diplomas certificates viewing overlay inside reports */}
      {activeCert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative border-8 border-amber-900 bg-amber-50/10 border-double">
            <button 
              onClick={() => setActiveCert(null)}
              className="absolute right-4 top-4 p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-full transition z-30"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Certificate diploma sheet container */}
            <div className="p-4 sm:p-6 text-center space-y-4">
              <div className="space-y-1">
                <h5 className="font-serif text-sm tracking-widest text-amber-900 font-extrabold uppercase">
                  University Board of Registrars
                </h5>
                <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">
                  Academic Excellence and Accreditation Commission
                </p>
                <div className="h-0.5 w-16 bg-amber-800/40 mx-auto mt-1" />
              </div>

              <p className="italic font-serif text-xs text-stone-500 mt-4 leading-none">
                This document formally testifies that
              </p>

              <h2 className="font-serif text-2xl font-black italic text-stone-800 tracking-tight py-1">
                {activeCert.userName}
              </h2>

              <p className="text-[10px] text-stone-500 max-w-sm mx-auto leading-relaxed">
                has successfully verified proficiency and completed all curriculum specifications for
              </p>

              <h4 className="font-sans text-sm font-bold text-amber-950 uppercase">
                {activeCert.courseTitle}
              </h4>

              <div className="flex justify-between items-center text-left pt-6 max-w-sm mx-auto border-t border-amber-900/10">
                <div>
                  <p className="text-[9px] text-stone-400 font-bold uppercase leading-none">Authorized under registry</p>
                  <span className="text-[10px] font-mono text-amber-900 font-bold block mt-1">{activeCert.certificateCode}</span>
                </div>
                <div className="text-right">
                  <p className="text-[9px] text-stone-400 font-bold uppercase leading-none">Issued Date</p>
                  <span className="text-[10px] font-mono text-amber-900 font-bold block mt-1">{activeCert.issueDate}</span>
                </div>
              </div>

              <div className="pt-4 flex justify-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-sky-600 hover:bg-sky-500 text-white font-semibold py-1.5 px-4 rounded-xl text-xs flex items-center gap-1.5 transition text-xs shadow-xs"
                >
                  <Printer className="h-4 w-4" />
                  Print credentials
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
