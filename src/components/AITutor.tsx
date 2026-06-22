import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Zap, 
  BookOpen, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  Loader2,
  Trash2
} from 'lucide-react';
import { User, Course, Question } from '../types';

interface AITutorProps {
  user: User;
  courses: Course[];
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

interface Message {
  role: 'student' | 'assistant';
  id: string;
  text: string;
  timestamp: string;
  customQuiz?: Question[];
}

export default function AITutor({ user, courses, initialPrompt, onClearInitialPrompt }: AITutorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      id: 'msg_welcome',
      text: `Hello, **${user.name}**! I am your institutional **Gemini AI Study Tutor**.\n\n` +
            `I can immediately help you:\n` +
            `* **Summarize** complex lecture videos or textbooks\n` +
            `* **Explain** software paradigms step-by-step\n` +
            `* **Generate** dynamically tailored multiple-choice evaluation quizzes\n\n` +
            `What academic topic would you like to explore today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Dynamic inline quiz attempts state (from AI Quiz Generator)
  const [activeQuizAnswers, setActiveQuizAnswers] = useState<Record<string, number>>({});
  const [activeQuizSubmitted, setActiveQuizSubmitted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Handle incoming interactive lecture prompt
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
      if (onClearInitialPrompt) {
        onClearInitialPrompt();
      }
    }
  }, [initialPrompt]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const studentMessageId = `msg_student_${Date.now()}`;
    const newStudentMsg: Message = {
      role: 'student',
      id: studentMessageId,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newStudentMsg]);
    setInputVal('');
    setLoading(true);

    // Call server-side API chat route
    fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: textToSend,
        context: {
          userName: user.name,
          department: user.department,
          semester: user.semester,
          role: user.role
        },
        chatHistory: messages.map(m => ({
          role: m.role,
          text: m.text
        }))
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('API communication error');
        return res.json();
      })
      .then(data => {
        const aiMsg: Message = {
          role: 'assistant',
          id: `msg_ai_${Date.now()}`,
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMsg]);
      })
      .catch((err) => {
        console.error('AI chat failed', err);
        const aiErrorMsg: Message = {
          role: 'assistant',
          id: `msg_ai_err_${Date.now()}`,
          text: `I apologize, but I am currently running into high operational load or my institutional connection is offline. Please review core handouts in the library tab while I re-authenticate!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiErrorMsg]);
      })
      .finally(() => setLoading(false));
  };

  const handleTriggerQuizGeneration = (topic: string) => {
    setLoading(true);
    const triggerText = `AI, generate a custom practice quiz on "${topic}".`;
    const studentMessageId = `msg_student_quiz_${Date.now()}`;

    setMessages(prev => [...prev, {
      role: 'student',
      id: studentMessageId,
      text: triggerText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);

    fetch('/api/ai/quiz-generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.questions && data.questions.length > 0) {
          const aiQuizMsg: Message = {
            role: 'assistant',
            id: `msg_quiz_${Date.now()}`,
            text: `Here is your dynamically generated practice quiz evaluation for **${topic}**. Click your chosen options below to solve the questions:`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            customQuiz: data.questions
          };
          setMessages(prev => [...prev, aiQuizMsg]);
        } else {
          throw new Error('Invalid format');
        }
      })
      .catch((err) => {
        console.error(err);
        setMessages(prev => [...prev, {
          role: 'assistant',
          id: `msg_quiz_err_${Date.now()}`,
          text: `I encountered an issue generating a dynamic quiz. Here's a quick practice quiz:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          customQuiz: [
            {
              id: 'fallback_1',
              text: 'Which transport protocol is preferred for reliable packet-delivery in LMS servers?',
              options: ['UDP Stream protocol', 'Transmission Control Protocol (TCP)', 'ICMP Ping', 'IGMP Multicast'],
              correctOptionIndex: 1
            }
          ]
        }]);
      })
      .finally(() => setLoading(false));
  };

  const parseMarkdown = (markdownText: string) => {
    // Elegant mini text converter for clean look
    const lines = markdownText.split('\n');
    return lines.map((line, i) => {
      let content = line;
      
      // Bullets
      const isBullet = line.trim().startsWith('* ') || line.trim().startsWith('- ');
      if (isBullet) {
        content = content.replace(/^[*-\s]\s+/, '• ');
      }

      // Bold text replacements
      const parts = [];
      const boldRegex = /\*\*(.*?)\*\*/g;
      let lastIdx = 0;
      let match;
      
      while ((match = boldRegex.exec(content)) !== null) {
        if (match.index > lastIdx) {
          parts.push(content.substring(lastIdx, match.index));
        }
        parts.push(<strong key={match.index} className="font-extrabold text-slate-800">{match[1]}</strong>);
        lastIdx = boldRegex.lastIndex;
      }
      
      if (lastIdx < content.length) {
        parts.push(content.substring(lastIdx));
      }

      return (
        <p key={i} className={`text-xs sm:text-sm text-slate-700 leading-relaxed ${isBullet ? 'pl-4' : 'mb-2'}`}>
          {parts.length > 0 ? parts : content}
        </p>
      );
    });
  };

  const handleSelectQuizOption = (qId: string, optIdx: number) => {
    setActiveQuizAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmitQuizItem = (qId: string) => {
    setActiveQuizSubmitted(prev => ({ ...prev, [qId]: true }));
  };

  const clearChatLogs = () => {
    setMessages([
      {
        role: 'assistant',
        id: 'msg_welcome',
        text: `Chat flushed. Ask me anything about computer hardware logic, software architecture, marketing, or Surah Al-Asr!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Left Side: Active Chat platform view */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
          
          {/* Active Companion Top Panel */}
          <div className="bg-sky-600 px-6 py-4 text-white flex items-center justify-between border-b border-sky-700 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl text-white">
                <Bot className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">Gemini AI Tutor System</h3>
                <p className="text-[10px] text-sky-100 font-medium">Undergraduate Pedagogy Agent Active</p>
              </div>
            </div>
            <button
              onClick={clearChatLogs}
              title="Clear academic log history"
              className="p-1.5 hover:bg-white/10 rounded-full transition text-sky-200 hover:text-white"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {/* Messages scrolling stack container */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
            {messages.map((msg) => {
              const isAI = msg.role === 'assistant';
              return (
                <div key={msg.id} className={`flex gap-3 max-w-xl ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
                  
                  {/* Companion indicator avatar */}
                  <div className={`p-2 rounded-xl h-9 w-9 shrink-0 flex items-center justify-center border font-bold text-xs ${
                    isAI 
                      ? 'bg-sky-50 text-sky-700 border-sky-100' 
                      : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                  }`}>
                    {isAI ? 'AI' : 'ME'}
                  </div>

                  {/* Bubble Cards body layout */}
                  <div className={`p-4 rounded-2xl space-y-3 shadow-xxs ${
                    isAI 
                      ? 'bg-white rounded-tl-none border border-slate-100' 
                      : 'bg-sky-500 rounded-tr-none text-white border-transparent'
                  }`}>
                    
                    {/* Text block */}
                    <div className="space-y-1">
                      {isAI ? parseMarkdown(msg.text) : <p className="text-xs sm:text-sm text-sky-50">{msg.text}</p>}
                    </div>

                    {/* Integrated custom Quiz cards elements */}
                    {isAI && msg.customQuiz && (
                      <div className="mt-4 border-t border-slate-100 pt-4 space-y-5">
                        {msg.customQuiz.map((q, qIndex) => {
                          const hasAns = activeQuizAnswers[q.id] !== undefined;
                          const hasSubmitted = activeQuizSubmitted[q.id];
                          const selectedIdx = activeQuizAnswers[q.id];
                          
                          return (
                            <div key={q.id || qIndex} className="bg-slate-50 p-4 border border-slate-200/80 rounded-xl space-y-3">
                              <p className="font-bold text-xs text-slate-800">{qIndex + 1}. {q.text}</p>
                              <div className="grid grid-cols-1 gap-1.5">
                                {q.options.map((opt, oIdx) => {
                                  const isSelected = selectedIdx === oIdx;
                                  
                                  let optColorStatus = 'bg-white hover:bg-slate-100/50 text-slate-700 border-slate-200';
                                  if (isSelected) {
                                    optColorStatus = 'bg-sky-50 text-sky-700 border-sky-500 font-extrabold';
                                  }
                                  
                                  if (hasSubmitted) {
                                    if (oIdx === q.correctOptionIndex) {
                                      optColorStatus = 'bg-emerald-50 text-emerald-700 border-emerald-600 font-extrabold';
                                    } else if (isSelected) {
                                      optColorStatus = 'bg-rose-50 text-rose-700 border-rose-300 line-through';
                                    }
                                  }

                                  return (
                                    <button
                                      key={oIdx}
                                      disabled={hasSubmitted}
                                      onClick={() => handleSelectQuizOption(q.id, oIdx)}
                                      className={`text-left p-2.5 rounded-lg text-xxs transition border ${optColorStatus}`}
                                    >
                                      {opt}
                                    </button>
                                  );
                                })}
                              </div>

                              {!hasSubmitted ? (
                                <button
                                  disabled={!hasAns}
                                  onClick={() => handleSubmitQuizItem(q.id)}
                                  className="bg-emerald-600 border border-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] uppercase px-3 py-1 rounded transition disabled:opacity-45"
                                >
                                  Submit Answer
                                </button>
                              ) : (
                                <div className="text-[10px] flex items-center gap-1.5 pt-1">
                                  {selectedIdx === q.correctOptionIndex ? (
                                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                                      <CheckCircle className="h-3.5 w-3.5" />
                                      Excellent! Correct Answer
                                    </span>
                                  ) : (
                                    <span className="text-rose-600 font-bold flex items-center gap-1">
                                      <AlertCircle className="h-3.5 w-3.5" />
                                      Incorrect. The correct index is choice number {q.correctOptionIndex + 1}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Timestamp log label */}
                    <span className="text-[9px] text-slate-400 font-medium block text-right pt-1">{msg.timestamp}</span>

                  </div>
                </div>
              );
            })}

            {/* Simulated Loader */}
            {loading && (
              <div className="flex gap-3 max-w-sm mr-auto">
                <div className="bg-sky-50 border border-sky-100 p-2 rounded-xl text-sky-700 h-9 w-9 flex items-center justify-center font-bold text-xs">
                  AI
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-xxs flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <Loader2 className="animate-spin h-4 w-4 text-sky-600" />
                  Gemini thinking...
                </div>
              </div>
            )}
          </div>

          {/* Form input field sender */}
          <div className="p-4 border-t border-slate-200/80 bg-white flex gap-2">
            <input
              type="text"
              placeholder="Ask a question..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputVal)}
              className="flex-1 px-4 py-2 bg-slate-50 text-xs sm:text-sm text-slate-800 rounded-xl focus:outline-none focus:bg-white border focus:border-sky-500 transition"
            />
            <button
              onClick={() => handleSendMessage(inputVal)}
              className="bg-sky-600 hover:bg-sky-500 text-white p-2.5 rounded-xl transition shadow-xs shrink-0"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </div>

        </div>

        {/* Right Side: Fast Quick Prompts suggestions sidebar */}
        <div className="w-full md:w-80 shrink-0 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-1.5 pb-2 border-b">
              <Sparkles className="h-4 w-4 text-sky-600" />
              Syllabus Quick Study Tasks
            </h4>

            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Evaluate Me (MCQs)</span>
              
              <button
                onClick={() => handleTriggerQuizGeneration('Computer Hardware Foundations')}
                className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-sky-200 hover:bg-sky-50/10 text-xs font-semibold flex items-start gap-2.5 transition"
              >
                <Zap className="h-4 w-4 text-amber-500 mt-0.5" />
                <span>Quiz on CS Hardware</span>
              </button>

              <button
                onClick={() => handleTriggerQuizGeneration('Surah Al-Asr Commentary')}
                className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/10 text-xs font-semibold flex items-start gap-2.5 transition"
              >
                <BookOpen className="h-4 w-4 text-emerald-500 mt-0.5" />
                <span>Quiz on Quran Ethics</span>
              </button>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Explain Difficult Topics</span>
              
              <button
                onClick={() => handleSendMessage('Explain the Fetch-Decode-Execute CPU hardware cycle simply')}
                className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 text-xs font-semibold block transition text-slate-600"
              >
                Explain CPU Clock Cycles
              </button>

              <button
                onClick={() => handleSendMessage('What are the key differences between Makki and Madani Surahs?')}
                className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 text-xs font-semibold block transition text-slate-600"
              >
                Compare Makki &amp; Madani
              </button>

              <button
                onClick={() => handleSendMessage('What does Interface Segregation mean inside SOLID guidelines?')}
                className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 text-xs font-semibold block transition text-slate-600"
              >
                Explain SOLID ISP rules
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
