// src/services/api/retry-manager.ts

import API_CONFIG, { getEnvironmentConfig } from "@/config/api.config"

export class ApiRetryManager {
  /**
   * Retry mechanism for failed requests with exponential backoff
   */
  static async retryRequest<T>(
    requestFn: () => Promise<T>,
    maxAttempts: number = API_CONFIG.RETRY?.MAX_ATTEMPTS || 3,
  ): Promise<T> {
    let lastError: any

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await requestFn()
      } catch (error: any) {
        lastError = error

        // Don't retry for certain error types
        if (this.shouldNotRetry(error)) {
          break
        }

        // Don't retry on last attempt
        if (attempt === maxAttempts) {
          break
        }

        // Calculate delay with exponential backoff
        const delay = this.calculateDelay(attempt)
        await this.sleep(delay)

        if (getEnvironmentConfig().DEBUG_REQUESTS) {
          console.log(`[API] Retrying request (attempt ${attempt + 1}/${maxAttempts}) after ${delay}ms`)
        }
      }
    }

    throw lastError
  }

  /**
   * Check if error should not be retried
   */
  private static shouldNotRetry(error: any): boolean {
    const nonRetryableStatuses = [401, 403, 400, 422] // UNAUTHORIZED, FORBIDDEN, VALIDATION_ERROR
    return nonRetryableStatuses.includes(error.response?.status)
  }

  /**
   * Calculate retry delay with exponential backoff
   */
  private static calculateDelay(attempt: number): number {
    const baseDelay = API_CONFIG.RETRY?.DELAY || 1000
    const backoffFactor = API_CONFIG.RETRY?.BACKOFF_FACTOR || 2
    return baseDelay * Math.pow(backoffFactor, attempt - 1)
  }

  /**
   * Sleep utility function
   */
  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}