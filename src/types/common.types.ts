// File ini berisi tipe data umum yang dapat digunakan kembali di seluruh API.

/**
 * Tipe generik untuk respons API yang dipaginasi.
 * @template T Tipe data dari item dalam array.
 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
