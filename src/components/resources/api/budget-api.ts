import type { SchoolFinance, FinancialTransaction } from "@/types/resources"
import { apiClient } from "@/services/api"
import type { ApiResponse } from "@/services/api/types"

// Base URL for the API - menggunakan environment variable yang sama
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'

export const budgetApi = {
  // Get all budgets
  getBudgets: async (params?: {
    budgetYear?: string
    period?: string
    budgetCategory?: string
    page?: number
    limit?: number
  }): Promise<SchoolFinance[]> => {
    try {
      const response: ApiResponse<SchoolFinance[]> = await apiClient.get(`${API_BASE_URL}/api/finance/budgets`, {
        params,
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil data anggaran")
      }

      return response.data
    } catch (error: any) {
      console.error('Error fetching budgets:', error)
      throw error
    }
  },

  // Get budget by ID
  getBudgetById: async (id: number): Promise<SchoolFinance | null> => {
    try {
      const response: ApiResponse<SchoolFinance> = await apiClient.get(`${API_BASE_URL}/api/finance/budgets/${id}`, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil data anggaran")
      }

      return response.data
    } catch (error: any) {
      if (error.message?.includes('404')) {
        return null
      }
      console.error('Error fetching budget by ID:', error)
      throw error
    }
  },

  // Get budgets by category
  getBudgetsByCategory: async (category: string): Promise<SchoolFinance[]> => {
    try {
      const response: ApiResponse<SchoolFinance[]> = await apiClient.get(`${API_BASE_URL}/api/finance/budgets/category/${encodeURIComponent(category)}`, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil data anggaran berdasarkan kategori")
      }

      return response.data
    } catch (error: any) {
      console.error('Error fetching budgets by category:', error)
      throw error
    }
  },

  // Get transactions
  getTransactions: async (params?: {
    schoolFinanceId?: number
    transactionType?: string
    dateFrom?: string
    dateTo?: string
    page?: number
    limit?: number
  }): Promise<FinancialTransaction[]> => {
    try {
      const response: ApiResponse<FinancialTransaction[]> = await apiClient.get(`${API_BASE_URL}/api/finance/transactions`, {
        params,
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil data transaksi")
      }

      return response.data
    } catch (error: any) {
      console.error('Error fetching transactions:', error)
      throw error
    }
  },

  // Get transactions by budget ID
  getTransactionsByBudgetId: async (budgetId: number): Promise<FinancialTransaction[]> => {
    try {
      const response: ApiResponse<FinancialTransaction[]> = await apiClient.get(`${API_BASE_URL}/api/finance/budgets/${budgetId}/transactions`, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil data transaksi berdasarkan anggaran")
      }

      return response.data
    } catch (error: any) {
      console.error('Error fetching transactions by budget ID:', error)
      throw error
    }
  },

  // Add new budget
  addBudget: async (budget: Omit<SchoolFinance, "id" | "createdAt" | "updatedAt">): Promise<SchoolFinance> => {
    try {
      // Transform frontend format to backend format
      const backendBudget = {
        budgetYear: budget.budgetYear,
        period: budget.period,
        budgetCategory: budget.budgetCategory,
        budgetAmount: budget.budgetAmount,
        notes: budget.notes
      }

      const response: ApiResponse<SchoolFinance> = await apiClient.post(`${API_BASE_URL}/api/finance/budgets`, backendBudget, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal menambahkan anggaran")
      }

      return response.data
    } catch (error: any) {
      console.error('Error adding budget:', error)
      throw error
    }
  },

  // Update budget
  updateBudget: async (id: number, updates: Partial<SchoolFinance>): Promise<SchoolFinance | null> => {
    try {
      // Transform frontend format to backend format
      const backendUpdates: any = {}
      if (updates.budgetAmount !== undefined) backendUpdates.budgetAmount = updates.budgetAmount
      if (updates.notes !== undefined) backendUpdates.notes = updates.notes

      const response: ApiResponse<SchoolFinance> = await apiClient.put(`${API_BASE_URL}/api/finance/budgets/${id}`, backendUpdates, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal memperbarui anggaran")
      }

      return response.data
    } catch (error: any) {
      if (error.message?.includes('404')) {
        return null
      }
      console.error('Error updating budget:', error)
      throw error
    }
  },

  // Add new transaction
  addTransaction: async (transaction: Omit<FinancialTransaction, "id" | "createdAt" | "updatedAt">): Promise<FinancialTransaction> => {
    try {
      // Transform frontend format to backend format
      const backendTransaction = {
        schoolFinanceId: transaction.schoolFinanceId,
        transactionDate: transaction.transactionDate,
        transactionType: transaction.transactionType.toLowerCase(), // Backend expects lowercase
        amount: transaction.amount,
        description: transaction.description,
        transactionCategory: transaction.category,
        transactionProof: transaction.receiptNumber // Map receiptNumber to transactionProof
      }

      const response: ApiResponse<FinancialTransaction> = await apiClient.post(`${API_BASE_URL}/api/finance/transactions`, backendTransaction, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal menambahkan transaksi")
      }

      return response.data
    } catch (error: any) {
      console.error('Error adding transaction:', error)
      throw error
    }
  },

  // Approve budget
  approveBudget: async (id: number): Promise<SchoolFinance> => {
    try {
      const response: ApiResponse<SchoolFinance> = await apiClient.put(`${API_BASE_URL}/api/finance/budgets/${id}/approve`, {}, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal menyetujui anggaran")
      }

      return response.data
    } catch (error: any) {
      console.error('Error approving budget:', error)
      throw error
    }
  },

  // Get budget categories
  getBudgetCategories: async (): Promise<string[]> => {
    try {
      const response: ApiResponse<string[]> = await apiClient.get(`${API_BASE_URL}/api/finance/budgets/categories`, {
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil kategori anggaran")
      }

      return response.data
    } catch (error: any) {
      console.error('Error fetching budget categories:', error)
      throw error
    }
  },

  // Get financial summary
  getFinancialSummary: async (budgetYear?: string): Promise<{
    totalBudget: number
    totalUsed: number
    totalRemaining: number
    budgetByCategory: Array<{
      category: string
      budgetAmount: number
      usedAmount: number
      remainingAmount: number
      usagePercentage: number
    }>
    recentTransactions: FinancialTransaction[]
  }> => {
    try {
      const params = budgetYear ? { budgetYear } : undefined
      const response: ApiResponse<{
        totalBudget: number
        totalUsed: number
        totalRemaining: number
        budgetByCategory: Array<{
          category: string
          budgetAmount: number
          usedAmount: number
          remainingAmount: number
          usagePercentage: number
        }>
        recentTransactions: FinancialTransaction[]
      }> = await apiClient.get(`${API_BASE_URL}/api/finance/summary`, {
        params,
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil ringkasan keuangan")
      }

      return response.data
    } catch (error: any) {
      console.error('Error fetching financial summary:', error)
      throw error
    }
  },

  // Get spending report
  getSpendingReport: async (params?: {
    budgetYear?: string
    period?: string
  }): Promise<Array<{
    budgetCategory: string
    budgetAmount: number
    usedAmount: number
    remainingAmount: number
    spendingPercentage: number
    status: string
  }>> => {
    try {
      const response: ApiResponse<Array<{
        budgetCategory: string
        budgetAmount: number
        usedAmount: number
        remainingAmount: number
        spendingPercentage: number
        status: string
      }>> = await apiClient.get(`${API_BASE_URL}/api/finance/spending-report`, {
        params,
        requireAuth: true,
      })

      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil laporan pengeluaran")
      }

      return response.data
    } catch (error: any) {
      console.error('Error fetching spending report:', error)
      throw error
    }
  },
}