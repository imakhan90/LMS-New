import React, { useEffect, useState } from 'react';
import { User, Course, AttendanceRecord, QuizAttempt, Certificate, Quiz, OfficeHourSlot } from '../types';
import StudentDashboard from './dashboards/StudentDashboard';
import ProfessorDashboard from './dashboards/ProfessorDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

interface DashboardProps {
  user: User;
  courses: Course[];
  setActiveTab: (tab: string) => void;
  onLaunchCourse: (course: Course) => void;
  onLaunchQuiz?: (quiz: Quiz, courseId: string) => void;
}

export default function Dashboard({ 
  user, 
  courses, 
  setActiveTab, 
  onLaunchCourse, 
  onLaunchQuiz 
}: DashboardProps) {
  const [stats, setStats] = useState<any>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  // Office Hours states
  const [officeHours, setOfficeHours] = useState<OfficeHourSlot[]>([]);
  const [newSlotCourse, setNewSlotCourse] = useState(courses[0]?.id || '');
  const [newSlotDate, setNewSlotDate] = useState('');
  const [newSlotStart, setNewSlotStart] = useState('');
  const [newSlotEnd, setNewSlotEnd] = useState('');
  const [slotMessage, setSlotMessage] = useState({ type: '', text: '' });
  const [isSubmittingSlot, setIsSubmittingSlot] = useState(false);

  const fetchOfficeHours = () => {
    fetch('/api/office-hours')
      .then(res => res.json())
      .then(data => setOfficeHours(data))
      .catch(err => console.error('Error fetching office hours', err));
  };

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotCourse || !newSlotDate || !newSlotStart || !newSlotEnd) {
      setSlotMessage({ type: 'error', text: 'Please fill in all fields.' });
      return;
    }
    
    setIsSubmittingSlot(true);
    setSlotMessage({ type: '', text: '' });

    fetch('/api/office-hours', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId: newSlotCourse,
        professorId: user.id,
        professorName: user.name,
        date: newSlotDate,
        startTime: newSlotStart,
        endTime: newSlotEnd
      })
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to create slot');
        return res.json();
      })
      .then(() => {
        setSlotMessage({ type: 'success', text: 'Availability slot created!' });
        setNewSlotDate('');
        setNewSlotStart('');
        setNewSlotEnd('');
        fetchOfficeHours();
      })
      .catch(err => {
        console.error(err);
        setSlotMessage({ type: 'error', text: 'Failed to create availability.' });
      })
      .finally(() => {
        setIsSubmittingSlot(false);
      });
  };

  const handleDeleteSlot = (slotId: string) => {
    if (!confirm('Are you sure you want to delete this office hour availability slot?')) return;
    
    fetch(`/api/office-hours/${slotId}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete slot');
        return res.json();
      })
      .then(() => {
        fetchOfficeHours();
      })
      .catch(err => {
        console.error(err);
        alert('Failed to delete slot');
      });
  };

  useEffect(() => {
    // Parallelize loading of analytics and records
    const quizAttemptsUrl = (user.role === 'admin' || user.role === 'professor')
      ? '/api/quiz-attempts'
      : `/api/quiz-attempts/${user.id}`;

    Promise.all([
      fetch('/api/reports').then(res => res.json()),
      fetch('/api/attendance').then(res => res.json()),
      fetch(quizAttemptsUrl).then(res => res.json()),
      fetch(`/api/certificates/${user.id}`).then(res => res.json()),
      fetch('/api/office-hours').then(res => res.json())
    ])
      .then(([reportData, attendanceData, attemptsData, certsData, officeHoursData]) => {
        setStats(reportData);
        setAttendance(attendanceData);
        setAttempts(attemptsData);
        setCerts(certsData);
        setOfficeHours(officeHoursData);
      })
      .catch(err => console.error('Error fetching dashboard indices', err))
      .finally(() => setLoading(false));
  }, [user.id, user.role]);

  if (loading || !stats) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {user.role === 'student' && (
        <StudentDashboard 
          user={user}
          courses={courses}
          attendance={attendance}
          attempts={attempts}
          certs={certs}
          onLaunchCourse={onLaunchCourse}
          setActiveTab={setActiveTab}
        />
      )}

      {user.role === 'professor' && (
        <ProfessorDashboard 
          user={user}
          courses={courses}
          attendance={attendance}
          attempts={attempts}
          officeHours={officeHours}
          onLaunchCourse={onLaunchCourse}
          setActiveTab={setActiveTab}
          handleCreateSlot={handleCreateSlot}
          handleDeleteSlot={handleDeleteSlot}
          newSlotCourse={newSlotCourse}
          setNewSlotCourse={setNewSlotCourse}
          newSlotDate={newSlotDate}
          setNewSlotDate={setNewSlotDate}
          newSlotStart={newSlotStart}
          setNewSlotStart={setNewSlotStart}
          newSlotEnd={newSlotEnd}
          setNewSlotEnd={setNewSlotEnd}
          slotMessage={slotMessage}
          isSubmittingSlot={isSubmittingSlot}
        />
      )}

      {user.role === 'admin' && (
        <AdminDashboard 
          user={user}
          courses={courses}
          attendance={attendance}
          attempts={attempts}
          stats={stats}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
}
