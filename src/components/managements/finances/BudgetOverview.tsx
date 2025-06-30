// src/components/managements/finances/BudgetOverview.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

const budgetData = {
  totalBudget: 145000000,
  totalSpent: 68500000,
  remainingBudget: 76500000,
  monthlyChange: 2.3,
  utilizationRate: 47.2
}

export function BudgetOverview() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const utilizationPercentage = (budgetData.totalSpent / budgetData.totalBudget) * 100

  return (
    <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-950/20">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          Ringkasan Anggaran
          <Badge variant="secondary" className="text-xs">
            Periode Mei 2024
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Pemasukan */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total Pemasukan</span>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(budgetData.totalBudget)}
              </div>
              <div className="text-xs text-muted-foreground">
                67% dari anggaran tahunan
              </div>
            </div>
          </div>

          {/* Total Pengeluaran */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total Pengeluaran</span>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(budgetData.totalSpent)}
              </div>
              <div className="text-xs text-muted-foreground">
                {utilizationPercentage.toFixed(1)}% dari total anggaran
              </div>
            </div>
          </div>

          {/* Saldo */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Saldo</span>
              <Minus className="h-4 w-4 text-blue-600" />
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(budgetData.remainingBudget)}
              </div>
              <div className="text-xs text-muted-foreground">
                {(100 - utilizationPercentage).toFixed(1)}% tersisa
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tingkat Pemanfaatan Anggaran</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {utilizationPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress value={utilizationPercentage} className="h-3" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span className="text-center">50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Monthly Change Indicator */}
        <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Efisiensi anggaran meningkat {budgetData.monthlyChange}% dari bulan lalu
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}