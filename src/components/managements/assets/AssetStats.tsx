// src/components/managements/assets/AssetStats.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, CheckCircle, AlertTriangle, Wrench } from "lucide-react"

const statsData = [
  {
    title: "Total Aset",
    value: "456",
    subtitle: "item terdaftar",
    change: "+12",
    icon: Package,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/20"
  },
  {
    title: "Kondisi Baik", 
    value: "398",
    subtitle: "87% dari total",
    change: "+5",
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950/20"
  },
  {
    title: "Perlu Perbaikan",
    value: "42",
    subtitle: "9% dari total",
    change: "+3",
    icon: AlertTriangle,
    color: "text-yellow-600",
    bg: "bg-yellow-50 dark:bg-yellow-950/20"
  },
  {
    title: "Dalam Perbaikan",
    value: "16",
    subtitle: "4% dari total",
    change: "-2",
    icon: Wrench,
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-950/20"
  }
]

export function AssetStats() {
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
              {stat.change} bulan ini • {stat.subtitle}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}