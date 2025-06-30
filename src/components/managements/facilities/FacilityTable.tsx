// src/components/managements/facilities/FacilityTable.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Eye,
  Calendar,
  Users,
  MoreHorizontal,
  MapPin,
  Camera
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Data fasilitas sesuai ERD NusantaraEdu (Facility table)
const facilities = [
  {
    id: 1,
    facilityName: "Ruang Kelas 12A",
    facilityType: "Ruang Kelas",
    capacity: 40,
    location: "Lantai 2, Gedung A",
    condition: "good",
    notes: "Dilengkapi proyektor dan AC",
    facilityPhoto: null,
    usageToday: 6
  },
  {
    id: 2,
    facilityName: "Laboratorium Komputer",
    facilityType: "Laboratorium", 
    capacity: 35,
    location: "Lantai 1, Gedung B",
    condition: "good",
    notes: "30 unit komputer tersedia",
    facilityPhoto: null,
    usageToday: 4
  },
  {
    id: 3,
    facilityName: "Perpustakaan",
    facilityType: "Fasilitas Umum",
    capacity: 80,
    location: "Lantai 1, Gedung C",
    condition: "good",
    notes: "Koleksi buku 5000+ judul",
    facilityPhoto: null,
    usageToday: 12
  },
  {
    id: 4,
    facilityName: "Aula Serbaguna",
    facilityType: "Ruang Pertemuan",
    capacity: 200,
    location: "Lantai 1, Gedung D",
    condition: "minor_damage",
    notes: "Sound system perlu perbaikan",
    facilityPhoto: null,
    usageToday: 2
  },
  {
    id: 5,
    facilityName: "Lapangan Basket",
    facilityType: "Olahraga",
    capacity: 50,
    location: "Area Outdoor",
    condition: "good", 
    notes: "Ring basket baru dipasang",
    facilityPhoto: null,
    usageToday: 3
  },
  {
    id: 6,
    facilityName: "Ruang Guru",
    facilityType: "Ruang Kerja",
    capacity: 25,
    location: "Lantai 1, Gedung A",
    condition: "good",
    notes: "Wi-Fi dan meja kerja lengkap",
    facilityPhoto: null,
    usageToday: 8
  }
]

export function FacilityTable() {
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

  const getFacilityTypeColor = (type: string) => {
    switch (type) {
      case 'Ruang Kelas':
        return 'bg-blue-100 text-blue-700'
      case 'Laboratorium':
        return 'bg-purple-100 text-purple-700'
      case 'Fasilitas Umum':
        return 'bg-green-100 text-green-700'
      case 'Ruang Pertemuan':
        return 'bg-orange-100 text-orange-700'
      case 'Olahraga':
        return 'bg-red-100 text-red-700'
      case 'Ruang Kerja':
        return 'bg-indigo-100 text-indigo-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getUsageStatus = (usage: number, capacity: number) => {
    const percentage = (usage / capacity) * 100
    if (percentage >= 80) return { variant: "destructive" as const, text: "Penuh" }
    if (percentage >= 50) return { variant: "secondary" as const, text: "Sibuk" }
    return { variant: "outline" as const, text: "Tersedia" }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Daftar Fasilitas Sekolah
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {facilities.length} Fasilitas
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 py-3 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium text-muted-foreground">
            <div className="col-span-3">Nama & Lokasi</div>
            <div className="col-span-2">Jenis & Kondisi</div>
            <div className="col-span-2">Kapasitas</div>
            <div className="col-span-3">Keterangan</div>
            <div className="col-span-2">Aksi</div>
          </div>

          {/* Table Body */}
          {facilities.map((facility) => {
            const usageStatus = getUsageStatus(facility.usageToday, facility.capacity)
            
            return (
              <div 
                key={facility.id}
                className="grid grid-cols-12 gap-4 py-4 px-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                {/* Name & Location */}
                <div className="col-span-3 space-y-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {facility.facilityName}
                  </p>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {facility.location}
                    </span>
                  </div>
                </div>

                {/* Type & Condition */}
                <div className="col-span-2 space-y-2">
                  <Badge variant="outline" className={`text-xs ${getFacilityTypeColor(facility.facilityType)}`}>
                    {facility.facilityType}
                  </Badge>
                  {getConditionBadge(facility.condition)}
                </div>

                {/* Capacity */}
                <div className="col-span-2 space-y-1">
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {facility.capacity} orang
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={usageStatus.variant} className="text-xs">
                      {usageStatus.text}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {facility.usageToday}/{facility.capacity}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <div className="col-span-3 space-y-1">
                  <p className="text-sm text-gray-900 dark:text-white">
                    {facility.notes}
                  </p>
                  {facility.facilityPhoto ? (
                    <div className="flex items-center space-x-1">
                      <Camera className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-600">Foto tersedia</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <Camera className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Belum ada foto</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    Booking
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-3 w-3 mr-2" />
                        Lihat Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Calendar className="h-3 w-3 mr-2" />
                        Jadwal Penggunaan
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Camera className="h-3 w-3 mr-2" />
                        Upload Foto
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )
          })}

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-muted-foreground">
              Menampilkan 1-6 dari {facilities.length} fasilitas
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