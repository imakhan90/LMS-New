import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, 
  FileText, 
  Award, 
  Calendar, 
  User, 
  Check, 
  Bot, 
  Send, 
  Loader2, 
  Sparkles, 
  Clock, 
  Briefcase, 
  GraduationCap, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Search, 
  Filter, 
  Upload, 
  X, 
  ChevronRight, 
  Compass, 
  Star,
  Info,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserType } from '../types';

interface VisaAdmissionsProps {
  user: UserType;
}

interface CountryGuide {
  id: string;
  name: string;
  flag: string;
  bgImage: string;
  successRate: number;
  intakes: string;
  livingCost: string;
  workRights: string;
  ieltsScore: string;
  popularUniversities: string[];
  visaType: string;
}

interface Scholarship {
  id: string;
  title: string;
  provider: string;
  amount: string;
  deadline: string;
  country: string;
  level: 'Undergraduate' | 'Postgraduate' | 'PhD' | 'All';
  description: string;
  badgeImage: string;
}

interface Advisor {
  id: string;
  name: string;
  role: string;
  rating: number;
  reviews: number;
  specialty: string;
  photoUrl: string;
  languages: string[];
}

interface DocumentItem {
  id: string;
  name: string;
  requiredFor: string;
  status: 'Pending' | 'Drafted' | 'Verified';
  description: string;
  fileName?: string;
}

export default function VisaAdmissions({ user }: VisaAdmissionsProps) {
  const [subTab, setSubTab] = useState<'countries' | 'scholarships' | 'checklist' | 'chat' | 'booking'>('countries');
  const [selectedCountry, setSelectedCountry] = useState<CountryGuide | null>(null);
  
  // Search and filter states
  const [countrySearch, setCountrySearch] = useState('');
  const [scholarshipLevel, setScholarshipLevel] = useState<string>('All');
  const [scholarshipSearch, setScholarshipSearch] = useState('');
  
  // Chat state
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string }>>([
    {
      role: 'assistant',
      text: `Welcome to the **VisaLaga & Global Admissions AI Counseling Suite**! 🌐✈️\n\nI am your dedicated immigration advisor. I can answer complex questions about:\n* **Country-specific Student Visa Requirements** (USA, UK, Canada, Europe)\n* **IELTS, TOEFL, or GRE/GMAT** thresholds and profile preparation\n* **Statement of Purpose (SOP)** & Letter of Recommendation structures\n* **Financial Proof & Sponsor Documents** validation guidelines\n\nWhat country or scholarship would you like to ask about?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Advisory Booking state
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTimeSlot, setBookingTimeSlot] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [bookingStatus, setBookingStatus] = useState({ type: '', text: '' });
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [myBookings, setMyBookings] = useState<any[]>([]);

  // Document Upload State
  const [documents, setDocuments] = useState<DocumentItem[]>([
    { id: 'doc_1', name: 'Valid International Passport', requiredFor: 'All Countries', status: 'Verified', description: 'Must have at least 12 months validity remaining from intake date.', fileName: 'passport_scan_zayn.pdf' },
    { id: 'doc_2', name: 'University Acceptance Letter (CAS / I-20)', requiredFor: 'Host University', status: 'Pending', description: 'Official confirmation letter of enrollment with intake duration specified.' },
    { id: 'doc_3', name: 'Financial Proof (Bank Statement)', requiredFor: 'Immigration Department', status: 'Drafted', description: 'Bank statements showing sufficient funds covering tuition fees + annual living cost.', fileName: 'sc_bank_proof_temp.pdf' },
    { id: 'doc_4', name: 'English Proficiency (IELTS / PTE / TOEFL)', requiredFor: 'University & Visa Office', status: 'Verified', description: 'Academic certificate with overall band score meeting immigration criteria.', fileName: 'ielts_report_signed.pdf' },
    { id: 'doc_5', name: 'Academic Transcripts & Certificates', requiredFor: 'Admission Office', status: 'Verified', description: 'Attested certificates of your previous highest degree / diplomas.', fileName: 'transcript_undergrad_cs.pdf' },
    { id: 'doc_6', name: 'Statement of Purpose (SOP)', requiredFor: 'Admission & Visa', status: 'Drafted', description: 'Personal narrative explaining academic background, goals, and reasons to study abroad.', fileName: 'sop_draft_v2.docx' },
  ]);
  const [uploadingDocId, setUploadingDocId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Country database with authentic royalty-free Pexels URLs
  const countryGuides: CountryGuide[] = [
    {
      id: 'uk',
      name: 'United Kingdom',
      flag: '🇬🇧',
      bgImage: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=800', // London Big Ben
      successRate: 95,
      intakes: 'September (Major) & January (Minor)',
      livingCost: '£1,023 - £1,334 / month (Higher inside London)',
      workRights: '20 hours/week during term; 2-year Graduate Route post-study work visa',
      ieltsScore: '6.5 overall (No band below 6.0)',
      visaType: 'Student Visa (formerly Tier 4)',
      popularUniversities: ['University of Oxford', 'Imperial College London', 'University of Manchester', 'University of Edinburgh']
    },
    {
      id: 'usa',
      name: 'United States',
      flag: '🇺🇸',
      bgImage: 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=800', // New York Skyline
      successRate: 88,
      intakes: 'August (Fall Major) & January (Spring)',
      livingCost: '$1,200 - $1,800 / month (Depending on state)',
      workRights: 'On-campus only up to 20 hours/week; 1 to 3 years STEM OPT post-study',
      ieltsScore: '6.5 - 7.0 overall (or 85-100 TOEFL)',
      visaType: 'F-1 Academic Student Visa',
      popularUniversities: ['MIT', 'Stanford University', 'Harvard University', 'University of California (Berkeley)']
    },
    {
      id: 'canada',
      name: 'Canada',
      flag: '🇨🇦',
      bgImage: 'https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?auto=compress&cs=tinysrgb&w=800', // Toronto Tower / Autumn Canada
      successRate: 91,
      intakes: 'September (Fall Major), January (Winter) & May (Spring)',
      livingCost: 'C$1,250 - C$1,700 / month',
      workRights: 'Up to 20 hours/week off-campus; PGWPP (Post-Grad Work Permit) up to 3 years',
      ieltsScore: '6.5 overall (No band below 6.0 for SDS)',
      visaType: 'Study Permit',
      popularUniversities: ['University of Toronto', 'McGill University', 'University of British Columbia', 'University of Waterloo']
    },
    {
      id: 'australia',
      name: 'Australia',
      flag: '🇦🇺',
      bgImage: 'https://images.pexels.com/photos/219005/pexels-photo-219005.jpeg?auto=compress&cs=tinysrgb&w=800', // Sydney Opera House
      successRate: 89,
      intakes: 'February (Major intake) & July',
      livingCost: 'A$1,600 - A$2,200 / month',
      workRights: 'Up to 48 hours per fortnight; 2 to 4 years Temporary Graduate Visa (subclass 485)',
      ieltsScore: '6.0 - 6.5 overall',
      visaType: 'Student Visa (Subclass 500)',
      popularUniversities: ['University of Melbourne', 'University of Sydney', 'Australian National University', 'UNSW Sydney']
    },
    {
      id: 'germany',
      name: 'Germany',
      flag: '🇩🇪',
      bgImage: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=800', // Berlin / Neuschwanstein
      successRate: 94,
      intakes: 'October (Winter Semester Major) & April (Summer Semester)',
      livingCost: '€934 - €1,100 / month (Block account required: €11,208/year)',
      workRights: '140 full days or 280 half days per year; 18-month job seeker visa post-study',
      ieltsScore: '6.0 - 6.5 overall (German A2/B1 recommended but English programs exist)',
      visaType: 'National Visa (D Visa)',
      popularUniversities: ['Technical University of Munich', 'LMU Munich', 'Heidelberg University', 'Humboldt University of Berlin']
    }
  ];

  // Scholarship board database
  const scholarshipBoard: Scholarship[] = [
    {
      id: 'sch_1',
      title: 'Chevening Scholarships',
      provider: 'UK Government (FCDO)',
      amount: '100% tuition fee + £1,200/mo allowance + return flights',
      deadline: 'November 05, 2026',
      country: 'United Kingdom',
      level: 'Postgraduate',
      description: 'Fully funded global scholarship awarded to outstanding professionals with leadership qualities to study a 1-year master’s degree.',
      badgeImage: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=400' // Graduation cap symbol
    },
    {
      id: 'sch_2',
      title: 'Fulbright Foreign Student Program',
      provider: 'US Department of State',
      amount: 'Full tuition + living stipend + medical insurance + airfare',
      deadline: 'October 15, 2026',
      country: 'United States',
      level: 'Postgraduate',
      description: 'Enables young professionals and students from diverse countries to study, conduct research, and teach at US universities.',
      badgeImage: 'https://images.pexels.com/photos/7092613/pexels-photo-7092613.jpeg?auto=compress&cs=tinysrgb&w=400' // Holding degree
    },
    {
      id: 'sch_3',
      title: 'DAAD Scholarship EPOS',
      provider: 'German Academic Exchange Service',
      amount: '€934 - €1,200/mo + health coverage + travel grant + tuition waivers',
      deadline: 'December 10, 2026',
      country: 'Germany',
      level: 'All',
      description: 'Offers foreign graduates from development countries the chance to take postgraduate degrees in sustainable development fields.',
      badgeImage: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=400' // Campus group
    },
    {
      id: 'sch_4',
      title: 'Erasmus Mundus Joint Masters',
      provider: 'European Union Commission',
      amount: 'Fully covered tuition + €1,400/mo stipend + travel installation budget',
      deadline: 'February 15, 2027',
      country: 'Germany', // Multi-country, EU
      level: 'Postgraduate',
      description: 'Prestigious, integrated study programmes in multiple European countries, with degree joint certificates issued.',
      badgeImage: 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=400' // Diverse study
    },
    {
      id: 'sch_5',
      title: 'Vanier Canada Graduate Scholarships',
      provider: 'Government of Canada',
      amount: 'C$50,000 annually for up to 3 years',
      deadline: 'October 30, 2026',
      country: 'Canada',
      level: 'PhD',
      description: 'Awarded to highly qualified doctoral candidates demonstrating academic excellence, research potential, and leadership.',
      badgeImage: 'https://images.pexels.com/photos/3184317/pexels-photo-3184317.jpeg?auto=compress&cs=tinysrgb&w=400' // Scientific collaboration vibe
    }
  ];

  // Advisors database with professional Pexels faces
  const advisors: Advisor[] = [
    {
      id: 'adv_1',
      name: 'Sir Imran Ahmed',
      role: 'Chief Admissions Consultant & Advisor',
      rating: 4.9,
      reviews: 248,
      specialty: 'UK & Canada SDS Visas, SOP Writing',
      photoUrl: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400', // Professional man headshot
      languages: ['English', 'Bengali', 'Hindi']
    },
    {
      id: 'adv_2',
      name: 'Isabella Torres',
      role: 'Senior Academic Placement Advisor',
      rating: 4.8,
      reviews: 195,
      specialty: 'US Ivy League Admissions & F-1 Mock Interviews',
      photoUrl: 'https://images.pexels.com/photos/3738995/pexels-photo-3738995.jpeg?auto=compress&cs=tinysrgb&w=400', // Professional woman headshot
      languages: ['English', 'Spanish']
    },
    {
      id: 'adv_3',
      name: 'Dr. Sarah Jenkins',
      role: 'European Admissions Counsel Member',
      rating: 4.9,
      reviews: 132,
      specialty: 'Germany Block Account setup & Erasmus Mundus',
      photoUrl: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400', // Academic professional woman
      languages: ['English', 'German', 'French']
    }
  ];

  // Fetch my bookings from server on mount
  const fetchMyBookings = () => {
    fetch('/api/visa-bookings')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMyBookings(data.filter((b: any) => b.studentId === user.id));
        }
      })
      .catch(err => console.error('Error fetching visa bookings:', err));
  };

  useEffect(() => {
    fetchMyBookings();
  }, [user.id]);

  // Handle Advisor Booking Submissions
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdvisor || !bookingDate || !bookingTimeSlot) {
      setBookingStatus({ type: 'error', text: 'Please fill in date and select an hour slot.' });
      return;
    }

    setIsSubmittingBooking(true);
    setBookingStatus({ type: '', text: '' });

    fetch('/api/visa-bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentId: user.id,
        studentName: user.name,
        studentEmail: user.email,
        advisorId: selectedAdvisor.id,
        advisorName: selectedAdvisor.name,
        date: bookingDate,
        timeSlot: bookingTimeSlot,
        notes: bookingNotes
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Booking failed');
        return res.json();
      })
      .then(() => {
        setBookingStatus({ type: 'success', text: `Successful! Session booked with ${selectedAdvisor.name}.` });
        setBookingDate('');
        setBookingTimeSlot('');
        setBookingNotes('');
        setSelectedAdvisor(null);
        fetchMyBookings();
      })
      .catch(err => {
        console.error(err);
        setBookingStatus({ type: 'error', text: 'Error scheduling session. Slot might be occupied.' });
      })
      .finally(() => {
        setIsSubmittingBooking(false);
      });
  };

  const handleCancelBooking = (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this consultation booking?')) return;
    
    fetch(`/api/visa-bookings/${bookingId}`, {
      method: 'DELETE'
    })
      .then(() => {
        fetchMyBookings();
      })
      .catch(err => console.error(err));
  };

  // Scroll to bottom of chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, chatLoading]);

  // Handle visa consult chat with Gemini/Fallback
  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput;
    const userMessageTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, { role: 'user', text: userText, time: userMessageTime }]);
    setChatInput('');
    setChatLoading(true);

    fetch('/api/ai/visa-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userText,
        context: {
          userName: user.name,
          role: user.role,
          department: user.department || 'Computer Science'
        },
        chatHistory: chatMessages.map(m => ({ role: m.role, text: m.text }))
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('API communication error');
        return res.json();
      })
      .then(data => {
        const aiMessageTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setChatMessages(prev => [...prev, { role: 'assistant', text: data.text, time: aiMessageTime }]);
      })
      .catch(err => {
        console.error(err);
        // Resilient local fallback advisor answer
        setTimeout(() => {
          const lower = userText.toLowerCase();
          let reply = `Based on current VisaLaga guidelines, let's analyze that:\n\n`;
          if (lower.includes('uk') || lower.includes('united kingdom') || lower.includes('cas')) {
            reply += `For the **UK Student Visa (formerly Tier 4)**:\n` +
                     `1. **CAS Statement**: You need a Confirmation of Acceptance for Studies from an approved UK university.\n` +
                     `2. **Financial Proof**: Under current UKVI rules, you must show tuition fee balance + £1,334 per month (for up to 9 months) if in London, or £1,023 per month if studying outside London. Funds must sit in an approved bank for exactly 28 consecutive days.\n` +
                     `3. **IELTS Requirement**: Generally a 6.5 band score with no section below 6.0.\n\nWould you like me to connect you to **Sir Imran Ahmed** to review your UK university profile?`;
          } else if (lower.includes('german') || lower.includes('germany') || lower.includes('block')) {
            reply += `To study in **Germany**:\n` +
                     `1. **Block Account (Sperrkonto)**: For 2026 entry, you must deposit exactly **€11,208** in an approved German escrow account (like Fintiba or Coracle) to prove living funds for your first 12 months. This releases €934/month.\n` +
                     `2. **Tuition Fees**: Public German universities are 100% free of tuition, but charge a small semester contribution of around €150-€350 for administrative services.\n` +
                     `3. **Visa Process**: Apply early at the VFS Global or German Embassy, as appointments can take up to 3 months to secure!\n\nWould you like details on the DAAD scholarships?`;
          } else if (lower.includes('ielts') || lower.includes('toefl') || lower.includes('proficiency')) {
            reply += `**English Language Thresholds**:\n` +
                     `* **Canada (SDS stream)**: Requires a strict minimum of **6.5 IELTS Academic** with no single sub-score below 6.0.\n` +
                     `* **US Universities**: Usually require 6.5 to 7.0 for Ivy-tier, or 80-100 on the internet-based TOEFL.\n` +
                     `* **Australia**: Accepts IELTS 6.0 to 6.5 or equivalent PTE scores.\n\nI recommend uploading your scorecard in the **Immigration Document Checklist** tab to verify immigration compatibility instantly.`;
          } else if (lower.includes('scholarship') || lower.includes('fully funded') || lower.includes('free')) {
            reply += `Several fully funded scholarship schemes are open for study abroad candidates:\n` +
                     `* **UK**: Chevening (applications close November), Commonwealth Scholarships.\n` +
                     `* **USA**: Fulbright Program (funding covers master's degrees, flights, and medical support).\n` +
                     `* **Europe**: Erasmus Mundus Joint Masters (study across multiple European campuses with €1,400 monthly stipends).\n\nBrowse active deadlines directly under our **Scholarships Directory** tab!`;
          } else {
            reply += `That's an important global admissions query. Generally, you need to prepare **three core modules** before applying:\n` +
                     `1. **Academic Portfolio**: Certified transcripts, CV, and letter of recommendation.\n` +
                     `2. **Language Scores**: IELTS, PTE Academic, or TOEFL results.\n` +
                     `3. **Financial Capability Proof**: Bank statement sitting for 28 days or Block escrow account setup.\n\nCould you specify which country (e.g. UK, Germany, Canada) or intake you are targeting?`;
          }
          const aiMessageTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setChatMessages(prev => [...prev, { role: 'assistant', text: reply, time: aiMessageTime }]);
        }, 1000);
      })
      .finally(() => {
        setChatLoading(false);
      });
  };

  // Trigger file selection for document upload
  const handleUploadClick = (docId: string) => {
    setUploadingDocId(docId);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle simulated document upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadingDocId) {
      setDocuments(prev => prev.map(doc => {
        if (doc.id === uploadingDocId) {
          return {
            ...doc,
            status: 'Drafted',
            fileName: file.name
          };
        }
        return doc;
      }));
      
      // Simulate advisor verification after 3 seconds
      const targetId = uploadingDocId;
      setTimeout(() => {
        setDocuments(currentDocs => currentDocs.map(d => {
          if (d.id === targetId) {
            return { ...d, status: 'Verified' };
          }
          return d;
        }));
      }, 3500);

      setUploadingDocId(null);
    }
  };

  // Filter lists
  const filteredCountries = countryGuides.filter(c => 
    c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    c.visaType.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredScholarships = scholarshipBoard.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(scholarshipSearch.toLowerCase()) || 
                          s.provider.toLowerCase().includes(scholarshipSearch.toLowerCase()) ||
                          s.country.toLowerCase().includes(scholarshipSearch.toLowerCase());
    const matchesLevel = scholarshipLevel === 'All' || s.level === scholarshipLevel;
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Premium Hero Header Section */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-sky-950 rounded-[24px] p-6 sm:p-8 text-white shadow-lg border border-slate-800 relative overflow-hidden">
        {/* Dynamic decorative backdrop */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
          <Globe className="h-72 w-72 text-sky-400 transform translate-y-12 translate-x-12 animate-spin-slow" />
        </div>
        <div className="absolute top-0 right-1/3 w-80 h-80 bg-indigo-500/10 rounded-full filter blur-3xl" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono flex items-center gap-1">
              <Compass className="h-3 w-3 animate-pulse" />
              VisaLaga Consult Engine
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono">
              Intake Active: Fall 2026 / Spring 2027
            </span>
          </div>

          <div className="max-w-2xl space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Global Education & Study Visa Hub ✈️
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
              Welcome to your dedicated international academic cockpit. Track success rates, search fully funded scholarships, generate validated checklist logs, and coordinate live counseling with accredited migration advisors.
            </p>
          </div>

          {/* Sub-Tabs Selector */}
          <div className="pt-4 flex flex-wrap gap-2 border-t border-white/10">
            <button
              onClick={() => { setSubTab('countries'); setSelectedCountry(null); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                subTab === 'countries' 
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30' 
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              🌐 Target Countries
            </button>
            <button
              onClick={() => setSubTab('scholarships')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                subTab === 'scholarships' 
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30' 
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              🎓 Scholarships Board
            </button>
            <button
              onClick={() => setSubTab('checklist')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                subTab === 'checklist' 
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30' 
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              📋 Visa Checklist
            </button>
            <button
              onClick={() => setSubTab('chat')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                subTab === 'chat' 
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30' 
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              🤖 Advisor AI Counsel
            </button>
            <button
              onClick={() => setSubTab('booking')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                subTab === 'booking' 
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/30' 
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              👨‍💼 Book Consultant
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Sub-views Container */}
      <div className="bg-transparent">
        
        {/* TAB 1: TARGET COUNTRIES */}
        {subTab === 'countries' && (
          <div className="space-y-6">
            {!selectedCountry ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-white">Accredited Study Destinations</h3>
                    <p className="text-xs text-slate-400">Discover intakes, work rights, living costs, and average visa success metrics</p>
                  </div>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search country..."
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 pl-10 pr-4 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
                    />
                  </div>
                </div>

                {/* Country Cards Grid */}
                <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-6">
                  {filteredCountries.map((c) => (
                    <motion.div
                      key={c.id}
                      whileHover={{ y: -4 }}
                      className="bg-white dark:bg-[#0F172A] rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Premium Backdrop Image */}
                        <div className="aspect-video relative overflow-hidden bg-slate-100 dark:bg-slate-800">
                          <img 
                            src={c.bgImage} 
                            alt={c.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" 
                          />
                        </div>

                        {/* Info body */}
                        <div className="p-5 text-left">
                          <div className="space-y-3.5">
                            {/* Title line with flag & name */}
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-poppins font-black text-slate-800 dark:text-white flex items-center gap-2">
                                <span className="text-base leading-none">{c.flag}</span>
                                <span>{c.name}</span>
                              </h3>
                              <span className="bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-100/30 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                                {c.visaType.split(' ')[0]}
                              </span>
                            </div>

                            {/* Success rate & other details */}
                            <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                              <span className="text-sky-600 dark:text-sky-400 font-extrabold">{c.successRate}% approval rate</span>
                              <span>•</span>
                              <span>{c.visaType}</span>
                            </div>

                            <div className="space-y-2.5 pt-1">
                              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                                <Clock className="h-4 w-4 text-indigo-500 shrink-0" />
                                <span className="line-clamp-1"><strong>Intakes:</strong> {c.intakes}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                                <DollarSign className="h-4 w-4 text-emerald-500 shrink-0" />
                                <span className="line-clamp-1"><strong>Living Expenses:</strong> {c.livingCost.split('(')[0]}</span>
                              </div>
                              <div className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                                <Briefcase className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                <span className="line-clamp-1"><strong>Work Rights:</strong> {c.workRights}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 pt-0">
                        <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                          <button
                            onClick={() => {
                              setSelectedAdvisor(advisors[0]);
                              setSubTab('booking');
                            }}
                            className="bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xxs px-3 py-2 rounded-xl border border-slate-100 dark:border-slate-700 transition cursor-pointer"
                          >
                            Mock Interview
                          </button>
                          
                          <button
                            onClick={() => setSelectedCountry(c)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xxs font-black px-3.5 py-2 rounded-xl transition duration-200 flex items-center gap-1 shadow-sm cursor-pointer"
                          >
                            <span>Explore Guide</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              // Country Detailed Guide Screen
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden p-5 sm:p-6 space-y-6 text-left"
              >
                {/* Back button and title */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setSelectedCountry(null)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 rounded-xl cursor-pointer"
                  >
                    ← Back to country list
                  </button>
                  <span className="text-xxs font-bold text-slate-400 font-mono">Destination: {selectedCountry.name}</span>
                </div>

                {/* Country Header Details */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Hero card */}
                  <div className="lg:col-span-1 rounded-2xl overflow-hidden relative h-56 lg:h-auto border border-slate-100 dark:border-slate-800">
                    <img 
                      src={selectedCountry.bgImage} 
                      alt={selectedCountry.name} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <div className="text-3xl mb-1">{selectedCountry.flag}</div>
                      <h2 className="text-xl font-black">{selectedCountry.name}</h2>
                      <p className="text-xs text-sky-400 font-bold">{selectedCountry.visaType}</p>
                    </div>
                  </div>

                  {/* Middle and Right stats boards */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                        <span className="text-xxs font-bold text-slate-400 uppercase tracking-wide">Visa Success Index</span>
                        <h4 className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{selectedCountry.successRate}% approval</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Calculated based on active CAS & F-1 biometric approvals.</p>
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800/60">
                        <span className="text-xxs font-bold text-slate-400 uppercase tracking-wide">English Language Limit</span>
                        <h4 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">IELTS {selectedCountry.ieltsScore.split(' ')[0]}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">Equivalents: PTE Academic 58, TOEFL iBT 80.</p>
                      </div>
                    </div>

                    {/* Extended Details Grid */}
                    <div className="bg-slate-50 dark:bg-slate-800/20 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 divide-y divide-slate-200/50 dark:divide-slate-800">
                      <div className="py-2.5 flex justify-between text-xs gap-4">
                        <span className="font-bold text-slate-400 uppercase tracking-wide">Academic Intakes</span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold">{selectedCountry.intakes}</span>
                      </div>
                      <div className="py-2.5 flex justify-between text-xs gap-4">
                        <span className="font-bold text-slate-400 uppercase tracking-wide">Post-study Work Visa</span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold">{selectedCountry.workRights}</span>
                      </div>
                      <div className="py-2.5 flex justify-between text-xs gap-4">
                        <span className="font-bold text-slate-400 uppercase tracking-wide">Average Living Stipend</span>
                        <span className="text-slate-800 dark:text-slate-200 font-semibold">{selectedCountry.livingCost}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Popular Universities & Advisor Call to Action */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 text-indigo-500" />
                      Popular Target Admissions Universities
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedCountry.popularUniversities.map((uni, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 p-3 bg-indigo-50/30 dark:bg-slate-800/30 rounded-xl border border-indigo-100/30 dark:border-slate-800/50">
                          <span className="h-5 w-5 bg-indigo-600 text-white rounded-md flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{uni}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-tr from-indigo-50 to-sky-50 dark:from-slate-800/40 dark:to-indigo-950/20 p-5 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/40 flex flex-col justify-between">
                    <div className="space-y-2">
                      <h4 className="text-sm font-black text-slate-800 dark:text-white">Ready to formulate your application statement?</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Schedule a quick application review session with our senior advisor. We will compile your academic transcripts, drafts, and prepare mock questionnaires.
                      </p>
                    </div>
                    <div className="pt-4 flex flex-wrap gap-2.5">
                      <button
                        onClick={() => {
                          setChatInput(`I want to ask about student visa application requirements for ${selectedCountry.name}. What bank statements and sponsor files do I need?`);
                          setSubTab('chat');
                          setTimeout(() => handleSendChat(), 100);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition duration-250 cursor-pointer shadow-sm shadow-indigo-100/10"
                      >
                        Ask AI Counsel Desk
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAdvisor(advisors[0]);
                          setSubTab('booking');
                        }}
                        className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer"
                      >
                        Book Profile Review
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* TAB 2: SCHOLARSHIPS DIRECTORY */}
        {subTab === 'scholarships' && (
          <div className="space-y-6">
            {/* Filtering bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-800 dark:text-white">Global Scholarships Directory 🎓</h3>
                <p className="text-xs text-slate-400">Search and filter active fully funded international scholarship directories</p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                {/* Search input */}
                <div className="relative w-full sm:w-56">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search scholarship..."
                    value={scholarshipSearch}
                    onChange={(e) => setScholarshipSearch(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 pl-9 pr-4 py-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
                  />
                </div>

                {/* Level selector */}
                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700 w-full sm:w-auto justify-between">
                  {['All', 'Undergraduate', 'Postgraduate', 'PhD'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setScholarshipLevel(lvl)}
                      className={`px-3 py-1.5 rounded-lg text-xxs font-bold transition duration-200 cursor-pointer ${
                        scholarshipLevel === lvl 
                          ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-sky-400 shadow-xs' 
                          : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scholarships List Grid */}
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-6">
              {filteredScholarships.map((s) => (
                <div
                  key={s.id}
                  className="bg-white dark:bg-[#0F172A] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300 gap-4"
                >
                  <div className="space-y-3 text-left">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-indigo-100/30">
                            {s.level}
                          </span>
                          <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-emerald-100/30">
                            {s.country}
                          </span>
                        </div>
                        <h4 className="text-sm font-black text-slate-800 dark:text-white mt-1.5">{s.title}</h4>
                        <p className="text-xxs text-slate-400 font-bold">{s.provider}</p>
                      </div>
                      
                      {/* Photo Thumbnail */}
                      <div className="aspect-square h-14 w-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-100 dark:border-slate-800 shrink-0">
                        <img src={s.badgeImage} alt={s.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {s.description}
                    </p>

                    {/* Financial details */}
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                      <strong>Coverage Amount:</strong> <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{s.amount}</span>
                    </div>
                  </div>

                  <div className="pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Calendar className="h-3.5 w-3.5 text-rose-500" />
                      <span className="text-[10px] font-bold">Deadline: <strong className="text-slate-700 dark:text-slate-200">{s.deadline}</strong></span>
                    </div>

                    <button
                      onClick={() => {
                        setChatInput(`I want to apply for the fully funded ${s.title}. What are the prerequisite eligibility marks and documentation checklists for this scholarship?`);
                        setSubTab('chat');
                        setTimeout(() => handleSendChat(), 100);
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xxs px-3.5 py-2 rounded-xl transition duration-200 cursor-pointer shadow-sm"
                    >
                      Check Eligibility AI
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: IMMIGRATION CHECKLIST VALIDATOR */}
        {subTab === 'checklist' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-6 text-left">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-extrabold text-slate-800 dark:text-white">Interactive Visa Document Checklist</h3>
                  <p className="text-xs text-slate-400">Mark draft statuses, upload PDF records, and track validation reviews</p>
                </div>
                
                {/* Visual completion progress */}
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/40 px-4 py-2 rounded-2xl border border-slate-100 dark:border-slate-800/60 shrink-0">
                  <span className="text-xs font-bold text-slate-500">Verified Rate:</span>
                  <div className="h-3.5 w-24 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
                    <div 
                      className="h-full bg-emerald-500 rounded-full" 
                      style={{ width: `${Math.round((documents.filter(d => d.status === 'Verified').length / documents.length) * 100)}%` }}
                    />
                  </div>
                  <strong className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold">
                    {documents.filter(d => d.status === 'Verified').length} / {documents.length} verified
                  </strong>
                </div>
              </div>

              {/* Hidden file input for simulated upload */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".pdf,.doc,.docx,.jpg,.png" 
              />

              {/* Checklist list */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {documents.map((doc) => (
                  <div key={doc.id} className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 first:pt-0 last:pb-0">
                    <div className="space-y-1.5 max-w-xl text-left">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-white flex items-center gap-2">
                          {doc.name}
                        </h4>
                        <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded font-mono">
                          {doc.requiredFor}
                        </span>
                        
                        {/* Status pill */}
                        <span className={`text-[8px] font-black px-1.5 py-0.2 rounded border ${
                          doc.status === 'Verified' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/40' 
                            : doc.status === 'Drafted'
                            ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-800/40'
                            : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-800/40 dark:text-slate-400 dark:border-slate-800'
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                      
                      <p className="text-xxs sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {doc.description}
                      </p>

                      {doc.fileName && (
                        <div className="inline-flex items-center gap-1 bg-sky-50 dark:bg-slate-800 px-2 py-1 rounded-lg text-[10px] text-sky-700 dark:text-sky-300 font-mono border border-sky-100/50 dark:border-slate-700">
                          <FileText className="h-3 w-3" />
                          <span>{doc.fileName}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Status toggle manually for simulation */}
                      <button
                        onClick={() => {
                          setDocuments(prev => prev.map(d => {
                            if (d.id === doc.id) {
                              const nextStatus = d.status === 'Pending' ? 'Drafted' : d.status === 'Drafted' ? 'Verified' : 'Pending';
                              return { ...d, status: nextStatus };
                            }
                            return d;
                          }));
                        }}
                        className="bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 text-[10px] font-bold px-2 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700 transition cursor-pointer"
                        title="Simulate Review Status Toggle"
                      >
                        Status Switch
                      </button>

                      {/* File Upload Trigger */}
                      <button
                        onClick={() => handleUploadClick(doc.id)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] px-3.5 py-1.5 rounded-lg transition duration-200 flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Upload className="h-3 w-3" />
                        <span>Upload File</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Warning box */}
              <div className="bg-amber-50/50 dark:bg-amber-950/15 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-amber-800 dark:text-amber-200 text-left">
                <Info className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                <div className="space-y-1">
                  <strong>Verification Notice (VisaLaga Compliance)</strong>
                  <p className="text-slate-600 dark:text-slate-400 text-xxs">
                    Verification is conducted securely based on real immigration parameters. To expedite approval cycles, make sure the financial statements have sit for 28 consecutive days in approved banking registries before scheduling biocertificate submissions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ADVISOR AI COUNSEL CHAT */}
        {subTab === 'chat' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm h-[540px] flex flex-col justify-between">
              
              {/* Header inside chat */}
              <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-left">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider font-mono">VisaLaga Advisory Agent</h4>
                    <p className="text-[10px] text-slate-400">Powered by Gemini-3.5-Flash (Consular Grounded)</p>
                  </div>
                </div>
                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" title="System Agent online" />
              </div>

              {/* Messages viewport */}
              <div 
                ref={chatScrollRef}
                className="flex-1 overflow-y-auto py-4 space-y-4 px-1 scroll-smooth"
              >
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xl rounded-2xl p-4 text-xs leading-relaxed text-left ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800'
                    }`}>
                      {/* Format text line breaks and bold markup manually since markdown package is picky */}
                      <p className="whitespace-pre-wrap">
                        {msg.text.split('\n').map((line, lIdx) => {
                          // Basic bullet point highlight
                          const isBullet = line.startsWith('* ');
                          const content = isBullet ? line.substring(2) : line;
                          
                          // Basic bold parser **text**
                          const parsedContent = content.split('**').map((chunk, cIdx) => {
                            if (cIdx % 2 === 1) {
                              return <strong key={cIdx} className={msg.role === 'user' ? 'text-amber-200' : 'text-indigo-600 dark:text-sky-400 font-extrabold'}>{chunk}</strong>;
                            }
                            return chunk;
                          });

                          return (
                            <span key={lIdx} className="block mt-1">
                              {isBullet ? '• ' : ''}
                              {parsedContent}
                            </span>
                          );
                        })}
                      </p>
                      <span className={`block text-[8px] mt-2 text-right ${msg.role === 'user' ? 'text-white/70' : 'text-slate-400'}`}>
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}
                
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
                      <span className="text-xs text-slate-400 font-medium">Immigration Counselor is formulating response...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendChat} className="flex gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <input
                  type="text"
                  placeholder="Ask about UK bank balance, block accounts, IELTS scores, Chevening eligibility..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={chatLoading}
                  className="flex-1 bg-slate-50 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white disabled:bg-slate-200 dark:disabled:bg-slate-850"
                />
                <button
                  type="submit"
                  disabled={chatLoading || !chatInput.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-850 text-white font-bold text-xs p-3.5 rounded-xl transition duration-200 shrink-0 cursor-pointer flex items-center justify-center shadow-sm"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: BOOK A MOCK INTERVIEW / ADVISOR CONSULTANT */}
        {subTab === 'booking' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              
              {/* Form to book session */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-sm font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider font-mono">Schedule Counseling</h3>
                
                <form onSubmit={handleConfirmBooking} className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-3xl shadow-sm text-left space-y-4">
                  
                  {/* Select Advisor */}
                  <div className="space-y-1">
                    <label className="text-xxs font-bold text-slate-400 uppercase">Selected Counselor</label>
                    <select
                      value={selectedAdvisor?.id || ''}
                      onChange={(e) => {
                        const matched = advisors.find(a => a.id === e.target.value);
                        if (matched) setSelectedAdvisor(matched);
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
                      required
                    >
                      <option value="">-- Select Counselor --</option>
                      {advisors.map(a => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.specialty.split(',')[0]})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Input */}
                  <div className="space-y-1">
                    <label className="text-xxs font-bold text-slate-400 uppercase">Consultation Date</label>
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
                      required
                    />
                  </div>

                  {/* Time slots */}
                  <div className="space-y-1">
                    <label className="text-xxs font-bold text-slate-400 uppercase">Available Hours Slot</label>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {['10:00 AM - 11:00 AM', '02:00 PM - 03:00 PM', '04:00 PM - 05:00 PM', '07:30 PM - 08:30 PM'].map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setBookingTimeSlot(time)}
                          className={`p-2.5 rounded-xl border text-xxs font-bold text-center transition cursor-pointer ${
                            bookingTimeSlot === time
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                              : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-1">
                    <label className="text-xxs font-bold text-slate-400 uppercase">What would you like to focus on?</label>
                    <textarea
                      rows={3}
                      placeholder="e.g. UK CAS profile assessment, F-1 visa mock interview questions, block account Sperrkonto setup."
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
                    />
                  </div>

                  {bookingStatus.text && (
                    <p className={`text-xxs font-semibold p-2.5 rounded-lg border ${
                      bookingStatus.type === 'success' 
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30' 
                        : 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-900/30'
                    }`}>
                      {bookingStatus.text}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingBooking}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-indigo-100/10"
                  >
                    {isSubmittingBooking ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Confirming appointment...</span>
                      </>
                    ) : (
                      <>
                        <Calendar className="h-4 w-4" />
                        <span>Schedule Professional Session</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* List of Advisors and scheduled sessions */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Advisor List */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider font-mono text-left">Accredited VisaLaga Counselors</h3>
                  
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-4">
                    {advisors.map((adv) => (
                      <div
                        key={adv.id}
                        className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left hover:shadow-xs transition-all duration-200"
                      >
                        <div className="flex gap-4 items-start sm:items-center">
                          {/* Face photo */}
                          <div className="aspect-square h-16 w-16 rounded-2xl overflow-hidden bg-slate-100 border border-slate-100 dark:border-slate-800 shrink-0">
                            <img src={adv.photoUrl} alt={adv.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-white">{adv.name}</h4>
                            <p className="text-[10px] text-indigo-600 dark:text-sky-400 font-bold">{adv.role}</p>
                            
                            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                              <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.2 rounded font-mono font-medium">{adv.specialty}</span>
                              <div className="flex items-center gap-0.5 text-amber-500 font-bold text-[10px]">
                                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500 shrink-0" />
                                <span>{adv.rating} ({adv.reviews} reviews)</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedAdvisor(adv);
                            setBookingStatus({ type: '', text: '' });
                          }}
                          className="bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/30 font-bold text-xxs px-4 py-2 rounded-xl transition cursor-pointer self-stretch sm:self-auto"
                        >
                          Choose Counselor
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Scheduled Bookings list */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider font-mono text-left">My Active Appointments</h3>
                  
                  <div className="border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 text-left bg-slate-50/20">
                    {myBookings.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-xs flex flex-col items-center justify-center gap-1.5">
                        <Clock className="h-6 w-6 text-slate-300 dark:text-slate-700" />
                        <p>No active visa counseling appointments booked yet.</p>
                      </div>
                    ) : (
                      myBookings.map((b) => (
                        <div key={b.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                          <div className="space-y-1 text-left">
                            <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 text-[9px] font-black px-2 py-0.5 rounded font-mono uppercase tracking-wide">
                              Active / Confirmed
                            </span>
                            <h5 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 mt-1">
                              Mock Interview Session with {b.advisorName}
                            </h5>
                            <p className="text-xxs text-slate-400 font-bold flex items-center gap-1.5 mt-0.5">
                              <Calendar className="h-3 w-3 text-indigo-500" />
                              <span>{new Date(b.date).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })} at {b.timeSlot}</span>
                            </p>
                            {b.notes && (
                              <p className="text-[11px] text-slate-500 italic mt-1.5 border-l-2 border-slate-200 dark:border-slate-700 pl-2">
                                " {b.notes} "
                              </p>
                            )}
                          </div>

                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            className="bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 text-xxs font-black px-3.5 py-1.5 rounded-xl transition cursor-pointer self-start sm:self-auto"
                          >
                            Cancel
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
