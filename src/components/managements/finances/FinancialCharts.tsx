// src/components/managements/finances/FinancialCharts.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from "lucide-react"

// Data untuk grafik berdasarkan ERD NusantaraEdu
const monthlyBudgetData = [
  { month: 'Jan', pemasukan: 25000000, pengeluaran: 18000000, saldo: 7000000 },
  { month: 'Feb', pemasukan: 28000000, pengeluaran: 22000000, saldo: 6000000 },
  { month: 'Mar', pemasukan: 32000000, pengeluaran: 25000000, saldo: 7000000 },
  { month: 'Apr', pemasukan: 30000000, pengeluaran: 24000000, saldo: 6000000 },
  { month: 'Mei', pemasukan: 35000000, pengeluaran: 28000000, saldo: 7000000 },
]

const categoryExpenseData = [
  { name: 'Operasional', value: 19800000, color: '#3B82F6' },
  { name: 'Pendidikan', value: 28500000, color: '#8B5CF6' },
  { name: 'Pemeliharaan', value: 8200000, color: '#F59E0B' },
  { name: 'SDM', value: 6800000, color: '#10B981' },
  { name: 'Konsumsi', value: 4200000, color: '#EF4444' },
  { name: 'Sarana Prasarana', value: 1000000, color: '#6366F1' },
]

const weeklyTransactionData = [
  { week: 'Minggu 1', transaksi: 12 },
  { week: 'Minggu 2', transaksi: 19 },
  { week: 'Minggu 3', transaksi: 15 },
  { week: 'Minggu 4', transaksi: 22 },
]

export function FinancialCharts() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatCurrencyShort = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`
    }
    return value.toString()
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-white">{data.name}</p>
          <p style={{ color: data.payload.color }} className="text-sm">
            {formatCurrency(data.value)}
          </p>
          <p className="text-xs text-muted-foreground">
            {((data.value / categoryExpenseData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Analisis Keuangan
          </CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            <TrendingUp className="h-3 w-3 mr-1" />
            Trend Positif
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="monthly" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Bulanan
            </TabsTrigger>
            <TabsTrigger value="category" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              Kategori
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Mingguan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="monthly" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyBudgetData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickFormatter={formatCurrencyShort}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="pemasukan" fill="#10B981" name="Pemasukan" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pengeluaran" fill="#EF4444" name="Pengeluaran" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total Pemasukan</p>
                <p className="text-sm font-semibold text-green-600">
                  {formatCurrency(monthlyBudgetData.reduce((sum, item) => sum + item.pemasukan, 0))}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total Pengeluaran</p>
                <p className="text-sm font-semibold text-red-600">
                  {formatCurrency(monthlyBudgetData.reduce((sum, item) => sum + item.pengeluaran, 0))}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Rata-rata Saldo</p>
                <p className="text-sm font-semibold text-blue-600">
                  {formatCurrency(monthlyBudgetData.reduce((sum, item) => sum + item.saldo, 0) / monthlyBudgetData.length)}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="category" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryExpenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryExpenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {categoryExpenseData.map((category, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {category.name}
                  </span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white ml-auto">
                    {formatCurrencyShort(category.value)}
                  </span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyTransactionData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="week" 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="transaksi" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#3B82F6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center space-y-1">
              <p className="text-xs text-muted-foreground">Total Transaksi Bulan Ini</p>
              <p className="text-lg font-semibold text-blue-600">
                {weeklyTransactionData.reduce((sum, item) => sum + item.transaksi, 0)} Transaksi
              </p>
              <p className="text-xs text-muted-foreground">
                Rata-rata {(weeklyTransactionData.reduce((sum, item) => sum + item.transaksi, 0) / weeklyTransactionData.length).toFixed(1)} transaksi per minggu
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}