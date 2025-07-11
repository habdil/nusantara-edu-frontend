import type { Facility, ConditionStatus } from "@/types/resources"
import { apiClient } from "@/services/api"
import type { ApiResponse } from "@/services/api/types"

// Base URL for the API - menggunakan environment variable yang sama
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

// Interface untuk facility usage/booking
export interface FacilityUsage {
  id: number
  facilityId: number
  date: Date
  startTime: Date
  endTime: Date
  purpose: string
  userId?: number
  approvalStatus?: string
  notes?: string
  createdAt: Date
  updatedAt?: Date
  facility?: {
    facilityName: string
    facilityType: string
  }
  user?: {
    fullName: string
  }
}

export const facilitiesApi = {
  // Get all facilities
  getFacilities: async (params?: {
    facilityType?: string
    condition?: string
    search?: string
    page?: number
    limit?: number
  }): Promise<Facility[]> => {
    try {
      const response: ApiResponse<Facility[]> = await apiClient.get(`${API_BASE_URL}/api/facilities`, {
        params,
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil data fasilitas")
      }

      return response.data
    } catch (error: any) {
      console.error('Error fetching facilities:', error)
      throw error
    }
  },

  // Get facility by ID
  getFacilityById: async (id: number): Promise<Facility | null> => {
    try {
      const response: ApiResponse<Facility> = await apiClient.get(`${API_BASE_URL}/api/facilities/${id}`, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil data fasilitas")
      }

      return response.data
    } catch (error: any) {
      if (error.message?.includes('404')) {
        return null
      }
      console.error('Error fetching facility by ID:', error)
      throw error
    }
  },

  // Get facilities by type
  getFacilitiesByType: async (type: string): Promise<Facility[]> => {
    try {
      const response: ApiResponse<Facility[]> = await apiClient.get(`${API_BASE_URL}/api/facilities/type/${encodeURIComponent(type)}`, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil data fasilitas berdasarkan tipe")
      }

      return response.data
    } catch (error: any) {
      console.error('Error fetching facilities by type:', error)
      throw error
    }
  },

  // Add new facility
  addFacility: async (facility: Omit<Facility, "id" | "createdAt" | "updatedAt">): Promise<Facility> => {
    try {
      // Transform frontend format to backend format
      const backendFacility = {
        facilityName: facility.facilityName,
        facilityType: facility.facilityType,
        capacity: facility.capacity,
        location: facility.location,
        condition: facility.condition,
        notes: facility.notes,
        facilityPhoto: facility.facilityPhoto
      }

      const response: ApiResponse<Facility> = await apiClient.post(`${API_BASE_URL}/api/facilities`, backendFacility, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal menambahkan fasilitas")
      }

      return response.data
    } catch (error: any) {
      console.error('Error adding facility:', error)
      throw error
    }
  },

  // Update facility
  updateFacility: async (id: number, updates: Partial<Facility>): Promise<Facility | null> => {
    try {
      // Transform frontend format to backend format
      const backendUpdates: any = {}
      if (updates.facilityName !== undefined) backendUpdates.facilityName = updates.facilityName
      if (updates.facilityType !== undefined) backendUpdates.facilityType = updates.facilityType
      if (updates.capacity !== undefined) backendUpdates.capacity = updates.capacity
      if (updates.location !== undefined) backendUpdates.location = updates.location
      if (updates.condition !== undefined) backendUpdates.condition = updates.condition
      if (updates.notes !== undefined) backendUpdates.notes = updates.notes
      if (updates.facilityPhoto !== undefined) backendUpdates.facilityPhoto = updates.facilityPhoto

      const response: ApiResponse<Facility> = await apiClient.put(`${API_BASE_URL}/api/facilities/${id}`, backendUpdates, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal memperbarui fasilitas")
      }

      return response.data
    } catch (error: any) {
      if (error.message?.includes('404')) {
        return null
      }
      console.error('Error updating facility:', error)
      throw error
    }
  },

  // Delete facility
  deleteFacility: async (id: number): Promise<boolean> => {
    try {
      const response: ApiResponse<void> = await apiClient.delete(`${API_BASE_URL}/api/facilities/${id}`, {
        requireAuth: true,
      })

      if (!response.success) {
        throw new Error(response.message || "Gagal menghapus fasilitas")
      }

      return true
    } catch (error: any) {
      if (error.message?.includes('404')) {
        return false
      }
      console.error('Error deleting facility:', error)
      throw error
    }
  },

  // Get facility types
  getFacilityTypes: async (): Promise<string[]> => {
    try {
      const response: ApiResponse<string[]> = await apiClient.get(`${API_BASE_URL}/api/facilities/types`, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil tipe fasilitas")
      }

      return response.data
    } catch (error: any) {
      console.error('Error fetching facility types:', error)
      throw error
    }
  },

  // Get facility statistics
  getFacilityStats: async (): Promise<{
    totalFacilities: number
    totalCapacity: number
    facilitiesByType: Array<{ type: string; count: number }>
    facilitiesByCondition: Array<{ condition: string; count: number }>
    currentMonthUsage: number
  }> => {
    try {
      const response: ApiResponse<{
        totalFacilities: number
        totalCapacity: number
        facilitiesByType: Array<{ type: string; count: number }>
        facilitiesByCondition: Array<{ condition: string; count: number }>
        currentMonthUsage: number
      }> = await apiClient.get(`${API_BASE_URL}/api/facilities/stats`, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil statistik fasilitas")
      }

      return response.data
    } catch (error: any) {
      console.error('Error fetching facility statistics:', error)
      throw error
    }
  },

  // Get facility utilization report
  getFacilityUtilizationReport: async (params?: {
    dateFrom?: string
    dateTo?: string
  }): Promise<Array<{
    facilityId: number
    facilityName: string
    facilityType: string
    capacity?: number
    usageCount: number
  }>> => {
    try {
      const response: ApiResponse<Array<{
        facilityId: number
        facilityName: string
        facilityType: string
        capacity?: number
        usageCount: number
      }>> = await apiClient.get(`${API_BASE_URL}/api/facilities/utilization-report`, {
        params,
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil laporan pemanfaatan fasilitas")
      }

      return response.data
    } catch (error: any) {
      console.error('Error fetching facility utilization report:', error)
      throw error
    }
  },

  // Get facility usage records
  getFacilityUsage: async (params?: {
    facilityId?: number
    dateFrom?: string
    dateTo?: string
    approvalStatus?: string
    page?: number
    limit?: number
  }): Promise<FacilityUsage[]> => {
    try {
      const response: ApiResponse<FacilityUsage[]> = await apiClient.get(`${API_BASE_URL}/api/facilities/usage/all`, {
        params,
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil data penggunaan fasilitas")
      }

      return response.data
    } catch (error: any) {
      console.error('Error fetching facility usage:', error)
      throw error
    }
  },

  // Get facility usage by facility ID
  getFacilityUsageByFacilityId: async (facilityId: number): Promise<FacilityUsage[]> => {
    try {
      const response: ApiResponse<FacilityUsage[]> = await apiClient.get(`${API_BASE_URL}/api/facilities/${facilityId}/usage`, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil data penggunaan fasilitas")
      }

      return response.data
    } catch (error: any) {
      console.error('Error fetching facility usage by facility ID:', error)
      throw error
    }
  },

  // Add facility usage (booking)
  addFacilityUsage: async (usage: {
    facilityId: number
    date: Date | string
    startTime: Date | string
    endTime: Date | string
    purpose: string
    notes?: string
  }): Promise<FacilityUsage> => {
    try {
      const response: ApiResponse<FacilityUsage> = await apiClient.post(`${API_BASE_URL}/api/facilities/usage`, usage, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal menambahkan booking fasilitas")
      }

      return response.data
    } catch (error: any) {
      console.error('Error adding facility usage:', error)
      throw error
    }
  },

  // Update facility usage approval
  updateFacilityUsageApproval: async (usageId: number, approvalStatus: 'approved' | 'rejected' | 'pending'): Promise<FacilityUsage> => {
    try {
      const response: ApiResponse<FacilityUsage> = await apiClient.put(`${API_BASE_URL}/api/facilities/usage/${usageId}/approval`, {
        approvalStatus
      }, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengubah status persetujuan")
      }

      return response.data
    } catch (error: any) {
      console.error('Error updating facility usage approval:', error)
      throw error
    }
  },
}