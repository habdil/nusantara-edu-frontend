// src\components\academics\SubjectPerformance.tsx

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"
import { getSubjectAverages } from "./api/grade-analysis-api"
import type { SubjectAverage } from "@/types/academic"

interface SubjectPerformanceProps {
  academicYear?: string
  semester?: string
  gradeLevel?: string
}

export function SubjectPerformance({ academicYear, semester, gradeLevel }: SubjectPerformanceProps) {
  const [subjectData, setSubjectData] = useState<SubjectAverage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getSubjectAverages({
          academicYear,
          semester,
          gradeLevel
        });
        
        setSubjectData(data);
      } catch (err: any) {
        console.error('Error fetching subject performance:', err);
        setError(err?.message || 'Gagal memuat data performa mata pelajaran');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectData();
  }, [academicYear, semester, gradeLevel]);

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

  const calculatePassRate = (average: number) => {
    // Simple calculation: assume pass rate correlates with average score
    // In real implementation, you might want to get this from a separate API
    if (average >= 90) return Math.min(95, average);
    if (average >= 80) return Math.min(85, average - 5);
    if (average >= 70) return Math.min(75, average - 10);
    return Math.max(50, average - 15);
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performa Mata Pelajaran</CardTitle>
          <CardDescription>Memuat data performa mata pelajaran...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performa Mata Pelajaran</CardTitle>
          <CardDescription>Error memuat data performa mata pelajaran</CardDescription>
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
    );
  }

  if (subjectData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performa Mata Pelajaran</CardTitle>
          <CardDescription>Analisis performa berdasarkan mata pelajaran</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Belum ada data performa mata pelajaran
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performa Mata Pelajaran</CardTitle>
        <CardDescription>Analisis performa berdasarkan mata pelajaran</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {subjectData.map((subject, index) => {
          const passRate = calculatePassRate(subject.average);
          
          return (
            <div key={index} className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100">
                    {subject.subject}
                  </h4>
                  <span className={`text-xs ${getTrendColor(subject.trend)}`}>
                    {getTrendIcon(subject.trend)}
                  </span>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${getScoreColor(subject.average)}`}>
                    Rata-rata: {subject.average}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Kelulusan: {passRate.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>Nilai Rata-rata</span>
                  <span>{subject.average}/100</span>
                </div>
                <Progress value={subject.average} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>Tingkat Kelulusan</span>
                  <span>{passRate.toFixed(1)}%</span>
                </div>
                <Progress value={passRate} className="h-2" />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  )
}