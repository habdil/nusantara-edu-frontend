"use client"

import type React from "react"
import { createContext, useContext, useEffect, useReducer, useCallback, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "../services/api/auth"
import type {
  AuthState,
  AuthContextType,
  AuthAction,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  UserRoles,
} from "../types/auth.types"

// Initial state
const initialState: AuthState = {
  user: null,
  school: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  lastLogin: undefined,
}

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      }

    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        school: action.payload.school || null,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken || null,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        lastLogin: new Date().toISOString(),
      }

    case "AUTH_FAILURE":
      return {
        ...state,
        user: null,
        school: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      }

    case "AUTH_LOGOUT":
      return {
        ...initialState,
        isLoading: false,
      }

    case "UPDATE_PROFILE":
      return {
        ...state,
        user: action.payload,
        error: null,
      }

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      }

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      }

    default:
      return state
  }
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider props
interface AuthProviderProps {
  children: ReactNode
}

/**
 * Authentication Provider Component
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const router = useRouter()

  /**
   * Check if user is authenticated - memoized to prevent infinite loops
   */
  const checkAuth = useCallback(async () => {
    try {
      dispatch({ type: "AUTH_START" })

      // Check if we have stored auth data
      const token = AuthService.getToken()
      const user = AuthService.getUser()
      const school = AuthService.getSchool()

      // Get refresh token from localStorage
      const refreshToken = localStorage.getItem("nusantara_edu_refresh_token")

      if (token && user) {
        // Basic validation - check if token exists and user data is valid
        const isValid = token.length > 0 && user.id && user.username

        if (isValid) {
          // Set cookies for middleware compatibility
          document.cookie = `nusantara_edu_token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`
          document.cookie = `nusantara_edu_user=${JSON.stringify(user)}; path=/; max-age=${7 * 24 * 60 * 60}`

          if (school) {
            document.cookie = `nusantara_edu_school=${JSON.stringify(school)}; path=/; max-age=${7 * 24 * 60 * 60}`
          }

          dispatch({
            type: "AUTH_SUCCESS",
            payload: {
              user,
              school,
              token,
              refreshToken: refreshToken || null,
            },
          })
        } else {
          // Invalid auth data, clear it
          AuthService.clearAuthData()
          dispatch({ type: "AUTH_LOGOUT" })
        }
      } else {
        dispatch({ type: "AUTH_LOGOUT" })
      }
    } catch (error) {
      console.error("Auth check error:", error)
      AuthService.clearAuthData()
      dispatch({ type: "AUTH_LOGOUT" })
    }
  }, []) // Empty dependency array since this function doesn't depend on any state

  /**
   * Check authentication status on mount - only run once
   */
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  /**
   * Login user - memoized to prevent recreation on every render
   */
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      dispatch({ type: "AUTH_START" })

      const response = await AuthService.login(credentials)

      if (response.success && response.data) {
        // Set cookies for middleware
        const maxAge = 7 * 24 * 60 * 60 // 7 days
        document.cookie = `nusantara_edu_token=${response.data.token}; path=/; max-age=${maxAge}; SameSite=Lax`
        document.cookie = `nusantara_edu_user=${JSON.stringify(response.data.user)}; path=/; max-age=${maxAge}; SameSite=Lax`

        if (response.data.school) {
          document.cookie = `nusantara_edu_school=${JSON.stringify(response.data.school)}; path=/; max-age=${maxAge}; SameSite=Lax`
        }

        dispatch({
          type: "AUTH_SUCCESS",
          payload: {
            user: response.data.user,
            school: response.data.school,
            token: response.data.token,
            refreshToken: response.data.refreshToken,
          },
        })

        // Force a small delay to ensure cookies are set
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      return response
    } catch (error) {
      const errorMessage = AuthService.handleAuthError(error)
      dispatch({ type: "AUTH_FAILURE", payload: errorMessage })
      throw error
    }
  }, [])

  /**
   * Register user - memoized to prevent recreation on every render
   */
  const register = useCallback(async (data: RegisterRequest) => {
    try {
      dispatch({ type: "AUTH_START" })

      const response = await AuthService.register(data)

      if (response.success && response.data) {
        // Set cookies for middleware
        const maxAge = 7 * 24 * 60 * 60 // 7 days
        document.cookie = `nusantara_edu_token=${response.data.token}; path=/; max-age=${maxAge}; SameSite=Lax`
        document.cookie = `nusantara_edu_user=${JSON.stringify(response.data.user)}; path=/; max-age=${maxAge}; SameSite=Lax`

        if (response.data.school) {
          document.cookie = `nusantara_edu_school=${JSON.stringify(response.data.school)}; path=/; max-age=${maxAge}; SameSite=Lax`
        }

        dispatch({
          type: "AUTH_SUCCESS",
          payload: {
            user: response.data.user,
            school: response.data.school,
            token: response.data.token,
            refreshToken: response.data.refreshToken,
          },
        })

        // Force a small delay to ensure cookies are set
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      return response
    } catch (error) {
      const errorMessage = AuthService.handleAuthError(error)
      dispatch({ type: "AUTH_FAILURE", payload: errorMessage })
      throw error
    }
  }, [])

  /**
   * Logout user - memoized to prevent recreation on every render
   */
  const logout = useCallback(async () => {
    try {
      await AuthService.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Clear cookies
      document.cookie = "nusantara_edu_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
      document.cookie = "nusantara_edu_user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
      document.cookie = "nusantara_edu_school=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"

      dispatch({ type: "AUTH_LOGOUT" })

      // Redirect to home page
      router.push("/")
    }
  }, [router])

  /**
   * Update user profile - memoized to prevent recreation on every render
   */
  const updateProfile = useCallback(async (data: UpdateProfileRequest) => {
    try {
      const response = await AuthService.updateProfile(data)

      if (response.success && response.data?.user) {
        // Update cookie
        document.cookie = `nusantara_edu_user=${JSON.stringify(response.data.user)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`

        dispatch({ type: "UPDATE_PROFILE", payload: response.data.user })
      }

      return response
    } catch (error) {
      const errorMessage = AuthService.handleAuthError(error)
      dispatch({ type: "AUTH_FAILURE", payload: errorMessage })
      throw error
    }
  }, [])

  /**
   * Change password - memoized to prevent recreation on every render
   */
  const changePassword = useCallback(async (data: ChangePasswordRequest) => {
    try {
      const response = await AuthService.changePassword(data)
      return response
    } catch (error) {
      const errorMessage = AuthService.handleAuthError(error)
      dispatch({ type: "AUTH_FAILURE", payload: errorMessage })
      throw error
    }
  }, [])

  /**
   * Refresh authentication token - memoized to prevent recreation on every render
   */
  const refreshTokenFn = useCallback(async () => {
    try {
      const response = await AuthService.refreshToken()

      if (response.success && response.data) {
        // Update cookie
        document.cookie = `nusantara_edu_token=${response.data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`
      }
    } catch (error) {
      console.error("Token refresh error:", error)
      // If refresh fails, logout user
      await logout()
    }
  }, [logout])

  /**
   * Clear error state - memoized to prevent infinite loops
   */
  const clearError = useCallback(() => {
    dispatch({ type: "CLEAR_ERROR" })
  }, [])

  // Context value - memoized to prevent unnecessary re-renders
  const contextValue: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshAuthToken: refreshTokenFn,
    clearError,
    checkAuth,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

/**
 * Hook to use authentication context
 */
export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider")
  }

  return context
}

/**
 * HOC to protect components with authentication
 */
export function withAuth<P extends object>(Component: React.ComponentType<P>, requiredRoles?: UserRoles[]) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading, user } = useAuthContext()

    // Show loading while checking auth
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading...</p>
          </div>
        </div>
      )
    }

    // Redirect if not authenticated
    if (!isAuthenticated) {
      if (typeof window !== "undefined") {
        window.location.href = "/"
      }
      return null
    }

    // Check role-based access
    if (requiredRoles && user && !requiredRoles.includes(user.role)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      )
    }

    return <Component {...props} />
  }
}

export default AuthContext
