// src/components/managements/facilities/FacilityStats.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building, CheckCircle, Users, Calendar } from "lucide-react"

const statsData = [
  {
    title: "Total Fasilitas",
    value: "32",
    subtitle: "ruang & area",
    change: "+2",
    icon: Building,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/20"
  },
  {
    title: "Kondisi Baik", 
    value: "28",
    subtitle: "87% dalam kondisi baik",
    change: "+1",
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950/20"
  },
  {
    title: "Kapasitas Total",
    value: "1,240",
    subtitle: "maksimal pengguna",
    change: "+50",
    icon: Users,
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-950/20"
  },
  {
    title: "Booking Hari Ini",
    value: "18",
    subtitle: "jadwal terpakai",
    change: "+3",
    icon: Calendar,
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-950/20"
  }
]

export function FacilityStats() {
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