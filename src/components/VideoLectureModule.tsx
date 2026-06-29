import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Search, 
  Sparkles, 
  Plus, 
  FileText, 
  MessageSquare, 
  Clock, 
  ChevronRight, 
  ThumbsUp, 
  Tv, 
  Eye, 
  TrendingUp, 
  Video, 
  Layers, 
  UploadCloud, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  Activity,
  Bookmark,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface VideoLecture {
  id: string;
  title: string;
  courseName: string;
  professorName: string;
  duration: string;
  videoUrl: string;
  thumbnailUrl: string;
  views: string;
  likes: number;
  uploadedAt: string;
  isCompleted: boolean;
  transcripts: { time: string; text: string; seconds: number }[];
}

interface VideoLectureModuleProps {
  role: 'student' | 'professor' | 'admin';
  onNotify?: (message: string, type: 'success' | 'info') => void;
}

export default function VideoLectureModule({ role, onNotify }: VideoLectureModuleProps) {
  // Hardcoded premium sample video lecture collection
  const initialLectures: VideoLecture[] = [
    {
      id: 'lec_1',
      title: 'Advanced Database Sharding & Partitioning Strategies',
      courseName: 'CS301 Advanced Databases',
      professorName: 'Dr. Elias Vance',
      duration: '14:50',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=400',
      views: '1.2K',
      likes: 342,
      uploadedAt: '2 days ago',
      isCompleted: false,
      transcripts: [
        { time: '00:05', text: 'Welcome back to advanced data architecture. Today we cover sharding keys.', seconds: 5 },
        { time: '01:20', text: 'Horizontal partitioning divides a table rows across multiple servers.', seconds: 80 },
        { time: '04:15', text: 'Consistent hashing prevents massive rebalancing during node additions.', seconds: 255 },
        { time: '08:40', text: 'Let us analyze query cross-shard latency and mitigation techniques.', seconds: 520 },
        { time: '12:10', text: 'In conclusion, range partitioning is ideal for sequential records.', seconds: 730 },
      ]
    },
    {
      id: 'lec_2',
      title: 'Sacred Recitation Accent (Makhraj) & Tajweed Foundations',
      courseName: 'Islamic & Sacred Sciences',
      professorName: 'Dr. Abdul Aziz',
      duration: '11:45',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=400',
      views: '2.5K',
      likes: 912,
      uploadedAt: '5 days ago',
      isCompleted: true,
      transcripts: [
        { time: '00:10', text: 'Introduction to Tajweed, the aesthetic rules of pronunciation.', seconds: 10 },
        { time: '02:30', text: 'Let us understand the throat letters, which originate from the vocal cords.', seconds: 150 },
        { time: '05:15', text: 'Practice of the letter Qaaf and its explosive resonant characteristics.', seconds: 315 },
        { time: '09:00', text: 'How to maintain breath control during longer Surah recitations.', seconds: 540 },
      ]
    },
    {
      id: 'lec_3',
      title: 'Monolithic vs Distributed Microservice Architectures',
      courseName: 'CS402 Software Engineering',
      professorName: 'Prof. Sarah Jenkins',
      duration: '11:45',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400',
      views: '920',
      likes: 180,
      uploadedAt: '1 week ago',
      isCompleted: false,
      transcripts: [
        { time: '00:08', text: 'Today we discuss splitting monorepos into containerized services.', seconds: 8 },
        { time: '03:10', text: 'API Gateways route inbound traffic and handle standard rate limiting.', seconds: 190 },
        { time: '06:40', text: 'Event-driven message queues ensure loose coupling of system bounds.', seconds: 400 },
        { time: '10:12', text: 'Understanding database-per-service principles and transaction compensation.', seconds: 612 },
      ]
    }
  ];

  const [lectures, setLectures] = useState<VideoLecture[]>(initialLectures);
  const [activeLecture, setActiveLecture] = useState<VideoLecture>(initialLectures[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [transcriptSearch, setTranscriptSearch] = useState('');
  
  // Note-taking State
  const [newNote, setNewNote] = useState('');
  const [notes, setNotes] = useState<{ id: string; timestamp: string; seconds: number; text: string }[]>([
    { id: 'n_1', timestamp: '01:20', seconds: 80, text: 'Horizontal partitioning divides rows, vertical partitioning divides columns.' },
    { id: 'n_2', timestamp: '04:15', seconds: 255, text: 'Consistent hashing is key for scaling database nodes dynamically.' }
  ]);

  // Video element ref
  const videoRef = useRef<HTMLVideoElement>(null);

  // Professor Upload state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCourse, setUploadCourse] = useState('CS301 Advanced Databases');
  const [uploadDuration, setUploadDuration] = useState('12:30');
  const [isUploading, setIsUploading] = useState(false);

  // Notification helper
  const triggerToast = (msg: string, type: 'success' | 'info') => {
    if (onNotify) {
      onNotify(msg, type);
    } else {
      alert(msg);
    }
  };

  // Synchronize playback state
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, activeLecture]);

  // Sync volume & speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [isMuted, playbackSpeed]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSeek = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      setCurrentTime(seconds);
      setIsPlaying(true);
      triggerToast(`Jumped to lecture segment at ${formatTime(seconds)}`, 'info');
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const formattedStamp = formatTime(currentTime);
    const noteObj = {
      id: `note_${Date.now()}`,
      timestamp: formattedStamp,
      seconds: currentTime,
      text: newNote
    };

    setNotes(prev => [noteObj, ...prev]);
    setNewNote('');
    triggerToast('Interactive lecture note bookmarked at current timestamp!', 'success');
  };

  const handleToggleLike = () => {
    setLectures(prev => prev.map(l => {
      if (l.id === activeLecture.id) {
        const liked = activeLecture.likes + 1;
        setActiveLecture({ ...activeLecture, likes: liked });
        return { ...l, likes: liked };
      }
      return l;
    }));
    triggerToast('Added dynamic endorsement like to video lecture archive.', 'success');
  };

  const handleProfessorUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) {
      triggerToast('Please provide a valid lecture title', 'info');
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      const newLec: VideoLecture = {
        id: `lec_${Date.now()}`,
        title: uploadTitle,
        courseName: uploadCourse,
        professorName: 'Dr. Elias Vance (You)',
        duration: uploadDuration,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400',
        views: '0',
        likes: 0,
        uploadedAt: 'Just now',
        isCompleted: false,
        transcripts: [
          { time: '00:00', text: 'Session introduction and objective breakdown.', seconds: 0 },
          { time: '01:10', text: 'Core concept mapping and syllabus checklist guidelines.', seconds: 70 },
        ]
      };

      setLectures(prev => [newLec, ...prev]);
      setActiveLecture(newLec);
      setUploadTitle('');
      setIsUploading(false);
      triggerToast('Successfully transcoded, encoded, and uploaded video lecture to CDN!', 'success');
    }, 2000);
  };

  const filteredTranscripts = activeLecture.transcripts.filter(t => 
    t.text.toLowerCase().includes(transcriptSearch.toLowerCase())
  );

  return (
    <div id="video-lecture-module-root" className="space-y-8 text-left">
      
      {/* 1. DUAL CONTAINER LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: THE PREMIUM STREAMING PLAYER (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Glassmorphic HTML5 video player container */}
          <div className="backdrop-blur-xl bg-slate-900/45 dark:bg-slate-950/70 rounded-[32px] border border-slate-200/50 dark:border-indigo-500/20 shadow-[0_25px_60px_rgba(79,70,229,0.1)] overflow-hidden relative group">
            
            {/* Visual indicators */}
            <div className="absolute top-4 left-4 z-20 flex gap-2">
              <span className="bg-indigo-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider font-mono shadow-md flex items-center gap-1">
                <Video className="h-3 w-3 animate-pulse" /> Live Streaming Server
              </span>
              <span className="bg-slate-950/80 backdrop-blur-md text-slate-300 text-[9px] font-bold px-2.5 py-1 rounded-full border border-slate-800 font-mono">
                {activeLecture.courseName}
              </span>
            </div>

            <div className="absolute top-4 right-4 z-20 flex gap-1.5">
              <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono border border-emerald-500/20 flex items-center gap-1 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span> CDN: Ultra Fast
              </span>
            </div>

            {/* Video Canvas Area */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                src={activeLecture.videoUrl}
                poster={activeLecture.thumbnailUrl}
                onTimeUpdate={handleTimeUpdate}
                className="w-full h-full object-contain cursor-pointer"
                onClick={() => setIsPlaying(!isPlaying)}
              />
              
              {/* Play / Pause big screen overlay on hover */}
              <AnimatePresence>
                {!isPlaying && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setIsPlaying(true)}
                    className="absolute h-16 w-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center border border-indigo-400 shadow-2xl cursor-pointer hover:bg-indigo-500 transition-all z-10"
                  >
                    <Play className="h-7 w-7 fill-current ml-1" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Custom Interactive Player Controls Dock */}
            <div className="p-4 bg-slate-950/95 dark:bg-[#060810]/95 border-t border-slate-800/80 backdrop-blur-xl space-y-3 relative z-10">
              
              {/* Timeline seek progress bar */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-slate-400 font-bold">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={videoRef.current ? videoRef.current.duration || 100 : 100}
                  value={currentTime}
                  onChange={(e) => {
                    const seekVal = parseFloat(e.target.value);
                    if (videoRef.current) {
                      videoRef.current.currentTime = seekVal;
                    }
                    setCurrentTime(seekVal);
                  }}
                  className="flex-1 accent-indigo-500 h-1 rounded-full cursor-pointer bg-slate-800"
                />
                <span className="text-[10px] font-mono text-slate-400 font-bold">{activeLecture.duration}</span>
              </div>

              {/* Controls bar layout */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-3">
                  {/* Play/pause button */}
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="h-9 w-9 rounded-xl bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 border border-indigo-500/30 transition flex items-center justify-center cursor-pointer"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
                  </button>

                  {/* Reset/Rewind */}
                  <button 
                    onClick={() => handleSeek(0)}
                    className="h-9 w-9 rounded-xl bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800 transition flex items-center justify-center cursor-pointer"
                    title="Restart from beginning"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>

                  {/* Audio Mute button */}
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="h-9 w-9 rounded-xl bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800 transition flex items-center justify-center cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {/* Playback speed dialer */}
                  <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl">
                    {[1, 1.25, 1.5, 2].map(speed => (
                      <button
                        key={speed}
                        onClick={() => {
                          setPlaybackSpeed(speed);
                          triggerToast(`Playback speed adjusted to ${speed}x`, 'info');
                        }}
                        className={`px-2 py-1 rounded-lg text-[9px] font-black font-mono transition cursor-pointer ${
                          playbackSpeed === speed 
                            ? 'bg-indigo-600 text-white' 
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>

                  {/* Endorsement Like button */}
                  <button 
                    onClick={handleToggleLike}
                    className="h-9 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                  >
                    <ThumbsUp className="h-3.5 w-3.5 text-indigo-400" />
                    <span>{activeLecture.likes}</span>
                  </button>

                  {/* Fullscreen button */}
                  <button 
                    onClick={() => {
                      if (videoRef.current?.requestFullscreen) {
                        videoRef.current.requestFullscreen();
                      }
                    }}
                    className="h-9 w-9 rounded-xl bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800 transition flex items-center justify-center cursor-pointer"
                  >
                    <Maximize className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Active Lecture Details Grid */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm text-left relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/80">
              <div className="space-y-1">
                <span className="text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
                  Active Lecture Channel
                </span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1.5 tracking-tight font-poppins">{activeLecture.title}</h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                  Instructed by <span className="font-extrabold text-indigo-600">{activeLecture.professorName}</span> &bull; {activeLecture.courseName}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-bold shrink-0">
                <Eye className="h-4 w-4 text-slate-400" />
                <span>{activeLecture.views} Streams</span>
                <span className="text-slate-300">&bull;</span>
                <Clock className="h-4 w-4 text-slate-400" />
                <span>{activeLecture.duration} Duration</span>
              </div>
            </div>

            {/* Student Experience: Interactive Timestamp Notes Book */}
            {role === 'student' && (
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest font-mono flex items-center gap-1.5">
                    <Bookmark className="h-3.5 w-3.5 text-indigo-500" /> Notes Linked To Timestamps
                  </h4>
                  <span className="text-[9px] text-slate-400 font-mono">Total bookmarked points: {notes.length}</span>
                </div>

                {/* Form to submit a new note */}
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Type note aligned to current video duration (e.g. key insight, formula)..."
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none font-medium dark:text-white"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Tag Stamp</span>
                  </button>
                </form>

                {/* Notes list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  {notes.map(note => (
                    <div 
                      key={note.id}
                      onClick={() => handleSeek(note.seconds)}
                      className="p-3 bg-slate-50/60 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 rounded-2xl text-left cursor-pointer hover:border-indigo-500/40 transition group flex flex-col justify-between gap-1"
                    >
                      <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">&bull; "{note.text}"</p>
                      <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 font-mono flex items-center gap-1 mt-1 group-hover:underline">
                        <Clock className="h-3 w-3" /> Jump to {note.timestamp}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Professor Control Center: Publish/Upload Panel */}
            {role === 'professor' && (
              <div className="mt-5 space-y-4">
                <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4">
                  <h4 className="text-xs font-black uppercase text-amber-500 dark:text-amber-400 tracking-widest font-mono flex items-center gap-1.5">
                    <UploadCloud className="h-4 w-4 text-amber-500" /> Instructor Video Publishing Panel
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Upload new lectures, link to proper curriculum codes, and initiate automated subtitle transcription.
                  </p>
                </div>

                <form onSubmit={handleProfessorUpload} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1.5 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Lecture Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lesson 4.3: AVL Tree Code Walkthrough..."
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-amber-500 outline-none font-medium text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Syllabus Course Course</label>
                    <select
                      value={uploadCourse}
                      onChange={(e) => setUploadCourse(e.target.value)}
                      className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-amber-500 outline-none font-semibold text-slate-700 dark:text-slate-200"
                    >
                      <option value="CS301 Advanced Databases">CS301 Advanced Databases</option>
                      <option value="Islamic & Sacred Sciences">Islamic & Sacred Sciences</option>
                      <option value="CS402 Software Engineering">CS402 Software Engineering</option>
                    </select>
                  </div>

                  <div className="text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Duration</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 15:45"
                      value={uploadDuration}
                      onChange={(e) => setUploadDuration(e.target.value)}
                      className="w-full mt-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs focus:ring-1 focus:ring-amber-500 outline-none font-semibold text-slate-900 dark:text-white font-mono"
                    />
                  </div>

                  <div className="sm:col-span-3 flex justify-end gap-2.5 pt-1">
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-xl text-xs font-black transition cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                    >
                      {isUploading ? (
                        <>
                          <Activity className="h-4 w-4 animate-spin" />
                          <span>Encoding MP4 CDN...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="h-4 w-4" />
                          <span>Deploy Stream Asset</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Admin Controls: Media pipeline logs */}
            {role === 'admin' && (
              <div className="mt-5 space-y-4">
                <div className="border-t border-slate-100 dark:border-slate-800/60 pt-4">
                  <h4 className="text-xs font-black uppercase text-cyan-500 dark:text-cyan-400 tracking-widest font-mono flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-cyan-400 animate-spin-slow" /> Media Pipeline & Storage Analytics
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Global CDN streaming health, transcoder latency indicators, and storage load indexes.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase font-mono">CDN Bandwidth</p>
                    <p className="text-sm font-black text-slate-900 dark:text-cyan-400 font-mono mt-0.5">4.2 TB <span className="text-slate-400 text-xxs">/mo</span></p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase font-mono">Stream Availability</p>
                    <p className="text-sm font-black text-emerald-500 font-mono mt-0.5">99.98%</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase font-mono">Live Edge Servers</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white font-mono mt-0.5">14 Active</p>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 rounded-2xl">
                    <p className="text-[9px] font-black text-slate-400 uppercase font-mono">Bitrate Delivery</p>
                    <p className="text-sm font-black text-indigo-500 font-mono mt-0.5">Adaptive (ABR)</p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* RIGHT COLUMN: PLAYLISTS, TRANSCRIPTS & LIVE NOTES INDEX (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Playlist / Archive List */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-5 shadow-sm text-left">
            <h4 className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest font-mono flex items-center gap-1.5 mb-4">
              <Layers className="h-4 w-4 text-indigo-500" /> Syllabus Lecture Library
            </h4>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {lectures.map((lec) => {
                const active = lec.id === activeLecture.id;
                return (
                  <button
                    key={lec.id}
                    onClick={() => {
                      setActiveLecture(lec);
                      setIsPlaying(false);
                      setCurrentTime(0);
                      triggerToast(`Switched to: ${lec.title}`, 'info');
                    }}
                    className={`w-full p-3 rounded-2xl border text-left transition-all duration-300 flex items-start gap-3.5 group/item cursor-pointer ${
                      active
                        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-950 dark:text-white'
                        : 'bg-slate-50/40 dark:bg-slate-950/40 border-slate-100 dark:border-slate-800/80 hover:bg-slate-100/50 dark:hover:bg-slate-900/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {/* Thumbnail/Icon representation */}
                    <div className="relative h-14 w-18 rounded-xl overflow-hidden shrink-0 border border-slate-200/40 dark:border-slate-800">
                      <img src={lec.thumbnailUrl} alt={lec.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                        <Play className="h-4 w-4 text-white drop-shadow-md group-hover/item:scale-125 transition duration-300" />
                      </div>
                      <span className="absolute bottom-1 right-1 bg-slate-950/80 text-[8px] text-white px-1.5 py-0.2 rounded font-mono font-bold">
                        {lec.duration}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <span className="text-[8px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                        {lec.courseName.split(' ')[0]}
                      </span>
                      <h5 className="text-[11px] font-black leading-snug text-slate-900 dark:text-slate-100 truncate group-hover/item:text-indigo-600 transition">
                        {lec.title}
                      </h5>
                      <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 font-mono flex justify-between">
                        <span>{lec.professorName}</span>
                        <span>{lec.views} views</span>
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive AI Transcript Search & Index */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-5 shadow-sm text-left">
            <div className="flex items-center justify-between mb-3.5">
              <h4 className="text-xs font-black uppercase text-cyan-600 dark:text-cyan-400 tracking-widest font-mono flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-cyan-500 animate-pulse" /> AI Real-time Transcript
              </h4>
              <span className="text-[9px] bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 px-2.5 py-0.5 rounded-full font-mono font-bold">Searchable</span>
            </div>

            {/* Transcript search bar */}
            <div className="relative mb-3.5">
              <input
                type="text"
                placeholder="Search spoken words inside video..."
                value={transcriptSearch}
                onChange={(e) => setTranscriptSearch(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-1 focus:ring-cyan-500 outline-none font-medium dark:text-white"
              />
              <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>

            {/* Transcript list */}
            <div className="space-y-2 max-h-[195px] overflow-y-auto pr-1">
              {filteredTranscripts.length === 0 ? (
                <p className="text-[10px] text-slate-400 italic text-center py-4">No transcription snippets match search.</p>
              ) : (
                filteredTranscripts.map((t, idx) => {
                  const isActiveSec = currentTime >= t.seconds && (idx === filteredTranscripts.length - 1 || currentTime < filteredTranscripts[idx + 1].seconds);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSeek(t.seconds)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex gap-3 cursor-pointer items-start ${
                        isActiveSec
                          ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-950 dark:text-cyan-300 shadow-sm'
                          : 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-100/60 dark:border-slate-800/60 hover:bg-slate-100/80 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="text-[9px] font-black text-cyan-600 dark:text-cyan-400 font-mono shrink-0 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 p-1 rounded-lg">
                        {t.time}
                      </span>
                      <p className="text-[11px] font-semibold leading-relaxed flex-1">
                        {t.text}
                      </p>
                    </button>
                  );
                })
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
