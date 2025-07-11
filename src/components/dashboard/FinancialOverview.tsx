"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { budgetApi } from "@/components/resources/api/budget-api";
import type { SchoolFinance, FinancialTransaction } from "@/types/resources";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Interfaces for transformed data
interface BudgetData {
  category: string;
  budget: number;
  used: number;
  remaining: number;
}

interface MonthlyExpenseData {
  month: string;
  [key: string]: number | string;
}

interface FinancialSummaryData {
  totalBudget: number;
  totalUsed: number;
  totalRemaining: number;
  budgetByCategory: Array<{
    category: string;
    budgetAmount: number;
    usedAmount: number;
    remainingAmount: number;
    usagePercentage: number;
  }>;
  recentTransactions: FinancialTransaction[];
}

const COLORS = ["#3b82f6", "#ef4444", "#22c55e", "#f97316", "#8b5cf6", "#06b6d4", "#84cc16"];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {`${entry.name || entry.dataKey}: ${formatCurrency(entry.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-medium">{data.name}</p>
        <p className="text-sm text-blue-600">Terpakai: {formatCurrency(data.value)}</p>
        <p className="text-sm text-gray-600">Budget: {formatCurrency(data.budget)}</p>
        <p className="text-sm text-green-600">Persentase: {data.percentage}%</p>
      </div>
    );
  }
  return null;
};

// Helper function to transform transactions to monthly expense data
const transformToMonthlyExpense = (transactions: FinancialTransaction[]): MonthlyExpenseData[] => {
  const monthlyData: { [key: string]: { [category: string]: number } } = {};
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  
  // Definisikan kategori default
  const defaultCategories = ['Operasional', 'Material', 'Fasilitas', 'Lainnya'];

  // Initialize months with default categories
  monthNames.forEach(month => {
    monthlyData[month] = {};
    defaultCategories.forEach(category => {
      monthlyData[month][category] = 0;
    });
  });

  // Group transactions by month and category
  transactions.forEach(transaction => {
    if (transaction.transactionType?.toLowerCase() === 'expense') {
      const date = new Date(transaction.transactionDate);
      const monthIndex = date.getMonth();
      const monthName = monthNames[monthIndex];
      const category = transaction.category || 'Lainnya';
      
      // Pastikan kategori ada dalam monthlyData[monthName]
      if (!monthlyData[monthName][category]) {
        monthlyData[monthName][category] = 0;
      }
      monthlyData[monthName][category] += transaction.amount;
    }
  });

  // Transform to chart format
  return monthNames.map(month => {
    const monthData: MonthlyExpenseData = { month };
    Object.keys(monthlyData[month]).forEach(category => {
      monthData[category] = monthlyData[month][category];
    });
    return monthData;
  });
};

export function FinancialOverview() {
  const [financialData, setFinancialData] = useState<FinancialSummaryData | null>(null);
  const [budgetData, setBudgetData] = useState<BudgetData[]>([]);
  const [monthlyExpenseData, setMonthlyExpenseData] = useState<MonthlyExpenseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  const availableYears = ["2025","2024", "2023", "2022"];
  const currentMonth = new Date().toLocaleDateString('id-ID', { month: 'long' });

  const fetchFinancialData = async () => {
    try {
      setError(null);
      setRefreshing(true);

      // Fetch financial summary (primary data source)
      const summary = await budgetApi.getFinancialSummary(selectedYear);
      setFinancialData(summary);

      // Transform budget data for charts
      const transformedBudgetData: BudgetData[] = summary.budgetByCategory.map(item => ({
        category: item.category,
        budget: item.budgetAmount,
        used: item.usedAmount,
        remaining: item.remainingAmount
      }));
      setBudgetData(transformedBudgetData);

      // Fetch transactions for monthly trend
      try {
        const transactions = await budgetApi.getTransactions({
          dateFrom: `${selectedYear}-01-01`,
          dateTo: `${selectedYear}-12-31`
        });
        
        const monthlyData = transformToMonthlyExpense(transactions);
        setMonthlyExpenseData(monthlyData);
      } catch (transactionError) {
        console.warn('Could not fetch transaction data for monthly trend:', transactionError);
        setMonthlyExpenseData([]);
      }

    } catch (err: any) {
      console.error('Error fetching financial data:', err);
      setError(err.message || 'Gagal memuat data keuangan');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, [selectedYear]);

  // Calculate summary values
  const totalBudget = financialData?.totalBudget || 0;
  const totalUsed = financialData?.totalUsed || 0;
  const totalRemaining = financialData?.totalRemaining || 0;
  const usagePercentage = totalBudget > 0 ? Math.round((totalUsed / totalBudget) * 100) : 0;

  // Transform data for pie chart
  const budgetPieData = budgetData.map((item, index) => ({
    name: item.category,
    value: item.used,
    budget: item.budget,
    percentage: item.budget > 0 ? Math.round((item.used / item.budget) * 100) : 0,
    color: COLORS[index % COLORS.length]
  }));

  // Get unique categories for monthly chart legend
  const expenseCategories = monthlyExpenseData.length > 0 
    ? Object.keys(monthlyExpenseData[0]).filter(key => key !== 'month')
    : [];

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-80" />
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-16" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Error Memuat Data
          </CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchFinancialData} variant="outline" className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Coba Lagi
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Ringkasan Anggaran</CardTitle>
            <CardDescription>
              Periode: Tahun {selectedYear} • Total Budget: {formatCurrency(totalBudget)}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {selectedYear}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {availableYears.map((year) => (
                  <DropdownMenuItem
                    key={year}
                    onClick={() => setSelectedYear(year)}
                  >
                    {year}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              onClick={fetchFinancialData}
              variant="ghost"
              size="sm"
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Badge 
              variant={usagePercentage <= 75 ? "secondary" : usagePercentage <= 90 ? "outline" : "destructive"}
              className={usagePercentage <= 75 ? 
                "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : ""
              }
            >
              Terpakai: {usagePercentage}%
            </Badge>
            <Badge variant="outline">
              Sisa: {formatCurrency(totalRemaining)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="budget-allocation" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="budget-allocation">Alokasi Anggaran</TabsTrigger>
            <TabsTrigger value="monthly-trend">Tren Bulanan</TabsTrigger>
          </TabsList>
          
          <TabsContent value="budget-allocation">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="h-80">
                {budgetPieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={budgetPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {budgetPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<PieTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Tidak ada data anggaran
                  </div>
                )}
              </div>
              
              {/* Budget Progress */}
              <div className="space-y-4">
                {budgetData.length > 0 ? budgetData.map((item, index) => {
                  const percentage = item.budget > 0 ? Math.round((item.used / item.budget) * 100) : 0;
                  return (
                    <div key={item.category} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.category}</span>
                        <span className="text-muted-foreground">{percentage}%</span>
                      </div>
                      <Progress 
                        value={percentage} 
                        className="h-2"
                        style={{
                          "--progress-background": COLORS[index % COLORS.length]
                        } as React.CSSProperties}
                      />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Terpakai: {formatCurrency(item.used)}</span>
                        <span>Sisa: {formatCurrency(item.remaining)}</span>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-center text-muted-foreground py-8">
                    Tidak ada data anggaran tersedia
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="monthly-trend">
            <div className="h-80">
              {monthlyExpenseData.length > 0 && expenseCategories.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyExpenseData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                    <XAxis 
                      dataKey="month" 
                      className="text-gray-600 dark:text-gray-400"
                      fontSize={12}
                    />
                    <YAxis 
                      className="text-gray-600 dark:text-gray-400"
                      fontSize={12}
                      tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    {expenseCategories.map((category, index) => (
                      <Bar 
                        key={category}
                        dataKey={category} 
                        stackId="a" 
                        fill={COLORS[index % COLORS.length]} 
                        name={category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Tidak ada data transaksi untuk tren bulanan
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Financial Summary */}
        <div className="mt-6 grid grid-cols-4 gap-4 text-center border-t pt-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Budget</p>
            <p className="text-lg font-semibold text-blue-600">{formatCurrency(totalBudget)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Terpakai</p>
            <p className="text-lg font-semibold text-red-600">{formatCurrency(totalUsed)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Sisa Budget</p>
            <p className="text-lg font-semibold text-green-600">{formatCurrency(totalRemaining)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Efisiensi</p>
            <p className={`text-lg font-semibold ${usagePercentage <= 75 ? 'text-green-600' : usagePercentage <= 90 ? 'text-yellow-600' : 'text-red-600'}`}>
              {usagePercentage}%
            </p>
          </div>
        </div>

        {/* Recent Transactions Preview */}
        {financialData?.recentTransactions && financialData.recentTransactions.length > 0 && (
          <div className="mt-6 border-t pt-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Transaksi Terbaru</h4>
            <div className="space-y-2">
              {financialData.recentTransactions.slice(0, 3).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between text-sm">
                  <div className="flex-1">
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.transactionDate).toLocaleDateString('id-ID')} • {transaction.category}
                    </p>
                  </div>
                  <span className={`font-medium ${transaction.transactionType?.toLowerCase() === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                    {transaction.transactionType?.toLowerCase() === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}