import React, { useState, useEffect } from 'react';
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

  // Keyboard accessibility listeners for Auth modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showAuthModal) {
        e.preventDefault();
        setShowAuthModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAuthModal]);
  
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
  const [activeHeroNode, setActiveHeroNode] = useState<'student' | 'professor' | 'admin' | 'core'>('core');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const categories = [
    { name: "Computer Science", courses: 14, icon: Laptop, color: "bg-blue-50 text-blue-600 border-blue-100", desc: "Algorithms, Python programming, and systems design." },
    { name: "Business Administration", courses: 8, icon: TrendingUp, color: "bg-emerald-50 text-emerald-600 border-emerald-100", desc: "Corporate communications, management, and marketing." },
    { name: "Social Sciences", courses: 6, icon: BookMarked, color: "bg-amber-50 text-amber-600 border-amber-100", desc: "Sociology, global ethics, and community leadership models." },
    { name: "Electrical Engineering", courses: 11, icon: Cpu, color: "bg-indigo-50 text-indigo-600 border-indigo-100", desc: "Microprocessors, circuit boards, and logical gates." },
    { name: "General Education", courses: 19, icon: School, color: "bg-purple-50 text-purple-600 border-purple-100", desc: "Academic writing, logic, and global history studies." }
  ];

  const featuredCourses = [
    {
      id: "course_1",
      title: "Introduction to Computer Science",
      code: "CS101",
      desc: "Embark on standard algorithms, CPU microarchitectures, monolithic operating systems, and core Python programming variables.",
      instructor: "Dr. Sarah Jenkins",
      creditHours: 4,
      durationWeeks: 16,
      rating: 4.9,
      reviews: 1240,
      badge: "Core Requirement",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=90&w=1000"
    },
    {
      id: "course_5",
      title: "Business Communication & Leadership",
      code: "BUS102",
      desc: "Learn corporate memo layouts with Barbara Minto's Pyramid Principle, executive Q&A delivery, and conflict resolution tactics.",
      instructor: "Prof. Marcus Aurelius",
      creditHours: 3,
      durationWeeks: 16,
      rating: 4.8,
      reviews: 840,
      badge: "Professional Elective",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=90&w=1000"
    }
  ];

  const instructors = [
    {
      name: "Dr. Sarah Jenkins",
      role: "Dean of Computer Science",
      bio: "Ex-Google Senior Research Scientist specializing in compiler optimizations, algorithmic complexity analysis, and modern full-stack systems design.",
      rating: "4.95/5",
      courses: 4,
      badge: "CS Leader",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=90&w=1000"
    },
    {
      name: "Prof. Marcus Aurelius",
      role: "Chair of Business Management",
      bio: "Corporate consultant with 20+ years of boardroom advisory expertise. Pioneer in executive communication techniques and situational ethics structures.",
      rating: "4.88/5",
      courses: 3,
      badge: "Strategy Coach",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=90&w=1000"
    },
    {
      name: "Dr. Tariq Mahmood",
      role: "Director of Islamic Epistemology",
      bio: "Renowned academic specializing in Arabic semantic root linguistics, comparative theology, and global community leadership frameworks.",
      rating: "4.98/5",
      courses: 2,
      badge: "Ethics Dean",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=90&w=1000"
    }
  ];

  const blogPosts = [
    {
      title: "The Evolution of AI-Powered Grading in Modern LMS",
      category: "EdTech Trends",
      date: "June 24, 2026",
      readTime: "5 min read",
      desc: "Discover how large language models are transforming grading workflows from simple rubric ticks to deep semantic analysis of student essays.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=90&w=1000"
    },
    {
      title: "The Minto Pyramid Principle: Write Like a McKinsey Consultant",
      category: "Business Tactics",
      date: "June 18, 2026",
      readTime: "8 min read",
      desc: "A deep dive into Barbara Minto's famous communication model. Learn how placing your conclusion first improves written memorandums.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=90&w=1000"
    },
    {
      title: "Clean Architecture: Scaling Modern Web Platforms",
      category: "Software Tech",
      date: "June 12, 2026",
      readTime: "6 min read",
      desc: "How modular design and micro-frontends enable teams to scale web applications seamlessly without tight component coupling.",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=90&w=1000"
    }
  ];

  const faqs = [
    {
      q: "How does the AI Tutor help me study?",
      a: "Our platform integrates Google's Gemini models directly into your learning dashboard. It analyzes course lessons and slides to generate custom mock tests, answer concept queries in real-time, and read responses aloud using natural speech synthesis."
    },
    {
      q: "Is there a limit to the number of courses I can enroll in?",
      a: "No! The Free Learner Seat allows students to register and join as many sandbox courses as they wish, including all Computer Science, Business, and Islamic Studies tracks."
    },
    {
      q: "How is student attendance recorded automatically?",
      a: "Our system monitors video stream playback percentage and interactive quiz submissions. Once a student completes a lesson, their attendance record updates instantly inside the connected database, reflecting on the Registrar panel."
    },
    {
      q: "Can professors host custom exams and grading structures?",
      a: "Yes! The Professor Portal includes a comprehensive Gradebook and Exam builder where instructors can configure custom question weights, essay rubrics, and direct grade distribution panels."
    },
    {
      q: "How secure is the Single Sign-On (SSO) gateway?",
      a: "The portal uses secure token-based authorization. It separates permissions into Student, Professor, and Registrar Administrative roles, preventing cross-portal privilege escalation."
    }
  ];

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
        const contentType = res.headers.get('content-type');
        let data;
        if (contentType && contentType.includes('application/json')) {
          try {
            data = await res.json();
          } catch (e) {
            throw new Error('Failed to parse server response. Please refresh and try again.');
          }
        } else {
          throw new Error('Iframe cookie block or connection issue detected. Please resolve this by clicking the "Open in new tab" button at the top-right of this preview panel. This is required for authentication in Safari, iOS, or Incognito windows.');
        }
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
          const contentType = res.headers.get('content-type');
          let data;
          if (contentType && contentType.includes('application/json')) {
            try {
              data = await res.json();
            } catch (e) {
              throw new Error('Failed to parse server response. Please refresh and try again.');
            }
          } else {
            throw new Error('Iframe cookie block or connection issue detected. Please resolve this by clicking the "Open in new tab" button at the top-right of this preview panel. This is required for authentication in Safari, iOS, or Incognito windows.');
          }
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
          const contentType = res.headers.get('content-type');
          let data;
          if (contentType && contentType.includes('application/json')) {
            try {
              data = await res.json();
            } catch (e) {
              throw new Error('Failed to parse server response. Please refresh and try again.');
            }
          } else {
            throw new Error('Iframe cookie block or registration connection issue detected. Please resolve this by clicking the "Open in new tab" button at the top-right of this preview panel. This is required for authentication in Safari, iOS, or Incognito windows.');
          }
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
          <nav className="hidden lg:flex items-center gap-6 text-[11px] font-black text-slate-500 uppercase tracking-widest">
            <a href="#categories" className="hover:text-blue-600 transition-colors">Categories</a>
            <a href="#courses" className="hover:text-blue-600 transition-colors">Courses</a>
            <a href="#architecture" className="hover:text-blue-600 transition-colors">Portals</a>
            <a href="#workflows" className="hover:text-blue-600 transition-colors">Sync Flows</a>
            <a href="#instructors" className="hover:text-blue-600 transition-colors">Instructors</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
            <a href="#blog" className="hover:text-blue-600 transition-colors">Resources</a>
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
            <div className="w-full max-w-[500px] bg-white p-6 sm:p-8 rounded-[24px] shadow-2xl border border-slate-200/40 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full filter blur-xl" />
              
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-100">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                  Ecosystem State: Connected
                </span>
                <span className="bg-blue-50 text-blue-600 font-mono text-[9px] font-bold px-2.5 py-1 rounded-md">
                  Active Sync
                </span>
              </div>

              {/* Interactive Node Guide Banner */}
              <div className="text-center mb-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded border border-slate-100">
                  ⚡ Click or hover any node below to simulate active logs
                </span>
              </div>

              {/* Interconnected Nodes Visualizer Map */}
              <div className="relative py-12 flex flex-col items-center justify-center min-h-[280px]">
                
                {/* Central Database Core Node */}
                <button 
                  type="button"
                  onClick={() => setActiveHeroNode('core')}
                  onMouseEnter={() => setActiveHeroNode('core')}
                  className={`relative z-20 w-24 h-24 bg-gradient-to-tr from-slate-900 to-slate-800 rounded-3xl shadow-xl flex flex-col items-center justify-center border-4 text-white p-2 text-center transition-all duration-300 cursor-pointer ${
                    activeHeroNode === 'core' ? 'border-sky-400 scale-105 shadow-sky-200/50' : 'border-white hover:border-slate-400'
                  }`}
                >
                  <div className="absolute -inset-2 bg-blue-500/20 rounded-[28px] filter blur-md animate-pulse" />
                  <Database className="h-7 w-7 text-blue-400 mb-1" />
                  <span className="text-[9px] uppercase font-black tracking-widest text-slate-200">LMS CORE</span>
                  <span className="text-[7px] font-mono text-blue-400">DB INGRESS</span>
                </button>

                {/* Satellite Portal Node 1: Student Portal (Left) */}
                <button
                  type="button"
                  onClick={() => setActiveHeroNode('student')}
                  onMouseEnter={() => setActiveHeroNode('student')}
                  className={`absolute top-0 left-0 z-10 w-32 bg-white p-3 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col gap-1 ${
                    activeHeroNode === 'student' 
                      ? 'border-blue-500 shadow-md scale-105 -translate-y-1 bg-blue-50/20' 
                      : 'border-slate-200/80 hover:border-blue-300 hover:bg-slate-50/40'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="bg-blue-50 p-1 rounded-lg text-blue-600">
                      <GraduationCap className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800">Student Portal</span>
                  </div>
                  <p className="text-[8.5px] text-slate-400 leading-tight">Enrolls lectures, solves dynamic quizzes, and tracks study progress.</p>
                </button>

                {/* Satellite Portal Node 2: Professor Portal (Right) */}
                <button
                  type="button"
                  onClick={() => setActiveHeroNode('professor')}
                  onMouseEnter={() => setActiveHeroNode('professor')}
                  className={`absolute top-0 right-0 z-10 w-32 bg-white p-3 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col gap-1 ${
                    activeHeroNode === 'professor' 
                      ? 'border-emerald-500 shadow-md scale-105 -translate-y-1 bg-emerald-50/20' 
                      : 'border-slate-200/80 hover:border-emerald-300 hover:bg-slate-50/40'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="bg-emerald-50 p-1 rounded-lg text-emerald-600">
                      <BookOpen className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800">Professor Portal</span>
                  </div>
                  <p className="text-[8.5px] text-slate-400 leading-tight">Publishes clinical syllabus tracks, records student registers.</p>
                </button>

                {/* Satellite Portal Node 3: Admin Portal (Bottom) */}
                <button
                  type="button"
                  onClick={() => setActiveHeroNode('admin')}
                  onMouseEnter={() => setActiveHeroNode('admin')}
                  className={`absolute bottom-0 z-10 w-36 bg-white p-3 rounded-2xl border text-center transition-all duration-300 cursor-pointer flex flex-col items-center gap-1 ${
                    activeHeroNode === 'admin' 
                      ? 'border-indigo-500 shadow-md scale-105 translate-y-1 bg-indigo-50/20' 
                      : 'border-slate-200/80 hover:border-indigo-300 hover:bg-slate-50/40'
                  }`}
                >
                  <div className="flex items-center gap-1.5 justify-center">
                    <div className="bg-indigo-50 p-1 rounded-lg text-indigo-600">
                      <Shield className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800">Admin Portal</span>
                  </div>
                  <p className="text-[8.5px] text-slate-400 leading-tight">Coordinates system files, manages users, optimizes server nodes.</p>
                </button>

                {/* Sync Connector SVG paths with flowing laser dots */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10" viewBox="0 0 400 300">
                  {/* Student to Core */}
                  <path d="M 120 70 L 200 150" stroke="#E2E8F0" strokeWidth="2.5" strokeDasharray="5,5" fill="none" />
                  <circle r="4.5" fill="#3B82F6">
                    <animateMotion dur="2s" repeatCount="indefinite" path="M 120 70 L 200 150" />
                  </circle>

                  {/* Professor to Core */}
                  <path d="M 280 70 L 200 150" stroke="#E2E8F0" strokeWidth="2.5" strokeDasharray="5,5" fill="none" />
                  <circle r="4.5" fill="#10B981">
                    <animateMotion dur="2.5s" repeatCount="indefinite" path="M 280 70 L 200 150" />
                  </circle>

                  {/* Core to Admin */}
                  <path d="M 200 150 L 200 240" stroke="#E2E8F0" strokeWidth="2.5" strokeDasharray="5,5" fill="none" />
                  <circle r="4.5" fill="#6366F1">
                    <animateMotion dur="1.8s" repeatCount="indefinite" path="M 200 150 L 200 240" />
                  </circle>
                </svg>
              </div>

              {/* Dynamic Real-Time Terminal Activity Logs Inspector */}
              <div className="mt-4 bg-slate-950 text-slate-200 rounded-2xl p-4 shadow-inner text-left font-mono text-[10.5px] space-y-1.5 relative overflow-hidden border border-slate-800">
                <div className="absolute top-0 right-0 p-1.5 bg-slate-900 border-l border-b border-slate-800 text-[8px] font-black tracking-widest text-slate-500 uppercase flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse" />
                  <span>Terminal Inspector</span>
                </div>
                
                {activeHeroNode === 'core' && (
                  <>
                    <p className="text-[#38B889] font-black flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                      &gt; CORE STATE: STANDBY_OPTIMAL
                    </p>
                    <p className="text-slate-400">Database Engine: local_file_system (Drizzle SQLite/Memory)</p>
                    <p className="text-slate-400">Platform Sync: Active (WebSocket proxying bypassed)</p>
                    <p className="text-slate-400">Gemini LLM Channel: Connected (Model: gemini-2.5-flash)</p>
                  </>
                )}

                {activeHeroNode === 'student' && (
                  <>
                    <p className="text-blue-400 font-black flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-ping inline-block" />
                      &gt; NODE STIMULUS: STUDENT_PORTAL_ACTIVE
                    </p>
                    <p className="text-slate-400">User: Zayn Malik (student@university.edu)</p>
                    <p className="text-slate-400">Recent: Passed quiz "Variables & Types" (Grade: 100%)</p>
                    <p className="text-slate-400">Sync payload: &#123; attPercentage: 92%, certs: 1 &#125;</p>
                  </>
                )}

                {activeHeroNode === 'professor' && (
                  <>
                    <p className="text-emerald-400 font-black flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                      &gt; NODE STIMULUS: PROFESSOR_PORTAL_ACTIVE
                    </p>
                    <p className="text-slate-400">User: Dr. Sarah Jenkins (professor@university.edu)</p>
                    <p className="text-[#38B889]">Broadcast: Sent answer to Zayn Malik query</p>
                    <p className="text-slate-400">Sync payload: &#123; coursesCreated: 4, gradingIndex: 100% &#125;</p>
                  </>
                )}

                {activeHeroNode === 'admin' && (
                  <>
                    <p className="text-indigo-400 font-black flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-ping inline-block" />
                      &gt; NODE STIMULUS: ADMIN_CONSOLE_ACTIVE
                    </p>
                    <p className="text-slate-400">System thread ID: node_main_ingress_0</p>
                    <p className="text-slate-400">Database Sync: Storage allocation verified</p>
                    <p className="text-slate-400">Diagnostics: Latency 12ms | Memory 94MB | Storage OK</p>
                  </>
                )}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Course Categories Section */}
      <section id="categories" className="py-20 bg-slate-50 relative overflow-hidden border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full inline-block">
              Academic Disciplines
            </span>
            <h2 className="text-3xl font-poppins font-black text-slate-900 leading-tight">
              Explore Top Course Categories
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed max-w-2xl mx-auto">
              Our curriculum spans major technical, leadership, and ethical branches, curated meticulously by certified university deans.
            </p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-6 w-full">
            {categories.map((cat, idx) => {
              const IconComponent = cat.icon;
              return (
                <div 
                  key={idx} 
                  className="bg-white border border-slate-200/60 p-6 rounded-[22px] shadow-xs hover:shadow-md hover:border-blue-500/30 hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between text-left group"
                >
                  <div className="space-y-4">
                    <div className={`p-3 rounded-xl ${cat.color} inline-flex border shadow-inner`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-poppins font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-slate-400 text-[10px] font-bold uppercase mt-1">
                        {cat.courses} Active Courses
                      </p>
                    </div>
                    <p className="text-slate-500 text-xxs leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100/80">
                    <button 
                      onClick={() => {
                        setIsLogin(false);
                        setShowAuthModal(true);
                      }}
                      className="text-slate-500 hover:text-blue-600 font-extrabold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Browse seats</span>
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section id="courses" className="py-20 bg-white relative overflow-hidden border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-5xl mx-auto">
            <div className="text-left space-y-3 max-w-2xl">
              <span className="text-xs font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3.5 py-1.5 rounded-full inline-block">
                Top-Tier Curriculum
              </span>
              <h2 className="text-3xl font-poppins font-black text-slate-900 leading-tight">
                Our Featured Academic Programs
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Join our standard student sandbox channels to experience state-of-the-art interactive modules with live automated attendance tracking.
              </p>
            </div>
            
            <button 
              onClick={() => {
                setIsLogin(false);
                setShowAuthModal(true);
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-widest px-6 py-3.5 rounded-2xl shadow-md transition-all self-start md:self-auto cursor-pointer"
            >
              View Full Catalog
            </button>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-8 max-w-5xl mx-auto w-full">
            {featuredCourses.map((course, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-slate-200/60 rounded-[24px] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Course Banner */}
                <div className="aspect-video w-full bg-slate-100 overflow-hidden relative">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Course Content */}
                <div className="p-6 text-left flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="bg-slate-100 text-slate-800 text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md">
                        {course.code}
                      </span>
                      <span className="bg-blue-50 text-blue-600 text-[9px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-md">
                        {course.badge}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xxs font-extrabold uppercase tracking-wide">
                      Instructor: {course.instructor}
                    </p>
                    <h3 className="text-base font-poppins font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                      {course.desc}
                    </p>
                  </div>

                  {/* Course stats */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-[11px] font-bold text-slate-500">
                    <div className="text-center border-r border-slate-100">
                      <p className="text-slate-400 text-[9px] uppercase font-bold tracking-widest">Duration</p>
                      <p className="text-slate-700 font-extrabold mt-0.5">{course.durationWeeks} Weeks</p>
                    </div>
                    <div className="text-center border-r border-slate-100">
                      <p className="text-slate-400 text-[9px] uppercase font-bold tracking-widest">Credits</p>
                      <p className="text-slate-700 font-extrabold mt-0.5">{course.creditHours} Hours</p>
                    </div>
                    <div className="text-center">
                      <p className="text-slate-400 text-[9px] uppercase font-bold tracking-widest">Rating</p>
                      <p className="text-amber-500 font-extrabold mt-0.5 flex items-center justify-center gap-0.5">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        {course.rating}
                      </p>
                    </div>
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Tuition Fee</p>
                      <p className="text-[#38B889] text-base font-black">Free Learner Seat</p>
                    </div>
                    <button 
                      onClick={() => {
                        setIsLogin(false);
                        setShowAuthModal(true);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] uppercase tracking-widest px-4.5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
                    >
                      Enroll Seat
                    </button>
                  </div>
                </div>
              </div>
            ))}
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

      {/* Instructors Showcase Section */}
      <section id="instructors" className="py-20 bg-slate-50 relative overflow-hidden border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full inline-block">
              World-Class Faculty
            </span>
            <h2 className="text-3xl font-poppins font-black text-slate-900 leading-tight">
              Learn from Outstanding Scholars
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed max-w-2xl mx-auto">
              Our instructors are leading industry scientists, executive chairs, and theologians committed to delivering pristine lectures and real-world skills.
            </p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-8 max-w-5xl mx-auto w-full">
            {instructors.map((inst, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-slate-200/60 rounded-[24px] overflow-hidden shadow-xs hover:shadow-md hover:border-blue-500/20 transition-all duration-300 flex flex-col justify-between text-left group"
              >
                <div>
                  {/* Portrait */}
                  <div className="aspect-[4/3] w-full bg-slate-100 overflow-hidden relative">
                    <img 
                      src={inst.image} 
                      alt={inst.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                  </div>

                  <div className="p-6 space-y-3">
                    <div>
                      <span className="bg-slate-900 text-white text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-md inline-block mb-2.5">
                        {inst.badge}
                      </span>
                      <h3 className="text-base font-poppins font-black text-slate-800">{inst.name}</h3>
                      <p className="text-blue-600 text-xs font-bold mt-0.5">{inst.role}</p>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      {inst.bio}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-bold text-slate-500">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-slate-800 font-extrabold">{inst.rating}</span>
                    </div>
                    <div className="text-slate-400">
                      {inst.courses} Core Courses
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SaaS Pricing Plans Section */}
      <section id="pricing" className="py-20 bg-white relative overflow-hidden border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3.5 py-1.5 rounded-full inline-block">
              Flexible Licensing
            </span>
            <h2 className="text-3xl font-poppins font-black text-slate-900 leading-tight">
              Simple, Transparent Pricing Tiers
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed max-w-2xl mx-auto">
              Choose the perfect seat type to join lectures, complete quiz certifications, or provision entire university registers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            {/* Free Learner Tier */}
            <div className="bg-slate-50 border border-slate-200/60 p-8 rounded-[24px] flex flex-col justify-between text-left hover:border-slate-300 transition-all shadow-xs relative">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-poppins font-black text-slate-800">Free Learner Seat</h3>
                  <p className="text-slate-400 text-xs mt-1">Perfect for individual study & research</p>
                </div>
                
                <div className="flex items-baseline">
                  <span className="text-3xl font-black text-slate-900">$0</span>
                  <span className="text-slate-400 text-xs ml-1 font-bold">/ forever</span>
                </div>

                <div className="border-t border-slate-200/80 pt-6 space-y-3.5">
                  {[
                    "Enroll in any 3 standard courses",
                    "Complete weekly quiz iterations",
                    "Active automated attendance track",
                    "Unlock 1 official certificate key",
                    "Basic offline slide download"
                  ].map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600 font-semibold">
                      <Check className="h-4.5 w-4.5 text-[#38B889] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button 
                  onClick={() => {
                    setIsLogin(false);
                    setShowAuthModal(true);
                  }}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-xl transition cursor-pointer"
                >
                  Join Sandbox Seat Free
                </button>
              </div>
            </div>

            {/* Academic Roster Tier - Popular */}
            <div className="bg-white border-2 border-blue-600 p-8 rounded-[24px] flex flex-col justify-between text-left hover:shadow-lg transition-all shadow-md relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[9px] font-black uppercase tracking-widest px-4 py-1 rounded-full shadow-md">
                Highly Popular Option
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-poppins font-black text-slate-800">Academic Roster</h3>
                  <p className="text-blue-600 text-xs font-bold mt-1">Best for professors & departments</p>
                </div>
                
                <div className="flex items-baseline">
                  <span className="text-3xl font-black text-slate-900">$12</span>
                  <span className="text-slate-400 text-xs ml-1 font-bold">/ seat / month</span>
                </div>

                <div className="border-t border-slate-100 pt-6 space-y-3.5">
                  {[
                    "Unlock ALL courses & materials",
                    "Interactive real-time sync charts",
                    "Full gradebook & rubric builder",
                    "Automated attendance matching",
                    "Unlimited certificates printing",
                    "AI tutor & summaries integrated"
                  ].map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600 font-semibold">
                      <Check className="h-4.5 w-4.5 text-blue-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <button 
                  onClick={() => {
                    setIsLogin(false);
                    setShowAuthModal(true);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-xl shadow-lg shadow-blue-200 transition cursor-pointer"
                >
                  Provision Department Seat
                </button>
              </div>
            </div>

            {/* Enterprise Grid Tier */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[24px] flex flex-col justify-between text-left hover:border-slate-700 transition-all shadow-xs relative text-white">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-poppins font-black text-white">Enterprise Grid</h3>
                  <p className="text-slate-400 text-xs mt-1">For universities & system aggregators</p>
                </div>
                
                <div className="flex items-baseline">
                  <span className="text-3xl font-black text-white">Custom</span>
                  <span className="text-slate-500 text-xs ml-1 font-bold">/ annual contract</span>
                </div>

                <div className="border-t border-slate-800 pt-6 space-y-3.5">
                  {[
                    "White-labeled custom portal domains",
                    "Dedicated isolated Cloud DB hosting",
                    "Bulk Registrar SSO integrations",
                    "Custom local file training for Gemini",
                    "99.99% system availability SLA",
                    "Dedicated technical registrar support"
                  ].map((feat, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-300 font-semibold">
                      <Check className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <a 
                  href="#contact"
                  className="w-full bg-white/10 hover:bg-white/15 text-white border border-white/20 font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-xl transition text-center block cursor-pointer"
                >
                  Contact Registrar Office
                </a>
              </div>
            </div>
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

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-slate-50 relative overflow-hidden border-t border-b border-slate-200/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full inline-block">
              Got Questions?
            </span>
            <h2 className="text-3xl font-poppins font-black text-slate-900 leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Find instant answers to general inquiries about enrollment, attendance tracking mechanics, AI assistance capabilities, and database security.
            </p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white border border-slate-200/60 rounded-[18px] overflow-hidden transition-all duration-300 shadow-xs"
                >
                  <button 
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-semibold text-slate-800 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <span className="text-sm font-poppins font-black leading-tight">{faq.q}</span>
                    <span className={`text-slate-400 font-extrabold text-lg transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                      ＋
                    </span>
                  </button>

                  <div 
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? 'max-h-48 border-t border-slate-100/80 bg-slate-50/40' : 'max-h-0'
                    }`}
                  >
                    <div className="p-6 text-xs sm:text-sm text-slate-500 leading-relaxed text-left">
                      {faq.a}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blog & Resources Section */}
      <section id="blog" className="py-20 bg-white relative overflow-hidden border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-5xl mx-auto">
            <div className="text-left space-y-3 max-w-2xl">
              <span className="text-xs font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3.5 py-1.5 rounded-full inline-block">
                Academic Gazette
              </span>
              <h2 className="text-3xl font-poppins font-black text-slate-900 leading-tight">
                Latest News &amp; Resources
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed">
                Stay updated with modern EdTech updates, research publications, corporate strategy guides, and theology preservation studies.
              </p>
            </div>
            
            <button 
              onClick={() => {
                setIsLogin(false);
                setShowAuthModal(true);
              }}
              className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs uppercase tracking-widest px-6 py-3.5 rounded-2xl shadow-md transition-all self-start md:self-auto cursor-pointer"
            >
              Explore Gazette
            </button>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-8 max-w-5xl mx-auto w-full">
            {blogPosts.map((post, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-slate-200/60 rounded-[24px] overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group text-left"
              >
                <div>
                  {/* Thumbnail */}
                  <div className="aspect-video w-full bg-slate-100 overflow-hidden relative">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="bg-slate-100 text-slate-800 text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-md">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <h3 className="text-base font-poppins font-black text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                      {post.desc}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button 
                    onClick={() => {
                      setIsLogin(false);
                      setShowAuthModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-700 font-extrabold text-xs inline-flex items-center gap-1 group/btn cursor-pointer"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
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
                <li><a href="#" className="hover:text-white transition-colors">Digital Marketing MKT101</a></li>
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
