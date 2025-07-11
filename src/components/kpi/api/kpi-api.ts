import type { SchoolKpi } from "@/types/kpi"

// Mock data sesuai dengan schema Prisma SchoolKpi
const mockKPIData: SchoolKpi[] = [
  // Academic KPIs
  {
    id: 1,
    schoolId: 1,
    academicYear: "2024",
    period: "Semester 1",
    kpiCategory: "Academic",
    kpiName: "Tingkat Kelulusan Siswa",
    targetValue: 95,
    achievedValue: 92,
    achievementPercentage: 96.84,
    trend: "increasing",
    priority: 1,
    analysis: "Tingkat kelulusan mencapai 92% dari target 95%. Peningkatan 3% dari semester sebelumnya menunjukkan efektivitas program remedial.",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-06-30")
  },
  {
    id: 2,
    schoolId: 1,
    academicYear: "2024",
    period: "Semester 1",
    kpiCategory: "Academic",
    kpiName: "Rata-rata Nilai UN/AKM",
    targetValue: 75,
    achievedValue: 78,
    achievementPercentage: 104,
    trend: "increasing",
    priority: 1,
    analysis: "Nilai rata-rata UN/AKM melampaui target dengan pencapaian 78 dari target 75. Program intensif matematika dan literasi memberikan hasil positif.",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-06-30")
  },
  {
    id: 3,
    schoolId: 1,
    academicYear: "2024",
    period: "Semester 1",
    kpiCategory: "Academic",
    kpiName: "Persentase Siswa Remedial",
    targetValue: 15,
    achievedValue: 18,
    achievementPercentage: 83.33,
    trend: "stable",
    priority: 2,
    analysis: "Persentase siswa remedial sedikit di atas target. Perlu evaluasi metode pembelajaran dan identifikasi siswa berisiko lebih awal.",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-06-30")
  },

  // Operational KPIs
  {
    id: 4,
    schoolId: 1,
    academicYear: "2024",
    period: "Semester 1",
    kpiCategory: "Operational",
    kpiName: "Tingkat Kehadiran Siswa",
    targetValue: 95,
    achievedValue: 89,
    achievementPercentage: 93.68,
    trend: "decreasing",
    priority: 2,
    analysis: "Kehadiran siswa turun menjadi 89% dari target 95%. Perlu program khusus untuk meningkatkan motivasi siswa hadir ke sekolah.",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-06-30")
  },
  {
    id: 5,
    schoolId: 1,
    academicYear: "2024",
    period: "Semester 1",
    kpiCategory: "Operational",
    kpiName: "Tingkat Kehadiran Guru",
    targetValue: 98,
    achievedValue: 96,
    achievementPercentage: 97.96,
    trend: "stable",
    priority: 1,
    analysis: "Kehadiran guru mencapai 96% dari target 98%. Masih dalam batas toleransi namun perlu monitoring ketat untuk mempertahankan kualitas.",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-06-30")
  },
  {
    id: 6,
    schoolId: 1,
    academicYear: "2024",
    period: "Semester 1",
    kpiCategory: "Operational",
    kpiName: "Efisiensi Penyelesaian Administrasi",
    targetValue: 90,
    achievedValue: 85,
    achievementPercentage: 94.44,
    trend: "stable",
    priority: 3,
    analysis: "Efisiensi administrasi mencapai 85% dari target 90%. Implementasi sistem digital dapat meningkatkan efisiensi lebih lanjut.",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-06-30")
  },

  // Financial KPIs
  {
    id: 7,
    schoolId: 1,
    academicYear: "2024",
    period: "Semester 1",
    kpiCategory: "Financial",
    kpiName: "Tingkat Realisasi Anggaran",
    targetValue: 85,
    achievedValue: 78,
    achievementPercentage: 91.76,
    trend: "stable",
    priority: 2,
    analysis: "Realisasi anggaran mencapai 78% dari target 85%. Masih dalam koridor yang wajar namun perlu optimalisasi perencanaan anggaran.",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-06-30")
  },
  {
    id: 8,
    schoolId: 1,
    academicYear: "2024",
    period: "Semester 1",
    kpiCategory: "Financial",
    kpiName: "Efisiensi Biaya Operasional",
    targetValue: 80,
    achievedValue: 75,
    achievementPercentage: 93.75,
    trend: "increasing",
    priority: 3,
    analysis: "Efisiensi biaya operasional mencapai 75% dari target 80%. Penghematan listrik dan kertas memberikan kontribusi positif.",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-06-30")
  },
  {
    id: 9,
    schoolId: 1,
    academicYear: "2024",
    period: "Semester 1",
    kpiCategory: "Financial",
    kpiName: "Tingkat Kolektibilitas SPP",
    targetValue: 95,
    achievedValue: 88,
    achievementPercentage: 92.63,
    trend: "decreasing",
    priority: 1,
    analysis: "Kolektibilitas SPP turun menjadi 88% dari target 95%. Perlu strategi komunikasi dan program bantuan untuk orang tua siswa.",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-06-30")
  },

  // Resource KPIs
  {
    id: 10,
    schoolId: 1,
    academicYear: "2024",
    period: "Semester 1",
    kpiCategory: "Resource",
    kpiName: "Tingkat Pemanfaatan Fasilitas",
    targetValue: 85,
    achievedValue: 82,
    achievementPercentage: 96.47,
    trend: "stable",
    priority: 3,
    analysis: "Pemanfaatan fasilitas mencapai 82% dari target 85%. Lab komputer dan perpustakaan masih bisa dioptimalkan penggunaannya.",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-06-30")
  },
  {
    id: 11,
    schoolId: 1,
    academicYear: "2024",
    period: "Semester 1",
    kpiCategory: "Resource",
    kpiName: "Kondisi Aset Sekolah",
    targetValue: 90,
    achievedValue: 87,
    achievementPercentage: 96.67,
    trend: "stable",
    priority: 2,
    analysis: "Kondisi aset sekolah dalam kategori baik dengan 87% dari target 90%. Perawatan rutin perlu ditingkatkan untuk menjaga kualitas.",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-06-30")
  },
  {
    id: 12,
    schoolId: 1,
    academicYear: "2024",
    period: "Semester 1",
    kpiCategory: "Resource",
    kpiName: "Tingkat Kepuasan Stakeholder",
    targetValue: 85,
    achievedValue: 79,
    achievementPercentage: 92.94,
    trend: "increasing",
    priority: 2,
    analysis: "Kepuasan stakeholder mencapai 79% dari target 85%. Survey menunjukkan peningkatan kepuasan orang tua terhadap komunikasi sekolah.",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-06-30")
  }
]

// Previous period data for comparison
const mockPreviousKPIData: SchoolKpi[] = [
  {
    id: 101,
    schoolId: 1,
    academicYear: "2023",
    period: "Semester 2",
    kpiCategory: "Academic",
    kpiName: "Tingkat Kelulusan Siswa",
    targetValue: 95,
    achievedValue: 89,
    achievementPercentage: 93.68,
    trend: "stable",
    priority: 1,
    analysis: "Periode sebelumnya",
    createdAt: new Date("2023-08-15"),
    updatedAt: new Date("2023-12-30")
  },
  {
    id: 102,
    schoolId: 1,
    academicYear: "2023",
    period: "Semester 2",
    kpiCategory: "Academic",
    kpiName: "Rata-rata Nilai UN/AKM",
    targetValue: 75,
    achievedValue: 73,
    achievementPercentage: 97.33,
    trend: "stable",
    priority: 1,
    analysis: "Periode sebelumnya",
    createdAt: new Date("2023-08-15"),
    updatedAt: new Date("2023-12-30")
  },
  {
    id: 103,
    schoolId: 1,
    academicYear: "2023",
    period: "Semester 2",
    kpiCategory: "Operational",
    kpiName: "Tingkat Kehadiran Siswa",
    targetValue: 95,
    achievedValue: 91,
    achievementPercentage: 95.79,
    trend: "stable",
    priority: 2,
    analysis: "Periode sebelumnya",
    createdAt: new Date("2023-08-15"),
    updatedAt: new Date("2023-12-30")
  },
  {
    id: 104,
    schoolId: 1,
    academicYear: "2023",
    period: "Semester 2",
    kpiCategory: "Financial",
    kpiName: "Tingkat Kolektibilitas SPP",
    targetValue: 95,
    achievedValue: 92,
    achievementPercentage: 96.84,
    trend: "stable",
    priority: 1,
    analysis: "Periode sebelumnya",
    createdAt: new Date("2023-08-15"),
    updatedAt: new Date("2023-12-30")
  }
]

export const kpiApi = {
  // Get KPIs for specific academic year and period
  getKPIs: async (academicYear?: string, period?: string): Promise<SchoolKpi[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (academicYear && period) {
      // If requesting previous period, return previous data
      if (academicYear === "2023" || (academicYear === "2024" && period === "Semester 2")) {
        return mockPreviousKPIData.filter(kpi => 
          kpi.academicYear === academicYear && kpi.period === period
        )
      }
      return mockKPIData.filter(kpi => 
        kpi.academicYear === academicYear && kpi.period === period
      )
    }
    
    return mockKPIData
  },

  // Get KPI by ID
  getKPIById: async (id: number): Promise<SchoolKpi | null> => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockKPIData.find(kpi => kpi.id === id) || null
  },

  // Get KPIs by category
  getKPIsByCategory: async (category: string): Promise<SchoolKpi[]> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    return mockKPIData.filter(kpi => kpi.kpiCategory === category)
  },

  // Get KPIs by priority
  getKPIsByPriority: async (priority: number): Promise<SchoolKpi[]> => {
    await new Promise(resolve => setTimeout(resolve, 600))
    return mockKPIData.filter(kpi => kpi.priority === priority)
  },

  // Get critical KPIs (high priority + low performance)
  getCriticalKPIs: async (): Promise<SchoolKpi[]> => {
    await new Promise(resolve => setTimeout(resolve, 700))
    return mockKPIData.filter(kpi => 
      (kpi.priority || 5) <= 3 && (kpi.achievementPercentage || 0) < 70
    )
  },

  // Update KPI
  updateKPI: async (id: number, updates: Partial<SchoolKpi>): Promise<SchoolKpi | null> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const index = mockKPIData.findIndex(kpi => kpi.id === id)
    if (index === -1) return null

    mockKPIData[index] = { 
      ...mockKPIData[index], 
      ...updates, 
      updatedAt: new Date() 
    }
    return mockKPIData[index]
  },

  // Create new KPI
  createKPI: async (kpi: Omit<SchoolKpi, 'id' | 'createdAt' | 'updatedAt'>): Promise<SchoolKpi> => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    const newKPI: SchoolKpi = {
      ...kpi,
      id: mockKPIData.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    mockKPIData.push(newKPI)
    return newKPI
  },

  // Delete KPI
  deleteKPI: async (id: number): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800))
    const index = mockKPIData.findIndex(kpi => kpi.id === id)
    if (index === -1) return false

    mockKPIData.splice(index, 1)
    return true
  },

  // Get KPI statistics
  getKPIStatistics: async (): Promise<{
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
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const totalKPIs = mockKPIData.length
    const totalAchievement = mockKPIData.reduce((sum, kpi) => sum + (kpi.achievementPercentage || 0), 0)
    const averageAchievement = totalAchievement / totalKPIs

    const excellentCount = mockKPIData.filter(kpi => (kpi.achievementPercentage || 0) >= 90).length
    const goodCount = mockKPIData.filter(kpi => 
      (kpi.achievementPercentage || 0) >= 70 && (kpi.achievementPercentage || 0) < 90
    ).length
    const needsAttentionCount = mockKPIData.filter(kpi => (kpi.achievementPercentage || 0) < 70).length
    const criticalCount = mockKPIData.filter(kpi => 
      (kpi.priority || 5) <= 3 && (kpi.achievementPercentage || 0) < 70
    ).length

    const byCategory = mockKPIData.reduce((acc, kpi) => {
      const category = kpi.kpiCategory
      if (!acc[category]) {
        acc[category] = { count: 0, totalAchievement: 0 }
      }
      acc[category].count += 1
      acc[category].totalAchievement += kpi.achievementPercentage || 0
      return acc
    }, {} as Record<string, { count: number; totalAchievement: number }>)

    const categoryStats = Object.entries(byCategory).reduce((acc, [category, data]) => {
      acc[category] = {
        count: data.count,
        averageAchievement: data.totalAchievement / data.count
      }
      return acc
    }, {} as Record<string, { count: number; averageAchievement: number }>)

    return {
      totalKPIs,
      averageAchievement,
      excellentCount,
      goodCount,
      needsAttentionCount,
      criticalCount,
      byCategory: categoryStats
    }
  },

  // Export KPI report
  exportKPIReport: async (academicYear: string, period: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Simulate file download
    const data = mockKPIData.filter(kpi => 
      kpi.academicYear === academicYear && kpi.period === period
    )
    
    const csvContent = [
      ['KPI Name', 'Category', 'Target', 'Achieved', 'Achievement %', 'Priority', 'Trend'].join(','),
      ...data.map(kpi => [
        `"${kpi.kpiName}"`,
        kpi.kpiCategory,
        kpi.targetValue,
        kpi.achievedValue,
        kpi.achievementPercentage,
        kpi.priority,
        kpi.trend
      ].join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `KPI_Report_${academicYear}_${period}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }
}