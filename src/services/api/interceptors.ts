// src/services/api/interceptors.ts

import API_CONFIG, { getEnvironmentConfig } from "@/config/api.config"
import type { ApiRequestConfig } from "./types"

export class ApiInterceptors {
  private requestInterceptors: Array<(config: ApiRequestConfig) => ApiRequestConfig> = []
  private responseInterceptors: Array<(response: any) => any> = []

  constructor() {
    this.setupDefaultInterceptors()
  }

  /**
   * Setup default request and response interceptors
   */
  private setupDefaultInterceptors(): void {
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
        ...API_CONFIG.HEADERS.DEFAULT,
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
   * Apply request interceptors
   */
  applyRequestInterceptors(config: ApiRequestConfig): ApiRequestConfig {
    return this.requestInterceptors.reduce((acc, interceptor) => {
      return interceptor(acc)
    }, config)
  }

  /**
   * Apply response interceptors
   */
  applyResponseInterceptors(response: any): any {
    return this.responseInterceptors.reduce((acc, interceptor) => {
      return interceptor(acc)
    }, response)
  }

  /**
   * Get stored authentication token
   */
  private getStoredToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(API_CONFIG.AUTH.TOKEN_KEY)
  }
}