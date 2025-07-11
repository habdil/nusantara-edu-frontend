import type { Asset, AssetMaintenance, ConditionStatus } from "@/types/resources"

// Dummy data for assets based on Prisma schema
const mockAssets: Asset[] = [
  {
    id: 1,
    schoolId: 1,
    assetCode: "AST-001",
    assetName: "Laptop Dell Inspiron 15",
    assetCategory: "Electronics",
    description: "Laptop untuk kegiatan administrasi",
    purchaseDate: new Date("2023-01-15"),
    purchasePrice: 8500000,
    currentValue: 7000000,
    condition: "good" as ConditionStatus,
    location: "Ruang Kepala Sekolah",
    supplier: "PT. Teknologi Maju",
    warrantyExpiry: new Date("2025-01-15"),
    qrCode: "QR-AST-001",
    assetPhoto: "/placeholder.svg?height=200&width=200",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: 2,
    schoolId: 1,
    assetCode: "AST-002",
    assetName: "Proyektor Epson EB-X41",
    assetCategory: "Electronics",
    description: "Proyektor untuk presentasi kelas",
    purchaseDate: new Date("2023-03-20"),
    purchasePrice: 4500000,
    currentValue: 3800000,
    condition: "good" as ConditionStatus,
    location: "Ruang Kelas 6A",
    supplier: "CV. Media Edukasi",
    warrantyExpiry: new Date("2025-03-20"),
    qrCode: "QR-AST-002",
    assetPhoto: "/placeholder.svg?height=200&width=200",
    createdAt: new Date("2023-03-20"),
    updatedAt: new Date("2024-03-20"),
  },
  {
    id: 3,
    schoolId: 1,
    assetCode: "AST-003",
    assetName: "Meja Guru Kayu Jati",
    assetCategory: "Furniture",
    description: "Meja guru untuk ruang kelas",
    purchaseDate: new Date("2022-08-10"),
    purchasePrice: 1200000,
    currentValue: 900000,
    condition: "minor_damage" as ConditionStatus,
    location: "Ruang Kelas 5B",
    supplier: "UD. Furniture Jaya",
    warrantyExpiry: new Date("2024-08-10"),
    qrCode: "QR-AST-003",
    assetPhoto: "/placeholder.svg?height=200&width=200",
    createdAt: new Date("2022-08-10"),
    updatedAt: new Date("2024-08-10"),
  },
  {
    id: 4,
    schoolId: 1,
    assetCode: "AST-004",
    assetName: "AC Split 1.5 PK",
    assetCategory: "Electronics",
    description: "Air conditioner untuk ruang kepala sekolah",
    purchaseDate: new Date("2023-06-15"),
    purchasePrice: 3200000,
    currentValue: 2800000,
    condition: "good" as ConditionStatus,
    location: "Ruang Kepala Sekolah",
    supplier: "PT. Elektronik Sejahtera",
    warrantyExpiry: new Date("2026-06-15"),
    qrCode: "QR-AST-004",
    assetPhoto: "/placeholder.svg?height=200&width=200",
    createdAt: new Date("2023-06-15"),
    updatedAt: new Date("2024-06-15"),
  },
]

const mockMaintenanceRecords: AssetMaintenance[] = [
  {
    id: 1,
    assetId: 1,
    maintenanceDate: new Date("2024-01-15"),
    maintenanceType: "Preventive",
    description: "Pembersihan dan update software",
    cost: 150000,
    technician: "Ahmad Teknisi",
    maintenanceResult: "Berhasil, laptop berjalan normal",
    nextMaintenanceDate: new Date("2024-07-15"),
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: 2,
    assetId: 3,
    maintenanceDate: new Date("2024-02-20"),
    maintenanceType: "Corrective",
    description: "Perbaikan laci yang rusak",
    cost: 200000,
    technician: "Budi Furniture",
    maintenanceResult: "Laci sudah diperbaiki",
    nextMaintenanceDate: new Date("2024-08-20"),
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-02-20"),
  },
]

export const assetsApi = {
  // Get all assets
  getAssets: async (): Promise<Asset[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return mockAssets
  },

  // Get asset by ID
  getAssetById: async (id: number): Promise<Asset | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockAssets.find((asset) => asset.id === id) || null
  },

  // Get assets by category
  getAssetsByCategory: async (category: string): Promise<Asset[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return mockAssets.filter((asset) => asset.assetCategory === category)
  },

  // Get maintenance records for an asset
  getMaintenanceRecords: async (assetId: number): Promise<AssetMaintenance[]> => {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return mockMaintenanceRecords.filter((record) => record.assetId === assetId)
  },

  // Get all maintenance records
  getAllMaintenanceRecords: async (): Promise<AssetMaintenance[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return mockMaintenanceRecords
  },

  // Add new asset
  addAsset: async (asset: Omit<Asset, "id" | "createdAt" | "updatedAt">): Promise<Asset> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newAsset: Asset = {
      ...asset,
      id: mockAssets.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockAssets.push(newAsset)
    return newAsset
  },

  // Update asset
  updateAsset: async (id: number, updates: Partial<Asset>): Promise<Asset | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const index = mockAssets.findIndex((asset) => asset.id === id)
    if (index === -1) return null

    mockAssets[index] = { ...mockAssets[index], ...updates, updatedAt: new Date() }
    return mockAssets[index]
  },

  // Delete asset
  deleteAsset: async (id: number): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const index = mockAssets.findIndex((asset) => asset.id === id)
    if (index === -1) return false

    mockAssets.splice(index, 1)
    return true
  },
}
