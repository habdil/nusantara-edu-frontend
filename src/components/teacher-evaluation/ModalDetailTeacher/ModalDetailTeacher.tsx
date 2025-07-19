"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
  X
} from "lucide-react"
import { teacherEvaluationApi, type TeacherEvaluation, type TeacherDevelopment } from "../api/teacher-evaluation-api"

interface ModalDetailTeacherProps {
  evaluationId: number | null
  isOpen: boolean
  onClose: () => void
}

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

export function ModalDetailTeacher({ evaluationId, isOpen, onClose }: ModalDetailTeacherProps) {
  const [evaluation, setEvaluation] = useState<TeacherEvaluation | null>(null)
  const [developmentPrograms, setDevelopmentPrograms] = useState<TeacherDevelopment[]>([])
  const [loading, setLoading] = useState(false)
  const [developmentLoading, setDevelopmentLoading] = useState(false)

  useEffect(() => {
    if (evaluationId && isOpen) {
      fetchEvaluationDetail()
    }
  }, [evaluationId, isOpen])

  const fetchEvaluationDetail = async () => {
    if (!evaluationId) return

    setLoading(true)
    try {
      // Fetch evaluation detail
      const evaluationData = await teacherEvaluationApi.getEvaluationById(evaluationId)
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

  const handleClose = () => {
    setEvaluation(null)
    setDevelopmentPrograms([])
    onClose()
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

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[98vw] w-full h-[98vh] max-h-[98vh] overflow-hidden p-0 gap-0">
        {/* Fixed Header */}
        <DialogHeader className="px-8 py-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
                <GraduationCap className="h-7 w-7" />
                Detail Evaluasi Guru
              </DialogTitle>
              <DialogDescription className="text-base mt-1">
                Informasi lengkap evaluasi kinerja dan program pengembangan guru
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleClose} className="h-8 w-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-8 py-6">
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
                <TabsList className="grid w-full grid-cols-4 mb-8 h-12">
                  <TabsTrigger value="overview" className="text-base font-medium">Ringkasan</TabsTrigger>
                  <TabsTrigger value="performance" className="text-base font-medium">Kinerja</TabsTrigger>
                  <TabsTrigger value="development" className="text-base font-medium">Program Pengembangan</TabsTrigger>
                  <TabsTrigger value="recommendations" className="text-base font-medium">Rekomendasi</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-8">
                  {/* Teacher Profile Header */}
                  <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center gap-6">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={evaluation.profilePhoto || "/placeholder.svg"} />
                        <AvatarFallback className="text-2xl font-semibold">{getInitials(evaluation.teacherName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h1 className="text-4xl font-bold mb-2">{evaluation.teacherName}</h1>
                        <p className="text-muted-foreground text-xl">{evaluation.employeeId} • {evaluation.position}</p>
                        <Badge variant="outline" className="mt-3 text-base px-4 py-2">
                          {evaluation.subjectArea}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-3 items-center">
                      {getStatusBadge(evaluation.status)}
                    </div>
                  </div>

                  {/* Overview Cards Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {/* Basic Information */}
                    <Card className="lg:col-span-1">
                      <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-3">
                          <User className="h-6 w-6" />
                          Informasi Evaluasi
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Periode Evaluasi</p>
                            <p className="text-lg font-semibold">{evaluation.evaluationPeriod}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Tahun Akademik</p>
                            <p className="text-lg font-semibold">{evaluation.academicYear}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Tanggal Evaluasi</p>
                            <p className="text-base flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {formatDate(evaluation.evaluationDate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Evaluator</p>
                            <p className="text-base">{evaluation.evaluatorName}</p>
                          </div>
                        </div>

                        <Separator />

                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-4">Tingkat Kehadiran</p>
                          <div className="flex items-center gap-4">
                            <Progress value={evaluation.attendanceRate} className="flex-1 h-4" />
                            <span className={`text-xl font-bold ${
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
                        <CardTitle className="text-xl flex items-center gap-3">
                          <Award className="h-6 w-6" />
                          Skor Keseluruhan
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-4 mb-6">
                            {getScoreIcon(evaluation.overallScore)}
                            <span className={`text-6xl font-bold ${getScoreColor(evaluation.overallScore)}`}>
                              {evaluation.overallScore.toFixed(1)}
                            </span>
                            <span className="text-muted-foreground text-2xl">/5.0</span>
                          </div>
                          <div className="flex justify-center mb-6">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-8 w-8 ${
                                  i < Math.floor(evaluation.overallScore)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <Progress value={getScorePercentage(evaluation.overallScore)} className="mb-4 h-4" />
                          <p className="text-lg font-semibold">
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
                        <CardTitle className="text-xl flex items-center gap-3">
                          <BarChart3 className="h-6 w-6" />
                          Ringkasan Kinerja
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {performanceStats && [
                            { label: "Kualitas Mengajar", value: performanceStats.teachingQuality },
                            { label: "Manajemen Kelas", value: performanceStats.classroomManagement },
                            { label: "Keterlibatan Siswa", value: performanceStats.studentEngagement },
                            { label: "Pengembangan Profesional", value: performanceStats.professionalDevelopment },
                          ].map((aspect, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{aspect.label}</span>
                                <span className={`text-sm font-bold ${getScoreColor(aspect.value)}`}>
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
                        <CardTitle className="text-xl flex items-center gap-3">
                          <FileText className="h-6 w-6" />
                          Catatan Evaluasi
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-lg leading-relaxed">{evaluation.notes}</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="performance" className="space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        <BarChart3 className="h-7 w-7" />
                        Detail Aspek Kinerja
                      </CardTitle>
                      <CardDescription className="text-lg">
                        Penilaian berdasarkan berbagai aspek kompetensi guru
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
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
                            <div key={index} className="space-y-4 p-6 border-2 rounded-xl hover:shadow-lg transition-shadow">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                  <Icon className="h-6 w-6 text-muted-foreground" />
                                  <span className="text-lg font-semibold">{aspect.label}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  {getScoreIcon(aspect.value)}
                                  <span className={`text-xl font-bold ${getScoreColor(aspect.value)}`}>
                                    {aspect.value.toFixed(1)}/5.0
                                  </span>
                                </div>
                              </div>
                              <Progress value={getScorePercentage(aspect.value)} className="h-4" />
                              <p className="text-base font-medium">
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

                <TabsContent value="development" className="space-y-8">
                  {/* Development Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                      <CardContent className="pt-8 pb-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold mb-2">{developmentStats.total}</div>
                          <div className="text-base text-muted-foreground">Total Program</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-8 pb-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-green-600 mb-2">{developmentStats.completed}</div>
                          <div className="text-base text-muted-foreground">Selesai</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-8 pb-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold mb-2">{developmentStats.totalHours}</div>
                          <div className="text-base text-muted-foreground">Total Jam</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-8 pb-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold mb-2">{formatCurrency(developmentStats.totalCost)}</div>
                          <div className="text-base text-muted-foreground">Total Biaya</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        <GraduationCap className="h-7 w-7" />
                        Program Pengembangan
                      </CardTitle>
                      <CardDescription className="text-lg">
                        Riwayat program pelatihan dan pengembangan guru
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {developmentLoading ? (
                        <div className="space-y-6">
                          {[...Array(3)].map((_, i) => (
                            <Skeleton key={i} className="h-24 w-full" />
                          ))}
                        </div>
                      ) : developmentPrograms.length > 0 ? (
                        <div className="rounded-lg border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-lg font-semibold">Program</TableHead>
                                <TableHead className="text-lg font-semibold">Jenis</TableHead>
                                <TableHead className="text-lg font-semibold">Periode</TableHead>
                                <TableHead className="text-lg font-semibold">Status</TableHead>
                                <TableHead className="text-lg font-semibold">Jam</TableHead>
                                <TableHead className="text-lg font-semibold">Biaya</TableHead>
                                <TableHead className="text-lg font-semibold">Penyelenggara</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {developmentPrograms.map((program) => (
                                <TableRow key={program.id}>
                                  <TableCell className="font-semibold text-base">{program.programName}</TableCell>
                                  <TableCell>{getProgramTypeBadge(program.programType)}</TableCell>
                                  <TableCell>
                                    <div className="text-sm">
                                      <div className="font-medium">{formatDate(program.startDate)}</div>
                                      <div className="text-muted-foreground">s/d {formatDate(program.endDate)}</div>
                                    </div>
                                  </TableCell>
                                  <TableCell>{getProgramStatusBadge(program.status)}</TableCell>
                                  <TableCell className="font-semibold">{program.hours} jam</TableCell>
                                  <TableCell className="font-semibold">{formatCurrency(program.cost)}</TableCell>
                                  <TableCell>{program.provider}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="text-center py-16">
                          <GraduationCap className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
                          <p className="text-xl text-muted-foreground">Belum ada program pengembangan</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Recommendations */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                          <CheckCircle className="h-7 w-7" />
                          Rekomendasi
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {evaluation.recommendations && evaluation.recommendations.length > 0 ? (
                          <ul className="space-y-6">
                            {evaluation.recommendations.map((recommendation, index) => (
                              <li key={index} className="flex items-start gap-4 p-4 border-2 rounded-xl">
                                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                                <span className="text-lg leading-relaxed">{recommendation}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-center py-12">
                            <CheckCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-lg text-muted-foreground">Belum ada rekomendasi</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Development Goals */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                          <Target className="h-7 w-7" />
                          Target Pengembangan
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {evaluation.developmentGoals && evaluation.developmentGoals.length > 0 ? (
                          <ul className="space-y-6">
                            {evaluation.developmentGoals.map((goal, index) => (
                              <li key={index} className="flex items-start gap-4 p-4 border-2 rounded-xl">
                                <Target className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                                <span className="text-lg leading-relaxed">{goal}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-center py-12">
                            <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <p className="text-lg text-muted-foreground">Belum ada target pengembangan</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-20">
                <GraduationCap className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
                <p className="text-xl text-muted-foreground">Evaluasi tidak ditemukan</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}