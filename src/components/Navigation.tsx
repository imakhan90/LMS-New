import React from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  BookOpen, 
  Compass, 
  Library, 
  FileText, 
  Settings, 
  Bot, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  User as UserIcon 
} from 'lucide-react';
import { User } from '../types';

interface NavigationProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  notificationsCount: number;
  onOpenNotifications: () => void;
  children?: React.ReactNode;
}

export default function Navigation({ 
  user, 
  activeTab, 
  setActiveTab, 
  onLogout, 
  notificationsCount, 
  onOpenNotifications,
  children
}: NavigationProps) {

  const menuItems = [
    { id: 'dashboard', label: 'LMS Dashboard', icon: LayoutDashboard, roles: ['student', 'professor', 'admin'] },
    { id: 'courses', label: 'Academic Courses', icon: BookOpen, roles: ['student', 'professor', 'admin'] },
    { id: 'quran', label: 'Fehm-ul-Quran', icon: Compass, roles: ['student', 'professor', 'admin'] },
    { id: 'library', label: 'Digital Library', icon: Library, roles: ['student', 'professor', 'admin'] },
    { id: 'reports', label: 'Reports & Grades', icon: FileText, roles: ['student', 'professor', 'admin'] },
    { id: 'ai-tutor', label: 'AI Study Assistant', icon: Bot, roles: ['student', 'professor', 'admin'] },
    { id: 'admin-panel', label: 'Registrar Admin', icon: Settings, roles: ['admin'] }
  ];

  const visibleMenuItems = menuItems.filter(item => item.roles.includes(user.role));

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <span className="bg-rose-50 text-rose-700 ring-rose-600/10 text-xxs px-2 py-0.5 font-bold rounded-full uppercase border border-rose-200">System Admin</span>;
      case 'professor':
        return <span className="bg-emerald-50 text-emerald-700 ring-emerald-600/10 text-xxs px-2 py-0.5 font-bold rounded-full uppercase border border-emerald-200">Professor</span>;
      default:
        return <span className="bg-sky-50 text-sky-700 ring-sky-600/10 text-xxs px-2 py-0.5 font-bold rounded-full uppercase border border-sky-200">Student</span>;
    }
  };

  return (
    <>
      {/* Top Main Navigation Header Bar */}
      <header id="lms_main_header" className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-sm flex items-center justify-between px-6 py-3.5">
        <div className="p-1 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100/80 shrink-0">
            <span className="text-white font-bold text-xl font-serif">M</span>
          </div>
          <div className="leading-tight">
            <p className="font-bold text-slate-900 tracking-tight text-sm sm:text-base">AL-MAJED UNIVERSITY</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">University LMS</p>
          </div>
        </div>

        {/* User Right Control Stats */}
        <div className="flex items-center gap-4">
          <button 
            type="button" 
            onClick={onOpenNotifications} 
            className="relative p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-colors"
          >
            <Bell className="h-5 w-5" />
            {notificationsCount > 0 && (
              <span className="absolute top-1 right-1 h-3.5 w-3.5 bg-rose-500 text-white rounded-full text-[9px] flex items-center justify-center font-black">
                {notificationsCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-3 border-l border-slate-100 pl-4 py-1">
            <div className="bg-slate-50 p-1.5 rounded-full border border-slate-200/60 hidden sm:block">
              <UserIcon className="h-4 w-4 text-slate-500" />
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-none">{user.name}</span>
              <span className="text-[10px] font-mono text-slate-400 mt-1">{user.email}</span>
            </div>
            {getRoleBadge(user.role)}
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">
        {/* Floating Left Sidebar Panel or Tab Bar */}
        <nav id="lms_sidebar" className="fixed bottom-0 left-0 right-0 z-40 md:sticky md:top-[73px] md:h-[calc(100vh-73px)] md:w-64 bg-white border-t border-slate-200 md:border-t-0 md:border-r md:border-slate-200/80 shadow-md md:shadow-none flex md:flex-col justify-between py-2 md:py-6 overflow-y-auto shrink-0">
          <div className="flex w-full md:flex-col justify-around md:justify-start px-3 md:px-4 gap-1 md:space-y-1">
            {visibleMenuItems.map((item) => {
              const IconComponent = item.icon;
              const isTabActive = activeTab === item.id;
              const isQuran = item.id === 'quran';
              
              let activeClasses = 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100/20';
              if (isQuran) {
                activeClasses = 'bg-amber-50 text-amber-700 shadow-sm border border-amber-100/20';
              }

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 px-3 py-2 md:py-2.5 rounded-xl transition text-[10px] md:text-sm font-semibold w-full border border-transparent ${
                    isTabActive 
                      ? activeClasses 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                >
                  <IconComponent className={`h-4 w-4 md:h-5 md:w-5 ${isTabActive ? (isQuran ? 'text-amber-600' : 'text-blue-600') : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Desktop Sign Out & Profile block */}
          <div className="hidden md:block p-4 mt-auto">
            <div className="bg-slate-900 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold font-mono shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate capitalize leading-tight">{user.role} &bull; {user.department || 'Academic Office'}</p>
                </div>
                <button 
                  onClick={onLogout}
                  title="Log out"
                  className="text-slate-400 hover:text-rose-400 transition-colors shrink-0"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Content Wrapper */}
        <div className="flex-1 w-full overflow-y-auto pb-16 md:pb-0 bg-[#F8FAFC]">
          {children}
        </div>
      </div>
    </>
  );
}
