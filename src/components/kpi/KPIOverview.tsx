"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Target,
  Calendar,
  Download,
  RefreshCw,
  BarChart3
} from "lucide-react"
import { kpiApi } from "./api/kpi-api"
import { KPIStats } from "./KPIStats"
import { KPICharts } from "./KPIChart"
import { KPIComparison } from "./KPIComparison"
import { KPITargets } from "./KPITargets"
import type { SchoolKpi } from "@/types/kpi"

export function KPIOverview() {
  const [kpis, setKpis] = useState<SchoolKpi[]>([])
  const [loading, setLoading] = useState(true)
  const [academicYear, setAcademicYear] = useState("2024")
  const [period, setPeriod] = useState("Semester 1")
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchKPIData()
  }, [academicYear, period])

const fetchKPIData = async () => {
    try {
      setLoading(true)
      // ✅ FIX: Kirim sebagai object params, bukan individual arguments
      const data = await kpiApi.getKPIs({
        academicYear,
        period
      })
      setKpis(data)
    } catch (error) {
      console.error("Error fetching KPI data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchKPIData()
    setRefreshing(false)
  }

  const handleExport = async () => {
    try {
      // ✅ FIX: Kirim sebagai object params juga
      await kpiApi.exportKPIReport({
        academicYear,
        period
      })
    } catch (error) {
      console.error("Error exporting KPI report:", error)
    }
  }

  const getOverallPerformance = () => {
    if (kpis.length === 0) return { average: 0, trend: "stable", status: "warning" }
    
    const totalAchievement = kpis.reduce((sum, kpi) => sum + (kpi.achievementPercentage || 0), 0)
    const average = totalAchievement / kpis.length
    
    let status = "success"
    if (average < 70) status = "error"
    else if (average < 85) status = "warning"
    
    return { average, trend: "increasing", status }
  }

  const performance = getOverallPerformance()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Select value={academicYear} onValueChange={setAcademicYear}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Semester 1">Semester 1</SelectItem>
              <SelectItem value="Semester 2">Semester 2</SelectItem>
              <SelectItem value="Triwulan 1">Triwulan 1</SelectItem>
              <SelectItem value="Triwulan 2">Triwulan 2</SelectItem>
              <SelectItem value="Triwulan 3">Triwulan 3</SelectItem>
              <SelectItem value="Triwulan 4">Triwulan 4</SelectItem>
            </SelectContent>
          </Select>
        </div> 
      </div>

      {/* Overall Performance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Performa KPI Keseluruhan
          </CardTitle>
          <CardDescription>
            Periode: {period} {academicYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Rata-rata Pencapaian</p>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold">{performance.average.toFixed(1)}%</span>
                <Badge variant={performance.status === "success" ? "default" : performance.status === "warning" ? "secondary" : "destructive"}>
                  {performance.trend === "increasing" ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {performance.trend === "increasing" ? "Meningkat" : "Menurun"}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total KPI</p>
              <p className="text-2xl font-semibold">{kpis.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Stats */}
      <KPIStats kpis={kpis} />

      {/* Tabs for detailed views */}
      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Grafik KPI
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Perbandingan
          </TabsTrigger>
          <TabsTrigger value="targets" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Target & Analisis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-4">
          <KPICharts kpis={kpis} />
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          <KPIComparison kpis={kpis} academicYear={academicYear} period={period} />
        </TabsContent>

        <TabsContent value="targets" className="space-y-4">
          <KPITargets kpis={kpis} />
        </TabsContent>
      </Tabs>
    </div>
  )
}