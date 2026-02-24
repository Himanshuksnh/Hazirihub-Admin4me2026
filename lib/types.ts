export interface User {
  email: string;
  name: string;
  photoURL?: string;
  createdAt?: string;
  lastActive?: string;
  currentSemesterId?: string;
}

export interface Semester {
  id: string;
  name: string;
  year: number;
  number: number;
  startDate: string;
  isCurrent: boolean;
  isArchived: boolean;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  isLab: boolean;
}

export interface TimetableEntry {
  day: string;
  time: string;
  subject: string;
  room?: string;
}

export interface AttendanceRecord {
  date: string;
  subjectId: string;
  status: 'present' | 'absent' | 'cancelled' | 'substituted';
}

export interface AttendanceSummary {
  overall: number;
  bySubject: { [key: string]: number };
  present: number;
  absent: number;
  cancelled: number;
  substituted: number;
  classesNeededFor75: number;
}
