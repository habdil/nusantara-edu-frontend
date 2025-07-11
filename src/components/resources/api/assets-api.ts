import type { Asset, AssetMaintenance, ConditionStatus } from "@/types/resources"
import { apiClient } from "@/services/api"
import type { ApiResponse } from "@/services/api/types"

// Base URL for the API - menggunakan environment variable yang sama dengan academic
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

// API Endpoints untuk assets
const API_ENDPOINTS = {
  ASSETS: `${API_BASE_URL}/api/assets`,
  MAINTENANCE: `${API_BASE_URL}/api/assets/maintenance`
}

export const assetsApi = {
  // Get all assets
  getAssets: async (params?: {
    category?: string
    condition?: string
    location?: string
    search?: string
    page?: number
    limit?: number
  }): Promise<Asset[]> => {
    try {
      const response: ApiResponse<Asset[]> = await apiClient.get(`${API_BASE_URL}/api/assets`, {
        params,
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil data aset")
      }

      return response.data
    } catch (error: any) {
      console.error('Error fetching assets:', error)
      throw error
    }
  },

  // Get asset by ID
  getAssetById: async (id: number): Promise<Asset | null> => {
    try {
      const response: ApiResponse<Asset> = await apiClient.get(`${API_BASE_URL}/api/assets/${id}`, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil data aset")
      }

      return response.data
    } catch (error: any) {
      if (error.message?.includes('404')) {
        return null
      }
      console.error('Error fetching asset by ID:', error)
      throw error
    }
  },

  // Get assets by category
  getAssetsByCategory: async (category: string): Promise<Asset[]> => {
    try {
      const response: ApiResponse<Asset[]> = await apiClient.get(`${API_BASE_URL}/api/assets/category/${encodeURIComponent(category)}`, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil data aset berdasarkan kategori")
      }

      return response.data
    } catch (error: any) {
      console.error('Error fetching assets by category:', error)
      throw error
    }
  },

  // Get maintenance records for an asset
  getMaintenanceRecords: async (assetId: number): Promise<AssetMaintenance[]> => {
    try {
      const response: ApiResponse<AssetMaintenance[]> = await apiClient.get(`${API_BASE_URL}/api/assets/${assetId}/maintenance`, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil data pemeliharaan aset")
      }

      return response.data
    } catch (error: any) {
      console.error('Error fetching maintenance records:', error)
      throw error
    }
  },

  // Get all maintenance records
  getAllMaintenanceRecords: async (): Promise<AssetMaintenance[]> => {
    try {
      const response: ApiResponse<AssetMaintenance[]> = await apiClient.get(`${API_BASE_URL}/api/assets/maintenance/all`, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil semua data pemeliharaan")
      }

      return response.data
    } catch (error: any) {
      console.error('Error fetching all maintenance records:', error)
      throw error
    }
  },

  // Add new asset
  addAsset: async (asset: Omit<Asset, "id" | "createdAt" | "updatedAt">): Promise<Asset> => {
    try {
      // Transform frontend format to backend format
      const backendAsset = {
        assetCode: asset.assetCode,
        assetName: asset.assetName,
        assetCategory: asset.assetCategory,
        description: asset.description,
        acquisitionDate: asset.purchaseDate,
        acquisitionValue: asset.purchasePrice,
        usefulLife: 60, // Default useful life in months, can be made configurable
        condition: asset.condition,
        location: asset.location,
        notes: asset.description,
        qrCode: asset.qrCode,
        assetPhoto: asset.assetPhoto
      }

      const response: ApiResponse<Asset> = await apiClient.post(`${API_BASE_URL}/api/assets`, backendAsset, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal menambahkan aset")
      }

      return response.data
    } catch (error: any) {
      console.error('Error adding asset:', error)
      throw error
    }
  },

  // Update asset
  updateAsset: async (id: number, updates: Partial<Asset>): Promise<Asset | null> => {
    try {
      // Transform frontend format to backend format
      const backendUpdates: any = {}
      if (updates.assetName !== undefined) backendUpdates.assetName = updates.assetName
      if (updates.assetCategory !== undefined) backendUpdates.assetCategory = updates.assetCategory
      if (updates.description !== undefined) backendUpdates.description = updates.description
      if (updates.condition !== undefined) backendUpdates.condition = updates.condition
      if (updates.location !== undefined) backendUpdates.location = updates.location
      if (updates.qrCode !== undefined) backendUpdates.qrCode = updates.qrCode
      if (updates.assetPhoto !== undefined) backendUpdates.assetPhoto = updates.assetPhoto

      const response: ApiResponse<Asset> = await apiClient.put(`${API_BASE_URL}/api/assets/${id}`, backendUpdates, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal memperbarui aset")
      }

      return response.data
    } catch (error: any) {
      if (error.message?.includes('404')) {
        return null
      }
      console.error('Error updating asset:', error)
      throw error
    }
  },

  // Delete asset
  deleteAsset: async (id: number): Promise<boolean> => {
    try {
      const response: ApiResponse<void> = await apiClient.delete(`${API_BASE_URL}/api/assets/${id}`, {
        requireAuth: true,
      })

      if (!response.success) {
        throw new Error(response.message || "Gagal menghapus aset")
      }

      return true
    } catch (error: any) {
      if (error.message?.includes('404')) {
        return false
      }
      console.error('Error deleting asset:', error)
      throw error
    }
  },

  // Add maintenance record
  addMaintenanceRecord: async (maintenance: Omit<AssetMaintenance, "id" | "createdAt" | "updatedAt">): Promise<AssetMaintenance> => {
    try {
      const response: ApiResponse<AssetMaintenance> = await apiClient.post(`${API_BASE_URL}/api/assets/maintenance`, maintenance, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal menambahkan data pemeliharaan")
      }

      return response.data
    } catch (error: any) {
      console.error('Error adding maintenance record:', error)
      throw error
    }
  },

  // Get asset statistics
  getAssetStats: async (): Promise<{
    totalAssets: number
    totalValue: number
    assetsByCondition: Array<{ condition: string; count: number }>
    assetsByCategory: Array<{ category: string; count: number }>
  }> => {
    try {
      const response: ApiResponse<{
        totalAssets: number
        totalValue: number
        assetsByCondition: Array<{ condition: string; count: number }>
        assetsByCategory: Array<{ category: string; count: number }>
      }> = await apiClient.get(`${API_BASE_URL}/api/assets/stats`, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil statistik aset")
      }

      return response.data
    } catch (error: any) {
      console.error('Error fetching asset statistics:', error)
      throw error
    }
  },
}