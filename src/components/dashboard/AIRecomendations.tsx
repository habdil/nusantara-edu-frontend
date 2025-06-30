"use client";

import { Brain, TrendingUp, Target, Lightbulb, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// Dummy data berdasarkan ERD ai_recommendations
const recommendationsData = [
  {
    id: 1,
    category: "academic",
    title: "Rekomendasi untuk Kelas 10A",
    description: "Berdasarkan analisis nilai matematika, disarankan menambah jam les khusus untuk 15 siswa dengan nilai di bawah KKM. Prediksi peningkatan nilai hingga 12%.",
    supportingData: {
      currentAverage: 68,
      targetAverage: 75,
      studentsAffected: 15,
      successProbability: 85
    },
    confidenceLevel: 0.87,
    generatedDate: "2024-06-21",
    predictedImpact: "Peningkatan rata-rata nilai 12% dalam 4 minggu",
    implementationStatus: "pending",
    icon: Target,
    color: "blue",
  },
  {
    id: 2,
    category: "financial",
    title: "Optimalisasi Anggaran Operasional",
    description: "AI mendeteksi potensi penghematan 18% pada kategori operasional dengan mengoptimalkan jadwal pemeliharaan dan penggunaan listrik.",
    supportingData: {
      currentSpending: 12500000,
      potentialSaving: 2250000,
      categories: ["Listrik", "Pemeliharaan", "ATK"]
    },
    confidenceLevel: 0.92,
    generatedDate: "2024-06-20",
    predictedImpact: "Penghematan Rp 2.25M per bulan",
    implementationStatus: "in_progress",
    icon: TrendingUp,
    color: "green",
  },
  {
    id: 3,
    category: "teacher",
    title: "Program Pengembangan Guru",
    description: "Berdasarkan evaluasi kinerja, 3 guru perlu pelatihan khusus di bidang teknologi pendidikan untuk meningkatkan efektivitas mengajar.",
    supportingData: {
      teachersIdentified: 3,
      currentScore: 72,
      targetScore: 85,
      trainingDuration: "2 bulan"
    },
    confidenceLevel: 0.79,
    generatedDate: "2024-06-19",
    predictedImpact: "Peningkatan skor evaluasi 18%",
    implementationStatus: "approved",
    icon: Lightbulb,
    color: "purple",
  },
  {
    id: 4,
    category: "asset",
    title: "Prediksi Perawatan Preventif",
    description: "Sistem memprediksi 5 aset memerlukan perawatan dalam 2 minggu ke depan. Perawatan preventif dapat mencegah kerusakan senilai Rp 15M.",
    supportingData: {
      assetsAtRisk: 5,
      preventiveCost: 3000000,
      potentialDamage: 15000000,
      timeframe: "14 hari"
    },
    confidenceLevel: 0.84,
    generatedDate: "2024-06-18",
    predictedImpact: "Pencegahan kerugian Rp 15M",
    implementationStatus: "pending",
    icon: Brain,
    color: "orange",
  },
  {
    id: 5,
    category: "academic",
    title: "Strategi Peningkatan Kehadiran",
    description: "Pola absensi menunjukkan tingkat kehadiran menurun pada hari Senin dan Jumat. Disarankan program motivasi khusus pada hari tersebut.",
    supportingData: {
      currentAttendance: 89,
      targetAttendance: 95,
      criticalDays: ["Senin", "Jumat"],
      impactedStudents: 45
    },
    confidenceLevel: 0.76,
    generatedDate: "2024-06-17",
    predictedImpact: "Peningkatan kehadiran 6%",
    implementationStatus: "pending",
    icon: Target,
    color: "blue",
  },
];

const statusConfig = {
  pending: {
    label: "Menunggu",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  in_progress: {
    label: "Berlangsung",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  approved: {
    label: "Disetujui",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  completed: {
    label: "Selesai",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  },
};

const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return "1 hari yang lalu";
  if (diffDays <= 7) return `${diffDays} hari yang lalu`;
  return `${Math.ceil(diffDays / 7)} minggu yang lalu`;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export function AIRecommendations() {
  const pendingRecommendations = recommendationsData.filter(r => r.implementationStatus === "pending").length;
  const highConfidenceRecs = recommendationsData.filter(r => r.confidenceLevel >= 0.8).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              Rekomendasi AI
            </CardTitle>
            <CardDescription>
              Saran berbasis analisis data dan machine learning
            </CardDescription>
          </div>
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            <Sparkles className="h-3 w-3 mr-1" />
            {recommendationsData.length} rekomendasi
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <p className="text-lg font-bold text-blue-600">{pendingRecommendations}</p>
            <p className="text-xs text-muted-foreground">Menunggu</p>
          </div>
          <div className="text-center p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
            <p className="text-lg font-bold text-green-600">{highConfidenceRecs}</p>
            <p className="text-xs text-muted-foreground">Tinggi Akurasi</p>
          </div>
        </div>

        {/* Recommendations List */}
        <ScrollArea className="h-80">
          <div className="space-y-3">
            {recommendationsData.map((recommendation) => {
              const statusInfo = statusConfig[recommendation.implementationStatus as keyof typeof statusConfig];
              
              return (
                <div
                  key={recommendation.id}
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${
                        recommendation.color === 'blue' ? 'bg-blue-50 dark:bg-blue-950/20' :
                        recommendation.color === 'green' ? 'bg-green-50 dark:bg-green-950/20' :
                        recommendation.color === 'purple' ? 'bg-purple-50 dark:bg-purple-950/20' :
                        'bg-orange-50 dark:bg-orange-950/20'
                      }`}>
                        <recommendation.icon className={`h-4 w-4 ${
                          recommendation.color === 'blue' ? 'text-blue-600' :
                          recommendation.color === 'green' ? 'text-green-600' :
                          recommendation.color === 'purple' ? 'text-purple-600' :
                          'text-orange-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                            {recommendation.title}
                          </h4>
                          <Badge className={`text-xs ${statusInfo.color}`}>
                            {statusInfo.label}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {recommendation.description}
                        </p>
                        
                        {/* Supporting Data */}
                        {recommendation.category === "academic" && recommendation.supportingData.currentAverage && (
                          <div className="flex items-center gap-4 text-xs mb-2">
                            <span className="text-muted-foreground">
                              Nilai saat ini: <span className="font-medium text-red-600">{recommendation.supportingData.currentAverage}</span>
                            </span>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Target: <span className="font-medium text-green-600">{recommendation.supportingData.targetAverage}</span>
                            </span>
                          </div>
                        )}
                        
                        {recommendation.category === "financial" && recommendation.supportingData.potentialSaving && (
                          <div className="text-xs mb-2">
                            <span className="text-muted-foreground">
                              Potensi penghematan: <span className="font-medium text-green-600">{formatCurrency(recommendation.supportingData.potentialSaving)}</span>
                            </span>
                          </div>
                        )}
                        
                        {recommendation.category === "asset" && recommendation.supportingData.assetsAtRisk && (
                          <div className="text-xs mb-2">
                            <span className="text-muted-foreground">
                              Aset berisiko: <span className="font-medium text-red-600">{recommendation.supportingData.assetsAtRisk}</span> • 
                              Pencegahan kerugian: <span className="font-medium text-green-600">{formatCurrency(recommendation.supportingData.potentialDamage)}</span>
                            </span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-3">
                            <span className="text-muted-foreground">
                              {getRelativeTime(recommendation.generatedDate)}
                            </span>
                            <span className={`font-medium ${
                              recommendation.confidenceLevel >= 0.9 ? 'text-green-600' :
                              recommendation.confidenceLevel >= 0.8 ? 'text-blue-600' :
                              'text-yellow-600'
                            }`}>
                              Akurasi: {Math.round(recommendation.confidenceLevel * 100)}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded text-xs">
                          <span className="font-medium text-gray-900 dark:text-white">Prediksi Dampak: </span>
                          <span className="text-muted-foreground">{recommendation.predictedImpact}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        
        {/* Action Buttons */}
        <div className="mt-4 pt-4 border-t space-y-2">
          <Button variant="outline" className="w-full text-sm">
            Chat dengan AI Assistant
          </Button>
          <Button variant="ghost" className="w-full text-sm text-muted-foreground">
            Lihat Semua Rekomendasi
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}