// src/components/managements/facility-usage/FacilityUsageTable.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Eye,
  Clock,
  User,
  MoreHorizontal,
  Building,
  CheckCircle,
  XCircle
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Data penggunaan fasilitas sesuai ERD NusantaraEdu (FacilityUsage table)
const facilityUsages = [
  {
    id: 1,
    facilityName: "Aula Serbaguna",
    date: "2024-05-21",
    startTime: "08:00",
    endTime: "10:00",
    purpose: "Rapat Komite Sekolah",
    userName: "Habdil Iqrawardana",
    userRole: "Kepala Sekolah",
    approvalStatus: "approved",
    notes: "Persiapan sound system 30 menit sebelumnya"
  },
  {
    id: 2,
    facilityName: "Lab Komputer",
    date: "2024-05-21",
    startTime: "10:30",
    endTime: "12:00", 
    purpose: "Praktikum TIK Kelas 11",
    userName: "Rayan Mar'i",
    userRole: "Guru",
    approvalStatus: "approved",
    notes: "Memerlukan 30 unit komputer"
  },
  {
    id: 3,
    facilityName: "Lapangan Basket",
    date: "2024-05-21",
    startTime: "13:00",
    endTime: "15:00",
    purpose: "Latihan Ekstrakurikuler Basket",
    userName: "Muhammad Faiz",
    userRole: "Guru Olahraga",
    approvalStatus: "pending",
    notes: "Perlu persiapan peralatan basket"
  },
  {
    id: 4,
    facilityName: "Ruang Kelas 12A",
    date: "2024-05-21",
    startTime: "15:30",
    endTime: "17:00",
    purpose: "Les Tambahan Matematika",
    userName: "Naufal Rizqy",
    userRole: "Guru",
    approvalStatus: "approved",
    notes: "Ruangan sudah dilengkapi proyektor"
  },
  {
    id: 5,
    facilityName: "Perpustakaan",
    date: "2024-05-22",
    startTime: "08:00",
    endTime: "10:00",
    purpose: "Workshop Literasi Siswa",
    userName: "Rezki Haikal",
    userRole: "Pustakawan",
    approvalStatus: "rejected",
    notes: "Bentrok dengan jadwal inventarisasi buku"
  }
]

export function FacilityUsageTable() {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    return timeString
  }

  const getApprovalBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Disetujui</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Pending</Badge>
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-700">Ditolak</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getUserInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Kepala Sekolah':
        return 'bg-purple-100 text-purple-700'
      case 'Guru':
        return 'bg-blue-100 text-blue-700'
      case 'Guru Olahraga':
        return 'bg-green-100 text-green-700'
      case 'Pustakawan':
        return 'bg-orange-100 text-orange-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getTimeStatus = (date: string, startTime: string, endTime: string) => {
    const now = new Date()
    const bookingDate = new Date(date)
    const [startHour, startMinute] = startTime.split(':').map(Number)
    const [endHour, endMinute] = endTime.split(':').map(Number)
    
    const startDateTime = new Date(bookingDate)
    startDateTime.setHours(startHour, startMinute)
    
    const endDateTime = new Date(bookingDate)
    endDateTime.setHours(endHour, endMinute)

    if (now < startDateTime) return { status: 'upcoming', color: 'text-blue-600' }
    if (now >= startDateTime && now <= endDateTime) return { status: 'ongoing', color: 'text-green-600' }
    return { status: 'completed', color: 'text-gray-600' }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Jadwal Penggunaan Fasilitas
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {facilityUsages.length} Booking
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 py-3 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium text-muted-foreground">
            <div className="col-span-3">Fasilitas & Waktu</div>
            <div className="col-span-3">Tujuan & Pengguna</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-3">Keterangan</div>
            <div className="col-span-1">Aksi</div>
          </div>

          {/* Table Body */}
          {facilityUsages.map((usage) => {
            const timeStatus = getTimeStatus(usage.date, usage.startTime, usage.endTime)
            
            return (
              <div 
                key={usage.id}
                className="grid grid-cols-12 gap-4 py-4 px-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                {/* Facility & Time */}
                <div className="col-span-3 space-y-1">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {usage.facilityName}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {formatDate(usage.date)}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-gray-900 dark:text-white">
                    {formatTime(usage.startTime)} - {formatTime(usage.endTime)}
                  </div>
                </div>

                {/* Purpose & User */}
                <div className="col-span-3 space-y-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {usage.purpose}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="text-xs bg-gray-200 dark:bg-gray-700">
                        {getUserInitials(usage.userName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className="text-xs text-gray-900 dark:text-white">
                        {usage.userName}
                      </span>
                      <Badge variant="outline" className={`ml-2 text-xs ${getRoleColor(usage.userRole)}`}>
                        {usage.userRole}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="col-span-2 space-y-2">
                  {getApprovalBadge(usage.approvalStatus)}
                  <div className="flex items-center space-x-1">
                    <div className={`h-2 w-2 rounded-full ${
                      timeStatus.status === 'ongoing' ? 'bg-green-500' :
                      timeStatus.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-400'
                    }`} />
                    <span className={`text-xs ${timeStatus.color}`}>
                      {timeStatus.status === 'ongoing' ? 'Berlangsung' :
                       timeStatus.status === 'upcoming' ? 'Akan Datang' : 'Selesai'}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <div className="col-span-3">
                  <p className="text-xs text-muted-foreground">
                    {usage.notes}
                  </p>
                </div>

                {/* Actions */}
                <div className="col-span-1">
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
                      {usage.approvalStatus === 'pending' && (
                        <>
                          <DropdownMenuItem>
                            <CheckCircle className="h-3 w-3 mr-2" />
                            Setujui
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <XCircle className="h-3 w-3 mr-2" />
                            Tolak
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )
          })}

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-muted-foreground">
              Menampilkan 1-5 dari {facilityUsages.length} booking
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