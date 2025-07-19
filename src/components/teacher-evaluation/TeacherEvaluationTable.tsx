"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Star, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { useRouter } from "next/navigation"
import type { TeacherEvaluation } from "./api/teacher-evaluation-api"

interface TeacherEvaluationTableProps {
  evaluations: TeacherEvaluation[]
  isLoading?: boolean
}

export function TeacherEvaluationTable({
  evaluations,
  isLoading,
}: TeacherEvaluationTableProps) {
  const router = useRouter()

  // Handler untuk navigasi ke halaman detail
  const handleViewDetails = (evaluation: TeacherEvaluation) => {
    router.push(`/dashboard/teacher-evaluation/${evaluation.id}`)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: "Draft", variant: "secondary" as const },
      completed: { label: "Selesai", variant: "default" as const },
      reviewed: { label: "Direview", variant: "outline" as const },
      approved: { label: "Disetujui", variant: "default" as const },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "text-green-600"
    if (score >= 4.0) return "text-blue-600"
    if (score >= 3.5) return "text-orange-600"
    return "text-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 4.5) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (score >= 4.0) return <Minus className="h-4 w-4 text-blue-600" />
    return <TrendingDown className="h-4 w-4 text-red-600" />
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daftar Evaluasi Guru</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-muted animate-pulse rounded-full" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                </div>
                <div className="h-6 w-16 bg-muted animate-pulse rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daftar Evaluasi Guru</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guru</TableHead>
                <TableHead>Mata Pelajaran</TableHead>
                <TableHead>Periode</TableHead>
                <TableHead>Skor Keseluruhan</TableHead>
                <TableHead>Kehadiran</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tanggal Evaluasi</TableHead>
                <TableHead className="w-[100px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Tidak ada data evaluasi ditemukan
                  </TableCell>
                </TableRow>
              ) : (
                evaluations.map((evaluation) => (
                  <TableRow key={evaluation.id} className="hover:bg-muted/50 cursor-pointer">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={evaluation.profilePhoto || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">{getInitials(evaluation.teacherName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{evaluation.teacherName}</div>
                          <div className="text-sm text-muted-foreground">
                            {evaluation.employeeId} • {evaluation.position}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{evaluation.subjectArea}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{evaluation.evaluationPeriod}</div>
                        <div className="text-muted-foreground">{evaluation.academicYear}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getScoreIcon(evaluation.overallScore)}
                        <span className={`font-medium ${getScoreColor(evaluation.overallScore)}`}>
                          {evaluation.overallScore.toFixed(1)}
                        </span>
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(evaluation.overallScore)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span
                          className={
                            evaluation.attendanceRate >= 95
                              ? "text-green-600"
                              : evaluation.attendanceRate >= 90
                                ? "text-orange-600"
                                : "text-red-600"
                          }
                        >
                          {evaluation.attendanceRate}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(evaluation.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">{new Date(evaluation.evaluationDate).toLocaleDateString("id-ID")}</div>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(evaluation)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}