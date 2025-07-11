"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { kpiApi } from "./api/kpi-api"
import type { SchoolKpi } from "@/types/kpi"

interface KPIComparisonProps {
  kpis: SchoolKpi[]
  academicYear: string
  period: string
}

export function KPIComparison({ kpis, academicYear, period }: KPIComparisonProps) {
  const [comparisonData, setComparisonData] = useState<SchoolKpi[]>([])
  const [loading, setLoading] = useState(false)
  const [comparisonPeriod, setComparisonPeriod] = useState("")
  const [comparisonYear, setComparisonYear] = useState("")

  useEffect(() => {
    // Set default comparison period (previous period)
    const currentPeriod = period
    const currentYear = academicYear
    
    if (currentPeriod === "Semester 1") {
      setComparisonPeriod("Semester 2")
      setComparisonYear((parseInt(currentYear) - 1).toString())
    } else if (currentPeriod === "Semester 2") {
      setComparisonPeriod("Semester 1")
      setComparisonYear(currentYear)
    } else {
      // For quarterly periods
      const quarter = parseInt(currentPeriod.split(" ")[1])
      if (quarter === 1) {
        setComparisonPeriod("Triwulan 4")
        setComparisonYear((parseInt(currentYear) - 1).toString())
      } else {
        setComparisonPeriod(`Triwulan ${quarter - 1}`)
        setComparisonYear(currentYear)
      }
    }
  }, [period, academicYear])

  useEffect(() => {
    if (comparisonPeriod && comparisonYear) {
      fetchComparisonData()
    }
  }, [comparisonPeriod, comparisonYear])

  const fetchComparisonData = async () => {
    try {
      setLoading(true)
      const data = await kpiApi.getKPIs(comparisonYear, comparisonPeriod)
      setComparisonData(data)
    } catch (error) {
      console.error("Error fetching comparison data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getComparisonAnalysis = () => {
    const analysis = kpis.map(currentKpi => {
      const previousKpi = comparisonData.find(
        prev => prev.kpiName === currentKpi.kpiName && prev.kpiCategory === currentKpi.kpiCategory
      )

      if (!previousKpi) {
        return {
          ...currentKpi,
          previousValue: null,
          change: null,
          changePercentage: null,
          trend: "stable" as const
        }
      }

      const currentValue = currentKpi.achievementPercentage || 0
      const previousValue = previousKpi.achievementPercentage || 0
      const change = currentValue - previousValue
      const changePercentage = previousValue > 0 ? (change / previousValue) * 100 : 0

      let trend: "increasing" | "decreasing" | "stable" = "stable"
      if (Math.abs(change) > 2) {
        trend = change > 0 ? "increasing" : "decreasing"
      }

      return {
        ...currentKpi,
        previousValue,
        change,
        changePercentage,
        trend
      }
    })

    return analysis
  }

  const getTrendIcon = (trend: "increasing" | "decreasing" | "stable") => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "decreasing":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendColor = (trend: "increasing" | "decreasing" | "stable") => {
    switch (trend) {
      case "increasing":
        return "text-green-600"
      case "decreasing":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const analysisData = getComparisonAnalysis()

  // Prepare chart data
  const chartData = analysisData
    .filter(item => item.previousValue !== null)
    .map(item => ({
      name: item.kpiName.substring(0, 20) + "...",
      current: item.achievementPercentage || 0,
      previous: item.previousValue || 0,
      category: item.kpiCategory
    }))

  // Category summary
  const categoryComparison = analysisData.reduce((acc, item) => {
    const category = item.kpiCategory
    if (!acc[category]) {
      acc[category] = {
        category,
        currentAvg: 0,
        previousAvg: 0,
        count: 0,
        validComparisons: 0
      }
    }
    
    acc[category].currentAvg += item.achievementPercentage || 0
    acc[category].count += 1
    
    if (item.previousValue !== null) {
      acc[category].previousAvg += item.previousValue
      acc[category].validComparisons += 1
    }
    
    return acc
  }, {} as Record<string, any>)

  const categoryComparisonData = Object.values(categoryComparison).map((item: any) => ({
    category: item.category,
    current: item.currentAvg / item.count,
    previous: item.validComparisons > 0 ? item.previousAvg / item.validComparisons : 0,
    change: item.validComparisons > 0 
      ? (item.currentAvg / item.count) - (item.previousAvg / item.validComparisons)
      : 0
  }))

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
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
      {/* Comparison Period Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Perbandingan Periode</CardTitle>
          <CardDescription>
            Bandingkan performa KPI dengan periode sebelumnya
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Periode Pembanding</label>
              <div className="flex items-center gap-2">
                <Select value={comparisonYear} onValueChange={setComparisonYear}>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Tahun" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={comparisonPeriod} onValueChange={setComparisonPeriod}>
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
            <div className="text-sm text-muted-foreground">
              <p>Periode Saat Ini: {period} {academicYear}</p>
              <p>Periode Pembanding: {comparisonPeriod} {comparisonYear}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Perbandingan per Kategori</CardTitle>
          <CardDescription>
            Rata-rata performa setiap kategori KPI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryComparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="category" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `${value.toFixed(1)}%`,
                  name === 'current' ? 'Periode Saat Ini' : 'Periode Sebelumnya'
                ]}
              />
              <Bar dataKey="previous" fill="#94a3b8" name="Periode Sebelumnya" radius={[2, 2, 0, 0]} />
              <Bar dataKey="current" fill="#3b82f6" name="Periode Saat Ini" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Individual KPI Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Perbandingan Detail KPI</CardTitle>
          <CardDescription>
            Analisis perubahan setiap indikator KPI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysisData.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{item.kpiName}</h4>
                      <Badge variant="outline">{item.kpiCategory}</Badge>
                      {getTrendIcon(item.trend)}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Periode Saat Ini</p>
                        <p className="font-semibold">{(item.achievementPercentage || 0).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Periode Sebelumnya</p>
                        <p className="font-semibold">
                          {item.previousValue !== null ? `${item.previousValue.toFixed(1)}%` : "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Perubahan</p>
                        <p className={`font-semibold ${getTrendColor(item.trend)}`}>
                          {item.change !== null ? 
                            `${item.change > 0 ? '+' : ''}${item.change.toFixed(1)}%` : 
                            "N/A"
                          }
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Perubahan (%)</p>
                        <p className={`font-semibold ${getTrendColor(item.trend)}`}>
                          {item.changePercentage !== null ? 
                            `${item.changePercentage > 0 ? '+' : ''}${item.changePercentage.toFixed(1)}%` : 
                            "N/A"
                          }
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{(item.achievementPercentage || 0).toFixed(1)}% dari target</span>
                      </div>
                      <Progress value={item.achievementPercentage || 0} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">KPI Meningkat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {analysisData.filter(item => item.trend === "increasing").length}
            </div>
            <p className="text-xs text-muted-foreground">
              dari {analysisData.length} KPI total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">KPI Stabil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">
              {analysisData.filter(item => item.trend === "stable").length}
            </div>
            <p className="text-xs text-muted-foreground">
              tidak ada perubahan signifikan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">KPI Menurun</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {analysisData.filter(item => item.trend === "decreasing").length}
            </div>
            <p className="text-xs text-muted-foreground">
              perlu perhatian khusus
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}