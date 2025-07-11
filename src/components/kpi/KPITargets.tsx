"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  TrendingDown,
  Edit,
  Plus,
  BarChart3
} from "lucide-react"
import type { SchoolKpi } from "@/types/kpi"

interface KPITargetsProps {
  kpis: SchoolKpi[]
}

export function KPITargets({ kpis }: KPITargetsProps) {
  const [selectedKpi, setSelectedKpi] = useState<SchoolKpi | null>(null)
  const [editingAnalysis, setEditingAnalysis] = useState(false)
  const [newAnalysis, setNewAnalysis] = useState("")

  const getStatusBadge = (kpi: SchoolKpi) => {
    const percentage = kpi.achievementPercentage || 0
    if (percentage >= 90) {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Excellent</Badge>
    } else if (percentage >= 70) {
      return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Good</Badge>
    } else {
      return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Needs Attention</Badge>
    }
  }

  const getPriorityColor = (priority?: number) => {
    if (!priority) return "bg-gray-100"
    if (priority <= 2) return "bg-red-100 text-red-800"
    if (priority <= 4) return "bg-yellow-100 text-yellow-800"
    return "bg-green-100 text-green-800"
  }

  const getRecommendations = (kpi: SchoolKpi) => {
    const percentage = kpi.achievementPercentage || 0
    const category = kpi.kpiCategory
    
    if (percentage >= 90) {
      return [
        "Pertahankan strategi yang sudah efektif",
        "Dokumentasikan best practices untuk replikasi",
        "Pertimbangkan untuk meningkatkan target"
      ]
    } else if (percentage >= 70) {
      return [
        `Evaluasi faktor penghambat pencapaian target ${category.toLowerCase()}`,
        "Tingkatkan frekuensi monitoring dan evaluasi",
        "Alokasikan sumber daya tambahan jika diperlukan"
      ]
    } else {
      return [
        `Lakukan analisis mendalam terhadap ${category.toLowerCase()}`,
        "Buat action plan dengan timeline yang jelas",
        "Tingkatkan koordinasi antar stakeholder",
        "Pertimbangkan revisi strategi atau target"
      ]
    }
  }

  // Categorize KPIs by performance
  const excellentKpis = kpis.filter(kpi => (kpi.achievementPercentage || 0) >= 90)
  const goodKpis = kpis.filter(kpi => (kpi.achievementPercentage || 0) >= 70 && (kpi.achievementPercentage || 0) < 90)
  const needsAttentionKpis = kpis.filter(kpi => (kpi.achievementPercentage || 0) < 70)

  // High priority KPIs that need attention
  const criticalKpis = kpis.filter(kpi => 
    (kpi.achievementPercentage || 0) < 70 && (kpi.priority || 5) <= 3
  )

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Excellent</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{excellentKpis.length}</div>
            <p className="text-xs text-muted-foreground">≥90% target tercapai</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Good</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{goodKpis.length}</div>
            <p className="text-xs text-muted-foreground">70-89% target tercapai</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{needsAttentionKpis.length}</div>
            <p className="text-xs text-muted-foreground">&lt;70% target tercapai</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <Target className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalKpis.length}</div>
            <p className="text-xs text-muted-foreground">Prioritas tinggi & underperform</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="targets" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="targets">Target & Progress</TabsTrigger>
          <TabsTrigger value="analysis">Analisis & Rekomendasi</TabsTrigger>
          <TabsTrigger value="critical">KPI Kritis</TabsTrigger>
        </TabsList>

        <TabsContent value="targets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Detail Target dan Progress KPI</CardTitle>
              <CardDescription>
                Monitoring pencapaian target setiap indikator KPI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {kpis.map((kpi) => (
                  <div key={kpi.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{kpi.kpiName}</h4>
                          <Badge variant="outline">{kpi.kpiCategory}</Badge>
                          {kpi.priority && (
                            <Badge className={getPriorityColor(kpi.priority)}>
                              Prioritas {kpi.priority}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Target: {kpi.targetValue} | Tercapai: {kpi.achievedValue}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(kpi)}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedKpi(kpi)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Edit Target KPI</DialogTitle>
                              <DialogDescription>
                                Ubah target dan parameter KPI: {kpi.kpiName}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="target">Target Value</Label>
                                  <Input id="target" defaultValue={kpi.targetValue?.toString()} />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="priority">Prioritas</Label>
                                  <Select defaultValue={kpi.priority?.toString()}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="1">1 - Sangat Tinggi</SelectItem>
                                      <SelectItem value="2">2 - Tinggi</SelectItem>
                                      <SelectItem value="3">3 - Sedang</SelectItem>
                                      <SelectItem value="4">4 - Rendah</SelectItem>
                                      <SelectItem value="5">5 - Sangat Rendah</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline">Batal</Button>
                              <Button>Simpan Perubahan</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{(kpi.achievementPercentage || 0).toFixed(1)}%</span>
                      </div>
                      <Progress value={kpi.achievementPercentage || 0} className="h-3" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span>Target: 100%</span>
                      </div>
                    </div>

                    {kpi.analysis && (
                      <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm">{kpi.analysis}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analisis dan Rekomendasi</CardTitle>
              <CardDescription>
                Insight dan saran perbaikan untuk setiap KPI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {kpis.map((kpi) => (
                  <div key={kpi.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{kpi.kpiName}</h4>
                          {getStatusBadge(kpi)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Pencapaian: {(kpi.achievementPercentage || 0).toFixed(1)}% dari target
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedKpi(kpi)
                          setEditingAnalysis(true)
                          setNewAnalysis(kpi.analysis || "")
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Analisis
                      </Button>
                    </div>

                    {kpi.analysis && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <h5 className="font-medium text-sm mb-2">Analisis Saat Ini:</h5>
                        <p className="text-sm">{kpi.analysis}</p>
                      </div>
                    )}

                    <div className="space-y-3">
                      <h5 className="font-medium text-sm">Rekomendasi Tindakan:</h5>
                      <ul className="space-y-2">
                        {getRecommendations(kpi).map((recommendation, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                            {recommendation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Edit Analysis Dialog */}
          <Dialog open={editingAnalysis} onOpenChange={setEditingAnalysis}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Analisis KPI</DialogTitle>
                <DialogDescription>
                  Tambahkan atau perbarui analisis untuk: {selectedKpi?.kpiName}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="analysis">Analisis</Label>
                  <Textarea
                    id="analysis"
                    placeholder="Masukkan analisis mendalam tentang performa KPI ini..."
                    value={newAnalysis}
                    onChange={(e) => setNewAnalysis(e.target.value)}
                    rows={6}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingAnalysis(false)}>
                  Batal
                </Button>
                <Button onClick={() => setEditingAnalysis(false)}>
                  Simpan Analisis
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="critical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                KPI Kritis yang Memerlukan Perhatian Segera
              </CardTitle>
              <CardDescription>
                KPI dengan prioritas tinggi yang belum mencapai target optimal
              </CardDescription>
            </CardHeader>
            <CardContent>
              {criticalKpis.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Tidak Ada KPI Kritis</h3>
                  <p className="text-muted-foreground">
                    Semua KPI prioritas tinggi sudah mencapai target yang baik
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {criticalKpis.map((kpi) => (
                    <div key={kpi.id} className="border-l-4 border-red-500 bg-red-50 p-4 rounded-r-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-red-900">{kpi.kpiName}</h4>
                            <Badge className="bg-red-100 text-red-800">
                              Prioritas {kpi.priority}
                            </Badge>
                            <Badge variant="destructive">
                              {(kpi.achievementPercentage || 0).toFixed(1)}%
                            </Badge>
                          </div>
                          <p className="text-sm text-red-700">
                            Kategori: {kpi.kpiCategory} | Target: {kpi.targetValue} | Tercapai: {kpi.achievedValue}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-medium text-red-600">
                            Gap: {((kpi.targetValue || 0) - (kpi.achievedValue || 0)).toFixed(1)}
                          </span>
                        </div>
                      </div>

                      <Progress value={kpi.achievementPercentage || 0} className="mb-3 h-2" />

                      <div className="space-y-2">
                        <h5 className="font-medium text-sm text-red-900">Action Items Prioritas:</h5>
                        <ul className="space-y-1">
                          {getRecommendations(kpi).slice(0, 3).map((rec, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-red-800">
                              <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}

                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-900 mb-2">Rekomendasi Tindakan Segera</h4>
                        <ul className="space-y-1 text-sm text-yellow-800">
                          <li>• Lakukan rapat evaluasi mingguan untuk KPI kritis</li>
                          <li>• Alokasikan sumber daya tambahan untuk area yang tertinggal</li>
                          <li>• Buat timeline recovery plan dengan milestone jelas</li>
                          <li>• Monitor progress harian hingga mencapai target minimal 70%</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Plan Template */}
          {criticalKpis.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Template Action Plan</CardTitle>
                <CardDescription>
                  Framework untuk mengatasi KPI yang bermasalah
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium mb-2">Week 1-2: Analisis Mendalam</h5>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Root cause analysis</li>
                        <li>• Stakeholder mapping</li>
                        <li>• Resource assessment</li>
                        <li>• Baseline measurement</li>
                      </ul>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium mb-2">Week 3-4: Implementation</h5>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Execute quick wins</li>
                        <li>• Deploy resources</li>
                        <li>• Start monitoring system</li>
                        <li>• Weekly progress review</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium mb-2">Week 5-8: Optimization</h5>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Fine-tune strategies</li>
                        <li>• Scale successful initiatives</li>
                        <li>• Address remaining gaps</li>
                        <li>• Prepare for sustainability</li>
                      </ul>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium mb-2">Week 9-12: Sustainability</h5>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>• Embed in standard processes</li>
                        <li>• Train stakeholders</li>
                        <li>• Document best practices</li>
                        <li>• Plan for next period</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}