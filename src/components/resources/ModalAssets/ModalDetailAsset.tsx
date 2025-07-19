"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Package, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Settings, 
  QrCode,
  CheckCircle,
  AlertTriangle,
  Clock,
  Image as ImageIcon,
  Edit,
  History
} from "lucide-react"
import { assetsApi } from "../api/assets-api"
import type { Asset, AssetMaintenance, ConditionStatus } from "@/types/resources"

interface ModalDetailAssetProps {
  assetId: number | null
  isOpen: boolean
  onClose: () => void
  onEdit?: (asset: Asset) => void
}

const getConditionBadge = (condition: ConditionStatus) => {
  const variants = {
    good: { variant: "default" as const, icon: CheckCircle, text: "Baik", color: "text-green-600" },
    minor_damage: { variant: "secondary" as const, icon: AlertTriangle, text: "Rusak Ringan", color: "text-yellow-600" },
    major_damage: { variant: "destructive" as const, icon: AlertTriangle, text: "Rusak Berat", color: "text-red-600" },
    under_repair: { variant: "outline" as const, icon: Clock, text: "Dalam Perbaikan", color: "text-blue-600" },
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date)
}

export function ModalDetailAsset({ assetId, isOpen, onClose, onEdit }: ModalDetailAssetProps) {
  const [asset, setAsset] = useState<Asset | null>(null)
  const [maintenanceRecords, setMaintenanceRecords] = useState<AssetMaintenance[]>([])
  const [loading, setLoading] = useState(false)
  const [maintenanceLoading, setMaintenanceLoading] = useState(false)

  useEffect(() => {
    if (assetId && isOpen) {
      fetchAssetDetail()
    }
  }, [assetId, isOpen])

  const fetchAssetDetail = async () => {
    if (!assetId) return

    setLoading(true)
    try {
      const assetData = await assetsApi.getAssetById(assetId)
      setAsset(assetData)
      
      // Fetch maintenance records
      setMaintenanceLoading(true)
      const maintenanceData = await assetsApi.getMaintenanceRecords(assetId)
      setMaintenanceRecords(maintenanceData)
    } catch (error) {
      console.error("Error fetching asset detail:", error)
    } finally {
      setLoading(false)
      setMaintenanceLoading(false)
    }
  }

  const handleClose = () => {
    setAsset(null)
    setMaintenanceRecords([])
    onClose()
  }

  const handleEdit = () => {
    if (asset && onEdit) {
      onEdit(asset)
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Detail Aset
          </DialogTitle>
          <DialogDescription>
            Informasi lengkap tentang aset sekolah
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        ) : asset ? (
          <Tabs defaultValue="detail" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="detail">Detail Aset</TabsTrigger>
              <TabsTrigger value="maintenance">Riwayat Pemeliharaan</TabsTrigger>
            </TabsList>

            <TabsContent value="detail" className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-bold">{asset.assetName}</h3>
                  <p className="text-muted-foreground">{asset.assetCode}</p>
                </div>
                <div className="flex gap-2">
                  {getConditionBadge(asset.condition)}
                  {onEdit && (
                    <Button variant="outline" size="sm" onClick={handleEdit}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Informasi Dasar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Kode Aset</p>
                        <p className="text-sm">{asset.assetCode}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Kategori</p>
                        <Badge variant="outline">{asset.assetCategory}</Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Lokasi</p>
                        <p className="text-sm flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {asset.location}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Kondisi</p>
                        {getConditionBadge(asset.condition)}
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Deskripsi</p>
                      <p className="text-sm">{asset.description || "Tidak ada deskripsi"}</p>
                    </div>

                    {asset.qrCode && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">QR Code</p>
                        <div className="flex items-center gap-2">
                          <QrCode className="h-4 w-4" />
                          <code className="text-xs bg-muted px-2 py-1 rounded">{asset.qrCode}</code>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Financial Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Informasi Keuangan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Harga Pembelian</p>
                        <p className="text-lg font-semibold text-green-600">
                          {formatCurrency(asset.purchasePrice)}
                        </p>
                      </div>
                      {asset.currentValue && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Nilai Saat Ini</p>
                          <p className="text-lg font-semibold">
                            {formatCurrency(asset.currentValue)}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Tanggal Pembelian</p>
                        <p className="text-sm flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(asset.purchaseDate)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Asset Photo */}
                {asset.assetPhoto && (
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Foto Aset
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center">
                        <img
                          src={asset.assetPhoto}
                          alt={asset.assetName}
                          className="max-w-full max-h-64 object-contain rounded-lg border"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Riwayat Pemeliharaan
                  </CardTitle>
                  <CardDescription>
                    Catatan pemeliharaan dan perbaikan aset
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {maintenanceLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : maintenanceRecords.length > 0 ? (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tanggal</TableHead>
                            <TableHead>Jenis Pemeliharaan</TableHead>
                            <TableHead>Deskripsi</TableHead>
                            <TableHead>Biaya</TableHead>
                            <TableHead>Teknisi</TableHead>
                            <TableHead>Hasil</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {maintenanceRecords.map((record) => (
                            <TableRow key={record.id}>
                              <TableCell>{formatDate(record.maintenanceDate)}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{record.maintenanceType}</Badge>
                              </TableCell>
                              <TableCell>{record.description || "-"}</TableCell>
                              <TableCell>
                                {record.cost ? formatCurrency(record.cost) : "-"}
                              </TableCell>
                              <TableCell>{record.technician || "-"}</TableCell>
                              <TableCell>{record.maintenanceResult || "-"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Belum ada riwayat pemeliharaan</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Aset tidak ditemukan</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}