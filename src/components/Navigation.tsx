import React, { useState, useEffect, useRef } from 'react';
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
  User as UserIcon,
  Search,
  Command
} from 'lucide-react';
import { User, Course, Quiz, LibraryItem } from '../types';

interface NavigationProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  notificationsCount: number;
  onOpenNotifications: () => void;
  courses?: Course[];
  onSelectCourse?: (course: Course) => void;
  onLaunchQuiz?: (quiz: Quiz, courseId: string) => void;
  children?: React.ReactNode;
}

// Scored subsequence fuzzy search algorithm
function getFuzzyScore(query: string, text: string): number {
  const q = query.toLowerCase().trim();
  const t = text.toLowerCase();
  
  if (!q) return 0;
  if (t === q) return 100;
  if (t.includes(q)) return 80 + (q.length / t.length) * 10;
  
  // Character subsequence check with consecutive matching bonus
  let score = 0;
  let qIdx = 0;
  let matches = 0;
  let consecutive = 0;
  
  for (let i = 0; i < t.length; i++) {
    if (t[i] === q[qIdx]) {
      matches++;
      consecutive++;
      score += 10 + consecutive * 5; // Higher score for adjacent characters matched
      qIdx++;
      if (qIdx === q.length) break;
    } else {
      consecutive = 0;
    }
  }
  
  if (matches === q.length) {
    return score;
  }
  return 0; // No ordered sequence match
}

export default function Navigation({ 
  user, 
  activeTab, 
  setActiveTab, 
  onLogout, 
  notificationsCount, 
  onOpenNotifications,
  courses = [],
  onSelectCourse,
  onLaunchQuiz,
  children
}: NavigationProps) {

  // Global search overlays state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeResultIndex, setActiveResultIndex] = useState(0);

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

  // Prepopulate library list for the search index
  useEffect(() => {
    fetch('/api/library')
      .then(res => res.json())
      .then(data => setLibraryItems(data || []))
      .catch(err => console.error('Error preloading search indexes', err));
  }, []);

  // Listen for Ctrl+K, Cmd+K, or Slash keybinds to pop open the search modal automatically
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute our list of Course Assignments
  const getAssignments = () => {
    const list: any[] = [];
    
    // 1. Structured mock items linked securely to existing course ids for premium UI consistency
    const PREDEFINED = [
      { id: 'asg_1_1', title: "Programming Assignment 1: Python Control Flows", courseCode: "CS101", courseId: "course_1", desc: "Build loops and conditionals in Python terminal." },
      { id: 'asg_1_2', title: "Written Homework: von Neumann Architectural Models", courseCode: "CS101", courseId: "course_1", desc: "Compare instruction memory architectures." },
      { id: 'asg_2_1', title: "Big-O Time Complexity Proof Set", courseCode: "CS201", courseId: "course_2", desc: "Provide inductive proof for BST operations." },
      { id: 'asg_2_2', title: "Data Structures Lab: Red-Black Tree Balanced Insertion", courseCode: "CS201", courseId: "course_2", desc: "Implement node balance correction algorithms." },
      { id: 'asg_3_1', title: "UML System Architecture Specification Document", courseCode: "CS301", courseId: "course_3", desc: "Document class hierarchies and relationships." },
      { id: 'asg_3_2', title: "Sprint Log & Velocity Multiplier Assessment", courseCode: "CS301", courseId: "course_3", desc: "Manage scrum velocity charts and backlog issues." },
      { id: 'asg_4_1', title: "On-Page SEO Competitive Keyword Audit", courseCode: "MKT101", courseId: "course_4", desc: "Formulate technical audit report for web portals." },
      { id: 'asg_5_1', title: "Persuasive Board Presentation & Executive Pitch Slide Deck", courseCode: "BUS102", courseId: "course_5", desc: "Create direct persuasion decks." }
    ];

    PREDEFINED.forEach(p => {
      const match = (courses || []).find(c => c.id === p.courseId || c.code === p.courseCode);
      if (match) {
        list.push({
          id: p.id,
          title: p.title,
          category: 'assignment',
          subtitle: `Course Assignment • ${match.code} (${match.title})`,
          sourceText: `${p.title} ${match.code} ${match.title} ${p.desc} assignment homework project`,
          originalItem: { ...p, matchedCourse: match }
        });
      }
    });

    // 2. Dynamic lessons of type "quiz" in courses
    (courses || []).forEach(course => {
      course.modules.forEach(m => {
        m.lessons.forEach(l => {
          if (l.type === 'quiz' && l.quiz) {
            list.push({
              id: `asg_quiz_${l.quiz.id}`,
              title: `${l.quiz.title} (Graded Quiz)`,
              category: 'assignment',
              subtitle: `Course quiz • ${course.code} (${course.title})`,
              sourceText: `${l.quiz.title} quiz assessment module evaluation ${course.code} ${course.title}`,
              originalItem: {
                isQuiz: true,
                quiz: l.quiz,
                courseId: course.id,
                matchedCourse: course
              }
            });
          }
        });
      });
    });

    return list;
  };

  // Compile search indexing target set
  const getSearchDatabase = () => {
    const db: any[] = [];

    // Add Academic Courses
    (courses || []).forEach(c => {
      db.push({
        id: `course_${c.id}`,
        title: c.title,
        category: 'course',
        subtitle: `Course • ${c.code} • ${c.department} (Instructor: ${c.instructor})`,
        sourceText: `${c.title} ${c.code} ${c.description} ${c.department} ${c.instructor} courses catalog`,
        originalItem: c
      });
    });

    // Add Digital Library Books / Papers
    libraryItems.forEach(item => {
      db.push({
        id: `lib_${item.id}`,
        title: item.title,
        category: 'library',
        subtitle: `Library Material • ${item.category} (Author: ${item.author})`,
        sourceText: `${item.title} ${item.author} ${item.category} pdf document handbook reference book`,
        originalItem: item
      });
    });

    // Add Course Assignments
    const asgList = getAssignments();
    db.push(...asgList);

    return db;
  };

  // Execute fuzzy searches in reaction to user query updates
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setActiveResultIndex(0);
      return;
    }

    const database = getSearchDatabase();
    const scored = database
      .map(item => {
        const score = getFuzzyScore(searchQuery, item.sourceText);
        return { ...item, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);

    setSearchResults(scored.slice(0, 8)); // Top matches
    setActiveResultIndex(0);
  }, [searchQuery, courses, libraryItems]);

  const handleSelectResult = (result: any) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    
    if (result.category === 'course') {
      if (onSelectCourse) {
        onSelectCourse(result.originalItem);
      } else {
        setActiveTab('courses');
      }
    } else if (result.category === 'library') {
      setActiveTab('library');
    } else if (result.category === 'assignment') {
      const orig = result.originalItem;
      if (orig.isQuiz) {
        if (onLaunchQuiz) {
          onLaunchQuiz(orig.quiz, orig.courseId);
        }
      } else {
        // Direct to parent Course component
        if (onSelectCourse && orig.matchedCourse) {
          onSelectCourse(orig.matchedCourse);
        } else {
          setActiveTab('courses');
        }
      }
    }
  };

  // Handle in-modal keyboard navigations limiters
  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (searchResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveResultIndex(prev => (prev + 1) % searchResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveResultIndex(prev => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelectResult(searchResults[activeResultIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      {/* Top Main Navigation Header Bar */}
      <header id="lms_main_header" className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-sm flex items-center justify-between px-6 py-3.5">
        <div className="p-1 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100/80 shrink-0">
            <span className="text-white font-bold text-xl font-serif">L</span>
          </div>
          <div className="leading-tight">
            <p className="font-bold text-slate-900 tracking-tight text-sm sm:text-base">LMS System</p>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">University LMS</p>
          </div>
        </div>

        {/* Global Fuzzy Search Input Button Trigger (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md mx-6">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100/80 hover:border-slate-300 transition-all px-4 py-2 rounded-2xl border border-slate-200/80 text-slate-400 group cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Search className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-700 transition-colors">Search courses, library logs, assignments...</span>
            </div>
            <div className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-xxs">
              <span className="text-[9px] font-bold text-slate-400 font-mono">⌘K</span>
            </div>
          </button>
        </div>

        {/* User Right Control Stats */}
        <div className="flex items-center gap-4 shrink-0">
          
          {/* Mobile view search trigger button */}
          <button 
            type="button" 
            onClick={() => setIsSearchOpen(true)} 
            className="md:hidden p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-full transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>

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
                   type="button"
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
                  type="button"
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

      {/* Modern Backdrop Fuzzy Search Modal Overlay */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4 md:px-0"
          onKeyDown={handleModalKeyDown}
        >
          {/* Blur backdrop overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
            onClick={() => setIsSearchOpen(false)}
          />

          {/* Content panel */}
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-2xl overflow-hidden relative z-10 flex flex-col focus:outline-none">
            
            {/* Header portion */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-slate-50/50">
              <Search className="h-5 w-5 text-blue-600 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Type course, student document, assignment (e.g. 'cs', 'proof', 'solid')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none text-slate-800 placeholder-slate-400 text-sm focus:outline-none focus:ring-0"
              />
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] bg-slate-200 text-slate-500 font-extrabold px-1.5 py-0.5 rounded font-mono select-none uppercase">ESC</span>
                <button 
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* List block */}
            <div className="max-h-[50vh] overflow-y-auto p-4 space-y-4">
              
              {!searchQuery.trim() ? (
                <div className="py-8 px-4 text-center space-y-2">
                  <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-600">
                    <Command className="h-6 w-6 animate-pulse" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">Global Academic Fuzzy Search</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    Query syllabus, modules, pdf study books, and active student tasks instantaneously using fuzzy subsequence alignment. Type <span className="font-bold text-blue-600 bg-blue-50 px-1 py-0.5 rounded">cs</span> or <span className="font-bold text-blue-600 bg-blue-50 px-1 py-0.5 rounded">tafseer</span> to begin.
                  </p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-10 px-4 text-center space-y-2">
                  <p className="text-xl">🔍</p>
                  <h4 className="text-sm font-bold text-slate-800">No matched academic records</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    No results found for <span className="font-semibold text-slate-700">"{searchQuery}"</span>. Please double-check terms.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 px-1">
                    Matching Results ({searchResults.length})
                  </p>
                  
                  {searchResults.map((result, idx) => {
                    const isSelected = idx === activeResultIndex;
                    
                    let CatIcon = BookOpen;
                    let badgeBg = 'bg-blue-50 text-blue-600 border-blue-100';
                    let label = 'Course';
                    
                    if (result.category === 'library') {
                      CatIcon = Library;
                      badgeBg = 'bg-amber-50 text-amber-600 border-amber-100';
                      label = 'Library Doc';
                    } else if (result.category === 'assignment') {
                      CatIcon = FileText;
                      badgeBg = 'bg-emerald-50 text-emerald-600 border-emerald-100';
                      label = 'Task / Assignment';
                    }

                    return (
                      <div
                        key={result.id}
                        onClick={() => handleSelectResult(result)}
                        onMouseEnter={() => setActiveResultIndex(idx)}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                          isSelected 
                            ? 'bg-blue-50/75 border-blue-200/90 shadow-sm' 
                            : 'bg-white hover:bg-slate-50/50 border-transparent'
                        }`}
                      >
                        <div className="flex gap-3 items-center min-w-0 flex-1">
                          <div className={`p-2 rounded-xl shrink-0 transition-colors ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                          }`}>
                            <CatIcon className="h-4 w-4" />
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <span className={`inline-flex items-center text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${badgeBg} mb-1`}>
                              {label}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-800 truncate pr-4">
                              {result.title}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-semibold truncate leading-normal">
                              {result.subtitle}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2 items-center text-slate-400 shrink-0 pl-2">
                          {isSelected && (
                            <span className="text-[10px] text-blue-600 font-black animate-pulse hidden sm:inline">
                              Press ENTER
                            </span>
                          )}
                          <p className="text-sm font-bold">&rarr;</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

            {/* Navigation Footer */}
            {searchResults.length > 0 && (
              <div className="bg-slate-50 border-t border-slate-100 px-5 py-2.5 flex items-center justify-between text-[10px] text-slate-400 font-mono select-none">
                <span className="flex items-center gap-1">
                  Use arrows <span className="font-bold">&uarr;&darr;</span> to scroll
                </span>
                <span>
                  Press <span className="font-bold">Enter</span> to open
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
