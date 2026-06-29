import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Check, 
  ChevronRight, 
  Clock, 
  Award, 
  Play, 
  Video, 
  Zap, 
  MessageSquare,
  Book,
  FileText,
  Bookmark,
  ChevronLeft,
  Calendar,
  Volume2,
  VolumeX,
  Compass,
  Hourglass,
  Star,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SacredAcademyProps {
  onNotify?: (message: string, type: 'success' | 'info') => void;
}

export default function SacredAcademy({ onNotify }: SacredAcademyProps) {
  // Quran Module State
  const [recitationBooked, setRecitationBooked] = useState(false);
  const [liveRecitationActive, setLiveRecitationActive] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [quranProgress, setQuranProgress] = useState({
    surahsMastered: 18,
    totalSurahs: 30,
    ayatsMastered: 1420,
    totalAyats: 2200,
    juzMastered: 14,
  });

  // Hadees Module State
  const [activePath, setActivePath] = useState<'bukhari' | 'qudsi' | 'virtues'>('bukhari');
  const [completedNodes, setCompletedNodes] = useState<string[]>(['b_1', 'b_2']);
  const [currentHadeesIndex, setCurrentHadeesIndex] = useState(0);
  
  // Local premium micro-toast state
  const [localToast, setLocalToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  
  const triggerToast = (msg: string, type: 'success' | 'info') => {
    setLocalToast({ message: msg, type });
    if (onNotify) onNotify(msg, type);
    setTimeout(() => {
      setLocalToast(null);
    }, 3500);
  };

  // Predefined learning paths
  const learningPaths = {
    bukhari: {
      title: "Sahih Al-Bukhari Series",
      tagline: "Authentic teachings of faith, moral behavior, & daily practices.",
      color: "from-amber-400 to-yellow-600",
      accent: "amber",
      nodes: [
        { id: 'b_1', title: "Revelation (Wahy)", desc: "How revelation descended upon the Prophet" },
        { id: 'b_2', title: "Belief (Iman)", desc: "The core pillars and branches of true faith" },
        { id: 'b_3', title: "Knowledge (Ilm)", desc: "The supreme value of seeking divine wisdom" },
        { id: 'b_4', title: "Ablution (Wudu)", desc: "Preserving spiritual purity and cleanliness" },
      ]
    },
    qudsi: {
      title: "Hadith Qudsi Collection",
      tagline: "Direct divine inspiration revealed in prophetic words.",
      color: "from-yellow-500 to-amber-600",
      accent: "gold",
      nodes: [
        { id: 'q_1', title: "Mercy of Allah", desc: "My Mercy supersedes and overcomes My Wrath" },
        { id: 'q_2', title: "Sincerity (Ikhlas)", desc: "Doing every righteous action purely for the Divine" },
        { id: 'q_3', title: "The Power of Dua", desc: "Sincere supplication and drawing close to the Almighty" },
      ]
    },
    virtues: {
      title: "Virtues and Ethics (Akhlaq)",
      tagline: "The perfection of noble human character, ethics, & manners.",
      color: "from-orange-400 to-amber-500",
      accent: "orange",
      nodes: [
        { id: 'v_1', title: "Duty to Parents", desc: "Honor, kindness, and devotion in family life" },
        { id: 'v_2', title: "Truthfulness (Sidq)", desc: "Integrity and honesty as character baselines" },
        { id: 'v_3', title: "Generosity (Karam)", desc: "Aesthetic hospitality, selflessness, and sharing" },
      ]
    }
  };

  // Predefined Daily Hadees highlights
  const hadeesOfTheDay = [
    {
      arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى",
      english: "Actions are but by intentions, and every person shall have only that which he intended.",
      ref: "Sahih al-Bukhari 1",
      topic: "Intention & Sincerity",
      glowColor: "shadow-amber-500/10 border-amber-500/20"
    },
    {
      arabic: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
      english: "A true Muslim is the one from whose tongue and hand other Muslims are safe.",
      ref: "Sahih al-Bukhari 10",
      topic: "Peace & Character",
      glowColor: "shadow-yellow-500/10 border-yellow-500/20"
    },
    {
      arabic: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
      english: "None of you will believe until he wishes for his brother what he wishes for himself.",
      ref: "Sahih al-Bukhari 13",
      topic: "Altruism & Brotherhood",
      glowColor: "shadow-orange-500/10 border-orange-500/20"
    }
  ];

  const handleToggleNode = (id: string) => {
    if (completedNodes.includes(id)) {
      setCompletedNodes(prev => prev.filter(n => n !== id));
      triggerToast('Chapter module marked incomplete', 'info');
    } else {
      setCompletedNodes(prev => [...prev, id]);
      triggerToast('Beautiful! Node completed and logged to study dashboard.', 'success');
    }
  };

  const handleNextHadees = () => {
    setCurrentHadeesIndex(prev => (prev + 1) % hadeesOfTheDay.length);
  };

  const handlePrevHadees = () => {
    setCurrentHadeesIndex(prev => (prev - 1 + hadeesOfTheDay.length) % hadeesOfTheDay.length);
  };

  const handleBookRecitation = () => {
    if (recitationBooked) {
      setRecitationBooked(false);
      setLiveRecitationActive(false);
      triggerToast('Recitation desk connection cancelled.', 'info');
    } else {
      setRecitationBooked(true);
      setLiveRecitationActive(true);
      triggerToast('Connecting you to a Live Quran Recitation instructor...', 'success');
      setTimeout(() => {
        setLiveRecitationActive(false);
        triggerToast('Connected! Live Sheikh voice channel active.', 'success');
      }, 4000);
    }
  };

  const handleToggleAudio = () => {
    setIsAudioPlaying(!isAudioPlaying);
    if (!isAudioPlaying) {
      triggerToast('Playing Surah Al-Kahf recitation sample (Madd pronunciation guide).', 'success');
    } else {
      triggerToast('Pronunciation sample paused.', 'info');
    }
  };

  // Calculations for current path
  const curPath = learningPaths[activePath];
  const pathCompletedCount = curPath.nodes.filter(n => completedNodes.includes(n.id)).length;
  const pathTotalCount = curPath.nodes.length;
  const pathPercent = Math.round((pathCompletedCount / pathTotalCount) * 100);

  // Circular progress dimensions for Quran Arc
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const quranPercentage = Math.round((quranProgress.surahsMastered / quranProgress.totalSurahs) * 100);
  const strokeDashoffset = circumference - (quranPercentage / 100) * circumference;

  return (
    <div id="religious-studies-root" className="space-y-8 text-left">
      
      {/* 2. DUAL-ROW GLASSMORPHISM CARDS GRID WITH NEON SAPPHIRE AND GOLD ACCENTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        {/* CARD 1: AL-QURAN NAZRA RECITATION WITH NEON SAPPHIRE ACCENTS */}
        <div 
          id="quran-recitation-card"
          className="backdrop-blur-xl bg-white/30 dark:bg-slate-950/40 border border-slate-200/50 dark:border-blue-500/20 rounded-[32px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(37,99,235,0.05)] dark:shadow-[0_20px_50px_rgba(37,99,235,0.15)] relative overflow-hidden group transition-all duration-500 hover:border-blue-400/50 hover:shadow-[0_20px_60px_rgba(37,99,235,0.22)]"
        >
          {/* Glassmorphism neon sapphire blur points */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/15 rounded-full filter blur-[100px] pointer-events-none group-hover:bg-blue-600/20 transition-all duration-700" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full filter blur-[80px] pointer-events-none" />

          {/* Card Header */}
          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest font-mono bg-cyan-500/10 dark:bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-500/20">
                Nazra Recitation
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-poppins text-slate-900 dark:text-white tracking-tight mt-1.5">
                Al-Quran: Nazra Recitation
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-300 leading-normal max-w-sm">
                Immersive recitation correction, proper accent (Makhraj) tracking, and custom daily memorization targets.
              </p>
            </div>
            
            {/* Elegant Open Book icon with sapphire backglow */}
            <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/20 border border-blue-500/30 dark:border-blue-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/15">
              <BookOpen className="h-7 w-7 text-blue-500 dark:text-blue-400 animate-pulse" />
              <div className="absolute -inset-1 rounded-2xl bg-blue-500/20 blur opacity-40 group-hover:opacity-75 transition duration-500" />
            </div>
          </div>

          {/* Premium Sapphire Progress Arc & Stats Column */}
          <div className="relative z-10 my-6 bg-slate-50/40 dark:bg-slate-900/40 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-800/60 p-6 flex flex-col sm:flex-row items-center gap-6 shadow-inner">
            
            {/* SVG Progress Arc with a glowing Sapphire-to-Cyan linear gradient */}
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-36 h-36 transform -rotate-90">
                <defs>
                  <linearGradient id="sapphireProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-slate-200/60 dark:stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  stroke="url(#sapphireProgressGrad)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out shadow-lg"
                  style={{ filter: 'drop-shadow(0px 0px 6px rgba(37,99,235,0.5))' }}
                />
              </svg>
              {/* Central text display */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xl font-black text-slate-900 dark:text-white font-mono">{quranPercentage}%</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Completed</span>
              </div>
            </div>

            {/* Progress Metrics Column */}
            <div className="flex-1 w-full space-y-3.5 text-left">
              <div>
                <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">Memorization & Pacing Indices</p>
                
                <div className="grid grid-cols-2 gap-3 mt-1.5">
                  <div className="bg-white/60 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
                    <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase">Surahs Complete</p>
                    <p className="text-sm font-black text-slate-900 dark:text-cyan-400 font-mono mt-0.5">
                      {quranProgress.surahsMastered} <span className="text-slate-400 font-normal text-xxs">/ {quranProgress.totalSurahs}</span>
                    </p>
                  </div>
                  <div className="bg-white/60 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
                    <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase">Ayats Mastered</p>
                    <p className="text-sm font-black text-slate-900 dark:text-blue-400 font-mono mt-0.5">
                      {quranProgress.ayatsMastered} <span className="text-slate-400 font-normal text-xxs">/ {quranProgress.totalAyats}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Juz Tracked bar */}
              <div className="flex items-center justify-between text-xs bg-white/40 dark:bg-slate-950/40 p-2 px-3 rounded-xl border border-slate-200/40 dark:border-slate-800/60 font-semibold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5 text-blue-500 animate-spin-slow" />
                  Juz Completed:
                </span>
                <span className="font-extrabold text-blue-600 dark:text-cyan-400 font-mono">{quranProgress.juzMastered} / 30 Juz</span>
              </div>
            </div>
          </div>

          {/* Next lesson syllabus segment */}
          <div className="relative z-10 bg-gradient-to-r from-blue-500/10 to-cyan-500/5 dark:from-blue-600/15 dark:to-cyan-400/5 p-4 rounded-2xl border border-blue-500/20 dark:border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
            <div className="flex gap-3">
              <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-600 dark:text-blue-400 border border-blue-500/30 shrink-0 self-start sm:self-center">
                <Clock className="h-5 w-5 text-blue-500 dark:text-blue-400 animate-pulse" />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase text-blue-600 dark:text-cyan-400 tracking-wider font-mono">Syllabus Practice Target</span>
                <h4 className="text-sm font-black text-slate-900 dark:text-white mt-0.5">Surah Al-Kahf &bull; Ayah 1-10</h4>
                <p className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold leading-normal mt-0.5">Focusing on Madd letters and beautiful recitation rules. Practice online now.</p>
              </div>
            </div>

            {/* Pronunciation sample player */}
            <button 
              onClick={handleToggleAudio}
              className={`text-xxs font-extrabold px-3.5 py-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-center gap-1.5 shrink-0 self-end sm:self-center shadow-md ${
                isAudioPlaying 
                  ? 'bg-rose-500/20 border-rose-500/30 text-rose-600 dark:text-rose-400' 
                  : 'bg-blue-500/20 border-blue-500/30 text-blue-700 dark:text-blue-300 hover:bg-blue-500/30'
              }`}
            >
              {isAudioPlaying ? (
                <>
                  <VolumeX className="h-3.5 w-3.5" />
                  <span>Pause Guide</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>Listen Makhraj</span>
                </>
              )}
            </button>
          </div>

          {/* Live Recitation Check with interactive simulation */}
          <div className="relative z-10 mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left space-y-0.5">
              <h5 className="text-xs font-black text-slate-900 dark:text-slate-200">Live Consultation Desk</h5>
              <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 leading-normal">
                Submit audio files or connect live to a certified Qari for pronunciation feedback.
              </p>
            </div>

            <button
              onClick={handleBookRecitation}
              className={`w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                liveRecitationActive
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-amber-500/10 border-none animate-pulse'
                  : recitationBooked 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/10 border-none' 
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 text-white shadow-blue-500/20'
              }`}
            >
              {liveRecitationActive ? (
                <>
                  <Activity className="h-4 w-4 animate-spin" />
                  <span>Activating Voice Channel...</span>
                </>
              ) : recitationBooked ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Desk Scheduled</span>
                </>
              ) : (
                <>
                  <Video className="h-4 w-4 animate-pulse" />
                  <span>Live Recitation Check</span>
                </>
              )}
            </button>
          </div>
        </div>


        {/* CARD 2: AHADEES EDUCATION WITH NEON GOLD / AMBER ACCENTS */}
        <div 
          id="hadees-education-card"
          className="backdrop-blur-xl bg-white/30 dark:bg-slate-950/40 border border-slate-200/50 dark:border-amber-500/20 rounded-[32px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(245,158,11,0.05)] dark:shadow-[0_20px_50px_rgba(245,158,11,0.15)] relative overflow-hidden group transition-all duration-500 hover:border-amber-400/50 hover:shadow-[0_20px_60px_rgba(245,158,11,0.22)]"
        >
          {/* Glassmorphism neon gold/amber blur points */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/15 rounded-full filter blur-[100px] pointer-events-none group-hover:bg-amber-500/20 transition-all duration-700" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-600/10 rounded-full filter blur-[80px] pointer-events-none" />

          {/* Card Header */}
          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest font-mono bg-amber-500/10 dark:bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/20">
                Prophetic Tradition
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-poppins text-slate-900 dark:text-white tracking-tight mt-1.5">
                Ahadees Education
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-300 leading-normal max-w-sm">
                Unlock systemic learning paths through compilations of authentic Hadees and Prophetic ethics.
              </p>
            </div>
            
            {/* Elegant scroll / book open calligraphic icon in gold */}
            <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400/10 to-yellow-500/20 border border-amber-500/30 dark:border-amber-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/15">
              <Bookmark className="h-7 w-7 text-amber-500 dark:text-amber-400 animate-pulse" />
              <div className="absolute -inset-1 rounded-2xl bg-amber-500/20 blur opacity-40 group-hover:opacity-75 transition duration-500" />
            </div>
          </div>

          {/* Interactive Learning Path selection row */}
          <div className="relative z-10 mt-6 flex flex-wrap gap-2">
            {(Object.keys(learningPaths) as Array<keyof typeof learningPaths>).map(key => {
              const active = activePath === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setActivePath(key);
                    triggerToast(`Loaded ${learningPaths[key].title} series`, 'info');
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all duration-300 border cursor-pointer flex items-center gap-1 ${
                    active 
                      ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/30 text-amber-600 dark:text-amber-400 border-amber-500/40 shadow-sm font-black scale-102' 
                      : 'bg-white/40 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-900/60'
                  }`}
                >
                  <Star className={`h-3 w-3 ${active ? 'fill-amber-500 text-amber-500 animate-spin-slow' : 'text-slate-400'}`} />
                  {learningPaths[key].title.split(' ')[0]}
                </button>
              );
            })}
          </div>

          {/* Selected Path Details Header */}
          <div className="relative z-10 mt-4 p-4 rounded-2xl bg-white/50 dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-800/80 text-left">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-extrabold text-slate-900 dark:text-slate-100 font-poppins flex items-center gap-1.5">
                <Book className="h-3.5 w-3.5 text-amber-500" />
                {curPath.title}
              </span>
              <span className="font-black text-amber-600 dark:text-amber-400 font-mono">{pathPercent}% Done</span>
            </div>
            <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 leading-normal">{curPath.tagline}</p>
            
            {/* Glowing gold progress bar */}
            <div className="h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full mt-3 overflow-hidden border border-slate-200/40 dark:border-slate-800/60">
              <motion.div 
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${pathPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Learning path checklist nodes */}
          <div className="relative z-10 mt-4 space-y-2">
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono text-left">Learning Path Progress Nodes</p>
            
            <div className="grid grid-cols-1 gap-2 max-h-[195px] overflow-y-auto pr-1">
              {curPath.nodes.map((node) => {
                const complete = completedNodes.includes(node.id);
                return (
                  <button
                    key={node.id}
                    onClick={() => handleToggleNode(node.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all duration-300 group/item cursor-pointer ${
                      complete 
                        ? 'bg-amber-500/10 dark:bg-amber-500/25 border-amber-500/30 text-slate-900 dark:text-white' 
                        : 'bg-white/40 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-900/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                        complete 
                          ? 'bg-amber-500 border-transparent text-slate-950' 
                          : 'border-slate-300 dark:border-slate-700 text-transparent group-hover/item:border-amber-400'
                       }`}>
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <div>
                        <span className="text-xs font-black leading-tight block">{node.title}</span>
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block leading-tight mt-0.5">{node.desc}</span>
                      </div>
                    </div>
                    
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover/item:translate-x-1 transition-all" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Hadees of the Day section with navigation */}
          <div className="relative z-10 mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/80 text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xxs font-black uppercase text-amber-500 dark:text-amber-400 tracking-widest font-mono flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                Hadees of the Day
              </span>
              
              {/* Carousel controls */}
              <div className="flex gap-1.5">
                <button 
                  onClick={handlePrevHadees}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <ChevronLeft className="h-3 w-3 text-slate-700 dark:text-slate-300" />
                </button>
                <button 
                  onClick={handleNextHadees}
                  className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <ChevronRight className="h-3 w-3 text-slate-700 dark:text-slate-300" />
                </button>
              </div>
            </div>

            {/* Slider with dynamic animations */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentHadeesIndex}
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.3 }}
                className="p-4 rounded-2xl bg-slate-950/90 border border-amber-500/20 text-center flex flex-col justify-between space-y-3 shadow-md"
              >
                <div className="space-y-2">
                  <p className="text-sm font-black text-amber-300 font-serif leading-loose tracking-wide">
                    "{hadeesOfTheDay[currentHadeesIndex].arabic}"
                  </p>
                  
                  <p className="text-[11px] text-slate-200 font-bold leading-normal italic px-1">
                    "{hadeesOfTheDay[currentHadeesIndex].english}"
                  </p>
                </div>

                <div className="flex items-center justify-between text-[9px] font-mono border-t border-slate-800/80 pt-2 text-slate-400">
                  <span className="font-extrabold text-amber-400 uppercase">{hadeesOfTheDay[currentHadeesIndex].topic}</span>
                  <span className="font-bold text-slate-300">{hadeesOfTheDay[currentHadeesIndex].ref}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Local floating premium notification toast */}
      <AnimatePresence>
        {localToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#0A0E1A]/95 backdrop-blur-md border border-amber-500/30 p-4 rounded-2xl shadow-xl shadow-amber-950/25 max-w-sm pointer-events-auto"
          >
            <div className={`p-1.5 rounded-lg ${localToast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
              <Sparkles className="h-4 w-4 animate-bounce" />
            </div>
            <p className="text-xs font-bold text-slate-100 font-sans leading-snug">{localToast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
