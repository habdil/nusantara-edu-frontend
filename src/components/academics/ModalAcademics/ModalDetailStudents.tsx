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
import { 
  User, 
  Calendar, 
  MapPin, 
  Phone,
  Users,
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Edit,
  GraduationCap
} from "lucide-react"
import { academicApi } from "../api/academic-api"
import type { Student, StudentAttendance } from "@/types/academic/student.types"
import type { AcademicRecord } from "@/types/academic/record.types"
import type { Subject } from "@/types/academic/subject.types"

interface ModalDetailStudentsProps {
  studentId: number | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (student: Student) => void
}

const getAttendanceStatusBadge = (status: "present" | "excused" | "sick" | "unexcused") => {
  const variants = {
    present: { variant: "default" as const, icon: CheckCircle, text: "Hadir", color: "text-green-600" },
    excused: { variant: "secondary" as const, icon: AlertTriangle, text: "Izin", color: "text-blue-600" },
    sick: { variant: "outline" as const, icon: AlertTriangle, text: "Sakit", color: "text-yellow-600" },
    unexcused: { variant: "destructive" as const, icon: XCircle, text: "Alfa", color: "text-red-600" },
  }

  const config = variants[status]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.text}
    </Badge>
  )
}

const getGradeBadge = (score: number) => {
  if (score >= 90) return <Badge className="bg-green-600">A</Badge>
  if (score >= 80) return <Badge className="bg-blue-600">B</Badge>
  if (score >= 70) return <Badge className="bg-yellow-600">C</Badge>
  if (score >= 60) return <Badge className="bg-orange-600">D</Badge>
  return <Badge variant="destructive">E</Badge>
}

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

const calculateAge = (birthDate: string | Date) => {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

export function ModalDetailStudents({ studentId, isOpen, onClose, onEdit }: ModalDetailStudentsProps) {
  const [student, setStudent] = useState<Student | null>(null)
  const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<StudentAttendance[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(false)
  const [academicLoading, setAcademicLoading] = useState(false)
  const [attendanceLoading, setAttendanceLoading] = useState(false)

  useEffect(() => {
    if (studentId && isOpen) {
      fetchStudentDetail()
    }
  }, [studentId, isOpen])

  const fetchStudentDetail = async () => {
    if (!studentId) return

    setLoading(true)
    try {
      // Fetch student basic info
      const studentData = await academicApi.getStudent(studentId)
      setStudent(studentData)
      
      // Fetch academic records - Backend returns array directly
      setAcademicLoading(true)
      const academicData = await academicApi.getAcademicRecords({
        studentId
      })
      setAcademicRecords(academicData)
      
      // Fetch attendance records - Backend returns array directly  
      setAttendanceLoading(true)
      const attendanceData = await academicApi.getStudentAttendance({
        studentId
      })
      setAttendanceRecords(attendanceData)
      
      // Fetch subjects for the student's grade
      if (studentData.gradeLevel) {
        const subjectsData = await academicApi.getSubjects(studentData.gradeLevel)
        setSubjects(subjectsData)
      }
      
    } catch (error) {
      console.error("Error fetching student detail:", error)
    } finally {
      setLoading(false)
      setAcademicLoading(false)
      setAttendanceLoading(false)
    }
  }

  const handleClose = () => {
    setStudent(null)
    setAcademicRecords([])
    setAttendanceRecords([])
    setSubjects([])
    onClose()
  }

  const handleEdit = () => {
    if (student && onEdit) {
      onEdit(student)
    }
  }

  // Calculate academic statistics
  const academicStats = {
    totalSubjects: academicRecords.length,
    averageScore: academicRecords.length > 0 
      ? academicRecords.reduce((sum, record) => sum + (record.finalScore || 0), 0) / academicRecords.length
      : 0,
    highestScore: academicRecords.length > 0
      ? Math.max(...academicRecords.map(record => record.finalScore || 0))
      : 0,
    lowestScore: academicRecords.length > 0
      ? Math.min(...academicRecords.map(record => record.finalScore || 0))
      : 0
  }

  // Calculate attendance statistics
  const attendanceStats = {
    total: attendanceRecords.length,
    present: attendanceRecords.filter(a => a.status === "present").length,
    excused: attendanceRecords.filter(a => a.status === "excused").length,
    sick: attendanceRecords.filter(a => a.status === "sick").length,
    unexcused: attendanceRecords.filter(a => a.status === "unexcused").length,
  }

  const attendancePercentage = attendanceStats.total > 0 
    ? (attendanceStats.present / attendanceStats.total) * 100 
    : 0

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Detail Siswa
          </DialogTitle>
          <DialogDescription>
            Informasi lengkap tentang siswa dan rekam akademik
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        ) : student ? (
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="attendance">Kehadiran</TabsTrigger>
              <TabsTrigger value="summary">Ringkasan</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold">{student.fullName}</h3>
                  <p className="text-muted-foreground">{student.studentId}</p>
                  <Badge variant="outline" className="mt-2">
                    {student.gradeLevel} - {student.className || 'Belum ditentukan'}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Badge variant={student.isActive ? "default" : "destructive"}>
                    {student.isActive ? "Aktif" : "Tidak Aktif"}
                  </Badge>
                  {onEdit && (
                    <Button variant="outline" size="sm" onClick={handleEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Informasi Pribadi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">NIS</p>
                        <p className="text-sm">{student.studentId}</p>
                      </div>
                      {/* Hapus NISN karena tidak ada di type definition */}
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Kelas</p>
                        <p className="text-sm">{student.className}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Jenis Kelamin</p>
                        <Badge variant={student.gender === "male" ? "default" : "secondary"}>
                          {student.gender === "male" ? "Laki-laki" : "Perempuan"}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Tanggal Lahir</p>
                        <p className="text-sm flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(student.dateOfBirth)}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm font-medium text-muted-foreground">Umur</p>
                        <p className="text-sm">{calculateAge(student.dateOfBirth)} tahun</p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Alamat</p>
                      <p className="text-sm flex items-start gap-1">
                        <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        {"Alamat belum tersedia di sistem"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Tanggal Masuk</p>
                      <p className="text-sm flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(student.enrollmentDate)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Family Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Informasi Keluarga
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Nama Orang Tua/Wali</p>
                      <p className="text-sm">{"Informasi orang tua belum tersedia"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Kontak Orang Tua/Wali</p>
                      <p className="text-sm flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {"Kontak belum tersedia"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Student Photo - Hapus karena tidak ada di type definition */}
                {/* Foto siswa belum tersedia dalam sistem */}
              </div>
            </TabsContent>

            <TabsContent value="academic" className="space-y-6">
              <Card>
                <CardContent>
                  {academicLoading ? (
                    <div className="space-y-3">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : academicRecords.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Mata Pelajaran</TableHead>
                            <TableHead>Semester</TableHead>
                            <TableHead>Tahun Ajaran</TableHead>
                            <TableHead>Pengetahuan</TableHead>
                            <TableHead>Keterampilan</TableHead>
                            <TableHead>Sikap</TableHead>
                            <TableHead>Nilai Akhir</TableHead>
                            <TableHead>Grade</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {academicRecords.map((record) => (
                            <TableRow key={record.id}>
                              <TableCell className="font-medium">
                                {subjects.find(s => s.id === record.subjectId)?.subjectName || 'Unknown'}
                              </TableCell>
                              <TableCell>{record.semester}</TableCell>
                              <TableCell>{record.academicYear}</TableCell>
                              <TableCell>{record.knowledgeScore || "-"}</TableCell>
                              <TableCell>{record.skillScore || "-"}</TableCell>
                              <TableCell>{record.attitudeScore || "-"}</TableCell>
                              <TableCell className="font-semibold">
                                {record.finalScore || "-"}
                              </TableCell>
                              <TableCell>
                                {record.finalScore ? getGradeBadge(record.finalScore) : "-"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Belum ada rekam nilai akademik</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attendance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Rekam Kehadiran
                  </CardTitle>
                  <CardDescription>
                    Riwayat kehadiran siswa (30 hari terakhir)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Attendance Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{attendanceStats.present}</div>
                      <div className="text-sm text-muted-foreground">Hadir</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{attendanceStats.excused}</div>
                      <div className="text-sm text-muted-foreground">Izin</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{attendanceStats.sick}</div>
                      <div className="text-sm text-muted-foreground">Sakit</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{attendanceStats.unexcused}</div>
                      <div className="text-sm text-muted-foreground">Alfa</div>
                    </div>
                  </div>

                  {/* Attendance Percentage */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Persentase Kehadiran</span>
                      <span className="text-sm font-medium">{attendancePercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={attendancePercentage} className="h-2" />
                  </div>

                  {attendanceLoading ? (
                    <div className="space-y-3">
                      {[...Array(10)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : attendanceRecords.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Jam Masuk</TableHead>
                            <TableHead>Jam Keluar</TableHead>
                            <TableHead>Keterangan</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {attendanceRecords.map((record) => (
                            <TableRow key={record.id}>
                              <TableCell>{formatDate(record.attendanceDate)}</TableCell>
                              <TableCell>{getAttendanceStatusBadge(record.status)}</TableCell>
                              <TableCell>{"Jam masuk belum tersedia"}</TableCell>
                              <TableCell>{"Jam keluar belum tersedia"}</TableCell>
                              <TableCell>{record.notes || "-"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Belum ada rekam kehadiran</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="summary" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Academic Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Ringkasan Akademik
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-xl font-bold">{academicStats.totalSubjects}</div>
                        <div className="text-sm text-muted-foreground">Mata Pelajaran</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-xl font-bold">{academicStats.averageScore.toFixed(1)}</div>
                        <div className="text-sm text-muted-foreground">Rata-rata</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-xl font-bold text-green-600">{academicStats.highestScore}</div>
                        <div className="text-sm text-muted-foreground">Tertinggi</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-xl font-bold text-red-600">{academicStats.lowestScore}</div>
                        <div className="text-sm text-muted-foreground">Terendah</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Attendance Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Ringkasan Kehadiran
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold">{attendancePercentage.toFixed(1)}%</div>
                      <div className="text-sm text-muted-foreground">Tingkat Kehadiran</div>
                      <Progress value={attendancePercentage} className="mt-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-lg font-bold text-green-600">{attendanceStats.present}</div>
                        <div className="text-sm text-muted-foreground">Hadir</div>
                      </div>
                      <div className="text-center p-3 border rounded-lg">
                        <div className="text-lg font-bold text-red-600">
                          {attendanceStats.excused + attendanceStats.sick + attendanceStats.unexcused}
                        </div>
                        <div className="text-sm text-muted-foreground">Tidak Hadir</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8">
            <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Siswa tidak ditemukan</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}