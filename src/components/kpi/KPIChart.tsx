"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts"
import type { SchoolKpi } from "@/types/kpi"

interface KPIChartsProps {
  kpis: SchoolKpi[]
}

export function KPICharts({ kpis }: KPIChartsProps) {
  // Prepare data for different chart types
  const categoryData = kpis.reduce((acc, kpi) => {
    const category = kpi.kpiCategory
    if (!acc[category]) {
      acc[category] = {
        category,
        totalTarget: 0,
        totalAchieved: 0,
        count: 0
      }
    }
    acc[category].totalTarget += kpi.targetValue || 0
    acc[category].totalAchieved += kpi.achievedValue || 0
    acc[category].count += 1
    return acc
  }, {} as Record<string, any>)

  const categoryChartData = Object.values(categoryData).map((item: any) => ({
    category: item.category,
    target: item.totalTarget / item.count,
    achieved: item.totalAchieved / item.count,
    percentage: ((item.totalAchieved / item.totalTarget) * 100) || 0
  }))

  // KPI Performance over time (simulated trend data)
  const trendData = kpis.slice(0, 6).map((kpi, index) => ({
    name: kpi.kpiName.substring(0, 15) + "...",
    target: kpi.targetValue || 0,
    achieved: kpi.achievedValue || 0,
    percentage: kpi.achievementPercentage || 0
  }))

  // Priority distribution
  const priorityData = kpis.reduce((acc, kpi) => {
    const priority = `Prioritas ${kpi.priority || 'Tidak Diset'}`
    acc[priority] = (acc[priority] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const priorityChartData = Object.entries(priorityData).map(([name, value]) => ({
    name,
    value,
    percentage: ((value / kpis.length) * 100).toFixed(1)
  }))

  // Radar chart data for category performance
  const radarData = categoryChartData.map(item => ({
    category: item.category,
    performance: item.percentage
  }))

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}
              {entry.name.includes('percentage') && '%'}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Category Performance Bar Chart */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Performa KPI per Kategori</CardTitle>
          <CardDescription>
            Perbandingan target vs pencapaian per kategori
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryChartData}>
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
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="target" fill="#8884d8" name="Target" radius={[2, 2, 0, 0]} />
              <Bar dataKey="achieved" fill="#82ca9d" name="Tercapai" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Individual KPI Performance Line Chart */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Persentase Pencapaian KPI</CardTitle>
          <CardDescription>
            Tingkat pencapaian setiap indikator KPI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="percentage" 
                stroke="#8884d8" 
                strokeWidth={2}
                dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                name="Pencapaian (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Priority Distribution Pie Chart */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Distribusi Prioritas KPI</CardTitle>
          <CardDescription>
            Pembagian KPI berdasarkan tingkat prioritas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {priorityChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Radar Chart for Category Performance */}
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Analisis Radar Performa</CardTitle>
          <CardDescription>
            Visualisasi 360° performa semua kategori KPI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" fontSize={12} />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                fontSize={10}
                tickCount={5}
              />
              <Radar
                name="Performa (%)"
                dataKey="performance"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed KPI List */}
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Detail Semua KPI</CardTitle>
          <CardDescription>
            Daftar lengkap semua indikator KPI dengan status pencapaian
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {kpis.map((kpi) => (
              <div key={kpi.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{kpi.kpiName}</h4>
                    <Badge variant="outline">
                      {kpi.kpiCategory}
                    </Badge>
                    {kpi.priority && (
                      <Badge variant="secondary">
                        Prioritas {kpi.priority}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Target: {kpi.targetValue} | Tercapai: {kpi.achievedValue}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <div className="text-2xl font-bold">
                    {kpi.achievementPercentage?.toFixed(1)}%
                  </div>
                  <Badge
                    variant={
                      (kpi.achievementPercentage || 0) >= 90 
                        ? "default" 
                        : (kpi.achievementPercentage || 0) >= 70 
                        ? "secondary" 
                        : "destructive"
                    }
                  >
                    {(kpi.achievementPercentage || 0) >= 90 
                      ? "Excellent" 
                      : (kpi.achievementPercentage || 0) >= 70 
                      ? "Good" 
                      : "Needs Improvement"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}