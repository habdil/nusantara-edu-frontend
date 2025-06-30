/**
 * Authentication Types for NusantaraEdu API
 * Based on Prisma schema and API documentation
 */

// User roles enum
export enum UserRoles {
  ADMIN = "admin",
  PRINCIPAL = "principal",
  TEACHER = "teacher",
  SCHOOL_ADMIN_STAFF = "school_admin_staff",
  EDUCATION_DEPARTMENT = "education_department",
}

// Gender enum
export enum Gender {
  MALE = "male",
  FEMALE = "female",
}

// Base user interface
export interface User {
  id: number
  username: string
  email: string
  role: UserRoles
  fullName: string
  phoneNumber?: string
  profilePicture?: string
  lastLogin?: string
  createdAt: string
  updatedAt?: string
  isActive: boolean
}

// School interface
export interface School {
  id: number
  npsn: string // National School Principal Number
  schoolName: string
  fullAddress: string
  postalCode?: string
  phoneNumber?: string
  email?: string
  website?: string
  totalStudents?: number
  totalTeachers?: number
  totalStaff?: number
  establishedYear?: number
  accreditation?: string
  logoUrl?: string
  latitude?: number
  longitude?: number
  createdAt: string
  updatedAt?: string
}

// Authentication request types
export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  fullName: string
  phoneNumber?: string
  npsn: string // Required for principal registration
}

export interface ChangePasswordRequest {
  current_password: string
  new_password: string
  confirm_password: string
}

export interface UpdateProfileRequest {
  fullName?: string
  phoneNumber?: string
  profilePicture?: string
}

// Authentication response types
export interface AuthResponse {
  success: boolean
  message: string
  data: {
    token: string
    refreshToken?: string
    user: User
    school?: School
    expiresIn: number
  }
}

export interface LoginResponse extends AuthResponse {}

export interface RegisterResponse extends AuthResponse {}

export interface ProfileResponse {
  success: boolean
  message: string
  data: {
    user: User
    school?: School
  }
}

export interface DashboardInfoResponse {
  success: boolean
  message: string
  data: {
    user: User
    school?: School
    stats: {
      totalStudents: number
      totalTeachers: number
      attendanceRate: number
      academicPerformance: number
    }
    permissions: string[]
    lastActivities: Activity[]
  }
}

export interface Activity {
  id: number
  userId: number
  activity: string
  description?: string
  systemModule?: string
  createdAt: string
}

// Error response types
export interface ApiError {
  success: false
  message: string
  error?: string
  details?: ValidationError[]
  code?: string | number
}

export interface ValidationError {
  field: string
  message: string
  code?: string
}

// Token types
export interface TokenPayload {
  userId: number
  username: string
  role: UserRoles
  schoolId?: number
  iat: number
  exp: number
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  success: boolean
  message: string
  data: {
    token: string
    refreshToken: string
    expiresIn: number
  }
}

// Authentication state types
export interface AuthState {
  user: User | null
  school: School | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  lastLogin?: string
}

// Fixed AuthContextType interface to return proper response types
export interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<LoginResponse>
  register: (data: RegisterRequest) => Promise<RegisterResponse>
  logout: () => Promise<void>
  updateProfile: (data: UpdateProfileRequest) => Promise<ProfileResponse>
  changePassword: (data: ChangePasswordRequest) => Promise<ApiResponse>
  refreshAuthToken: () => Promise<void>
  clearError: () => void
  checkAuth: () => Promise<void>
}

// API client types
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
  details?: ValidationError[]
}

export interface ApiRequestConfig {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  url: string
  data?: any
  headers?: Record<string, string>
  params?: Record<string, string | number>
  timeout?: number
  requireAuth?: boolean
}

// Hook return types
export interface UseAuthReturn {
  auth: AuthState
  login: (credentials: LoginRequest) => Promise<AuthResponse>
  register: (data: RegisterRequest) => Promise<RegisterResponse>
  logout: () => Promise<void>
  updateProfile: (data: UpdateProfileRequest) => Promise<ProfileResponse>
  changePassword: (data: ChangePasswordRequest) => Promise<ApiResponse>
  refreshToken: () => Promise<void>
  isLoading: boolean
  error: string | null
  clearError: () => void
}

// Form validation types
export interface LoginFormData {
  username: string
  password: string
}

export interface RegisterFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  fullName: string
  phoneNumber?: string
  npsn: string
}

export interface ProfileFormData {
  fullName: string
  phoneNumber?: string
  email: string
}

export interface ChangePasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// Utility types
export type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: { user: User; school?: School; token: string; refreshToken?: string | null } }
  | { type: "AUTH_FAILURE"; payload: string }
  | { type: "AUTH_LOGOUT" }
  | { type: "UPDATE_PROFILE"; payload: User }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_LOADING"; payload: boolean }

// Constants
export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Username atau password salah",
  USER_NOT_FOUND: "Pengguna tidak ditemukan",
  EMAIL_ALREADY_EXISTS: "Email sudah digunakan",
  USERNAME_ALREADY_EXISTS: "Username sudah digunakan",
  WEAK_PASSWORD: "Password terlalu lemah",
  INVALID_EMAIL: "Format email tidak valid",
  INVALID_NPSN: "NPSN sekolah tidak ditemukan",
  SCHOOL_HAS_PRINCIPAL: "Sekolah sudah memiliki kepala sekolah",
  TOKEN_EXPIRED: "Token sudah kedaluwarsa",
  TOKEN_INVALID: "Token tidak valid",
  ACCESS_DENIED: "Akses ditolak",
  NETWORK_ERROR: "Kesalahan jaringan",
  SERVER_ERROR: "Kesalahan server",
  RATE_LIMITED: "Terlalu banyak percobaan login",
} as const

export const AUTH_SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login berhasil",
  REGISTER_SUCCESS: "Registrasi berhasil",
  LOGOUT_SUCCESS: "Logout berhasil",
  PROFILE_UPDATED: "Profil berhasil diperbarui",
  PASSWORD_CHANGED: "Password berhasil diubah",
} as const

// Type guards
export const isAuthResponse = (response: any): response is AuthResponse => {
  return (
    response &&
    typeof response.success === "boolean" &&
    typeof response.message === "string" &&
    response.data &&
    typeof response.data.token === "string" &&
    response.data.user
  )
}

export const isApiError = (response: any): response is ApiError => {
  return response && response.success === false && typeof response.message === "string"
}

export const isUser = (obj: any): obj is User => {
  return (
    obj &&
    typeof obj.id === "number" &&
    typeof obj.username === "string" &&
    typeof obj.email === "string" &&
    Object.values(UserRoles).includes(obj.role)
  )
}

export default {
  UserRoles,
  Gender,
  AUTH_ERRORS,
  AUTH_SUCCESS_MESSAGES,
  isAuthResponse,
  isApiError,
  isUser,
}
