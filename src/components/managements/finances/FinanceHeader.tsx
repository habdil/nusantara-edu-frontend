// src/components/managements/finances/FinanceHeader.tsx
"use client"

import { DollarSign, TrendingUp, Calendar, Filter, Download, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { useAuthContext } from "@/middleware/AuthContext"

export function FinanceHeader() {
  const { user, school } = useAuthContext()

  return (
    <div className="space-y-4">
      {/* Page Title & School Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Manajemen Keuangan Sekolah
            </h1>
            <p className="text-sm text-muted-foreground">
              {school?.schoolName} • NPSN: {school?.npsn} • Tahun Anggaran 2024
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <TrendingUp className="h-3 w-3 mr-1" />
            Budget Sehat
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <Calendar className="h-3 w-3 mr-1" />
            Periode Mei 2024
          </Badge>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Transaksi
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Laporan
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Export PDF</DropdownMenuItem>
            <DropdownMenuItem>Export Excel</DropdownMenuItem>
            <DropdownMenuItem>Export CSV</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter Data
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Semester 1 - 2024</DropdownMenuItem>
            <DropdownMenuItem>Semester 2 - 2024</DropdownMenuItem>
            <DropdownMenuItem>Bulan Ini</DropdownMenuItem>
            <DropdownMenuItem>3 Bulan Terakhir</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Periode: Mei 2024
        </Button>
      </div>
    </div>
  )
}