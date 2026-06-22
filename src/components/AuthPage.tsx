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
  X
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [semester, setSemester] = useState('1st Semester');
  const [role, setRole] = useState<UserRole>('student');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Landing Page Interactive states
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

  const stats = [
    { label: 'Active Students', value: '12,450+', icon: Users, color: 'text-primary' },
    { label: 'Academic Faculty', value: '142+', icon: BookOpen, color: 'text-accent-emerald' },
    { label: 'Certificates Awarded', value: '8,920+', icon: Award, color: 'text-amber-500' },
    { label: 'Attendance Rate', value: '98.6%', icon: Sparkles, color: 'text-[#4F8CFF]' }
  ];

  const features = [
    {
      title: 'Adaptive Video Player',
      desc: 'High-speed lecture rendering with playback control, resume capabilities, and background metadata analysis.',
      icon: Play,
      badge: 'Interactive'
    },
    {
      title: 'AI Smart Tutor Assistant',
      desc: 'Powered by Gemini, asking deep research questions, parsing files, and compiling real-time exam mock tests.',
      icon: Zap,
      badge: 'AI Grounded'
    },
    {
      title: 'Integrated Fehm-ul-Quran',
      desc: 'Islamic geometric study tracks highlighting Tajweed Surahs, Tafseer modules of Al-Asr, and integrated scoring.',
      icon: Globe,
      badge: 'Spiritual Science'
    },
    {
      title: 'Real-Time Performance',
      desc: 'Professional analytics reports measuring lesson attendance averages and automated GPA performance indexes.',
      icon: Award,
      badge: 'Analytics'
    }
  ];

  const mockCourses = [
    { code: 'CS101', title: 'Intro to Software Architectures', level: 'Undergraduate', instructor: 'Dr. Sarah Jenkins', desc: 'Dive into computer science theory, hardware registers, and dynamic memory spaces.' },
    { code: 'BUS102', title: 'Global Business Strategy & Pitching', level: 'MBA Core', instructor: 'Prof. Faisal Al-Sabah', desc: 'Construct executive board presentations, manage timelines, and evaluate scrum velocities.' },
    { code: 'QURAN101', title: 'Fehm-ul-Quran & Applied Tafseer', level: 'General Sciences', instructor: 'Sheikh Qasim Ibrahim', desc: 'Deep-dive textual criticism, spiritual reflection, and historical context of Al-Ma’un and Al-Asr.' }
  ];

  const testimonials = [
    {
      quote: "LMS System completely transformed how we evaluate student logs. The automated attendance matching is flawless and saves us hours.",
      author: "Prof. Sarah Jenkins",
      role: "Dean of Computer Science",
      imgLetter: "S"
    },
    {
      quote: "The integrated AI tutor acts like a personal counselor. Whenever I get stuck on a tricky Big-O proof, the chatbot explains it immediately.",
      author: "Zayn Malik",
      role: "Computer Science Senior",
      imgLetter: "Z"
    },
    {
      quote: "Modern, extremely fast, and robust. It runs smoothly on my iPhone, lets me download library PDFs instantly, and tracks my lecture history.",
      author: "Aisha Rahman",
      role: "Business School Student",
      imgLetter: "A"
    }
  ];

  const faculty = [
    { name: 'Dr. Faisal Al-Sabah', role: 'Professor of Strategy', dept: 'Business School', email: 'faisal.sabah@university.edu' },
    { name: 'Sheikh Qasim Ibrahim', role: 'Head of Arabic Theology', dept: 'Islamic Studies', email: 'qasim.ibrahim@university.edu' },
    { name: 'Dr. Sarah Jenkins', role: 'Lead Compiler Specialist', dept: 'Computer Science', email: 'sarah.jenkins@university.edu' }
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
    setLoading(true);

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const payload = isLogin
      ? { email, password }
      : { name, email, role, phone, department, semester, password };

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Request failed. Check values.');
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
    <div id="landing_page_root" className="min-h-screen bg-[#F7FAFC] text-slate-800 font-sans antialiased overflow-x-hidden">
      
      {/* Premium Header */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/60 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl text-white shadow-md shadow-primary/20">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <p className="font-poppins font-extrabold text-slate-900 tracking-tight text-lg sm:text-xl">LMS System</p>
              <p className="text-[9px] uppercase tracking-widest text-[#4F8CFF] font-black">Digital Cloud LMS</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#courses" className="hover:text-primary transition-colors">Top Courses</a>
            <a href="#statistics" className="hover:text-primary transition-colors">University Metrics</a>
            <a href="#testimonials" className="hover:text-primary transition-colors">Testimonials</a>
            <a href="#faculty" className="hover:text-primary transition-colors">Our Faculty</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              id="header_login_btn"
              onClick={() => {
                setIsLogin(true);
                setShowAuthModal(true);
              }}
              className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-primary transition-colors"
            >
              Sign In
            </button>
            <button
              id="header_get_started_btn"
              onClick={() => {
                setIsLogin(false);
                setShowAuthModal(true);
              }}
              className="bg-gradient-to-r from-primary to-secondary text-white px-5 py-2 rounded-r-xl rounded-l-xl text-sm font-bold shadow-md shadow-primary/10 hover:shadow-lg hover:shadow-primary/20 hover:scale-[1.02] transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Soft floating background blobs for premium feel */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/10 w-[500px] h-[500px] bg-secondary/10 rounded-full filter blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero text representation */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-[#F0F6FF] text-primary px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-wide border border-primary/10">
              <Sparkles className="h-4 w-4 text-secondary" />
              <span>Next-Gen Academic Engine Launched</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-poppins font-black text-slate-900 leading-[1.1] tracking-tight">
              Learn <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#6EC6FF] to-primary">Anywhere</span>, <br />
              <span className="text-slate-900">Anytime.</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg max-w-2xl leading-relaxed">
              Modern digital learning platform for students and educators. Combining real-time video lectures, interactive Quranic studies with Tafseer, an intelligent Gemini AI evaluation tutor, and comprehensive grading metrics.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                id="hero_get_started"
                onClick={() => {
                  setIsLogin(false);
                  setShowAuthModal(true);
                }}
                className="bg-primary hover:bg-primary/95 text-white font-bold px-8 py-4 rounded-[20px] shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-[1.02] transition-all flex items-center gap-2 text-base"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </button>
              
              <button
                id="hero_watch_demo"
                onClick={() => setDemoVideoOpen(true)}
                className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold px-8 py-4 rounded-[20px] shadow-sm hover:shadow-md transition-all flex items-center gap-2 text-base"
              >
                <div className="bg-primary/10 p-1.5 rounded-full text-primary">
                  <Play className="h-4 w-4 fill-primary" />
                </div>
                Watch Demo
              </button>
            </div>

            {/* Quick stats floating bar */}
            <div className="pt-8 grid grid-cols-3 gap-6 border-t border-slate-200/80 max-w-lg">
              <div>
                <p className="text-2xl sm:text-3xl font-poppins font-extrabold text-slate-900 tracking-tight">100%</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Flexible Attendance</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-poppins font-extrabold text-slate-900 tracking-tight">Level A</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Qur’anic Tafseer</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-poppins font-extrabold text-[#38B889] tracking-tight">98.6%</p>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">GPA Success Rate</p>
              </div>
            </div>
          </div>

          {/* Hero Illustration Side */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <div className="relative mx-auto max-w-[420px] lg:max-w-none">
              
              {/* Outer glow aura */}
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/30 rounded-full filter blur-2xl transform scale-110 opacity-70 -z-10" />

              {/* Main high fidelity card mockup */}
              <div className="bg-white p-6 sm:p-8 rounded-[20px] shadow-2xl border border-slate-100 relative">
                
                {/* Header item inside mockup */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div className="flex gap-2 items-center">
                    <span className="w-3.5 h-3.5 bg-rose-500 rounded-full block" />
                    <span className="w-3.5 h-3.5 bg-amber-400 rounded-full block" />
                    <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full block" />
                  </div>
                  <span className="text-xxs font-bold text-slate-400 font-mono tracking-wider">LIVE_LECTURE_FEED.MP4</span>
                </div>

                {/* Subheading content */}
                <div className="py-6 space-y-4">
                  <div className="bg-slate-100 h-44 rounded-2xl relative overflow-hidden flex items-center justify-center border border-slate-200/50">
                    <div className="absolute inset-0 bg-cover bg-center bg-no-repeat filter opacity-80" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800')" }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-slate-900/10 to-transparent" />
                    <button 
                      onClick={() => setDemoVideoOpen(true)}
                      className="relative z-10 bg-white/90 hover:bg-white hover:scale-110 p-4 rounded-full text-primary shadow-xl transition-all cursor-pointer"
                    >
                      <Play className="h-6 w-6 fill-primary ml-0.5" />
                    </button>
                    <span className="absolute bottom-3 left-3 z-10 text-[10px] text-white font-bold bg-slate-900/40 backdrop-blur-md px-2 py-0.5 rounded">
                      CS101: Web Engineering
                    </span>
                  </div>

                  {/* Inside mockup stats row */}
                  <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      <span>24 Students streaming</span>
                    </div>
                    <span className="text-[#38B889] font-extrabold flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-[#38B889] animate-ping inline-block" />
                      Active Live
                    </span>
                  </div>

                  {/* Float progress widget */}
                  <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-700">Course Verification Index</span>
                      <span className="font-extrabold text-primary">82%</span>
                    </div>
                    <div className="h-2 bg-slate-200/80 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '82%' }} />
                    </div>
                  </div>
                </div>

                {/* Absolutes floating widgets for premium feel */}
                <div className="absolute -top-6 -right-6 bg-[#38B889] text-white p-3.5 rounded-2xl shadow-lg border border-[#38B889]/30 flex items-center gap-2.5 animate-bounce" style={{ animationDuration: '6s' }}>
                  <Award className="h-5 w-5" />
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-extrabold tracking-wide opacity-80">Award Winner</p>
                    <p className="text-xs font-black">Best SaaS LMS</p>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 bg-slate-900 text-white p-4 rounded-2xl shadow-xl border border-slate-800 flex items-center gap-3">
                  <div className="bg-primary/20 p-2 rounded-xl text-primary shrink-0">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div className="text-left text-xs min-w-[120px]">
                    <p className="font-bold text-slate-300">Gemini tutor online</p>
                    <div className="flex gap-1 items-center mt-1">
                      <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full block animate-ping" />
                      <span className="text-[10px] text-slate-400">Ask any code queries</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-extrabold text-primary tracking-widest uppercase bg-[#F0F6FF] px-4 py-1.5 rounded-full">
              Full Spectrum Platform Modules
            </span>
            <h2 className="text-3xl sm:text-4xl font-poppins font-black text-slate-900">
              Premium Educational Capabilities
            </h2>
            <p className="text-slate-500 text-base leading-relaxed">
              Why settle for standard legacy software? LMS System provides a highly tuned, visually seamless system to upload lectures, track attendance, research materials, and perform theology studies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={i}
                  className="bg-[#F7FAFC] hover:bg-white p-6 rounded-[20px] border border-slate-200/50 hover:border-primary/40 hover:shadow-xl hover:scale-[1.01] transition-all duration-300 text-left flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="bg-primary/10 p-3.5 rounded-2xl text-primary inline-flex">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-[#38B889]">{feat.badge}</span>
                    <h3 className="text-lg font-poppins font-bold text-slate-800">{feat.title}</h3>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{feat.desc}</p>
                  </div>
                  <div>
                    <button 
                      onClick={() => setShowAuthModal(true)}
                      className="text-primary hover:text-primary/80 font-bold text-xs inline-flex items-center gap-1 group"
                    >
                      Explore Widget 
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top Courses Preview */}
      <section id="courses" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="space-y-3 text-left">
              <span className="text-xs font-bold text-[#38B889] tracking-wider uppercase bg-[#E6F8F0] px-3.5 py-1 rounded-full">
                Syllabus Catalogue
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-poppins font-black text-slate-900">
                Top Academic Courses
              </h2>
              <p className="text-slate-500 text-sm max-w-xl">
                Taught by leading theologians, software developers, and executive coordinators. Accessible fully offline and monitored with automatic classroom lecture verification.
              </p>
            </div>
            
            <button
              onClick={() => {
                setIsLogin(true);
                setShowAuthModal(true);
              }}
              className="bg-[#F0F6FF] text-primary hover:bg-primary hover:text-white px-6 py-3 border border-primary/20 rounded-xl text-sm font-bold transition duration-300 shrink-0"
            >
              View Full Syllabus ({mockCourses.length} active)
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {mockCourses.map((c, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-[20px] shadow-sm hover:shadow-lg border border-slate-200/70 p-6 flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold uppercase bg-sky-50 text-sky-600 border border-sky-200/50 px-2.5 py-1 rounded-md">
                      {c.code}
                    </span>
                    <span className="text-xxs font-bold text-slate-400 tracking-wider">
                      {c.level}
                    </span>
                  </div>

                  <h3 className="text-lg font-poppins font-black text-slate-800 line-clamp-1">{c.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3">{c.desc}</p>
                </div>

                <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs">
                      {c.instructor.charAt(4)}
                    </div>
                    <span className="text-xs font-extrabold text-slate-600 truncate max-w-[120px]">{c.instructor}</span>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setIsLogin(true);
                      setShowAuthModal(true);
                    }}
                    className="bg-slate-50 hover:bg-primary hover:text-white text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200/80 transition"
                  >
                    View Lectures
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* University Metrics / Statistics */}
      <section id="statistics" className="py-16 bg-[#F0F6FF]/65 border-y border-[#4F8CFF]/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <h2 className="text-2xl sm:text-3xl font-poppins font-black text-slate-900">
              University Engagement &amp; Health Registry
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Real-time student attendance monitoring system and digital evaluation. Active telemetry states ensuring flawless database sync and lightning-speed downloads.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <div key={i} className="bg-white p-6 rounded-[20px] border border-slate-200/50 shadow-xs flex flex-col justify-center items-center text-center space-y-2">
                  <div className={`p-3 rounded-full bg-[#F7FAFC] ${stat.color}`}>
                    <StatIcon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-poppins font-black text-slate-900">{stat.value}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-10">
          
          <div className="space-y-3">
            <span className="text-xs font-extrabold uppercase text-amber-500 tracking-widest block">
              Testimonials
            </span>
            <h2 className="text-2xl sm:text-3xl font-poppins font-black text-slate-900">
              Loved by Students &amp; Faculty
            </h2>
          </div>

          {/* Testimonial Active Slider Card */}
          <div className="bg-[#F7FAFC] rounded-[20px] border border-slate-200/50 p-6 sm:p-10 relative">
            
            {/* Absolute quote marks */}
            <span className="absolute top-4 left-6 text-slate-200 text-6xl font-serif font-black pointer-events-none">“</span>
            
            <p className="text-slate-600 text-base sm:text-lg italic leading-relaxed relative z-10">
              {testimonials[activeTestimonial].quote}
            </p>

            <div className="mt-6 flex flex-col items-center justify-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm shadow">
                {testimonials[activeTestimonial].imgLetter}
              </div>
              <div>
                <p className="text-sm font-black text-slate-800">{testimonials[activeTestimonial].author}</p>
                <p className="text-xxs text-slate-400 font-bold uppercase tracking-widest">{testimonials[activeTestimonial].role}</p>
              </div>
            </div>

            {/* Pagination Bullet indicators */}
            <div className="flex justify-center gap-2.5 mt-8">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveTestimonial(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeTestimonial === i ? 'w-6 bg-primary' : 'w-2.5 bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Professional Faculty Grid */}
      <section id="faculty" className="py-20 bg-[#F7FAFC] border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          
          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl font-poppins font-black text-slate-900">
              Distinguished Academic Faculty
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              We recruit industry pioneers and accredited spiritual teachers to lead the Quranic tafseer frameworks and engineering courses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {faculty.map((f, i) => (
              <div key={i} className="bg-white p-6 rounded-[20px] border border-slate-200/60 shadow-xs hover:border-primary/30 transition-all flex flex-col justify-between space-y-4">
                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-black font-poppins">
                    {f.name.split(' ')[1]?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h4 className="font-poppins font-bold text-slate-800">{f.name}</h4>
                    <p className="text-xs text-slate-500 font-medium">{f.role}</p>
                  </div>
                </div>

                <div className="bg-[#F7FAFC] p-3 rounded-xl flex items-center justify-between text-xs text-slate-600">
                  <span className="font-bold text-[10px] uppercase text-slate-400">Department</span>
                  <span className="font-semibold text-slate-700">{f.dept}</span>
                </div>

                <div className="pt-2 flex items-center gap-2 text-xxs text-slate-400 font-mono">
                  <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{f.email}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white border-t border-slate-200/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-poppins font-black text-slate-900">
              Contact Admissions &amp; Tech Support
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Have questions about online degrees, tuition matching, credit exemptions, or API keys? Feed your inquiries into the instant router below.
            </p>
          </div>

          {contactSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-[20px] text-emerald-800 flex flex-col items-center justify-center gap-2 animate-bounce">
              <CheckCircle className="h-10 w-10 text-[#38B889]" />
              <h4 className="font-bold text-base">Inquiry Dispatched Successfully!</h4>
              <p className="text-xs text-emerald-600">The registrar officer on-duty will reply via your email within 24 hours.</p>
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
                    className="w-full bg-[#F7FAFC] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
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
                    className="w-full bg-[#F7FAFC] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none transition"
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
                  className="w-full bg-[#F7FAFC] border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:border-primary focus:outline-none transition resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20 transition-all text-center flex items-center justify-center gap-2"
              >
                Submit Institutional Question 
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs select-none">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-xl text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="font-poppins font-black text-white text-sm">LMS SYSTEM</p>
              <p className="text-[10px] text-slate-400">© 2026 Registrar &amp; Theological Academic Office. All rights reserved.</p>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <span className="hover:text-white transition-colors cursor-pointer">Security Code SSO</span>
            <span className="text-slate-700">|</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="text-slate-700">|</span>
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Matrix</span>
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
              className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[20px] shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden relative z-10 p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <Play className="h-5 w-5" />
                  <span className="text-sm font-poppins">LMS System Platform Walkthrough</span>
                </div>
                <button 
                  onClick={() => setDemoVideoOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Video representation container */}
              <div className="bg-slate-900 aspect-video rounded-xl relative overflow-hidden flex flex-col items-center justify-center text-white p-4 text-center">
                <div className="absolute inset-0 bg-cover bg-center filter opacity-40" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800')" }} />
                <div className="relative z-10 space-y-3">
                  <div className="bg-[#4F8CFF] py-1 px-3 text-white text-xxs font-black tracking-widest uppercase rounded-full inline-block animate-pulse">
                    MOCK DEMO LECTURE ACTIVE
                  </div>
                  <h4 className="text-lg font-poppins font-bold">LMS Video Player System Walkthrough</h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                    Once signed in as a student, we monitor lecture speed, watch history logs, and trigger custom auto-generated Gemini AI quizzes at completion to update classroom attendance metrics instantly.
                  </p>
                  <button
                    onClick={() => {
                      setDemoVideoOpen(false);
                      setIsLogin(true);
                      setShowAuthModal(true);
                    }}
                    className="bg-white text-slate-900 hover:bg-primary hover:text-white px-5 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-2 mx-auto justify-center"
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
              className="bg-white rounded-[20px] shadow-2xl border border-slate-100 max-w-4xl w-full overflow-hidden relative z-10 grid grid-cols-1 md:grid-cols-12 min-h-[500px]"
            >
              {/* Left Column (Academic Graphic Display) */}
              <div className="hidden md:flex md:col-span-5 bg-gradient-to-tr from-primary via-[#4F8CFF] to-secondary text-white p-8 flex-col justify-between relative overflow-hidden">
                {/* Visual grid overlay for premium feel */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full filter blur-xl" />

                <div className="relative z-10 space-y-3">
                  <div className="inline-flex bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xxs font-extrabold uppercase border border-white/15">
                    Authorized Terminal Gateway
                  </div>
                  <h3 className="text-2xl font-poppins font-black leading-tight">LMS System Registrar Portal</h3>
                  <p className="text-slate-100 text-xs leading-relaxed">
                    Access your courses, check student attendance ledger indices, or start theological modules.
                  </p>
                </div>

                <div className="relative z-10 space-y-4">
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 flex items-center gap-3">
                    <Shield className="h-5 w-5 text-amber-300" />
                    <div className="text-left text-xxs">
                      <p className="font-bold text-slate-100 uppercase tracking-widest">Session Protection</p>
                      <p className="text-slate-300">Guarded by SHA-256 JWT Encryption</p>
                    </div>
                  </div>
                  
                  <div className="text-[10px] text-white/60 text-left font-mono">
                    &bull; Single Sign-On Active <br />
                    &bull; Offline sync enabled
                  </div>
                </div>
              </div>

              {/* Right Column (Auth form) */}
              <div className="col-span-1 md:col-span-7 p-6 sm:p-8 flex flex-col justify-between relative">
                
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
                      {isLogin ? 'Access Academic Dashboard' : 'Registrar Signup'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {isLogin ? 'Enter your credentials to stream modules & chat with Gemini.' : 'Request instant course enrollment invitation.'}
                    </p>
                  </div>

                  {/* One-Click Quick Login Row */}
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider text-left">
                      One-Click Quick Login Presets
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        id="quick_student"
                        onClick={() => handleQuickLogin('student')}
                        className="flex flex-col items-center justify-center p-2.5 border border-blue-100 hover:border-blue-300 hover:bg-blue-50 bg-[#F0F6FF]/35 rounded-xl transition text-slate-700 text-xxs font-bold"
                      >
                        <Users className="h-4 w-4 text-primary mb-1" />
                        Student
                      </button>
                      <button
                        type="button"
                        id="quick_professor"
                        onClick={() => handleQuickLogin('professor')}
                        className="flex flex-col items-center justify-center p-2.5 border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50 bg-emerald-50/20 rounded-xl transition text-slate-700 text-xxs font-bold"
                      >
                        <BookOpen className="h-4 w-4 text-[#38B889] mb-1" />
                        Professor
                      </button>
                      <button
                        type="button"
                        id="quick_admin"
                        onClick={() => handleQuickLogin('admin')}
                        className="flex flex-col items-center justify-center p-2.5 border border-amber-100 hover:border-amber-300 hover:bg-amber-50 bg-amber-50/20 rounded-xl transition text-slate-700 text-xxs font-bold"
                      >
                        <Shield className="h-4 w-4 text-amber-600 mb-1" />
                        Admin
                      </button>
                    </div>

                    <div className="relative my-4 flex items-center justify-center">
                      <div className="w-full border-t border-slate-200" />
                      <span className="bg-white px-2.5 text-[10px] text-slate-400 uppercase tracking-widest font-bold shrink-0 absolute z-10">
                        Or use email
                      </span>
                    </div>
                  </div>

                  {/* Auth Form Formulator */}
                  <form className="space-y-3 text-left" onSubmit={handleSubmitAuth}>
                    {error && (
                      <div className="bg-rose-50 border-l-4 border-rose-500 p-3 rounded-lg text-rose-700 text-xs flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span className="font-semibold">{error}</span>
                      </div>
                    )}

                    {!isLogin && (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
                          <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Zayn Malik"
                            className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none transition"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Enterprise Phone</label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="+1 (555) 0123"
                              className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none transition"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">LMS Role</label>
                            <select
                              value={role}
                              onChange={(e) => setRole(e.target.value as UserRole)}
                              className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 bg-white focus:border-primary focus:outline-none"
                            >
                              <option value="student">Student</option>
                              <option value="professor">Professor</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1">Department</label>
                            <select
                              value={department}
                              onChange={(e) => setDepartment(e.target.value)}
                              className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 bg-white focus:border-primary focus:outline-none"
                            >
                              {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                              ))}
                            </select>
                          </div>

                          {role === 'student' && (
                            <div>
                              <label className="block text-xs font-bold text-slate-500 mb-1">Semester</label>
                              <select
                                value={semester}
                                onChange={(e) => setSemester(e.target.value)}
                                className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 bg-white focus:border-primary focus:outline-none"
                              >
                                {semesters.map(sem => (
                                  <option key={sem} value={sem}>{sem}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">University Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@university.edu"
                        className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none transition"
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
                        className="block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none transition"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:scale-[1.01] text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-primary/10 hover:shadow-lg transition-all text-sm disabled:opacity-50 mt-4 cursor-pointer"
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
                    className="text-primary font-bold hover:underline"
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
