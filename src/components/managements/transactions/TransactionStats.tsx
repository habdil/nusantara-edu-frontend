// src/components/managements/transactions/TransactionStats.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpCircle, ArrowDownCircle, Receipt, Clock } from "lucide-react"

const statsData = [
  {
    title: "Total Pemasukan",
    value: "Rp 150.000.000",
    subtitle: "bulan ini",
    change: "+12%",
    icon: ArrowUpCircle,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-950/20"
  },
  {
    title: "Total Pengeluaran", 
    value: "Rp 98.500.000",
    subtitle: "bulan ini",
    change: "+8%",
    icon: ArrowDownCircle,
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-950/20"
  },
  {
    title: "Jumlah Transaksi",
    value: "68",
    subtitle: "transaksi",
    change: "+15%",
    icon: Receipt,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/20"
  },
  {
    title: "Pending Approval",
    value: "3",
    subtitle: "menunggu",
    change: "-2",
    icon: Clock,
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-950/20"
  }
]

export function TransactionStats() {
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