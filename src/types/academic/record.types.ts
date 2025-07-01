// File ini berisi tipe data yang berhubungan dengan catatan dan statistik akademik.

import type { Student } from "./student.types"
import type { Subject } from "./subject.types"
import type { Teacher } from "./teacher.types"

/**
 * Mewakili catatan nilai akademik seorang siswa.
 */
export interface AcademicRecord {
  id: number
  studentId: number
  subjectId: number
  teacherId: number
  semester: string
  academicYear: string
  knowledgeScore?: number
  skillScore?: number
  attitudeScore?: string
  midtermExamScore?: number
  finalExamScore?: number
  finalScore?: number
  teacherNotes?: string
  student?: Student
  subject?: Subject
  teacher?: Teacher
}

/**
 * Mewakili data statistik akademik secara keseluruhan.
 */
export interface AcademicStats {
  totalStudents: number
  averageScore: number
  passRate: number
  attendanceRate: number
  subjectPerformance: Array<{
    subject: string
    averageScore: number
    passRate: number
  }>
}
