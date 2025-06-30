import API_CONFIG, { getEnvironmentConfig } from "@/config/api.config"
import type { ApiResponse, ApiRequestConfig } from "../types/api/auth.types"

interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>
  private requestInterceptors: Array<(config: ApiRequestConfig) => ApiRequestConfig> = []
  private responseInterceptors: Array<(response: any) => any> = []

  constructor() {
    this.baseURL = `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}`
    this.defaultHeaders = API_CONFIG.HEADERS.DEFAULT
    this.setupInterceptors()
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor for authentication
    this.addRequestInterceptor((config) => {
      const token = this.getStoredToken()

      if (config.requireAuth && token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        }
      }

      // Add default headers
      config.headers = {
        ...this.defaultHeaders,
        ...config.headers,
      }

      // Add timeout
      if (!config.timeout) {
        config.timeout = API_CONFIG.TIMEOUTS.DEFAULT
      }

      // Log request in development
      if (getEnvironmentConfig().DEBUG_REQUESTS) {
        console.log(`[API] ${config.method} ${config.url}`, {
          headers: config.headers,
          data: config.data,
          params: config.params,
        })
      }

      return config
    })

    // Response interceptor for error handling
    this.addResponseInterceptor((response) => {
      // Log response in development
      if (getEnvironmentConfig().DEBUG_REQUESTS) {
        console.log(`[API] Response:`, response)
      }

      return response
    })
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: (config: ApiRequestConfig) => ApiRequestConfig): void {
    this.requestInterceptors.push(interceptor)
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: (response: any) => any): void {
    this.responseInterceptors.push(interceptor)
  }

  /**
   * Get stored authentication token
   */
  private getStoredToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(API_CONFIG.AUTH.TOKEN_KEY)
  }

  /**
   * Build full URL with query parameters
   */
  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | null | undefined>): string {
    let url = endpoint.startsWith("http") ? endpoint : `${this.baseURL}${endpoint}`

    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        // Only append non-null, non-undefined values
        if (value !== null && value !== undefined && value !== "") {
          searchParams.append(key, String(value))
        }
      })

      const queryString = searchParams.toString()
      if (queryString) {
        url += `?${queryString}`
      }
    }

    return url
  }

  /**
   * Apply request interceptors
   */
  private applyRequestInterceptors(config: ApiRequestConfig): ApiRequestConfig {
    return this.requestInterceptors.reduce((acc, interceptor) => {
      return interceptor(acc)
    }, config)
  }

  /**
   * Apply response interceptors
   */
  private applyResponseInterceptors(response: any): any {
    return this.responseInterceptors.reduce((acc, interceptor) => {
      return interceptor(acc)
    }, response)
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): never {
    // Network error
    if (!error.response) {
      if (getEnvironmentConfig().SHOW_NETWORK_ERRORS) {
        console.error("[API] Network Error:", error)
      }
      throw {
        success: false,
        message: "Koneksi jaringan bermasalah. Periksa koneksi internet Anda.",
        error: API_CONFIG.ERROR_CODES.NETWORK_ERROR,
      }
    }

    // HTTP error responses
    const { status, data } = error.response

    // Handle different status codes
    switch (status) {
      case API_CONFIG.ERROR_CODES.UNAUTHORIZED:
        // Token expired or invalid
        if (typeof window !== "undefined") {
          localStorage.removeItem(API_CONFIG.AUTH.TOKEN_KEY)
          localStorage.removeItem(API_CONFIG.AUTH.USER_KEY)
          // Redirect to login if needed
          window.location.href = "/"
        }
        throw {
          success: false,
          message: data?.message || "Sesi Anda telah berakhir. Silakan login kembali.",
          error: status,
        }

      case API_CONFIG.ERROR_CODES.FORBIDDEN:
        throw {
          success: false,
          message: data?.message || "Anda tidak memiliki akses untuk melakukan tindakan ini.",
          error: status,
        }

      case API_CONFIG.ERROR_CODES.NOT_FOUND:
        throw {
          success: false,
          message: data?.message || "Data yang diminta tidak ditemukan.",
          error: status,
        }

      case API_CONFIG.ERROR_CODES.VALIDATION_ERROR:
        throw {
          success: false,
          message: data?.message || "Data yang dikirim tidak valid.",
          error: status,
          details: data?.details || [],
          originalError: data, // Preserve original error data
        }

      case API_CONFIG.ERROR_CODES.RATE_LIMITED:
        throw {
          success: false,
          message: data?.message || "Terlalu banyak permintaan. Silakan coba lagi nanti.",
          error: status,
        }

      case API_CONFIG.ERROR_CODES.SERVER_ERROR:
      default:
        if (getEnvironmentConfig().SHOW_NETWORK_ERRORS) {
          console.error("[API] Server Error:", error.response)
        }
        throw {
          success: false,
          message: data?.message || "Terjadi kesalahan server. Silakan coba lagi.",
          error: status,
        }
    }
  }

  /**
   * Retry mechanism for failed requests
   */
  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    maxAttempts: number = API_CONFIG.RETRY.MAX_ATTEMPTS,
  ): Promise<T> {
    let lastError: any

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await requestFn()
      } catch (error: any) {
        lastError = error

        // Don't retry for certain error types
        if (
          error.response?.status === API_CONFIG.ERROR_CODES.UNAUTHORIZED ||
          error.response?.status === API_CONFIG.ERROR_CODES.FORBIDDEN ||
          error.response?.status === API_CONFIG.ERROR_CODES.VALIDATION_ERROR
        ) {
          break
        }

        // Don't retry on last attempt
        if (attempt === maxAttempts) {
          break
        }

        // Calculate delay with exponential backoff
        const delay = API_CONFIG.RETRY.DELAY * Math.pow(API_CONFIG.RETRY.BACKOFF_FACTOR, attempt - 1)
        await new Promise((resolve) => setTimeout(resolve, delay))

        if (getEnvironmentConfig().DEBUG_REQUESTS) {
          console.log(`[API] Retrying request (attempt ${attempt + 1}/${maxAttempts}) after ${delay}ms`)
        }
      }
    }

    throw lastError
  }

  /**
   * Make HTTP request
   */
  private async makeRequest<T = any>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    // Apply request interceptors
    const processedConfig = this.applyRequestInterceptors(config)

    // Build URL
    const url = this.buildUrl(processedConfig.url, processedConfig.params)

    // Prepare fetch options
    const fetchOptions: RequestInit = {
      method: processedConfig.method,
      headers: processedConfig.headers as HeadersInit,
      signal: AbortSignal.timeout(processedConfig.timeout || API_CONFIG.TIMEOUTS.DEFAULT),
    }

    // Add body for non-GET requests
    if (processedConfig.method !== "GET" && processedConfig.data) {
      if (processedConfig.headers?.["Content-Type"]?.includes("multipart/form-data")) {
        fetchOptions.body = processedConfig.data // FormData
      } else {
        fetchOptions.body = JSON.stringify(processedConfig.data)
      }
    }

    try {
      const response = await fetch(url, fetchOptions)

      // Parse response
      let data: any
      const contentType = response.headers.get("content-type")

      if (contentType?.includes("application/json")) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      // Handle HTTP error status
      if (!response.ok) {
        throw {
          response: {
            status: response.status,
            data,
          },
        }
      }

      // Apply response interceptors
      const processedResponse = this.applyResponseInterceptors(data)

      return processedResponse
    } catch (error: any) {
      // Handle timeout
      if (error.name === "TimeoutError") {
        throw {
          success: false,
          message: "Permintaan timeout. Silakan coba lagi.",
          error: API_CONFIG.ERROR_CODES.TIMEOUT,
        }
      }

      this.handleError(error)
    }
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, options: Partial<ApiRequestConfig> = {}): Promise<ApiResponse<T>> {
    return this.retryRequest(() =>
      this.makeRequest<T>({
        method: "GET",
        url,
        ...options,
      }),
    )
  }

  /**
   * POST request
   */
  async post<T = any>(url: string, data?: any, options: Partial<ApiRequestConfig> = {}): Promise<ApiResponse<T>> {
    return this.retryRequest(() =>
      this.makeRequest<T>({
        method: "POST",
        url,
        data,
        ...options,
      }),
    )
  }

  /**
   * PUT request
   */
  async put<T = any>(url: string, data?: any, options: Partial<ApiRequestConfig> = {}): Promise<ApiResponse<T>> {
    return this.retryRequest(() =>
      this.makeRequest<T>({
        method: "PUT",
        url,
        data,
        ...options,
      }),
    )
  }

  /**
   * PATCH request
   */
  async patch<T = any>(url: string, data?: any, options: Partial<ApiRequestConfig> = {}): Promise<ApiResponse<T>> {
    return this.retryRequest(() =>
      this.makeRequest<T>({
        method: "PATCH",
        url,
        data,
        ...options,
      }),
    )
  }

  /**
   * DELETE request
   */
  async delete<T = any>(url: string, options: Partial<ApiRequestConfig> = {}): Promise<ApiResponse<T>> {
    return this.retryRequest(() =>
      this.makeRequest<T>({
        method: "DELETE",
        url,
        ...options,
      }),
    )
  }

  /**
   * Upload file
   */
  async upload<T = any>(
    url: string,
    file: File,
    additionalData?: Record<string, any>,
    options: Partial<ApiRequestConfig> = {},
  ): Promise<ApiResponse<T>> {
    const formData = new FormData()
    formData.append("file", file)

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value))
        }
      })
    }

    return this.makeRequest<T>({
      method: "POST",
      url,
      data: formData,
      headers: {
        ...API_CONFIG.HEADERS.MULTIPART,
      },
      timeout: API_CONFIG.TIMEOUTS.UPLOAD,
      ...options,
    })
  }

  /**
   * Download file with improved error handling
   */
  async download(url: string, filename?: string): Promise<void> {
    try {
      const token = this.getStoredToken()
      const headers: Record<string, string> = {}

      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      if (getEnvironmentConfig().DEBUG_REQUESTS) {
        console.log(`[API] Download request:`, { url, headers, filename })
      }

      const response = await fetch(this.buildUrl(url), {
        method: "GET",
        headers,
        signal: AbortSignal.timeout(API_CONFIG.TIMEOUTS.UPLOAD), // Use longer timeout for downloads
      })

      if (getEnvironmentConfig().DEBUG_REQUESTS) {
        console.log(`[API] Download response:`, {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
        })
      }

      if (!response.ok) {
        let errorMessage = `Download failed with status ${response.status}`
        let errorData = null

        try {
          const errorText = await response.text()
          if (errorText) {
            try {
              errorData = JSON.parse(errorText)
              errorMessage = errorData.message || errorMessage
            } catch {
              errorMessage = errorText
            }
          }
        } catch (parseError) {
          // Ignore parse errors for error response
        }

        throw new Error(`${errorMessage}${errorData ? `: ${JSON.stringify(errorData)}` : ""}`)
      }

      // Check if response has content
      const contentLength = response.headers.get("content-length")
      if (contentLength === "0") {
        throw new Error("File is empty or not found")
      }

      const blob = await response.blob()

      if (blob.size === 0) {
        throw new Error("Downloaded file is empty")
      }

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = downloadUrl

      // Set filename from response header or use provided filename
      const contentDisposition = response.headers.get("content-disposition")
      let downloadFilename = filename || "download"

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
        if (filenameMatch && filenameMatch[1]) {
          downloadFilename = filenameMatch[1].replace(/['"]/g, "")
        }
      }

      link.download = downloadFilename

      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Cleanup
      window.URL.revokeObjectURL(downloadUrl)

      if (getEnvironmentConfig().DEBUG_REQUESTS) {
        console.log(`[API] Download completed:`, { filename: downloadFilename, size: blob.size })
      }
    } catch (error: any) {
      console.error("Download error:", error)

      // Provide more specific error messages
      let errorMessage = "Gagal mengunduh file"

      if (error.name === "TimeoutError") {
        errorMessage = "Download timeout. File mungkin terlalu besar atau koneksi lambat."
      } else if (error.message?.includes("404")) {
        errorMessage = "File tidak ditemukan di server."
      } else if (error.message?.includes("403")) {
        errorMessage = "Anda tidak memiliki akses untuk mengunduh file ini."
      } else if (error.message?.includes("401")) {
        errorMessage = "Sesi Anda telah berakhir. Silakan login kembali."
      } else if (error.message) {
        errorMessage = error.message
      }

      throw {
        success: false,
        message: errorMessage,
        error: "DOWNLOAD_ERROR",
        originalError: error,
      }
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<ApiResponse> {
    return this.get("/health")
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(API_CONFIG.AUTH.TOKEN_KEY, token)
    }
  }

  /**
   * Clear authentication token
   */
  clearAuthToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(API_CONFIG.AUTH.TOKEN_KEY)
      localStorage.removeItem(API_CONFIG.AUTH.USER_KEY)
      localStorage.removeItem(API_CONFIG.AUTH.REFRESH_TOKEN_KEY)
    }
  }

  /**
   * Check if client is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getStoredToken()
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
export default apiClient
