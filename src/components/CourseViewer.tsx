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
  Bot
} from 'lucide-react';
import { Course, Module, Lesson, User, Quiz, Question } from '../types';

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
              <div className="p-8 text-center flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="bg-sky-50 p-4 rounded-full text-sky-600">
                  <BookOpen className="h-10 w-10" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-800">{selectedCourse.title}</h4>
                  <p className="text-xs text-slate-500 max-w-sm mt-1 mx-auto">
                    Please select a lecture lesson from the curriculum outline on the right to start studying. Keep in mind that watching over 80% marks your lecture attendance automatically!
                  </p>
                </div>
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
