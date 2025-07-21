/**
 * API Configuration for NusantaraEdu
 * Management Information System for Elementary School Principals in Indonesia
 */

export const API_CONFIG = {
  // Base URLs
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  API_PREFIX: "/api",

  // Authentication
  AUTH: {
    TOKEN_KEY: "nusantara_edu_token",
    REFRESH_TOKEN_KEY: "nusantara_edu_refresh_token",
    USER_KEY: "nusantara_edu_user",
    TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutes in milliseconds
  },

  // Request timeouts
  TIMEOUTS: {
    DEFAULT: 10000, // 10 seconds
    UPLOAD: 30000, // 30 seconds for file uploads
    AUTH: 15000, // 15 seconds for authentication
  },

  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000, // 1 second
    BACKOFF_FACTOR: 2,
  },

  // Environment
  ENVIRONMENT: process.env.NODE_ENV || "development",

  // Headers
  HEADERS: {
    DEFAULT: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    MULTIPART: {
      Accept: "application/json",
    },
  },

  // Error codes
  ERROR_CODES: {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    VALIDATION_ERROR: 400,
    SERVER_ERROR: 500,
    NETWORK_ERROR: "NETWORK_ERROR",
    TIMEOUT: "TIMEOUT",
    RATE_LIMITED: 429,
  },
} as const

// API Endpoints - sesuai dokumentasi Postman
export const API_ENDPOINTS = {
  HEALTH: "/health",

  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    PROFILE: "/auth/profile",
    CHANGE_PASSWORD: "/auth/change-password",
    DASHBOARD_INFO: "/auth/dashboard-info",
    REFRESH_TOKEN: "/auth/refresh-token",
  },

  // Academic endpoints sesuai dokumentasi Postman
  ACADEMIC: {
    STUDENTS: "/academic/students",
    SUBJECTS: "/academic/subjects",
    TEACHERS: "/academic/teachers",
    ACADEMIC_RECORDS: "/academic/academic-records",
    BASIC_COMPETENCIES: "/academic/basic-competencies",
    STUDENT_ATTENDANCE: "/academic/student-attendance",
    STATS: "/academic/stats",
  },
} as const

// Development specific configurations
export const DEV_CONFIG = {
  ENABLE_LOGGING: true,
  MOCK_RESPONSES: false,
  DEBUG_REQUESTS: true,
  SHOW_NETWORK_ERRORS: true,
}

// Production specific configurations
export const PROD_CONFIG = {
  ENABLE_LOGGING: false,
  MOCK_RESPONSES: false,
  DEBUG_REQUESTS: false,
  SHOW_NETWORK_ERRORS: false,
}

// Get environment specific config
export const getEnvironmentConfig = () => {
  return API_CONFIG.ENVIRONMENT === "development" ? DEV_CONFIG : PROD_CONFIG
}

export default API_CONFIG
