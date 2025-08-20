// Tipos base del sistema
export interface Student {
  id: string;
  name: string;
  email: string;
  studentCode: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  type: CourseType; // Para el Factory Method
  faculty: string;
  career: string;
}

export type CourseType = 'presencial' | 'virtual' | 'hibrido';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  courseId: string;
  date: string;
  status: AttendanceStatus;
  timestamp: Date;
  location?: string; // Para cursos presenciales
  connectionTime?: number; // Para cursos virtuales
}

export type AttendanceStatus = 'presente' | 'ausente' | 'tardanza';

// Para el patrón Composite
export interface AcademicNode {
  id: string;
  name: string;
  type: 'universidad' | 'facultad' | 'carrera' | 'curso';
  children?: AcademicNode[];
  calculateAttendance?: () => AttendanceStats;
}

export interface AttendanceStats {
  totalStudents: number;
  presentStudents: number;
  absentStudents: number;
  lateStudents: number;
  attendancePercentage: number;
}

// Para el patrón Observer
export interface AttendanceEvent {
  type: 'attendance_marked' | 'attendance_updated' | 'stats_changed';
  studentId: string;
  courseId: string;
  oldStatus?: AttendanceStatus;
  newStatus: AttendanceStatus;
  timestamp: Date;
}

export interface Observer {
  update(event: AttendanceEvent): void;
}

// Props para componentes
export interface AttendanceFormProps {
  courseId: string;
  date: string;
  onSave: (records: AttendanceRecord[]) => void;
}

export interface StudentListProps {
  students: Student[];
  attendanceRecords: AttendanceRecord[];
  onAttendanceChange: (studentId: string, status: AttendanceStatus) => void;
}