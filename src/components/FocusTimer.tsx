import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  Clock, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  Coffee, 
  TrendingUp, 
  Check,
  Zap,
  Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';

interface FocusTimerProps {
  user: User;
  onFocusTimeUpdated: (minutesAdded: number) => void;
}

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const PRESETS: Record<TimerMode, { label: string; duration: number; color: string; bg: string }> = {
  focus: { label: 'Deep Focus', duration: 25 * 60, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  shortBreak: { label: 'Short Break', duration: 5 * 60, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  longBreak: { label: 'Long Break', duration: 15 * 60, color: 'text-sky-500', bg: 'bg-sky-500/10' },
};

export default function FocusTimer({ user, onFocusTimeUpdated }: FocusTimerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(PRESETS.focus.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [sessionMinutesLogged, setSessionMinutesLogged] = useState(0);
  const [showLogSuccess, setShowLogSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Keep track of how many seconds of focus they actually accumulated
  const [accumulatedSeconds, setAccumulatedSeconds] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play synthesized completion chime
  const playChime = () => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      // Sweet double chime (E5 and A5)
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        
        osc.start(start);
        osc.stop(start + duration);
      };
      
      const now = ctx.currentTime;
      playTone(659.25, now, 0.4); // E5
      playTone(880.00, now + 0.15, 0.6); // A5
    } catch (e) {
      console.warn('Audio synthesis failed or blocked by autoplay guidelines:', e);
    }
  };

  // Switch timer mode preset
  const handleModeChange = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(PRESETS[newMode].duration);
    setAccumulatedSeconds(0);
  };

  // Toggle play/pause
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  // Reset current timer
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(PRESETS[mode].duration);
    setAccumulatedSeconds(0);
  };

  // Study timer runner effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer completed!
            setIsRunning(false);
            if (timerRef.current) clearInterval(timerRef.current);
            playChime();
            
            // If it was a focus session, auto-log completed focus duration
            if (mode === 'focus') {
              const fullMins = Math.round(PRESETS.focus.duration / 60);
              logMinutes(fullMins);
              setCompletedSessions(c => c + 1);
            }
            
            // Switch to break automatically to reward student
            if (mode === 'focus') {
              setMode('shortBreak');
              return PRESETS.shortBreak.duration;
            } else {
              setMode('focus');
              return PRESETS.focus.duration;
            }
          }
          
          // Track seconds logged
          if (mode === 'focus') {
            setAccumulatedSeconds(s => s + 1);
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  // Manually log partial accumulated focus sessions
  const handleLogAccumulated = () => {
    const mins = Math.floor(accumulatedSeconds / 60);
    if (mins < 1) return;
    logMinutes(mins);
    setAccumulatedSeconds(s => s % 60); // Keep remainder seconds
  };

  // Core function to log focus minutes to server
  const logMinutes = (minutes: number) => {
    if (minutes <= 0) return;
    setIsSaving(true);
    fetch(`/api/users/${user.id}/focus-time`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ minutes })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          onFocusTimeUpdated(minutes);
          setSessionMinutesLogged(prev => prev + minutes);
          setShowLogSuccess(true);
          setTimeout(() => setShowLogSuccess(false), 3000);
        }
      })
      .catch(err => console.error('Error updating focus time:', err))
      .finally(() => setIsSaving(false));
  };

  // Helper formatting mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Calculate SVG circular dashoffset
  const currentPreset = PRESETS[mode];
  const progressPercent = (timeLeft / currentPreset.duration);
  const strokeDashoffset = 2 * Math.PI * 34 * (1 - progressPercent);

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 font-sans">
      <AnimatePresence>
        {!isOpen ? (
          // Minimised Floating Pill
          <motion.button
            layoutId="focus-timer-container"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-full shadow-2xl hover:scale-[1.05] active:scale-95 transition-transform border border-slate-800 dark:border-slate-200/40 font-bold"
            whileHover={{ y: -2 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="relative flex items-center justify-center">
              <Clock className={`h-4.5 w-4.5 ${isRunning ? 'animate-spin' : ''} text-amber-400`} />
              {isRunning && (
                <span className="absolute -top-1.5 -right-1.5 h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
              )}
            </div>
            <span className="text-xs tracking-tight font-mono">{formatTime(timeLeft)}</span>
            <span className="text-[10px] uppercase font-black bg-white/10 dark:bg-slate-100 text-amber-400 dark:text-amber-500 px-1.5 py-0.5 rounded-md">
              {mode === 'focus' ? 'Focus' : 'Break'}
            </span>
          </motion.button>
        ) : (
          // Expanded Focus Cockpit Panel
          <motion.div
            layoutId="focus-timer-container"
            className="w-80 bg-slate-900 text-white rounded-[26px] shadow-2xl p-5 border border-slate-800 flex flex-col space-y-4 overflow-hidden relative"
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 180 }}
          >
            {/* Header / Close controls */}
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-1.5">
                <Flame className="h-4.5 w-4.5 text-amber-500 fill-amber-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-slate-300 font-mono">Focus Cockpit</span>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsMuted(!isMuted)} 
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                  title={isMuted ? "Unmute Timer Alert" : "Mute Timer Alert"}
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-800 rounded-lg transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Presets Toggle tabs */}
            <div className="grid grid-cols-3 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px] font-bold">
              {(['focus', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => handleModeChange(m)}
                  className={`py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
                    mode === m 
                      ? 'bg-slate-800 text-white border border-slate-750 font-black' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m === 'focus' ? 'Study' : m === 'shortBreak' ? 'Short' : 'Long'}
                </button>
              ))}
            </div>

            {/* Circular SVG Timer Face */}
            <div className="flex flex-col items-center justify-center py-2 relative">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                  {/* Background Circle */}
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    className="stroke-slate-850"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  {/* Front Interactive progress ring */}
                  <motion.circle
                    cx="40"
                    cy="40"
                    r="34"
                    stroke={mode === 'focus' ? '#f59e0b' : mode === 'shortBreak' ? '#10b981' : '#0ea5e9'}
                    strokeWidth="4.5"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 34}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    animate={{ strokeDashoffset }}
                    transition={{ ease: 'linear', duration: 0.3 }}
                  />
                </svg>

                {/* Inside Circle Content */}
                <div className="absolute flex flex-col items-center justify-center text-center space-y-0.5">
                  <span className="text-3xl font-mono font-black tracking-tight">{formatTime(timeLeft)}</span>
                  <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {mode === 'focus' ? (
                      <>
                        <Zap className="h-3 w-3 text-amber-500" />
                        Focusing
                      </>
                    ) : (
                      <>
                        <Coffee className="h-3 w-3 text-emerald-500" />
                        Break Time
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Playback Controls Row */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={resetTimer}
                className="p-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-full transition hover:scale-105 active:scale-95"
                title="Reset Focus Session"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <button
                onClick={toggleTimer}
                className={`p-4 rounded-full transition-all duration-300 shadow-lg hover:scale-110 active:scale-95 ${
                  isRunning 
                    ? 'bg-rose-600 hover:bg-rose-500 text-white ring-4 ring-rose-500/10' 
                    : mode === 'focus'
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 ring-4 ring-amber-500/10'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white ring-4 ring-emerald-500/10'
                }`}
              >
                {isRunning ? <Pause className="h-6 w-6 fill-white" /> : <Play className="h-6 w-6 fill-current ml-0.5" />}
              </button>

              <div className="w-10 flex justify-center">
                {mode === 'focus' && accumulatedSeconds >= 60 ? (
                  <button
                    onClick={handleLogAccumulated}
                    className="p-2.5 bg-emerald-600 border border-emerald-500 text-white hover:bg-emerald-500 rounded-full transition animate-bounce"
                    title={`Log completed focus (${Math.floor(accumulatedSeconds / 60)}m)`}
                  >
                    <Check className="h-4 w-4 font-black" />
                  </button>
                ) : (
                  <div className="w-10 h-10" /> // Empty placeholder to keep layout centered
                )}
              </div>
            </div>

            {/* Profile Statistics Log Bar */}
            <div className="bg-slate-950/70 border border-slate-850 p-3 rounded-2xl flex flex-col space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                <span className="flex items-center gap-1 text-slate-400">
                  <TrendingUp className="h-3.5 w-3.5 text-sky-400" />
                  Today's Session:
                </span>
                <span className="text-white">{sessionMinutesLogged}m logged</span>
              </div>

              {/* Progress Accumulator Indicator */}
              {mode === 'focus' && (
                <div className="text-[10px] text-slate-400 flex items-center justify-between font-mono">
                  <span>Current study blocks:</span>
                  <span className="text-slate-300 font-semibold">{Math.floor(accumulatedSeconds / 60)}m {accumulatedSeconds % 60}s</span>
                </div>
              )}

              {/* Dynamic Notification state overlay */}
              <AnimatePresence>
                {showLogSuccess && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-1.5 text-center text-[10px] font-bold text-emerald-400 flex items-center justify-center gap-1"
                  >
                    <Sparkles className="h-3.5 w-3.5 animate-spin" />
                    <span>Focus time synchronized to profile! ✓</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
