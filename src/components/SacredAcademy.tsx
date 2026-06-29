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
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SacredAcademyProps {
  onNotify?: (message: string, type: 'success' | 'info') => void;
}

export default function SacredAcademy({ onNotify }: SacredAcademyProps) {
  // Quran Module state
  const [recitationBooked, setRecitationBooked] = useState(false);
  const [liveRecitationActive, setLiveRecitationActive] = useState(false);
  const [quranProgress, setQuranProgress] = useState({
    surahsMastered: 18,
    totalSurahs: 30,
    ayatsMastered: 1420,
    totalAyats: 2200,
    juzMastered: 14,
  });

  // Hadees Module state
  const [activePath, setActivePath] = useState<'bukhari' | 'qudsi' | 'virtues'>('bukhari');
  const [completedNodes, setCompletedNodes] = useState<string[]>(['b_1', 'b_2']);
  const [currentHadeesIndex, setCurrentHadeesIndex] = useState(0);
  
  // Local premium micro-toast state
  const [localToast, setLocalToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  
  const triggerToast = (msg: string, type: 'success' | 'info') => {
    setLocalToast({ message: msg, type });
    if (onNotify) onNotify(msg, type);
    // Auto hide
    setTimeout(() => {
      setLocalToast(null);
    }, 3500);
  };

  // Predefined learning paths
  const learningPaths = {
    bukhari: {
      title: "Sahih Al-Bukhari Series",
      tagline: "Authentic Teachings of faith & practices",
      color: "from-sky-500 to-indigo-600",
      nodes: [
        { id: 'b_1', title: "Revelation", desc: "How the revelation began to the Messenger" },
        { id: 'b_2', title: "Belief (Faith)", desc: "The fundamentals of Islamic belief system" },
        { id: 'b_3', title: "Knowledge", desc: "The supreme virtues of seeking wisdom" },
        { id: 'b_4', title: "Ablution (Wudu)", desc: "Preserving spiritual and bodily cleanliness" },
      ]
    },
    qudsi: {
      title: "Hadith Qudsi Collection",
      tagline: "Direct divine wisdom revealed through words",
      color: "from-emerald-500 to-teal-600",
      nodes: [
        { id: 'q_1', title: "Mercy of Allah", desc: "My Mercy supersedes My Wrath" },
        { id: 'q_2', title: "Sincerity (Ikhlas)", desc: "Devoting actions purely for the Divine" },
        { id: 'q_3', title: "The Power of Prayer", desc: "Closeness to the Almighty through worship" },
      ]
    },
    virtues: {
      title: "Virtues and Ethics",
      tagline: "The perfection of human character & manners",
      color: "from-amber-500 to-orange-600",
      nodes: [
        { id: 'v_1', title: "Kindness to Parents", desc: "The highest ethical duty in daily life" },
        { id: 'v_2', title: "Truthfulness", desc: "Integrity as a cornerstone of personality" },
        { id: 'v_3', title: "Generosity", desc: "Noble hospitality and selflessness" },
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
      topic: "Peace & Brotherhood",
      glowColor: "shadow-cyan-500/10 border-cyan-500/20"
    },
    {
      arabic: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
      english: "None of you will believe until he wishes for his brother what he wishes for himself.",
      ref: "Sahih al-Bukhari 13",
      topic: "Altruism & Love",
      glowColor: "shadow-violet-500/10 border-violet-500/20"
    }
  ];

  const handleToggleNode = (id: string) => {
    if (completedNodes.includes(id)) {
      setCompletedNodes(prev => prev.filter(n => n !== id));
      triggerToast('Chapter node marked incomplete', 'info');
    } else {
      setCompletedNodes(prev => [...prev, id]);
      triggerToast('Beautiful! Chapter node marked complete', 'success');
    }
  };

  const handleNextHadees = () => {
    setCurrentHadeesIndex(prev => (prev + 1) % hadeesOfTheDay.length);
    triggerToast('Showing next prophetic tradition', 'info');
  };

  const handlePrevHadees = () => {
    setCurrentHadeesIndex(prev => (prev - 1 + hadeesOfTheDay.length) % hadeesOfTheDay.length);
    triggerToast('Showing previous prophetic tradition', 'info');
  };

  const handleBookRecitation = () => {
    if (recitationBooked) {
      setRecitationBooked(false);
      triggerToast('Recitation session cancelled', 'info');
    } else {
      setRecitationBooked(true);
      setLiveRecitationActive(true);
      triggerToast('Excellent choice! Connecting you to a Live Quran Recitation instructor...', 'success');
      setTimeout(() => {
        setLiveRecitationActive(false);
      }, 5000);
    }
  };

  // Compute stats
  const curPath = learningPaths[activePath];
  const pathCompletedCount = curPath.nodes.filter(n => completedNodes.includes(n.id)).length;
  const pathTotalCount = curPath.nodes.length;
  const pathPercent = Math.round((pathCompletedCount / pathTotalCount) * 100);

  // Circular progress math
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const quranPercentage = Math.round((quranProgress.surahsMastered / quranProgress.totalSurahs) * 100);
  const strokeDashoffset = circumference - (quranPercentage / 100) * circumference;

  return (
    <div className="space-y-8 text-left">
      {/* Title block with premium typography and glowing divider */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center justify-center p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Sparkles className="h-4 w-4 animate-pulse text-amber-300" />
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 font-mono bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/30">
              Spiritual & Islamic Sciences
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-poppins text-slate-800 dark:text-white tracking-tight">
            Religious Studies
          </h2>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
            Syllabus of pure recitation mastery and prophetic traditions, perfectly designed with holographic progress logs.
          </p>
        </div>
        
        {/* Quick status bar */}
        <div className="flex items-center gap-4 bg-white dark:bg-[#0b0d19] p-3 rounded-2xl border border-slate-200/60 dark:border-violet-500/30 shadow-sm">
          <div className="text-right">
            <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">Spiritual Pacing</p>
            <p className="text-xs font-black text-slate-800 dark:text-amber-300">Intelligent Sync &bull; 86%</p>
          </div>
          <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800" />
          <div className="bg-amber-500/20 text-amber-400 p-2 rounded-xl border border-amber-500/20">
            <Award className="h-5 w-5 text-amber-300" />
          </div>
        </div>
      </div>

      {/* Grid container representing both majestic modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* MODULE CARD 1: HOLY QURAN NAZRA RECITATION */}
        <div className="bg-gradient-to-b from-white to-slate-50 dark:from-[#0F172A] dark:to-[#090D1A] rounded-[32px] border border-slate-200 dark:border-blue-500/30 p-6 sm:p-8 shadow-xl relative overflow-hidden group transition-all duration-300 hover:border-cyan-500/60 dark:hover:shadow-[0_0_50px_rgba(37,99,235,0.15)]">
          {/* Visual gradient backdrop lights with deep neon sapphire */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full filter blur-[80px] pointer-events-none animate-pulse" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-500/10 rounded-full filter blur-[60px] pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-widest font-mono bg-cyan-500/20 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                Nazra Mastery
              </span>
              <h3 className="text-xl font-black font-poppins text-slate-800 dark:text-white tracking-tight mt-1">
                Al-Quran: Nazra Recitation
              </h3>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Immersive recitation correction with dynamic accent tracking.
              </p>
            </div>
            
            {/* Custom Open Quran Calligraphic Graphic mockup */}
            <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/10">
              <BookOpen className="h-7 w-7 text-cyan-400 animate-pulse" />
              <div className="absolute -inset-0.5 rounded-2xl bg-cyan-500/30 blur opacity-40 group-hover:opacity-70 transition duration-500" />
            </div>
          </div>

          {/* Glowing Arc Progress Tracker */}
          <div className="relative z-10 my-8 py-4 bg-white/60 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800/80 p-5 flex flex-col sm:flex-row items-center gap-6 shadow-inner">
            
            {/* Circular Progress Wheel */}
            <div className="relative flex items-center justify-center shrink-0">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  className="stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r={radius}
                  className="stroke-cyan-400 transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              {/* Inner Stats */}
              <div className="absolute flex flex-col items-center">
                <span className="text-lg font-black text-slate-800 dark:text-white">{quranPercentage}%</span>
                <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">Mastered</span>
              </div>
            </div>

            {/* Mastery detail lists */}
            <div className="flex-1 w-full text-left space-y-3">
              <div>
                <p className="text-xxs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">Completed Target logs</p>
                <div className="grid grid-cols-2 gap-4 mt-1.5">
                  <div className="bg-slate-100/80 dark:bg-slate-950/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/60">
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Surahs Complete</p>
                    <p className="text-sm font-extrabold text-slate-800 dark:text-cyan-300">{quranProgress.surahsMastered} <span className="text-slate-500 dark:text-slate-400 text-xs font-normal">/ {quranProgress.totalSurahs}</span></p>
                  </div>
                  <div className="bg-slate-100/80 dark:bg-slate-950/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800/60">
                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">Ayats Mastered</p>
                    <p className="text-sm font-extrabold text-slate-800 dark:text-violet-300">{quranProgress.ayatsMastered.toLocaleString()} <span className="text-slate-500 dark:text-slate-400 text-xs font-normal">/ {quranProgress.totalAyats}</span></p>
                  </div>
                </div>
              </div>

              {/* Juz tracked */}
              <div className="flex items-center justify-between text-xs bg-slate-200/50 dark:bg-slate-950/60 p-2 px-3 rounded-xl border border-slate-200/40 dark:border-slate-800/40">
                <span className="font-extrabold text-slate-600 dark:text-slate-300">Total Juz Memorized:</span>
                <span className="font-black text-cyan-600 dark:text-cyan-400 font-mono">{quranProgress.juzMastered} / 30 Juz</span>
              </div>
            </div>
          </div>

          {/* Upcoming Next Lesson Indicator panel */}
          <div className="relative z-10 bg-gradient-to-r from-sky-500/10 to-cyan-500/10 dark:from-sky-500/15 dark:to-cyan-500/5 p-4 rounded-2xl border border-cyan-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left">
            <div className="flex gap-3">
              <div className="p-2.5 bg-cyan-500/20 rounded-xl text-cyan-600 dark:text-cyan-300 border border-cyan-500/30 shrink-0 self-start sm:self-center">
                <Clock className="h-5 w-5 text-cyan-500 animate-spin-slow" />
              </div>
              <div>
                <p className="text-xxs font-extrabold uppercase text-cyan-600 dark:text-cyan-400 tracking-widest font-mono">Next Scheduled Lesson</p>
                <h4 className="text-sm font-black text-slate-800 dark:text-slate-100 mt-0.5">Surah Al-Kahf, Ayat 1-10</h4>
                <p className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold">Focused on pronunciation of "Madd" constraints &bull; Tomorrow 9:00 AM</p>
              </div>
            </div>

            {/* Play sample audio preview click */}
            <button 
              onClick={() => triggerToast('Playing recitation lesson syllabus overview audio', 'info')}
              className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xxs font-extrabold p-2.5 rounded-xl border border-cyan-500/30 flex items-center justify-center gap-1 shrink-0 self-end sm:self-center cursor-pointer transition-all"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Syllabus Prep</span>
            </button>
          </div>

          {/* Live Instructor Check Session Action Button */}
          <div className="relative z-10 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h5 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Live Consultation Desk</h5>
              <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">Connect to a live certified Sheikh for immediate recitation feedback.</p>
            </div>

            <button
              onClick={handleBookRecitation}
              className={`w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg cursor-pointer ${
                recitationBooked 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-950/20 border-none' 
                  : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white shadow-cyan-950/20'
              }`}
            >
              {liveRecitationActive ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-white animate-ping" />
                  <span>Connecting Sheikh...</span>
                </>
              ) : recitationBooked ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Session Booked!</span>
                </>
              ) : (
                <>
                  <Video className="h-4 w-4" />
                  <span>Live Recitation Check</span>
                </>
              )}
            </button>
          </div>
        </div>


        {/* MODULE CARD 2: AHADEES EDUCATION */}
        <div className="bg-gradient-to-b from-white to-slate-50 dark:from-[#0F172A] dark:to-[#090D1A] rounded-[32px] border border-slate-200 dark:border-amber-500/30 p-6 sm:p-8 shadow-xl relative overflow-hidden group transition-all duration-300 hover:border-amber-500/60 dark:hover:shadow-[0_0_50px_rgba(245,158,11,0.15)]">
          {/* Visual gradient backdrop lights with premium gold glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/15 rounded-full filter blur-[80px] pointer-events-none animate-pulse" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-600/10 rounded-full filter blur-[60px] pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono bg-amber-500/20 px-2.5 py-1 rounded-full border border-amber-500/30">
                Prophetic Tradition
              </span>
              <h3 className="text-xl font-black font-poppins text-slate-800 dark:text-white tracking-tight mt-1">
                Ahadees Education
              </h3>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Study authentic collections of teachings & morals.
              </p>
            </div>
            
            {/* Dignified scroll / book open calligraphic icon */}
            <div className="relative h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-emerald-500/30 border border-amber-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/10">
              <Bookmark className="h-7 w-7 text-amber-400 animate-pulse" />
              <div className="absolute -inset-0.5 rounded-2xl bg-amber-500/30 blur opacity-40 group-hover:opacity-70 transition duration-500" />
            </div>
          </div>

          {/* Interactive Learning Path Categorization Row */}
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
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer ${
                    active 
                      ? 'bg-gradient-to-r from-amber-500/30 to-amber-600/20 text-amber-400 border border-amber-500/40 shadow-sm font-black' 
                      : 'bg-slate-200/60 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border border-slate-300/50 dark:border-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-900'
                  }`}
                >
                  {learningPaths[key].title.split(' ')[0]}
                </button>
              );
            })}
          </div>

          {/* Path Header info */}
          <div className="relative z-10 mt-4 p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 text-left">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-extrabold text-slate-800 dark:text-slate-100 font-poppins">{curPath.title}</span>
              <span className="font-black text-amber-500 dark:text-amber-400">{pathPercent}% Completed</span>
            </div>
            <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 leading-normal">{curPath.tagline}</p>
            
            <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mt-3 overflow-hidden border border-slate-300/30 dark:border-slate-800">
              <motion.div 
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${pathPercent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Interactive Nodes list */}
          <div className="relative z-10 mt-4 space-y-2.5">
            <p className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono text-left">Series Chapters Checklist</p>
            
            <div className="grid grid-cols-1 gap-2">
              {curPath.nodes.map((node) => {
                const complete = completedNodes.includes(node.id);
                return (
                  <button
                    key={node.id}
                    onClick={() => handleToggleNode(node.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all duration-200 group/item cursor-pointer ${
                      complete 
                        ? 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/40 text-slate-800 dark:text-white' 
                        : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-900/80 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                        complete 
                          ? 'bg-emerald-500 border-transparent text-white' 
                          : 'border-slate-300 dark:border-slate-700 text-transparent group-hover/item:border-amber-400'
                      }`}>
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <div>
                        <span className="text-xs font-extrabold leading-tight block">{node.title}</span>
                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block leading-tight mt-0.5">{node.desc}</span>
                      </div>
                    </div>
                    
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover/item:translate-x-0.5 transition" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* HADITH OF THE DAY PREVIEW CAROUSEL */}
          <div className="relative z-10 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80 text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xxs font-extrabold uppercase text-amber-500 dark:text-amber-400 tracking-widest font-mono flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-spin-slow" />
                Hadees of the Day
              </span>
              
              {/* Carousel controls */}
              <div className="flex gap-1.5">
                <button 
                  onClick={handlePrevHadees}
                  className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:bg-slate-300 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <ChevronLeft className="h-3 w-3 text-slate-700 dark:text-slate-300" />
                </button>
                <button 
                  onClick={handleNextHadees}
                  className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 hover:bg-slate-300 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <ChevronRight className="h-3 w-3 text-slate-700 dark:text-slate-300" />
                </button>
              </div>
            </div>

            {/* Carousel Item with custom transitions */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentHadeesIndex}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="p-4 rounded-2xl bg-slate-900/90 dark:bg-[#090d16] border border-amber-500/25 text-center flex flex-col justify-between space-y-3.5 min-h-[140px] shadow-lg"
              >
                {/* Arabic Calligraphy Style text with clean weight & sizes */}
                <div className="space-y-2">
                  <p className="text-sm font-extrabold text-amber-300 font-serif leading-loose tracking-wide select-none">
                    "{hadeesOfTheDay[currentHadeesIndex].arabic}"
                  </p>
                  
                  {/* English Translation */}
                  <p className="text-[11px] text-slate-100 dark:text-slate-200 font-bold leading-relaxed italic px-2">
                    "{hadeesOfTheDay[currentHadeesIndex].english}"
                  </p>
                </div>

                {/* Meta details footer */}
                <div className="flex items-center justify-between text-[9px] font-mono border-t border-slate-800/80 pt-2 text-slate-400">
                  <span className="font-extrabold text-amber-400 uppercase">{hadeesOfTheDay[currentHadeesIndex].topic}</span>
                  <span className="font-bold text-slate-300">{hadeesOfTheDay[currentHadeesIndex].ref}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* Floating Micro-Notification Toast */}
      <AnimatePresence>
        {localToast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#0A0E1A]/95 backdrop-blur-md border border-amber-500/30 p-4 rounded-2xl shadow-xl shadow-amber-950/20 max-w-sm pointer-events-auto"
          >
            <div className={`p-1.5 rounded-lg ${localToast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
              <Sparkles className="h-4 w-4 animate-pulse" />
            </div>
            <p className="text-xs font-bold text-slate-100 font-sans leading-snug">{localToast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
