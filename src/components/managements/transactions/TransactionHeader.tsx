// src/components/managements/transactions/TransactionHeader.tsx
"use client"

import { Receipt, Plus, Filter, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuthContext } from "@/middleware/AuthContext"

export function TransactionHeader() {
  const { school } = useAuthContext()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <Receipt className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Transaksi Keuangan
          </h1>
          <p className="text-sm text-muted-foreground">
            {school?.schoolName} • Periode Mei 2024
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Tambah Transaksi
        </Button>
        
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  )
}