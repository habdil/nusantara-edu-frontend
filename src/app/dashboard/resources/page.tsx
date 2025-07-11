"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AssetsOverview } from "@/components/resources/AssetsOverview"
import { FacilitiesOverview } from "@/components/resources/FacilitiesOverview"
import { BudgetOverview } from "@/components/resources/BudgetOverview"
import { assetsApi } from "@/components/resources/api/assets-api"
import { facilitiesApi } from "@/components/resources/api/facilities-api"
import { budgetApi } from "@/components/resources/api/budget-api"
import { Package, Building, DollarSign, BarChart3, AlertCircle } from "lucide-react"

// Interface untuk menampung data statistik
interface StatsData {
  totalAssets: number
  totalFacilities: number
  totalBudget: number
  budgetUsagePercentage: number
}

// Fungsi untuk memformat angka menjadi format mata uang Rupiah yang lebih ringkas
const formatCurrency = (value: number) => {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1)}M`
  }
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1)}jt`
  }
  return `Rp ${value.toLocaleString("id-ID")}`
}

export default function ResourcesPage() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        // Mengambil semua data secara paralel untuk efisiensi
        const [assetStats, facilityStats, financialSummary] = await Promise.all([
          assetsApi.getAssetStats(),
          facilitiesApi.getFacilityStats(),
          budgetApi.getFinancialSummary(),
        ])

        // Kalkulasi persentase penggunaan anggaran
        const budgetUsagePercentage =
          financialSummary.totalBudget > 0
            ? (financialSummary.totalUsed / financialSummary.totalBudget) * 100
            : 0

        setStats({
          totalAssets: assetStats.totalAssets,
          totalFacilities: facilityStats.totalFacilities,
          totalBudget: financialSummary.totalBudget,
          budgetUsagePercentage: budgetUsagePercentage,
        })
      } catch (err: any) {
        console.error("Gagal mengambil data statistik:", err)
        setError("Tidak dapat memuat ringkasan data. Silakan coba lagi nanti.")
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Menampilkan pesan error jika terjadi masalah saat fetch data
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-50 border border-red-200 rounded-lg">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h3 className="mt-4 text-lg font-semibold text-red-700">Terjadi Kesalahan</h3>
        <p className="mt-1 text-sm text-red-600">{error}</p>
      </div>
    )
  }
  
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Manajemen Sumber Daya</h2>
      </div>

      {/* Kartu Statistik */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aset Sekolah</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats?.totalAssets ?? "0"}</div>
            <p className="text-xs text-muted-foreground">Total aset terdaftar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fasilitas</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats?.totalFacilities ?? "0"}</div>
            <p className="text-xs text-muted-foreground">Fasilitas aktif</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anggaran</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : formatCurrency(stats?.totalBudget ?? 0)}</div>
            <p className="text-xs text-muted-foreground">Total anggaran tahun ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Penggunaan</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : `${stats?.budgetUsagePercentage.toFixed(0)}%`}</div>
            <p className="text-xs text-muted-foreground">Tingkat penggunaan anggaran</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs untuk Detail */}
      <Tabs defaultValue="assets" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="assets" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Aset
          </TabsTrigger>
          <TabsTrigger value="facilities" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Fasilitas
          </TabsTrigger>
          <TabsTrigger value="budget" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Anggaran
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assets" className="space-y-4">
          <AssetsOverview />
        </TabsContent>

        <TabsContent value="facilities" className="space-y-4">
          <FacilitiesOverview />
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <BudgetOverview />
        </TabsContent>
      </Tabs>
    </div>
  )
}