import type { SchoolFinance, FinancialTransaction } from "@/types/resources"

const mockBudgets: SchoolFinance[] = [
  {
    id: 1,
    schoolId: 1,
    budgetYear: "2024",
    period: "Semester 1",
    budgetCategory: "Operasional",
    budgetAmount: 50000000,
    usedAmount: 32000000,
    remainingAmount: 18000000,
    notes: "Anggaran operasional semester 1",
    approvalStatus: true,
    approvedBy: 1,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-06-01"),
  },
  {
    id: 2,
    schoolId: 1,
    budgetYear: "2024",
    period: "Semester 1",
    budgetCategory: "Sarana Prasarana",
    budgetAmount: 75000000,
    usedAmount: 45000000,
    remainingAmount: 30000000,
    notes: "Anggaran untuk pembelian dan pemeliharaan sarana prasarana",
    approvalStatus: true,
    approvedBy: 1,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-06-01"),
  },
  {
    id: 3,
    schoolId: 1,
    budgetYear: "2024",
    period: "Semester 1",
    budgetCategory: "Pengembangan SDM",
    budgetAmount: 25000000,
    usedAmount: 15000000,
    remainingAmount: 10000000,
    notes: "Anggaran untuk pelatihan dan pengembangan guru",
    approvalStatus: true,
    approvedBy: 1,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-06-01"),
  },
]

const mockTransactions: FinancialTransaction[] = [
  {
    id: 1,
    schoolFinanceId: 1,
    transactionDate: new Date("2024-02-15"),
    transactionType: "Expense",
    amount: 5000000,
    description: "Pembelian alat tulis kantor",
    category: "Operasional",
    vendor: "CV. Alat Tulis Jaya",
    receiptNumber: "RCP-001-2024",
    approvalStatus: "approved",
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15"),
  },
  {
    id: 2,
    schoolFinanceId: 2,
    transactionDate: new Date("2024-03-10"),
    transactionType: "Expense",
    amount: 8500000,
    description: "Pembelian laptop untuk administrasi",
    category: "Sarana Prasarana",
    vendor: "PT. Teknologi Maju",
    receiptNumber: "RCP-002-2024",
    approvalStatus: "approved",
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-03-10"),
  },
  {
    id: 3,
    schoolFinanceId: 3,
    transactionDate: new Date("2024-04-05"),
    transactionType: "Expense",
    amount: 3000000,
    description: "Pelatihan guru matematika",
    category: "Pengembangan SDM",
    vendor: "Lembaga Pelatihan Edukatif",
    receiptNumber: "RCP-003-2024",
    approvalStatus: "approved",
    createdAt: new Date("2024-04-05"),
    updatedAt: new Date("2024-04-05"),
  },
]

export const budgetApi = {
  // Get all budgets
  getBudgets: async (): Promise<SchoolFinance[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return mockBudgets
  },

  // Get budget by ID
  getBudgetById: async (id: number): Promise<SchoolFinance | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockBudgets.find((budget) => budget.id === id) || null
  },

  // Get budgets by category
  getBudgetsByCategory: async (category: string): Promise<SchoolFinance[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return mockBudgets.filter((budget) => budget.budgetCategory === category)
  },

  // Get transactions
  getTransactions: async (): Promise<FinancialTransaction[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return mockTransactions
  },

  // Get transactions by budget ID
  getTransactionsByBudgetId: async (budgetId: number): Promise<FinancialTransaction[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return mockTransactions.filter((transaction) => transaction.schoolFinanceId === budgetId)
  },

  // Add new budget
  addBudget: async (budget: Omit<SchoolFinance, "id" | "createdAt" | "updatedAt">): Promise<SchoolFinance> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newBudget: SchoolFinance = {
      ...budget,
      id: mockBudgets.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockBudgets.push(newBudget)
    return newBudget
  },

  // Update budget
  updateBudget: async (id: number, updates: Partial<SchoolFinance>): Promise<SchoolFinance | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const index = mockBudgets.findIndex((budget) => budget.id === id)
    if (index === -1) return null

    mockBudgets[index] = { ...mockBudgets[index], ...updates, updatedAt: new Date() }
    return mockBudgets[index]
  },
}
