"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Building, 
  Users, 
  MapPin, 
  FileText, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle, 
  Clock3,
  Loader2,
  AlertTriangle
} from "lucide-react"
import { facilitiesApi, FacilityUsage } from "../api/facilities-api"
import type { Facility, ConditionStatus } from "@/types/resources"
import { toast } from "sonner"
import Image from "next/image"

interface ModalDetailProps {
  facility: Facility | null
  isOpen: boolean
  onClose: () => void
}

const getConditionBadge = (condition?: ConditionStatus) => {
  if (!condition) return null

  const variants = {
    good: { variant: "default" as const, icon: CheckCircle, text: "Baik" },
    minor_damage: { variant: "secondary" as const, icon: AlertTriangle, text: "Rusak Ringan" },
    major_damage: { variant: "destructive" as const, icon: AlertTriangle, text: "Rusak Berat" },
    under_repair: { variant: "outline" as const, icon: Clock3, text: "Dalam Perbaikan" },
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

const getUsageStatusBadge = (status?: string) => {
  if (!status) return null

  const variants = {
    approved: { variant: "default" as const, icon: CheckCircle, text: "Disetujui" },
    rejected: { variant: "destructive" as const, icon: XCircle, text: "Ditolak" },
    pending: { variant: "secondary" as const, icon: Clock3, text: "Menunggu" },
  }

  const config = variants[status as keyof typeof variants] || variants.pending
  const Icon = config.icon

  return (
    <Badge variant={config.variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.text}
    </Badge>
  )
}

export function ModalDetailFacilities({ facility, isOpen, onClose }: ModalDetailProps) {
  const [facilityUsage, setFacilityUsage] = useState<FacilityUsage[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && facility?.id) {
      loadFacilityUsage()
    }
  }, [isOpen, facility?.id])

  const loadFacilityUsage = async () => {
    if (!facility?.id) return

    try {
      setLoading(true)
      const usageData = await facilitiesApi.getFacilityUsageByFacilityId(facility.id)
      setFacilityUsage(usageData)
    } catch (error) {
      console.error('Error loading facility usage:', error)
      toast.error('Gagal memuat riwayat penggunaan fasilitas')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('id-ID')
  }

  const formatTime = (time: Date | string) => {
    return new Date(time).toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    })
  }

  if (!facility) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Building className="h-5 w-5" />
            Detail Fasilitas
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Info Fasilitas */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{facility.facilityName}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="outline">{facility.facilityType}</Badge>
                  {getConditionBadge(facility.condition)}
                </div>
              </div>
              
              <div className="space-y-3">
                {facility.capacity && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Kapasitas: {facility.capacity} orang</span>
                  </div>
                )}
                
                {facility.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>Lokasi: {facility.location}</span>
                  </div>
                )}

                {facility.notes && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">Catatan:</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">{facility.notes}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Gambar */}
            <div className="aspect-video relative bg-muted rounded-lg overflow-hidden">
              <Image
                src={facility.facilityPhoto || "/image/facility.png"}
                alt={facility.facilityName}
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          {/* Riwayat Penggunaan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5" />
                Riwayat Penggunaan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Memuat...</span>
                </div>
              ) : facilityUsage.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {facilityUsage.slice(0, 10).map((usage) => (
                    <div key={usage.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{usage.purpose}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(usage.date)} • {formatTime(usage.startTime)} - {formatTime(usage.endTime)}
                          </p>
                        </div>
                        {getUsageStatusBadge(usage.approvalStatus)}
                      </div>
                      {usage.user && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>{usage.user.fullName}</span>
                        </div>
                      )}
                      {usage.notes && (
                        <p className="text-sm text-muted-foreground mt-2 italic">"{usage.notes}"</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">Belum ada riwayat penggunaan</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}