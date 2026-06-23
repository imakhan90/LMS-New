import React, { useState } from 'react';
import { 
  Shield, 
  BookOpen, 
  GraduationCap, 
  Lock, 
  Mail, 
  Phone, 
  Users, 
  AlertCircle, 
  CheckCircle,
  Zap, 
  Sparkles, 
  Play, 
  MessageSquare, 
  ChevronRight, 
  Star, 
  User as UserIcon,
  HelpCircle,
  ArrowRight,
  Globe,
  Award,
  BookMarked,
  X,
  Database,
  Laptop,
  Server,
  Settings,
  Calendar,
  TrendingUp,
  Bell,
  FileText,
  CheckSquare,
  Share2,
  Send,
  School,
  Cpu,
  Check,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, UserRole } from '../types';

interface AuthPageProps {
  onLoginSuccess: (user: User, token: string) => void;
}

export default function AuthPage({ onLoginSuccess }: AuthPageProps) {
  // Navigation & Authentication states
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [authRole, setAuthRole] = useState<UserRole>('student');
  
  // Login credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Universal Registration Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [passwordReg, setPasswordReg] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Role-Specific Registration Fields
  const [studentId, setStudentId] = useState('');
  const [semester, setSemester] = useState('1st Semester');
  
  const [facultyId, setFacultyId] = useState('');
  const [designation, setDesignation] = useState('Assistant Professor');
  
  const [employeeId, setEmployeeId] = useState('');
  const [adminRole, setAdminRole] = useState('System Administrator'); // e.g. Registrar, Super Admin, System Administrator

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Landing Page Interactive states
  const [activeTab, setActiveTab] = useState<'student' | 'professor' | 'admin'>('student');
  const [activeFlow, setActiveFlow] = useState<'assignment' | 'attendance' | 'course'>('assignment');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [demoVideoOpen, setDemoVideoOpen] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const departments = [
    'Computer Science',
    'Business Administration',
    'Islamic Studies',
    'Electrical Engineering',
    'General Education'
  ];

  const semesters = [
    '1st Semester',
    '2nd Semester',
    '3rd Semester',
    '4th Semester',
    '5th Semester',
    '6th Semester',
    '7th Semester',
    '8th Semester'
  ];

  const adminRoles = [
    'Registrar',
    'Super Admin',
    'System Administrator',
    'Academic Dean Office'
  ];

  const designations = [
    'Lecturer',
    'Assistant Professor',
    'Associate Professor',
    'Full Professor',
    'Department Head'
  ];

  const stats = [
    { label: 'Active Students', value: '50,000+', icon: Users, color: 'text-blue-600', desc: 'Enrolled across global departments' },
    { label: 'Expert Professors', value: '5,000+', icon: BookOpen, color: 'text-emerald-500', desc: 'Certified academic instructors' },
    { label: 'Institutions', value: '500+', icon: School, color: 'text-indigo-500', desc: 'Connected educational nodes' },
    { label: 'System Uptime', value: '99.9%', icon: Sparkles, color: 'text-[#4F8CFF]', desc: 'Enterprise database availability' }
  ];

  const featuresList = [
    {
      title: 'AI-Powered Learning Analytics',
      desc: 'Powered by Gemini models to track lesson progress, formulate smart mock tests, and pinpoint cognitive gaps in real time.',
      icon: Cpu,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      title: 'Attendance Automation',
      desc: 'Integrated digital verification indices matching video playback and lesson logins instantly to generate official logs.',
      icon: Clock,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      title: 'Assignment Management',
      desc: 'Seamless file uploading, rich textual summary analyzers, and rapid grading cards linking students to instructors.',
      icon: FileText,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Gradebook System',
      desc: 'Complete grading matrix with cumulative GPA index meters, transparent weighted marks, and secure records.',
      icon: Award,
      color: 'from-amber-500 to-orange-500'
    },
    {
      title: 'Real-Time Notifications',
      desc: 'Instant push updates, automated SMS receipts, and university email alerts keeping the learning community aligned.',
      icon: Bell,
      color: 'from-red-500 to-rose-500'
    },
    {
      title: 'Role-Based Access Control',
      desc: 'Granular security permissions customized dynamically for Student, Professor, and Administrator dashboard routing.',
      icon: Shield,
      color: 'from-indigo-500 to-violet-500'
    }
  ];

  const testimonials = [
    {
      quote: "LMS System completely transformed how we evaluate student logs. The automated attendance matching is flawless and saves us hours every week. The real-time database sync means grading scales are immediately transparent.",
      author: "Dr. Sarah Jenkins",
      role: "Dean of Computer Science / Professor",
      imgLetter: "S",
      bg: "bg-blue-50 border-blue-200"
    },
    {
      quote: "The integrated AI tutor acts like an on-demand private tutor. Whenever I get stuck on a tricky Big-O proof or want a quick quiz on Islamic studies, the Gemini interface gives me a breakdown instantly.",
      author: "Zayn Malik",
      role: "Computer Science Senior / Student",
      imgLetter: "Z",
      bg: "bg-emerald-50 border-emerald-200"
    },
    {
      quote: "Managing 50,000+ student profiles and cross-departmental schedules used to be an administrative nightmare. This platform connects every node into one high-performance dashboard that is incredibly fast.",
      author: "Dean Faisal Al-Sabah",
      role: "LMS Registrar Administrator",
      imgLetter: "F",
      bg: "bg-indigo-50 border-indigo-200"
    }
  ];

  const handleQuickLogin = (demoRole: 'student' | 'professor' | 'admin') => {
    let demoEmail = '';
    let demoPassword = '';
    if (demoRole === 'student') {
      demoEmail = 'student@university.edu';
      demoPassword = 'student123';
    } else if (demoRole === 'professor') {
      demoEmail = 'professor@university.edu';
      demoPassword = 'professor123';
    } else {
      demoEmail = 'admin@university.edu';
      demoPassword = 'admin123';
    }

    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    setError(null);

    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: demoEmail, password: demoPassword })
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Verification failed.');
        }
        return data;
      })
      .then(data => {
        onLoginSuccess(data.user, data.token);
      })
      .catch((err) => {
        setError(err.message || 'Connecting to server failed.');
      })
      .finally(() => setLoading(false));
  };

  const handleSubmitAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      setLoading(true);
      fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || 'Login failed.');
          }
          return data;
        })
        .then(data => {
          if (data.token && data.user) {
            onLoginSuccess(data.user, data.token);
          }
        })
        .catch((err) => {
          setError(err.message || 'Operation failed. Try again.');
        })
        .finally(() => setLoading(false));
    } else {
      // Registration checks
      if (passwordReg !== confirmPassword) {
        setError('Passwords do not match. Please verify your typing.');
        return;
      }

      setLoading(true);
      const payload: any = {
        name,
        email,
        role: authRole,
        phone,
        department,
        password: passwordReg
      };

      // Role-specific payload values
      if (authRole === 'student') {
        payload.studentId = studentId || undefined;
        payload.semester = semester;
      } else if (authRole === 'professor') {
        payload.facultyId = facultyId || undefined;
        payload.designation = designation;
      } else if (authRole === 'admin') {
        payload.employeeId = employeeId || undefined;
        payload.role = 'admin'; // mapping backend role key
        payload.adminRole = adminRole; // custom administrative title
      }

      fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || 'Registration failed.');
          }
          return data;
        })
        .then(data => {
          if (data.token && data.user) {
            onLoginSuccess(data.user, data.token);
          }
        })
        .catch((err) => {
          setError(err.message || 'Registration failed.');
        })
        .finally(() => setLoading(false));
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 4000);
  };

  return (
    <div id="landing_page_root" className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased overflow-x-hidden">
      
      {/* Premium Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/50 px-4 sm:px-6 lg:px-8 py-4 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="font-poppins font-black text-slate-900 tracking-tight text-lg sm:text-xl">Institute LMS</p>
              <p className="text-[9px] uppercase tracking-widest text-blue-500 font-extrabold">Connected Enterprise Hub</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <a href="#architecture" className="hover:text-blue-600 transition-colors">Architecture</a>
            <a href="#workflows" className="hover:text-blue-600 transition-colors">Sync Flows</a>
            <a href="#features" className="hover:text-blue-600 transition-colors">Core Features</a>
            <a href="#statistics" className="hover:text-blue-600 transition-colors">System Metrics</a>
            <a href="#testimonials" className="hover:text-blue-600 transition-colors">Testimonials</a>
            <a href="#contact" className="hover:text-blue-600 transition-colors">Inquiries</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              id="header_login_btn"
              onClick={() => {
                setIsLogin(true);
                setShowAuthModal(true);
              }}
              className="px-4 py-2 text-xs uppercase tracking-wider font-extrabold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              id="header_get_started_btn"
              onClick={() => {
                setIsLogin(false);
                setShowAuthModal(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-2xl text-xs uppercase tracking-wider font-extrabold shadow-md shadow-blue-200 hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 sm:pb-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50/50 overflow-hidden">
        {/* Soft background aura glows */}
        <div className="absolute top-1/6 left-1/10 w-96 h-96 bg-blue-100/30 rounded-full filter blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-1/5 right-1/10 w-[500px] h-[500px] bg-indigo-100/40 rounded-full filter blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline and description */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider border border-blue-100/80">
              <Sparkles className="h-4 w-4 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
              <span>Real-Time Database Sync Ecosystem</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-poppins font-black text-slate-900 leading-[1.15] tracking-tight">
              One Connected Learning Platform for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-700">Students, Professors, and Administrators</span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
              Manage courses, assignments, attendance, grading, communication, and academic workflows from a single integrated LMS ecosystem. Built with role-based dashboard mirrors syncing instantly across our university cloud database.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                id="hero_get_started"
                onClick={() => {
                  setIsLogin(false);
                  setShowAuthModal(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-4 rounded-2xl shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <span>Get Started Now</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </button>
              
              <button
                id="hero_watch_demo"
                onClick={() => setDemoVideoOpen(true)}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-7 py-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <div className="bg-blue-50 p-1.5 rounded-lg text-blue-600">
                  <Play className="h-4 w-4 fill-blue-600" />
                </div>
                <span>Request Demo</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-8 border-t border-slate-200/60 max-w-lg">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900">50k+</p>
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-1">Students</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-slate-900">5,000+</p>
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-1">Professors</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-[#38B889]">99.9%</p>
                  <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-1">Uptime Sync</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Ecosystem Hero Illustration */}
          <div className="lg:col-span-6 relative mt-8 lg:mt-0 flex justify-center">
            <div className="w-full max-w-[500px] bg-white p-6 sm:p-8 rounded-[24px] shadow-2xl border border-slate-200/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full filter blur-xl" />
              
              <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-100">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                  Ecosystem State: Connected
                </span>
                <span className="bg-blue-50 text-blue-600 font-mono text-[9px] font-bold px-2.5 py-1 rounded-md">
                  Active Sync
                </span>
              </div>

              {/* Interconnected Nodes Visualizer Map */}
              <div className="relative py-8 flex flex-col items-center justify-center">
                
                {/* Central Database Core Node */}
                <div id="central-db-core" className="relative z-20 w-24 h-24 bg-gradient-to-tr from-slate-900 to-slate-800 rounded-3xl shadow-xl flex flex-col items-center justify-center border-4 border-white text-white p-2 text-center group">
                  <div className="absolute -inset-2 bg-blue-500/20 rounded-[28px] filter blur-md animate-pulse" />
                  <Database className="h-8 w-8 text-blue-400 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] uppercase font-black tracking-widest text-slate-200">LMS CORE</span>
                  <span className="text-[8px] font-mono text-blue-400">POSTGRESQL</span>
                </div>

                {/* Satellite Portal Node 1: Student Portal (Left) */}
                <div className="absolute top-0 left-0 z-10 w-32 bg-white hover:bg-blue-50/40 p-3.5 rounded-2xl border border-slate-200/80 shadow-md text-left transition-all duration-200 hover:-translate-y-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="bg-blue-50 p-1.5 rounded-lg text-blue-600">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Student Portal</span>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-tight">Launches courses, submits assignments, views current grades.</p>
                </div>

                {/* Satellite Portal Node 2: Professor Portal (Right) */}
                <div className="absolute top-0 right-0 z-10 w-32 bg-white hover:bg-emerald-50/40 p-3.5 rounded-2xl border border-slate-200/80 shadow-md text-left transition-all duration-200 hover:-translate-y-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="bg-emerald-50 p-1.5 rounded-lg text-emerald-600">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Professor Portal</span>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-tight">Controls curricula, creates quizzes, records grades &amp; logs.</p>
                </div>

                {/* Satellite Portal Node 3: Admin Portal (Bottom) */}
                <div className="absolute bottom-0 z-10 w-36 bg-white hover:bg-indigo-50/40 p-3.5 rounded-2xl border border-slate-200/80 shadow-md text-left transition-all duration-200 hover:translate-y-1">
                  <div className="flex items-center gap-2 mb-1.5 justify-center">
                    <div className="bg-indigo-50 p-1.5 rounded-lg text-indigo-600">
                      <Shield className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Admin Portal</span>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-tight text-center">Spans departments, handles users, generates system performance analytics.</p>
                </div>

                {/* Sync Connector SVG paths with flowing laser dots */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10" viewBox="0 0 400 300">
                  {/* Student to Core */}
                  <path d="M 120 70 L 200 150" stroke="#E2E8F0" strokeWidth="2.5" strokeDasharray="5,5" fill="none" />
                  <circle r="4" fill="#3B82F6">
                    <animateMotion dur="2.5s" repeatCount="indefinite" path="M 120 70 L 200 150" />
                  </circle>

                  {/* Professor to Core */}
                  <path d="M 280 70 L 200 150" stroke="#E2E8F0" strokeWidth="2.5" strokeDasharray="5,5" fill="none" />
                  <circle r="4" fill="#10B981">
                    <animateMotion dur="3s" repeatCount="indefinite" path="M 280 70 L 200 150" />
                  </circle>

                  {/* Core to Admin */}
                  <path d="M 200 150 L 200 240" stroke="#E2E8F0" strokeWidth="2.5" strokeDasharray="5,5" fill="none" />
                  <circle r="4" fill="#6366F1">
                    <animateMotion dur="2s" repeatCount="indefinite" path="M 200 150 L 200 240" />
                  </circle>
                </svg>
              </div>

              {/* Central Sync Badge */}
              <div className="mt-6 bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between text-xs text-slate-600 font-medium">
                <span className="flex items-center gap-2 font-bold text-slate-700">
                  <Database className="h-4 w-4 text-blue-500" />
                  Real-Time DBMS Synchronization
                </span>
                <span className="text-[#38B889] font-extrabold">Active Now</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrated Dashboard Architecture Mockups */}
      <section id="architecture" className="py-20 bg-white border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full inline-block">
              Embedded Previews
            </span>
            <h2 className="text-3xl font-poppins font-black text-slate-900 leading-tight">
              Integrated Dashboard Architecture
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed max-w-2xl mx-auto">
              Inspect the exact feature maps configured for each educational node. Select a role below to explore their corresponding live dashboard layouts in detail.
            </p>

            {/* Role Tab Selector */}
            <div className="flex justify-center gap-2 pt-4">
              <button
                id="arch_tab_student"
                onClick={() => setActiveTab('student')}
                className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border-2 transition-all cursor-pointer ${
                  activeTab === 'student'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-transparent'
                }`}
              >
                Student Module
              </button>
              <button
                id="arch_tab_professor"
                onClick={() => setActiveTab('professor')}
                className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border-2 transition-all cursor-pointer ${
                  activeTab === 'professor'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-transparent'
                }`}
              >
                Professor Module
              </button>
              <button
                id="arch_tab_admin"
                onClick={() => setActiveTab('admin')}
                className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider border-2 transition-all cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-transparent'
                }`}
              >
                Admin Module
              </button>
            </div>
          </div>

          {/* Render Active Dashboard Preview Card Mockup */}
          <div className="bg-[#F8FAFC] border border-slate-200/80 p-6 sm:p-8 rounded-[24px] shadow-lg">
            <AnimatePresence mode="wait">
              {activeTab === 'student' && (
                <motion.div 
                  key="student"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  <div className="lg:col-span-5 text-left space-y-5">
                    <div className="bg-blue-50 text-blue-600 p-2 rounded-lg inline-block">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-poppins font-black text-slate-800">Student Portal Environment</h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                      Designed with an extreme focus on video content tracking and academic feedback loops. Students stream lectures at varying velocities, check automatic attendance, and view real-time grades.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {[
                        'My Courses Catalogue',
                        'Attendance Tracking',
                        'Assignments Submission',
                        'Quiz Results Log',
                        'Weighted Grades Overview',
                        'Academic Calendar Map',
                        'Real-Time Notifications',
                        'Direct Professor Messaging'
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                          <CheckCircle className="h-4 w-4 text-blue-500 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Miniature Student Dashboard Mockup */}
                  <div className="lg:col-span-7 bg-white p-5 rounded-[20px] shadow-md border border-slate-200/60 text-left space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 bg-blue-500 rounded-full" />
                        <span className="text-xs font-bold text-slate-800">Student Dashboard Mini</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">ST-881920</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">My Courses</span>
                        <span className="text-lg font-black text-slate-800">3 Active</span>
                      </div>
                      <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                        <span className="text-[9px] text-blue-500 font-bold uppercase block mb-1">Attendance Index</span>
                        <span className="text-lg font-black text-blue-600">98.6%</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Current GPA</span>
                        <span className="text-lg font-black text-slate-800">3.85 / 4.0</span>
                      </div>
                    </div>

                    {/* Active Assignment and Lecture Alert */}
                    <div className="border border-slate-100 rounded-xl p-3 flex items-center justify-between text-xs bg-slate-50">
                      <div className="flex items-center gap-2.5">
                        <FileText className="h-4.5 w-4.5 text-blue-500" />
                        <div>
                          <p className="font-bold text-slate-700">CS101: Midterm Essay</p>
                          <p className="text-[10px] text-slate-400 font-medium">Due in 2 days &bull; Weighted (15%)</p>
                        </div>
                      </div>
                      <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-2 py-0.5 rounded">Pending</span>
                    </div>

                    <div className="border border-slate-100 rounded-xl p-3 flex items-center justify-between text-xs bg-[#F0F6FF]/50">
                      <div className="flex items-center gap-2.5">
                        <Play className="h-4.5 w-4.5 text-[#38B889] fill-[#38B889]" />
                        <div>
                          <p className="font-bold text-slate-700">Lecture 3: Compiler Registers</p>
                          <p className="text-[10px] text-slate-400 font-medium">Progress: 82% watched</p>
                        </div>
                      </div>
                      <span className="bg-[#E6F8F0] text-[#38B889] text-[9px] font-bold px-2 py-0.5 rounded">Resumable</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'professor' && (
                <motion.div 
                  key="professor"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  <div className="lg:col-span-5 text-left space-y-5">
                    <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg inline-block">
                      <BookOpen className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-poppins font-black text-slate-800">Professor Portal Environment</h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                      Academic management tools to organize syllabi, launch live course tracks, publish dynamic lecture slides, configure custom quiz systems, and evaluate performance dashboards easily.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {[
                        'Course Curricula Builder',
                        'Attendance Management',
                        'Assignment Creation',
                        'Unified Grade Submission',
                        'Performance Analytics',
                        'Class Scheduling',
                        'Communication Center',
                        'SSO Roster Imports'
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                          <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Miniature Professor Dashboard Mockup */}
                  <div className="lg:col-span-7 bg-white p-5 rounded-[20px] shadow-md border border-slate-200/60 text-left space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full" />
                        <span className="text-xs font-bold text-slate-800">Faculty Hub Master</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">FAC-Jenkins-ComputerScience</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Active Batches</span>
                        <span className="text-lg font-black text-slate-800">2 Classes</span>
                      </div>
                      <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                        <span className="text-[9px] text-emerald-600 font-bold uppercase block mb-1">Grading Queue</span>
                        <span className="text-lg font-black text-emerald-600">8 Submissions</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Course Rating</span>
                        <span className="text-lg font-black text-slate-800">4.9 / 5.0</span>
                      </div>
                    </div>

                    {/* Pending Grading and Quick Roll Call */}
                    <div className="border border-slate-100 rounded-xl p-3 flex items-center justify-between text-xs bg-slate-50">
                      <div className="flex items-center gap-2.5">
                        <FileText className="h-4.5 w-4.5 text-emerald-500" />
                        <div>
                          <p className="font-bold text-slate-700">CS101: Student Submissions</p>
                          <p className="text-[10px] text-slate-400 font-medium">8 student essays pending rubric scoring</p>
                        </div>
                      </div>
                      <button className="bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold px-3 py-1 rounded-md transition cursor-pointer">
                        Grade Now
                      </button>
                    </div>

                    <div className="border border-slate-100 rounded-xl p-3 flex items-center justify-between text-xs bg-slate-50">
                      <div className="flex items-center gap-2.5">
                        <Clock className="h-4.5 w-4.5 text-amber-500" />
                        <div>
                          <p className="font-bold text-slate-700">Attendance Sheet Generator</p>
                          <p className="text-[10px] text-slate-400 font-medium">Generate automated logs for CS101 Lecture 4</p>
                        </div>
                      </div>
                      <span className="text-slate-400 text-[10px] font-mono">Auto Synced</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'admin' && (
                <motion.div 
                  key="admin"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  <div className="lg:col-span-5 text-left space-y-5">
                    <div className="bg-indigo-50 text-indigo-600 p-2 rounded-lg inline-block">
                      <Shield className="h-6 w-6" />
                    </div>
                    <h3 className="text-2xl font-poppins font-black text-slate-800">Admin Control Center</h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                      Root configurations to scale system departments, provision student rosters, monitor active server logs, modify academic calendar dates, and audit global report matrices.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {[
                        'User Directory Management',
                        'Department Structures',
                        'Course Allocation Audits',
                        'Faculty Scheduling Roster',
                        'Aggregated Reports & Graphs',
                        'Academic Calendar Control',
                        'Central Database Settings',
                        'Multi-Tenant Licensing'
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 font-semibold">
                          <CheckCircle className="h-4 w-4 text-indigo-500 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Miniature Admin Dashboard Mockup */}
                  <div className="lg:col-span-7 bg-white p-5 rounded-[20px] shadow-md border border-slate-200/60 text-left space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 bg-indigo-500 rounded-full" />
                        <span className="text-xs font-bold text-slate-800">LMS Root Administrator Console</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">ADMIN-SSO-NODE01</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Total Users</span>
                        <span className="text-lg font-black text-slate-800">55,142</span>
                      </div>
                      <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                        <span className="text-[9px] text-indigo-600 font-bold uppercase block mb-1">System Health</span>
                        <span className="text-lg font-black text-indigo-600">99.98%</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Sync Latency</span>
                        <span className="text-lg font-black text-slate-800">~12ms</span>
                      </div>
                    </div>

                    {/* Root Action and Settings Preview */}
                    <div className="border border-slate-100 rounded-xl p-3 flex items-center justify-between text-xs bg-slate-50">
                      <div className="flex items-center gap-2.5">
                        <Settings className="h-4.5 w-4.5 text-indigo-500" />
                        <div>
                          <p className="font-bold text-slate-700">LMS Security Shield Control</p>
                          <p className="text-[10px] text-slate-400 font-medium">Automatic OAuth certificate expiration tracking</p>
                        </div>
                      </div>
                      <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded">Secure</span>
                    </div>

                    <div className="border border-slate-100 rounded-xl p-3 flex items-center justify-between text-xs bg-slate-50">
                      <div className="flex items-center gap-2.5">
                        <Users className="h-4.5 w-4.5 text-blue-500" />
                        <div>
                          <p className="font-bold text-slate-700">Active Roster Provisioning</p>
                          <p className="text-[10px] text-slate-400 font-medium">Import students directly from university database</p>
                        </div>
                      </div>
                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-bold px-3 py-1 rounded-md transition cursor-pointer">
                        Sync Roster
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Integration Flow Simulator */}
      <section id="workflows" className="py-20 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full inline-block">
              Interactive Flow Charts
            </span>
            <h2 className="text-3xl font-poppins font-black text-slate-900 leading-tight">
              Real-Time Cross-Module Sync Workflows
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed max-w-2xl mx-auto">
              Choose an automated workflow below to visually trace how data packets travel across the database to update separate dashboards simultaneously.
            </p>

            {/* Selector buttons for flows */}
            <div className="flex flex-wrap justify-center gap-2.5 pt-4">
              <button
                id="flow_selector_assignment"
                onClick={() => setActiveFlow('assignment')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFlow === 'assignment'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                1. Assignment Submission Flow
              </button>
              <button
                id="flow_selector_attendance"
                onClick={() => setActiveFlow('attendance')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFlow === 'attendance'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                2. Attendance Automation Flow
              </button>
              <button
                id="flow_selector_course"
                onClick={() => setActiveFlow('course')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeFlow === 'course'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                3. Course Enrollment Provisioning
              </button>
            </div>
          </div>

          {/* Workflow Interactive Screen */}
          <div className="bg-white border border-slate-200/80 p-6 sm:p-10 rounded-[24px] shadow-sm max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              {activeFlow === 'assignment' && (
                <motion.div
                  key="assignment-flow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  <div className="text-left">
                    <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-md">Sequence A</span>
                      Student Submits Assignment Flow
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">Traces the exact database trigger starting when a student submits their coursework PDF files.</p>
                  </div>

                  {/* Flow Steps Diagram Card */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                    
                    {/* Stepper 1 */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2 relative">
                      <div className="bg-blue-600 text-white h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                      <h5 className="text-xs font-bold text-slate-800">Student Uploads</h5>
                      <p className="text-[10px] text-slate-500">Student uploads PDF and slides to the Assignment module.</p>
                      <span className="absolute top-1/2 -right-3 -translate-y-1/2 hidden md:block text-slate-300 font-bold">&rarr;</span>
                    </div>

                    {/* Stepper 2 */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2 relative">
                      <div className="bg-blue-600 text-white h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                      <h5 className="text-xs font-bold text-slate-800">Professor Grades</h5>
                      <p className="text-[10px] text-slate-500">Professor receives submission alert, opens PDF, and records a grade score.</p>
                      <span className="absolute top-1/2 -right-3 -translate-y-1/2 hidden md:block text-slate-300 font-bold">&rarr;</span>
                    </div>

                    {/* Stepper 3 */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2 relative">
                      <div className="bg-blue-600 text-white h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                      <h5 className="text-xs font-bold text-slate-800">Student View Updates</h5>
                      <p className="text-[10px] text-slate-500">The grade instantly propagates, recalculating cumulative GPA in student dashboard.</p>
                      <span className="absolute top-1/2 -right-3 -translate-y-1/2 hidden md:block text-slate-300 font-bold">&rarr;</span>
                    </div>

                    {/* Stepper 4 */}
                    <div className="bg-slate-900 text-white p-4 rounded-xl text-left space-y-2">
                      <div className="bg-emerald-500 text-white h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold">4</div>
                      <h5 className="text-xs font-bold text-white">Admin Logs Sync</h5>
                      <p className="text-[10px] text-slate-400">Department report stats and grade averages update in administrative console.</p>
                    </div>

                  </div>
                </motion.div>
              )}

              {activeFlow === 'attendance' && (
                <motion.div
                  key="attendance-flow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  <div className="text-left">
                    <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-md">Sequence B</span>
                      Professor Marks Attendance Flow
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">Simulates live roll call and the automatic attendance index matching mechanism.</p>
                  </div>

                  {/* Flow Steps Diagram Card */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                    
                    {/* Stepper 1 */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2 relative">
                      <div className="bg-emerald-600 text-white h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                      <h5 className="text-xs font-bold text-slate-800">Faculty Updates Sheet</h5>
                      <p className="text-[10px] text-slate-500">Instructor marks attendance manually or tracks dynamic lecture progress.</p>
                      <span className="absolute top-1/2 -right-3 -translate-y-1/2 hidden md:block text-slate-300 font-bold">&rarr;</span>
                    </div>

                    {/* Stepper 2 */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2 relative">
                      <div className="bg-emerald-600 text-white h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                      <h5 className="text-xs font-bold text-slate-800">Roster Updates Live</h5>
                      <p className="text-[10px] text-slate-500">Student sees updated attendance percent (e.g. 98.6%) and dynamic certificate eligibility.</p>
                      <span className="absolute top-1/2 -right-3 -translate-y-1/2 hidden md:block text-slate-300 font-bold">&rarr;</span>
                    </div>

                    {/* Stepper 3 */}
                    <div className="bg-slate-900 text-white p-4 rounded-xl text-left space-y-2">
                      <div className="bg-blue-500 text-white h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                      <h5 className="text-xs font-bold text-white">Admin Attendance Reports</h5>
                      <p className="text-[10px] text-slate-400">Total institutional metrics update for compliance and registrar archiving.</p>
                    </div>

                  </div>
                </motion.div>
              )}

              {activeFlow === 'course' && (
                <motion.div
                  key="course-flow"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-8"
                >
                  <div className="text-left">
                    <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded-md">Sequence C</span>
                      Admin Provisions Course Flow
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">Illustrates the creation of brand new curricula allocations and student self-enrollment keys.</p>
                  </div>

                  {/* Flow Steps Diagram Card */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
                    
                    {/* Stepper 1 */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2 relative">
                      <div className="bg-indigo-600 text-white h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                      <h5 className="text-xs font-bold text-slate-800">Admin Allocates</h5>
                      <p className="text-[10px] text-slate-500">Admin inputs new course code, assigns departments, and sets instructor ID.</p>
                      <span className="absolute top-1/2 -right-3 -translate-y-1/2 hidden md:block text-slate-300 font-bold">&rarr;</span>
                    </div>

                    {/* Stepper 2 */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-2 relative">
                      <div className="bg-indigo-600 text-white h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                      <h5 className="text-xs font-bold text-slate-800">Professor Syncs</h5>
                      <p className="text-[10px] text-slate-500">The assigned professor finds the course in their roster to create modules.</p>
                      <span className="absolute top-1/2 -right-3 -translate-y-1/2 hidden md:block text-slate-300 font-bold">&rarr;</span>
                    </div>

                    {/* Stepper 3 */}
                    <div className="bg-slate-900 text-white p-4 rounded-xl text-left space-y-2">
                      <div className="bg-[#38B889] text-white h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                      <h5 className="text-xs font-bold text-white">Student Enrollments Open</h5>
                      <p className="text-[10px] text-slate-400">Students instantly search, view syllabus overview, and start video streaming.</p>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Six Core Features Grid Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-extrabold text-blue-600 tracking-widest uppercase bg-blue-50 px-4 py-1.5 rounded-full">
              Full Spectrum Platform Modules
            </span>
            <h2 className="text-3xl font-poppins font-black text-slate-900">
              Core Platform Features
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xl mx-auto">
              Our LMS provides robust, enterprise-grade tools designed specifically to integrate classrooms, grading, and authentication under one unified ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresList.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={i}
                  className="bg-slate-50 hover:bg-white p-6 rounded-[20px] border border-slate-200/50 hover:border-blue-600/30 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 text-left flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className={`p-3 rounded-2xl bg-gradient-to-tr ${feat.color} text-white inline-flex shadow-xs`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-poppins font-black text-slate-800">{feat.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed">{feat.desc}</p>
                  </div>
                  <div>
                    <button 
                      onClick={() => setShowAuthModal(true)}
                      className="text-blue-600 hover:text-blue-700 font-bold text-xs inline-flex items-center gap-1 group cursor-pointer"
                    >
                      <span>Explore feature</span> 
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* University Metrics / Statistics */}
      <section id="statistics" className="py-20 bg-[#F0F6FF]/50 border-y border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="text-xs font-extrabold text-blue-600 tracking-wider uppercase bg-blue-100 px-3.5 py-1 rounded-full">
              University Metrics
            </span>
            <h2 className="text-3xl font-poppins font-black text-slate-900">
              A Trusted Network of Global Education
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Real-time synchronization indices measuring global course attendance averages, department growth, and overall server uptime reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <div key={i} className="bg-white p-6 rounded-[20px] border border-slate-200/60 shadow-xs flex flex-col justify-center items-center text-center space-y-3 hover:border-blue-600/20 transition-colors">
                  <div className={`p-4 rounded-full bg-slate-50 ${stat.color} shadow-inner`}>
                    <StatIcon className="h-6 w-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-poppins font-black text-slate-900 tracking-tight">{stat.value}</h3>
                    <p className="text-xs text-slate-800 font-black uppercase tracking-wider mt-1">{stat.label}</p>
                    <p className="text-[10px] text-slate-400 mt-1 leading-snug">{stat.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="space-y-3">
            <span className="text-xs font-extrabold uppercase text-amber-500 tracking-widest block">
              Testimonials
            </span>
            <h2 className="text-3xl font-poppins font-black text-slate-900">
              Loved by Students &amp; Faculty
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto">
              Read how users from Student, Professor, and Administrative cohorts successfully coordinate lessons and check real-time attendance averages.
            </p>
          </div>

          {/* Testimonial Cards Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div 
                key={idx}
                className={`p-6 rounded-[22px] border text-left flex flex-col justify-between space-y-6 ${t.bg} hover:shadow-md transition-shadow`}
              >
                <div className="space-y-4">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>
                
                <div className="flex items-center gap-3 pt-3 border-t border-slate-200/50">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                    {t.imgLetter}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-800">{t.author}</p>
                    <p className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-50 border-t border-slate-200/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-poppins font-black text-slate-900">
              Contact Admissions &amp; Tech Support
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto">
              Have questions about online degrees, class scheduling, administrative access roles, or syncing API endpoints? Send us your message.
            </p>
          </div>

          {contactSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-[20px] text-emerald-800 flex flex-col items-center justify-center gap-2 animate-bounce">
              <CheckCircle className="h-10 w-10 text-emerald-600" />
              <h4 className="font-bold text-base">Inquiry Dispatched Successfully!</h4>
              <p className="text-xs text-emerald-600">Our registrar officer on duty will reply via your email address within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Aisha Malik"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="e.g. aisha@university.edu"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Message Content</label>
                <textarea
                  required
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder="How can we assist with your academic cloud portal?"
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none transition resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Submit Institutional Question</span> 
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-xl text-white">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <p className="font-poppins font-black text-white text-base">Institute LMS</p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                One Connected Learning Platform for Students, Professors, and Administrators. Streamlining academic coordination and grading metrics.
              </p>
            </div>

            <div>
              <h5 className="text-white text-xs font-extrabold uppercase tracking-wider mb-4">Courses</h5>
              <ul className="space-y-2.5 text-xs text-slate-500">
                <li><a href="#" className="hover:text-white transition-colors">Computer Science CS101</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Business Administration BUS102</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Theological Studies QURAN101</a></li>
                <li><a href="#" className="hover:text-white transition-colors">General Curricula</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white text-xs font-extrabold uppercase tracking-wider mb-4">Admissions &amp; Help</h5>
              <ul className="space-y-2.5 text-xs text-slate-500">
                <li><a href="#" className="hover:text-white transition-colors">Help Center / Docs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Degree Requirements</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Registrar Office Contacts</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security Code SSO</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-white text-xs font-extrabold uppercase tracking-wider mb-4">About Us</h5>
              <ul className="space-y-2.5 text-xs text-slate-500">
                <li><a href="#" className="hover:text-white transition-colors">About Our Platform</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy Matrix</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Academic Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-xxs">
            <p>© 2026 Registrar &amp; Theological Academic Office. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span>&bull;</span>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <span>&bull;</span>
              <a href="#" className="hover:text-white transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Demo Video Mockup Overlay */}
      <AnimatePresence>
        {demoVideoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDemoVideoOpen(false)}
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[24px] shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden relative z-10 p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-blue-600 font-bold">
                  <Play className="h-5 w-5" />
                  <span className="text-sm font-poppins">LMS System Platform Walkthrough</span>
                </div>
                <button 
                  onClick={() => setDemoVideoOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                  title="Close Demo Video"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Video representation container */}
              <div className="bg-slate-900 aspect-video rounded-xl relative overflow-hidden flex flex-col items-center justify-center text-white p-4 text-center">
                <div className="absolute inset-0 bg-cover bg-center filter opacity-40" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800')" }} />
                <div className="relative z-10 space-y-3">
                  <div className="bg-blue-600 py-1 px-3 text-white text-xxs font-black tracking-widest uppercase rounded-full inline-block animate-pulse">
                    MOCK DEMO LECTURE ACTIVE
                  </div>
                  <h4 className="text-lg font-poppins font-bold">LMS Video Player System Walkthrough</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    Once signed in, watch our system track player actions, update attendance record percentages, and automatically generate Gemini AI mock tests on completion!
                  </p>
                  <button
                    onClick={() => {
                      setDemoVideoOpen(false);
                      setIsLogin(true);
                      setShowAuthModal(true);
                    }}
                    className="bg-white text-slate-900 hover:bg-blue-600 hover:text-white px-5 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 mx-auto justify-center cursor-pointer"
                  >
                    Login to Stream Video File Now
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Premium Split Screen Authentication Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Blur Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            {/* Split Modal Shell */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-[24px] shadow-2xl border border-slate-100 max-w-4xl w-full overflow-hidden relative z-10 grid grid-cols-1 md:grid-cols-12 min-h-[500px]"
            >
              {/* Left Column (Academic Graphic Display) */}
              <div className="hidden md:flex md:col-span-5 bg-gradient-to-tr from-slate-900 via-slate-800 to-blue-900 text-white p-8 flex-col justify-between relative overflow-hidden">
                {/* Visual grid overlay */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />
                
                <div className="relative z-10 space-y-3">
                  <div className="inline-flex bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xxs font-extrabold uppercase border border-white/15">
                    Authorized Terminal Gateway
                  </div>
                  <h3 className="text-2xl font-poppins font-black leading-tight">Registrar SSO Gateway</h3>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    Log in with single-sign-on (SSO) credentials or register a new account under the Student, Faculty, or Admin cohorts.
                  </p>
                </div>

                <div className="relative z-10 space-y-4">
                  <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center gap-3">
                    <Shield className="h-5 w-5 text-amber-300" />
                    <div className="text-left text-xxs">
                      <p className="font-bold text-slate-100 uppercase tracking-widest">Session Security</p>
                      <p className="text-slate-400">Guarded by active JWT Roster Permissions</p>
                    </div>
                  </div>
                  
                  <div className="text-[10px] text-white/50 text-left font-mono leading-relaxed">
                    &bull; Role-Based Authentication <br />
                    &bull; Auto-Sync Database <br />
                    &bull; Multi-Tenant Support
                  </div>
                </div>
              </div>

              {/* Right Column (Auth form) */}
              <div className="col-span-1 md:col-span-7 p-6 sm:p-8 flex flex-col justify-between relative overflow-y-auto max-h-[90vh] md:max-h-[600px] scrollbar-thin">
                
                {/* Close Button */}
                <button 
                  onClick={() => setShowAuthModal(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                  title="Close login modal"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="space-y-6">
                  <div className="text-left">
                    <h3 className="text-xl font-poppins font-black text-slate-800">
                      {isLogin ? 'Access Academic Dashboard' : 'Create LMS Account'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                      {isLogin ? 'Enter your institutional credentials or use a preset login' : 'Choose your educational role and fill out the fields.'}
                    </p>
                  </div>

                  {/* One-Click Quick Login Row */}
                  {isLogin && (
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">
                        One-Click Quick Login Presets
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          id="quick_student"
                          onClick={() => handleQuickLogin('student')}
                          className="flex flex-col items-center justify-center p-2.5 border border-blue-100 hover:border-blue-300 hover:bg-blue-50 bg-blue-50/20 rounded-xl transition text-slate-700 text-xxs font-bold cursor-pointer"
                        >
                          <GraduationCap className="h-4 w-4 text-blue-600 mb-1" />
                          Student
                        </button>
                        <button
                          type="button"
                          id="quick_professor"
                          onClick={() => handleQuickLogin('professor')}
                          className="flex flex-col items-center justify-center p-2.5 border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50 bg-emerald-50/20 rounded-xl transition text-slate-700 text-xxs font-bold cursor-pointer"
                        >
                          <BookOpen className="h-4 w-4 text-emerald-600 mb-1" />
                          Professor
                        </button>
                        <button
                          type="button"
                          id="quick_admin"
                          onClick={() => handleQuickLogin('admin')}
                          className="flex flex-col items-center justify-center p-2.5 border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 bg-indigo-50/20 rounded-xl transition text-slate-700 text-xxs font-bold cursor-pointer"
                        >
                          <Shield className="h-4 w-4 text-indigo-600 mb-1" />
                          Admin
                        </button>
                      </div>

                      {/* Explicit Demo Credentials Details Block */}
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 space-y-1.5 text-[11px] text-slate-600 font-medium text-left">
                        <div className="flex justify-between items-center gap-2">
                          <span className="truncate">🎓 <strong>Student:</strong> student@university.edu</span>
                          <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px] shrink-0 font-bold select-all">student123</span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <span className="truncate">👨‍🏫 <strong>Professor:</strong> professor@university.edu</span>
                          <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px] shrink-0 font-bold select-all">professor123</span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <span className="truncate">🛡️ <strong>Admin:</strong> admin@university.edu</span>
                          <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px] shrink-0 font-bold select-all">admin123</span>
                        </div>
                      </div>

                      <div className="relative my-4 flex items-center justify-center">
                        <div className="w-full border-t border-slate-200" />
                        <span className="bg-white px-2.5 text-[10px] text-slate-400 uppercase tracking-widest font-bold shrink-0 absolute z-10">
                          Or credentials
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Auth Form Formulator */}
                  <form className="space-y-4 text-left" onSubmit={handleSubmitAuth}>
                    {error && (
                      <div className="bg-rose-50 border-l-4 border-rose-500 p-3 rounded-lg text-rose-700 text-xs flex items-start gap-2 animate-shake">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span className="font-semibold">{error}</span>
                      </div>
                    )}

                    {/* Registration Fields dynamically rendered per Role */}
                    {!isLogin && (
                      <div className="space-y-3.5">
                        {/* Selector for Registration Role */}
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Select Cohort Role</label>
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setAuthRole('student');
                                setError(null);
                              }}
                              className={`py-2 rounded-lg text-xxs font-bold transition-all border cursor-pointer ${
                                authRole === 'student'
                                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                              }`}
                            >
                              Student
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setAuthRole('professor');
                                setError(null);
                              }}
                              className={`py-2 rounded-lg text-xxs font-bold transition-all border cursor-pointer ${
                                authRole === 'professor'
                                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                              }`}
                            >
                              Professor
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setAuthRole('admin');
                                setError(null);
                              }}
                              className={`py-2 rounded-lg text-xxs font-bold transition-all border cursor-pointer ${
                                authRole === 'admin'
                                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                              }`}
                            >
                              Admin
                            </button>
                          </div>
                        </div>

                        {/* Common: Full Name & Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
                            <input
                              type="text"
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              placeholder="e.g. Zayn Malik"
                              className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none transition"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">University Email Address</label>
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="name@university.edu"
                              className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none transition"
                            />
                          </div>
                        </div>

                        {/* Role-Specific Fields Rendering */}
                        {authRole === 'student' && (
                          <div className="space-y-3 bg-blue-50/30 p-3 rounded-xl border border-blue-100/60">
                            <p className="text-[10px] font-black uppercase text-blue-500 tracking-wider">Student Parameters</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Student ID</label>
                                <input
                                  type="text"
                                  required
                                  value={studentId}
                                  onChange={(e) => setStudentId(e.target.value)}
                                  placeholder="e.g. ST-281920"
                                  className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none transition"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Semester</label>
                                <select
                                  value={semester}
                                  onChange={(e) => setSemester(e.target.value)}
                                  className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                                >
                                  {semesters.map(sem => (
                                    <option key={sem} value={sem}>{sem}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1">Department</label>
                              <select
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                              >
                                {departments.map(dept => (
                                  <option key={dept} value={dept}>{dept}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}

                        {authRole === 'professor' && (
                          <div className="space-y-3 bg-emerald-50/30 p-3 rounded-xl border border-emerald-100/60">
                            <p className="text-[10px] font-black uppercase text-emerald-500 tracking-wider">Professor Parameters</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Faculty ID</label>
                                <input
                                  type="text"
                                  required
                                  value={facultyId}
                                  onChange={(e) => setFacultyId(e.target.value)}
                                  placeholder="e.g. FAC-44021"
                                  className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none transition"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Designation</label>
                                <select
                                  value={designation}
                                  onChange={(e) => setDesignation(e.target.value)}
                                  className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                                >
                                  {designations.map(des => (
                                    <option key={des} value={des}>{des}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1">Department</label>
                              <select
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                              >
                                {departments.map(dept => (
                                  <option key={dept} value={dept}>{dept}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        )}

                        {authRole === 'admin' && (
                          <div className="space-y-3 bg-indigo-50/30 p-3 rounded-xl border border-indigo-100/60">
                            <p className="text-[10px] font-black uppercase text-indigo-500 tracking-wider">Administrator Parameters</p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Employee ID</label>
                                <input
                                  type="text"
                                  required
                                  value={employeeId}
                                  onChange={(e) => setEmployeeId(e.target.value)}
                                  placeholder="e.g. EMP-9920"
                                  className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none transition"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1">Administrative Role</label>
                                <select
                                  value={adminRole}
                                  onChange={(e) => setAdminRole(e.target.value)}
                                  className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none"
                                >
                                  {adminRoles.map(r => (
                                    <option key={r} value={r}>{r}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Common: Enterprise Phone & passwords */}
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Enterprise Phone</label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 (555) 0123"
                            className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none transition"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Secure PIN Password</label>
                            <input
                              type="password"
                              required
                              value={passwordReg}
                              onChange={(e) => setPasswordReg(e.target.value)}
                              placeholder="••••••••"
                              className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none transition"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Confirm Password</label>
                            <input
                              type="password"
                              required
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              placeholder="••••••••"
                              className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none transition"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Login Mode Inputs */}
                    {isLogin && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">University Email Address</label>
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@university.edu"
                            className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Secure PIN Password</label>
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none transition"
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-blue-200 transition-all text-xs disabled:opacity-50 mt-4 cursor-pointer"
                    >
                      {loading ? 'Please wait...' : isLogin ? 'Access Academic Dashboard' : 'Register New Sandbox Seat'}
                    </button>
                  </form>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xxs text-slate-400 font-medium">
                  <div className="flex items-center gap-1">
                    <Lock className="h-3 w-3 text-slate-400 shrink-0" />
                    <span>Guarded with OAuth JWT Presets</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setIsLogin(!isLogin);
                    }}
                    className="text-blue-600 font-bold hover:underline cursor-pointer"
                  >
                    {isLogin ? "Don't have an invitation? Register" : 'Already have account? Sign In'}
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
