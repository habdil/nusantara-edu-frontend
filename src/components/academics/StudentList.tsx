"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Download, Eye, AlertCircle, Upload, FileSpreadsheet } from "lucide-react"
import { toast } from "sonner"
import { Student } from "@/types/academic/student.types"
import { academicApi } from "./api/academic-api"
import { PaginatedResponse } from "@/types/common.types"
import { ModalDetailStudents } from "./ModalAcademics/ModalDetailStudents"

export function StudentList() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [gradeFilter, setGradeFilter] = useState<string>("all")
  const [classFilter, setClassFilter] = useState<string>("all")
  const [exportLoading, setExportLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  const loadStudents = async () => {
    try {
      setLoading(true)
      setError(null)

      const response: PaginatedResponse<Student> = await academicApi.getStudents({
        gradeLevel: gradeFilter !== "all" ? gradeFilter : undefined,
        className: classFilter !== "all" ? classFilter : undefined,
        search: searchTerm || undefined,
        page: pagination.page,
        limit: pagination.limit,
      })

      setStudents(response.data)
      setPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        totalPages: response.totalPages,
      })
    } catch (error: any) {
      console.error("Error loading students:", error)
      setError(error.message || "Gagal memuat data siswa")
      toast.error("Gagal memuat data siswa", {
        description: error.message || "Terjadi kesalahan saat memuat data",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [searchTerm, gradeFilter, classFilter, pagination.page])

  // const handleExport = async (format: "excel" | "pdf" = "excel") => {
  //   try {
  //     setExportLoading(true)

  //     // Show loading toast
  //     const loadingToast = toast.loading(`Menyiapkan file ${format.toUpperCase()}...`, {
  //       description: "Mohon tunggu, sedang memproses data siswa",
  //     })

  //     await academicApi.exportStudents({
  //       gradeLevel: gradeFilter !== "all" ? gradeFilter : undefined,
  //       className: classFilter !== "all" ? classFilter : undefined,
  //       format,
  //     })

  //     // Dismiss loading toast and show success
  //     toast.dismiss(loadingToast)
  //     toast.success(`Data siswa berhasil diunduh dalam format ${format.toUpperCase()}`, {
  //       description: "File telah disimpan ke folder Downloads Anda",
  //     })
  //   } catch (error: any) {
  //     console.error("Error exporting students:", error)

  //     // Provide specific error messages
  //     let errorMessage = "Gagal mengunduh data siswa"
  //     let errorDescription = "Terjadi kesalahan saat memproses permintaan"

  //     // Extract error message from different possible sources
  //     if (error?.message) {
  //       if (error.message.includes("ID siswa tidak valid")) {
  //         errorMessage = "Data siswa tidak valid"
  //         errorDescription = "Terdapat data siswa yang tidak valid dalam sistem"
  //       } else if (error.message.includes("404") || error.message.includes("not found")) {
  //         errorMessage = "Fitur export belum tersedia"
  //         errorDescription = "Endpoint export belum diimplementasi di server"
  //       } else if (error.message.includes("403") || error.message.includes("forbidden")) {
  //         errorMessage = "Akses ditolak"
  //         errorDescription = "Anda tidak memiliki izin untuk mengekspor data"
  //       } else if (error.message.includes("401") || error.message.includes("unauthorized")) {
  //         errorMessage = "Sesi berakhir"
  //         errorDescription = "Silakan login kembali untuk melanjutkan"
  //       } else {
  //         errorDescription = error.message
  //       }
  //     } else if (error?.originalError?.message) {
  //       errorDescription = error.originalError.message
  //     }

  //     toast.error(errorMessage, {
  //       description: errorDescription,
  //       duration: 5000,
  //     })
  //   } finally {
  //     setExportLoading(false)
  //   }
  // }

  // const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0]
  //   if (!file) return

  //   try {
  //     const loadingToast = toast.loading("Mengimpor data siswa...", {
  //       description: "Mohon tunggu, sedang memproses file",
  //     })

  //     const result = await academicApi.importStudents(file)

  //     toast.dismiss(loadingToast)
  //     toast.success(`Import berhasil: ${result.success} siswa ditambahkan`, {
  //       description: result.failed > 0 ? `${result.failed} data gagal diimpor` : "Semua data berhasil diimpor",
  //     })

  //     // Reload data after import
  //     loadStudents()
  //   } catch (error: any) {
  //     console.error("Error importing students:", error)
  //     toast.error("Gagal mengimpor data siswa", {
  //       description: error.message || "Terjadi kesalahan saat mengimpor data",
  //     })
  //   }

  //   // Reset file input
  //   event.target.value = ""
  // }

  const handleViewDetail = (studentId: number) => {
    setSelectedStudentId(studentId)
    setIsModalOpen(true)
  }

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)
const [isModalOpen, setIsModalOpen] = useState(false)

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Data Siswa</CardTitle>
          <CardDescription>Daftar siswa dan informasi akademik</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button variant="outline" size="sm" className="ml-2 bg-transparent" onClick={loadStudents}>
                Coba Lagi
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Siswa</CardTitle>
        <CardDescription>Daftar siswa dan informasi akademik - Total: {pagination.total} siswa</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters and Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Cari nama siswa atau NIS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Pilih Kelas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kelas</SelectItem>
              <SelectItem value="1">Kelas 1</SelectItem>
              <SelectItem value="2">Kelas 2</SelectItem>
              <SelectItem value="3">Kelas 3</SelectItem>
              <SelectItem value="4">Kelas 4</SelectItem>
              <SelectItem value="5">Kelas 5</SelectItem>
              <SelectItem value="6">Kelas 6</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">

            <div className="relative">
              <Input
                type="file"
                accept=".xlsx,.xls,.csv"
                // onChange={handleImport}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>NIS</TableHead>
                <TableHead>Nama Lengkap</TableHead>
                <TableHead>Kelas</TableHead>
                <TableHead>Jenis Kelamin</TableHead>
                <TableHead>Tanggal Lahir</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                    </TableCell>
                    <TableCell>
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : students.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                    Tidak ada data siswa
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.studentId}</TableCell>
                    <TableCell>{student.fullName}</TableCell>
                    <TableCell>{student.className}</TableCell>
                    <TableCell>
                      <Badge variant={student.gender === "male" ? "default" : "secondary"}>
                        {student.gender === "male" ? "Laki-laki" : "Perempuan"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(student.dateOfBirth).toLocaleDateString("id-ID")}</TableCell>
                    <TableCell>
                      <Badge variant={student.isActive ? "default" : "destructive"}>
                        {student.isActive ? "Aktif" : "Tidak Aktif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => handleViewDetail(student.id)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <ModalDetailStudents
          studentId={selectedStudentId}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedStudentId(null)
          }}
          onEdit={(student) => {
            // Handle edit functionality
            console.log("Edit student:", student)
          }}
        />

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Menampilkan {(pagination.page - 1) * pagination.limit + 1} -{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total} siswa
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= pagination.totalPages}
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
  
}
