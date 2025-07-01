"use client"

/**
 * useAuth Hook untuk NusantaraEdu
 */

import { useState, useEffect } from "react"
import { AuthService } from "../../services/api/auth"
import type {
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  User,
  School,
  LoginResponse,
  RegisterResponse,
  ProfileResponse,
  ApiResponse,
} from "../../types/auth.types"

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [school, setSchool] = useState<School | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = () => {
    const token = AuthService.getToken()
    const userData = AuthService.getUser()
    const schoolData = AuthService.getSchool()

    if (token && userData) {
      setUser(userData)
      setSchool(schoolData)
      setIsAuthenticated(true)
    }
  }

  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await AuthService.login(credentials)

      if (response.success) {
        setUser(response.data.user)
        setSchool(response.data.school || null)
        setIsAuthenticated(true)
        setError(null)
      }

      return response
    } catch (error: any) {
      const errorMessage = AuthService.handleAuthError(error)
      setError(errorMessage)
      setIsAuthenticated(false)
      setUser(null)
      setSchool(null)

      // Re-throw error so component can handle it
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await AuthService.register(data)

      if (response.success) {
        setUser(response.data.user)
        setSchool(response.data.school || null)
        setIsAuthenticated(true)
        setError(null)
      }

      return response
    } catch (error: any) {
      const errorMessage = AuthService.handleAuthError(error)
      setError(errorMessage)
      setIsAuthenticated(false)
      setUser(null)
      setSchool(null)

      // Re-throw error so component can handle it
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    setIsLoading(true)

    try {
      await AuthService.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      setSchool(null)
      setIsAuthenticated(false)
      setError(null)
      setIsLoading(false)
    }
  }

  const updateProfile = async (data: UpdateProfileRequest): Promise<ProfileResponse> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await AuthService.updateProfile(data)

      if (response.success && response.data?.user) {
        setUser(response.data.user)
        setError(null)
      }

      return response
    } catch (error: any) {
      const errorMessage = AuthService.handleAuthError(error)
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const changePassword = async (data: ChangePasswordRequest): Promise<ApiResponse> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await AuthService.changePassword(data)
      setError(null)
      return response
    } catch (error: any) {
      const errorMessage = AuthService.handleAuthError(error)
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return {
    // State
    user,
    school,
    isLoading,
    error,
    isAuthenticated,

    // Actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    checkAuthStatus,
  }
}
