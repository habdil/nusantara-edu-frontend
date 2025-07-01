// src/services/api/utils.ts

export class ApiUtils {
  /**
   * Build full URL with query parameters
   */
  static buildUrl(
    baseURL: string,
    endpoint: string,
    params?: Record<string, string | number | boolean | null | undefined>
  ): string {
    let url = endpoint.startsWith("http") ? endpoint : `${baseURL}${endpoint}`

    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        // Only append non-null, non-undefined, non-empty values
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
   * Parse response based on content type
   */
  static async parseResponse(response: Response): Promise<any> {
    const contentType = response.headers.get("content-type")

    if (contentType?.includes("application/json")) {
      return await response.json()
    } else {
      return await response.text()
    }
  }

  /**
   * Prepare fetch options for request
   */
  static prepareFetchOptions(
    method: string,
    headers: Record<string, string>,
    data?: any,
    timeout?: number
  ): RequestInit {
    const fetchOptions: RequestInit = {
      method,
      headers: headers as HeadersInit,
      signal: AbortSignal.timeout(timeout || 30000),
    }

    // Add body for non-GET requests
    if (method !== "GET" && data) {
      if (headers["Content-Type"]?.includes("multipart/form-data")) {
        fetchOptions.body = data // FormData
      } else {
        fetchOptions.body = JSON.stringify(data)
      }
    }

    return fetchOptions
  }

  /**
   * Extract error message from various response formats
   */
  static extractErrorMessage(data: any, defaultMessage: string): string {
    if (!data) return defaultMessage

    if (typeof data === 'string') return data
    if (typeof data === 'object') {
      if (data.message) return data.message
      if (data.error) return data.error
      if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
        return data.errors[0].message || data.errors[0]
      }
    }

    return defaultMessage
  }
}