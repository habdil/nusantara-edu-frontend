// KPI Types based on Prisma Schema

export interface SchoolKpi {
  id: number
  schoolId: number
  academicYear: string
  period: string
  kpiCategory: string
  kpiName: string
  targetValue?: number | null
  achievedValue?: number | null
  achievementPercentage?: number | null
  trend?: string | null // "increasing" | "stable" | "decreasing"
  priority?: number | null // 1-5, where 1 is highest priority
  analysis?: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export interface KPIStats {
  totalKPIs: number
  averageAchievement: number
  excellentCount: number // >= 90%
  goodCount: number // 70-89%
  needsAttentionCount: number // < 70%
  criticalCount: number // high priority + low performance
  byCategory: Record<string, {
    count: number
    averageAchievement: number
  }>
}

export interface KPIComparison {
  current: SchoolKpi
  previous?: SchoolKpi | null
  change?: number | null
  changePercentage?: number | null
  trend: "increasing" | "decreasing" | "stable"
}

export interface KPITarget {
  id: number
  kpiId: number
  targetValue: number
  targetDate: Date
  description?: string
  isActive: boolean
  createdAt: Date
  updatedAt?: Date | null
}

export interface KPIAnalysis {
  id: number
  kpiId: number
  analysisText: string
  recommendations: string[]
  actionItems: string[]
  riskFactors: string[]
  createdBy: number
  createdAt: Date
  updatedAt?: Date | null
}

// Enums for better type safety
export enum KPICategory {
  ACADEMIC = "Academic",
  OPERATIONAL = "Operational", 
  FINANCIAL = "Financial",
  RESOURCE = "Resource",
  INFRASTRUCTURE = "Infrastructure",
  HUMAN_RESOURCE = "Human Resource"
}

export enum KPITrend {
  INCREASING = "increasing",
  STABLE = "stable", 
  DECREASING = "decreasing"
}

export enum KPIPriority {
  VERY_HIGH = 1,
  HIGH = 2,
  MEDIUM = 3,
  LOW = 4,
  VERY_LOW = 5
}

export enum KPIStatus {
  EXCELLENT = "excellent", // >= 90%
  GOOD = "good", // 70-89%
  NEEDS_ATTENTION = "needs_attention", // 50-69%
  CRITICAL = "critical" // < 50%
}

// Chart data interfaces
export interface KPIChartData {
  name: string
  target: number
  achieved: number
  percentage: number
  category: string
}

export interface CategoryPerformance {
  category: string
  averagePerformance: number
  kpiCount: number
  excellentCount: number
  goodCount: number
  needsAttentionCount: number
}

export interface TrendData {
  period: string
  academicYear: string
  value: number
  target: number
  achievement: number
}

// Filter and search interfaces
export interface KPIFilters {
  academicYear?: string
  period?: string
  category?: KPICategory | string
  priority?: KPIPriority | number
  status?: KPIStatus
  minAchievement?: number
  maxAchievement?: number
  trend?: KPITrend
}

export interface KPISearchParams {
  query?: string
  filters?: KPIFilters
  sortBy?: 'kpiName' | 'achievementPercentage' | 'priority' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// API Response interfaces
export interface KPIResponse {
  data: SchoolKpi[]
  total: number
  page: number
  limit: number
  filters: KPIFilters
}

export interface KPIDetailResponse {
  kpi: SchoolKpi
  history: SchoolKpi[]
  analysis?: KPIAnalysis
  targets: KPITarget[]
  recommendations: string[]
}

// Action plan interfaces
export interface KPIActionPlan {
  id: number
  kpiId: number
  title: string
  description: string
  targetDate: Date
  assignedTo: number
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'high' | 'medium' | 'low'
  milestones: ActionPlanMilestone[]
  createdAt: Date
  updatedAt?: Date | null
}

export interface ActionPlanMilestone {
  id: number
  actionPlanId: number
  title: string
  description?: string
  targetDate: Date
  isCompleted: boolean
  completedAt?: Date | null
  createdAt: Date
  updatedAt?: Date | null
}