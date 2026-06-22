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
import AuthPage from './components/AuthPage';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CourseViewer from './components/CourseViewer';
import QuranSection from './components/QuranSection';
import DigitalLibrary from './components/DigitalLibrary';
import ReportsPanel from './components/ReportsPanel';
import AITutor from './components/AITutor';
import AdminPanel from './components/AdminPanel';
import QuizModal from './components/QuizModal';
import { User, Course, Quiz } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [activeCourseFromDashboard, setActiveCourseFromDashboard] = useState<Course | null>(null);
  
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 antialiased overflow-x-hidden">
      
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
      >
        <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* Dynamic Inner page components routing */}
          {activeTab === 'dashboard' && (
            <Dashboard 
              user={user} 
              courses={courses}
              setActiveTab={setActiveTab}
              onLaunchCourse={handleLaunchCourse}
              onLaunchQuiz={handleLaunchQuiz} 
            />
          )}

          {activeTab === 'courses' && (
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
          )}

          {activeTab === 'quran' && (
            <QuranSection 
              user={user} 
              courses={courses} 
              onLaunchCourse={handleLaunchCourse}
              onLaunchQuiz={handleLaunchQuiz}
            />
          )}

          {activeTab === 'library' && (
            <DigitalLibrary 
              user={user} 
              initialSearchTerm={librarySearchTerm}
              onClearInitialSearch={() => setLibrarySearchTerm('')}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsPanel user={user} />
          )}

          {activeTab === 'ai-tutor' && (
            <AITutor 
              user={user} 
              courses={courses} 
              initialPrompt={aiTutorPrompt}
              onClearInitialPrompt={() => setAiTutorPrompt('')}
            />
          )}

          {activeTab === 'admin-panel' && (
            <AdminPanel 
              user={user} 
              courses={courses} 
              onRefreshCourses={fetchCourses} 
            />
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
