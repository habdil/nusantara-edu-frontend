"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Search } from "lucide-react"

interface FilterState {
  search: string
  academicYear: string
  evaluationPeriod: string
  subjectArea: string
  status: string
}

interface EvaluationFiltersProps {
  onFiltersChange: (filters: FilterState) => void
  isVisible: boolean
  onClose: () => void
}

export function EvaluationFilters({ onFiltersChange, isVisible, onClose }: EvaluationFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    academicYear: "",
    evaluationPeriod: "",
    subjectArea: "",
    status: "",
  })

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters: FilterState = {
      search: "",
      academicYear: "",
      evaluationPeriod: "",
      subjectArea: "",
      status: "",
    }
    setFilters(emptyFilters)
    onFiltersChange(emptyFilters)
  }

  const activeFiltersCount = Object.values(filters).filter((value) => value !== "").length

  if (!isVisible) return null

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">Filter Evaluasi</CardTitle>
          {activeFiltersCount > 0 && <Badge variant="secondary">{activeFiltersCount} filter aktif</Badge>}
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="search">Cari Guru</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Nama atau ID guru..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tahun Akademik</Label>
            <Select value={filters.academicYear} onValueChange={(value) => handleFilterChange("academicYear", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih tahun akademik" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024/2025">2024/2025</SelectItem>
                <SelectItem value="2023/2024">2023/2024</SelectItem>
                <SelectItem value="2022/2023">2022/2023</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Periode Evaluasi</Label>
            <Select
              value={filters.evaluationPeriod}
              onValueChange={(value) => handleFilterChange("evaluationPeriod", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semester 1">Semester 1</SelectItem>
                <SelectItem value="Semester 2">Semester 2</SelectItem>
                <SelectItem value="Tahunan">Tahunan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Mata Pelajaran</Label>
            <Select value={filters.subjectArea} onValueChange={(value) => handleFilterChange("subjectArea", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih mata pelajaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Matematika">Matematika</SelectItem>
                <SelectItem value="Bahasa Indonesia">Bahasa Indonesia</SelectItem>
                <SelectItem value="IPA">IPA</SelectItem>
                <SelectItem value="IPS">IPS</SelectItem>
                <SelectItem value="Bahasa Inggris">Bahasa Inggris</SelectItem>
                <SelectItem value="Pendidikan Agama">Pendidikan Agama</SelectItem>
                <SelectItem value="PJOK">PJOK</SelectItem>
                <SelectItem value="Seni Budaya">Seni Budaya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status Evaluasi</Label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="completed">Selesai</SelectItem>
                <SelectItem value="reviewed">Direview</SelectItem>
                <SelectItem value="approved">Disetujui</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={clearFilters}>
            Reset Filter
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
