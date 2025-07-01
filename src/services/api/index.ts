// src/services/api/index.ts

import { ApiClient } from "./client"

// Export types
export type { ApiResponse, ApiRequestConfig, PaginatedResponse, ApiError } from "./types"

// Export utilities  
export { ApiUtils } from "./utils"
export { ApiErrorHandler } from "./error-handler"
export { ApiRetryManager } from "./retry-manager"
export { ApiInterceptors } from "./interceptors"

// Create and export singleton instance
export const apiClient = new ApiClient()
export default apiClient

// Re-export for backward compatibility
export { apiClient as ApiClient }