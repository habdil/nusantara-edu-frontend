"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"
import { getGradeDistribution, getSubjectAverages } from "./api/grade-analysis-api"
import type { GradeDistributionItem, SubjectAverage } from "@/types/academic"

export function GradeAnalysis() {
  const [gradeDistribution, setGradeDistribution] = useState<GradeDistributionItem[]>([]);
  const [subjectAverages, setSubjectAverages] = useState<SubjectAverage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGradeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [distributionData, averagesData] = await Promise.all([
          getGradeDistribution(),
          getSubjectAverages()
        ]);
        
        setGradeDistribution(distributionData);
        setSubjectAverages(averagesData);
      } catch (err: any) {
        console.error('Error fetching grade analysis data:', err);
        setError(err?.message || 'Gagal memuat data analisis nilai');
      } finally {
        setLoading(false);
      }
    };

    fetchGradeData();
  }, []);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return "↗"
      case "down":
        return "↘"
      default:
        return "→"
    }
  }

  const getTrendText = (trend: string) => {
    switch (trend) {
      case "up":
        return "Naik"
      case "down":
        return "Turun"
      default:
        return "Stabil"
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-slate-600 dark:text-slate-400"
    }
  }

  const getScoreColor = (average: number) => {
    if (average >= 80) return "text-green-600"
    if (average >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Nilai</CardTitle>
            <CardDescription>Memuat data distribusi nilai...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rata-rata Nilai per Mata Pelajaran</CardTitle>
            <CardDescription>Memuat data rata-rata nilai...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Analisis Nilai</CardTitle>
            <CardDescription>Error memuat data analisis nilai</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-red-500 mb-2">⚠️</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Distribusi Nilai</CardTitle>
          <CardDescription>Sebaran nilai siswa berdasarkan grade</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {gradeDistribution.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Belum ada data distribusi nilai
              </p>
            </div>
          ) : (
            gradeDistribution.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.grade}</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {item.count} siswa ({item.percentage}%)
                  </span>
                </div>
                <Progress value={item.percentage} className="h-2" />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rata-rata Nilai per Mata Pelajaran</CardTitle>
          <CardDescription>Performa akademik berdasarkan mata pelajaran</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {subjectAverages.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Belum ada data rata-rata nilai per mata pelajaran
              </p>
            </div>
          ) : (
            subjectAverages.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{item.subject}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Rata-rata: {item.average}
                  </p>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getScoreColor(item.average)}`}>
                    {item.average}
                  </div>
                  <div className={`text-xs ${getTrendColor(item.trend)}`}>
                    {getTrendIcon(item.trend)} {getTrendText(item.trend)}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}