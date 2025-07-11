// Reports Types based on Prisma Schema

export interface Report {
  id: number
  schoolId: number
  reportTitle: string
  reportType: string
  reportPeriod: string
  academicYear: string
  fileFormat?: string | null
  fileUrl?: string | null
  createdBy?: number | null
  createdDate?: Date | null
  submissionStatus?: string | null
  submissionDate?: Date | null
  createdAt: Date
  updatedAt?: Date | null
}

export interface ReportTemplate {
  id: number
  templateName: string
  reportType: string
  description?: string | null
  sections: string[]
  frequency: string
  estimatedTime: string
  isActive: boolean
  createdAt: Date
  updatedAt?: Date | null
}

export interface ReportGenerationRequest {
  reportTitle: string
  reportType: string
  reportPeriod: string
  academicYear: string
  selectedSections: string[]
  includeCharts?: boolean
  includeAnalysis?: boolean
  includeRecommendations?: boolean
  fileFormat?: string
  description?: string
  customSections?: string
}

// Enums for better type safety
export enum ReportType {
  ACADEMIC = "Academic",
  FINANCIAL = "Financial",
  OPERATIONAL = "Operational",
  ASSET = "Asset",
  COMPLIANCE = "Compliance"
}

export enum ReportPeriod {
  WEEKLY = "Mingguan",
  MONTHLY = "Bulanan",
  QUARTERLY = "Triwulanan",
  SEMESTER = "Semesteran",
  ANNUAL = "Tahunan",
  CUSTOM = "Custom"
}

export enum ReportStatus {
  DRAFT = "draft",
  PENDING = "pending",
  SUBMITTED = "submitted",
  APPROVED = "approved",
  REJECTED = "rejected"
}

export enum FileFormat {
  PDF = "pdf",
  DOCX = "docx",
  XLSX = "xlsx",
  PPTX = "pptx"
}

// Report content interfaces
export interface ReportSection {
  id: string
  title: string
  content: string
  order: number
  includeCharts?: boolean
  chartData?: any[]
}

export interface ReportMetadata {
  author: string
  creationDate: Date
  lastModified: Date
  version: string
  status: ReportStatus
  approvals?: ReportApproval[]
}

export interface ReportApproval {
  id: number
  reportId: number
  approverName: string
  approvalDate: Date
  status: "approved" | "rejected"
  comments?: string
}

// Chart and visualization types
export interface ChartConfig {
  type: "bar" | "line" | "pie" | "area" | "scatter"
  title: string
  dataSource: string
  xAxis?: string
  yAxis?: string
  colors?: string[]
}

export interface VisualizationData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string[]
  }[]
}

// Filter and search interfaces
export interface ReportFilters {
  academicYear?: string
  reportType?: ReportType | string
  reportPeriod?: ReportPeriod | string
  status?: ReportStatus | string
  createdBy?: number
  dateFrom?: Date
  dateTo?: Date
}

export interface ReportSearchParams {
  query?: string
  filters?: ReportFilters
  sortBy?: 'reportTitle' | 'createdDate' | 'submissionDate' | 'reportType'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// API Response interfaces
export interface ReportsResponse {
  data: Report[]
  total: number
  page: number
  limit: number
  filters: ReportFilters
}

export interface ReportDetailResponse {
  report: Report
  sections: ReportSection[]
  metadata: ReportMetadata
  charts: ChartConfig[]
}

// Statistics interfaces
export interface ReportStatistics {
  totalReports: number
  submittedCount: number
  pendingCount: number
  draftCount: number
  approvedCount: number
  rejectedCount: number
  byType: Record<string, number>
  byPeriod: Record<string, number>
  byStatus: Record<string, number>
  monthlyTrend: {
    month: string
    count: number
  }[]
}

export interface ReportTemplate {
  id: number
  templateName: string
  reportType: string
  description?: string | null
  sections: string[]
  frequency: string
  estimatedTime: string
  isActive: boolean
  createdAt: Date
  updatedAt?: Date | null
}

// Utility functions for reports
export const getReportStatusColor = (status: string): string => {
  switch (status) {
    case ReportStatus.SUBMITTED:
      return "text-green-600"
    case ReportStatus.PENDING:
      return "text-yellow-600"
    case ReportStatus.DRAFT:
      return "text-gray-600"
    case ReportStatus.APPROVED:
      return "text-blue-600"
    case ReportStatus.REJECTED:
      return "text-red-600"
    default:
      return "text-gray-600"
  }
}

export const getReportTypeIcon = (type: string): string => {
  switch (type) {
    case ReportType.ACADEMIC:
      return "BookOpen"
    case ReportType.FINANCIAL:
      return "DollarSign"
    case ReportType.OPERATIONAL:
      return "Settings"
    case ReportType.ASSET:
      return "Package"
    case ReportType.COMPLIANCE:
      return "Shield"
    default:
      return "FileText"
  }
}

export const formatReportTitle = (type: string, period: string, year: string): string => {
  const typeLabels = {
    [ReportType.ACADEMIC]: "Akademik",
    [ReportType.FINANCIAL]: "Keuangan", 
    [ReportType.OPERATIONAL]: "Operasional",
    [ReportType.ASSET]: "Aset & Fasilitas",
    [ReportType.COMPLIANCE]: "Kepatuhan"
  }
  
  return `Laporan ${typeLabels[type as keyof typeof typeLabels] || type} ${period} ${year}`
}

export const getEstimatedTime = (type: string, sections: string[]): string => {
  const baseTime = {
    [ReportType.ACADEMIC]: 2,
    [ReportType.FINANCIAL]: 4,
    [ReportType.OPERATIONAL]: 1,
    [ReportType.ASSET]: 3,
    [ReportType.COMPLIANCE]: 6
  }
  
  const base = baseTime[type as keyof typeof baseTime] || 2
  const additional = Math.floor(sections.length / 3)
  const total = base + additional
  
  return `${total}-${total + 1} jam`
}

// Default export for main Report interface
export default Report