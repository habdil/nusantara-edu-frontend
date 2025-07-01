// src/services/api/client.ts

import API_CONFIG from "@/config/api.config"
import { ApiInterceptors } from "./interceptors"
import { ApiErrorHandler } from "./error-handler"
import { ApiRetryManager } from "./retry-manager"
import { ApiUtils } from "./utils"
import type { ApiResponse, ApiRequestConfig } from "./types"

export class ApiClient {
  private baseURL: string
  private interceptors: ApiInterceptors

  constructor() {
    this.baseURL = `${API_CONFIG.BASE_URL}${API_CONFIG.API_PREFIX}`
    this.interceptors = new ApiInterceptors()
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: (config: ApiRequestConfig) => ApiRequestConfig): void {
    this.interceptors.addRequestInterceptor(interceptor)
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: (response: any) => any): void {
    this.interceptors.addResponseInterceptor(interceptor)
  }

  /**
   * Make HTTP request
   */
  private async makeRequest<T = any>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    // Apply request interceptors
    const processedConfig = this.interceptors.applyRequestInterceptors(config)

    // Build URL
    const url = ApiUtils.buildUrl(this.baseURL, processedConfig.url, processedConfig.params)

    // Prepare fetch options
    const fetchOptions = ApiUtils.prepareFetchOptions(
      processedConfig.method,
      processedConfig.headers || {},
      processedConfig.data,
      processedConfig.timeout
    )

    try {
      const response = await fetch(url, fetchOptions)

      // Parse response
      const data = await ApiUtils.parseResponse(response)

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
      const processedResponse = this.interceptors.applyResponseInterceptors(data)

      return processedResponse
    } catch (error: any) {
      // Handle timeout
      if (error.name === "TimeoutError") {
        ApiErrorHandler.handleTimeout()
      }

      ApiErrorHandler.handleError(error)
    }
  }

  /**
   * GET request
   */
  async get<T = any>(url: string, options: Partial<ApiRequestConfig> = {}): Promise<ApiResponse<T>> {
    return ApiRetryManager.retryRequest(() =>
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
    return ApiRetryManager.retryRequest(() =>
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
    return ApiRetryManager.retryRequest(() =>
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
    return ApiRetryManager.retryRequest(() =>
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
    return ApiRetryManager.retryRequest(() =>
      this.makeRequest<T>({
        method: "DELETE",
        url,
        ...options,
      }),
    )
  }

  /**
   * Authentication methods
   */
  setAuthToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(API_CONFIG.AUTH.TOKEN_KEY, token)
    }
  }

  clearAuthToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(API_CONFIG.AUTH.TOKEN_KEY)
      localStorage.removeItem(API_CONFIG.AUTH.USER_KEY)
      localStorage.removeItem(API_CONFIG.AUTH.REFRESH_TOKEN_KEY)
    }
  }

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false
    return !!localStorage.getItem(API_CONFIG.AUTH.TOKEN_KEY)
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<ApiResponse> {
    return this.get("/health")
  }
}