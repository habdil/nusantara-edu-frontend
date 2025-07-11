"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react"
import type { SchoolKpi } from "@/types/kpi"

interface KPIStatsProps {
  kpis: SchoolKpi[]
}

export function KPIStats({ kpis }: KPIStatsProps) {
  const getKPIsByCategory = (category: string) => {
    return kpis.filter(kpi => kpi.kpiCategory === category)
  }

  const getCategoryStats = (category: string) => {
    const categoryKpis = getKPIsByCategory(category)
    if (categoryKpis.length === 0) return { average: 0, count: 0, status: "warning" }
    
    const totalAchievement = categoryKpis.reduce((sum, kpi) => sum + (kpi.achievementPercentage || 0), 0)
    const average = totalAchievement / categoryKpis.length
    
    let status = "success"
    if (average < 70) status = "error"
    else if (average < 85) status = "warning"
    
    return { average, count: categoryKpis.length, status }
  }

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const academicStats = getCategoryStats("Academic")
  const operationalStats = getCategoryStats("Operational")
  const financialStats = getCategoryStats("Financial")
  const resourceStats = getCategoryStats("Resource")

  const statCards = [
    {
      title: "KPI Akademik",
      icon: GraduationCap,
      stats: academicStats,
      description: "Performa pembelajaran dan prestasi siswa",
      color: "text-blue-600"
    },
    {
      title: "KPI Operasional", 
      icon: Users,
      stats: operationalStats,
      description: "Kehadiran dan manajemen sehari-hari",
      color: "text-green-600"
    },
    {
      title: "KPI Keuangan",
      icon: Target,
      stats: financialStats,
      description: "Pengelolaan anggaran dan keuangan",
      color: "text-orange-600"
    },
    {
      title: "KPI Sumber Daya",
      icon: BookOpen,
      stats: resourceStats,
      description: "Pemanfaatan fasilitas dan aset",
      color: "text-purple-600"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold">
                      {card.stats.average.toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {card.stats.count} indikator
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(card.stats.status)}
                  </div>
                </div>
                
                <Progress 
                  value={card.stats.average} 
                  className="h-2"
                />
                
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}