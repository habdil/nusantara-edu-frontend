"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function AttendanceOverview() {
  // TODO: Replace with actual data from academicApi.getStudentAttendance()
  const attendanceStats = {
    totalDays: 120,
    presentDays: 110,
    excusedDays: 8,
    sickDays: 2,
    unexcusedDays: 0,
    attendanceRate: 91.7,
  }

  const classAttendance = [
    { className: "1A", rate: 95.2, status: "excellent" },
    { className: "1B", rate: 92.8, status: "good" },
    { className: "2A", rate: 89.5, status: "good" },
    { className: "2B", rate: 87.3, status: "fair" },
    { className: "3A", rate: 93.1, status: "good" },
    { className: "3B", rate: 90.7, status: "good" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-500"
      case "good":
        return "bg-blue-500"
      case "fair":
        return "bg-yellow-500"
      default:
        return "bg-red-500"
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
              {attendanceStats.attendanceRate}%
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">Tingkat Kehadiran Keseluruhan</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-xl font-semibold text-green-600">{attendanceStats.presentDays}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Hadir</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-xl font-semibold text-blue-600">{attendanceStats.excusedDays}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Izin</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-xl font-semibold text-yellow-600">{attendanceStats.sickDays}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Sakit</p>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-xl font-semibold text-red-600">{attendanceStats.unexcusedDays}</div>
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
          {classAttendance.map((item, index) => (
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
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
