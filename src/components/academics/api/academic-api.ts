// src/components/academics/api/academic-api.ts

import { apiClient } from "@/services/api"
import { API_ENDPOINTS } from "@/config/api.config"
import type { ApiResponse } from "@/services/api/types"
import type { AcademicRecord, AcademicStats } from "@/types/academic/record.types"
import type { BasicCompetency, Subject } from "@/types/academic/subject.types"
import type { Student, StudentAttendance } from "@/types/academic/student.types"
import type { Teacher } from "@/types/academic/teacher.types"
import { PaginatedResponse } from "@/types/common.types"

// API Functions - Real API calls menggunakan existing apiClient
export const academicApi = {
  // Students
  async getStudents(params?: {
    gradeLevel?: string
    className?: string
    search?: string
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<Student>> {
    try {
      const response: ApiResponse<PaginatedResponse<Student>> = await apiClient.get(API_ENDPOINTS.ACADEMIC.STUDENTS, {
        params,
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil data siswa")
      }

      return response.data
    } catch (error: any) {
      console.error("Error fetching students:", error)
      throw error
    }
  },

  // Get single student
  async getStudent(id: number): Promise<Student> {
    try {
      const response: ApiResponse<Student> = await apiClient.get(`${API_ENDPOINTS.ACADEMIC.STUDENTS}/${id}`, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil data siswa")
      }

      return response.data
    } catch (error: any) {
      console.error("Error fetching student:", error)
      throw error
    }
  },

  // Academic Records - Backend returns array directly for single student queries
  async getAcademicRecords(params?: {
    studentId?: number
    subjectId?: number
    semester?: string
    academicYear?: string
    gradeLevel?: string
    page?: number
    limit?: number
  }): Promise<AcademicRecord[]> {
    try {
      const response: ApiResponse<AcademicRecord[]> = await apiClient.get(
        API_ENDPOINTS.ACADEMIC.ACADEMIC_RECORDS,
        {
          params,
          requireAuth: true,
        },
      )

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil data nilai akademik")
      }

      return response.data
    } catch (error: any) {
      console.error("Error fetching academic records:", error)
      throw error
    }
  },

  // Create Academic Record
  async createAcademicRecord(data: {
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
  }): Promise<AcademicRecord> {
    try {
      const response: ApiResponse<AcademicRecord> = await apiClient.post(
        API_ENDPOINTS.ACADEMIC.ACADEMIC_RECORDS,
        data,
        {
          requireAuth: true,
        },
      )

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal membuat data nilai akademik")
      }

      return response.data
    } catch (error: any) {
      console.error("Error creating academic record:", error)
      throw error
    }
  },

  // Update Academic Record
  async updateAcademicRecord(id: number, data: Partial<AcademicRecord>): Promise<AcademicRecord> {
    try {
      const response: ApiResponse<AcademicRecord> = await apiClient.put(
        `${API_ENDPOINTS.ACADEMIC.ACADEMIC_RECORDS}/${id}`,
        data,
        {
          requireAuth: true,
        },
      )

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengupdate data nilai akademik")
      }

      return response.data
    } catch (error: any) {
      console.error("Error updating academic record:", error)
      throw error
    }
  },

  // Delete Academic Record
  async deleteAcademicRecord(id: number): Promise<void> {
    try {
      const response: ApiResponse<void> = await apiClient.delete(`${API_ENDPOINTS.ACADEMIC.ACADEMIC_RECORDS}/${id}`, {
        requireAuth: true,
      })

      if (!response.success) {
        throw new Error(response.message || "Gagal menghapus data nilai akademik")
      }
    } catch (error: any) {
      console.error("Error deleting academic record:", error)
      throw error
    }
  },

  // Subjects
  async getSubjects(gradeLevel?: string): Promise<Subject[]> {
    try {
      const params = gradeLevel ? { gradeLevel } : undefined
      const response: ApiResponse<Subject[]> = await apiClient.get(API_ENDPOINTS.ACADEMIC.SUBJECTS, {
        params,
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil data mata pelajaran")
      }

      return response.data
    } catch (error: any) {
      console.error("Error fetching subjects:", error)
      throw error
    }
  },

  // Teachers
  async getTeachers(params?: { subjectId?: number; gradeLevel?: string }): Promise<Teacher[]> {
    try {
      const response: ApiResponse<Teacher[]> = await apiClient.get(API_ENDPOINTS.ACADEMIC.TEACHERS, {
        params,
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil data guru")
      }

      return response.data
    } catch (error: any) {
      console.error("Error fetching teachers:", error)
      throw error
    }
  },

  // Basic Competencies
  async getBasicCompetencies(subjectId?: number): Promise<BasicCompetency[]> {
    try {
      const params = subjectId ? { subjectId } : undefined
      const response: ApiResponse<BasicCompetency[]> = await apiClient.get(API_ENDPOINTS.ACADEMIC.BASIC_COMPETENCIES, {
        params,
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil data kompetensi dasar")
      }

      return response.data
    } catch (error: any) {
      console.error("Error fetching basic competencies:", error)
      throw error
    }
  },

  // Student Attendance - Backend returns array directly for single student queries
  async getStudentAttendance(params?: {
    studentId?: number
    dateFrom?: string
    dateTo?: string
    status?: string
    page?: number
    limit?: number
  }): Promise<StudentAttendance[]> {
    try {
      const response: ApiResponse<StudentAttendance[]> = await apiClient.get(
        API_ENDPOINTS.ACADEMIC.STUDENT_ATTENDANCE,
        {
          params,
          requireAuth: true,
        },
      )

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil data kehadiran siswa")
      }

      return response.data
    } catch (error: any) {
      console.error("Error fetching student attendance:", error)
      throw error
    }
  },

  // Create Student Attendance
  async createStudentAttendance(data: {
    studentId: number
    attendanceDate: string
    status: "present" | "excused" | "sick" | "unexcused"
    notes?: string
  }): Promise<StudentAttendance> {
    try {
      const response: ApiResponse<StudentAttendance> = await apiClient.post(
        API_ENDPOINTS.ACADEMIC.STUDENT_ATTENDANCE,
        data,
        {
          requireAuth: true,
        },
      )

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal membuat data kehadiran siswa")
      }

      return response.data
    } catch (error: any) {
      console.error("Error creating student attendance:", error)
      throw error
    }
  },

  // Academic Statistics
  async getAcademicStats(params?: {
    academicYear?: string
    semester?: string
    gradeLevel?: string
  }): Promise<AcademicStats> {
    try {
      const response: ApiResponse<AcademicStats> = await apiClient.get(API_ENDPOINTS.ACADEMIC.STATS, {
        params,
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil statistik akademik")
      }

      return response.data
    } catch (error: any) {
      console.error("Error fetching academic stats:", error)
      throw error
    }
  },
}