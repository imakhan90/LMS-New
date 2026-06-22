import React, { useEffect, useState } from 'react';
import { 
  BookOpen, 
  Map, 
  FileText, 
  Lightbulb, 
  CheckCircle, 
  Tv, 
  Award, 
  ArrowRight, 
  Sparkles, 
  BookMarked 
} from 'lucide-react';
import { Course, AttendanceRecord, QuizAttempt, Certificate, User, Quiz } from '../types';

interface QuranSectionProps {
  user: User;
  courses: Course[];
  onLaunchCourse: (course: Course) => void;
  onLaunchQuiz: (quiz: Quiz, courseId: string) => void;
}

export default function QuranSection({ user, courses, onLaunchCourse, onLaunchQuiz }: QuranSectionProps) {
  const [quranCourse, setQuranCourse] = useState<Course | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the Quran course
    const qCourse = courses.find(c => c.isQuran);
    if (qCourse) setQuranCourse(qCourse);

    Promise.all([
      fetch('/api/attendance').then(res => res.json()),
      fetch(`/api/quiz-attempts/${user.id}`).then(res => res.json()),
      fetch(`/api/certificates/${user.id}`).then(res => res.json())
    ])
      .then(([attendanceData, attemptsData, certsData]) => {
        setAttendance(attendanceData);
        setAttempts(attemptsData);
        setCerts(certsData);
      })
      .catch(err => console.error('Error fetching Quran section progress parameters', err))
      .finally(() => setLoading(false));
  }, [courses, user.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 animate-pulse text-sky-600">
        Studying Quranic Curriculum specifications...
      </div>
    );
  }

  if (!quranCourse) {
    return (
      <div className="bg-rose-50 border-l-4 border-rose-500 p-4 text-rose-700 text-sm">
        Syllabus catalog error: Fehm-ul-Quran ISL101 has not been configured inside administrative registries.
      </div>
    );
  }

  // Calculate completion indices
  const quranLessons = quranCourse.modules.flatMap(m => m.lessons);
  const completedLessons = quranLessons.filter(lesson => 
    attendance.some(att => att.lessonId === lesson.id && att.status === 'Present')
  );
  
  const quranAttempts = attempts.filter(att => att.courseId === quranCourse.id);
  const hasPassedFinalQuiz = quranAttempts.some(att => att.passed);
  const earnedCertificate = certs.find(cert => cert.courseId === quranCourse.id);

  const completionPercent = Math.min(100, Math.round((completedLessons.length / quranLessons.length) * 100));

  const moduleDescriptions = [
    { num: 1, title: 'Introduction', subtitle: 'The Revelation historical contexts, compilation process, and Makki/Madani stylistic divisions.' },
    { num: 2, title: 'Translation Basics', subtitle: 'Understanding literal word-to-word meanings, frequent root patterns, and grammatical flow.' },
    { num: 3, title: 'Tafseer Classical Exposition', subtitle: 'Diving into historical Asbab al-Nuzul context, Surah Al-Asr, and classical legal reasoning.' },
    { num: 4, title: 'Ethical Code of Conduct', subtitle: 'Applying timeless values to management decision-making, finance transparency, and personal accountability.' },
    { num: 5, title: 'Practical Assessment', subtitle: 'Rigorous ethical assessment validating understanding and qualification for the Ethical Leader Badge.' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Decorative Quran Header Card with Islamic theology aesthetics, elegant gold highlights, and emerald shades */}
      <div className="bg-gradient-to-tr from-emerald-900 via-emerald-800 to-teal-900 rounded-[20px] p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-emerald-950/40">
        
        {/* Intricate Islamic Geometric Pattern overlay effect using styled SVG overlay */}
        <div className="absolute right-0 top-0 bottom-0 opacity-15 pointer-events-none translate-x-12 translate-y-[-12px]">
          <svg width="240" height="240" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-emerald-100">
            <path d="M50 0 L100 50 L50 100 L0 50 Z" stroke="currentColor" strokeWidth="2" strokeDasharray="1 1" />
            <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" />
            <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="1" />
            <path d="M0 0 L100 100" stroke="currentColor" strokeWidth="0.5" />
            <path d="M100 0 L0 100" stroke="currentColor" strokeWidth="0.5" />
          </svg>
        </div>
        
        <div className="relative z-10 space-y-3 text-left">
          <span className="bg-[#38B889]/20 text-emerald-300 text-xxs font-extrabold px-3 py-1 rounded-full border border-[#38B889]/35 uppercase tracking-widest font-poppins">
            Specialized theology Curriculum
          </span>
          <h2 className="text-2xl sm:text-4xl font-poppins font-black tracking-tight text-white">
            Fehm-ul-Quran (Understanding Quran)
          </h2>
          <p className="text-emerald-100 text-sm max-w-2xl leading-relaxed">
            A comprehensive curriculum specializing in word-for-word translation, linguistic Tafseer, ethical reasoning, and community leadership rules centered on classical commentaries including Surah Al-Asr.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/5 flex items-center gap-2">
              <BookMarked className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-semibold">5 Complete Modules</span>
            </div>
            <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/5 flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-semibold">Ethical Leadership Certification</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Double-Col: Progress, Course modules */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Progress Indicators bar */}
          <div className="bg-white p-6 rounded-[20px] border border-slate-200/70 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-left">
                <h4 className="font-poppins font-bold text-slate-800">My Study Progress</h4>
                <p className="text-xs text-slate-500">Completing videos and handouts updates your parameters</p>
              </div>
              <span className="text-base sm:text-lg font-poppins font-black text-accent-emerald">{completionPercent}% Complete</span>
            </div>
            
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#38B889] rounded-full transition-all duration-500" 
                style={{ width: `${completionPercent}%` }}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center pt-2">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-xxs font-bold uppercase block">Total Lessons</span>
                <span className="text-lg font-bold text-slate-700 font-mono">{quranLessons.length}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-xxs font-bold uppercase block">Completed</span>
                <span className="text-lg font-bold text-accent-emerald font-mono">{completedLessons.length}</span>
              </div>
              <div className="bg-emerald-50/20 p-3 rounded-xl border border-emerald-100/35">
                <span className="text-emerald-800/60 text-xxs font-bold uppercase block">Quiz Score</span>
                <span className="text-lg font-bold text-primary font-mono">
                  {quranAttempts.length > 0 ? `${Math.max(...quranAttempts.map(a => a.score))}%` : 'Pending'}
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-xxs font-bold uppercase block">Award Certificate</span>
                <span className="text-xs font-bold text-slate-700">{earnedCertificate ? 'Earned ✓' : 'Locked'}</span>
              </div>
            </div>
          </div>

          {/* Curriculum Module Map */}
          <div className="bg-white p-6 rounded-[20px] border border-slate-200/70 shadow-sm space-y-4 text-left">
            <h4 className="font-poppins font-bold text-slate-800">Course Syllabus Map</h4>
            
            <div className="space-y-4">
              {moduleDescriptions.map((mod) => {
                // Find matching course modules
                const mSeed = quranCourse.modules.find(m => m.id === `cq_m${mod.num}`);
                const isFinalQuizModule = mod.num === 5;
                
                return (
                  <div key={mod.num} className="border border-slate-100 rounded-2xl p-4 bg-slate-50/20 hover:bg-slate-50/50 transition flex flex-col sm:flex-row gap-4 justify-between items-start">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xxs font-bold bg-amber-50 text-amber-700 text-amber-800 border border-amber-200 rounded px-1.5 py-0.5 leading-none">
                          Module {mod.num}
                        </span>
                        <h5 className="font-bold text-slate-800">{mod.title}</h5>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{mod.subtitle}</p>
                    </div>

                    <div className="shrink-0 flex items-center justify-end sm:pt-1">
                      {isFinalQuizModule ? (
                        <button
                          onClick={() => {
                            const finalQuizLesson = mSeed?.lessons.find(l => l.type === 'quiz');
                            if (finalQuizLesson && finalQuizLesson.quiz) {
                              onLaunchQuiz(finalQuizLesson.quiz, quranCourse.id);
                            }
                          }}
                          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-1.5 px-4 rounded-xl text-xxs transition shadow-xs"
                        >
                          {hasPassedFinalQuiz ? 'Review Results' : 'Attempt Exam'}
                        </button>
                      ) : (
                        <button
                          onClick={() => onLaunchCourse(quranCourse)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-1.5 px-4 rounded-xl text-xxs transition shadow-xs flex items-center gap-1"
                        >
                          Start Lessons
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Sidebar: Books and Certificate claims */}
        <div className="space-y-6">
          
          {/* Certificate Showcase panel in Quran */}
          {earnedCertificate ? (
            <div className="border-[6px] border-amber-900 bg-amber-50/10 p-5 rounded-3xl text-center shadow-lg relative border-double">
              <Award className="h-10 w-10 text-amber-800 mx-auto mb-2" />
              <h4 className="font-serif font-extrabold text-sm text-amber-900 tracking-wider">ETHICAL LEADERSHIP CERTIFICATE</h4>
              <p className="text-xxs text-stone-500 leading-relaxed mt-2">
                Awarded strictly under registration code <span className="font-mono font-bold text-slate-800">{earnedCertificate.certificateCode}</span> to {earnedCertificate.userName} for verifying ethics in Quranic Studies.
              </p>
              <div className="mt-4 pt-3 border-t border-amber-900/10 flex justify-center text-[10px] text-amber-950 font-bold">
                ✓ Verified Registrar Registry
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-slate-50 to-amber-50/20 p-5 rounded-3xl border border-amber-100 text-center space-y-3">
              <Award className="h-12 w-12 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-700 text-sm">Certificate Locked</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Complete the study modules and pass the final ethical evaluation quiz with at least **70%** score to earn your authorized academic leaders document.
              </p>
            </div>
          )}

          {/* Inspirational quotes card */}
          <div className="bg-sky-50/30 p-5 rounded-3xl border border-sky-100/50 flex gap-3 text-sky-800">
            <Lightbulb className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-bold text-xs">Islamic Studies Focus</h5>
              <p className="italic text-xxs text-slate-600 leading-relaxed">
                "By Time! Indeed, humanity is in loss. Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience." - Surah Al-Asr (Verses 1-3)
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
