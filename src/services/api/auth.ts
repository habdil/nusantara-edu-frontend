/**
 * Authentication API Service for NusantaraEdu
 * Handles all authentication-related API calls
 */

import { apiClient } from "../api-client"
import { API_ENDPOINTS } from "../../config/api.config"
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ProfileResponse,
  UpdateProfileRequest,
  ChangePasswordRequest,
  DashboardInfoResponse,
  RefreshTokenResponse,
  ApiResponse,
} from "../../types/auth.types"

export class AuthService {
  static validateStoredAuth() {
    throw new Error("Method not implemented.")
  }

  /**
   * User login
   */
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const apiResponse = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials)

      // Store auth data in localStorage
      if (apiResponse.success && apiResponse.data) {
        localStorage.setItem("nusantara_edu_token", apiResponse.data.token)
        localStorage.setItem("nusantara_edu_user", JSON.stringify(apiResponse.data.user))

        if (apiResponse.data.school) {
          localStorage.setItem("nusantara_edu_school", JSON.stringify(apiResponse.data.school))
        }

        if (apiResponse.data.refreshToken) {
          localStorage.setItem("nusantara_edu_refresh_token", apiResponse.data.refreshToken)
        }

        localStorage.setItem("nusantara_edu_last_login", new Date().toISOString())
      }

      return apiResponse as LoginResponse
    } catch (error: any) {
      console.error("Login error:", error)

      // Enhanced error handling for specific cases
      if (error?.response?.status === 401) {
        throw new Error("Username atau password salah. Silakan periksa kembali kredensial Anda.")
      }

      if (error?.response?.status === 403) {
        throw new Error("Akun Anda tidak memiliki akses. Hubungi administrator.")
      }

      if (error?.response?.status === 429) {
        throw new Error("Terlalu banyak percobaan login. Silakan tunggu beberapa menit.")
      }

      if (error?.response?.status >= 500) {
        throw new Error("Server sedang mengalami gangguan. Silakan coba lagi nanti.")
      }

      if (!error?.response) {
        throw new Error("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.")
      }

      throw error
    }
  }

  /**
   * User registration (Principal only)
   */
  static async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const apiResponse = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, data)

      // Auto-login after successful registration
      if (apiResponse.success && apiResponse.data) {
        localStorage.setItem("nusantara_edu_token", apiResponse.data.token)
        localStorage.setItem("nusantara_edu_user", JSON.stringify(apiResponse.data.user))

        if (apiResponse.data.school) {
          localStorage.setItem("nusantara_edu_school", JSON.stringify(apiResponse.data.school))
        }

        if (apiResponse.data.refreshToken) {
          localStorage.setItem("nusantara_edu_refresh_token", apiResponse.data.refreshToken)
        }

        localStorage.setItem("nusantara_edu_last_login", new Date().toISOString())
      }

      return apiResponse as RegisterResponse
    } catch (error: any) {
      console.error("Registration error:", error)

      // Enhanced error handling for registration
      if (error?.response?.status === 409) {
        const message = error?.response?.data?.message || ""
        if (message.includes("username")) {
          throw new Error("Username sudah digunakan. Silakan pilih username lain.")
        }
        if (message.includes("email")) {
          throw new Error("Email sudah terdaftar. Silakan gunakan email lain.")
        }
        if (message.includes("npsn")) {
          throw new Error("NPSN sudah memiliki kepala sekolah. Hubungi administrator.")
        }
        throw new Error("Data yang Anda masukkan sudah digunakan.")
      }

      if (error?.response?.status === 400) {
        throw new Error("Data yang Anda masukkan tidak valid. Periksa kembali form.")
      }

      if (error?.response?.status === 404) {
        throw new Error("NPSN sekolah tidak ditemukan. Periksa kembali NPSN Anda.")
      }

      throw error
    }
  }

  /**
   * User logout
   */
  static async logout(): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(API_ENDPOINTS.AUTH.LOGOUT, {}, { requireAuth: true })

      // Clear all stored auth data
      this.clearAuthData()

      return response
    } catch (error) {
      // Clear auth data even if logout fails
      this.clearAuthData()
      console.error("Logout error:", error)
      throw error
    }
  }

  /**
   * Get user profile
   */
  static async getProfile(): Promise<ProfileResponse> {
    try {
      const apiResponse = await apiClient.get(API_ENDPOINTS.AUTH.PROFILE, { requireAuth: true })

      // Update stored user data
      if (apiResponse.success && apiResponse.data?.user) {
        localStorage.setItem("nusantara_edu_user", JSON.stringify(apiResponse.data.user))

        if (apiResponse.data.school) {
          localStorage.setItem("nusantara_edu_school", JSON.stringify(apiResponse.data.school))
        }
      }

      return apiResponse as ProfileResponse
    } catch (error) {
      console.error("Get profile error:", error)
      throw error
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(data: UpdateProfileRequest): Promise<ProfileResponse> {
    try {
      const apiResponse = await apiClient.put(API_ENDPOINTS.AUTH.PROFILE, data, { requireAuth: true })

      // Update stored user data
      if (apiResponse.success && apiResponse.data?.user) {
        localStorage.setItem("nusantara_edu_user", JSON.stringify(apiResponse.data.user))
      }

      return apiResponse as ProfileResponse
    } catch (error) {
      console.error("Update profile error:", error)
      throw error
    }
  }

  /**
   * Change password
   */
  static async changePassword(data: ChangePasswordRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.put<ApiResponse>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data, { requireAuth: true })

      return response
    } catch (error) {
      console.error("Change password error:", error)
      throw error
    }
  }

  /**
   * Get dashboard info
   */
  static async getDashboardInfo(): Promise<DashboardInfoResponse> {
    try {
      const apiResponse = await apiClient.get(API_ENDPOINTS.AUTH.DASHBOARD_INFO, { requireAuth: true })

      return apiResponse as DashboardInfoResponse
    } catch (error) {
      console.error("Get dashboard info error:", error)
      throw error
    }
  }

  /**
   * Refresh authentication token
   */
  static async refreshToken(refreshToken?: string): Promise<RefreshTokenResponse> {
    try {
      const token = refreshToken || localStorage.getItem("nusantara_edu_refresh_token")

      if (!token) {
        throw new Error("No refresh token available")
      }

      const apiResponse = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken: token })

      // Update stored tokens
      if (apiResponse.success && apiResponse.data) {
        localStorage.setItem("nusantara_edu_token", apiResponse.data.token)

        if (apiResponse.data.refreshToken) {
          localStorage.setItem("nusantara_edu_refresh_token", apiResponse.data.refreshToken)
        }
      }

      return apiResponse as RefreshTokenResponse
    } catch (error) {
      console.error("Refresh token error:", error)
      // Clear auth data if refresh fails
      this.clearAuthData()
      throw error
    }
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    const token = localStorage.getItem("nusantara_edu_token")
    const user = localStorage.getItem("nusantara_edu_user")

    return !!(token && user)
  }

  /**
   * Get stored authentication token
   */
  static getToken(): string | null {
    return localStorage.getItem("nusantara_edu_token")
  }

  /**
   * Get stored user data
   */
  static getUser(): any | null {
    const userStr = localStorage.getItem("nusantara_edu_user")
    if (!userStr) return null

    try {
      return JSON.parse(userStr)
    } catch (error) {
      console.error("Error parsing stored user data:", error)
      return null
    }
  }

  /**
   * Get stored school data
   */
  static getSchool(): any | null {
    const schoolStr = localStorage.getItem("nusantara_edu_school")
    if (!schoolStr) return null

    try {
      return JSON.parse(schoolStr)
    } catch (error) {
      console.error("Error parsing stored school data:", error)
      return null
    }
  }

  /**
   * Clear all authentication data from storage
   */
  static clearAuthData(): void {
    localStorage.removeItem("nusantara_edu_token")
    localStorage.removeItem("nusantara_edu_refresh_token")
    localStorage.removeItem("nusantara_edu_user")
    localStorage.removeItem("nusantara_edu_school")
    localStorage.removeItem("nusantara_edu_last_login")
  }

  /**
   * Handle authentication errors with more specific messages
   */
  static handleAuthError(error: any): string {
    // If error has a custom message (thrown by our service), use it
    if (error?.message && typeof error.message === "string") {
      return error.message
    }

    // Handle API response errors
    if (error?.response?.data?.message) {
      return error.response.data.message
    }

    // Default error messages based on status code
    const status = error?.response?.status
    switch (status) {
      case 401:
        return "Username atau password salah. Silakan periksa kembali kredensial Anda."
      case 403:
        return "Akses ditolak. Hubungi administrator sistem."
      case 404:
        return "Data tidak ditemukan. Periksa kembali informasi yang Anda masukkan."
      case 409:
        return "Data sudah digunakan. Silakan gunakan data yang berbeda."
      case 422:
        return "Data yang Anda masukkan tidak valid. Periksa kembali form."
      case 429:
        return "Terlalu banyak percobaan. Silakan tunggu beberapa menit."
      case 500:
        return "Terjadi kesalahan server. Silakan coba lagi nanti."
      case 503:
        return "Layanan sedang dalam pemeliharaan. Silakan coba lagi nanti."
      default:
        if (!error?.response) {
          return "Tidak dapat terhubung ke server. Periksa koneksi internet Anda."
        }
        return "Terjadi kesalahan yang tidak diketahui. Silakan coba lagi."
    }
  }
}

export default AuthService
