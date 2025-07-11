"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar,
  Clock,
  Users,
  DollarSign,
  BookOpen,
  Settings
} from "lucide-react"

interface ReportTemplate {
  id: number
  title: string
  description: string
  type: string
  frequency: string
  estimatedTime: string
  sections: string[]
  icon: any
  color: string
}

export function ReportTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const templates: ReportTemplate[] = [
    {
      id: 1,
      title: "Laporan Akademik Bulanan",
      description: "Laporan performa akademik siswa, kehadiran, dan pencapaian pembelajaran",
      type: "Academic",
      frequency: "Bulanan",
      estimatedTime: "2-3 jam",
      sections: [
        "Ringkasan Kehadiran Siswa",
        "Analisis Nilai & Prestasi",
        "Progress Kurikulum",
        "Evaluasi Metode Pembelajaran",
        "Rekomendasi Perbaikan"
      ],
      icon: BookOpen,
      color: "bg-blue-100 text-blue-800"
    },
    {
      id: 2,
      title: "Laporan Keuangan Semester",
      description: "Laporan realisasi anggaran, pemasukan, pengeluaran, dan proyeksi keuangan",
      type: "Financial",
      frequency: "Semesteran",
      estimatedTime: "4-5 jam",
      sections: [
        "Ringkasan Anggaran",
        "Realisasi Pemasukan",
        "Detail Pengeluaran",
        "Analisis Varians",
        "Proyeksi Periode Berikutnya"
      ],
      icon: DollarSign,
      color: "bg-green-100 text-green-800"
    },
    {
      id: 3,
      title: "Laporan Operasional Mingguan", 
      description: "Laporan kegiatan harian, kehadiran staff, dan operasional sekolah",
      type: "Operational",
      frequency: "Mingguan",
      estimatedTime: "1-2 jam",
      sections: [
        "Kehadiran Guru & Staff",
        "Kegiatan Pembelajaran",
        "Fasilitas & Maintenance", 
        "Keamanan & Kebersihan",
        "Issue & Tindak Lanjut"
      ],
      icon: Settings,
      color: "bg-purple-100 text-purple-800"
    },
    {
      id: 4,
      title: "Laporan Aset & Fasilitas",
      description: "Laporan kondisi aset, perawatan fasilitas, dan inventaris sekolah",
      type: "Asset",
      frequency: "Triwulanan",
      estimatedTime: "3-4 jam",
      sections: [
        "Inventaris Aset",
        "Kondisi Fasilitas",
        "Maintenance Schedule",
        "Pengadaan Baru",
        "Rekomendasi Perawatan"
      ],
      icon: FileText,
      color: "bg-orange-100 text-orange-800"
    },
    {
      id: 5,
      title: "Laporan Kepatuhan",
      description: "Laporan compliance terhadap regulasi pendidikan dan standar nasional",
      type: "Compliance", 
      frequency: "Tahunan",
      estimatedTime: "6-8 jam",
      sections: [
        "Standar Nasional Pendidikan",
        "Compliance Regulasi",
        "Akreditasi Status",
        "Audit Internal",
        "Action Plan Improvement"
      ],
      icon: Users,
      color: "bg-red-100 text-red-800"
    }
  ]

  const handlePreview = (template: ReportTemplate) => {
    setSelectedTemplate(template)
    setPreviewOpen(true)
  }

  const handleUseTemplate = (template: ReportTemplate) => {
    console.log("Using template:", template.title)
    // This would typically navigate to report generator with template
  }

  const handleDownloadTemplate = (template: ReportTemplate) => {
    // Simulate template download
    const link = document.createElement('a')
    link.href = '#'
    link.download = `Template_${template.title.replace(/\s+/g, '_')}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Template Laporan</CardTitle>
          <CardDescription>
            Template siap pakai untuk mempercepat pembuatan laporan sekolah
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => {
              const Icon = template.icon
              return (
                <Card key={template.id} className="relative overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${template.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{template.title}</CardTitle>
                          <Badge className={template.color} variant="secondary">
                            {template.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {template.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Frekuensi</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {template.frequency}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Estimasi Waktu</p>
                        <p className="font-medium flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {template.estimatedTime}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Bagian Laporan:</p>
                      <ul className="text-xs space-y-1">
                        {template.sections.slice(0, 3).map((section, index) => (
                          <li key={index} className="flex items-center gap-2 text-muted-foreground">
                            <div className="h-1 w-1 rounded-full bg-muted-foreground" />
                            {section}
                          </li>
                        ))}
                        {template.sections.length > 3 && (
                          <li className="text-muted-foreground">
                            +{template.sections.length - 3} bagian lainnya
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handlePreview(template)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleUseTemplate(template)}
                      >
                        Gunakan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTemplate && (
                <>
                  <selectedTemplate.icon className="h-5 w-5" />
                  {selectedTemplate.title}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Preview struktur dan konten template laporan
            </DialogDescription>
          </DialogHeader>
          
          {selectedTemplate && (
            <div className="space-y-6">
              {/* Template Info */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Jenis</p>
                  <Badge className={selectedTemplate.color}>{selectedTemplate.type}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Frekuensi</p>
                  <p className="font-medium">{selectedTemplate.frequency}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estimasi Waktu</p>
                  <p className="font-medium">{selectedTemplate.estimatedTime}</p>
                </div>
              </div>

              {/* Template Structure */}
              <div className="space-y-4">
                <h4 className="font-semibold">Struktur Laporan</h4>
                <div className="space-y-3">
                  {selectedTemplate.sections.map((section, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium">{section}</h5>
                        <p className="text-sm text-muted-foreground mt-1">
                          {getSessionDescription(section)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Content */}
              <div className="space-y-4">
                <h4 className="font-semibold">Contoh Konten</h4>
                <div className="border rounded-lg p-4 bg-muted/20">
                  <p className="text-sm text-muted-foreground">
                    Template ini akan menghasilkan laporan dengan format standar yang mencakup:
                  </p>
                  <ul className="list-disc list-inside text-sm space-y-1 mt-2 text-muted-foreground">
                    <li>Header dengan logo dan informasi sekolah</li>
                    <li>Ringkasan eksekutif dan key findings</li>
                    <li>Data dan statistik yang relevan</li>
                    <li>Analisis dan interpretasi hasil</li>
                    <li>Rekomendasi dan action items</li>
                    <li>Lampiran data pendukung</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Tutup
            </Button>
            <Button 
              variant="outline"
              onClick={() => selectedTemplate && handleDownloadTemplate(selectedTemplate)}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </Button>
            <Button onClick={() => {
              if (selectedTemplate) {
                handleUseTemplate(selectedTemplate)
                setPreviewOpen(false)
              }
            }}>
              Gunakan Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Helper function to get section descriptions
function getSessionDescription(section: string): string {
  const descriptions: Record<string, string> = {
    "Ringkasan Kehadiran Siswa": "Data statistik kehadiran, absensi, dan tren per kelas",
    "Analisis Nilai & Prestasi": "Evaluasi prestasi akademik, nilai rata-rata, dan pencapaian target",
    "Progress Kurikulum": "Status implementasi kurikulum dan ketercapaian pembelajaran",
    "Evaluasi Metode Pembelajaran": "Assessment efektivitas metode mengajar dan tools pembelajaran",
    "Rekomendasi Perbaikan": "Saran konkret untuk peningkatan kualitas pendidikan",
    "Ringkasan Anggaran": "Overview alokasi dan penggunaan anggaran periode berjalan",
    "Realisasi Pemasukan": "Detail sumber pemasukan dan pencapaian target revenue",
    "Detail Pengeluaran": "Breakdown pengeluaran berdasarkan kategori dan prioritas",
    "Analisis Varians": "Perbandingan budget vs actual dengan analisis penyebab",
    "Proyeksi Periode Berikutnya": "Forecasting kebutuhan anggaran periode mendatang",
    "Kehadiran Guru & Staff": "Data kehadiran, cuti, dan produktivitas SDM",
    "Kegiatan Pembelajaran": "Laporan aktivitas belajar mengajar dan ekstrakurikuler",
    "Fasilitas & Maintenance": "Status pemeliharaan dan kondisi fasilitas sekolah",
    "Keamanan & Kebersihan": "Evaluasi lingkungan sekolah dan protokol keamanan",
    "Issue & Tindak Lanjut": "Masalah operasional dan rencana penyelesaian",
    "Inventaris Aset": "Daftar lengkap aset sekolah dengan nilai dan kondisi",
    "Kondisi Fasilitas": "Assessment kondisi bangunan dan infrastruktur",
    "Maintenance Schedule": "Jadwal perawatan preventif dan corrective",
    "Pengadaan Baru": "Rencana procurement aset dan fasilitas baru",
    "Rekomendasi Perawatan": "Prioritas perbaikan dan upgrade fasilitas",
    "Standar Nasional Pendidikan": "Compliance terhadap 8 SNP dan indikator mutu",
    "Compliance Regulasi": "Kepatuhan terhadap peraturan pendidikan terbaru",
    "Akreditasi Status": "Status akreditasi dan persiapan visitasi",
    "Audit Internal": "Hasil audit internal dan temuan perbaikan",
    "Action Plan Improvement": "Rencana peningkatan mutu berkelanjutan"
  }
  
  return descriptions[section] || "Deskripsi detail untuk bagian ini akan dijelaskan dalam template"
}