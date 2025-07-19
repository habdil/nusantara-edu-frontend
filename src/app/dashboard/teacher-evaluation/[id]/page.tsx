"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  User, 
  Calendar, 
  Award,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  Clock,
  Target,
  CheckCircle,
  AlertCircle,
  Users,
  GraduationCap,
  FileText,
  BarChart3,
  ArrowLeft
} from "lucide-react"
import { teacherEvaluationApi, type TeacherEvaluation, type TeacherDevelopment } from "@/components/teacher-evaluation/api/teacher-evaluation-api"

const getStatusBadge = (status: string) => {
  const statusConfig = {
    draft: { label: "Draft", variant: "secondary" as const, color: "text-gray-600" },
    completed: { label: "Selesai", variant: "default" as const, color: "text-blue-600" },
    reviewed: { label: "Direview", variant: "outline" as const, color: "text-orange-600" },
    approved: { label: "Disetujui", variant: "default" as const, color: "text-green-600" },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
  return <Badge variant={config.variant}>{config.label}</Badge>
}

const getProgramStatusBadge = (status: string) => {
  const statusConfig = {
    planned: { label: "Direncanakan", variant: "secondary" as const, color: "text-blue-600" },
    ongoing: { label: "Berlangsung", variant: "default" as const, color: "text-orange-600" },
    completed: { label: "Selesai", variant: "default" as const, color: "text-green-600" },
    cancelled: { label: "Dibatalkan", variant: "destructive" as const, color: "text-red-600" },
  }

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.planned
  return <Badge variant={config.variant}>{config.label}</Badge>
}

const getProgramTypeBadge = (type: string) => {
  const typeConfig = {
    workshop: { label: "Workshop", variant: "outline" as const },
    training: { label: "Pelatihan", variant: "outline" as const },
    certification: { label: "Sertifikasi", variant: "outline" as const },
    seminar: { label: "Seminar", variant: "outline" as const },
  }

  const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.training
  return <Badge variant={config.variant}>{config.label}</Badge>
}

const getScoreColor = (score: number) => {
  if (score >= 4.5) return "text-green-600"
  if (score >= 4.0) return "text-blue-600"
  if (score >= 3.5) return "text-orange-600"
  return "text-red-600"
}

const getScoreIcon = (score: number) => {
  if (score >= 4.5) return <TrendingUp className="h-5 w-5 text-green-600" />
  if (score >= 4.0) return <Minus className="h-5 w-5 text-blue-600" />
  return <TrendingDown className="h-5 w-5 text-red-600" />
}

const getScorePercentage = (score: number) => {
  return (score / 5) * 100
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

export default function TeacherEvaluationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const evaluationId = params.id as string

  const [evaluation, setEvaluation] = useState<TeacherEvaluation | null>(null)
  const [developmentPrograms, setDevelopmentPrograms] = useState<TeacherDevelopment[]>([])
  const [loading, setLoading] = useState(false)
  const [developmentLoading, setDevelopmentLoading] = useState(false)

  useEffect(() => {
    if (evaluationId) {
      fetchEvaluationDetail()
    }
  }, [evaluationId])

  const fetchEvaluationDetail = async () => {
    if (!evaluationId) return

    setLoading(true)
    try {
      // Fetch evaluation detail
      const evaluationData = await teacherEvaluationApi.getEvaluationById(parseInt(evaluationId))
      setEvaluation(evaluationData)
      
      // Fetch development programs for this teacher
      if (evaluationData.teacherId) {
        setDevelopmentLoading(true)
        const programsData = await teacherEvaluationApi.getDevelopmentPrograms(evaluationData.teacherId)
        setDevelopmentPrograms(programsData)
      }
      
    } catch (error) {
      console.error("Error fetching evaluation detail:", error)
    } finally {
      setLoading(false)
      setDevelopmentLoading(false)
    }
  }

  // Calculate performance statistics
  const performanceStats = evaluation ? {
    averageScore: evaluation.overallScore,
    teachingQuality: evaluation.teachingQuality,
    classroomManagement: evaluation.classroomManagement,
    studentEngagement: evaluation.studentEngagement,
    professionalDevelopment: evaluation.professionalDevelopment,
    collaboration: evaluation.collaboration,
    punctuality: evaluation.punctuality,
    attendanceRate: evaluation.attendanceRate
  } : null

  // Calculate development program statistics
  const developmentStats = {
    total: developmentPrograms.length,
    completed: developmentPrograms.filter(p => p.status === "completed").length,
    ongoing: developmentPrograms.filter(p => p.status === "ongoing").length,
    planned: developmentPrograms.filter(p => p.status === "planned").length,
    totalHours: developmentPrograms.reduce((sum, p) => sum + p.hours, 0),
    totalCost: developmentPrograms.reduce((sum, p) => sum + p.cost, 0)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Detail Evaluasi Guru
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Informasi lengkap evaluasi kinerja dan program pengembangan guru
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-40 w-full" />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-40 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        ) : evaluation ? (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 h-10">
              <TabsTrigger value="overview" className="text-sm font-medium">Ringkasan</TabsTrigger>
              <TabsTrigger value="performance" className="text-sm font-medium">Kinerja</TabsTrigger>
              <TabsTrigger value="development" className="text-sm font-medium">Program Pengembangan</TabsTrigger>
              <TabsTrigger value="recommendations" className="text-sm font-medium">Rekomendasi</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Teacher Profile Header */}
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={evaluation.profilePhoto || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg font-semibold">{getInitials(evaluation.teacherName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-2xl font-bold mb-1">{evaluation.teacherName}</h1>
                    <p className="text-muted-foreground text-base">{evaluation.employeeId} • {evaluation.position}</p>
                    <Badge variant="outline" className="mt-2 text-sm px-3 py-1">
                      {evaluation.subjectArea}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  {getStatusBadge(evaluation.status)}
                </div>
              </div>

              {/* Overview Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Basic Information */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Informasi Evaluasi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Periode Evaluasi</p>
                        <p className="text-base font-semibold">{evaluation.evaluationPeriod}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Tahun Akademik</p>
                        <p className="text-base font-semibold">{evaluation.academicYear}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Tanggal Evaluasi</p>
                        <p className="text-sm flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {formatDate(evaluation.evaluationDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Evaluator</p>
                        <p className="text-sm">{evaluation.evaluatorName}</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-3">Tingkat Kehadiran</p>
                      <div className="flex items-center gap-3">
                        <Progress value={evaluation.attendanceRate} className="flex-1 h-3" />
                        <span className={`text-base font-bold ${
                          evaluation.attendanceRate >= 95
                            ? "text-green-600"
                            : evaluation.attendanceRate >= 90
                              ? "text-orange-600"
                              : "text-red-600"
                        }`}>
                          {evaluation.attendanceRate}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Overall Score */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Skor Keseluruhan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        {getScoreIcon(evaluation.overallScore)}
                        <span className={`text-4xl font-bold ${getScoreColor(evaluation.overallScore)}`}>
                          {evaluation.overallScore.toFixed(1)}
                        </span>
                        <span className="text-muted-foreground text-lg">/5.0</span>
                      </div>
                      <div className="flex justify-center mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(evaluation.overallScore)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <Progress value={getScorePercentage(evaluation.overallScore)} className="mb-3 h-3" />
                      <p className="text-base font-semibold">
                        {evaluation.overallScore >= 4.5 ? "Sangat Baik" :
                         evaluation.overallScore >= 4.0 ? "Baik" :
                         evaluation.overallScore >= 3.5 ? "Cukup" : "Perlu Perbaikan"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Performance Overview */}
                <Card className="lg:col-span-2 xl:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Ringkasan Kinerja
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {performanceStats && [
                        { label: "Kualitas Mengajar", value: performanceStats.teachingQuality },
                        { label: "Manajemen Kelas", value: performanceStats.classroomManagement },
                        { label: "Keterlibatan Siswa", value: performanceStats.studentEngagement },
                        { label: "Pengembangan Profesional", value: performanceStats.professionalDevelopment },
                      ].map((aspect, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">{aspect.label}</span>
                            <span className={`text-xs font-bold ${getScoreColor(aspect.value)}`}>
                              {aspect.value.toFixed(1)}
                            </span>
                          </div>
                          <Progress value={getScorePercentage(aspect.value)} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Notes - Full Width */}
              {evaluation.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Catatan Evaluasi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base leading-relaxed">{evaluation.notes}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <BarChart3 className="h-6 w-6" />
                    Detail Aspek Kinerja
                  </CardTitle>
                  <CardDescription className="text-base">
                    Penilaian berdasarkan berbagai aspek kompetensi guru
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {performanceStats && [
                      { label: "Kualitas Mengajar", value: performanceStats.teachingQuality, icon: BookOpen },
                      { label: "Manajemen Kelas", value: performanceStats.classroomManagement, icon: Users },
                      { label: "Keterlibatan Siswa", value: performanceStats.studentEngagement, icon: Target },
                      { label: "Pengembangan Profesional", value: performanceStats.professionalDevelopment, icon: GraduationCap },
                      { label: "Kolaborasi", value: performanceStats.collaboration, icon: Users },
                      { label: "Ketepatan Waktu", value: performanceStats.punctuality, icon: Clock },
                    ].map((aspect, index) => {
                      const Icon = aspect.icon
                      return (
                        <div key={index} className="space-y-3 p-4 border-2 rounded-xl hover:shadow-lg transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Icon className="h-5 w-5 text-muted-foreground" />
                              <span className="text-base font-semibold">{aspect.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {getScoreIcon(aspect.value)}
                              <span className={`text-lg font-bold ${getScoreColor(aspect.value)}`}>
                                {aspect.value.toFixed(1)}/5.0
                              </span>
                            </div>
                          </div>
                          <Progress value={getScorePercentage(aspect.value)} className="h-3" />
                          <p className="text-sm font-medium">
                            {aspect.value >= 4.5 ? "Sangat Baik" :
                             aspect.value >= 4.0 ? "Baik" :
                             aspect.value >= 3.5 ? "Cukup" : "Perlu Perbaikan"}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="development" className="space-y-6">
              {/* Development Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6 pb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-1">{developmentStats.total}</div>
                      <div className="text-sm text-muted-foreground">Total Program</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 pb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">{developmentStats.completed}</div>
                      <div className="text-sm text-muted-foreground">Selesai</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 pb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-1">{developmentStats.totalHours}</div>
                      <div className="text-sm text-muted-foreground">Total Jam</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 pb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold mb-1">{formatCurrency(developmentStats.totalCost)}</div>
                      <div className="text-sm text-muted-foreground">Total Biaya</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <GraduationCap className="h-6 w-6" />
                    Program Pengembangan
                  </CardTitle>
                  <CardDescription className="text-base">
                    Riwayat program pelatihan dan pengembangan guru
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {developmentLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : developmentPrograms.length > 0 ? (
                    <div className="rounded-lg border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-base font-semibold">Program</TableHead>
                            <TableHead className="text-base font-semibold">Jenis</TableHead>
                            <TableHead className="text-base font-semibold">Periode</TableHead>
                            <TableHead className="text-base font-semibold">Status</TableHead>
                            <TableHead className="text-base font-semibold">Jam</TableHead>
                            <TableHead className="text-base font-semibold">Biaya</TableHead>
                            <TableHead className="text-base font-semibold">Penyelenggara</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {developmentPrograms.map((program) => (
                            <TableRow key={program.id}>
                              <TableCell className="font-semibold text-sm">{program.programName}</TableCell>
                              <TableCell>{getProgramTypeBadge(program.programType)}</TableCell>
                              <TableCell>
                                <div className="text-xs">
                                  <div className="font-medium">{formatDate(program.startDate)}</div>
                                  <div className="text-muted-foreground">s/d {formatDate(program.endDate)}</div>
                                </div>
                              </TableCell>
                              <TableCell>{getProgramStatusBadge(program.status)}</TableCell>
                              <TableCell className="font-semibold text-sm">{program.hours} jam</TableCell>
                              <TableCell className="font-semibold text-sm">{formatCurrency(program.cost)}</TableCell>
                              <TableCell className="text-sm">{program.provider}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-base text-muted-foreground">Belum ada program pengembangan</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <CheckCircle className="h-6 w-6" />
                      Rekomendasi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {evaluation.recommendations && evaluation.recommendations.length > 0 ? (
                      <ul className="space-y-4">
                        {evaluation.recommendations.map((recommendation, index) => (
                          <li key={index} className="flex items-start gap-3 p-3 border-2 rounded-xl">
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-base leading-relaxed">{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-base text-muted-foreground">Belum ada rekomendasi</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Development Goals */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Target className="h-6 w-6" />
                      Target Pengembangan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {evaluation.developmentGoals && evaluation.developmentGoals.length > 0 ? (
                      <ul className="space-y-4">
                        {evaluation.developmentGoals.map((goal, index) => (
                          <li key={index} className="flex items-start gap-3 p-3 border-2 rounded-xl">
                            <Target className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <span className="text-base leading-relaxed">{goal}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-8">
                        <Target className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-base text-muted-foreground">Belum ada target pengembangan</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-16">
            <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-base text-muted-foreground">Evaluasi tidak ditemukan</p>
          </div>
        )}
      </div>
    </div>
  )
}