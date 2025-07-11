import type { Report, ReportTemplate, ReportGenerationRequest } from "@/types/reports"

// Mock data sesuai dengan schema Prisma Report
const mockReports: Report[] = [
  {
    id: 1,
    schoolId: 1,
    reportTitle: "Laporan Akademik Bulanan - Januari 2024",
    reportType: "Academic",
    reportPeriod: "Bulanan",
    academicYear: "2024",
    fileFormat: "pdf",
    fileUrl: "/reports/academic_jan_2024.pdf",
    createdBy: 1,
    createdDate: new Date("2024-02-01"),
    submissionStatus: "submitted",
    submissionDate: new Date("2024-02-02"),
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-02")
  },
  {
    id: 2,
    schoolId: 1,
    reportTitle: "Laporan Keuangan Triwulan I - 2024",
    reportType: "Financial",
    reportPeriod: "Triwulanan",
    academicYear: "2024",
    fileFormat: "pdf",
    fileUrl: "/reports/financial_q1_2024.pdf",
    createdBy: 1,
    createdDate: new Date("2024-04-01"),
    submissionStatus: "submitted",
    submissionDate: new Date("2024-04-05"),
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-04-05")
  },
  {
    id: 3,
    schoolId: 1,
    reportTitle: "Laporan Operasional Mingguan - Minggu 1 Feb",
    reportType: "Operational",
    reportPeriod: "Mingguan",
    academicYear: "2024",
    fileFormat: "pdf",
    fileUrl: "/reports/operational_week1_feb.pdf",
    createdBy: 1,
    createdDate: new Date("2024-02-05"),
    submissionStatus: "pending",
    submissionDate: null,
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-02-05")
  },
  {
    id: 4,
    schoolId: 1,
    reportTitle: "Laporan Aset & Fasilitas Semester I",
    reportType: "Asset",
    reportPeriod: "Semesteran",
    academicYear: "2024",
    fileFormat: "pdf",
    fileUrl: null,
    createdBy: 1,
    createdDate: new Date("2024-06-01"),
    submissionStatus: "draft",
    submissionDate: null,
    createdAt: new Date("2024-06-01"),
    updatedAt: new Date("2024-06-15")
  },
  {
    id: 5,
    schoolId: 1,
    reportTitle: "Laporan Kepatuhan Tahunan 2023",
    reportType: "Compliance",
    reportPeriod: "Tahunan",
    academicYear: "2023",
    fileFormat: "pdf",
    fileUrl: "/reports/compliance_2023.pdf",
    createdBy: 1,
    createdDate: new Date("2024-01-15"),
    submissionStatus: "submitted",
    submissionDate: new Date("2024-01-20"),
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20")
  },
  {
    id: 6,
    schoolId: 1,
    reportTitle: "Laporan Akademik Februari 2024",
    reportType: "Academic",
    reportPeriod: "Bulanan",
    academicYear: "2024",
    fileFormat: "pdf",
    fileUrl: "/reports/academic_feb_2024.pdf",
    createdBy: 1,
    createdDate: new Date("2024-03-01"),
    submissionStatus: "pending",
    submissionDate: null,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-05")
  },
  {
    id: 7,
    schoolId: 1,
    reportTitle: "Laporan Operasional Bulanan - Februari",
    reportType: "Operational",
    reportPeriod: "Bulanan",
    academicYear: "2024",
    fileFormat: "docx",
    fileUrl: null,
    createdBy: 1,
    createdDate: new Date("2024-03-10"),
    submissionStatus: "draft",
    submissionDate: null,
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-12")
  }
]

// Mock templates data
const mockTemplates: ReportTemplate[] = [
  {
    id: 1,
    templateName: "Template Laporan Akademik Bulanan",
    reportType: "Academic",
    description: "Template standar untuk laporan bulanan performa akademik siswa",
    sections: ["Kehadiran Siswa", "Prestasi Akademik", "Progress Kurikulum", "Evaluasi Pembelajaran"],
    frequency: "Bulanan",
    estimatedTime: "2-3 jam",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  },
  {
    id: 2,
    templateName: "Template Laporan Keuangan Triwulanan",
    reportType: "Financial",
    description: "Template untuk laporan keuangan per triwulan",
    sections: ["Ringkasan Anggaran", "Realisasi Pendapatan", "Detail Pengeluaran", "Analisis Varians"],
    frequency: "Triwulanan",
    estimatedTime: "4-5 jam",
    isActive: true,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01")
  }
]

export const reportsApi = {
  // Get all reports with optional filters
  getReports: async (academicYear?: string, reportType?: string): Promise<Report[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    let filteredReports = mockReports
    
    if (academicYear) {
      filteredReports = filteredReports.filter(report => report.academicYear === academicYear)
    }
    
    if (reportType) {
      filteredReports = filteredReports.filter(report => report.reportType === reportType)
    }
    
    return filteredReports.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  },

  // Get report by ID
  getReportById: async (id: number): Promise<Report | null> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockReports.find(report => report.id === id) || null
  },

  // Get reports by status
  getReportsByStatus: async (status: string): Promise<Report[]> => {
    await new Promise(resolve => setTimeout(resolve, 600))
    return mockReports.filter(report => report.submissionStatus === status)
  },

  // Get reports by type
  getReportsByType: async (type: string): Promise<Report[]> => {
    await new Promise(resolve => setTimeout(resolve, 700))
    return mockReports.filter(report => report.reportType === type)
  },

  // Create new report
  createReport: async (reportData: Omit<Report, 'id' | 'createdAt' | 'updatedAt'>): Promise<Report> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newReport: Report = {
      ...reportData,
      id: mockReports.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    mockReports.push(newReport)
    return newReport
  },

  // Update report
  updateReport: async (id: number, updates: Partial<Report>): Promise<Report | null> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const index = mockReports.findIndex(report => report.id === id)
    if (index === -1) return null

    mockReports[index] = { 
      ...mockReports[index], 
      ...updates, 
      updatedAt: new Date() 
    }
    return mockReports[index]
  },

  // Delete report
  deleteReport: async (id: number): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = mockReports.findIndex(report => report.id === id)
    if (index === -1) return false

    mockReports.splice(index, 1)
    return true
  },

  // Submit report (change status to submitted)
  submitReport: async (id: number): Promise<Report | null> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const report = mockReports.find(r => r.id === id)
    if (!report) return null

    report.submissionStatus = "submitted"
    report.submissionDate = new Date()
    report.updatedAt = new Date()
    
    return report
  },

  // Generate report from template/wizard
  generateReport: async (generationRequest: ReportGenerationRequest): Promise<Report> => {
    await new Promise(resolve => setTimeout(resolve, 3000)) // Simulate generation time
    
    const newReport: Report = {
      id: mockReports.length + 1,
      schoolId: 1,
      reportTitle: generationRequest.reportTitle,
      reportType: generationRequest.reportType,
      reportPeriod: generationRequest.reportPeriod,
      academicYear: generationRequest.academicYear,
      fileFormat: generationRequest.fileFormat || "pdf",
      fileUrl: `/reports/generated_${Date.now()}.${generationRequest.fileFormat || "pdf"}`,
      createdBy: 1,
      createdDate: new Date(),
      submissionStatus: "draft",
      submissionDate: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    mockReports.push(newReport)
    return newReport
  },

  // Get report templates
  getTemplates: async (): Promise<ReportTemplate[]> => {
    await new Promise(resolve => setTimeout(resolve, 600))
    return mockTemplates.filter(template => template.isActive)
  },

  // Get template by ID
  getTemplateById: async (id: number): Promise<ReportTemplate | null> => {
    await new Promise(resolve => setTimeout(resolve, 400))
    return mockTemplates.find(template => template.id === id) || null
  },

  // Get templates by type
  getTemplatesByType: async (type: string): Promise<ReportTemplate[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockTemplates.filter(template => template.reportType === type && template.isActive)
  },

  // Download report
  downloadReport: async (id: number): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const report = mockReports.find(r => r.id === id)
    if (!report || !report.fileUrl) {
      throw new Error("Report not found or file not available")
    }
    
    // In real implementation, this would return the actual file URL or trigger download
    return report.fileUrl
  },

  // Get report statistics
  getReportStatistics: async (): Promise<{
    totalReports: number
    submittedCount: number
    pendingCount: number
    draftCount: number
    byType: Record<string, number>
    byPeriod: Record<string, number>
  }> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const totalReports = mockReports.length
    const submittedCount = mockReports.filter(r => r.submissionStatus === "submitted").length
    const pendingCount = mockReports.filter(r => r.submissionStatus === "pending").length
    const draftCount = mockReports.filter(r => r.submissionStatus === "draft").length
    
    const byType = mockReports.reduce((acc, report) => {
      acc[report.reportType] = (acc[report.reportType] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const byPeriod = mockReports.reduce((acc, report) => {
      acc[report.reportPeriod] = (acc[report.reportPeriod] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return {
      totalReports,
      submittedCount,
      pendingCount,
      draftCount,
      byType,
      byPeriod
    }
  },

  // Search reports
  searchReports: async (query: string): Promise<Report[]> => {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const lowercaseQuery = query.toLowerCase()
    return mockReports.filter(report =>
      report.reportTitle.toLowerCase().includes(lowercaseQuery) ||
      report.reportType.toLowerCase().includes(lowercaseQuery) ||
      report.reportPeriod.toLowerCase().includes(lowercaseQuery)
    )
  },

  // Get overdue reports (pending reports that should have been submitted)
  getOverdueReports: async (): Promise<Report[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - 7) // Consider pending reports older than 7 days as overdue
    
    return mockReports.filter(report => 
      report.submissionStatus === "pending" && 
      new Date(report.createdAt) < cutoffDate
    )
  },

  // Get recent reports (last 30 days)
  getRecentReports: async (limit: number = 10): Promise<Report[]> => {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    return mockReports
      .filter(report => new Date(report.createdAt) >= thirtyDaysAgo)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
  }
}