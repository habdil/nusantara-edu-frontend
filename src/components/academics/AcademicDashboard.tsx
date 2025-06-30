"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"
import { AcademicStats } from "./AcademicStats"
import { StudentList } from "./StudentList"
import { GradeAnalysis } from "./GradeAnalysis"
import { AttendanceOverview } from "./AttendanceOverview"
import { SubjectPerformance } from "./SubjectPerformance"
import { academicApi, type AcademicStats as AcademicStatsType } from "./api/academic-api"
import { toast } from "sonner"

export function AcademicDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [academicStats, setAcademicStats] = useState<AcademicStatsType | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const stats = await academicApi.getAcademicStats({
        academicYear: "2024/2025",
        semester: "1",
      })

      setAcademicStats(stats)
    } catch (error: any) {
      console.error("Error loading academic data:", error)
      setError(error.message || "Gagal memuat data akademik")
      toast.error("Gagal memuat data akademik", {
        description: error.message || "Terjadi kesalahan saat memuat data",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (error) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Performa Akademik</h1>
            <p className="text-slate-600 dark:text-slate-400">Monitoring dan analisis performa akademik siswa</p>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button variant="outline" size="sm" onClick={loadData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Coba Lagi
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto"></div>
          <p className="text-slate-600 dark:text-slate-400">Memuat data akademik...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Performa Akademik</h1>
          <p className="text-slate-600 dark:text-slate-400">Monitoring dan analisis performa akademik siswa</p>
        </div>
        <Button variant="outline" onClick={loadData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Academic Statistics Cards */}
      <AcademicStats stats={academicStats} />

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Data Siswa</TabsTrigger>
          <TabsTrigger value="grades">Analisis Nilai</TabsTrigger>
          <TabsTrigger value="attendance">Kehadiran</TabsTrigger>
          <TabsTrigger value="subjects">Mata Pelajaran</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Performa</CardTitle>
                <CardDescription>Overview performa akademik keseluruhan</CardDescription>
              </CardHeader>
              <CardContent>
                <GradeAnalysis />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tingkat Kehadiran</CardTitle>
                <CardDescription>Monitoring kehadiran siswa</CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceOverview />
              </CardContent>
            </Card>
          </div>

          <SubjectPerformance data={academicStats?.subjectPerformance || []} />
        </TabsContent>

        <TabsContent value="students">
          <StudentList />
        </TabsContent>

        <TabsContent value="grades">
          <GradeAnalysis />
        </TabsContent>

        <TabsContent value="attendance">
          <AttendanceOverview />
        </TabsContent>

        <TabsContent value="subjects">
          <SubjectPerformance data={academicStats?.subjectPerformance || []} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
