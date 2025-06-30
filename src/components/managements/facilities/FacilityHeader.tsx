// src/components/managements/facilities/FacilityHeader.tsx
"use client"

import { Building, Plus, Calendar, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/middleware/AuthContext"

export function FacilityHeader() {
  const { school } = useAuthContext()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
          <Building className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manajemen Fasilitas Sekolah
          </h1>
          <p className="text-sm text-muted-foreground">
            {school?.schoolName} • Sarana & Prasarana
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Fasilitas
        </Button>
        
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Jadwal Penggunaan
        </Button>
        
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
    </div>
  )
}