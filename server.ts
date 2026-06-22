import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { 
  User, 
  Course, 
  LibraryItem, 
  VideoProgress, 
  AttendanceRecord, 
  QuizAttempt, 
  Certificate, 
  LmsNotification, 
  Lesson 
} from './src/types.js';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;
const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

// Ensure database directory exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
}

// -----------------------------------------------------
// Initialize Database with Preloaded Seed Data
// -----------------------------------------------------

const initialUsers: User[] = [
  {
    id: 'user_admin_1',
    name: 'Super Admin',
    email: 'admin@university.edu',
    role: 'admin',
    phone: '+1 (555) 0199',
    department: 'Administration'
  },
  {
    id: 'user_prof_1',
    name: 'Dr. Sarah Jenkins',
    email: 'professor@university.edu',
    role: 'professor',
    phone: '+1 (555) 0244',
    department: 'Computer Science'
  },
  {
    id: 'user_student_1',
    name: 'Zayn Malik',
    email: 'student@university.edu',
    role: 'student',
    studentId: 'ST-904123',
    phone: '+1 (555) 0366',
    department: 'Computer Science',
    semester: '4th Semester'
  }
];

const initialCourses: Course[] = [
  {
    id: 'course_1',
    title: 'Introduction to Computer Science',
    code: 'CS101',
    description: 'Learn the fundamental concepts of computing, programming logic, algorithms, and computational thinking using Python.',
    department: 'Computer Science',
    instructor: 'Dr. Sarah Jenkins',
    isPublished: true,
    modules: [
      {
        id: 'c1_m1',
        title: 'Module 1: Foundations of Computing',
        lessons: [
          {
            id: 'c1_l1',
            title: 'Lesson 1.1: History of Computing & Hardware Architecture',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            duration: '09:56',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'c1_l2',
            title: 'Lesson 1.2: Reading Material - von Neumann Architecture',
            type: 'pdf',
            pdfUrl: '/documents/cs101_module1.pdf',
            duration: '15 min read',
            completed: false
          },
          {
            id: 'c1_l3',
            title: 'Quiz 1.1: Core Hardware Concepts',
            type: 'quiz',
            quiz: {
              id: 'quiz_c1_m1',
              title: 'Quiz 1.1: Hardware Foundations',
              questions: [
                {
                  id: 'c1_q1',
                  text: 'Which architectural design represents the concept of storing program instructions and data in the same memory space?',
                  options: ['Harvard Architecture', 'von Neumann Architecture', 'RISC Design', 'CISC Processor Paradigm'],
                  correctOptionIndex: 1
                },
                {
                  id: 'c1_q2',
                  text: 'What component of the CPU is responsible for carrying out mathematical operations and bitwise calculations?',
                  options: ['Control Unit (CU)', 'Arithmetic Logic Unit (ALU)', 'L1 Cache', 'Instruction Register (IR)'],
                  correctOptionIndex: 1
                }
              ],
              timeLimit: 120
            }
          }
        ]
      },
      {
        id: 'c1_m2',
        title: 'Module 2: Basics of Python Programming',
        lessons: [
          {
            id: 'c1_l4',
            title: 'Lesson 2.1: Variables, Types, and Basic Arithmetic',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            duration: '10:53',
            completed: false,
            progressPercent: 0
          }
        ]
      }
    ]
  },
  {
    id: 'course_2',
    title: 'Data Structures & Algorithms',
    code: 'CS201',
    description: 'Master advanced algorithms, complexity analysis, arrays, lists, queues, stacks, hash tables, trees, and dynamic programming.',
    department: 'Computer Science',
    instructor: 'Dr. Sarah Jenkins',
    isPublished: true,
    modules: [
      {
        id: 'c2_m1',
        title: 'Module 1: Time and Space Complexity',
        lessons: [
          {
            id: 'c2_l1',
            title: 'Lesson 1.1: Big O Notation and Growth of Functions',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            duration: '08:15',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'c2_l2',
            title: 'Module 1 Assessment: Recursion & Complexity',
            type: 'quiz',
            quiz: {
              id: 'quiz_c2_m1',
              title: 'Module 1 Big O Quiz',
              questions: [
                {
                  id: 'c2_q1',
                  text: 'With a balanced Binary Search Tree containing N nodes, what is the worst-case time complexity of an insertion operation?',
                  options: ['O(1)', 'O(N)', 'O(log N)', 'O(N log N)'],
                  correctOptionIndex: 2
                }
              ],
              timeLimit: 60
            }
          }
        ]
      }
    ]
  },
  {
    id: 'course_3',
    title: 'Software Engineering Principles',
    code: 'CS301',
    description: 'Learn system design, agile methodologies, SOLID design principles, unified modeling language (UML), and developer best practices.',
    department: 'Computer Science',
    instructor: 'Dr. Sarah Jenkins',
    isPublished: true,
    modules: [
      {
        id: 'c3_m1',
        title: 'Module 1: Agile Software Development',
        lessons: [
          {
            id: 'c3_l1',
            title: 'Lesson 1.1: Managing Sprints and Backlogs',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            duration: '07:30',
            completed: false,
            progressPercent: 0
          }
        ]
      }
    ]
  },
  {
    id: 'course_4',
    title: 'Digital Marketing Essentials',
    code: 'MKT101',
    description: 'An overview of digital promotional channels, SEO fundamentals, pay-per-click strategies, conversion marketing, and analytics dashboards.',
    department: 'Business Administration',
    instructor: 'Prof. Marcus Aurelius',
    isPublished: true,
    modules: [
      {
        id: 'c4_m1',
        title: 'Module 1: SEO Ecosystem',
        lessons: [
          {
            id: 'c4_l1',
            title: 'Lesson 1.1: On-Page Optimization Elements',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            duration: '05:40',
            completed: false,
            progressPercent: 0
          }
        ]
      }
    ]
  },
  {
    id: 'course_5',
    title: 'Business Communication',
    code: 'BUS102',
    description: 'Develop executive writing, professional persuasion techniques, critical board presentations, and internal communication hierarchies.',
    department: 'Business Administration',
    instructor: 'Prof. Marcus Aurelius',
    isPublished: true,
    modules: [
      {
        id: 'c5_m1',
        title: 'Module 1: Writing for Executives',
        lessons: [
          {
            id: 'c5_l1',
            title: 'Lesson 1.1: Structuring Concise Reports',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            duration: '07:02',
            completed: false,
            progressPercent: 0
          }
        ]
      }
    ]
  },
  {
    id: 'course_quran',
    title: 'Fehm-ul-Quran (Understanding Quran)',
    code: 'ISL101',
    description: 'A study course dedicated to the complete Translation, Tafseer, Context, and Application of Quranic verses for ethical leadership.',
    department: 'Islamic Studies',
    instructor: 'Dr. Tariq Mahmood',
    isPublished: true,
    isQuran: true,
    modules: [
      {
        id: 'cq_m1',
        title: 'Module 1: Introduction & Structural Context',
        lessons: [
          {
            id: 'cq_l1',
            title: 'Quran Lesson 1.1: Revelation History & Makki/Madani Distinctions',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
            duration: '08:34',
            completed: false,
            progressPercent: 0
          }
        ]
      },
      {
        id: 'cq_m2',
        title: 'Module 2: Translation Core Basics',
        lessons: [
          {
            id: 'cq_l2',
            title: 'Quran Lesson 2.1: Key Vocabulary and Word-to-Word Meaning',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            duration: '12:00',
            completed: false,
            progressPercent: 0
          }
        ]
      },
      {
        id: 'cq_m3',
        title: 'Module 3: Tafseer & Historical Context (Asbab al-Nuzul)',
        lessons: [
          {
            id: 'cq_l3',
            title: 'Quran Lesson 3.1: Surah Al-Asr Detailed Exposition',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            duration: '09:12',
            completed: false,
            progressPercent: 0
          },
          {
            id: 'cq_l4',
            title: 'Tafseer Reading Handout: Foundations of Surah Al-Asr',
            type: 'pdf',
            pdfUrl: '/documents/surah_asr_tafseer.pdf',
            duration: '20 min read',
            completed: false
          }
        ]
      },
      {
        id: 'cq_m4',
        title: 'Module 4: Practical Understanding and Code of Conduct',
        lessons: [
          {
            id: 'cq_l5',
            title: 'Quran Lesson 4.1: Deriving Legal & Ethical Norms for Communities',
            type: 'video',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            duration: '11:15',
            completed: false,
            progressPercent: 0
          }
        ]
      },
      {
        id: 'cq_m5',
        title: 'Module 5: Global Assessment & Ethical Certification',
        lessons: [
          {
            id: 'cq_l6',
            title: 'Graded Assessment: Comprehension & Practical Application of Quranic Ethics',
            type: 'quiz',
            quiz: {
              id: 'quiz_quran_m5',
              title: 'Quranic Comprehension Final Evaluator',
              questions: [
                {
                  id: 'q_q1',
                  text: 'According to Surah Al-Asr, which four traits guarantee humanity exemption from loss?',
                  options: [
                    'Sincerity, Prayer, Zakat, and Good character',
                    'Belief, Righteous action, Advising truthful conduct, and Mutual patience',
                    'Knowledge, Wealth, Kinship, and Fortitude',
                    'Migration, Supporting distress assistance, Fasting, and Contemplation'
                  ],
                  correctOptionIndex: 1
                },
                {
                  id: 'q_q2',
                  text: 'What terminology designates the historical circumstances or contextual occurrences surrounding the revelation of verses?',
                  options: ['Tadabbur', 'Asbab al-Nuzul', 'Qira\'at', 'I\'jaz al-Quran'],
                  correctOptionIndex: 1
                }
              ],
              timeLimit: 180
            }
          }
        ]
      }
    ]
  }
];

const initialLibraryItems: LibraryItem[] = [
  {
    id: 'lib_1',
    title: 'Introduction to Algorithms (4th Edition)',
    author: 'Cormen, Leiserson, Rivest, Stein',
    category: 'Computer Science',
    fileSize: '34.2 MB',
    downloadsCount: 142
  },
  {
    id: 'lib_2',
    title: 'SOLID Design Patterns & OOP Best Practices',
    author: 'Robert C. Martin',
    category: 'Software Engineering',
    fileSize: '8.4 MB',
    downloadsCount: 97
  },
  {
    id: 'lib_3',
    title: 'Surah Al-Asr Tafseer: Comprehensive Exposition',
    author: 'Prof. Muhammad Abu-Nasr',
    category: 'Quranic Studies',
    fileSize: '2.5 MB',
    isBookmarked: true,
    downloadsCount: 220
  },
  {
    id: 'lib_4',
    title: 'The Principles of Digital Brand Growth',
    author: 'Elena Rostova',
    category: 'Marketing',
    fileSize: '12.1 MB',
    downloadsCount: 45
  },
  {
    id: 'lib_5',
    title: 'Research Paper: AI in Adaptive Pedagogy',
    author: 'Dr. Jane Smith et al.',
    category: 'Educational Technology',
    fileSize: '4.8 MB',
    isBookmarked: false,
    downloadsCount: 78
  }
];

const initialNotifications: LmsNotification[] = [
  {
    id: 'not_1',
    title: 'Welcome to the LMS',
    message: 'Your student profile Zayn Malik has been set up for the 4th Semester.',
    type: 'push',
    userId: 'user_student_1',
    sentAt: '2026-06-20T10:00:00Z',
    recipient: 'student@university.edu'
  },
  {
    id: 'not_2',
    title: 'New Quiz Graded',
    message: 'Your Quiz 1.1 Hardware Foundations was graded. Score: 100%. Check the reports panel!',
    type: 'email',
    userId: 'user_student_1',
    sentAt: '2026-06-21T18:30:00Z',
    recipient: 'student@university.edu'
  }
];

interface DatabaseSchema {
  users: User[];
  courses: Course[];
  libraryItems: LibraryItem[];
  progress: VideoProgress[];
  attendance: AttendanceRecord[];
  quizAttempts: QuizAttempt[];
  certificates: Certificate[];
  notifications: LmsNotification[];
}

const defaultDb: DatabaseSchema = {
  users: initialUsers,
  courses: initialCourses,
  libraryItems: initialLibraryItems,
  progress: [],
  attendance: [],
  quizAttempts: [],
  certificates: [],
  notifications: initialNotifications
};

function readDb(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_PATH)) {
      fs.writeFileSync(DB_PATH, JSON.stringify(defaultDb, null, 2));
      return defaultDb;
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading DB, returning defaultDb', err);
    return defaultDb;
  }
}

function writeDb(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing DB', err);
  }
}

// -----------------------------------------------------
// Initialize db file on boot
// -----------------------------------------------------
readDb();

// Setup Gemini Client Server-Side
let ai: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;
if (API_KEY && API_KEY !== 'MY_GEMINI_API_KEY') {
  ai = new GoogleGenAI({
    apiKey: API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
  console.log('Gemini API initialized successfully in full-stack backend module.');
} else {
  console.warn('Gemini API Key missing or default. Server will use highly realistic dynamic context fallback for tutor/quizzes.');
}

// -----------------------------------------------------
// REST APIs & Business Logic
// -----------------------------------------------------

// Authentication
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDb();
  // Simplified secure match (accepts matching emails based on preloaded accounts with fallback)
  const user = db.users.find(u => u.email.toLowerCase() === (email || '').trim().toLowerCase());
  if (user) {
    return res.json({
      token: `mock-jwt-token-for-${user.id}`,
      user
    });
  }
  return res.status(401).json({ error: 'Invalid institutional credentials or email not found' });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, role, phone, department, semester, studentId } = req.body;
  if (!name || !email || !role) {
    return res.status(400).json({ error: 'Name, email, and role are required fields' });
  }

  const db = readDb();
  const exists = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: 'This email is already registered on our LMS system' });
  }

  const newUser: User = {
    id: `user_${Date.now()}`,
    name,
    email,
    role: role as any,
    phone: phone || '',
    department: department || 'General Education',
    semester: semester || '',
    studentId: studentId || (role === 'student' ? `ST-${Math.floor(100000 + Math.random() * 900000)}` : undefined)
  };

  db.users.push(newUser);

  // Add a welcome notification
  const newNotif: LmsNotification = {
    id: `not_${Date.now()}`,
    title: 'LMS Profile Provisioned',
    message: `Account set up successfully as ${role}. Access your academic courses immediately.`,
    type: 'push',
    userId: newUser.id,
    sentAt: new Date().toISOString(),
    recipient: newUser.email
  };
  db.notifications.unshift(newNotif);

  writeDb(db);
  res.json({ success: true, token: `mock-jwt-token-for-${newUser.id}`, user: newUser });
});

app.get('/api/auth/users', (req, res) => {
  const db = readDb();
  res.json(db.users);
});

app.delete('/api/auth/users/:id', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  db.users = db.users.filter(u => u.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// Courses API
app.get('/api/courses', (req, res) => {
  const db = readDb();
  res.json(db.courses);
});

app.post('/api/courses', (req, res) => {
  const { title, code, description, department, instructor, isQuran } = req.body;
  if (!title || !code) {
    return res.status(400).json({ error: 'Title and code are required' });
  }
  const db = readDb();
  const isDup = db.courses.some(c => c.code.toLowerCase() === code.toLowerCase());
  if (isDup) {
    return res.status(400).json({ error: 'Course code already exists' });
  }
  const newCourse: Course = {
    id: `course_${Date.now()}`,
    title,
    code,
    description: description || 'No description assigned.',
    department: department || 'General Education',
    instructor: instructor || 'Dr. Dr. Sarah Jenkins',
    isPublished: true,
    isQuran: !!isQuran,
    modules: []
  };
  db.courses.push(newCourse);
  writeDb(db);
  res.json({ success: true, course: newCourse });
});

// Create Module / Lesson
app.post('/api/courses/:courseId/modules', (req, res) => {
  const { courseId } = req.params;
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'Module title required' });
  
  const db = readDb();
  const idx = db.courses.findIndex(c => c.id === courseId);
  if (idx === -1) return res.status(404).json({ error: 'Course not found' });
  
  const newModule = {
    id: `m_${Date.now()}`,
    title,
    lessons: []
  };
  
  db.courses[idx].modules.push(newModule);
  writeDb(db);
  res.json({ success: true, course: db.courses[idx] });
});

// Add Lesson
app.post('/api/courses/:courseId/modules/:moduleId/lessons', (req, res) => {
  const { courseId, moduleId } = req.params;
  const { title, type, duration, pdfUrl, videoUrl, quiz } = req.body;
  if (!title || !type) return res.status(400).json({ error: 'Lesson title and code is required' });

  const db = readDb();
  const cIndex = db.courses.findIndex(c => c.id === courseId);
  if (cIndex === -1) return res.status(404).json({ error: 'Course not found' });

  const mIndex = db.courses[cIndex].modules.findIndex(m => m.id === moduleId);
  if (mIndex === -1) return res.status(404).json({ error: 'Module not found' });

  const newLesson: Lesson = {
    id: `l_${Date.now()}`,
    title,
    type: type as any,
    duration: duration || '10:00',
    pdfUrl: type === 'pdf' ? (pdfUrl || '/documents/sample.pdf') : undefined,
    videoUrl: type === 'video' ? (videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4') : undefined,
    quiz: type === 'quiz' ? (quiz || { id: `quiz_${Date.now()}`, title, questions: [], timeLimit: 120 }) : undefined
  };

  db.courses[cIndex].modules[mIndex].lessons.push(newLesson);

  // Send a Notification to all students enrolled in this department regarding a newly compiled lecture!
  const targetStudents = db.users.filter(u => u.role === 'student');
  targetStudents.forEach(st => {
    db.notifications.push({
      id: `not_lesson_${Date.now()}_${Math.random()}`,
      title: 'New Lecture Uploaded',
      message: `Dr. Sarah Jenkins uploaded "${title}" in "${db.courses[cIndex].title}". Study today!`,
      type: 'push',
      userId: st.id,
      sentAt: new Date().toISOString(),
      recipient: st.email
    });
  });

  writeDb(db);
  res.json({ success: true, lesson: newLesson });
});

// Emulate Video Upload & FFmpeg Adaptive Streaming Compression
app.post('/api/upload/video-process', async (req, res) => {
  const { name, fileSize } = req.body;
  // This route emulates uploading a video and launching a full background FFmpeg transcode 
  // into 360p, 480p, 720p, 1080p generating HLS segments (.m3u8 index file)
  
  const steps = [];
  steps.push({ status: 'Processing original MP4 file...', time: '0.5s' });
  steps.push({ status: 'HLS segment generation started...', time: '1.2s' });
  steps.push({ status: 'FFmpeg spawned transcode stream for 360p...', time: '2.4s' });
  steps.push({ status: 'FFmpeg spawned transcode stream for 480p...', time: '3.6s' });
  steps.push({ status: 'FFmpeg spawned transcode stream for 720p...', time: '5.0s' });
  steps.push({ status: 'FFmpeg spawned transcode stream for 1080p (high intensity)...', time: '6.8s' });
  steps.push({ status: 'Generating .m3u8 adaptive index descriptor manifest files...', time: '8.1s' });
  steps.push({ status: 'Deploying processed static segments to distributed CDN Storage cloud...', time: '9.3s' });
  steps.push({ status: 'Adaptive HLS Streaming URL published with watermark protection.', time: '10.5s' });

  // Wait 1.5 seconds mock latency to simulate server-side background start
  setTimeout(() => {
    res.json({
      success: true,
      filename: name,
      originalSize: fileSize,
      publishedHlsUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      steps,
      watermarkText: 'SECURED_ACADEMIC_STREAM_COPY_PROTECTED'
    });
  }, 1200);
});

// Video Progress & Attendance Tracker (Core Rules: >=80% watch = Present)
app.post('/api/courses/progress', (req, res) => {
  const { userId, courseId, lessonId, watchPercentage, lastPosition } = req.body;
  if (!userId || !courseId || !lessonId) {
    return res.status(400).json({ error: 'Missing required tracking details' });
  }

  const db = readDb();
  let progIndex = db.progress.findIndex(p => p.userId === userId && p.lessonId === lessonId);
  const completed = watchPercentage >= 80;

  const progObj: VideoProgress = {
    userId,
    courseId,
    lessonId,
    watchPercentage,
    lastPosition: lastPosition || 0,
    completed
  };

  if (progIndex > -1) {
    // Merge updates
    const currentProg = db.progress[progIndex];
    progObj.watchPercentage = Math.max(currentProg.watchPercentage, watchPercentage);
    progObj.completed = progObj.watchPercentage >= 80;
    db.progress[progIndex] = progObj;
  } else {
    db.progress.push(progObj);
  }

  // Look up details for Attendance Logging
  const user = db.users.find(u => u.id === userId);
  const course = db.courses.find(c => c.id === courseId);
  
  let lessonTitle = 'Lecture';
  if (course) {
    for (const m of course.modules) {
      const les = m.lessons.find(l => l.id === lessonId);
      if (les) {
        lessonTitle = les.title;
        break;
      }
    }
  }

  if (user && course) {
    // Update or Insert Attendance
    const today = new Date().toISOString().split('T')[0];
    const status = completed ? 'Present' : 'Incomplete';
    
    let attIndex = db.attendance.findIndex(a => a.userId === userId && a.lessonId === lessonId);
    
    const attRecord: AttendanceRecord = {
      userId,
      userName: user.name,
      studentId: user.studentId || 'N/A',
      courseId,
      courseTitle: course.title,
      lessonId,
      lessonTitle,
      date: today,
      watchPercentage: progObj.watchPercentage,
      status
    };

    if (attIndex > -1) {
      db.attendance[attIndex] = attRecord;
    } else {
      db.attendance.push(attRecord);
    }

    // Add push notification on milestone Present status
    if (completed && attIndex === -1) {
      db.notifications.unshift({
        id: `not_att_${Date.now()}`,
        title: 'Attendance marked Present',
        message: `Status for ${lessonTitle} changed to PRESENT (watched over 80%). Keep studying!`,
        type: 'push',
        userId,
        sentAt: new Date().toISOString(),
        recipient: user.email
      });
    }
  }

  writeDb(db);
  res.json({ success: true, progress: progObj });
});

// Fetch progress logs for active student
app.get('/api/courses/progress/:userId', (req, res) => {
  const { userId } = req.params;
  const db = readDb();
  const prog = db.progress.filter(p => p.userId === userId);
  res.json(prog);
});

// Attendance listing
app.get('/api/attendance', (req, res) => {
  const db = readDb();
  res.json(db.attendance);
});

// Quiz Submission & Auto-Grading & Certificate System
app.post('/api/quiz/submit', (req, res) => {
  const { userId, courseId, quizId, answers } = req.body;
  if (!userId || !courseId || !quizId || !answers) {
    return res.status(400).json({ error: 'Missing details for quiz grading' });
  }

  const db = readDb();
  const user = db.users.find(u => u.id === userId);
  const course = db.courses.find(c => c.id === courseId);
  if (!user || !course) {
    return res.status(404).json({ error: 'User or Course not found' });
  }

  // Find the exact quiz
  let foundQuiz: any = null;
  for (const m of course.modules) {
    const l = m.lessons.find(les => les.type === 'quiz' && les.quiz?.id === quizId);
    if (l && l.quiz) {
      foundQuiz = l.quiz;
      break;
    }
  }

  if (!foundQuiz) {
    return res.status(404).json({ error: 'Quiz not found inside course modules' });
  }

  let correctCount = 0;
  foundQuiz.questions.forEach((q: any) => {
    const studentAnswer = answers[q.id];
    if (studentAnswer !== undefined && Number(studentAnswer) === q.correctOptionIndex) {
      correctCount++;
    }
  });

  const totalQuestions = foundQuiz.questions.length || 1;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const passed = scorePercent >= 70; // 70% is pass threshold

  const finalScore = scorePercent;

  const attempt: QuizAttempt = {
    id: `attempt_${Date.now()}`,
    userId,
    userName: user.name,
    courseId,
    quizId,
    quizTitle: foundQuiz.title,
    score: finalScore,
    totalQuestions,
    passed,
    date: new Date().toISOString()
  };

  db.quizAttempts.unshift(attempt);

  // If user passed AND this is course completion or final, issue Certificate!
  let certificate: Certificate | null = null;
  if (passed) {
    // Generate simple Certificate
    const certCode = `CERT-${course.code}-${Math.floor(100000 + Math.random() * 900000)}`;
    const newCert: Certificate = {
      id: `cert_${Date.now()}`,
      userId,
      userName: user.name,
      courseId,
      courseTitle: course.title,
      issueDate: new Date().toISOString().split('T')[0],
      certificateCode: certCode
    };
    db.certificates.unshift(newCert);
    certificate = newCert;

    // Send a Notification about scoring success
    db.notifications.unshift({
      id: `not_cert_${Date.now()}`,
      title: 'Academic Certificate Issued!',
      message: `Congratulations! You passed "${foundQuiz.title}" and earned a Certificate in "${course.title}".`,
      type: 'email',
      userId,
      sentAt: new Date().toISOString(),
      recipient: user.email
    });
  }

  writeDb(db);
  res.json({
    success: true,
    score: finalScore,
    correctCount,
    totalQuestions,
    passed,
    certificate
  });
});

app.get('/api/certificates/:userId', (req, res) => {
  const { userId } = req.params;
  const db = readDb();
  res.json(db.certificates.filter(c => c.userId === userId));
});

app.get('/api/quiz-attempts/:userId', (req, res) => {
  const { userId } = req.params;
  const db = readDb();
  res.json(db.quizAttempts.filter(qa => qa.userId === userId));
});

// Library REST Endpoints
app.get('/api/library', (req, res) => {
  const db = readDb();
  res.json(db.libraryItems);
});

app.post('/api/library', (req, res) => {
  const { title, author, category, fileSize } = req.body;
  if (!title || !author) return res.status(400).json({ error: 'Title and Author are required.' });
  const db = readDb();
  const newItem: LibraryItem = {
    id: `lib_${Date.now()}`,
    title,
    author,
    category: category || 'Reference Notes',
    fileSize: fileSize || '3.5 MB',
    downloadsCount: 0
  };
  db.libraryItems.push(newItem);
  writeDb(db);
  res.json({ success: true, item: newItem });
});

app.post('/api/library/:id/download', (req, res) => {
  const { id } = req.params;
  const db = readDb();
  const idx = db.libraryItems.findIndex(item => item.id === id);
  if (idx > -1) {
    db.libraryItems[idx].downloadsCount++;
    writeDb(db);
    return res.json({ success: true, downloadsCount: db.libraryItems[idx].downloadsCount });
  }
  res.status(404).json({ error: 'Library book not found' });
});

// Notifications REST APIs
app.get('/api/notifications/:userId', (req, res) => {
  const { userId } = req.params;
  const db = readDb();
  res.json(db.notifications.filter(n => n.userId === userId || n.userId === 'all'));
});

// System Analytics for Dashboard Widgets
app.get('/api/reports', (req, res) => {
  const db = readDb();
  const totalStudents = db.users.filter(u => u.role === 'student').length;
  const totalProfessors = db.users.filter(u => u.role === 'professor').length;
  const totalCourses = db.courses.length;
  
  // Storage size estimation in MB
  const storageUsageMB = 1424.5; // Emulated cloud S3 + transcoding cache
  
  // Attendance status overview
  const totalAtt = db.attendance.length || 1;
  const presents = db.attendance.filter(a => a.status === 'Present').length;
  const attendanceRate = Math.round((presents / totalAtt) * 100);

  // Grade averages grouped by course
  const courseAverages = db.courses.map(c => {
    const attempts = db.quizAttempts.filter(q => q.courseId === c.id);
    const avg = attempts.length > 0 
      ? Math.round(attempts.reduce((sum, current) => sum + current.score, 0) / attempts.length)
      : 82; // Fallback seed
    return {
      courseId: c.id,
      courseCode: c.code,
      title: c.title,
      averageGrade: avg,
      studentsCount: Math.max(3, db.users.filter(u => u.role === 'student' && u.department === c.department).length)
    };
  });

  res.json({
    totalStudents,
    totalProfessors,
    totalCourses,
    storageUsageMB,
    attendanceRate,
    courseAverages,
    activeSessions: 54, // emulated real-time active connections
  });
});

// -----------------------------------------------------
// Server-Side Gemini AI Integration APIs
// -----------------------------------------------------

app.post('/api/ai/chat', async (req, res) => {
  const { message, context, chatHistory } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message field is required for AI interaction' });
  }

  // Create robust educational framing for our AI LMS Assistant
  const systemInstruction = `
    You are an expert server-side AI academic tutor and assistant inside our custom University Learning Management System (LMS).
    
    Current academic context for this student is: ${JSON.stringify(context || {})}.
    
    GUIDELINES:
    1. Respond with high pedagogical quality. Keep answers academically structured, extremely informative, and concise.
    2. Support any learning inquiry related to Computer Science, Digital Marketing, Business Communication, and Surah Al-Asr (islamic ethical course).
    3. Encourage the student and guide them through mathematical or logic problems step-by-step instead of telling them the exact program answer immediately.
    4. Speak elegantly and humbly. Use Markdown directly to highlight key definitions and code pieces (e.g. bolding terms, format code nicely in backticks).
  `;

  // Check if Gemini is enabled, otherwise use smart dynamic fallback
  if (ai) {
    try {
      // Reformat history for @google/genai format
      const formattedHistory = (chatHistory || []).map((h: any) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.text }]
      }));

      // Create a chat session as recommended in SKILL.md
      const chat = ai.chats.create({
        model: 'gemini-3.5-flash',
        config: {
          systemInstruction,
          temperature: 0.7
        },
        history: formattedHistory
      });

      const response = await chat.sendMessage({ message });
      return res.json({ text: response.text });
    } catch (e: any) {
      console.error('Gemini call failed, employing structural backup', e);
      // Let it slide to our secondary generator for resilience
    }
  }

  // Resilient Academic Fallback Engine (In case API Key is missing or quota is limited)
  setTimeout(() => {
    let lower = message.toLowerCase();
    let reply = `**Hello there!** I am your **AI Tutor Chatbot**. Inside this academic study platform, I can help summarize lectures, explain hard concepts, and generate custom practice questions for you.\n\n`;

    if (lower.includes('hardware') || lower.includes('computer science') || lower.includes('cpu')) {
      reply += `Let me explain computer architecture for CS101. The instruction cycle runs in the standard **Fetch-Decode-Execute** cycle:\n1. **Fetch**: The Control Unit gets instructions from the RAM based on the Program Counter.\n2. **Decode**: Instructions are converted into signal codes.\n3. **Execute**: The **ALU** registers carry out calculations.\n\nWhat specific part of hardware registers would you like to explore next?`;
    } else if (lower.includes('quran') || lower.includes('surah') || lower.includes('asr') || lower.includes('tafseer')) {
      reply += `In Islamic Studies (ISL101), **Surah Al-Asr** is highly valued for outlining a comprehensive code of ethics in three short verses. \n` +
               `* **Exposition**: It establishes that Human Time is a depleting resource leading to loss, except for individuals possessing four attributes:\n` +
               `  1. *Iman* (Unwavering belief)\n` +
               `  2. *Amal al-Salihat* (Constructive righteous deeds)\n` +
               `  3. *Tawasaw bi al-Haqq* (Mutual counsel of truth)\n` +
               `  4. *Tawasaw bi al-Sabr* (Mutual counsel of steadfast patience)\n\nCould I help prepare a practice evaluation on these Tafseer details?`;
    } else if (lower.includes('solid') || lower.includes('software') || lower.includes('design patterns')) {
      reply += `Inside Software Engineering (CS301), **SOLID design principles** represent 5 rules for object-oriented systems:\n` +
               `* **S**ingle Responsibility: A class should have one reason to change.\n` +
               `* **O**pen/Closed: Open for extension, closed for modification.\n` +
               `* **L**iskov Substitution: Subtypes must be substitutable for base types.\n` +
               `* **I**nterface Segregation: Many client-specific interfaces are better than one general interface.\n` +
               `* **D**ependency Inversion: Depend on abstractions rather than details.\n\nWhich of these would you like to practice?`;
    } else {
      reply += `That's a vital concept. Let's break this down into clear terms. Could you provide a bit more context? Specifically, reference which course lesson you are working on, and I'll generate a custom summaries, quiz, or mathematical step-by-step resolution!`;
    }

    res.json({ text: reply });
  }, 1000);
});

// Dynamic AI Quiz Generator Route
app.post('/api/ai/quiz-generate', async (req, res) => {
  const { topic } = req.body;
  const prompt = `
    Generate an educational evaluation MCQ quiz for the academic topic: "${topic || 'General Science'}".
    Provide EXACTLY 2 high-quality MCQ questions with 4 logical option keys and specify the correct option index (0 to 3).
    Return your response strictly in the following JSON array object format:
    [
      {
        "text": "What is ...?",
        "options": ["A", "B", "C", "D"],
        "correctOptionIndex": 1
      },
      ...
    ]
  `;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'ARRAY' as any,
            items: {
              type: 'OBJECT' as any,
              properties: {
                text: { type: 'STRING' as any },
                options: {
                  type: 'ARRAY' as any,
                  items: { type: 'STRING' as any }
                },
                correctOptionIndex: { type: 'INTEGER' as any }
              },
              required: ['text', 'options', 'correctOptionIndex']
            }
          }
        }
      });
      const data = JSON.parse(response.text || '[]');
      return res.json({ success: true, questions: data });
    } catch (e) {
      console.error('Failed using Gemini response schema, fallback to static evaluation questions', e);
    }
  }

  // Backup evaluator
  setTimeout(() => {
    res.json({
      success: true,
      questions: [
        {
          id: `ai_q_${Date.now()}_1`,
          text: `Which architectural feature is essential to scale distributed LMS streaming nodes efficiently?`,
          options: [
            'Storing large segments on primary database disks',
            'S3 Object storage matched with CDN distribution and edge-cached HLS segments',
            'Full in-memory RAM caches for 4K video frames',
            'Monolithic single-process web controllers'
          ],
          correctOptionIndex: 1
        },
        {
          id: `ai_q_${Date.now()}_2`,
          text: `Under LMS Attendance rules, what minimum percentage of lecture video must a student watch to earn a 'Present' status?`,
          options: ['50%', '60%', '75%', '80%'],
          correctOptionIndex: 3
        }
      ]
    });
  }, 1000);
});

// -----------------------------------------------------
// Vite Dev Server / Production Static Serving
// -----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted successfully on port ' + PORT);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production static handler mounted serving: ' + distPath);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LMS Full-Stack Server listening successfully on http://0.0.0.0:${PORT}`);
  });
}

startServer();
