/**
 * API Endpoints untuk Authentication NusantaraEdu
 */

export const ENDPOINTS = {
  // Health
  HEALTH: '/health',
  
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    DASHBOARD_INFO: '/auth/dashboard-info',
  }
} as const;