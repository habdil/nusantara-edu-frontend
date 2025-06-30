"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// Dummy data berdasarkan ERD school_finances dan financial_transactions
const budgetData = [
  { category: "Operasional", budget: 145000000, used: 68500000, remaining: 76500000 },
  { category: "Pemeliharaan", budget: 85000000, used: 55000000, remaining: 30000000 },
  { category: "Pembelajaran", budget: 120000000, used: 89000000, remaining: 31000000 },
  { category: "Sarana Prasarana", budget: 200000000, used: 145000000, remaining: 55000000 },
  { category: "Kegiatan Siswa", budget: 50000000, used: 32000000, remaining: 18000000 },
];

const monthlyExpenseData = [
  { month: "Jan", operasional: 12000000, pemeliharaan: 8000000, pembelajaran: 15000000, sarana: 20000000 },
  { month: "Feb", operasional: 11500000, pemeliharaan: 6500000, pembelajaran: 14000000, sarana: 18000000 },
  { month: "Mar", operasional: 13000000, pemeliharaan: 9000000, pembelajaran: 16000000, sarana: 22000000 },
  { month: "Apr", operasional: 12500000, pemeliharaan: 7500000, pembelajaran: 15500000, sarana: 19000000 },
  { month: "Mei", operasional: 11000000, pemeliharaan: 8500000, pembelajaran: 14500000, sarana: 21000000 },
  { month: "Jun", operasional: 12800000, pemeliharaan: 7000000, pembelajaran: 15800000, sarana: 17500000 },
];

const budgetPieData = budgetData.map(item => ({
  name: item.category,
  value: item.used,
  budget: item.budget,
  percentage: Math.round((item.used / item.budget) * 100),
}));

const COLORS = ["#3b82f6", "#ef4444", "#22c55e", "#f97316", "#8b5cf6"];

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
            {`${entry.dataKey}: ${formatCurrency(entry.value)}`}
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

export function FinancialOverview() {
  const totalBudget = budgetData.reduce((sum, item) => sum + item.budget, 0);
  const totalUsed = budgetData.reduce((sum, item) => sum + item.used, 0);
  const totalRemaining = totalBudget - totalUsed;
  const usagePercentage = Math.round((totalUsed / totalBudget) * 100);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Ringkasan Anggaran</CardTitle>
            <CardDescription>
              Periode: Mei 2024 • Total Budget: {formatCurrency(totalBudget)}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
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
              </div>
              
              {/* Budget Progress */}
              <div className="space-y-4">
                {budgetData.map((item, index) => {
                  const percentage = Math.round((item.used / item.budget) * 100);
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
                })}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="monthly-trend">
            <div className="h-80">
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
                    tickFormatter={(value) => `${value / 1000000}M`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="operasional" stackId="a" fill={COLORS[0]} name="Operasional" />
                  <Bar dataKey="pemeliharaan" stackId="a" fill={COLORS[1]} name="Pemeliharaan" />
                  <Bar dataKey="pembelajaran" stackId="a" fill={COLORS[2]} name="Pembelajaran" />
                  <Bar dataKey="sarana" stackId="a" fill={COLORS[3]} name="Sarana Prasarana" />
                </BarChart>
              </ResponsiveContainer>
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
      </CardContent>
    </Card>
  );
}