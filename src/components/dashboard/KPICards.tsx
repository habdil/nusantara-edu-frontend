"use client";

import { Users, GraduationCap, TrendingUp, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Dummy data sesuai ERD NusantaraEdu
const kpiData = [
  {
    title: "Total Siswa",
    value: "1,248",
    subtitle: "siswa terdaftar",
    change: "+12 dari bulan lalu",
    changeType: "positive" as const,
    icon: Users,
    color: "blue",
  },
  {
    title: "Rata-rata Kehadiran",
    value: "94.2%",
    subtitle: "tingkat kehadiran",
    change: "+2.3% dari bulan lalu",
    changeType: "positive" as const,
    icon: CheckCircle,
    color: "green",
  },
  {
    title: "Rata-rata Nilai",
    value: "81.5",
    subtitle: "nilai akademik keseluruhan",
    change: "+3.2 dari semester lalu",
    changeType: "positive" as const,
    icon: GraduationCap,
    color: "purple",
  },
  {
    title: "Tingkat Kelulusan",
    value: "98.7%",
    subtitle: "siswa lulus ujian",
    change: "Sesuai target nasional",
    changeType: "neutral" as const,
    icon: TrendingUp,
    color: "orange",
  },
];

const colorClasses = {
  blue: {
    bg: "bg-blue-500",
    text: "text-blue-600",
    bgLight: "bg-blue-50 dark:bg-blue-950/20",
  },
  green: {
    bg: "bg-green-500",
    text: "text-green-600",
    bgLight: "bg-green-50 dark:bg-green-950/20",
  },
  purple: {
    bg: "bg-purple-500",
    text: "text-purple-600",
    bgLight: "bg-purple-50 dark:bg-purple-950/20",
  },
  orange: {
    bg: "bg-orange-500",
    text: "text-orange-600",
    bgLight: "bg-orange-50 dark:bg-orange-950/20",
  },
};

export function KPICards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi, index) => {
        const colorClass = colorClasses[kpi.color as keyof typeof colorClasses];
        
        return (
          <Card key={index} className="transition-all duration-200 hover:shadow-md border-l-4 border-l-transparent hover:border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${colorClass.bgLight}`}>
                <kpi.icon className={`h-4 w-4 ${colorClass.text}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {kpi.value}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {kpi.subtitle}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={kpi.changeType === "positive" ? "secondary" : "outline"}
                    className={`text-xs ${
                      kpi.changeType === "positive" 
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                        : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                    }`}
                  >
                    {kpi.changeType === "positive" && "↗"}
                    {kpi.change}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}