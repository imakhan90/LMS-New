import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Menu, 
  X, 
  LogOut, 
  Info,
  Calendar,
  Clock,
  User as UserIcon,
  BookOpen
} from 'lucide-react';
import { motion } from 'motion/react';
import AuthPage from './components/AuthPage';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CourseViewer from './components/CourseViewer';
import QuranSection from './components/QuranSection';
import DigitalLibrary from './components/DigitalLibrary';
import ReportsPanel from './components/ReportsPanel';
import AITutor from './components/AITutor';
import AdminPanel from './components/AdminPanel';
import VisaAdmissions from './components/VisaAdmissions';
import QuizModal from './components/QuizModal';
import InteractiveCalendar from './components/InteractiveCalendar';
import { User, Course, Quiz } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeCourseFromDashboard, setActiveCourseFromDashboard] = useState<Course | null>(null);
  
  // Dark mode state persistence
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem('lms_dark_mode');
    return stored === 'true';
  });

  // Apply dark mode class to root document element
  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('lms_dark_mode', String(darkMode));
  }, [darkMode]);
  
  // Quiz Launch state
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [activeQuizCourseId, setActiveQuizCourseId] = useState<string>('');

  // Notifications state management
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Cross-module integration states
  const [aiTutorPrompt, setAiTutorPrompt] = useState<string>('');
  const [librarySearchTerm, setLibrarySearchTerm] = useState<string>('');

  // Authenticate session from LocalStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('lms_user');
    const storedToken = localStorage.getItem('lms_token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  // Fetch courses and notifications once authenticated
  useEffect(() => {
    if (user) {
      fetchCourses();
      fetchNotifications();
    }
  }, [user]);

  const fetchCourses = () => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error('Error listing courses', err));
  };

  const fetchNotifications = () => {
    fetch('/api/notifications')
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(err => console.error('Error listing notifications', err));
  };

  const handleAuthSuccess = (authenticatedUser: User, authenticatedToken: string) => {
    setUser(authenticatedUser);
    setToken(authenticatedToken);
    localStorage.setItem('lms_user', JSON.stringify(authenticatedUser));
    localStorage.setItem('lms_token', authenticatedToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('lms_user');
    localStorage.removeItem('lms_token');
  };

  const handleLaunchCourse = (course: Course) => {
    setActiveCourseFromDashboard(course);
    setActiveTab('courses');
  };

  const handleLaunchQuiz = (quiz: Quiz, courseId: string) => {
    setActiveQuiz(quiz);
    setActiveQuizCourseId(courseId);
  };

  const handleMarkNoticeAsRead = (id: string) => {
    fetch(`/api/notifications/${id}/read`, { method: 'POST' })
      .then(() => fetchNotifications())
      .catch(err => console.error(err));
  };

  if (!user) {
    return <AuthPage onLoginSuccess={handleAuthSuccess} />;
  }

  const unreadNoticeCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex flex-col font-sans text-slate-800 dark:text-[#F8FAFC] antialiased overflow-x-hidden transition-colors duration-300">
      
      {/* Sidebar Navigation & Layout Wrapper */}
      <Navigation 
        user={user} 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setActiveCourseFromDashboard(null);
        }} 
        onLogout={handleLogout}
        notificationsCount={unreadNoticeCount}
        onOpenNotifications={() => setShowNotifications(!showNotifications)}
        courses={courses}
        onSelectCourse={handleLaunchCourse}
        onLaunchQuiz={handleLaunchQuiz}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      >
        <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* Dynamic Inner page components routing */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Dashboard 
                user={user} 
                courses={courses}
                setActiveTab={setActiveTab}
                onLaunchCourse={handleLaunchCourse}
                onLaunchQuiz={handleLaunchQuiz} 
              />
            </motion.div>
          )}

          {activeTab === 'courses' && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <CourseViewer 
                user={user} 
                courses={courses} 
                onRefreshCourses={fetchCourses} 
                onLaunchQuiz={handleLaunchQuiz}
                activeCourseFromDashboard={activeCourseFromDashboard}
                onAskAITutor={(prompt) => {
                  setAiTutorPrompt(prompt);
                  setActiveTab('ai-tutor');
                }}
                onSearchLibrary={(term) => {
                  setLibrarySearchTerm(term);
                  setActiveTab('library');
                }}
              />
            </motion.div>
          )}

          {activeTab === 'visa-admissions' && (
            <motion.div
              key="visa-admissions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <VisaAdmissions user={user} />
            </motion.div>
          )}

          {activeTab === 'quran' && (
            <motion.div
              key="quran"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <QuranSection 
                user={user} 
                courses={courses} 
                onLaunchCourse={handleLaunchCourse}
                onLaunchQuiz={handleLaunchQuiz}
              />
            </motion.div>
          )}

          {activeTab === 'library' && (
            <motion.div
              key="library"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <DigitalLibrary 
                user={user} 
                initialSearchTerm={librarySearchTerm}
                onClearInitialSearch={() => setLibrarySearchTerm('')}
              />
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <ReportsPanel user={user} courses={courses} />
            </motion.div>
          )}

          {activeTab === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <InteractiveCalendar 
                user={{ id: user.id, name: user.name, role: user.role }} 
                courses={courses} 
                onLaunchCourse={handleLaunchCourse} 
                onLaunchQuiz={handleLaunchQuiz} 
              />
            </motion.div>
          )}

          {activeTab === 'ai-tutor' && (
            <motion.div
              key="ai-tutor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <AITutor 
                user={user} 
                courses={courses} 
                initialPrompt={aiTutorPrompt}
                onClearInitialPrompt={() => setAiTutorPrompt('')}
              />
            </motion.div>
          )}

          {activeTab === 'admin-panel' && (
            <motion.div
              key="admin-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <AdminPanel 
                user={user} 
                courses={courses} 
                onRefreshCourses={fetchCourses} 
              />
            </motion.div>
          )}
        </div>
      </Navigation>

      {/* Persistent exam quiz overlays */}
      {activeQuiz && (
        <QuizModal 
          user={user} 
          quiz={activeQuiz} 
          courseId={activeQuizCourseId}
          onClose={() => {
            setActiveQuiz(null);
            fetchCourses();
          }} 
        />
      )}

    </div>
  );
}
