import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  Maximize, 
  CheckCircle, 
  Lock, 
  Tv, 
  FileText, 
  MessageSquare, 
  UploadCloud, 
  Plus, 
  Loader2, 
  AlertCircle,
  Clock,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Sparkles,
  Bot,
  Send
} from 'lucide-react';
import { Course, Module, Lesson, User, Quiz, Question, OfficeHourSlot } from '../types';

interface CourseViewerProps {
  user: User;
  courses: Course[];
  onRefreshCourses: () => void;
  onLaunchQuiz: (quiz: Quiz, courseId: string) => void;
  activeCourseFromDashboard?: Course | null;
  onAskAITutor?: (prompt: string) => void;
  onSearchLibrary?: (term: string) => void;
}

export default function CourseViewer({ 
  user, 
  courses, 
  onRefreshCourses, 
  onLaunchQuiz,
  activeCourseFromDashboard,
  onAskAITutor,
  onSearchLibrary
}: CourseViewerProps) {
  const [selectedCourse, setSelectedCourse] = useState<Course>(
    activeCourseFromDashboard || courses[0]
  );
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  
  // Video Player state management
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [watchPercentage, setWatchPercentage] = useState(0);
  const [resumePrompt, setResumePrompt] = useState(false);
  const [savedTime, setSavedTime] = useState(0);

  // Professor Upload panel form
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [lessonTitle, setLessonTitle] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [lessonType, setLessonType] = useState<'video' | 'pdf' | 'quiz'>('video');
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [ffmpegLogs, setFfmpegLogs] = useState<string[]>([]);

  // Professor custom quiz creation within course modules
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([
    { id: 'q_1', text: 'Enter assessment question?', options: ['', '', '', ''], correctOptionIndex: 0 }
  ]);

  const [dashboardTab, setDashboardTab] = useState<'overview' | 'forum' | 'grades' | 'resources' | 'queries' | 'office-hours'>('overview');
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Office Hour Booking states
  const [officeHourSlots, setOfficeHourSlots] = useState<OfficeHourSlot[]>([]);
  const [activeBookingSlotId, setActiveBookingSlotId] = useState<string | null>(null);
  const [activeBookingNotes, setActiveBookingNotes] = useState('');
  const [isBookingInProgress, setIsBookingInProgress] = useState(false);
  const [bookingMessage, setBookingMessage] = useState({ type: '', text: '' });

  const fetchCourseOfficeHours = () => {
    fetch('/api/office-hours')
      .then(res => res.json())
      .then(data => {
        setOfficeHourSlots(data);
      })
      .catch(err => console.error('Error fetching office hours:', err));
  };

  const handleBookSlot = (slotId: string) => {
    setIsBookingInProgress(true);
    setBookingMessage({ type: '', text: '' });

    fetch(`/api/office-hours/${slotId}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: user.id,
        studentName: user.name,
        studentEmail: user.email || 'student@university.edu',
        meetingNotes: activeBookingNotes
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to book slot');
        return res.json();
      })
      .then(() => {
        setBookingMessage({ type: 'success', text: 'Slot booked successfully!' });
        setActiveBookingSlotId(null);
        setActiveBookingNotes('');
        fetchCourseOfficeHours();
      })
      .catch(err => {
        console.error(err);
        setBookingMessage({ type: 'error', text: 'Failed to book slot. It might have been booked already.' });
      })
      .finally(() => {
        setIsBookingInProgress(false);
      });
  };

  const handleCancelSlotBooking = (slotId: string) => {
    if (!confirm('Are you sure you want to cancel your booking for this slot?')) return;
    setIsBookingInProgress(true);
    setBookingMessage({ type: '', text: '' });

    fetch(`/api/office-hours/${slotId}/cancel`, {
      method: 'POST'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to cancel booking');
        return res.json();
      })
      .then(() => {
        setBookingMessage({ type: 'success', text: 'Booking cancelled successfully.' });
        fetchCourseOfficeHours();
      })
      .catch(err => {
        console.error(err);
        setBookingMessage({ type: 'error', text: 'Failed to cancel booking.' });
      })
      .finally(() => {
        setIsBookingInProgress(false);
      });
  };

  useEffect(() => {
    if (dashboardTab === 'office-hours') {
      fetchCourseOfficeHours();
    }
  }, [dashboardTab, selectedCourse?.id]);

  useEffect(() => {
    if (dashboardTab !== 'queries' || !selectedCourse?.id) return;

    let isMounted = true;
    const fetchMessages = () => {
      fetch(`/api/chat-messages/${selectedCourse.id}`)
        .then(res => res.json())
        .then(data => {
          if (isMounted) {
            setChatMessages(data);
          }
        })
        .catch(err => console.error('Error fetching chat messages:', err));
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedCourse.id, dashboardTab]);

  useEffect(() => {
    if (dashboardTab === 'queries') {
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [chatMessages, dashboardTab]);

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim() || !selectedCourse?.id || isSendingMessage) return;

    setIsSendingMessage(true);
    const content = newChatMessage.trim();
    setNewChatMessage('');

    try {
      const response = await fetch('/api/chat-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: selectedCourse.id,
          senderId: user.id,
          senderName: user.name,
          senderRole: user.role,
          content
        })
      });

      if (response.ok) {
        const savedMsg = await response.json();
        setChatMessages(prev => [...prev, savedMsg]);
      }
    } catch (err) {
      console.error('Error sending chat message:', err);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const [forumThreads, setForumThreads] = useState<any[]>([]);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [forumModule, setForumModule] = useState('General');
  const [activeReplyThreadId, setActiveReplyThreadId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(`forum_threads_${selectedCourse.id}`);
    if (saved) {
      setForumThreads(JSON.parse(saved));
    } else {
      setForumThreads([
        {
          id: 't_1',
          title: 'Tips for mastering the Module 1 concepts?',
          author: 'Alex Rivera (Student)',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
          content: 'I am finding the core programming structures in Module 1 a bit abstract. Are there any visual code sandboxes or visualizer tools you recommend to trace memory stacks step-by-step?',
          date: '2 days ago',
          replies: [
            {
              author: `${selectedCourse.instructor || 'Course Professor'}`,
              isInstructor: true,
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
              content: 'Great question, Alex! I highly recommend using Python Tutor (pythontutor.com) to visually execute code lines one-by-one. It demonstrates heap/stack allocation clearly. I will cover this in tomorrow\'s office hours too.',
              date: '1 day ago'
            }
          ]
        },
        {
          id: 't_2',
          title: 'Module 3 Quiz scope guidelines',
          author: 'Sarah Chen (Student)',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100',
          content: 'Will the Module 3 assessment cover theoretical complexities or are we expected to perform dry-runs of multi-variable arrays? Just want to prioritize studying the right modules.',
          date: '3 days ago',
          replies: []
        }
      ]);
    }
  }, [selectedCourse.id, selectedCourse.instructor]);

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return;
    const newThread = {
      id: `t_${Date.now()}`,
      title: `${forumModule !== 'General' ? '[' + forumModule + '] ' : ''}${newThreadTitle}`,
      author: `${user.name} (${user.studentId ? 'Student' : 'Faculty'})`,
      avatar: user.studentId 
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
        : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
      content: newThreadContent,
      date: 'Just now',
      replies: []
    };
    const updated = [newThread, ...forumThreads];
    setForumThreads(updated);
    localStorage.setItem(`forum_threads_${selectedCourse.id}`, JSON.stringify(updated));
    setNewThreadTitle('');
    setNewThreadContent('');
  };

  const handlePostReply = (threadId: string) => {
    if (!replyText.trim()) return;
    const updated = forumThreads.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          replies: [
            ...t.replies,
            {
              author: `${user.name} (${user.studentId ? 'Student' : 'Faculty'})`,
              isInstructor: !user.studentId,
              avatar: user.studentId 
                ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'
                : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100',
              content: replyText,
              date: 'Just now'
            }
          ]
        };
      }
      return t;
    });
    setForumThreads(updated);
    localStorage.setItem(`forum_threads_${selectedCourse.id}`, JSON.stringify(updated));
    setReplyText('');
    setActiveReplyThreadId(null);
  };

  // Sync active course if selected from dashboard
  useEffect(() => {
    if (activeCourseFromDashboard) {
      setSelectedCourse(activeCourseFromDashboard);
      setSelectedLesson(null);
    }
  }, [activeCourseFromDashboard]);

  // Load resume/continue watching playback position if present
  useEffect(() => {
    if (selectedLesson && selectedLesson.type === 'video') {
      const storedProgress = localStorage.getItem(`playback_${user.id}_${selectedLesson.id}`);
      if (storedProgress) {
        const time = parseFloat(storedProgress);
        if (time > 5) {
          setSavedTime(time);
          setResumePrompt(true);
          return;
        }
      }

      // Fallback: Fetch from cloud backend database
      fetch(`/api/courses/progress/${user.id}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.progress) {
            const lessonProgress = data.progress.find((p: any) => p.lessonId === selectedLesson.id);
            if (lessonProgress && lessonProgress.lastPosition > 5) {
              setSavedTime(lessonProgress.lastPosition);
              setResumePrompt(true);
            }
          }
        })
        .catch(err => console.error('Error fetching backend progress:', err));
    } else {
      setResumePrompt(false);
    }
  }, [selectedLesson, user.id]);

  const handleResumePlayback = (resume: boolean) => {
    setResumePrompt(false);
    if (videoRef.current) {
      if (resume) {
        videoRef.current.currentTime = savedTime;
      }
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  // Real-time progress saving hook that fires every 30 seconds while the video is playing
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isPlaying && selectedLesson && selectedLesson.type === 'video' && videoRef.current) {
      intervalId = setInterval(() => {
        if (videoRef.current) {
          const current = videoRef.current.currentTime;
          const total = videoRef.current.duration || 1;
          const percent = Math.min(100, Math.round((current / total) * 100));

          fetch('/api/courses/progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user.id,
              courseId: selectedCourse.id,
              lessonId: selectedLesson.id,
              watchPercentage: percent,
              lastPosition: Math.round(current)
            })
          })
            .then(res => res.json())
            .then(data => {
              console.log('[Real-time Progress Tracker] Saved timestamp:', Math.round(current), 's (', percent, '%)');
            })
            .catch(err => console.error('[Real-time Progress Tracker] Error saving:', err));
        }
      }, 30000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying, selectedLesson, selectedCourse.id, user.id]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration || 1;
      setCurrentTime(current);
      setDuration(total);

      const percent = Math.min(100, Math.round((current / total) * 100));
      setWatchPercentage(percent);

      // Auto-save watch position every 3 seconds - Continue watching feature
      if (Math.round(current) % 3 === 0) {
        localStorage.setItem(`playback_${user.id}_${selectedLesson?.id}`, current.toString());
      }

      // Automatically report progress to API and attendance mark Present if client watched past 80%
      if (percent % 10 === 0 && percent > 0) {
        fetch('/api/courses/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            courseId: selectedCourse.id,
            lessonId: selectedLesson?.id,
            watchPercentage: percent,
            lastPosition: Math.round(current)
          })
        }).catch(err => console.error('Silent progress report error', err));
      }
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Drag & drop file handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileToUpload(e.dataTransfer.files[0]);
    }
  };

  const handleUploadLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle || !selectedModuleId) return;

    setIsProcessing(true);
    setFfmpegLogs(['Initiating upload pipeline inside Node.js...']);
    setUploadProgress(10);

    // Emulate sequential FFmpeg transcoding adaptive quality chunks (360p, 480p, 720p, 1080p, and HLS .m3u8 descriptor files)
    const logTimeline = [
      'Successfully received file chunks from browser.',
      'Analyzing video attributes & codec configuration...',
      'FFmpeg spawning background process profile for 360p encoding...',
      'FFmpeg spawning profile for 480p encoding...',
      'FFmpeg spawning profile for 720p HD transcode...',
      'FFmpeg spawning profile for 1080p Full HD transcode...',
      'Creating encrypted HLS segments (.ts modules, size 4 seconds/chunk)...',
      'Writing adaptive manifest index .m3u8 playlist descriptors...',
      'Pushing encoded assets to secure distributed cloud cloud buckets...',
      'Attaching secure student-specific watermark protections.',
      'Deploying lesson reference inside LMS Database registries!'
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < logTimeline.length) {
        setFfmpegLogs(prev => [...prev, logTimeline[stepIdx]]);
        setUploadProgress(prev => Math.min(95, prev + 8));
        stepIdx++;
      } else {
        clearInterval(interval);
        setUploadProgress(100);

        // Submit the new Lesson to database
        const lessonPayload = {
          title: lessonTitle,
          type: lessonType,
          duration: '09:30',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
          pdfUrl: lessonType === 'pdf' ? '/documents/uploaded_document.pdf' : undefined,
          quiz: lessonType === 'quiz' ? {
            id: `q_user_${Date.now()}`,
            title: lessonTitle,
            questions: quizQuestions,
            timeLimit: 180
          } : undefined
        };

        fetch(`/api/courses/${selectedCourse.id}/modules/${selectedModuleId}/lessons`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lessonPayload)
        })
          .then(res => res.json())
          .then(() => {
            onRefreshCourses();
            setIsProcessing(false);
            setShowUploadForm(false);
            setLessonTitle('');
            setFileToUpload(null);
            setFfmpegLogs([]);
            // Refresh local selectedCourse registry
            fetch('/api/courses')
              .then(res => res.json())
              .then(data => {
                const refreshed = data.find((c: any) => c.id === selectedCourse.id);
                if (refreshed) setSelectedCourse(refreshed);
              });
          })
          .catch(err => {
            console.error(err);
            setIsProcessing(false);
          });
      }
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Subject and modules browser selection */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left side: Course Subjects catalog list selector */}
        <div className="lg:w-80 shrink-0 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide px-2 mb-3">Academic Subjects</h3>
            <div className="space-y-1">
              {courses.map(course => {
                const isSelected = selectedCourse.id === course.id;
                return (
                  <button
                    key={course.id}
                    onClick={() => {
                      setSelectedCourse(course);
                      setSelectedLesson(null);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl transition border text-sm font-semibold flex items-center justify-between group ${
                      isSelected 
                        ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border-transparent hover:border-slate-200'
                    }`}
                  >
                    <div className="space-y-0.5 max-w-[85%]">
                      <span className={`text-[9px] font-bold uppercase ${isSelected ? 'text-sky-200' : 'text-slate-400'}`}>
                        {course.code}
                      </span>
                      <h4 className="font-bold line-clamp-1">{course.title}</h4>
                    </div>
                    <ChevronRight className={`h-4 w-4 shrink-0 transition ${
                      isSelected ? 'text-sky-100 translate-x-1' : 'text-slate-400 group-hover:translate-x-1'
                    }`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Professor specific control station to upload a new lecture */}
          {(user.role === 'professor' || user.role === 'admin') && (
            <button
              onClick={() => {
                setShowUploadForm(!showUploadForm);
                if (selectedCourse.modules.length > 0) {
                  setSelectedModuleId(selectedCourse.modules[0].id);
                }
              }}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-extrabold p-4 rounded-3xl shadow-sm text-sm flex items-center justify-center gap-2 transition"
            >
              <Plus className="h-5 w-5 bg-white/20 rounded" />
              Upload Module Lesson
            </button>
          )}

        </div>

        {/* Right side: Selected subject curriculum or video player area */}
        <div className="flex-1 space-y-6">
          
          {/* Lecture Upload Console Form */}
          {showUploadForm && (
            <div className="bg-white p-6 rounded-3xl border-2 border-emerald-500/20 shadow-lg space-y-4">
              <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                <UploadCloud className="text-emerald-600 h-5 w-5" />
                Upload New Lesson &amp; Transcode HLS Stream
              </h3>
              
              {isProcessing ? (
                <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl font-mono text-xs space-y-3 shadow-inner">
                  <div className="flex justify-between items-center text-emerald-400 border-b border-slate-700 pb-2">
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin h-4 w-4" />
                      FFmpeg Process Spawn Active
                    </span>
                    <span>Adaptive Bitrate Pipeline</span>
                  </div>
                  <div className="h-44 overflow-y-auto space-y-1.5 scrollbar-thin text-stone-300">
                    {ffmpegLogs.map((log, index) => (
                      <p key={index} className="flex gap-2">
                        <span className="text-emerald-500">[{100 + index * 12}]</span>
                        <span>{log}</span>
                      </p>
                    ))}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Codec H.264 Transcoding...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleUploadLesson} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Lesson Title</label>
                      <input
                        type="text"
                        required
                        value={lessonTitle}
                        onChange={(e) => setLessonTitle(e.target.value)}
                        placeholder="e.g. Variables &amp; Types in Logic"
                        className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Insert Into Module</label>
                      <select
                        value={selectedModuleId}
                        onChange={(e) => setSelectedModuleId(e.target.value)}
                        className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 bg-white"
                      >
                        <option value="">Select Module...</option>
                        {selectedCourse.modules.map(m => (
                          <option key={m.id} value={m.id}>{m.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Lesson Material Type</label>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => setLessonType('video')}
                          className={`p-2 rounded-xl text-xs font-bold border transition ${
                            lessonType === 'video' ? 'bg-sky-50 text-sky-700 border-sky-400' : 'bg-white border-slate-200'
                          }`}
                        >
                          Video Lecture
                        </button>
                        <button
                          type="button"
                          onClick={() => setLessonType('pdf')}
                          className={`p-2 rounded-xl text-xs font-bold border transition ${
                            lessonType === 'pdf' ? 'bg-purple-50 text-purple-700 border-purple-400' : 'bg-white border-slate-200'
                          }`}
                        >
                          PDF Book
                        </button>
                        <button
                          type="button"
                          onClick={() => setLessonType('quiz')}
                          className={`p-2 rounded-xl text-xs font-bold border transition ${
                            lessonType === 'quiz' ? 'bg-amber-50 text-amber-700 border-amber-400' : 'bg-white border-slate-200'
                          }`}
                        >
                          MCQ Exam
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated Study Time</label>
                      <input
                        type="text"
                        placeholder="e.g. 15:00 / 30 min read"
                        className="mt-1 block w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900"
                      />
                    </div>
                  </div>

                  {lessonType === 'video' && (
                    <div 
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center transition ${
                        dragActive ? 'border-sky-500 bg-sky-50' : 'border-slate-300 bg-slate-50'
                      }`}
                    >
                      <UploadCloud className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs font-bold text-slate-600">Drag high-resolution MP4 video file here or browse</p>
                      <p className="text-[10px] text-slate-400 mt-1">Accepts up to 1GB. FFmpeg will compress to multi-rate HLS segments on launch</p>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => e.target.files && setFileToUpload(e.target.files[0])}
                        className="hidden"
                        id="video_file_input"
                      />
                      <label 
                        htmlFor="video_file_input" 
                        className="mt-3 inline-block bg-white border border-slate-300 rounded-xl px-4 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer transition shadow-xs"
                      >
                        {fileToUpload ? fileToUpload.name : 'Select file'}
                      </label>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowUploadForm(false)}
                      className="bg-white hover:bg-slate-50 text-slate-600 font-bold px-4 py-2 text-xs border border-slate-200 rounded-xl transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 text-xs rounded-xl transition shadow-xs"
                    >
                      Upload &amp; Spin Transcoder
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Video player view or lecture selection banner */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden min-h-[420px]">
            {selectedLesson ? (
              <div className="flex flex-col">
                
                {/* Active Player Box */}
                {selectedLesson.type === 'video' && (
                  <div className="bg-slate-900 relative group aspect-video">
                    
                    {/* Simulated watermark overlay for copy protection */}
                    <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none opacity-10 font-bold text-[1.5vw] md:text-[2vw] text-white uppercase tracking-wider font-mono z-20">
                      COPYRIGHTED ACADEMIC FEED • {user.name} • {user.studentId || 'FACULTY_USER'}
                    </div>

                    <video
                      ref={videoRef}
                      src={selectedLesson.videoUrl}
                      onTimeUpdate={handleTimeUpdate}
                      onPlay={() => {
                        setIsPlaying(true);
                        if (videoRef.current) {
                          videoRef.current.playbackRate = playbackSpeed;
                        }
                      }}
                      onPause={() => setIsPlaying(false)}
                      onEnded={() => setIsPlaying(false)}
                      onLoadedMetadata={() => {
                        if (videoRef.current) {
                          videoRef.current.playbackRate = playbackSpeed;
                        }
                      }}
                      className="w-full h-full object-cover relative z-10"
                      onClick={togglePlay}
                    />

                    {/* Resume Playback Continuing overlay popup */}
                    {resumePrompt && (
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-white z-30 transition-all">
                        <Clock className="h-10 w-10 text-sky-400 mb-3 animate-pulse" />
                        <h4 className="text-base font-bold">Resume Lecture?</h4>
                        <p className="text-xs text-slate-300 text-center max-w-sm mt-1">
                          You previously stopped at <span className="font-bold text-white">{formatTime(savedTime)}</span>. Would you like to continue watching from there?
                        </p>
                        <div className="flex gap-3 mt-4">
                          <button
                            onClick={() => handleResumePlayback(false)}
                            className="bg-slate-700 hover:bg-slate-600 px-4 py-1.5 rounded-xl text-xs font-bold transition"
                          >
                            Start Over
                          </button>
                          <button
                            onClick={() => handleResumePlayback(true)}
                            className="bg-sky-500 hover:bg-sky-400 px-5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                          >
                            <ArrowRight className="h-4 w-4" />
                            Resume Lesson
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Rich Custom Controls Layer */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      
                      {/* Scrub Timeline */}
                      <div className="flex items-center gap-3">
                        <span className="text-white text-[10px] font-mono leading-none">{formatTime(currentTime)}</span>
                        <div className="flex-1 h-1.5 bg-white/20 hover:bg-white/30 rounded-full cursor-pointer relative overflow-hidden">
                          <div 
                            className="h-full bg-sky-500 transition-all duration-75" 
                            style={{ width: `${watchPercentage}%` }}
                          />
                        </div>
                        <span className="text-white text-[10px] font-mono leading-none">{formatTime(duration)}</span>
                      </div>

                      {/* Controls controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button onClick={togglePlay} className="text-white hover:text-sky-300 transition focus:outline-none">
                            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                          </button>

                          <div className="flex items-center gap-2">
                            <Volume2 className="h-4 w-4 text-white" />
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.05"
                              value={volume}
                              onChange={handleVolumeChange}
                              className="w-16 accent-sky-500"
                            />
                          </div>

                          <span className="text-xs text-sky-100 font-bold bg-sky-600/30 px-2 py-0.5 rounded uppercase">
                            {watchPercentage}% Watched
                          </span>
                        </div>

                        {/* Speech rate controller and fullscreen toggle */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <span className="text-white text-[10px] font-bold">Speed:</span>
                            {[0.5, 1, 1.5, 2].map(speed => (
                              <button
                                key={speed}
                                onClick={() => handleSpeedChange(speed)}
                                className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold focus:outline-none ${
                                  playbackSpeed === speed 
                                    ? 'bg-sky-500 text-white' 
                                    : 'text-slate-300 hover:text-white'
                                }`}
                              >
                                {speed}x
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {selectedLesson.type === 'pdf' && (
                  <div className="p-8 border-b border-slate-100 flex flex-col justify-center items-center min-h-[300px] bg-sky-50/20 text-center gap-4">
                    <FileText className="h-16 w-16 text-sky-600" />
                    <div>
                      <h4 className="text-lg font-bold text-slate-800">{selectedLesson.title}</h4>
                      <p className="text-xs text-slate-500 max-w-md mt-1">
                        Course Handout handout reading material for exam preparation.
                      </p>
                    </div>
                    <a
                      href={selectedLesson.pdfUrl}
                      download
                      className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-6 py-2 rounded-xl text-xs transition"
                    >
                      Download Material Handbook
                    </a>
                  </div>
                )}

                {/* Info and content description below */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{selectedLesson.title}</h3>
                      <p className="text-xs text-slate-500 mt-1">Course: {selectedCourse.title}</p>
                    </div>
                    {/* Completion Checkmark badge */}
                    {watchPercentage >= 80 && (
                      <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                        <CheckCircle className="h-4 w-4" />
                        Attendance Logged Present
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    This session covers key aspects outlined under the {selectedCourse.code} curriculum specifications. Ensure that you have reviewed the study notes inside our digital institutional library resources to help guide critical assignments.
                  </p>

                  {/* Cohesive Cross-Module Navigation & Integrated Hub */}
                  <div className="mt-6 pt-5 border-t border-slate-100 space-y-4">
                    <span id="integrated-learning-tag" className="text-[10px] uppercase font-black tracking-widest text-[#4F8CFF] flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                      Integrated Smart Learning Hub
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      
                      {onAskAITutor && (
                        <button
                          id="btn-consult-ai"
                          onClick={() => {
                            const promptText = `I am currently studying the lesson "${selectedLesson.title}" inside the course "${selectedCourse.code}: ${selectedCourse.title}". Could you please give me a comprehensive academic summary, highlight the core technical takeaways, and formulate key study questions to test my learning?`;
                            onAskAITutor(promptText);
                          }}
                          className="flex items-center gap-3 p-3.5 bg-blue-50/50 hover:bg-blue-50/90 border border-blue-100/60 rounded-2xl text-left transition-all duration-200 cursor-pointer group active:scale-[0.99]"
                        >
                          <div className="bg-blue-100/80 p-2 text-blue-600 rounded-xl group-hover:scale-105 transition-transform shrink-0">
                            <Bot className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">Consult Gemini AI Tutor</h4>
                            <p className="text-[10px] text-slate-500 mt-0.5 font-medium">Generate deep explanations or customized MCQs for this lesson.</p>
                          </div>
                        </button>
                      )}

                      {onSearchLibrary && (
                        <button
                          id="btn-search-library"
                          onClick={() => {
                            const searchKeyword = selectedCourse.code || selectedCourse.title;
                            onSearchLibrary(searchKeyword);
                          }}
                          className="flex items-center gap-3 p-3.5 bg-indigo-50/40 hover:bg-indigo-50 border border-indigo-100/50 rounded-2xl text-left transition-all duration-200 cursor-pointer group active:scale-[0.99]"
                        >
                          <div className="bg-indigo-100/80 p-2 text-indigo-600 rounded-xl group-hover:scale-105 transition-transform shrink-0">
                            <BookOpen className="h-4.5 w-4.5" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">Find Library Textbooks</h4>
                            <p className="text-[10px] text-slate-500 mt-0.5 font-medium font-poppins">Instantly retrieve references matching {selectedCourse.code}.</p>
                          </div>
                        </button>
                      )}

                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-6 md:p-8 space-y-6">
                {/* Course Header Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white rounded-2xl p-6 relative overflow-hidden shadow-md">
                  <div className="absolute inset-0 bg-grid-white/[0.03] bg-[size:16px_16px]" />
                  <div className="relative z-10 space-y-2">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider bg-sky-500/30 text-sky-300 px-2.5 py-1 rounded-full border border-sky-400/20">
                      {selectedCourse.department} • {selectedCourse.code}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight">{selectedCourse.title}</h3>
                    <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">{selectedCourse.description}</p>
                    
                    {/* Key metadata grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 mt-4 text-xs font-poppins">
                      <div>
                        <span className="text-slate-400 block">Credit Hours</span>
                        <span className="font-bold text-slate-100">{selectedCourse.creditHours || 3} Credits</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Course Duration</span>
                        <span className="font-bold text-slate-100">{selectedCourse.durationWeeks || 16} Weeks</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Instructor</span>
                        <span className="font-bold text-slate-100">{selectedCourse.instructor}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Prerequisites</span>
                        <span className="font-bold text-slate-100 truncate block">
                          {selectedCourse.prerequisites && selectedCourse.prerequisites.length > 0 
                            ? selectedCourse.prerequisites.join(', ') 
                            : 'None'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dashboard Tabs bar */}
                <div className="flex border-b border-slate-200 gap-1 overflow-x-auto pb-px">
                  <button
                    onClick={() => setDashboardTab('overview')}
                    className={`px-4 py-2 text-xs font-bold transition-all border-b-2 shrink-0 cursor-pointer ${
                      dashboardTab === 'overview'
                        ? 'border-sky-600 text-sky-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Course Overview
                  </button>
                  <button
                    onClick={() => setDashboardTab('forum')}
                    className={`px-4 py-2 text-xs font-bold transition-all border-b-2 shrink-0 cursor-pointer ${
                      dashboardTab === 'forum'
                        ? 'border-sky-600 text-sky-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Discussion Forum
                  </button>
                  <button
                    onClick={() => setDashboardTab('grades')}
                    className={`px-4 py-2 text-xs font-bold transition-all border-b-2 shrink-0 cursor-pointer ${
                      dashboardTab === 'grades'
                        ? 'border-sky-600 text-sky-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Grades &amp; Attendance
                  </button>
                  <button
                    onClick={() => setDashboardTab('resources')}
                    className={`px-4 py-2 text-xs font-bold transition-all border-b-2 shrink-0 cursor-pointer ${
                      dashboardTab === 'resources'
                        ? 'border-sky-600 text-sky-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Learning Resources
                  </button>
                  <button
                    onClick={() => setDashboardTab('queries')}
                    className={`px-4 py-2 text-xs font-bold transition-all border-b-2 shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      dashboardTab === 'queries'
                        ? 'border-sky-600 text-sky-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    Direct Queries
                  </button>
                  <button
                    onClick={() => setDashboardTab('office-hours')}
                    className={`px-4 py-2 text-xs font-bold transition-all border-b-2 shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      dashboardTab === 'office-hours'
                        ? 'border-sky-600 text-sky-600'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Clock className="h-3.5 w-3.5" />
                    Office Hours
                  </button>
                </div>

                {/* Tab content switcher */}
                {dashboardTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Bento Box: Progress & Announcements */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      
                      {/* Left: Progress Tracking & Instructor */}
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Progress Tracking</h4>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Active Term</span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-bold text-slate-700">
                            <span>Syllabus Completion</span>
                            <span>12%</span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '12%' }} />
                          </div>
                          <p className="text-[10px] text-slate-400">
                            1 of {selectedCourse.modules.reduce((acc, m) => acc + (m.lessons || []).length, 0)} lectures completed. Select a lesson from the syllabus accordion to start studying.
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-200/60 flex items-center gap-3">
                          <div className="bg-sky-100 p-2.5 rounded-xl text-sky-700 shrink-0">
                            <Bot className="h-5 w-5" />
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-slate-800">Need immediate help?</h5>
                            <p className="text-[10px] text-slate-400">Ask the chatbot in the navigation header or consult the AI Tutor during any video lecture.</p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Announcements */}
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-sky-500" />
                          Official Announcements
                        </h4>
                        
                        <div className="space-y-3">
                          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="font-bold text-sky-600">{selectedCourse.instructor}</span>
                              <span className="text-slate-400">Today</span>
                            </div>
                            <h5 className="text-xs font-bold text-slate-800">Welcome to {selectedCourse.code}!</h5>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                              Hello everyone, please review the syllabus under the resources tab. Live synchronous sessions start this Wednesday.
                            </p>
                          </div>

                          <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-2xs space-y-1">
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="font-bold text-purple-600">Dean of Academics</span>
                              <span className="text-slate-400">3 days ago</span>
                            </div>
                            <h5 className="text-xs font-bold text-slate-800">Interactive Quiz Structure</h5>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                              Each module contains an interactive 10-question MCQ quiz to support continuous evaluation. Keep track of module deadlines!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Learning Outcomes */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Course Learning Outcomes</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedCourse.learningOutcomes && selectedCourse.learningOutcomes.length > 0 ? (
                          selectedCourse.learningOutcomes.map((outcome, idx) => (
                            <div key={idx} className="flex gap-2 text-xs text-slate-600">
                              <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{outcome}</span>
                            </div>
                          ))
                        ) : (
                          <>
                            <div className="flex gap-2 text-xs text-slate-600">
                              <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>Master core fundamental concepts and advanced structural systems of the curriculum.</span>
                            </div>
                            <div className="flex gap-2 text-xs text-slate-600">
                              <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>Analyze computational or workflow efficiency metrics and modern industry standards.</span>
                            </div>
                            <div className="flex gap-2 text-xs text-slate-600">
                              <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>Design robust implementations complying with international academic and enterprise schemas.</span>
                            </div>
                            <div className="flex gap-2 text-xs text-slate-600">
                              <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>Validate theoretical outputs, pass modules quizzes, and earn an certified statement of completion.</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {dashboardTab === 'forum' && (
                  <div className="space-y-5">
                    {/* Create thread form */}
                    <form onSubmit={handleCreateThread} className="bg-slate-50 p-4 border border-slate-100 rounded-2xl space-y-3">
                      <h4 className="text-xs font-bold text-slate-700">Start a New Discussion Thread</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <input
                          type="text"
                          placeholder="Thread Title (e.g., Problem with Week 2 Quiz)"
                          value={newThreadTitle}
                          onChange={(e) => setNewThreadTitle(e.target.value)}
                          className="sm:col-span-2 bg-white border border-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-sky-500 text-slate-800"
                          required
                        />
                        <select
                          value={forumModule}
                          onChange={(e) => setForumModule(e.target.value)}
                          className="bg-white border border-slate-200 text-xs rounded-xl px-3 py-2 outline-none focus:border-sky-500 text-slate-600 font-semibold"
                        >
                          <option value="General">General Inquiries</option>
                          {selectedCourse.modules.map(m => (
                            <option key={m.id} value={m.title.substring(0, 15) + '...'}>{m.title.substring(0, 25)}</option>
                          ))}
                        </select>
                      </div>
                      <textarea
                        placeholder="Write your explanation or question in detail here..."
                        value={newThreadContent}
                        onChange={(e) => setNewThreadContent(e.target.value)}
                        rows={3}
                        className="w-full bg-white border border-slate-200 text-xs rounded-xl p-3 outline-none focus:border-sky-500 text-slate-800"
                        required
                      />
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition shadow-xs cursor-pointer"
                        >
                          Post to Course Forum
                        </button>
                      </div>
                    </form>

                    {/* Active threads list */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Recent Class Discussions</h4>
                      
                      {forumThreads.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-6">No discussions active for this course. Start the first thread!</p>
                      ) : (
                        <div className="space-y-3.5">
                          {forumThreads.map(t => (
                            <div key={t.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-2xs space-y-3 text-xs">
                              <div className="flex items-center gap-3">
                                <img src={t.avatar} className="h-8 w-8 rounded-full object-cover border border-slate-100 shrink-0" alt="avatar" />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-800">{t.author}</span>
                                    <span className="text-[10px] text-slate-400">{t.date}</span>
                                  </div>
                                  <h5 className="font-bold text-slate-700 mt-0.5">{t.title}</h5>
                                </div>
                              </div>
                              <p className="text-slate-600 leading-relaxed pl-11">{t.content}</p>
                              
                              {/* Replies */}
                              {t.replies && t.replies.length > 0 && (
                                <div className="pl-11 space-y-3 pt-2 border-t border-slate-50 mt-2">
                                  {t.replies.map((r: any, rIdx: number) => (
                                    <div key={rIdx} className="bg-slate-50/50 p-3 rounded-xl border border-slate-100/50 space-y-1">
                                      <div className="flex items-center gap-2 text-xxs">
                                        <img src={r.avatar} className="h-5 w-5 rounded-full object-cover shrink-0" alt="reply-avatar" />
                                        <span className={`font-bold ${r.isInstructor ? 'text-sky-700' : 'text-slate-700'}`}>
                                          {r.author}
                                        </span>
                                        {r.isInstructor && <span className="bg-sky-100 text-sky-800 text-[8px] font-black uppercase px-1.5 py-0.2 rounded-sm ml-1">Instructor</span>}
                                        <span className="text-[9px] text-slate-400 ml-1">{r.date}</span>
                                      </div>
                                      <p className="text-slate-600 leading-relaxed pl-7">{r.content}</p>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Quick Reply Form */}
                              <div className="pl-11 pt-1">
                                {activeReplyThreadId === t.id ? (
                                  <div className="space-y-2 mt-2">
                                    <textarea
                                      placeholder="Write your response..."
                                      value={replyText}
                                      onChange={(e) => setReplyText(e.target.value)}
                                      rows={2}
                                      className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 outline-none focus:border-sky-500 text-slate-800"
                                    />
                                    <div className="flex gap-2 justify-end">
                                      <button
                                        onClick={() => setActiveReplyThreadId(null)}
                                        className="text-slate-500 hover:text-slate-800 font-semibold text-xxs px-3 py-1 bg-slate-100 rounded-lg transition"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        onClick={() => handlePostReply(t.id)}
                                        className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xxs px-3 py-1 rounded-lg transition"
                                      >
                                        Submit Response
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setActiveReplyThreadId(t.id);
                                      setReplyText('');
                                    }}
                                    className="text-sky-600 hover:text-sky-700 font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                                  >
                                    <MessageSquare className="h-3.5 w-3.5" />
                                    Reply to Thread
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {dashboardTab === 'grades' && (
                  <div className="space-y-6 text-xs font-poppins">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Attendance Card */}
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Attendance Statistics</h4>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-slate-800">87.5%</span>
                          <span className="text-emerald-600 font-bold">Good Standing</span>
                        </div>
                        <p className="text-slate-400 text-[10px]">
                          Attended 7 of 8 evaluated sessions. Watching over 80% marks lecture attendance automatically.
                        </p>
                        
                        <div className="space-y-2 pt-3 border-t border-slate-200/60 font-sans">
                          <div className="flex justify-between font-semibold text-slate-600 text-xxs">
                            <span>Module 1: Core Introductory Syllabus</span>
                            <span className="text-emerald-600 font-bold">Present (95% Watched)</span>
                          </div>
                          <div className="flex justify-between font-semibold text-slate-600 text-xxs">
                            <span>Module 2: Advanced Coursework Session</span>
                            <span className="text-emerald-600 font-bold">Present (89% Watched)</span>
                          </div>
                          <div className="flex justify-between font-semibold text-slate-600 text-xxs">
                            <span>Module 3: Methodology and Application</span>
                            <span className="text-amber-600 font-bold">Incomplete (12% Watched)</span>
                          </div>
                        </div>
                      </div>

                      {/* Grades Card */}
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Evaluation Outlines</h4>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-slate-800">A-</span>
                          <span className="text-slate-500">GPA: 3.67</span>
                        </div>
                        <p className="text-slate-400 text-[10px]">
                          Weekly module quizzes make up 40% of the overall cumulative course evaluations.
                        </p>
                        
                        <div className="space-y-2 pt-3 border-t border-slate-200/60 font-sans">
                          <div className="flex justify-between font-semibold text-slate-600 text-xxs">
                            <span>Module 1 Practice Assessment Quiz</span>
                            <span className="text-slate-800 font-bold">10 / 10 (100%)</span>
                          </div>
                          <div className="flex justify-between font-semibold text-slate-600 text-xxs">
                            <span>Module 2 Concepts Evaluation Quiz</span>
                            <span className="text-slate-800 font-bold">9 / 10 (90%)</span>
                          </div>
                          <div className="flex justify-between font-semibold text-slate-600 text-xxs">
                            <span>General Syllabus Diagnostic Test</span>
                            <span className="text-slate-800 font-bold">8 / 10 (80%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {dashboardTab === 'resources' && (
                  <div className="space-y-5 text-xs font-poppins">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Syllabus Resources &amp; References</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                      <div className="bg-white border border-slate-100 shadow-2xs rounded-xl p-4 flex justify-between items-center hover:border-slate-200 transition">
                        <div className="flex items-center gap-3">
                          <div className="bg-red-50 p-2.5 rounded-xl text-red-600">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <h5 className="font-bold text-slate-800 text-xs">Course Syllabus &amp; Rubric</h5>
                            <span className="text-[10px] text-slate-400 block mt-0.5">PDF Document • 1.2 MB</span>
                          </div>
                        </div>
                        <a href="#" className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xxs px-3 py-1.5 rounded-lg transition" onClick={(e) => e.preventDefault()}>
                          Download
                        </a>
                      </div>

                      <div className="bg-white border border-slate-100 shadow-2xs rounded-xl p-4 flex justify-between items-center hover:border-slate-200 transition">
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <h5 className="font-bold text-slate-800 text-xs">Academic Reference Text</h5>
                            <span className="text-[10px] text-slate-400 block mt-0.5">PDF Ebook • 18.5 MB</span>
                          </div>
                        </div>
                        <a href="#" className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xxs px-3 py-1.5 rounded-lg transition" onClick={(e) => e.preventDefault()}>
                          Download
                        </a>
                      </div>

                      <div className="bg-white border border-slate-100 shadow-2xs rounded-xl p-4 flex justify-between items-center hover:border-slate-200 transition">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-50 p-2.5 rounded-xl text-purple-600">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <h5 className="font-bold text-slate-800 text-xs">Module Reference Handouts</h5>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Syllabus PDF • 4.1 MB</span>
                          </div>
                        </div>
                        <a href="#" className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xxs px-3 py-1.5 rounded-lg transition" onClick={(e) => e.preventDefault()}>
                          Download
                        </a>
                      </div>

                      <div className="bg-white border border-slate-100 shadow-2xs rounded-xl p-4 flex justify-between items-center hover:border-slate-200 transition">
                        <div className="flex items-center gap-3">
                          <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600">
                            <CheckCircle className="h-5 w-5" />
                          </div>
                          <div>
                            <h5 className="font-bold text-slate-800 text-xs">Verified Statement of Completion</h5>
                            <span className="text-[10px] text-slate-400 block mt-0.5">Unlocked when watched lectures exceed 75%</span>
                          </div>
                        </div>
                        <button className="bg-slate-50 text-slate-400 font-bold text-xxs px-3 py-1.5 rounded-lg border border-slate-100 cursor-not-allowed">
                          Locked
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {dashboardTab === 'queries' && (
                  <div className="space-y-4 font-sans">
                    <div className="flex flex-col md:flex-row gap-4 bg-slate-50 rounded-2xl p-4 border border-slate-100 animate-fadeIn">
                      
                      {/* Sidebar list for Professors, or simple Info panel for Students */}
                      <div className="w-full md:w-64 bg-white rounded-xl p-3 border border-slate-100 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-3 px-1">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                              Active Query Desk
                            </span>
                          </div>

                          {user.role === 'professor' ? (
                            <div className="space-y-2">
                              <p className="text-xxs text-slate-400 px-1">SELECT A STUDENT:</p>
                              <button className="w-full flex items-center gap-3 p-2 bg-sky-50 text-sky-900 font-bold rounded-lg text-xs border border-sky-100 text-left">
                                <div className="h-7 w-7 rounded-full bg-sky-600 text-white font-extrabold flex items-center justify-center text-xs">
                                  ZM
                                </div>
                                <div>
                                  <p className="font-bold">Zayn Malik</p>
                                  <span className="text-[9px] text-sky-600">Student ID: ST-904123</span>
                                </div>
                              </button>
                              <button className="w-full flex items-center gap-3 p-2 hover:bg-slate-50 text-slate-700 rounded-lg text-xs transition text-left cursor-not-allowed opacity-60" onClick={(e) => e.preventDefault()}>
                                <div className="h-7 w-7 rounded-full bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-xs">
                                  AR
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-600">Alex Rivera</p>
                                  <span className="text-[9px] text-slate-400">Offline</span>
                                </div>
                              </button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="p-3 bg-gradient-to-br from-slate-50 to-sky-50/40 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="h-9 w-9 rounded-full bg-sky-100 text-sky-700 font-extrabold flex items-center justify-center text-sm border border-sky-200">
                                    {selectedCourse.instructor ? selectedCourse.instructor.split(' ').map(n => n[0]).join('') : 'FI'}
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-slate-800 text-xs">{selectedCourse.instructor}</h5>
                                    <span className="text-[9px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.5 rounded-md">Course Instructor</span>
                                  </div>
                                </div>
                                <p className="text-[10px] text-slate-500 leading-relaxed">
                                  Submit quick course-related queries, code logic doubts, or scheduling clarifications. The professor will respond here in this shared channel.
                                </p>
                              </div>

                              <div className="text-xxs text-slate-400 space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                                <p className="font-bold text-slate-500 uppercase tracking-wide mb-1">Response Policy</p>
                                <p>• Response time is typically within 24 hours.</p>
                                <p>• Keep conversations academic and respectful.</p>
                                <p>• Real-time synchronization is running.</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] text-slate-400 text-center">
                          Shared channel via secure LMS port
                        </div>
                      </div>

                      {/* Main Chat Area */}
                      <div className="flex-1 bg-white rounded-xl border border-slate-100 flex flex-col h-[400px]">
                        
                        {/* Chat Top Bar */}
                        <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-xl">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-sky-600" />
                            <div>
                              <h4 className="text-xs font-bold text-slate-800">
                                {user.role === 'professor' ? 'Query Room: Zayn Malik' : `Professor Consultation Chat`}
                              </h4>
                              <p className="text-[9px] text-slate-400">
                                Active Course: {selectedCourse.title} ({selectedCourse.code})
                              </p>
                            </div>
                          </div>
                          
                          <span className="text-[9px] bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            Live Sync
                          </span>
                        </div>

                        {/* Messages Log */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/20">
                          {chatMessages.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                              <div className="p-3 bg-slate-50 rounded-full text-slate-400">
                                <MessageSquare className="h-6 w-6" />
                              </div>
                              <h5 className="text-xs font-bold text-slate-700">No Direct Queries yet</h5>
                              <p className="text-[10px] text-slate-400 max-w-[240px]">
                                Ask a direct academic or syllabus question to start the consultation thread.
                              </p>
                            </div>
                          ) : (
                            chatMessages.map((msg) => {
                              const isSelf = msg.senderId === user.id;
                              return (
                                <div
                                  key={msg.id}
                                  className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'}`}
                                >
                                  <div className="flex items-center gap-1.5 mb-1">
                                    <span className="text-[9px] font-bold text-slate-500">{msg.senderName}</span>
                                    <span className={`text-[8px] px-1 rounded-sm uppercase font-extrabold ${
                                      msg.senderRole === 'professor' 
                                        ? 'bg-amber-100 text-amber-800' 
                                        : 'bg-slate-100 text-slate-700'
                                    }`}>
                                      {msg.senderRole}
                                    </span>
                                  </div>
                                  
                                  <div
                                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                                      isSelf
                                        ? 'bg-sky-600 text-white rounded-tr-none shadow-xs'
                                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-2xs'
                                    }`}
                                  >
                                    <p className="whitespace-pre-line">{msg.content}</p>
                                  </div>

                                  <span className="text-[8px] text-slate-400 mt-1 px-1">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              );
                            })
                          )}
                          <div ref={chatBottomRef} />
                        </div>

                        {/* Input bar */}
                        <form onSubmit={handleSendChatMessage} className="p-2 border-t border-slate-100 flex gap-2">
                          <input
                            type="text"
                            value={newChatMessage}
                            onChange={(e) => setNewChatMessage(e.target.value)}
                            placeholder={user.role === 'professor' ? "Reply to student query..." : "Ask the professor a query..."}
                            className="flex-1 bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-sky-500 rounded-xl px-3 py-1.5 text-xs focus:outline-none transition"
                            disabled={isSendingMessage}
                          />
                          <button
                            type="submit"
                            disabled={!newChatMessage.trim() || isSendingMessage}
                            className="bg-sky-600 hover:bg-sky-500 disabled:bg-slate-100 disabled:text-slate-400 text-white p-2 rounded-xl transition flex items-center justify-center cursor-pointer shrink-0"
                          >
                            {isSendingMessage ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                          </button>
                        </form>

                      </div>

                    </div>
                  </div>
                )}

                {dashboardTab === 'office-hours' && (
                  <div className="space-y-4 font-sans animate-fadeIn text-left">
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-4 mb-4">
                        <div>
                          <h4 className="text-sm font-extrabold text-slate-800">Office Hours &amp; Consultations</h4>
                          <p className="text-[11px] text-slate-500">Book dedicated, one-on-one virtual help with Professor {selectedCourse.instructor}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-sky-100 text-sky-800 font-extrabold px-2.5 py-1 rounded-full border border-sky-200">
                            Course: {selectedCourse.code}
                          </span>
                        </div>
                      </div>

                      {bookingMessage.text && (
                        <div className={`p-3 rounded-xl border mb-4 text-xs font-semibold ${
                          bookingMessage.type === 'success' 
                            ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-100' 
                            : 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-100'
                        }`}>
                          {bookingMessage.text}
                        </div>
                      )}

                      <div className="space-y-3">
                        {officeHourSlots.filter(s => s.courseId === selectedCourse.id).length === 0 ? (
                          <div className="bg-white rounded-xl border border-slate-100 p-8 text-center text-slate-400">
                            <Clock className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                            <h5 className="text-xs font-bold text-slate-700">No slots scheduled</h5>
                            <p className="text-[10px] text-slate-500 max-w-sm mx-auto mt-1">
                              There are currently no office hour availability slots configured for this course syllabus. Check back later or send a Direct Query.
                            </p>
                          </div>
                        ) : (
                          officeHourSlots
                            .filter(s => s.courseId === selectedCourse.id)
                            .sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`))
                            .map(slot => {
                              const isMyBooking = slot.studentId === user.id;
                              const isBookedByOthers = slot.status === 'booked' && !isMyBooking;
                              const isSlotSelectedForBooking = activeBookingSlotId === slot.id;

                              return (
                                <div 
                                  key={slot.id} 
                                  className={`bg-white rounded-xl border p-4 transition-all ${
                                    isMyBooking 
                                      ? 'border-emerald-200 bg-emerald-50/5' 
                                      : 'border-slate-100 hover:border-slate-200'
                                  }`}
                                >
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    <div className="space-y-1.5">
                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-slate-500 font-medium">
                                          Session Slot
                                        </span>
                                        <span className={`text-[9px] px-2 py-0.5 rounded font-bold border ${
                                          slot.status === 'booked'
                                            ? isMyBooking
                                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                              : 'bg-slate-100 text-slate-500 border-slate-200'
                                            : 'bg-sky-50 text-sky-700 border-sky-100'
                                        }`}>
                                          {slot.status === 'booked' ? isMyBooking ? 'Booked by You' : 'Unavailable' : 'Available'}
                                        </span>
                                      </div>

                                      <h5 className="text-sm font-bold text-slate-800">
                                        {new Date(slot.date).toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })} at {slot.startTime} - {slot.endTime}
                                      </h5>
                                      <p className="text-[10px] text-slate-500">Instructor: {slot.professorName}</p>
                                    </div>

                                    <div className="shrink-0">
                                      {slot.status === 'available' && !isSlotSelectedForBooking && (
                                        <button
                                          onClick={() => {
                                            setActiveBookingSlotId(slot.id);
                                            setActiveBookingNotes('');
                                          }}
                                          className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                                        >
                                          Book Appointment
                                        </button>
                                      )}

                                      {isMyBooking && (
                                        <button
                                          onClick={() => handleCancelSlotBooking(slot.id)}
                                          disabled={isBookingInProgress}
                                          className="bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold px-4 py-2 rounded-xl border border-rose-200 transition cursor-pointer"
                                        >
                                          Cancel Appointment
                                        </button>
                                      )}

                                      {isBookedByOthers && (
                                        <span className="text-xs text-slate-400 font-bold px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100">
                                          Booked / Full
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Inline Booking Confirmation Form */}
                                  {isSlotSelectedForBooking && (
                                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-3 animate-fadeIn text-left font-sans">
                                      <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                          What would you like to discuss?
                                        </label>
                                        <textarea
                                          value={activeBookingNotes}
                                          onChange={(e) => setActiveBookingNotes(e.target.value)}
                                          placeholder="Enter meeting notes or topics (e.g. help with recursion lab, clarification on assignment grading, thesis discussion)"
                                          className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-sky-500 rounded-xl p-3 text-xs focus:outline-none transition min-h-[80px]"
                                        />
                                      </div>
                                      <div className="flex justify-end gap-2 text-xs font-bold">
                                        <button
                                          type="button"
                                          onClick={() => setActiveBookingSlotId(null)}
                                          className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 cursor-pointer"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          type="button"
                                          disabled={isBookingInProgress}
                                          onClick={() => handleBookSlot(slot.id)}
                                          className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white flex items-center gap-1 cursor-pointer"
                                        >
                                          {isBookingInProgress && <Loader2 className="h-3 w-3 animate-spin" />}
                                          <span>Confirm Appointment Booking</span>
                                        </button>
                                      </div>
                                    </div>
                                  )}

                                  {/* Meeting notes if Booked by You */}
                                  {isMyBooking && slot.meetingNotes && (
                                    <div className="mt-3 pt-2 border-t border-emerald-100/50 text-xxs text-emerald-800">
                                      <span className="font-bold">Your Discussion Notes:</span>
                                      <p className="mt-1 bg-emerald-50 text-emerald-900 p-2.5 rounded-lg italic">
                                        " {slot.meetingNotes} "
                                      </p>
                                    </div>
                                  )}
                                </div>
                              );
                            })
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Curriculum Modules Outline Accordion */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-base font-bold text-slate-800">Curriculum Syllabus</h4>
            <div className="space-y-4">
              {selectedCourse.modules.map(mod => (
                <div key={mod.id} className="border border-slate-100 rounded-2xl p-4 bg-slate-50/40 space-y-3">
                  <h5 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 bg-sky-500 rounded-full" />
                    {mod.title}
                  </h5>
                  
                  <div className="divide-y divide-slate-100">
                    {mod.lessons.map(les => {
                      const isActive = selectedLesson?.id === les.id;
                      return (
                        <div
                          key={les.id}
                          className={`py-3 flex items-center justify-between text-xs transition ${
                            isActive ? 'text-sky-600' : 'text-slate-600'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {les.type === 'video' ? <Tv className="h-4 w-4 shrink-0 text-sky-500" /> : les.type === 'pdf' ? <FileText className="h-4 w-4 shrink-0 text-purple-500" /> : <MessageSquare className="h-4 w-4 shrink-0 text-amber-500" />}
                            <div>
                              <p className="font-semibold">{les.title}</p>
                              <span className="text-[10px] text-slate-400 font-medium">{les.duration || '09:00'}</span>
                            </div>
                          </div>

                          {les.type === 'quiz' ? (
                            <button
                              onClick={() => les.quiz && onLaunchQuiz(les.quiz, selectedCourse.id)}
                              className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1 rounded-xl text-xxs transition"
                            >
                              Attempt Quiz
                            </button>
                          ) : (
                            <button
                              onClick={() => setSelectedLesson(les)}
                              className={`font-semibold px-3 py-1 rounded-xl text-xxs border transition ${
                                isActive 
                                  ? 'bg-sky-600 text-white border-sky-600' 
                                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                              }`}
                            >
                              Study
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
