"use client";
import { useState, useEffect } from "react";
import { Users, GraduationCap, TrendingUp, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { academicApi } from "@/components/academics/api/academic-api";
import type { AcademicStats } from "@/types/academic/record.types";

const colorClasses = {
  blue: {
    bg: "bg-blue-500",
    text: "text-blue-600",
    bgLight: "bg-blue-50 dark:bg-blue-950/20",
  },
  green: {
    bg: "bg-green-500",
    text: "text-green-600",
    bgLight: "bg-green-50 dark:bg-green-950/20",
  },
  purple: {
    bg: "bg-purple-500",
    text: "text-purple-600",
    bgLight: "bg-purple-50 dark:bg-purple-950/20",
  },
  orange: {
    bg: "bg-orange-500",
    text: "text-orange-600",
    bgLight: "bg-orange-50 dark:bg-orange-950/20",
  },
};

export function KPICards() {
  const [academicData, setAcademicData] = useState<AcademicStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch academic data from API
  const fetchAcademicData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await academicApi.getAcademicStats({
        academicYear: "2024/2025",
        semester: "1"
      });
      
      setAcademicData(data);
    } catch (err) {
      console.error('Failed to fetch academic data:', err);
      setError(err instanceof Error ? err.message : 'Gagal memuat data akademik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademicData();
  }, []);

  // Helper function untuk format angka
  const formatNumber = (num: number): string => {
    return num.toLocaleString('id-ID');
  };

  // Helper function untuk format nilai
  const formatScore = (score: number): string => {
    return score.toFixed(1);
  };

  // Dummy data untuk card yang belum ada API-nya (Kehadiran dan Kelulusan)
  const staticKpiData = [
    {
      title: "Rata-rata Kehadiran",
      value: "94.2%",
      subtitle: "tingkat kehadiran",
      change: "+2.3% dari bulan lalu",
      changeType: "positive" as const,
      icon: CheckCircle,
      color: "green",
    },
    {
      title: "Tingkat Kelulusan",
      value: "98.7%",
      subtitle: "siswa lulus ujian",
      change: "Sesuai target nasional",
      changeType: "neutral" as const,
      icon: TrendingUp,
      color: "orange",
    },
  ];

  // Combine API data with static data
  const getKpiData = () => {
    const apiBasedCards = academicData ? [
      {
        title: "Total Siswa",
        value: formatNumber(academicData.totalStudents),
        subtitle: "siswa terdaftar",
        change: "+12 dari bulan lalu", // Bisa diganti dengan calculation dari API jika ada historical data
        changeType: "positive" as const,
        icon: Users,
        color: "blue",
      },
      {
        title: "Rata-rata Nilai",
        value: formatScore(academicData.averageScore),
        subtitle: "nilai akademik keseluruhan",
        change: "+3.2 dari semester lalu", // Bisa diganti dengan calculation dari API jika ada historical data
        changeType: "positive" as const,
        icon: GraduationCap,
        color: "purple",
      },
    ] : [];

    return [...apiBasedCards, ...staticKpiData];
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, index) => (
        <Card key={index} className="transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="h-8 w-16 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2"></div>
                <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
              </div>
              <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Error state
  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchAcademicData}
              disabled={loading}
              className="ml-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : null}
              Coba Lagi
            </Button>
          </AlertDescription>
        </Alert>
        
        {/* Show loading skeleton while retrying */}
        {loading && <LoadingSkeleton />}
      </div>
    );
  }

  // Loading state
  if (loading) {
    return <LoadingSkeleton />;
  }

  const kpiData = getKpiData();

  return (
    <div className="space-y-4">
      {/* Data freshness indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Data terbaru • Tahun Ajaran 2024/2025 Semester 1
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={fetchAcademicData}
          disabled={loading}
          className="gap-1"
        >
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <TrendingUp className="h-3 w-3" />
          )}
          Perbarui
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => {
          const colorClass = colorClasses[kpi.color as keyof typeof colorClasses];
          const isApiData = index < 2; // First 2 cards are from API
          
          return (
            <Card 
              key={index} 
              className={`transition-all duration-200 hover:shadow-md border-l-4 border-l-transparent hover:border-l-blue-500 ${
                isApiData ? 'ring-1 ring-blue-200 dark:ring-blue-800' : ''
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {kpi.title}
                  </CardTitle>
                  {isApiData && (
                    <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                      Live
                    </Badge>
                  )}
                </div>
                <div className={`p-2 rounded-lg ${colorClass.bgLight}`}>
                  <kpi.icon className={`h-4 w-4 ${colorClass.text}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {kpi.value}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {kpi.subtitle}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={kpi.changeType === "positive" ? "secondary" : "outline"}
                      className={`text-xs ${
                        kpi.changeType === "positive" 
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {kpi.changeType === "positive" && "↗"}
                      {kpi.change}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* API Status Info */}
      <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2 rounded border-l-2 border-blue-200 dark:border-blue-700">
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
          <strong>Total Siswa</strong> dan <strong>Rata-rata Nilai</strong> menggunakan data real-time dari API
        </div>
        <div className="flex items-center gap-1 mt-1">
          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          <strong>Kehadiran</strong> dan <strong>Kelulusan</strong> masih menggunakan data dummy (menunggu API endpoint)
        </div>
      </div>
    </div>
  );
}