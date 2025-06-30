// src/components/managements/maintenance/MaintenanceTable.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Eye,
  Calendar,
  DollarSign,
  MoreHorizontal,
  Package,
  User
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Data maintenance sesuai ERD NusantaraEdu (AssetMaintenance table)
const maintenanceRecords = [
  {
    id: 1,
    assetCode: "AST-001",
    assetName: "Proyektor LCD Epson",
    maintenanceType: "Preventive",
    maintenanceDate: "2024-05-20",
    description: "Pembersihan lensa dan kalibrasi",
    cost: 250000,
    technician: "Teknisi AC Sejahtera",
    maintenanceResult: "Berhasil, kondisi optimal",
    nextMaintenanceDate: "2024-08-20",
    status: "completed"
  },
  {
    id: 2,
    assetCode: "AST-004",
    assetName: "AC Split 1.5 PK", 
    maintenanceType: "Corrective",
    maintenanceDate: "2024-05-18",
    description: "Perbaikan kompresor dan ganti freon",
    cost: 850000,
    technician: "CV Dingin Sejuk",
    maintenanceResult: "Dalam proses perbaikan",
    nextMaintenanceDate: "2024-11-18",
    status: "ongoing"
  },
  {
    id: 3,
    assetCode: "AST-003",
    assetName: "Komputer Desktop HP",
    maintenanceType: "Preventive",
    maintenanceDate: "2024-05-15",
    description: "Cleaning hardware dan update software",
    cost: 150000,
    technician: "IT Support Sekolah",
    maintenanceResult: "Selesai, performa meningkat",
    nextMaintenanceDate: "2024-09-15",
    status: "completed"
  },
  {
    id: 4,
    assetCode: "AST-002",
    assetName: "Meja Guru Kayu Jati",
    maintenanceType: "Preventive",
    maintenanceDate: "2024-05-12",
    description: "Perawatan finishing dan pengecatan ulang",
    cost: 320000,
    technician: "Tukang Kayu Sejati",
    maintenanceResult: "Selesai, kondisi seperti baru",
    nextMaintenanceDate: "2025-05-12",
    status: "completed"
  },
  {
    id: 5,
    assetCode: "AST-006",
    assetName: "Printer Canon MP287",
    maintenanceType: "Corrective", 
    maintenanceDate: "2024-05-22",
    description: "Penggantian cartridge dan head cleaning",
    cost: 180000,
    technician: "Service Center Canon",
    maintenanceResult: "Dijadwalkan minggu depan",
    nextMaintenanceDate: "2024-08-22",
    status: "scheduled"
  }
]

export function MaintenanceTable() {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Selesai</Badge>
      case 'ongoing':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Dalam Proses</Badge>
      case 'scheduled':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Dijadwalkan</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getMaintenanceTypeColor = (type: string) => {
    switch (type) {
      case 'Preventive':
        return 'bg-blue-100 text-blue-700'
      case 'Corrective':
        return 'bg-red-100 text-red-700'
      case 'Emergency':
        return 'bg-orange-100 text-orange-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getTechnicianInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Riwayat Pemeliharaan
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {maintenanceRecords.length} Record
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 py-3 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium text-muted-foreground">
            <div className="col-span-3">Aset & Tanggal</div>
            <div className="col-span-2">Jenis & Status</div>
            <div className="col-span-3">Deskripsi</div>
            <div className="col-span-2">Biaya & Teknisi</div>
            <div className="col-span-2">Maintenance Berikutnya</div>
          </div>

          {/* Table Body */}
          {maintenanceRecords.map((record) => (
            <div 
              key={record.id}
              className="grid grid-cols-12 gap-4 py-4 px-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              {/* Asset & Date */}
              <div className="col-span-3 space-y-1">
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {record.assetCode}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {record.assetName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {formatDate(record.maintenanceDate)}
                  </span>
                </div>
              </div>

              {/* Type & Status */}
              <div className="col-span-2 space-y-2">
                <Badge variant="outline" className={`text-xs ${getMaintenanceTypeColor(record.maintenanceType)}`}>
                  {record.maintenanceType}
                </Badge>
                {getStatusBadge(record.status)}
              </div>

              {/* Description */}
              <div className="col-span-3 space-y-1">
                <p className="text-sm text-gray-900 dark:text-white">
                  {record.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  Hasil: {record.maintenanceResult}
                </p>
              </div>

              {/* Cost & Technician */}
              <div className="col-span-2 space-y-1">
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(record.cost)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-xs bg-gray-200 dark:bg-gray-700">
                      {getTechnicianInitials(record.technician)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {record.technician}
                  </span>
                </div>
              </div>

              {/* Next Maintenance */}
              <div className="col-span-2 space-y-1">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-sm text-gray-900 dark:text-white">
                    {formatDate(record.nextMaintenanceDate)}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-3 w-3 mr-2" />
                        Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="h-3 w-3 mr-2" />
                        Reschedule
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-muted-foreground">
              Menampilkan 1-5 dari {maintenanceRecords.length} record
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