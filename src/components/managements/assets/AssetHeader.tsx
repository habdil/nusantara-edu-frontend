// src/components/managements/assets/AssetHeader.tsx
"use client"

import { Package, Plus, Filter, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuthContext } from "@/middleware/AuthContext"

export function AssetHeader() {
  const { school } = useAuthContext()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
          <Package className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manajemen Aset & Inventaris
          </h1>
          <p className="text-sm text-muted-foreground">
            {school?.schoolName} • Inventaris Sekolah
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Aset
        </Button>
        
        <Button variant="outline">
          <QrCode className="h-4 w-4 mr-2" />
          Scan QR
        </Button>
        
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
    </div>
  )
}