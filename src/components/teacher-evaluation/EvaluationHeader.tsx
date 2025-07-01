"use client"

import { Button } from "@/components/ui/button"
import { Plus, Download, Filter } from "lucide-react"

interface EvaluationHeaderProps {
  onAddEvaluation?: () => void
  onExport?: () => void
  onFilter?: () => void
}

export function EvaluationHeader({ onAddEvaluation, onExport, onFilter }: EvaluationHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Evaluasi Guru</h1>
        <p className="text-muted-foreground">Kelola dan pantau evaluasi kinerja guru secara komprehensif</p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="outline" onClick={onFilter} className="w-full sm:w-auto bg-transparent">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>

        <Button variant="outline" onClick={onExport} className="w-full sm:w-auto bg-transparent">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>

        <Button onClick={onAddEvaluation} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Evaluasi
        </Button>
      </div>
    </div>
  )
}
