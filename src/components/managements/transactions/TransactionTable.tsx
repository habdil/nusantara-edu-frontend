// src/components/managements/transactions/TransactionTable.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Eye,
  FileText,
  MoreHorizontal
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Data transaksi sesuai ERD
const transactions = [
  {
    id: "TR-001",
    date: "2024-05-20",
    description: "Pembayaran Gaji Guru Mei 2024",
    category: "Operasional",
    type: "expense",
    amount: 45000000,
    status: "completed",
    recordedBy: "Habdil Iqrawardana"
  },
  {
    id: "TR-002",
    date: "2024-05-19", 
    description: "Dana BOS Triwulan II",
    category: "Pendidikan",
    type: "income",
    amount: 120000000,
    status: "completed",
    recordedBy: "Rayan Mar'i"
  },
  {
    id: "TR-003",
    date: "2024-05-18",
    description: "Pembelian Alat Tulis Kantor",
    category: "Sarana Prasarana", 
    type: "expense",
    amount: 2500000,
    status: "pending",
    recordedBy: "Muhammad Faiz"
  },
  {
    id: "TR-004",
    date: "2024-05-17",
    description: "Service AC Ruang Kelas",
    category: "Pemeliharaan",
    type: "expense", 
    amount: 3200000,
    status: "completed",
    recordedBy: "Naufal Rizqy"
  },
  {
    id: "TR-005",
    date: "2024-05-16",
    description: "Sumbangan Komite Sekolah",
    category: "Operasional",
    type: "income",
    amount: 15000000,
    status: "completed", 
    recordedBy: "Rezki Haikal"
  }
]

export function TransactionTable() {
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
          <CardTitle className="text-lg font-semibold">
            Daftar Transaksi
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {transactions.length} Transaksi
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 py-3 px-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm font-medium text-muted-foreground">
            <div className="col-span-2">ID & Tanggal</div>
            <div className="col-span-3">Deskripsi</div>
            <div className="col-span-2">Kategori</div>
            <div className="col-span-2">Jumlah</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Aksi</div>
          </div>

          {/* Table Body */}
          {transactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="grid grid-cols-12 gap-4 py-4 px-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              {/* ID & Date */}
              <div className="col-span-2 space-y-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {transaction.id}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(transaction.date)}
                </p>
              </div>

              {/* Description */}
              <div className="col-span-3 space-y-1">
                <div className="flex items-center space-x-2">
                  {transaction.type === 'income' ? (
                    <ArrowUpCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownCircle className="h-4 w-4 text-red-600" />
                  )}
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {transaction.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-xs bg-gray-200 dark:bg-gray-700">
                      {getUserInitials(transaction.recordedBy)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground">
                    {transaction.recordedBy}
                  </span>
                </div>
              </div>

              {/* Category */}
              <div className="col-span-2">
                <Badge variant="outline" className="text-xs">
                  {transaction.category}
                </Badge>
              </div>

              {/* Amount */}
              <div className="col-span-2">
                <p className={`text-sm font-semibold ${
                  transaction.type === 'income' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
              </div>

              {/* Status */}
              <div className="col-span-2">
                {getStatusBadge(transaction.status)}
              </div>

              {/* Actions */}
              <div className="col-span-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      Lihat Detail
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="h-4 w-4 mr-2" />
                      Download Bukti
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-muted-foreground">
              Menampilkan 1-5 dari {transactions.length} transaksi
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}