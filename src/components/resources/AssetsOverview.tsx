"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Package, AlertTriangle, CheckCircle, Clock, Eye, Edit, Plus } from "lucide-react"
import { assetsApi } from "./api/assets-api"
import type { Asset, ConditionStatus } from "@/types/resources"
// Import Modal Component
import { ModalDetailAsset } from "./ModalAssets/ModalDetailAsset"

const getConditionBadge = (condition: ConditionStatus) => {
  const variants = {
    good: { variant: "default" as const, icon: CheckCircle, text: "Baik" },
    minor_damage: { variant: "secondary" as const, icon: AlertTriangle, text: "Rusak Ringan" },
    major_damage: { variant: "destructive" as const, icon: AlertTriangle, text: "Rusak Berat" },
    under_repair: { variant: "outline" as const, icon: Clock, text: "Dalam Perbaikan" },
  }

  const config = variants[condition]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.text}
    </Badge>
  )
}

export function AssetsOverview() {
  // State untuk data aset
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  
  // State untuk filter dan search
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [conditionFilter, setConditionFilter] = useState<string>("all")

  // 🔥 State untuk Modal Detail Asset
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  // 🔥 State untuk Edit Mode (opsional untuk future development)
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await assetsApi.getAssets()
        setAssets(data)
      } catch (error) {
        console.error("Error fetching assets:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [])

  // 🔥 Handler untuk membuka modal detail
  const handleViewDetail = (assetId: number) => {
    setSelectedAssetId(assetId)
    setIsDetailModalOpen(true)
  }

  // 🔥 Handler untuk menutup modal
  const handleCloseModal = () => {
    setIsDetailModalOpen(false)
    setSelectedAssetId(null)
    setIsEditMode(false)
    
    // 🔥 Refresh data setelah modal ditutup (untuk update terbaru)
    // Ini penting jika ada perubahan data di modal
    refetchAssets()
  }

  // 🔥 Handler untuk edit dari dalam modal
  const handleEditFromModal = (asset: Asset) => {
    console.log("Edit asset:", asset)
    // Di sini bisa implement logika edit
    // Misalnya buka modal edit terpisah atau switch ke mode edit
    setIsEditMode(true)
  }

  // 🔥 Function untuk refresh data
  const refetchAssets = async () => {
    try {
      const data = await assetsApi.getAssets()
      setAssets(data)
    } catch (error) {
      console.error("Error refetching assets:", error)
    }
  }

  // Filter logic tetap sama
  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.assetCode.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || asset.assetCategory === categoryFilter
    const matchesCondition = conditionFilter === "all" || asset.condition === conditionFilter

    return matchesSearch && matchesCategory && matchesCondition
  })

  // Stats calculation tetap sama
  const assetStats = {
    total: assets.length,
    good: assets.filter((a) => a.condition === "good").length,
    needsMaintenance: assets.filter((a) => a.condition === "minor_damage" || a.condition === "major_damage").length,
    underRepair: assets.filter((a) => a.condition === "under_repair").length,
  }

  const categories = [...new Set(assets.map((asset) => asset.assetCategory))]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-24 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards - tidak berubah */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Aset</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assetStats.total}</div>
            <p className="text-xs text-muted-foreground">Semua aset sekolah</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kondisi Baik</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{assetStats.good}</div>
            <p className="text-xs text-muted-foreground">Aset dalam kondisi baik</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perlu Perbaikan</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{assetStats.needsMaintenance}</div>
            <p className="text-xs text-muted-foreground">Aset perlu perhatian</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dalam Perbaikan</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{assetStats.underRepair}</div>
            <p className="text-xs text-muted-foreground">Sedang diperbaiki</p>
          </CardContent>
        </Card>
      </div>

      {/* Assets Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Daftar Aset Sekolah</CardTitle>
              <CardDescription>Kelola dan pantau semua aset sekolah</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters - tidak berubah */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari aset..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Kondisi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kondisi</SelectItem>
                <SelectItem value="good">Baik</SelectItem>
                <SelectItem value="minor_damage">Rusak Ringan</SelectItem>
                <SelectItem value="major_damage">Rusak Berat</SelectItem>
                <SelectItem value="under_repair">Dalam Perbaikan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table dengan Action Buttons yang diupdate */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode Aset</TableHead>
                  <TableHead>Nama Aset</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Lokasi</TableHead>
                  <TableHead>Kondisi</TableHead>
                  <TableHead>Nilai (Rp)</TableHead>
                  <TableHead className="text-center">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssets.map((asset) => (
                  <TableRow key={asset.id}>
                    <TableCell className="font-medium">{asset.assetCode}</TableCell>
                    <TableCell>{asset.assetName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{asset.assetCategory}</Badge>
                    </TableCell>
                    <TableCell>{asset.location}</TableCell>
                    <TableCell>{getConditionBadge(asset.condition)}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        minimumFractionDigits: 0,
                      }).format(asset.currentValue || asset.purchasePrice)}
                    </TableCell>
                    <TableCell>
                      {/* 🔥 Action Buttons yang diupdate */}
                      <div className="flex items-center gap-2 justify-center">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetail(asset.id)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          Detail
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {/* 🔥 Handle empty state */}
                {filteredAssets.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Package className="h-8 w-8 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          {searchTerm || categoryFilter !== "all" || conditionFilter !== "all"
                            ? "Tidak ada aset yang sesuai dengan filter"
                            : "Belum ada data aset"}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 🔥 Modal Detail Asset */}
      <ModalDetailAsset
        assetId={selectedAssetId}
        isOpen={isDetailModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}