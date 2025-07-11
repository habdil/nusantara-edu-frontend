import type { SchoolKpi } from "@/types/kpi"
import { apiClient } from "@/services/api"
import type { ApiResponse } from "@/services/api/types"

// Base URL for the API - menggunakan environment variable yang sama dengan academic
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

// API Endpoints untuk KPI
const API_ENDPOINTS = {
  KPI: `${API_BASE_URL}/api/kpi`,
  KPI_STATISTICS: `${API_BASE_URL}/api/kpi/statistics`,
  KPI_CRITICAL: `${API_BASE_URL}/api/kpi/critical`,
  KPI_EXPORT: `${API_BASE_URL}/api/kpi/export`,
  KPI_CATEGORY: `${API_BASE_URL}/api/kpi/category`,
  KPI_PRIORITY: `${API_BASE_URL}/api/kpi/priority`
}

export const kpiApi = {
  // Get KPIs for specific academic year and period
  getKPIs: async (params?: {
    academicYear?: string
    period?: string
    kpiCategory?: string
    priority?: number
    trend?: string
  }): Promise<SchoolKpi[]> => {
    try {
      const response: ApiResponse<SchoolKpi[]> = await apiClient.get(`${API_BASE_URL}/api/kpi`, {
        params,
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil data KPI")
      }

      return response.data
    } catch (error: any) {
      console.error('Error fetching KPIs:', error)
      throw error
    }
  },

  // Get KPI by ID
  getKPIById: async (id: number): Promise<SchoolKpi | null> => {
    try {
      const response: ApiResponse<SchoolKpi> = await apiClient.get(`${API_BASE_URL}/api/kpi/${id}`, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil data KPI")
      }

      return response.data
    } catch (error: any) {
      if (error.message?.includes('404') || error.message?.includes('tidak ditemukan')) {
        return null
      }
      console.error('Error fetching KPI by ID:', error)
      throw error
    }
  },

  // Get KPIs by category
  getKPIsByCategory: async (category: string): Promise<SchoolKpi[]> => {
    try {
      const response: ApiResponse<SchoolKpi[]> = await apiClient.get(`${API_BASE_URL}/api/kpi/category/${encodeURIComponent(category)}`, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil data KPI berdasarkan kategori")
      }

      return response.data
    } catch (error: any) {
      console.error('Error fetching KPIs by category:', error)
      throw error
    }
  },

  // Get KPIs by priority
  getKPIsByPriority: async (priority: number): Promise<SchoolKpi[]> => {
    try {
      const response: ApiResponse<SchoolKpi[]> = await apiClient.get(`${API_BASE_URL}/api/kpi/priority/${priority}`, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil data KPI berdasarkan prioritas")
      }

      return response.data
    } catch (error: any) {
      console.error('Error fetching KPIs by priority:', error)
      throw error
    }
  },

  // Get critical KPIs (high priority + low performance)
  getCriticalKPIs: async (): Promise<SchoolKpi[]> => {
    try {
      const response: ApiResponse<SchoolKpi[]> = await apiClient.get(`${API_BASE_URL}/api/kpi/critical`, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil data KPI kritis")
      }

      return response.data
    } catch (error: any) {
      console.error('Error fetching critical KPIs:', error)
      throw error
    }
  },

  // Create new KPI
  createKPI: async (kpi: Omit<SchoolKpi, 'id' | 'schoolId' | 'createdAt' | 'updatedAt'>): Promise<SchoolKpi> => {
    try {
      // Transform frontend format to backend format if needed
      const backendKPI = {
        kpiCategory: kpi.kpiCategory,
        kpiName: kpi.kpiName,
        academicYear: kpi.academicYear,
        period: kpi.period,
        targetValue: kpi.targetValue,
        achievedValue: kpi.achievedValue,
        achievementPercentage: kpi.achievementPercentage,
        trend: kpi.trend,
        priority: kpi.priority,
        analysis: kpi.analysis
      }

      const response: ApiResponse<SchoolKpi> = await apiClient.post(`${API_BASE_URL}/api/kpi`, backendKPI, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal membuat KPI baru")
      }

      return response.data
    } catch (error: any) {
      console.error('Error creating KPI:', error)
      throw error
    }
  },

  // Update KPI
  updateKPI: async (id: number, updates: Partial<Omit<SchoolKpi, 'id' | 'schoolId' | 'createdAt' | 'updatedAt'>>): Promise<SchoolKpi | null> => {
    try {
      // Transform frontend format to backend format if needed
      const backendUpdates: any = {}
      if (updates.kpiCategory !== undefined) backendUpdates.kpiCategory = updates.kpiCategory
      if (updates.kpiName !== undefined) backendUpdates.kpiName = updates.kpiName
      if (updates.targetValue !== undefined) backendUpdates.targetValue = updates.targetValue
      if (updates.achievedValue !== undefined) backendUpdates.achievedValue = updates.achievedValue
      if (updates.achievementPercentage !== undefined) backendUpdates.achievementPercentage = updates.achievementPercentage
      if (updates.trend !== undefined) backendUpdates.trend = updates.trend
      if (updates.priority !== undefined) backendUpdates.priority = updates.priority
      if (updates.analysis !== undefined) backendUpdates.analysis = updates.analysis

      const response: ApiResponse<SchoolKpi> = await apiClient.put(`${API_BASE_URL}/api/kpi/${id}`, backendUpdates, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal memperbarui KPI")
      }

      return response.data
    } catch (error: any) {
      if (error.message?.includes('404') || error.message?.includes('tidak ditemukan')) {
        return null
      }
      console.error('Error updating KPI:', error)
      throw error
    }
  },

  // Delete KPI
  deleteKPI: async (id: number): Promise<boolean> => {
    try {
      const response: ApiResponse<void> = await apiClient.delete(`${API_BASE_URL}/api/kpi/${id}`, {
        requireAuth: true,
      })

      if (!response.success) {
        throw new Error(response.message || "Gagal menghapus KPI")
      }

      return true
    } catch (error: any) {
      if (error.message?.includes('404') || error.message?.includes('tidak ditemukan')) {
        return false
      }
      console.error('Error deleting KPI:', error)
      throw error
    }
  },

  // Get KPI statistics
  getKPIStatistics: async (params?: {
    academicYear?: string
    period?: string
    includeAnalysis?: boolean
  }): Promise<{
    totalKPIs: number
    averageAchievement: number
    excellentCount: number
    goodCount: number
    needsAttentionCount: number
    criticalCount: number
    byCategory: Record<string, {
      count: number
      averageAchievement: number
    }>
  }> => {
    try {
      const response: ApiResponse<{
        totalKPIs: number
        averageAchievement: number
        excellentCount: number
        goodCount: number
        needsAttentionCount: number
        criticalCount: number
        byCategory: Record<string, {
          count: number
          averageAchievement: number
        }>
      }> = await apiClient.get(`${API_BASE_URL}/api/kpi/statistics`, {
        params,
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil statistik KPI")
      }

      return response.data
    } catch (error: any) {
      console.error('Error fetching KPI statistics:', error)
      throw error
    }
  },

  // Export KPI report
  exportKPIReport: async (params: {
    academicYear: string
    period: string
    format?: 'csv' | 'excel' | 'pdf'
    categories?: string[]
  }): Promise<void> => {
    try {
      // Use fetch directly for file download since apiClient does not support responseType: 'blob'
      const token = localStorage.getItem('token') // or get token from your auth provider
      const query = new URLSearchParams({
        academicYear: params.academicYear,
        period: params.period,
        format: params.format || 'csv',
        ...(params.categories ? { categories: params.categories.join(',') } : {})
      }).toString()
      const url = `${API_BASE_URL}/api/kpi/export?${query}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })

      if (!response.ok) {
        throw new Error('Gagal mengexport laporan KPI')
      }

      // Handle file download
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = `KPI_Report_${params.academicYear}_${params.period.replace(' ', '_')}.${params.format || 'csv'}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(downloadUrl)

    } catch (error: any) {
      console.error('Error exporting KPI report:', error)
      throw error
    }
  }
}