"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  FileText, 
  Download, 
  Calendar, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  RefreshCw
} from "lucide-react"
import { reportsApi } from "./api/reports-api"
import { ReportsList } from "./ReportsList"
import { ReportTemplates } from "./ReportTemplates"
import { ReportGenerator } from "./ReportGenerator"
import type { Report } from "@/types/reports"

export function ReportsOverview() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [academicYear, setAcademicYear] = useState("2024")
  const [reportType, setReportType] = useState("all")
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fetchReports()
  }, [academicYear, reportType])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const data = await reportsApi.getReports(academicYear, reportType === "all" ? undefined : reportType)
      setReports(data)
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchReports()
    setRefreshing(false)
  }

  const getReportStats = () => {
    const total = reports.length
    const submitted = reports.filter(r => r.submissionStatus === "submitted").length
    const pending = reports.filter(r => r.submissionStatus === "pending").length
    const draft = reports.filter(r => r.submissionStatus === "draft").length
    
    return { total, submitted, pending, draft }
  }

  const stats = getReportStats()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
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
          
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Jenis Laporan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Laporan</SelectItem>
              <SelectItem value="Academic">Akademik</SelectItem>
              <SelectItem value="Financial">Keuangan</SelectItem>
              <SelectItem value="Operational">Operasional</SelectItem>
              <SelectItem value="Asset">Aset & Fasilitas</SelectItem>
              <SelectItem value="Compliance">Kepatuhan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Buat Laporan
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Laporan</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Tahun akademik {academicYear}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sudah Dikirim</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.submitted}</div>
            <p className="text-xs text-muted-foreground">Laporan lengkap & terkirim</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Menunggu Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Butuh review sebelum kirim</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.draft}</div>
            <p className="text-xs text-muted-foreground">Belum selesai dibuat</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Daftar Laporan
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Template
          </TabsTrigger>
          <TabsTrigger value="generator" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Buat Laporan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          <ReportsList reports={reports} onReportUpdate={fetchReports} />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <ReportTemplates />
        </TabsContent>

        <TabsContent value="generator" className="space-y-4">
          <ReportGenerator onReportCreated={fetchReports} />
        </TabsContent>
      </Tabs>
    </div>
  )
}