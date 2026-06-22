/**
 * LMS Type Definitions
 */

export type UserRole = 'student' | 'professor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  phone?: string;
  department?: string;
  semester?: string;
  password?: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
  timeLimit: number; // in seconds
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'quiz';
  videoUrl?: string;
  pdfUrl?: string;
  duration?: string;
  quiz?: Quiz;
  completed?: boolean;
  progressPercent?: number;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  department: string;
  instructor: string;
  isPublished: boolean;
  isQuran?: boolean;
  modules: Module[];
}

export interface VideoProgress {
  userId: string;
  lessonId: string;
  courseId: string;
  watchPercentage: number;
  lastPosition: number; // in seconds
  completed: boolean;
}

export interface AttendanceRecord {
  userId: string;
  userName: string;
  studentId: string;
  courseId: string;
  courseTitle: string;
  lessonId: string;
  lessonTitle: string;
  date: string;
  watchPercentage: number;
  status: 'Present' | 'Incomplete';
}

export interface QuizAttempt {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  date: string;
}

export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  issueDate: string;
  certificateCode: string;
}

export interface LibraryItem {
  id: string;
  title: string;
  author: string;
  category: string;
  fileSize: string;
  downloadsCount: number;
  isBookmarked?: boolean;
}

export interface LmsNotification {
  id: string;
  title: string;
  message: string;
  type: 'email' | 'sms' | 'push';
  userId: string;
  sentAt: string;
  recipient: string;
  isRead?: boolean;
}
