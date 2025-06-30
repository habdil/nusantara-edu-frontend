// src/components/managements/assets/AssetTable.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Eye,
  QrCode,
  Wrench,
  MoreHorizontal,
  MapPin
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Data aset sesuai ERD NusantaraEdu
const assets = [
  {
    id: 1,
    assetCode: "AST-001",
    assetName: "Proyektor LCD Epson",
    category: "Elektronik",
    location: "Ruang Kelas 12A",
    condition: "good",
    acquisitionDate: "2023-08-15",
    acquisitionValue: 5500000,
    usefulLife: 60
  },
  {
    id: 2,
    assetCode: "AST-002", 
    assetName: "Meja Guru Kayu Jati",
    category: "Furniture",
    location: "Ruang Guru",
    condition: "good",
    acquisitionDate: "2022-01-10",
    acquisitionValue: 2500000,
    usefulLife: 120
  },
  {
    id: 3,
    assetCode: "AST-003",
    assetName: "Komputer Desktop HP",
    category: "Elektronik",
    location: "Lab Komputer",
    condition: "minor_damage",
    acquisitionDate: "2023-03-20",
    acquisitionValue: 8500000,
    usefulLife: 48
  },
  {
    id: 4,
    assetCode: "AST-004",
    assetName: "AC Split 1.5 PK",
    category: "Elektronik",
    location: "Ruang Kepala Sekolah",
    condition: "under_repair",
    acquisitionDate: "2021-06-05", 
    acquisitionValue: 4200000,
    usefulLife: 84
  },
  {
    id: 5,
    assetCode: "AST-005",
    assetName: "Kursi Siswa Plastik",
    category: "Furniture",
    location: "Ruang Kelas 10B",
    condition: "good",
    acquisitionDate: "2023-07-12",
    acquisitionValue: 350000,
    usefulLife: 72
  }
]

export function AssetTable() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case 'good':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Baik</Badge>
      case 'minor_damage':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Rusak Ringan</Badge>
      case 'major_damage':
        return <Badge variant="secondary" className="bg-red-100 text-red-700">Rusak Berat</Badge>
      case 'under_repair':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Dalam Perbaikan</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Elektronik':
        return 'bg-blue-100 text-blue-700'
      case 'Furniture':
        return 'bg-green-100 text-green-700'
      case 'Kendaraan':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Daftar Aset & Inventaris
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {assets.length} Aset
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 py-3 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium text-muted-foreground">
            <div className="col-span-2">Kode & Nama</div>
            <div className="col-span-2">Kategori</div>
            <div className="col-span-2">Lokasi</div>
            <div className="col-span-2">Kondisi</div>
            <div className="col-span-2">Nilai Perolehan</div>
            <div className="col-span-2">Aksi</div>
          </div>

          {/* Table Body */}
          {assets.map((asset) => (
            <div 
              key={asset.id}
              className="grid grid-cols-12 gap-4 py-4 px-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              {/* Code & Name */}
              <div className="col-span-2 space-y-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {asset.assetCode}
                </p>
                <p className="text-xs text-muted-foreground">
                  {asset.assetName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(asset.acquisitionDate)}
                </p>
              </div>

              {/* Category */}
              <div className="col-span-2">
                <Badge variant="outline" className={`text-xs ${getCategoryColor(asset.category)}`}>
                  {asset.category}
                </Badge>
              </div>

              {/* Location */}
              <div className="col-span-2 space-y-1">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {asset.location}
                  </span>
                </div>
              </div>

              {/* Condition */}
              <div className="col-span-2">
                {getConditionBadge(asset.condition)}
              </div>

              {/* Acquisition Value */}
              <div className="col-span-2 space-y-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(asset.acquisitionValue)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Umur: {asset.usefulLife} bulan
                </p>
              </div>

              {/* Actions */}
              <div className="col-span-2 flex items-center space-x-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <QrCode className="h-4 w-4" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      Lihat Detail
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Wrench className="h-4 w-4 mr-2" />
                      Jadwal Maintenance
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <QrCode className="h-4 w-4 mr-2" />
                      Generate QR Code
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-muted-foreground">
              Menampilkan 1-5 dari {assets.length} aset
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}