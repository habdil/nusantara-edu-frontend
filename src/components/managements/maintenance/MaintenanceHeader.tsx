// src/components/managements/maintenance/MaintenanceHeader.tsx
"use client"

import { Wrench, Plus, Calendar, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/middleware/AuthContext"

export function MaintenanceHeader() {
  const { school } = useAuthContext()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <Wrench className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Pemeliharaan Aset
          </h1>
          <p className="text-sm text-muted-foreground">
            {school?.schoolName} • Jadwal & Riwayat Maintenance
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Jadwal Maintenance
        </Button>
        
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Kalender
        </Button>
        
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
    </div>
  )
}