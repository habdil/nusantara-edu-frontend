// File ini berisi tipe data yang berhubungan dengan mata pelajaran.

/**
 * Mewakili data sebuah mata pelajaran.
 */
export interface Subject {
  id: number
  subjectCode: string
  subjectName: string
  gradeLevel: string
  creditHours?: number
  description?: string
}

/**
 * Mewakili data kompetensi dasar untuk sebuah mata pelajaran.
 */
export interface BasicCompetency {
  id: number
  subjectId: number
  competencyCode: string
  competencyDescription: string
  difficultyLevel?: string
  subject?: Subject
}
