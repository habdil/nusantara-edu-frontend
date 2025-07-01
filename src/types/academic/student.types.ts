// File ini berisi tipe data yang berhubungan dengan siswa.

/**
 * Mewakili data seorang siswa.
 */
export interface Student {
  id: number
  studentId: string
  fullName: string
  gradeLevel: string
  className: string
  gender: "male" | "female"
  dateOfBirth: string
  enrollmentDate: string
  isActive: boolean
}

/**
 * Mewakili data kehadiran seorang siswa pada tanggal tertentu.
 */
export interface StudentAttendance {
  id: number
  studentId: number
  attendanceDate: string
  status: "present" | "excused" | "sick" | "unexcused"
  notes?: string
  student?: Student
}
