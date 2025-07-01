"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, CheckCircle, Clock, TrendingUp, Star, AlertTriangle, BookOpen, Award } from "lucide-react"
import type { EvaluationStats as StatsType } from "./api/teacher-evaluation-api"

interface EvaluationStatsProps {
  stats: StatsType
  isLoading?: boolean
}

export function EvaluationStats({ stats, isLoading }: EvaluationStatsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="h-4 w-4 bg-muted animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 w-24 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const evaluationProgress = (stats.evaluatedTeachers / stats.totalTeachers) * 100
  const excellenceRate = (stats.excellentPerformers / stats.evaluatedTeachers) * 100

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Guru</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalTeachers}</div>
          <p className="text-xs text-muted-foreground">Guru aktif di sekolah</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sudah Dievaluasi</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.evaluatedTeachers}</div>
          <p className="text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-xs">
              {evaluationProgress.toFixed(1)}%
            </Badge>{" "}
            dari total guru
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Evaluasi</CardTitle>
          <Clock className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pendingEvaluations}</div>
          <p className="text-xs text-muted-foreground">Menunggu evaluasi</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rata-rata Skor</CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageScore}</div>
          <p className="text-xs text-muted-foreground">Dari skala 5.0</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Performa Excellent</CardTitle>
          <Star className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.excellentPerformers}</div>
          <p className="text-xs text-muted-foreground">
            <Badge variant="secondary" className="text-xs">
              {excellenceRate.toFixed(1)}%
            </Badge>{" "}
            skor ≥ 4.5
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Perlu Perbaikan</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.needsImprovement}</div>
          <p className="text-xs text-muted-foreground">Skor {"<"} 4.0</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Program Pengembangan</CardTitle>
          <BookOpen className="h-4 w-4 text-indigo-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.developmentPrograms}</div>
          <p className="text-xs text-muted-foreground">Program aktif</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pelatihan Selesai</CardTitle>
          <Award className="h-4 w-4 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.completedTrainings}</div>
          <p className="text-xs text-muted-foreground">Tahun ini</p>
        </CardContent>
      </Card>
    </div>
  )
}
