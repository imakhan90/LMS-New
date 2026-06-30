import { getInitialCourses } from '../data/coursesData';
import { User, Course, LibraryItem, VideoProgress, AttendanceRecord, QuizAttempt, Certificate, LmsNotification, ChatMessage, OfficeHourSlot } from '../types';

// Let's create an in-browser database mock that persists to localStorage.
// This is used as an automatic fallback when the active backend Express server is not reachable
// (e.g. when deployed purely statically to Vercel, or in Safari/iOS iframe environment).

const DB_KEY = 'lms_in_browser_db';

interface MockDatabase {
  users: User[];
  courses: Course[];
  libraryItems: LibraryItem[];
  progress: VideoProgress[];
  attendance: AttendanceRecord[];
  quizAttempts: QuizAttempt[];
  certificates: Certificate[];
  notifications: LmsNotification[];
  chatMessages: ChatMessage[];
  officeHours: OfficeHourSlot[];
  visaBookings: any[];
}

// Default initial state matching the server's seed data
const getInitialDbState = (): MockDatabase => {
  const initialUsers: User[] = [
    {
      id: 'user_admin_1',
      name: 'Super Admin',
      email: 'admin@university.edu',
      role: 'admin',
      phone: '+1 (555) 0199',
      department: 'Administration',
      password: 'admin123'
    },
    {
      id: 'user_prof_1',
      name: 'Dr. Sarah Jenkins',
      email: 'professor@university.edu',
      role: 'professor',
      phone: '+1 (555) 0244',
      department: 'Computer Science',
      password: 'professor123'
    },
    {
      id: 'user_student_1',
      name: 'Zayn Malik',
      email: 'student@university.edu',
      role: 'student',
      studentId: 'ST-904123',
      phone: '+1 (555) 0366',
      department: 'Computer Science',
      semester: '4th Semester',
      password: 'student123',
      focusTime: 120
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
      title: 'Executive Communication & Barbara Minto Principles',
      author: 'Prof. Marcus Aurelius',
      category: 'Marketing',
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
      sentAt: new Date().toISOString(),
      recipient: 'student@university.edu',
      isRead: false
    },
    {
      id: 'not_2',
      title: 'New Quiz Graded',
      message: 'Your Quiz 1.1 Hardware Foundations was graded. Score: 100%. Check the reports panel!',
      type: 'email',
      userId: 'user_student_1',
      sentAt: new Date().toISOString(),
      recipient: 'student@university.edu',
      isRead: false
    }
  ];

  const initialChatMessages: ChatMessage[] = [
    {
      id: 'msg_1',
      courseId: 'course_1',
      senderId: 'user_student_1',
      senderName: 'Zayn Malik',
      senderRole: 'student',
      content: 'Hello Professor, I had a quick question regarding the Module 1 assignment. Should we implement the binary search algorithm recursively or iteratively?',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'msg_2',
      courseId: 'course_1',
      senderId: 'user_prof_1',
      senderName: 'Dr. Sarah Jenkins',
      senderRole: 'professor',
      content: 'Hi Zayn! Either implementation is acceptable, but I recommend recursive as it fits our functional paradigm better. Make sure to document your base cases and complexity bounds!',
      timestamp: new Date(Date.now() - 1800000).toISOString()
    }
  ];

  const initialOfficeHours: OfficeHourSlot[] = [
    {
      id: 'slot_1',
      courseId: 'course_1',
      professorId: 'user_prof_1',
      professorName: 'Dr. Sarah Jenkins',
      date: new Date().toISOString().split('T')[0],
      startTime: '10:00 AM',
      endTime: '10:30 AM',
      status: 'available'
    },
    {
      id: 'slot_2',
      courseId: 'course_1',
      professorId: 'user_prof_1',
      professorName: 'Dr. Sarah Jenkins',
      date: new Date().toISOString().split('T')[0],
      startTime: '11:00 AM',
      endTime: '11:30 AM',
      status: 'booked',
      studentId: 'user_student_1',
      studentName: 'Zayn Malik',
      studentEmail: 'student@university.edu',
      meetingNotes: 'Discussing AVL trees implementation'
    }
  ];

  return {
    users: initialUsers,
    courses: getInitialCourses(),
    libraryItems: initialLibraryItems,
    progress: [],
    attendance: [],
    quizAttempts: [
      {
        id: 'attempt_seed_1',
        userId: 'user_student_1',
        userName: 'Zayn Malik',
        courseId: 'course_1',
        quizId: 'quiz_c1_m1',
        quizTitle: 'Quiz 1.1: Hardware Foundations',
        score: 100,
        totalQuestions: 2,
        passed: true,
        date: new Date().toISOString().split('T')[0]
      }
    ],
    certificates: [],
    notifications: initialNotifications,
    chatMessages: initialChatMessages,
    officeHours: initialOfficeHours,
    visaBookings: []
  };
};

// Retrieve db from localStorage
const getMockDb = (): MockDatabase => {
  const dbStr = localStorage.getItem(DB_KEY);
  if (!dbStr) {
    const defaultDb = getInitialDbState();
    localStorage.setItem(DB_KEY, JSON.stringify(defaultDb));
    return defaultDb;
  }
  try {
    return JSON.parse(dbStr);
  } catch (e) {
    const defaultDb = getInitialDbState();
    localStorage.setItem(DB_KEY, JSON.stringify(defaultDb));
    return defaultDb;
  }
};

// Save back to localStorage
const saveMockDb = (db: MockDatabase) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

// Helper to construct a standard mock response
const jsonResponse = (data: any, status: number = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// Interceptor logic
const originalFetch = window.fetch;
let backendCheckResult: boolean | null = null;

// Probe to check if Express backend is running and healthy
async function isBackendUnreachable(): Promise<boolean> {
  if (backendCheckResult !== null) {
    return backendCheckResult;
  }
  try {
    const response = await originalFetch('/api/courses');
    const contentType = response.headers.get('content-type');
    // If we get an active JSON response, backend is healthy!
    if (response.ok && contentType && contentType.includes('application/json')) {
      backendCheckResult = false;
    } else {
      backendCheckResult = true;
    }
  } catch (err) {
    backendCheckResult = true;
  }
  console.log(`[LMS Gateway] Auto-detected environment: ${backendCheckResult ? 'OFFLINE (Activating In-Browser DB Fallback)' : 'ONLINE (Connecting to Express Server)'}`);
  return backendCheckResult;
}

// Override window.fetch with self-healing routing using a robust definition method
const customFetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const urlStr = typeof input === 'string' ? input : (input instanceof URL ? input.toString() : input.url);
  
  // Only intercept requests directed to our Express /api endpoints
  if (urlStr.startsWith('/api/')) {
    const unreachable = await isBackendUnreachable();
    if (unreachable) {
      return handleMockRequest(urlStr, init);
    }
  }
  
  // Normal routing to native originalFetch for active containers
  try {
    const response = await originalFetch(input, init);
    return response;
  } catch (err) {
    // Self-healing fallback if the call throws a network error at runtime
    if (urlStr.startsWith('/api/')) {
      console.warn(`[LMS Gateway] Connection failed. Initiating instant in-browser fallback for: ${urlStr}`);
      return handleMockRequest(urlStr, init);
    }
    throw err;
  }
};

// Attempt to overwrite via standard property definition to bypass getter-only constraints
try {
  Object.defineProperty(window, 'fetch', {
    value: customFetch,
    writable: true,
    configurable: true
  });
} catch (e) {
  console.warn('[LMS Gateway] Object.defineProperty on window.fetch failed, trying direct assignment:', e);
  try {
    window.fetch = customFetch;
  } catch (err2) {
    console.error('[LMS Gateway] Unable to intercept window.fetch directly:', err2);
  }
}

try {
  if (typeof globalThis !== 'undefined') {
    Object.defineProperty(globalThis, 'fetch', {
      value: customFetch,
      writable: true,
      configurable: true
    });
  }
} catch (e) {
  // Suppress secondary global fallback errors
}

// Simulated mock backend implementation
function handleMockRequest(url: string, init?: RequestInit): Response {
  const db = getMockDb();
  const method = init?.method?.toUpperCase() || 'GET';
  const bodyData = init?.body ? JSON.parse(init.body as string) : {};

  console.log(`[LMS In-Browser DB] ${method} -> ${url}`, bodyData);

  // 1. AUTH LOGIN
  if (url === '/api/auth/login' && method === 'POST') {
    const { email, password } = bodyData;
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return jsonResponse({ error: 'User account not found.' }, 404);
    }
    if (user.password !== password) {
      return jsonResponse({ error: 'Invalid security credentials.' }, 401);
    }
    return jsonResponse({
      token: `mock_jwt_token_${user.id}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId,
        facultyId: user.facultyId,
        employeeId: user.employeeId,
        designation: user.designation,
        phone: user.phone,
        department: user.department,
        semester: user.semester,
        focusTime: user.focusTime || 0
      }
    });
  }

  // 2. AUTH REGISTER
  if (url === '/api/auth/register' && method === 'POST') {
    const { email } = bodyData;
    const exists = db.users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return jsonResponse({ error: 'Email address already registered.' }, 400);
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: bodyData.name,
      email: bodyData.email,
      role: bodyData.role,
      studentId: bodyData.studentId,
      facultyId: bodyData.facultyId,
      employeeId: bodyData.employeeId,
      designation: bodyData.designation,
      phone: bodyData.phone,
      department: bodyData.department,
      semester: bodyData.semester,
      password: bodyData.password,
      focusTime: 0
    };

    db.users.push(newUser);
    saveMockDb(db);

    return jsonResponse({
      token: `mock_jwt_token_${newUser.id}`,
      user: newUser
    });
  }

  // 3. RETRIEVE ALL COURSES
  if (url === '/api/courses' && method === 'GET') {
    return jsonResponse(db.courses);
  }

  // 4. RETRIEVE ALL NOTIFICATIONS
  if (url === '/api/notifications' && method === 'GET') {
    return jsonResponse(db.notifications);
  }

  // 5. MARK NOTIFICATION AS READ
  const readNotificationMatch = url.match(/^\/api\/notifications\/(.+)\/read$/);
  if (readNotificationMatch && method === 'POST') {
    const notifId = readNotificationMatch[1];
    db.notifications = db.notifications.map(n => n.id === notifId ? { ...n, isRead: true } : n);
    saveMockDb(db);
    return jsonResponse({ success: true });
  }

  // 6. RETRIEVE DIGITAL LIBRARY
  if (url === '/api/library' && method === 'GET') {
    return jsonResponse(db.libraryItems);
  }

  // 7. DOWNLOAD DIGITAL LIBRARY ITEM
  const downloadLibraryMatch = url.match(/^\/api\/library\/(.+)\/download$/);
  if (downloadLibraryMatch && method === 'POST') {
    const itemId = downloadLibraryMatch[1];
    db.libraryItems = db.libraryItems.map(item => 
      item.id === itemId ? { ...item, downloadsCount: (item.downloadsCount || 0) + 1 } : item
    );
    saveMockDb(db);
    return jsonResponse({ success: true });
  }

  // 8. ADD DIGITAL LIBRARY ITEM
  if (url === '/api/library' && method === 'POST') {
    const newItem: LibraryItem = {
      id: `lib_${Date.now()}`,
      title: bodyData.title,
      author: bodyData.author,
      category: bodyData.category,
      fileSize: bodyData.fileSize || '1.2 MB',
      downloadsCount: 0,
      isBookmarked: false
    };
    db.libraryItems.push(newItem);
    saveMockDb(db);
    return jsonResponse(newItem);
  }

  // 9. RETRIEVE OFFICE HOURS
  if (url === '/api/office-hours' && method === 'GET') {
    return jsonResponse(db.officeHours);
  }

  // 10. CREATE OFFICE HOURS
  if (url === '/api/office-hours' && method === 'POST') {
    const newSlot: OfficeHourSlot = {
      id: `slot_${Date.now()}`,
      courseId: bodyData.courseId,
      professorId: bodyData.professorId || 'user_prof_1',
      professorName: bodyData.professorName || 'Dr. Sarah Jenkins',
      date: bodyData.date,
      startTime: bodyData.startTime,
      endTime: bodyData.endTime,
      status: 'available'
    };
    db.officeHours.push(newSlot);
    saveMockDb(db);
    return jsonResponse(newSlot);
  }

  // 11. BOOK OFFICE HOUR SLOT
  const bookSlotMatch = url.match(/^\/api\/office-hours\/(.+)\/book$/);
  if (bookSlotMatch && method === 'POST') {
    const slotId = bookSlotMatch[1];
    db.officeHours = db.officeHours.map(slot => {
      if (slot.id === slotId) {
        return {
          ...slot,
          status: 'booked',
          studentId: bodyData.studentId,
          studentName: bodyData.studentName,
          studentEmail: bodyData.studentEmail,
          meetingNotes: bodyData.meetingNotes
        };
      }
      return slot;
    });
    saveMockDb(db);
    return jsonResponse({ success: true });
  }

  // 12. CANCEL OFFICE HOUR SLOT
  const cancelSlotMatch = url.match(/^\/api\/office-hours\/(.+)\/cancel$/);
  if (cancelSlotMatch && method === 'POST') {
    const slotId = cancelSlotMatch[1];
    db.officeHours = db.officeHours.map(slot => {
      if (slot.id === slotId) {
        return {
          ...slot,
          status: 'available',
          studentId: undefined,
          studentName: undefined,
          studentEmail: undefined,
          meetingNotes: undefined
        };
      }
      return slot;
    });
    saveMockDb(db);
    return jsonResponse({ success: true });
  }

  // 13. DELETE OFFICE HOUR SLOT
  const deleteSlotMatch = url.match(/^\/api\/office-hours\/(.+)$/);
  if (deleteSlotMatch && method === 'DELETE') {
    const slotId = deleteSlotMatch[1];
    db.officeHours = db.officeHours.filter(s => s.id !== slotId);
    saveMockDb(db);
    return jsonResponse({ success: true });
  }

  // 14. GET CHAT MESSAGES
  const getChatMatch = url.match(/^\/api\/chat-messages\/(.+)$/);
  if (getChatMatch && method === 'GET') {
    const courseId = getChatMatch[1];
    const msgs = db.chatMessages.filter(m => m.courseId === courseId);
    return jsonResponse(msgs);
  }

  // 15. POST CHAT MESSAGE
  if (url === '/api/chat-messages' && method === 'POST') {
    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      courseId: bodyData.courseId,
      senderId: bodyData.senderId,
      senderName: bodyData.senderName,
      senderRole: bodyData.senderRole,
      content: bodyData.content,
      timestamp: new Date().toISOString()
    };
    db.chatMessages.push(newMsg);
    saveMockDb(db);
    return jsonResponse(newMsg);
  }

  // 16. RETRIEVE STUDENT PROGRESS
  const getProgressMatch = url.match(/^\/api\/courses\/progress\/(.+)$/);
  if (getProgressMatch && method === 'GET') {
    const userId = getProgressMatch[1];
    const userProg = db.progress.filter(p => p.userId === userId);
    return jsonResponse(userProg);
  }

  // 17. SAVE PROGRESS
  if (url === '/api/courses/progress' && method === 'POST') {
    const { userId, courseId, lessonId, watchPercentage, lastPosition, completed } = bodyData;
    const existingIdx = db.progress.findIndex(p => p.userId === userId && p.lessonId === lessonId);
    
    const progRecord: VideoProgress = {
      userId,
      courseId,
      lessonId,
      watchPercentage,
      lastPosition,
      completed
    };

    if (existingIdx >= 0) {
      db.progress[existingIdx] = progRecord;
    } else {
      db.progress.push(progRecord);
    }

    // Save Attendance dynamically if video is marked completed or highly watched
    if (watchPercentage >= 80) {
      const attendanceExists = db.attendance.some(a => a.userId === userId && a.lessonId === lessonId);
      if (!attendanceExists) {
        const student = db.users.find(u => u.id === userId);
        const courseObj = db.courses.find(c => c.id === courseId);
        
        let lessonTitle = 'Course Lesson';
        if (courseObj) {
          const allLessons = courseObj.modules.flatMap(m => m.lessons);
          const foundL = allLessons.find(l => l.id === lessonId);
          if (foundL) lessonTitle = foundL.title;
        }

        const attRecord: AttendanceRecord = {
          userId,
          userName: student?.name || 'Zayn Malik',
          studentId: student?.studentId || 'ST-904123',
          courseId,
          courseTitle: courseObj?.title || 'Course Title',
          lessonId,
          lessonTitle,
          date: new Date().toISOString().split('T')[0],
          watchPercentage,
          status: 'Present'
        };
        db.attendance.push(attRecord);
      }
    }

    saveMockDb(db);
    return jsonResponse({ success: true });
  }

  // 18. RETRIEVE ATTENDANCE
  if (url === '/api/attendance' && method === 'GET') {
    return jsonResponse(db.attendance);
  }

  // 19. SUBMIT QUIZ
  if (url === '/api/quiz/submit' && method === 'POST') {
    const { userId, userName, courseId, quizId, quizTitle, score, totalQuestions, passed } = bodyData;
    const newAttempt: QuizAttempt = {
      id: `attempt_${Date.now()}`,
      userId,
      userName,
      courseId,
      quizId,
      quizTitle,
      score,
      totalQuestions,
      passed,
      date: new Date().toISOString().split('T')[0]
    };

    db.quizAttempts.push(newAttempt);

    // If score is perfect or passing, maybe give a certificate!
    if (passed) {
      const certExists = db.certificates.some(c => c.userId === userId && c.courseId === courseId);
      if (!certExists) {
        const courseObj = db.courses.find(c => c.id === courseId);
        const newCert: Certificate = {
          id: `cert_${Date.now()}`,
          userId,
          userName,
          courseId,
          courseTitle: courseObj?.title || 'Academic Course',
          issueDate: new Date().toISOString().split('T')[0],
          certificateCode: `CERT-${Math.floor(100000 + Math.random() * 900000)}`
        };
        db.certificates.push(newCert);

        // Add a push notification!
        db.notifications.push({
          id: `not_cert_${Date.now()}`,
          title: 'Certificate Issued! 🎓',
          message: `Congratulations! You have been awarded an official certificate for ${courseObj?.title || 'Course'}.`,
          type: 'push',
          userId,
          sentAt: new Date().toISOString(),
          recipient: 'student@university.edu',
          isRead: false
        });
      }
    }

    saveMockDb(db);
    return jsonResponse(newAttempt);
  }

  // 20. GET CERTIFICATES
  const getCertsMatch = url.match(/^\/api\/certificates\/(.+)$/);
  if (getCertsMatch && method === 'GET') {
    const userId = getCertsMatch[1];
    const certs = db.certificates.filter(c => c.userId === userId);
    return jsonResponse(certs);
  }

  // 21. GET USERS FOR ADMIN
  if (url === '/api/auth/users' && method === 'GET') {
    return jsonResponse(db.users);
  }

  // 22. DELETE USER FOR ADMIN
  const deleteUserMatch = url.match(/^\/api\/auth\/users\/(.+)$/);
  if (deleteUserMatch && method === 'DELETE') {
    const userId = deleteUserMatch[1];
    db.users = db.users.filter(u => u.id !== userId);
    saveMockDb(db);
    return jsonResponse({ success: true });
  }

  // 23. SAVE / UPDATE USER FOCUS TIME
  const saveFocusMatch = url.match(/^\/api\/users\/(.+)\/focus-time$/);
  if (saveFocusMatch && method === 'POST') {
    const userId = saveFocusMatch[1];
    const { minutesAdded } = bodyData;
    db.users = db.users.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          focusTime: (u.focusTime || 0) + minutesAdded
        };
      }
      return u;
    });
    saveMockDb(db);
    return jsonResponse({ success: true });
  }

  // 24. VISA BOOKINGS
  if (url === '/api/visa-bookings' && method === 'GET') {
    return jsonResponse(db.visaBookings || []);
  }

  if (url === '/api/visa-bookings' && method === 'POST') {
    const newVisa = {
      id: `visa_${Date.now()}`,
      studentId: bodyData.studentId,
      studentName: bodyData.studentName,
      country: bodyData.country,
      visaType: bodyData.visaType,
      status: 'pending',
      submissionDate: new Date().toISOString().split('T')[0],
      notes: bodyData.notes || 'Submitted via Sacred Admissions terminal.'
    };
    if (!db.visaBookings) db.visaBookings = [];
    db.visaBookings.push(newVisa);
    saveMockDb(db);
    return jsonResponse(newVisa);
  }

  // 25. AI TUTOR INTELLIGENT BOT RESPONSES
  if (url.includes('/api/ai') || url.includes('/api/ai-tutor')) {
    const prompt = bodyData.prompt || bodyData.message || '';
    let textReply = "I am your advanced AI Sacred Tutor. Let's analyze your queries together. Tajweed pronunciation focuses on precise throat, tongue, and lip articulation.";
    
    if (prompt.toLowerCase().includes('sharding')) {
      textReply = "Database sharding separates rows across databases based on a shard key. To resolve high cross-shard joins, ensure your indexes are aligned and co-locate related records.";
    } else if (prompt.toLowerCase().includes('makhraj') || prompt.toLowerCase().includes('tajweed')) {
      textReply = "Excellent question. The throat (Halq) contains 6 letters which origin from three levels: Aqsal-halq (deepest throat: Hamzah, Haa), Wasat-halq (mid throat: 'Ayn, Haa), and Adnal-halq (closest throat: Ghayn, Khaa). Maintain a clear accent during recitation.";
    } else if (prompt.toLowerCase().includes('solid') || prompt.toLowerCase().includes('design')) {
      textReply = "In Software Engineering, SOLID principles ensure robust structures. Single Responsibility demands that a class has exactly one reason to change, while Dependency Inversion requires coding against abstract interfaces, not concrete implementations.";
    } else if (prompt.toLowerCase().includes('quiz')) {
      return jsonResponse({
        quiz: {
          id: `quiz_gen_${Date.now()}`,
          title: 'AI Generated Quick Evaluation',
          questions: [
            {
              id: 'q_gen_1',
              text: 'Which is a core rule of Tajweed pronunciation regarding throat origin letters?',
              options: ['They are pronounced from Wasat-halq', 'They consist of 6 distinct letters', 'They have no resonant character', 'They require lip roundedness'],
              correctOptionIndex: 1
            }
          ],
          timeLimit: 120
        }
      });
    }

    return jsonResponse({
      text: textReply,
      response: textReply // support both response payload schemas
    });
  }

  // Catch all return empty JSON
  return jsonResponse({ error: 'Endpoint mock not mapped.' }, 404);
}
