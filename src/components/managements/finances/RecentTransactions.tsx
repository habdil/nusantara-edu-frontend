// src/components/managements/finances/RecentTransactions.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Calendar,
  Receipt,
  Eye,
  MoreHorizontal,
  FileText
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Data transaksi berdasarkan ERD NusantaraEdu
const recentTransactions = [
  {
    id: "TR-001",
    date: "2024-05-18",
    description: "Pembayaran Gaji Guru",
    category: "Operasional",
    type: "expense",
    amount: 45000000,
    recordedBy: "Habdil Iqrawardana",
    status: "completed",
    proofDocument: "bukti-gaji-mei-2024.pdf"
  },
  {
    id: "TR-002", 
    date: "2024-05-17",
    description: "Dana BOS Siswa",
    category: "Pendidikan",
    type: "income",
    amount: 120000000,
    recordedBy: "Rayan Mar'i",
    status: "completed",
    proofDocument: "dana-bos-mei-2024.pdf"
  },
  {
    id: "TR-003",
    date: "2024-05-16",
    description: "Pembelian Alat Tulis",
    category: "Sarana Prasarana",
    type: "expense", 
    amount: 2500000,
    recordedBy: "Muhammad Faiz",
    status: "pending",
    proofDocument: "nota-alat-tulis.pdf"
  },
  {
    id: "TR-004",
    date: "2024-05-15", 
    description: "Perbaikan AC Ruang Kelas",
    category: "Pemeliharaan",
    type: "expense",
    amount: 3200000,
    recordedBy: "Naufal Rizqy",
    status: "completed",
    proofDocument: "nota-service-ac.pdf"
  },
  {
    id: "TR-005",
    date: "2024-05-14",
    description: "Sumbangan Komite Sekolah", 
    category: "Operasional",
    type: "income",
    amount: 15000000,
    recordedBy: "Rezki Haikal",
    status: "completed",
    proofDocument: "bukti-transfer-komite.pdf"
  }
]

export function RecentTransactions() {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Selesai</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">Pending</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getUserInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Transaksi Terbaru
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              {recentTransactions.length} Transaksi
            </Badge>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Lihat Semua
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentTransactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              {/* Transaction Type Icon */}
              <div className={`p-2 rounded-lg ${
                transaction.type === 'income' 
                  ? 'bg-green-100 dark:bg-green-900/20' 
                  : 'bg-red-100 dark:bg-red-900/20'
              }`}>
                {transaction.type === 'income' ? (
                  <ArrowUpCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <ArrowDownCircle className="h-5 w-5 text-red-600" />
                )}
              </div>

              {/* Transaction Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {transaction.description}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(transaction.date)}</span>
                      <span>•</span>
                      <span>ID: {transaction.id}</span>
                      <span>•</span>
                      <Badge variant="outline" className="text-xs">
                        {transaction.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <p className={`text-sm font-semibold ${
                      transaction.type === 'income' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </p>
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>

                {/* Recorded By & Actions */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="text-xs bg-gray-200 dark:bg-gray-700">
                        {getUserInitials(transaction.recordedBy)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      Dicatat oleh {transaction.recordedBy}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <FileText className="h-3 w-3" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-3 w-3 mr-2" />
                          Lihat Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Receipt className="h-3 w-3 mr-2" />
                          Download Bukti
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="h-3 w-3 mr-2" />
                          Edit Transaksi
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* View All Button */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              Lihat Semua Transaksi
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}