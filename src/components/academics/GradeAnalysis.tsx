"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function GradeAnalysis() {
  // TODO: Replace with actual data from academicApi.getAcademicRecords()
  const gradeDistribution = [
    { grade: "A (90-100)", count: 45, percentage: 30, color: "bg-green-500" },
    { grade: "B (80-89)", count: 60, percentage: 40, color: "bg-blue-500" },
    { grade: "C (70-79)", count: 30, percentage: 20, color: "bg-yellow-500" },
    { grade: "D (60-69)", count: 12, percentage: 8, color: "bg-orange-500" },
    { grade: "E (<60)", count: 3, percentage: 2, color: "bg-red-500" },
  ]

  const subjectAverages = [
    { subject: "Matematika", average: 75.2, trend: "up" },
    { subject: "IPA", average: 80.1, trend: "up" },
    { subject: "IPS", average: 82.3, trend: "stable" },
    { subject: "Bahasa Indonesia", average: 79.8, trend: "down" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Distribusi Nilai</CardTitle>
          <CardDescription>Sebaran nilai siswa berdasarkan grade</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {gradeDistribution.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.grade}</span>
                <span className="text-slate-600 dark:text-slate-400">
                  {item.count} siswa ({item.percentage}%)
                </span>
              </div>
              <Progress value={item.percentage} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rata-rata Nilai per Mata Pelajaran</CardTitle>
          <CardDescription>Performa akademik berdasarkan mata pelajaran</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {subjectAverages.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{item.subject}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Rata-rata: {item.average}</p>
              </div>
              <div className="text-right">
                <div
                  className={`text-2xl font-bold ${
                    item.average >= 80 ? "text-green-600" : item.average >= 70 ? "text-yellow-600" : "text-red-600"
                  }`}
                >
                  {item.average}
                </div>
                <div
                  className={`text-xs ${
                    item.trend === "up" ? "text-green-600" : item.trend === "down" ? "text-red-600" : "text-slate-600"
                  }`}
                >
                  {item.trend === "up" ? "↗ Naik" : item.trend === "down" ? "↘ Turun" : "→ Stabil"}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
