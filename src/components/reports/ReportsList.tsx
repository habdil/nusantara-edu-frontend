"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { 
  Search, 
  Download, 
  Eye, 
  Edit, 
  MoreHorizontal,
  FileText,
  Calendar,
  User,
  Send
} from "lucide-react"
import type { Report } from "@/types/reports"

interface ReportsListProps {
  reports: Report[]
  onReportUpdate?: () => void
}

export function ReportsList({ reports, onReportUpdate }: ReportsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const filteredReports = reports.filter(report =>
    report.reportTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.reportType.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "submitted":
        return <Badge className="bg-green-100 text-green-800">Terkirim</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Review</Badge>
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    const colors = {
      "Academic": "bg-blue-100 text-blue-800",
      "Financial": "bg-green-100 text-green-800", 
      "Operational": "bg-purple-100 text-purple-800",
      "Asset": "bg-orange-100 text-orange-800",
      "Compliance": "bg-red-100 text-red-800"
    }
    
    return (
      <Badge className={colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
        {type}
      </Badge>
    )
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(new Date(date))
  }

  const handleDownload = async (report: Report) => {
    // Simulate download
    const link = document.createElement('a')
    link.href = report.fileUrl || '#'
    link.download = `${report.reportTitle}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePreview = (report: Report) => {
    setSelectedReport(report)
    setPreviewOpen(true)
  }

  const handleSubmit = async (report: Report) => {
    // Simulate submit action
    console.log("Submitting report:", report.id)
    onReportUpdate?.()
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Laporan</CardTitle>
          <CardDescription>
            Kelola semua laporan sekolah dalam satu tempat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari laporan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Reports Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Judul Laporan</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead>Periode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal Dibuat</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{report.reportTitle}</div>
                        <div className="text-sm text-muted-foreground">
                          {report.academicYear} • {report.fileFormat?.toUpperCase()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(report.reportType)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {report.reportPeriod}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(report.submissionStatus || "draft")}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {report.createdDate ? formatDate(report.createdDate) : "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreview(report)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {report.fileUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(report)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        )}

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handlePreview(report)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {report.submissionStatus === "pending" && (
                              <DropdownMenuItem onClick={() => handleSubmit(report)}>
                                <Send className="h-4 w-4 mr-2" />
                                Submit
                              </DropdownMenuItem>
                            )}
                            {report.fileUrl && (
                              <DropdownMenuItem onClick={() => handleDownload(report)}>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Tidak Ada Laporan</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Tidak ditemukan laporan yang sesuai dengan pencarian" : "Belum ada laporan yang dibuat"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedReport?.reportTitle}
            </DialogTitle>
            <DialogDescription>
              Preview laporan sebelum download atau submit
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-4">
              {/* Report Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Jenis</p>
                  <p className="font-medium">{selectedReport.reportType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Periode</p>
                  <p className="font-medium">{selectedReport.reportPeriod}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tahun</p>
                  <p className="font-medium">{selectedReport.academicYear}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(selectedReport.submissionStatus || "draft")}
                </div>
              </div>

              {/* Preview Content */}
              <div className="border rounded-lg p-6 min-h-[400px] bg-white">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold">{selectedReport.reportTitle}</h2>
                  <p className="text-muted-foreground">
                    {selectedReport.reportPeriod} {selectedReport.academicYear}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Preview konten laporan akan ditampilkan di sini. 
                    Untuk melihat laporan lengkap, silakan download file.
                  </p>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Ringkasan Laporan:</h4>
                    <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                      <li>Data dan statistik periode {selectedReport.reportPeriod}</li>
                      <li>Analisis performa dan pencapaian target</li>
                      <li>Rekomendasi dan tindak lanjut</li>
                      <li>Lampiran data pendukung</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Tutup
            </Button>
            {selectedReport?.fileUrl && (
              <Button onClick={() => selectedReport && handleDownload(selectedReport)}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}