"use client"

import { useState, useEffect, type JSX } from "react"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  GraduationCap,
  Edit,
  Camera,
  Shield,
  Clock,
  Users,
  Award,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { profileApi, type UserProfile, type SchoolInfo } from "@/components/profile/api/profile-api"

interface ProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [school, setSchool] = useState<SchoolInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch profile data when modal opens
  useEffect(() => {
    if (open && !profile) {
      fetchProfile()
    }
  }, [open])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await profileApi.getProfile()
      setProfile(response.profile)
      setSchool(response.school || null)
    } catch (err) {
      console.error("Failed to fetch profile:", err)
      setError(err instanceof Error ? err.message : "Gagal memuat data profil")
    } finally {
      setLoading(false)
    }
  }

  // Helper function to get user initials
  const getUserInitials = (fullName: string) => {
    return (
      fullName
        ?.split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    )
  }

  // Helper function to get user role display name with icons
  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, { name: string; icon: JSX.Element; color: string }> = {
      principal: {
        name: "Kepala Sekolah",
        icon: <Building className="h-4 w-4" />,
        color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
      },
      admin: {
        name: "Administrator",
        icon: <Shield className="h-4 w-4" />,
        color:
          "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
      },
      teacher: {
        name: "Guru",
        icon: <GraduationCap className="h-4 w-4" />,
        color:
          "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
      },
      school_admin_staff: {
        name: "Staff Administrasi",
        icon: <Users className="h-4 w-4" />,
        color:
          "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
      },
      education_department: {
        name: "Dinas Pendidikan",
        icon: <Award className="h-4 w-4" />,
        color:
          "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800",
      },
    }
    return (
      roleMap[role] || {
        name: role,
        icon: <User className="h-4 w-4" />,
        color: "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-950 dark:text-gray-300 dark:border-gray-800",
      }
    )
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "Tidak tersedia"
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Helper function to format simple date
  const formatSimpleDate = (dateString: string) => {
    if (!dateString) return "Tidak tersedia"
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="text-center space-y-6 py-8">
        <Skeleton className="h-32 w-32 rounded-full mx-auto" />
        <div className="space-y-3">
          <Skeleton className="h-8 w-64 mx-auto" />
          <div className="flex justify-center gap-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-5 w-80 mx-auto" />
        </div>
      </div>

      {/* Cards Skeleton */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] overflow-hidden">
        <DialogHeader className="text-center pb-2">
          <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">Profil Pengguna</DialogTitle>
          <DialogDescription className="text-slate-600 dark:text-slate-400">
            Informasi detail tentang akun dan profil Anda
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2 -mr-2">
          <style jsx>{`
            div::-webkit-scrollbar {
              width: 6px;
            }
            div::-webkit-scrollbar-track {
              background: transparent;
            }
            div::-webkit-scrollbar-thumb {
              background: #cbd5e1;
              border-radius: 3px;
            }
            div::-webkit-scrollbar-thumb:hover {
              background: #94a3b8;
            }
          `}</style>

          {loading && <LoadingSkeleton />}

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button variant="outline" size="sm" className="ml-4 bg-transparent" onClick={fetchProfile}>
                  Coba Lagi
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {!loading && !error && profile && (
            <div className="space-y-8">
              {/* Profile Header */}
              <div className="text-center space-y-6 py-8 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="relative inline-block">
                  <Avatar className="h-32 w-32 ring-4 ring-white dark:ring-slate-600 shadow-2xl">
                    <AvatarImage
                      src={profile.profilePicture || "/placeholder.svg"}
                      alt={profile.fullName}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-4xl font-bold">
                      {getUserInitials(profile.fullName || "User")}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full p-0 shadow-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border-2 border-white dark:border-slate-600"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{profile.fullName}</h3>

                  <div className="flex flex-wrap gap-3 justify-center">
                    {(() => {
                      const roleInfo = getRoleDisplayName(profile.role)
                      return (
                        <Badge className={`text-sm font-medium px-4 py-2 ${roleInfo.color} border`}>
                          {roleInfo.icon}
                          <span className="ml-2">{roleInfo.name}</span>
                        </Badge>
                      )
                    })()}
                    <Badge className="text-sm font-medium px-4 py-2 bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                      Aktif
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xl font-semibold text-slate-800 dark:text-slate-200">
                      {school?.schoolName || "Sekolah tidak ditemukan"}
                    </p>
                    <p className="text-slate-600 dark:text-slate-400">
                      NPSN: {school?.npsn || "N/A"}
                      {school?.accreditation && <span className="ml-2">• Akreditasi {school.accreditation}</span>}
                    </p>
                  </div>

                  <Button className="gap-2 px-6 py-2 bg-primary hover:bg-primary/90">
                    <Edit className="h-4 w-4" />
                    Edit Profil
                  </Button>
                </div>
              </div>

              {/* Personal Information Card */}
              <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    Informasi Pribadi
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-500" />
                        Email
                      </label>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <p className="text-slate-900 dark:text-slate-100 font-medium break-all whitespace-pre-line">
                            {profile.email || "Tidak tersedia"}
                        </p>
                    </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <Phone className="h-4 w-4 text-green-500" />
                        Nomor Telepon
                      </label>
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <p className="text-slate-900 dark:text-slate-100 font-medium">
                          {profile.phoneNumber || "Tidak tersedia"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-purple-500" />
                        Tanggal Bergabung
                      </label>
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <p className="text-slate-900 dark:text-slate-100 font-medium">
                          {formatSimpleDate(profile.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        Login Terakhir
                      </label>
                      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <p className="text-slate-900 dark:text-slate-100 font-medium">
                          {profile.lastLogin ? formatDate(profile.lastLogin) : "Tidak tersedia"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* School Information Card */}
              <Card className="border-slate-200 dark:border-slate-700 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <Building className="h-5 w-5 text-secondary" />
                    </div>
                    Informasi Sekolah
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {school ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                            Nama Sekolah
                          </label>
                          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                            <p className="text-slate-900 dark:text-slate-100 font-medium">{school.schoolName}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-slate-600 dark:text-slate-400">NPSN</label>
                          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                            <p className="text-slate-900 dark:text-slate-100 font-mono font-medium">{school.npsn}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-red-500" />
                          Alamat Sekolah
                        </label>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                          <p className="text-slate-900 dark:text-slate-100 font-medium leading-relaxed">
                            {school.fullAddress}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <Building className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-400 text-lg">Informasi sekolah tidak tersedia</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Refresh Button */}
              <div className="flex justify-center pt-4 pb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchProfile}
                  disabled={loading}
                  className="gap-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Clock className="h-4 w-4" />}
                  Perbarui Data
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
