"use client"

import { ReportsOverview } from "@/components/reports/ReportsOverview"

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Laporan Sekolah</h2>
      </div>
      <ReportsOverview />
    </div>
  )
}