// src/components/managements/finances/BudgetCategoryCards.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  GraduationCap, 
  Users, 
  Building, 
  Wrench, 
  Utensils, 
  BookOpen,
  TrendingUp,
  AlertTriangle
} from "lucide-react"

// Data kategori anggaran berdasarkan ERD NusantaraEdu
const budgetCategories = [
  {
    category: "Operasional",
    icon: Building,
    budgetAmount: 45000000,
    usedAmount: 19800000,
    color: "blue",
    trend: "up",
    description: "Biaya operasional harian sekolah"
  },
  {
    category: "Pendidikan",
    icon: GraduationCap,
    budgetAmount: 35000000,
    usedAmount: 28500000,
    color: "purple",
    trend: "up",
    description: "Kegiatan pembelajaran dan akademik"
  },
  {
    category: "Pemeliharaan",
    icon: Wrench,
    budgetAmount: 25000000,
    usedAmount: 8200000,
    color: "orange",
    trend: "down",
    description: "Perawatan fasilitas dan aset"
  },
  {
    category: "SDM",
    icon: Users,
    budgetAmount: 20000000,
    usedAmount: 6800000,
    color: "green",
    trend: "stable",
    description: "Pengembangan sumber daya manusia"
  },
  {
    category: "Konsumsi",
    icon: Utensils,
    budgetAmount: 15000000,
    usedAmount: 4200000,
    color: "red",
    trend: "up",
    description: "Konsumsi dan katering sekolah"
  },
  {
    category: "Sarana Prasarana",
    icon: BookOpen,
    budgetAmount: 5000000,
    usedAmount: 1000000,
    color: "indigo",
    trend: "stable",
    description: "Pengadaan alat dan bahan ajar"
  }
]

const colorClasses = {
  blue: {
    bg: "bg-blue-500",
    bgLight: "bg-blue-50 dark:bg-blue-950/20",
    text: "text-blue-600",
    border: "border-l-blue-500"
  },
  purple: {
    bg: "bg-purple-500",
    bgLight: "bg-purple-50 dark:bg-purple-950/20",
    text: "text-purple-600",
    border: "border-l-purple-500"
  },
  orange: {
    bg: "bg-orange-500",
    bgLight: "bg-orange-50 dark:bg-orange-950/20",
    text: "text-orange-600",
    border: "border-l-orange-500"
  },
  green: {
    bg: "bg-green-500",
    bgLight: "bg-green-50 dark:bg-green-950/20",
    text: "text-green-600",
    border: "border-l-green-500"
  },
  red: {
    bg: "bg-red-500",
    bgLight: "bg-red-50 dark:bg-red-950/20",
    text: "text-red-600",
    border: "border-l-red-500"
  },
  indigo: {
    bg: "bg-indigo-500",
    bgLight: "bg-indigo-50 dark:bg-indigo-950/20",
    text: "text-indigo-600",
    border: "border-l-indigo-500"
  }
}

export function BudgetCategoryCards() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-600" />
      case "down":
        return <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />
      default:
        return <div className="h-3 w-3 rounded-full bg-gray-400" />
    }
  }

  const getUtilizationStatus = (percentage: number) => {
    if (percentage >= 90) return { variant: "destructive" as const, text: "Hampir Habis" }
    if (percentage >= 70) return { variant: "secondary" as const, text: "Perlu Perhatian" }
    return { variant: "outline" as const, text: "Aman" }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Anggaran per Kategori
        </h2>
        <Badge variant="outline" className="text-xs">
          6 Kategori Aktif
        </Badge>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {budgetCategories.map((category, index) => {
          const colorClass = colorClasses[category.color as keyof typeof colorClasses]
          const utilizationPercentage = (category.usedAmount / category.budgetAmount) * 100
          const remainingAmount = category.budgetAmount - category.usedAmount
          const status = getUtilizationStatus(utilizationPercentage)
          
          return (
            <Card 
              key={index} 
              className={`transition-all duration-200 hover:shadow-md border-l-4 ${colorClass.border}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${colorClass.bgLight}`}>
                      <category.icon className={`h-4 w-4 ${colorClass.text}`} />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">
                        {category.category}
                      </CardTitle>
                    </div>
                  </div>
                  {getTrendIcon(category.trend)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Budget Numbers */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Anggaran</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(category.budgetAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Terpakai</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(category.usedAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sisa</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(remainingAmount)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Pemanfaatan</span>
                    <span className="text-xs font-medium text-gray-900 dark:text-white">
                      {utilizationPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={utilizationPercentage} className="h-2" />
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <Badge variant={status.variant} className="text-xs">
                    {utilizationPercentage >= 90 && <AlertTriangle className="h-3 w-3 mr-1" />}
                    {status.text}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {category.description}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}