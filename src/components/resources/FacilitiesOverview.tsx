"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Building, Users, MapPin, AlertTriangle, CheckCircle } from "lucide-react"
import { facilitiesApi } from "./api/facilities-api"
import type { Facility, ConditionStatus } from "@/types/resources"
import Image from "next/image"

const getConditionBadge = (condition?: ConditionStatus) => {
  if (!condition) return null

  const variants = {
    good: { variant: "default" as const, icon: CheckCircle, text: "Baik" },
    minor_damage: { variant: "secondary" as const, icon: AlertTriangle, text: "Rusak Ringan" },
    major_damage: { variant: "destructive" as const, icon: AlertTriangle, text: "Rusak Berat" },
    under_repair: { variant: "outline" as const, icon: AlertTriangle, text: "Dalam Perbaikan" },
  }

  const config = variants[condition]
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.text}
    </Badge>
  )
}

export function FacilitiesOverview() {
  const [facilities, setFacilities] = useState<Facility[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [conditionFilter, setConditionFilter] = useState<string>("all")

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const data = await facilitiesApi.getFacilities()
        setFacilities(data)
      } catch (error) {
        console.error("Error fetching facilities:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFacilities()
  }, [])

  const filteredFacilities = facilities.filter((facility) => {
    const matchesSearch =
      facility.facilityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      facility.facilityType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || facility.facilityType === typeFilter
    const matchesCondition = conditionFilter === "all" || facility.condition === conditionFilter

    return matchesSearch && matchesType && matchesCondition
  })

  const facilityStats = {
    total: facilities.length,
    totalCapacity: facilities.reduce((sum, f) => sum + (f.capacity || 0), 0),
    good: facilities.filter((f) => f.condition === "good").length,
    needsAttention: facilities.filter((f) => f.condition === "minor_damage" || f.condition === "major_damage").length,
  }

  const types = [...new Set(facilities.map((facility) => facility.facilityType))]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-24 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fasilitas</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facilityStats.total}</div>
            <p className="text-xs text-muted-foreground">Semua fasilitas sekolah</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Kapasitas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{facilityStats.totalCapacity}</div>
            <p className="text-xs text-muted-foreground">Orang dapat ditampung</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kondisi Baik</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{facilityStats.good}</div>
            <p className="text-xs text-muted-foreground">Fasilitas siap pakai</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perlu Perhatian</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{facilityStats.needsAttention}</div>
            <p className="text-xs text-muted-foreground">Fasilitas perlu perbaikan</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Fasilitas Sekolah</CardTitle>
          <CardDescription>Kelola dan pantau semua fasilitas sekolah</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari fasilitas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Tipe Fasilitas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Kondisi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kondisi</SelectItem>
                <SelectItem value="good">Baik</SelectItem>
                <SelectItem value="minor_damage">Rusak Ringan</SelectItem>
                <SelectItem value="major_damage">Rusak Berat</SelectItem>
                <SelectItem value="under_repair">Dalam Perbaikan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Facilities Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredFacilities.map((facility) => (
          <Card key={facility.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <Image
                src={facility.facilityPhoto || "/placeholder.svg?height=200&width=300&query=facility"}
                alt={facility.facilityName}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{facility.facilityName}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <Badge variant="outline">{facility.facilityType}</Badge>
                  </CardDescription>
                </div>
                {facility.condition && getConditionBadge(facility.condition)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {facility.capacity && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Kapasitas: {facility.capacity} orang</span>
                  </div>
                )}
                {facility.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{facility.location}</span>
                  </div>
                )}
                {facility.notes && <p className="text-sm text-muted-foreground mt-2">{facility.notes}</p>}
              </div>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Detail
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
