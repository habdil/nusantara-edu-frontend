// src/components/managements/maintenance/MaintenanceStats.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wrench, CheckCircle, Clock, DollarSign } from "lucide-react"

const statsData = [
  {
    title: "Total Maintenance",
    value: "124",
    subtitle: "kegiatan",
    change: "+8",
    icon: Wrench,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/20"
  },
  {
    title: "Selesai", 
    value: "98",
    subtitle: "79% completed",
    change: "+12",
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950/20"
  },
  {
    title: "Dalam Proses",
    value: "18",
    subtitle: "15% ongoing",
    change: "-3",
    icon: Clock,
    color: "text-yellow-600",
    bg: "bg-yellow-50 dark:bg-yellow-950/20"
  },
  {
    title: "Biaya Bulan Ini",
    value: "Rp 8.2M",
    subtitle: "total pengeluaran",
    change: "+15%",
    icon: DollarSign,
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-950/20"
  }
]

export function MaintenanceStats() {
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
              {stat.change} dari bulan lalu • {stat.subtitle}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}