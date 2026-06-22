import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Video, 
  AlertCircle, 
  Plus, 
  Trash2, 
  Clock, 
  BookOpen, 
  User, 
  Play, 
  X, 
  Send, 
  Sparkles,
  HelpCircle,
  GraduationCap
} from 'lucide-react';
import { Course, Quiz } from '../types';

interface InteractiveCalendarProps {
  courses: Course[];
  user: {
    id: string;
    name: string;
    role: string;
  };
  onLaunchCourse?: (course: Course) => void;
  onLaunchQuiz?: (quiz: Quiz, courseId: string) => void;
}

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  courseCode: string;
  courseTitle: string;
  courseId: string;
  type: 'live' | 'quiz' | 'custom';
  description?: string;
  dateStr: string; // YYYY-MM-DD
  linkQuiz?: any;
}

export default function InteractiveCalendar({ courses = [], user, onLaunchCourse, onLaunchQuiz }: InteractiveCalendarProps) {
  const today = new Date();
  
  // Current calendar view year and month
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed
  
  // Highlighting selected date state
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  );

  // Custom user scheduled logs persistent in localStorage
  const [customEvents, setCustomEvents] = useState<CalendarEvent[]>(() => {
    try {
      const stored = localStorage.getItem(`lms_custom_events_${user.id}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Saving custom events helper
  useEffect(() => {
    localStorage.setItem(`lms_custom_events_${user.id}`, JSON.stringify(customEvents));
  }, [customEvents, user.id]);

  // Form input variables for custom event scheduler
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('14:00');
  const [newEventDesc, setNewEventDesc] = useState('');
  
  // Immersive Virtual Classroom state
  const [activeLiveSession, setActiveLiveSession] = useState<CalendarEvent | null>(null);
  const [classroomChat, setClassroomChat] = useState<Array<{ sender: string; text: string; time: string; system?: boolean }>>([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [isClassroomRecording, setIsClassroomRecording] = useState(true);

  // Month names helper
  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Map courses to dynamic recurrences
  const getSchedules = (): CalendarEvent[] => {
    const list: CalendarEvent[] = [];

    // Loop through academic courses
    courses.forEach((course, idx) => {
      // Determine designated recurring weekdays for live sessions based on index helper
      // course 0 -> Tuesday & Thursday
      // course 1 -> Monday & Wednesday
      // course 2 -> Wednesday & Friday
      // course 3 -> Tuesday & Saturday
      // course 4 -> Monday & Thursday
      let weekdays: number[] = [2, 4]; // default Tue Thu
      if (idx === 1) weekdays = [1, 3];
      else if (idx === 2) weekdays = [3, 5];
      else if (idx === 3) weekdays = [2, 6];
      else if (idx === 4) weekdays = [1, 4];

      const hour = 10 + (idx * 2) % 6; // Spread times nicely e.g. 10:00, 12:00, 14:00

      // We'll populate events for the current viewed month
      const startOfMonth = new Date(currentYear, currentMonth, 1);
      const endOfMonth = new Date(currentYear, currentMonth + 1, 0);

      // Find all live lectures for this month
      for (let day = 1; day <= endOfMonth.getDate(); day++) {
        const currentDate = new Date(currentYear, currentMonth, day);
        const wday = currentDate.getDay(); // 0 is Sun, 6 is Sat

        if (weekdays.includes(wday)) {
          const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          list.push({
            id: `live_${course.id}_${dateStr}`,
            title: `Live Academic Lecture: ${course.code}`,
            time: `${String(hour).padStart(2, '0')}:00 - ${String(hour + 1).padStart(2, '0')}:30`,
            courseCode: course.code,
            courseTitle: course.title,
            courseId: course.id,
            type: 'live',
            description: `Interpreting unit concepts under professor guidance. Be prepared to ask relevant syllabus topics!`,
            dateStr: dateStr
          });
        }
      }

      // Quiz deadlines
      course.modules.forEach((module, mIdx) => {
        module.lessons.forEach((lesson, lIdx) => {
          if (lesson.type === 'quiz' && lesson.quiz) {
            // Assign a stable date based on IDs in current month e.g. day 12, 19, 26 depending on modules
            const designatedDay = Math.min(28, 5 + (idx * 4) + (mIdx * 5) + (lIdx * 2));
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(designatedDay).padStart(2, '0')}`;
            
            list.push({
              id: `quiz_asg_${lesson.quiz.id}`,
              title: `Quiz Milestone: ${lesson.quiz.title}`,
              time: '23:59',
              courseCode: course.code,
              courseTitle: course.title,
              courseId: course.id,
              type: 'quiz',
              description: `Mandatory academic evaluation for course scaling. Time limit is ${Math.round(lesson.quiz.timeLimit / 60)} minutes. Grade weights directly to report logs.`,
              dateStr: dateStr,
              linkQuiz: { quiz: lesson.quiz, courseId: course.id }
            });
          }
        });
      });
    });

    // Merge in custom events that match current month
    const customMatch = customEvents.filter(e => {
      const parts = e.dateStr.split('-');
      if (parts.length === 3) {
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1; // 0-indexed
        return y === currentYear && m === currentMonth;
      }
      return false;
    });

    return [...list, ...customMatch];
  };

  const allEvents = getSchedules();

  // Create standard calendar cells
  const getCalendarCells = () => {
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const endOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const startDayOfWeek = startOfMonth.getDay(); // 0 is Sun, 6 is Sat
    const totalDays = endOfMonth.getDate();
    
    const prevMonthEnd = new Date(currentYear, currentMonth, 0).getDate();
    const cells: any[] = [];

    // Pad previous month elements
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const prevM = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevY = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dayNum = prevMonthEnd - i;
      const dateString = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      
      cells.push({
        day: dayNum,
        month: prevM,
        year: prevY,
        isCurrentMonth: false,
        dateStr: dateString
      });
    }

    // Populate current month elements
    for (let i = 1; i <= totalDays; i++) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      cells.push({
        day: i,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true,
        dateStr: dateString
      });
    }

    // Pad next month elements
    const remaining = 42 - cells.length;
    for (let i = 1; i <= remaining; i++) {
      const nextM = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextY = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateString = `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      
      cells.push({
        day: i,
        month: nextM,
        year: nextY,
        isCurrentMonth: false,
        dateStr: dateString
      });
    }

    return cells;
  };

  const calendarGrid = getCalendarCells();

  // Shift navigation months safely
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Extract selected day data elements
  const selectedDayEvents = allEvents.filter(ev => ev.dateStr === selectedDateStr);

  const handleAddCustomEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const newEv: CalendarEvent = {
      id: `custom_${Date.now()}`,
      title: newEventTitle,
      time: newEventTime,
      courseCode: 'My Study Log',
      courseTitle: 'Personal Revision Milestone',
      courseId: 'personal_log',
      type: 'custom',
      description: newEventDesc || 'Dedicated study focus block.',
      dateStr: selectedDateStr
    };

    setCustomEvents(prev => [...prev, newEv]);
    setNewEventTitle('');
    setNewEventDesc('');
    setShowEventForm(false);
  };

  const handleDeleteEvent = (id: string) => {
    setCustomEvents(prev => prev.filter(ev => ev.id !== id));
  };

  // Launch simulated classroom session
  const handleJoinClassroom = (event: CalendarEvent) => {
    setActiveLiveSession(event);
    
    // Seed standard chat logs
    setClassroomChat([
      { sender: 'System Auto-Guard', text: `Lecture socket initialized. You successfully established connection on Port 3000 secure socket.`, time: '00:00', system: true },
      { sender: `Professor ${event.courseCode === 'CS101' ? 'Dr. Sarah Jenkins' : 'Instructor Al-Hassan'}`, text: `Welcome class. Today we deep dive on ${event.courseTitle} chapters. Make sure you take structured notes.`, time: '10:01' },
      { sender: 'Bilal Farooq (Student)', text: `Salam Professor, is there an assignment associated with this session?`, time: '10:03' },
      { sender: 'Fatima Zahra (Student)', text: `Yes, I can spot the quiz deadline on the interactive LMS calendar! It represents a great study tool.`, time: '10:04' },
      { sender: `Professor ${event.courseCode === 'CS101' ? 'Dr. Sarah Jenkins' : 'Instructor Al-Hassan'}`, text: `Exactly Fatima. Please ensure you submit syllabus exercises before midnight on the calendar milestone day.`, time: '10:05' }
    ]);
  };

  // Submit custom message to live classroom simulation
  const handleSendClassroomMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    // Add user's text
    const updatedChats = [
      ...classroomChat,
      { sender: `${user.name} (You)`, text: newMessageText, time: timeStr }
    ];
    setClassroomChat(updatedChats);
    setNewMessageText('');

    // Trigger funny dynamic professor response
    setTimeout(() => {
      const responses = [
        "A brilliant point you raised there!",
        "Excellent question for this module study logs.",
        "Yes, we are recording the whole process for late recap.",
        "Please look up our digital library document search tab as well.",
        "Perfect. Let me emphasize that rule."
      ];
      const randResponse = responses[Math.floor(Math.random() * responses.length)];
      setClassroomChat(prev => [
        ...prev,
        { 
          sender: activeLiveSession?.courseCode === 'CS101' ? 'Dr. Sarah Jenkins' : 'Instructor Al-Hassan', 
          text: randResponse, 
          time: timeStr 
        }
      ]);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden mt-6">
      <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2.5 text-white rounded-xl shadow-md shadow-blue-100 shrink-0">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-slate-800">Academic Program Schedule</h3>
            <p className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              <Sparkles className="h-3.3 w-3.3 text-blue-500 animate-pulse" />
              Interactive live lectures, assignments, and study milestones
            </p>
          </div>
        </div>

        {/* Current Month Navigator buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button 
            type="button" 
            onClick={handlePrevMonth}
            className="p-2 border border-slate-200 hover:border-blue-300 hover:bg-slate-100/50 rounded-xl transition text-slate-600 bg-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <span className="font-extrabold text-xs sm:text-sm text-slate-800 tracking-wide min-w-[120px] text-center uppercase font-mono">
            {MONTHS[currentMonth]} {currentYear}
          </span>

          <button 
            type="button" 
            onClick={handleNextMonth}
            className="p-2 border border-slate-200 hover:border-blue-300 hover:bg-slate-100/50 rounded-xl transition text-slate-600 bg-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
        
        {/* Calendar Interactive Grid - spans 8 columns */}
        <div className="lg:col-span-8 p-4 sm:p-5">
          {/* Weekday Labels Header row */}
          <div className="grid grid-cols-7 text-center mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <span key={day} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest py-1">
                {day}
              </span>
            ))}
          </div>

          {/* Interactive Date Cells (42 grid positions) */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {calendarGrid.map((cell, idx) => {
              const cellEvents = allEvents.filter(ev => ev.dateStr === cell.dateStr);
              const isSelected = cell.dateStr === selectedDateStr;
              const isToday = cell.dateStr === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
              
              // Count specific types of events in cell
              const hasLive = cellEvents.some(e => e.type === 'live');
              const hasQuiz = cellEvents.some(e => e.type === 'quiz');
              const hasCustom = cellEvents.some(e => e.type === 'custom');

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedDateStr(cell.dateStr)}
                  className={`aspect-square sm:aspect-video rounded-xl p-1.5 flex flex-col justify-between items-start border relative transition-all group ${
                    !cell.isCurrentMonth 
                      ? 'bg-slate-50/50 text-slate-300 border-slate-100' 
                      : 'bg-white text-slate-700 border-slate-200/80 hover:border-blue-400 hover:shadow-xs'
                  } ${
                    isSelected 
                      ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50/20' 
                      : ''
                  }`}
                >
                  {/* Day Date number Label */}
                  <span className={`text-[11px] font-bold h-5 w-5 flex items-center justify-center rounded-lg ${
                    isToday 
                      ? 'bg-blue-600 text-white font-black shadow-sm' 
                      : isSelected 
                        ? 'text-blue-700 font-extrabold' 
                        : 'text-slate-700'
                  }`}>
                    {cell.day}
                  </span>

                  {/* Tiny Badges for desktop/tablet, or small circles for mobile */}
                  <div className="w-full flex flex-wrap gap-0.5 mt-auto">
                    {/* Live indicator */}
                    {hasLive && (
                      <span className="hidden md:inline-flex items-center gap-0.5 text-[8px] font-bold bg-blue-50 text-blue-700 border border-blue-100 rounded px-1 py-0.2 w-full truncate">
                        🎙️ Live Session
                      </span>
                    )}
                    {/* Quiz indicator */}
                    {hasQuiz && (
                      <span className="hidden md:inline-flex items-center gap-0.5 text-[8px] font-bold bg-rose-50 text-rose-700 border border-rose-100 rounded px-1 py-0.2 w-full truncate">
                        📝 Quiz Deadline
                      </span>
                    )}
                    {/* Personal task indicator */}
                    {hasCustom && (
                      <span className="hidden md:inline-flex items-center gap-0.5 text-[8px] font-bold bg-amber-50 text-amber-700 border border-amber-100 rounded px-1 py-0.2 w-full truncate">
                        🌟 Personal Event
                      </span>
                    )}

                    {/* Compact mobile dot displays */}
                    <div className="flex md:hidden gap-1 justify-center w-full mt-1">
                      {hasLive && <span className="h-1.5 w-1.5 bg-blue-500 rounded-full shrink-0" />}
                      {hasQuiz && <span className="h-1.5 w-1.5 bg-rose-500 rounded-full shrink-0" />}
                      {hasCustom && <span className="h-1.5 w-1.5 bg-amber-500 rounded-full shrink-0" />}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick instructions bar */}
          <div className="mt-4 flex flex-wrap gap-4 items-center justify-start text-[10px] text-slate-400 font-bold uppercase tracking-wider px-1">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500 block" /> Live Lecture
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500 block" /> Quiz Deadline
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500 block" /> Personal Studylogs
            </span>
          </div>

        </div>

        {/* Selected Date planner Detail lists - spans 4 columns */}
        <div className="lg:col-span-4 p-5 bg-slate-50/20 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Schedule for</p>
                <h4 className="text-sm font-extrabold text-slate-800 font-mono">
                  {selectedDateStr}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowEventForm(prev => !prev)}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-xl transition shadow-xs"
              >
                <Plus className="h-3 w-3" />
                Add Event
              </button>
            </div>

            {/* Custom Interactive Event Form container */}
            {showEventForm && (
              <form onSubmit={handleAddCustomEvent} className="bg-white border border-blue-100 p-4 rounded-2xl shadow-sm space-y-3.5">
                <h5 className="text-xs font-extrabold text-blue-700 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Create Study Milestone
                </h5>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Event Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Study Group / Lab Prep"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Due Time</label>
                    <input
                      type="time"
                      value={newEventTime}
                      onChange={(e) => setNewEventTime(e.target.value)}
                      className="mt-1 block w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Category</label>
                    <span className="block mt-1 bg-amber-50 text-amber-700 font-bold border border-amber-200 px-2.5 py-1.5 rounded-lg text-[10px] text-center">
                      🌟 Personal Log
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Context Memo</label>
                  <input
                    type="text"
                    placeholder="Brief notes..."
                    value={newEventDesc}
                    onChange={(e) => setNewEventDesc(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div className="flex gap-1.5 justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setShowEventForm(false)}
                    className="border border-slate-200 hover:bg-slate-50 text-slate-500 font-semibold text-[10px] px-2.5 py-1.5 rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] px-3 py-1.5 rounded-lg transition"
                  >
                    Save Note
                  </button>
                </div>
              </form>
            )}

            {/* List of elements for selected day */}
            <div className="space-y-3">
              {selectedDayEvents.length === 0 ? (
                <div className="py-8 text-center text-slate-400 bg-white border border-slate-100 rounded-2xl flex flex-col items-center justify-center p-4">
                  <span className="text-lg mb-1">🕊️</span>
                  <p className="text-xs font-bold text-slate-700">No scheduled activities</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Perfect day for personal library readings or AI assistance!</p>
                </div>
              ) : (
                selectedDayEvents.map(event => {
                  const isLive = event.type === 'live';
                  const isQuiz = event.type === 'quiz';
                  const isCustom = event.type === 'custom';

                  return (
                    <div 
                      key={event.id}
                      className={`p-4 rounded-2xl border transition-all hover:shadow-xs flex flex-col justify-between gap-3 bg-white ${
                        isLive ? 'border-l-4 border-l-blue-600 border-slate-100' :
                        isQuiz ? 'border-l-4 border-l-rose-500 border-slate-100' :
                        'border-l-4 border-l-amber-400 border-slate-100'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
                            isLive ? 'bg-blue-50 text-blue-700 border-blue-100' :
                            isQuiz ? 'bg-rose-50 text-rose-700 border-rose-100' :
                            'bg-amber-50 text-amber-700 border-amber-100'
                          }`}>
                            {isLive ? '💻 Live Session' : isQuiz ? '📝 Quiz Deadline' : '🌟 Personal Log'}
                          </span>
                          
                          <span className="text-[10px] text-slate-400 font-extrabold font-mono flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.time}
                          </span>
                        </div>

                        <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 line-clamp-2 pt-1">
                          {event.title}
                        </h4>
                        
                        <p className="text-[11px] text-slate-500 font-bold">
                          {event.courseCode} &bull; {event.courseTitle}
                        </p>
                        
                        {event.description && (
                          <p className="text-[10px] text-slate-400 font-medium leading-relaxed bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                            {event.description}
                          </p>
                        )}
                      </div>

                      {/* Action Triggers depending on user role and session type */}
                      <div className="flex items-center gap-1.5 mt-1 border-t border-slate-50 pt-3 justify-between">
                        {isLive ? (
                          <button
                            type="button"
                            onClick={() => handleJoinClassroom(event)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-xl transition flex items-center gap-1 shadow-sm shadow-blue-100"
                          >
                            <Video className="h-3 w-3" />
                            Join Virtual Lecture Hall
                          </button>
                        ) : isQuiz ? (
                          <button
                            type="button"
                            onClick={() => {
                              if (onLaunchQuiz && event.linkQuiz) {
                                onLaunchQuiz(event.linkQuiz.quiz, event.linkQuiz.courseId);
                              } else {
                                alert(`To participate, please go to Academic Courses tab and choose Course: ${event.courseCode}.`);
                              }
                            }}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[10px] px-3.5 py-1.5 rounded-xl transition flex items-center gap-1 shadow-xs"
                          >
                            <Play className="h-3 w-3 text-white fill-white" />
                            Attempt Quiz Now
                          </button>
                        ) : (
                          <div className="flex justify-between w-full items-center">
                            <span className="text-[10px] text-slate-400 font-medium italic">Manually added logs</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteEvent(event.id)}
                              className="text-slate-300 hover:text-rose-500 p-1 rounded-lg transition"
                              title="Delete Personal Study Log"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 bg-blue-50/30 rounded-2xl p-3 text-xxs text-slate-500 leading-normal">
            <p className="font-bold text-slate-700 mb-0.5 uppercase tracking-wider">Automatic Integration</p>
            This planner dynamically synchronizes with active campus courses. Adding or modifying quizzes instantly reflects here.
          </div>
        </div>

      </div>

      {/* Immersive Sandbox Simulation: Virtual Lecture Hall Modal */}
      {activeLiveSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setActiveLiveSession(null)} />
          
          <div className="bg-slate-950 text-slate-100 rounded-3xl overflow-hidden border border-slate-800 w-full max-w-5xl shadow-2xl relative z-10 grid grid-cols-1 lg:grid-cols-3 max-h-[85vh] lg:max-h-[75vh]">
            
            {/* Left Portion: Live Feed Video Sandbox + Lecture Notes - spans 2 columns */}
            <div className="lg:col-span-2 flex flex-col bg-slate-900/50">
              
              {/* Virtual Video View Frame */}
              <div className="aspect-video bg-slate-950 relative flex flex-col items-center justify-center border-b border-slate-800">
                
                {/* Simulated video background */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/20 via-slate-900 to-indigo-950/20 opacity-90" />
                
                {/* Animated visual elements to simulate dynamic lecturing */}
                <div className="relative text-center p-6 space-y-4">
                  <div className="inline-flex p-3 rounded-full bg-blue-700/30 border border-blue-500/20 text-blue-400 animate-pulse">
                    <GraduationCap className="h-8 w-8 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold tracking-tight text-white uppercase tracking-widest bg-blue-600/20 py-1 px-3 rounded-full border border-blue-500/10 inline-block font-mono mb-2">
                      Live Broadcast
                    </h4>
                    <h3 className="text-base sm:text-lg font-black text-slate-100">
                      {activeLiveSession.courseCode} - {activeLiveSession.courseTitle}
                    </h3>
                    <p className="text-xs text-slate-400 leading-normal max-w-sm mx-auto mt-1">
                      Broadcasting on secure media server channel. Recording in high-definition: <span className="text-red-500 font-extrabold animate-pulse">● REC 1080p</span>
                    </p>
                  </div>
                </div>

                {/* Overlaid UI control toolbar - purely visual mockup */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-900/80 backdrop-blur-md p-2.5 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-ping" />
                    <span>Live Latency: 18ms</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>Mute Microphone</span>
                    <span>HD 1080p</span>
                  </div>
                </div>
              </div>

              {/* Whiteboard / Reference Area below Video */}
              <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Lecture Slides & Core Directives</h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-serif">
                    "Remember that the evaluation rules require systematic checks of performance constraints. For assignments, focus specifically on asymptotic complexity. We will cover hash maps and tree structures in tomorrow's digital workspace reading materials."
                  </p>
                </div>
                
                <div className="border border-slate-800 bg-slate-900/30 rounded-xl p-3 text-xxs text-amber-500 leading-normal border-l-2 border-l-amber-500 flex items-start gap-2 mt-4">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold block mb-0.5">ADMINISTRATIVE DIRECTIVE</span>
                    Participation in live lecture sessions triggers automated system attendance logs. Keep your window connected for standard lecture intervals.
                  </div>
                </div>
              </div>
            </div>

            {/* Right Portion: Simulated Academic Chat Feed & Question board - spans 1 column */}
            <div className="border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between h-[35vh] lg:h-full bg-slate-950">
              
              {/* Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Interactive Student Chat</h4>
                  <p className="text-[10px] text-slate-500">Live conversation board</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => setActiveLiveSession(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
                {classroomChat.map((chat, idx) => (
                  <div key={idx} className={`text-xs ${chat.system ? 'text-center py-1 mt-1' : ''}`}>
                    {chat.system ? (
                      <span className="inline-block bg-slate-900 text-[10px] text-slate-500 rounded px-2.5 py-0.5 font-semibold leading-relaxed border border-slate-800">
                        {chat.text}
                      </span>
                    ) : (
                      <div className="space-y-0.5">
                        <div className="flex justify-between items-baseline">
                          <span className="font-black text-slate-300">{chat.sender}</span>
                          <span className="text-[9px] text-slate-500 font-mono">{chat.time}</span>
                        </div>
                        <p className="text-slate-400 bg-slate-900/60 p-2 rounded-xl text-[11px] leading-relaxed border border-slate-900">
                          {chat.text}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Chat send action bar */}
              <form onSubmit={handleSendClassroomMessage} className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  required
                  placeholder="Type Message to Live chat..."
                  value={newMessageText}
                  onChange={(e) => setNewMessageText(e.target.value)}
                  className="flex-1 bg-slate-900 text-slate-100 border border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="p-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
