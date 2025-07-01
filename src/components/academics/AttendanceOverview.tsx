"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { getAttendanceSummary } from "./api/attendance-analysis-api"
import type { AttendanceSummary } from "@/types/academic"

export function AttendanceOverview() {
  const [attendanceData, setAttendanceData] = useState<AttendanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAttendanceSummary();
        setAttendanceData(data);
      } catch (err: any) {
        console.error('Error fetching attendance summary:', err);
        setError(err?.message || 'Gagal memuat data kehadiran');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-500 text-white"
      case "good":
        return "bg-blue-500 text-white"
      case "fair":
        return "bg-yellow-500 text-white"
      default:
        return "bg-red-500 text-white"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "excellent":
        return "Sangat Baik"
      case "good":
        return "Baik"
      case "fair":
        return "Cukup"
      default:
        return "Perlu Perhatian"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Kehadiran</CardTitle>
            <CardDescription>Memuat data kehadiran...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Kehadiran per Kelas</CardTitle>
            <CardDescription>Memuat data kehadiran per kelas...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
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
            <CardTitle>Ringkasan Kehadiran</CardTitle>
            <CardDescription>Error memuat data kehadiran</CardDescription>
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

  if (!attendanceData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Kehadiran</CardTitle>
            <CardDescription>Data kehadiran tidak tersedia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Belum ada data kehadiran yang tersedia
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { overallStats, classAttendance } = attendanceData;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Kehadiran</CardTitle>
          <CardDescription>Overview kehadiran siswa secara keseluruhan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {overallStats.attendanceRate}%
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Tingkat Kehadiran Keseluruhan</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-xl font-semibold text-green-600">{overallStats.presentDays}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Hadir</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-xl font-semibold text-blue-600">{overallStats.excusedDays}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Izin</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-xl font-semibold text-yellow-600">{overallStats.sickDays}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Sakit</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-xl font-semibold text-red-600">{overallStats.unexcusedDays}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Alpha</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kehadiran per Kelas</CardTitle>
          <CardDescription>Tingkat kehadiran berdasarkan kelas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {classAttendance.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Belum ada data kehadiran per kelas
              </p>
            </div>
          ) : (
            classAttendance.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Kelas {item.className}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getStatusColor(item.status)}>
                      {getStatusText(item.status)}
                    </Badge>
                    <span className="text-sm font-medium">{item.rate}%</span>
                  </div>
                </div>
                <Progress value={item.rate} className="h-2" />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}