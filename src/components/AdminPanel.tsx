import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Settings, 
  BookOpen, 
  Trash2, 
  Plus, 
  Loader2, 
  Database, 
  Bell, 
  CheckCircle, 
  Activity, 
  ChevronRight,
  ShieldPlus 
} from 'lucide-react';
import { User, Course } from '../types';

interface AdminPanelProps {
  user: User;
  courses: Course[];
  onRefreshCourses: () => void;
}

export default function AdminPanel({ user, courses, onRefreshCourses }: AdminPanelProps) {
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSegment, setActiveSegment] = useState<'users' | 'courses' | 'system'>('users');

  // Create Course State
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [isQuran, setIsQuran] = useState(false);
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [courseCreatedSuccess, setCourseCreatedSuccess] = useState(false);

  // Broadcast Notification State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeBody, setNoticeBody] = useState('');
  const [noticePublishing, setNoticePublishing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('/api/auth/users')
      .then(res => res.json())
      .then(data => setUsersList(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you absolutely sure you want to remove this academic profile?')) {
      fetch(`/api/auth/users/${id}`, { method: 'DELETE' })
        .then(() => fetchUsers())
        .catch(err => console.error(err));
    }
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !code) return;

    setIsCreatingCourse(true);
    fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        code,
        description,
        department,
        isQuran,
        instructor: 'Dr. Sarah Jenkins'
      })
    })
      .then(res => res.json())
      .then(() => {
        onRefreshCourses();
        setTitle('');
        setCode('');
        setDescription('');
        setIsQuran(false);
        setCourseCreatedSuccess(true);
        setTimeout(() => setCourseCreatedSuccess(false), 2500);
      })
      .catch(err => console.error(err))
      .finally(() => setIsCreatingCourse(false));
  };

  const handleBroadcastNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle || !noticeBody) return;

    setNoticePublishing(true);
    // Mimics sending broadcast notification inside system
    setTimeout(() => {
      setNoticeTitle('');
      setNoticeBody('');
      setNoticePublishing(false);
      alert('Academic administrative broadcast successfully pushed to all active LMS terminals!');
    }, 1000);
  };

  const depts = [
    'Computer Science',
    'Business Administration',
    'Islamic Studies',
    'Electrical Engineering',
    'General Education'
  ];

  return (
    <div className="space-y-6">
      
      {/* Selector tab bar headers */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveSegment('users')}
          className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition ${
            activeSegment === 'users' 
              ? 'border-sky-600 text-sky-700' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Institutional Users
        </button>
        <button
          onClick={() => setActiveSegment('courses')}
          className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition ${
            activeSegment === 'courses' 
              ? 'border-sky-600 text-sky-700' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Create Curriculum Course
        </button>
        <button
          onClick={() => setActiveSegment('system')}
          className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition ${
            activeSegment === 'system' 
              ? 'border-sky-600 text-sky-700' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          LMS Console Configuration
        </button>
      </div>

      {activeSegment === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-800">LMS Internal Accounts Database</h3>
            <p className="text-xs text-slate-500">Edit, register, or remove student and professor enterprise login credentials</p>
          </div>

          <div className="border border-slate-100 rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-3">User Profile</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">LMS Access Role</th>
                  <th className="p-3">Department Domain</th>
                  <th className="p-3 text-right">Settings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-400">Pulling accounts registry from secure Cloud database files...</td>
                  </tr>
                ) : usersList.map((usr) => (
                  <tr key={usr.id} className="hover:bg-slate-50/50">
                    <td className="p-3">
                      <span className="font-bold text-slate-800">{usr.name}</span>
                      {usr.studentId && (
                        <span className="text-[10px] text-slate-400 block font-mono">ID: {usr.studentId}</span>
                      )}
                    </td>
                    <td className="p-3 text-slate-500">{usr.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold leading-none ${
                        usr.role === 'admin' 
                          ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                          : usr.role === 'professor' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-sky-50 text-sky-700 border border-sky-200'
                      }`}>
                        {usr.role}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 font-semibold">{usr.department || 'N/A'}</td>
                    <td className="p-3 text-right">
                      {usr.id !== user.id && (
                        <button
                          onClick={() => handleDeleteUser(usr.id)}
                          className="text-slate-400 hover:text-rose-600 transition p-1.5 hover:bg-rose-50/40 rounded-lg"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSegment === 'courses' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Create form card */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-black text-slate-800">Register New Academic Subject</h3>
              <p className="text-xs text-slate-500">Add course modules and publishing descriptors instantly to syllabus registries</p>
            </div>

            {courseCreatedSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Subject successfully registered! Add lessons via the Academic Courses screen.</span>
              </div>
            )}

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase">Course Subject Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Advanced Operating Systems"
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase">Subject Code</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. CS401"
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase">Syllabus Overview Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter detailed summary parameters of this subject..."
                  rows={3}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase">School / Department affiliation</label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-1.5 text-xs text-slate-900 bg-white"
                  >
                    {depts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="isQuranCheck"
                    checked={isQuran}
                    onChange={(e) => setIsQuran(e.target.checked)}
                    className="h-4 w-4 text-sky-600 border-slate-300 rounded focus:ring-sky-500"
                  />
                  <label htmlFor="isQuranCheck" className="text-xs font-bold text-slate-600">
                    Flag as Quran studies module (geometric borders)
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreatingCourse}
                className="mt-4 w-full bg-sky-600 hover:bg-sky-500 text-white font-extrabold py-2 rounded-xl text-xs flex justify-center items-center gap-1.5 shadow-xs disabled:opacity-50"
              >
                {isCreatingCourse ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : 'Register Academic Course'}
              </button>
            </form>
          </div>

          {/* SIdear: Courses review counts */}
          <div className="bg-white rounding-3xl border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Active Curriculum counts</h4>
              <div className="space-y-1 text-xs text-slate-600">
                <p>Total Registered Subjects: <span className="font-bold text-slate-800">{courses.length}</span></p>
                <p>Quran Studies Specializations: <span className="font-bold text-slate-800">{courses.filter(c => c.isQuran).length}</span></p>
              </div>
            </div>
            <div className="bg-sky-50/50 p-4 rounded-2xl flex items-center gap-2 text-xxs text-slate-500">
              <Activity className="h-4 w-4 text-sky-600 shrink-0" />
              <span>Registering courses authorizes global scheduling blocks instantly.</span>
            </div>
          </div>

        </div>
      )}

      {activeSegment === 'system' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Double: configuration details */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-800">System Announcement Broadcast</h3>
            <p className="text-xs text-slate-400">Send enterprise SMS, email reminders, and notifications to students regarding exams or holiday rosters</p>

            <form onSubmit={handleBroadcastNotice} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase">Broadcast Headline</label>
                <input
                  type="text"
                  required
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. Schedule Change: CS101 Lecture Cancelled"
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase">Notification Body Text</label>
                <textarea
                  required
                  value={noticeBody}
                  onChange={(e) => setNoticeBody(e.target.value)}
                  placeholder="Provide precise specifications of schedule alterations..."
                  rows={4}
                  className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                disabled={noticePublishing}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2 rounded-xl transition shadow-xs flex items-center gap-1.5"
              >
                {noticePublishing ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : 'Launch Notification'}
              </button>
            </form>
          </div>

          {/* Right side: server configurations detail */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-b pb-2">Global Settings variables</h4>
            
            <div className="space-y-3.5 text-xs text-slate-600">
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border">
                <span>Academic Passing Grade Threshold</span>
                <span className="font-extrabold text-sky-600">70%</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border">
                <span>Required Attendance Watch</span>
                <span className="font-extrabold text-sky-600">80%</span>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border">
                <span>FFmpeg Adaptive Video Quality</span>
                <span className="font-extrabold text-sky-600">On</span>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
