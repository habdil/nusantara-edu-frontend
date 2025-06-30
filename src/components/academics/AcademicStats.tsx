"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, Award, Clock } from "lucide-react"

interface AcademicStatsProps {
  stats: {
    totalStudents: number
    averageScore: number
    passRate: number
    attendanceRate: number
  } | null
}

export function AcademicStats({ stats }: AcademicStatsProps) {
  if (!stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Siswa",
      value: stats.totalStudents.toLocaleString(),
      icon: Users,
      description: "Siswa aktif",
      color: "text-blue-600",
    },
    {
      title: "Rata-rata Nilai",
      value: stats.averageScore.toFixed(1),
      icon: TrendingUp,
      description: "Nilai keseluruhan",
      color: "text-green-600",
    },
    {
      title: "Tingkat Kelulusan",
      value: `${stats.passRate.toFixed(1)}%`,
      icon: Award,
      description: "Siswa lulus KKM",
      color: "text-purple-600",
    },
    {
      title: "Tingkat Kehadiran",
      value: `${stats.attendanceRate.toFixed(1)}%`,
      icon: Clock,
      description: "Kehadiran siswa",
      color: "text-orange-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</div>
            <p className="text-xs text-slate-600 dark:text-slate-400">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
