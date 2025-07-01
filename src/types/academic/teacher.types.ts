// File ini berisi tipe data yang berhubungan dengan guru.

/**
 * Mewakili data seorang guru.
 */
export interface Teacher {
  id: number
  teacherId: string
  fullName: string
  email: string
  phoneNumber?: string
  subjects: string[]
}
