"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
import { budgetApi } from "./api/budget-api"
import type { SchoolFinance, FinancialTransaction } from "@/types/resources"

export function BudgetOverview() {
  const [budgets, setBudgets] = useState<SchoolFinance[]>([])
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [budgetData, transactionData] = await Promise.all([budgetApi.getBudgets(), budgetApi.getTransactions()])
        setBudgets(budgetData)
        setTransactions(transactionData)
      } catch (error) {
        console.error("Error fetching budget data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const budgetStats = {
    totalBudget: budgets.reduce((sum, b) => sum + b.budgetAmount, 0),
    totalUsed: budgets.reduce((sum, b) => sum + b.usedAmount, 0),
    totalRemaining: budgets.reduce((sum, b) => sum + b.remainingAmount, 0),
    utilizationRate:
      budgets.length > 0
        ? (budgets.reduce((sum, b) => sum + b.usedAmount, 0) / budgets.reduce((sum, b) => sum + b.budgetAmount, 0)) *
          100
        : 0,
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 75) return "text-yellow-600"
    return "text-green-600"
  }

  const getUtilizationBadge = (percentage: number) => {
    if (percentage >= 90) return <Badge variant="destructive">Kritis</Badge>
    if (percentage >= 75) return <Badge variant="secondary">Perhatian</Badge>
    return <Badge variant="default">Normal</Badge>
  }

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
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-3 w-32 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Anggaran</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(budgetStats.totalBudget)}</div>
            <p className="text-xs text-muted-foreground">Anggaran keseluruhan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sudah Digunakan</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(budgetStats.totalUsed)}</div>
            <p className="text-xs text-muted-foreground">
              {budgetStats.utilizationRate.toFixed(1)}% dari total anggaran
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sisa Anggaran</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(budgetStats.totalRemaining)}</div>
            <p className="text-xs text-muted-foreground">{(100 - budgetStats.utilizationRate).toFixed(1)}% tersisa</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tingkat Penggunaan</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getUtilizationColor(budgetStats.utilizationRate)}`}>
              {budgetStats.utilizationRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Rata-rata penggunaan</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget Details */}
      <Tabs defaultValue="budgets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="budgets">Anggaran per Kategori</TabsTrigger>
          <TabsTrigger value="transactions">Transaksi Terbaru</TabsTrigger>
        </TabsList>

        <TabsContent value="budgets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Anggaran per Kategori</CardTitle>
              <CardDescription>Rincian penggunaan anggaran berdasarkan kategori</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {budgets.map((budget) => {
                  const utilizationPercentage = (budget.usedAmount / budget.budgetAmount) * 100

                  return (
                    <div key={budget.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{budget.budgetCategory}</p>
                          <p className="text-sm text-muted-foreground">
                            {budget.period} - {budget.budgetYear}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-sm font-medium">
                            {formatCurrency(budget.usedAmount)} / {formatCurrency(budget.budgetAmount)}
                          </p>
                          <div className="flex items-center gap-2">
                            {getUtilizationBadge(utilizationPercentage)}
                            <span className="text-sm text-muted-foreground">{utilizationPercentage.toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                      <Progress value={utilizationPercentage} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Sisa: {formatCurrency(budget.remainingAmount)}</span>
                        <span>{budget.notes}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaksi Terbaru</CardTitle>
              <CardDescription>Daftar transaksi keuangan terbaru</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead>Kategori</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{new Date(transaction.transactionDate).toLocaleDateString("id-ID")}</TableCell>
                        <TableCell className="font-medium">{transaction.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{transaction.category}</Badge>
                        </TableCell>
                        <TableCell>{transaction.vendor}</TableCell>
                        <TableCell className="text-red-600 font-medium">
                          -{formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={transaction.approvalStatus === "approved" ? "default" : "secondary"}>
                            {transaction.approvalStatus === "approved" ? "Disetujui" : "Pending"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
