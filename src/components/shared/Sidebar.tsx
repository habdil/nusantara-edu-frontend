"use client"

import * as React from "react"

import Link from "next/link"

import Image from "next/image"

import { usePathname } from "next/navigation"

import {
  Settings,
  Home,
  GraduationCap,
  FileText,
  Database,
  LogOut,
  Bell,
  User,
  UserCog,
  PieChart,
  AlertCircle,
} from "lucide-react"

import { cn } from "@/lib/utils"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Badge } from "@/components/ui/badge"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useAuthContext } from "@/middleware/AuthContext"

import { toast } from "sonner"

import { ProfileModal } from "@/components/profile/ProfileModal"

// Simplified menu item type

type MenuItem = {
  title: string

  url: string

  icon: React.ElementType

  badge?: string

  badgeVariant?: "default" | "destructive" | "secondary" | "outline"

  roles?: string[]
}

// Flat menu structure - no dropdowns

const menuData: { navMain: MenuItem[] } = {
  navMain: [
    {
      title: "Dashboard Eksekutif",

      url: "/dashboard",

      icon: Home,

      roles: ["principal", "admin", "teacher", "school_admin_staff"],
    },

    {
      title: "Manajemen Sumber Daya",

      url: "/dashboard/resources",

      icon: Database,

      roles: ["principal", "admin", "school_admin_staff"],
    },

    {
      title: "Performa Akademik",

      url: "/dashboard/academic",

      icon: GraduationCap,

      roles: ["principal", "admin", "teacher"],
    },

    {
      title: "Evaluasi Kinerja Guru",

      url: "/dashboard/teacher-evaluation",

      icon: UserCog,

      badge: "3",

      badgeVariant: "destructive",

      roles: ["principal", "admin"],
    },

    {
      title: "KPI Sekolah",

      url: "/dashboard/kpi",

      icon: PieChart,

      roles: ["principal", "admin"],
    },

    {
      title: "Pelaporan Otomatis",

      url: "/dashboard/reports",

      icon: FileText,

      badge: "2",

      badgeVariant: "secondary",

      roles: ["principal", "admin"],
    },

    {
      title: "Pengaturan Sistem",

      url: "/dashboard/settings",

      icon: Settings,

      roles: ["principal", "admin"],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const { isMobile } = useSidebar()

  const { user, school, logout, isAuthenticated, isLoading } = useAuthContext()

  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false)

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

  // Helper function to get user role display name

  const getRoleDisplayName = (role: string) => {
    const roleMap: Record<string, string> = {
      principal: "Kepala Sekolah",

      admin: "Administrator",

      teacher: "Guru",

      school_admin_staff: "Staff Administrasi",

      education_department: "Dinas Pendidikan",
    }

    return roleMap[role] || role
  }

  // Filter menu items based on user role

  const getFilteredMenuItems = () => {
    if (!user) return []

    return menuData.navMain.filter((item) => {
      if (!item.roles) return true

      return item.roles.includes(user.role)
    })
  }

  // Calculate total notifications

  const totalNotifications = React.useMemo(() => {
    let total = 0

    const filteredItems = getFilteredMenuItems()

    filteredItems.forEach((item) => {
      if (item.badge && !isNaN(Number(item.badge))) {
        total += Number(item.badge)
      }
    })

    return total
  }, [user])

  // Handle logout

  const handleLogout = async () => {
    try {
      await logout()

      toast.success("Logout Berhasil", {
        description: "Anda telah berhasil keluar dari sistem.",

        duration: 2000,
      })
    } catch (error) {
      console.error("Logout error:", error)

      toast.error("Logout Gagal", {
        description: "Terjadi kesalahan saat logout. Silakan coba lagi.",

        duration: 3000,
      })
    }
  }

  // Don't render if not authenticated

  if (!isAuthenticated) {
    return null
  }

  // Show loading state

  if (isLoading) {
    return (
      <Sidebar collapsible="icon" className="border-r border-slate-200 dark:border-slate-800" {...props}>
        <SidebarHeader className="border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-600"></div>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <div className="flex items-center justify-center p-4">
            <span className="text-sm text-slate-500">Loading...</span>
          </div>
        </SidebarContent>
      </Sidebar>
    )
  }

  const filteredMenuItems = getFilteredMenuItems()

  // Improved active state detection

  const getActiveMenuItem = (pathname: string, menuItems: MenuItem[]) => {
    // First, try exact match

    const exactMatch = menuItems.find((item) => pathname === item.url)

    if (exactMatch) return exactMatch.url

    // Then try to find the best match by checking if pathname starts with menu URL

    const pathSegments = pathname.split("/").filter(Boolean)

    const currentSection = pathSegments[1] // Get the main section after /dashboard

    // Map current section to menu URLs

    const sectionMap: Record<string, string> = {
      resources: "/dashboard/resources",

      academic: "/dashboard/academic",

      "teacher-evaluation": "/dashboard/teacher-evaluation",

      kpi: "/dashboard/kpi",

      reports: "/dashboard/reports",

      settings: "/dashboard/settings",
    }

    return sectionMap[currentSection] || "/dashboard"
  }

  return (
    <>
      <Sidebar
        collapsible="icon"
        className="border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        {...props}
      >
        <SidebarHeader className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                asChild
                className="hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              >
                <Link href="/dashboard">
                  <div className="flex items-center justify-center">
                    <Image src="/logo.svg" alt="NusantaraEdu Logo" width={32} height={32} className="object-contain" />
                  </div>

                  <div className="grid flex-1 text-left text-sm leading-tight ml-3">
                    <span className="truncate font-bold text-slate-900 dark:text-slate-100">NusantaraEdu</span>

                    <span className="truncate text-xs text-slate-600 dark:text-slate-400">
                      Sistem Informasi Manajemen
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="bg-white dark:bg-slate-900">
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2 mb-2">
              Menu Utama
            </SidebarGroupLabel>

            <SidebarMenu className="gap-1">
              {filteredMenuItems.map((item) => {
                const activeUrl = getActiveMenuItem(pathname, filteredMenuItems)

                const isActive = item.url === activeUrl

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={cn(
                        "transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg mx-2",

                        isActive &&
                          "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm hover:bg-slate-800 dark:hover:bg-slate-200",
                      )}
                    >
                      <Link href={item.url} className="flex items-center gap-3 w-full px-3 py-2">
                        <item.icon
                          className={cn(
                            "h-5 w-5 transition-colors",

                            isActive ? "text-white dark:text-slate-900" : "text-slate-600 dark:text-slate-400",
                          )}
                        />

                        <span
                          className={cn(
                            "font-medium flex-1",

                            isActive ? "text-white dark:text-slate-900" : "text-slate-700 dark:text-slate-300",
                          )}
                        >
                          {item.title}
                        </span>

                        {item.badge && (
                          <Badge
                            variant={item.badgeVariant || "destructive"}
                            className="h-5 min-w-5 px-2 text-xs font-semibold"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
                  >
                    <Avatar className="h-8 w-8 rounded-lg ring-2 ring-slate-200 dark:ring-slate-700">
                      <AvatarImage src={user?.profilePicture || "/placeholder.svg"} alt={user?.fullName} />

                      <AvatarFallback className="rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold">
                        {getUserInitials(user?.fullName || "User")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold text-slate-900 dark:text-slate-100">
                        {user?.fullName || "Loading..."}
                      </span>

                      <span className="truncate text-xs text-slate-600 dark:text-slate-400">
                        {getRoleDisplayName(user?.role || "")}
                      </span>
                    </div>

                    <div className="relative">
                      <Bell className="size-4 text-slate-500 dark:text-slate-400" />

                      {totalNotifications > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 text-xs bg-red-500 text-white border-2 border-white dark:border-slate-900">
                          {totalNotifications > 99 ? "99+" : totalNotifications}
                        </Badge>
                      )}
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-64 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  side={isMobile ? "bottom" : "right"}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-3 px-3 py-3 text-left text-sm bg-slate-50 dark:bg-slate-800/50 rounded-t-lg">
                      <Avatar className="h-10 w-10 rounded-lg ring-2 ring-slate-200 dark:ring-slate-700">
                        <AvatarImage src={user?.profilePicture || "/placeholder.svg"} alt={user?.fullName} />

                        <AvatarFallback className="rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold">
                          {getUserInitials(user?.fullName || "User")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold text-slate-900 dark:text-slate-100">
                          {user?.fullName || "Loading..."}
                        </span>

                        <span className="truncate text-xs text-slate-600 dark:text-slate-400">
                          {school?.schoolName || "Loading..."} • NPSN: {school?.npsn || "N/A"}
                        </span>

                        <span className="truncate text-xs text-green-600 dark:text-green-400 font-medium">
                          ● Online
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    onClick={() => setIsProfileModalOpen(true)}
                  >
                    <User className="mr-3 h-4 w-4 text-slate-600 dark:text-slate-400" />

                    <span>Profil Saya</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <Link href="/dashboard/notifications">
                      <Bell className="mr-3 h-4 w-4 text-slate-600 dark:text-slate-400" />

                      <span>Notifikasi</span>

                      {totalNotifications > 0 && (
                        <Badge variant="destructive" className="ml-auto h-5 w-5 p-0 text-xs">
                          {totalNotifications > 99 ? "99+" : totalNotifications}
                        </Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild className="hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <Link href="/dashboard/settings">
                      <Settings className="mr-3 h-4 w-4 text-slate-600 dark:text-slate-400" />

                      <span>Pengaturan</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                    <AlertCircle className="mr-3 h-4 w-4 text-slate-600 dark:text-slate-400" />

                    <span>Bantuan & Dukungan</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 transition-colors focus:bg-red-50 dark:focus:bg-red-900/20 focus:text-red-700"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-3 h-4 w-4" />

                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <ProfileModal open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen} />
    </>
  )
}
