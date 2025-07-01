// src/services/api/error-handler.ts

import API_CONFIG, { getEnvironmentConfig } from "@/config/api.config"
import type { ApiError } from "./types"

export class ApiErrorHandler {
  /**
   * Handle API errors with proper status code mapping
   */
  static handleError(error: any): never {
    // Network error
    if (!error.response) {
      if (getEnvironmentConfig().SHOW_NETWORK_ERRORS) {
        console.error("[API] Network Error:", error)
      }
      throw {
        success: false,
        message: "Koneksi jaringan bermasalah. Periksa koneksi internet Anda.",
        error: "NETWORK_ERROR",
      } as ApiError
    }

    // HTTP error responses
    const { status, data } = error.response

    // Extract message from response
    let errorMessage = "Terjadi kesalahan server. Silakan coba lagi."
    if (data && typeof data === 'object') {
      if (data.message) {
        errorMessage = data.message
      } else if (typeof data === 'string') {
        errorMessage = data
      }
    }

    // Handle different status codes
    switch (status) {
      case 401: // UNAUTHORIZED
        this.handleUnauthorized()
        throw {
          success: false,
          message: errorMessage || "Sesi Anda telah berakhir. Silakan login kembali.",
          error: status,
        } as ApiError

      case 403: // FORBIDDEN
        throw {
          success: false,
          message: errorMessage || "Anda tidak memiliki akses untuk melakukan tindakan ini.",
          error: status,
        } as ApiError

      case 404: // NOT_FOUND
        throw {
          success: false,
          message: errorMessage || "Data yang diminta tidak ditemukan.",
          error: status,
        } as ApiError

      case 400: // VALIDATION_ERROR
        throw {
          success: false,
          message: errorMessage || "Data yang dikirim tidak valid.",
          error: status,
          details: data?.details || data?.errors || [],
          originalError: data,
        } as ApiError

      case 429: // RATE_LIMITED
        throw {
          success: false,
          message: errorMessage || "Terlalu banyak permintaan. Silakan coba lagi nanti.",
          error: status,
        } as ApiError

      case 500: // SERVER_ERROR
      default:
        if (getEnvironmentConfig().SHOW_NETWORK_ERRORS) {
          console.error("[API] Server Error:", error.response)
        }
        throw {
          success: false,
          message: errorMessage,
          error: status,
        } as ApiError
    }
  }

  /**
   * Handle timeout errors
   */
  static handleTimeout(): never {
    throw {
      success: false,
      message: "Permintaan timeout. Silakan coba lagi.",
      error: "TIMEOUT",
    } as ApiError
  }

  /**
   * Handle unauthorized access
   */
  private static handleUnauthorized(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(API_CONFIG.AUTH.TOKEN_KEY)
      localStorage.removeItem(API_CONFIG.AUTH.USER_KEY)
      localStorage.removeItem(API_CONFIG.AUTH.REFRESH_TOKEN_KEY)
      // Redirect to login if needed
      window.location.href = "/"
    }
  }
}