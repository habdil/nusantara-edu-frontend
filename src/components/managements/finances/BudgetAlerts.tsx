// src/components/managements/finances/BudgetAlerts.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle, 
  TrendingDown,
  Calendar,
  DollarSign,
  Eye,
  Bell
} from "lucide-react"

// Data peringatan berdasarkan sistem early warning NusantaraEdu
const budgetAlerts = [
  {
    id: 1,
    category: "Pendidikan",
    type: "critical",
    title: "Anggaran Hampir Habis",
    description: "Kategori Pendidikan telah menggunakan 92% dari total anggaran",
    amount: 28500000,
    budgetAmount: 31000000,
    urgency: "high",
    detectedDate: "2024-05-18",
    recommendation: "Segera realokasi anggaran atau ajukan tambahan dana"
  },
  {
    id: 2,
    category: "Pemeliharaan", 
    type: "warning",
    title: "Trend Pengeluaran Meningkat",
    description: "Pengeluaran pemeliharaan naik 45% dari bulan lalu",
    amount: 8200000,
    budgetAmount: 25000000,
    urgency: "medium",
    detectedDate: "2024-05-17",
    recommendation: "Monitor ketat pengeluaran pemeliharaan"
  },
  {
    id: 3,
    category: "Operasional",
    type: "info", 
    title: "Efisiensi Anggaran Baik",
    description: "Kategori operasional berjalan sesuai target bulanan",
    amount: 19800000,
    budgetAmount: 45000000,
    urgency: "low",
    detectedDate: "2024-05-16",
    recommendation: "Pertahankan pola pengeluaran saat ini"
  },
  {
    id: 4,
    category: "SDM",
    type: "warning",
    title: "Alokasi Dana Rendah",
    description: "Penggunaan anggaran SDM hanya 34% di pertengahan tahun",
    amount: 6800000,
    budgetAmount: 20000000,
    urgency: "medium",
    detectedDate: "2024-05-15",
    recommendation: "Tingkatkan program pengembangan SDM"
  }
]

export function BudgetAlerts() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'info':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return {
          bg: 'bg-red-50 dark:bg-red-950/20',
          border: 'border-red-200 dark:border-red-900/50',
          text: 'text-red-800 dark:text-red-200'
        }
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-950/20',
          border: 'border-yellow-200 dark:border-yellow-900/50',
          text: 'text-yellow-800 dark:text-yellow-200'
        }
      case 'info':
        return {
          bg: 'bg-green-50 dark:bg-green-950/20',
          border: 'border-green-200 dark:border-green-900/50',
          text: 'text-green-800 dark:text-green-200'
        }
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-950/20',
          border: 'border-gray-200 dark:border-gray-900/50',
          text: 'text-gray-800 dark:text-gray-200'
        }
    }
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">Mendesak</Badge>
      case 'medium':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">Sedang</Badge>
      case 'low':
        return <Badge variant="outline" className="text-xs">Rendah</Badge>
      default:
        return <Badge variant="outline" className="text-xs">Unknown</Badge>
    }
  }

  const criticalAlerts = budgetAlerts.filter(alert => alert.type === 'critical').length
  const warningAlerts = budgetAlerts.filter(alert => alert.type === 'warning').length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber-600" />
            Peringatan Anggaran
          </CardTitle>
          <div className="flex items-center space-x-2">
            {criticalAlerts > 0 && (
              <Badge variant="destructive" className="text-xs">
                {criticalAlerts} Kritis
              </Badge>
            )}
            {warningAlerts > 0 && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">
                {warningAlerts} Peringatan
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {budgetAlerts.map((alert) => {
            const colors = getAlertColor(alert.type)
            const utilizationPercentage = (alert.amount / alert.budgetAmount) * 100
            
            return (
              <Alert key={alert.id} className={`${colors.bg} ${colors.border} ${colors.text}`}>
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">
                    {getAlertIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium">
                            {alert.title}
                          </p>
                          {getUrgencyBadge(alert.urgency)}
                        </div>
                        <p className="text-xs opacity-80">
                          Kategori: {alert.category}
                        </p>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <p className="text-xs font-medium">
                          {formatCurrency(alert.amount)}
                        </p>
                        <p className="text-xs opacity-70">
                          {utilizationPercentage.toFixed(1)}% terpakai
                        </p>
                      </div>
                    </div>

                    <AlertDescription className="text-xs">
                      {alert.description}
                    </AlertDescription>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1 opacity-70">
                        <Calendar className="h-3 w-3" />
                        <span>Terdeteksi: {formatDate(alert.detectedDate)}</span>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        <Eye className="h-3 w-3 mr-1" />
                        Detail
                      </Button>
                    </div>

                    {/* Recommendation */}
                    <div className="mt-2 p-2 rounded bg-white/50 dark:bg-gray-800/50">
                      <p className="text-xs font-medium opacity-90">Rekomendasi:</p>
                      <p className="text-xs opacity-80">{alert.recommendation}</p>
                    </div>
                  </div>
                </div>
              </Alert>
            )
          })}

          {/* Summary */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total Peringatan</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {budgetAlerts.length}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Memerlukan Tindakan</p>
                <p className="text-lg font-semibold text-red-600">
                  {criticalAlerts + warningAlerts}
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button variant="outline" className="w-full">
            <Eye className="h-4 w-4 mr-2" />
            Lihat Semua Peringatan
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}