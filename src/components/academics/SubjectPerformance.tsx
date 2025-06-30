"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface SubjectPerformanceProps {
  data: Array<{
    subject: string
    averageScore: number
    passRate: number
  }>
}

export function SubjectPerformance({ data }: SubjectPerformanceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performa Mata Pelajaran</CardTitle>
        <CardDescription>Analisis performa berdasarkan mata pelajaran</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((subject, index) => (
          <div key={index} className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-slate-900 dark:text-slate-100">{subject.subject}</h4>
              <div className="text-right">
                <div className="text-sm text-slate-600 dark:text-slate-400">Rata-rata: {subject.averageScore}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Kelulusan: {subject.passRate}%</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Nilai Rata-rata</span>
                <span>{subject.averageScore}/100</span>
              </div>
              <Progress value={subject.averageScore} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Tingkat Kelulusan</span>
                <span>{subject.passRate}%</span>
              </div>
              <Progress value={subject.passRate} className="h-2" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
