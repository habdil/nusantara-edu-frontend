// src/services/api/types.ts

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T = any> {
  success: boolean
  message?: string  // Make message optional to match the original type
  data?: T
  error?: string | number
  details?: any[]
  originalError?: any
}

export interface ApiRequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  url: string
  data?: any
  params?: Record<string, string | number | boolean | null | undefined>
  headers?: Record<string, string>
  timeout?: number
  requireAuth?: boolean
}

export interface ApiError {
  success: false
  message: string
  error: string | number
  details?: any[]
  originalError?: any
}