"use client"

import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { KPICards } from "@/components/dashboard/KPICards"
import { AttendanceTrend } from "@/components/dashboard/AttendanceTrend"
import { AcademicPerformance } from "@/components/dashboard/AcademicPerformance"
import { FinancialOverview } from "@/components/dashboard/FinancialOverview"
import { QuickActions } from "@/components/dashboard/QuickActions"
import { AIRecommendations } from "@/components/dashboard/AIRecomendations"
import { RecentActivities } from "@/components/dashboard/RecentActivites"
import { RouteGuard } from "@/middleware/RouteGuard"
import { UserRoles } from "@/types/auth.types"
import { useAuthContext } from "@/middleware/AuthContext"
import { useEffect } from "react"
import { EarlyWarnings } from "@/components/dashboard/EarlyWarnings.tsx"

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuthContext()

  // Debug log to check authentication state
  useEffect(() => {
    console.log("Dashboard - Auth State:", { isAuthenticated, isLoading, user: user?.fullName })
  }, [isAuthenticated, isLoading, user])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <RouteGuard requiredRoles={[UserRoles.PRINCIPAL, UserRoles.ADMIN, UserRoles.TEACHER, UserRoles.SCHOOL_ADMIN_STAFF]}>
      <div className="flex-1 space-y-6 p-6">
        {/* Header Section */}
        <DashboardHeader />

        {/* KPI Overview Cards */}
        <KPICards />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            <AttendanceTrend />
            <AcademicPerformance />
            <FinancialOverview />
            <RecentActivities />
          </div>

          {/* Right Column - Widgets */}
          <div className="space-y-6">
            <EarlyWarnings />
            <AIRecommendations />
            <QuickActions />
          </div>
        </div>
      </div>
    </RouteGuard>
  )
}
