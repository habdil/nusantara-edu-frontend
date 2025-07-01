// src/types/academic/index.ts

// Base interfaces for academic data
export interface Student {
  id: number;
  studentId: string;
  fullName: string;
  gradeLevel: string;
  className: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  enrollmentDate: string;
  isActive: boolean;
}

export interface Subject {
  id: number;
  subjectCode: string;
  subjectName: string;
  gradeLevel: string;
  creditHours?: number;
  description?: string;
}

export interface Teacher {
  id: number;
  teacherId: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  subjects: string[];
}

export interface AcademicRecord {
  id: number;
  studentId: number;
  subjectId: number;
  teacherId: number;
  semester: string;
  academicYear: string;
  knowledgeScore?: number;
  skillScore?: number;
  attitudeScore?: string;
  midtermExamScore?: number;
  finalExamScore?: number;
  finalScore?: number;
  teacherNotes?: string;
  student: Student;
  subject: Subject;
  teacher: Teacher;
}

// Attendance related interfaces
export interface AttendanceRecord {
  id: number;
  studentId: number;
  attendanceDate: string;
  status: 'present' | 'excused' | 'sick' | 'unexcused';
  notes?: string;
  student: Student;
}

export interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  excusedDays: number;
  sickDays: number;
  unexcusedDays: number;
  attendanceRate: number;
}

export interface ClassAttendance {
  className: string;
  rate: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface AttendanceSummary {
  overallStats: AttendanceStats;
  classAttendance: ClassAttendance[];
}

// Grade analysis interfaces
export interface GradeDistributionItem {
  grade: string;
  count: number;
  percentage: number;
  color: string;
}

export interface SubjectAverage {
  subject: string;
  average: number;
  trend: 'up' | 'down' | 'stable';
}

// Academic statistics
export interface AcademicStatistics {
  totalStudents: number;
  averageScore: number;
  passRate: number;
  attendanceRate: number;
  subjectPerformance: Array<{
    subject: string;
    averageScore: number;
    passRate: number;
  }>;
}

// API parameter interfaces
export interface GetStudentsParams {
  gradeLevel?: string;
  className?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetAcademicRecordsParams {
  studentId?: number;
  subjectId?: number;
  semester?: string;
  academicYear?: string;
  gradeLevel?: string;
}

export interface GetAttendanceParams {
  studentId?: number;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
}

export interface GetAcademicStatsParams {
  academicYear?: string;
  semester?: string;
  gradeLevel?: string;
}

export interface GetAttendanceSummaryParams {
  academicYear?: string;
  semester?: string;
}

export interface GetGradeDistributionParams {
  academicYear?: string;
  semester?: string;
  gradeLevel?: string;
}

export interface GetSubjectAveragesParams {
  academicYear?: string;
  semester?: string;
  gradeLevel?: string;
}

// Response interfaces with pagination
export interface PaginatedStudentsResponse {
  data: Student[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form interfaces for creating/updating records
export interface CreateAcademicRecordData {
  studentId: number;
  subjectId: number;
  teacherId: number;
  semester: string;
  academicYear: string;
  knowledgeScore?: number;
  skillScore?: number;
  attitudeScore?: string;
  midtermExamScore?: number;
  finalExamScore?: number;
  finalScore?: number;
  teacherNotes?: string;
}

export interface UpdateAcademicRecordData {
  knowledgeScore?: number;
  skillScore?: number;
  attitudeScore?: string;
  midtermExamScore?: number;
  finalExamScore?: number;
  finalScore?: number;
  teacherNotes?: string;
}