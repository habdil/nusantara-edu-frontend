// src/components/managements/facility-usage/FacilityUsageStats.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react"

const statsData = [
  {
    title: "Total Booking",
    value: "156",
    subtitle: "minggu ini",
    change: "+24",
    icon: Calendar,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/20"
  },
  {
    title: "Booking Disetujui", 
    value: "142",
    subtitle: "91% approval rate",
    change: "+18",
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950/20"
  },
  {
    title: "Sedang Berlangsung",
    value: "8",
    subtitle: "sesi aktif",
    change: "+2",
    icon: Clock,
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-950/20"
  },
  {
    title: "Dibatalkan",
    value: "14",
    subtitle: "9% cancellation",
    change: "+6",
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-950/20"
  }
]

export function FacilityUsageStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground">
              {stat.change} dari minggu lalu • {stat.subtitle}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}