"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { 
  FileText, 
  Calendar, 
  Clock,
  CheckCircle,
  ArrowRight,
  Download,
  Send
} from "lucide-react"
import { reportsApi } from "./api/reports-api"

interface ReportGeneratorProps {
  onReportCreated?: () => void
}

export function ReportGenerator({ onReportCreated }: ReportGeneratorProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  
  const [formData, setFormData] = useState({
    reportTitle: "",
    reportType: "",
    reportPeriod: "",
    academicYear: "2024",
    includeCharts: true,
    includeAnalysis: true,
    includeRecommendations: true,
    fileFormat: "pdf",
    description: "",
    selectedSections: [] as string[],
    customSections: ""
  })

  const reportTypes = [
    { value: "Academic", label: "Akademik", description: "Performa siswa, kurikulum, pembelajaran" },
    { value: "Financial", label: "Keuangan", description: "Anggaran, pemasukan, pengeluaran" },
    { value: "Operational", label: "Operasional", description: "Kegiatan harian, kehadiran, operasi" },
    { value: "Asset", label: "Aset & Fasilitas", description: "Inventaris, kondisi, perawatan" },
    { value: "Compliance", label: "Kepatuhan", description: "Regulasi, standar, akreditasi" }
  ]

  const periods = [
    "Mingguan", "Bulanan", "Triwulanan", "Semesteran", "Tahunan", "Custom"
  ]

  const academicSections = [
    "Data Kehadiran Siswa", "Analisis Prestasi Akademik", "Progress Kurikulum",
    "Evaluasi Pembelajaran", "Ekstrakurikuler", "Ujian & Penilaian"
  ]

  const financialSections = [
    "Ringkasan Anggaran", "Realisasi Pendapatan", "Detail Pengeluaran",
    "Analisis Varians", "Cash Flow", "Proyeksi Keuangan"
  ]

  const operationalSections = [
    "Kehadiran Staff", "Kegiatan Pembelajaran", "Maintenance Fasilitas",
    "Keamanan Sekolah", "Program Khusus", "Issue Management"
  ]

  const getSectionsForType = (type: string) => {
    switch (type) {
      case "Academic":
        return academicSections
      case "Financial":
        return financialSections
      case "Operational":
        return operationalSections
      case "Asset":
        return ["Inventaris Aset", "Kondisi Fasilitas", "Maintenance", "Pengadaan", "Penyusutan"]
      case "Compliance":
        return ["SNP Compliance", "Regulasi", "Akreditasi", "Audit", "Sertifikasi"]
      default:
        return []
    }
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSectionChange = (section: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedSections: checked 
        ? [...prev.selectedSections, section]
        : prev.selectedSections.filter(s => s !== section)
    }))
  }

  const handleGenerate = async () => {
    setGenerating(true)
    setGenerationProgress(0)

    // Simulate report generation with progress
    const progressSteps = [
      { step: 20, message: "Mengumpulkan data..." },
      { step: 40, message: "Menganalisis informasi..." },
      { step: 60, message: "Membuat visualisasi..." },
      { step: 80, message: "Menyusun laporan..." },
      { step: 100, message: "Menyelesaikan..." }
    ]

    for (const { step } of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setGenerationProgress(step)
    }

    try {
      await reportsApi.generateReport(formData)
      onReportCreated?.()
      setCurrentStep(5) // Success step
    } catch (error) {
      console.error("Error generating report:", error)
    } finally {
      setGenerating(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.reportTitle && formData.reportType && formData.reportPeriod
      case 2:
        return formData.selectedSections.length > 0
      case 3:
        return true // Optional customizations
      default:
        return true
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Informasi Dasar Laporan</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Judul Laporan</Label>
                  <Input
                    id="title"
                    placeholder="Contoh: Laporan Akademik Bulanan Januari 2024"
                    value={formData.reportTitle}
                    onChange={(e) => setFormData(prev => ({...prev, reportTitle: e.target.value}))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Jenis Laporan</Label>
                    <Select value={formData.reportType} onValueChange={(value) => 
                      setFormData(prev => ({...prev, reportType: value, selectedSections: []}))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis laporan" />
                      </SelectTrigger>
                      <SelectContent>
                        {reportTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-muted-foreground">{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Periode</Label>
                    <Select value={formData.reportPeriod} onValueChange={(value) => 
                      setFormData(prev => ({...prev, reportPeriod: value}))
                    }>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih periode" />
                      </SelectTrigger>
                      <SelectContent>
                        {periods.map((period) => (
                          <SelectItem key={period} value={period}>{period}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tahun Akademik</Label>
                  <Select value={formData.academicYear} onValueChange={(value) => 
                    setFormData(prev => ({...prev, academicYear: value}))
                  }>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Deskripsi (Opsional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Deskripsi singkat tentang laporan ini..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Pilih Bagian Laporan</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Pilih bagian-bagian yang ingin disertakan dalam laporan {formData.reportType}
              </p>

              <div className="space-y-3">
                {getSectionsForType(formData.reportType).map((section) => (
                  <div key={section} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <Checkbox
                      id={section}
                      checked={formData.selectedSections.includes(section)}
                      onCheckedChange={(checked) => handleSectionChange(section, !!checked)}
                    />
                    <Label htmlFor={section} className="flex-1 cursor-pointer">
                      {section}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2">
                <Label htmlFor="custom">Bagian Kustom (Opsional)</Label>
                <Textarea
                  id="custom"
                  placeholder="Tambahkan bagian khusus yang tidak ada dalam daftar di atas..."
                  value={formData.customSections}
                  onChange={(e) => setFormData(prev => ({...prev, customSections: e.target.value}))}
                  rows={3}
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Opsi Laporan</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Konten Tambahan</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="charts"
                        checked={formData.includeCharts}
                        onCheckedChange={(checked) => setFormData(prev => ({...prev, includeCharts: !!checked}))}
                      />
                      <Label htmlFor="charts">Sertakan grafik dan visualisasi data</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="analysis"
                        checked={formData.includeAnalysis}
                        onCheckedChange={(checked) => setFormData(prev => ({...prev, includeAnalysis: !!checked}))}
                      />
                      <Label htmlFor="analysis">Sertakan analisis dan interpretasi</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="recommendations"
                        checked={formData.includeRecommendations}
                        onCheckedChange={(checked) => setFormData(prev => ({...prev, includeRecommendations: !!checked}))}
                      />
                      <Label htmlFor="recommendations">Sertakan rekomendasi dan tindak lanjut</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Format File</h4>
                  <RadioGroup
                    value={formData.fileFormat}
                    onValueChange={(value) => setFormData(prev => ({...prev, fileFormat: value}))}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="pdf" id="pdf" />
                      <Label htmlFor="pdf">PDF (Direkomendasikan)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="docx" id="docx" />
                      <Label htmlFor="docx">Word Document (.docx)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="xlsx" id="xlsx" />
                      <Label htmlFor="xlsx">Excel Spreadsheet (.xlsx)</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Review & Generate</h3>
              
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Ringkasan Laporan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Judul</p>
                        <p className="font-medium">{formData.reportTitle}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Jenis</p>
                        <p className="font-medium">{reportTypes.find(t => t.value === formData.reportType)?.label}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Periode</p>
                        <p className="font-medium">{formData.reportPeriod} {formData.academicYear}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Format</p>
                        <p className="font-medium">{formData.fileFormat.toUpperCase()}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-muted-foreground text-sm">Bagian yang Disertakan</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {formData.selectedSections.map((section) => (
                          <Badge key={section} variant="secondary" className="text-xs">
                            {section}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {generating && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span>Generating laporan...</span>
                          <span>{generationProgress}%</span>
                        </div>
                        <Progress value={generationProgress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Laporan Berhasil Dibuat!</h3>
              <p className="text-muted-foreground">
                Laporan "{formData.reportTitle}" telah berhasil dibuat dan siap untuk didownload.
              </p>
            </div>

            <div className="flex gap-3 justify-center">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Kirim Laporan
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generator Laporan</CardTitle>
        <CardDescription>
          Buat laporan sekolah dengan mudah menggunakan wizard step-by-step
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progress Steps */}
          {currentStep < 5 && (
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-16 h-0.5 mx-2 ${
                      step < currentStep ? 'bg-primary' : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Step Content */}
          <div className="min-h-[400px]">
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          {currentStep < 5 && (
            <div className="flex justify-between pt-6">
              <Button 
                variant="outline" 
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                Sebelumnya
              </Button>
              
              {currentStep < 4 ? (
                <Button 
                  onClick={handleNext}
                  disabled={!isStepValid()}
                >
                  Selanjutnya
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleGenerate}
                  disabled={generating || !isStepValid()}
                >
                  {generating ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Laporan
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}