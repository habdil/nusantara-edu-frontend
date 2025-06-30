// src/components/managements/facility-usage/FacilityUsageHeader.tsx
"use client"

import { Calendar, Plus, Clock, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuthContext } from "@/middleware/AuthContext"

export function FacilityUsageHeader() {
  const { school } = useAuthContext()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
          <Calendar className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Penggunaan Fasilitas
          </h1>
          <p className="text-sm text-muted-foreground">
            {school?.schoolName} • Booking & Jadwal Fasilitas
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Badge variant="secondary" className="bg-green-100 text-green-700">
          <Clock className="h-3 w-3 mr-1" />
          18 Booking Hari Ini
        </Badge>
        
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Booking Baru
        </Button>
        
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
    </div>
  )
}