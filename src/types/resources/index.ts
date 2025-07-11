export type ConditionStatus = "good" | "minor_damage" | "major_damage" | "under_repair"

export interface Asset {
  id: number
  schoolId: number
  assetCode: string
  assetName: string
  assetCategory: string
  description?: string
  purchaseDate: Date
  purchasePrice: number
  currentValue?: number
  condition: ConditionStatus
  location?: string
  supplier?: string
  warrantyExpiry?: Date
  qrCode?: string
  assetPhoto?: string
  createdAt: Date
  updatedAt?: Date
}

export interface AssetMaintenance {
  id: number
  assetId: number
  maintenanceDate: Date
  maintenanceType: string
  description?: string
  cost?: number
  technician?: string
  maintenanceResult?: string
  nextMaintenanceDate?: Date
  createdAt: Date
  updatedAt?: Date
}

export interface Facility {
  id: number
  schoolId: number
  facilityName: string
  facilityType: string
  capacity?: number
  location?: string
  condition?: ConditionStatus
  notes?: string
  facilityPhoto?: string
  createdAt: Date
  updatedAt?: Date
}

export interface SchoolFinance {
  id: number
  schoolId: number
  budgetYear: string
  period: string
  budgetCategory: string
  budgetAmount: number
  usedAmount: number
  remainingAmount: number
  notes?: string
  approvalStatus?: boolean
  approvedBy?: number
  createdAt: Date
  updatedAt?: Date
}

export interface FinancialTransaction {
  id: number
  schoolFinanceId: number
  transactionDate: Date
  transactionType: string
  amount: number
  description?: string
  category?: string
  vendor?: string
  receiptNumber?: string
  approvalStatus?: string
  createdAt: Date
  updatedAt?: Date
}
