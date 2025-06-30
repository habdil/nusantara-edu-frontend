"use client";

import { AlertTriangle, AlertCircle, Clock, DollarSign, Users, BookOpen, Building } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// Dummy data berdasarkan ERD early_warnings
const warningsData = [
  {
    id: 1,
    category: "attendance",
    title: "Tingkat Absensi Menurun",
    description: "Kehadiran siswa kelas 3A turun 15% dalam 2 minggu terakhir",
    urgency: "high",
    detectedDate: "2024-06-20",
    targetValue: 95,
    actualValue: 80,
    icon: Users,
    color: "red",
  },
  {
    id: 2,
    category: "academic",
    title: "Nilai Matematika Rendah",
    description: "Rata-rata nilai matematika kelas 5B di bawah standar nasional",
    urgency: "medium",
    detectedDate: "2024-06-19",
    targetValue: 75,
    actualValue: 68,
    icon: BookOpen,
    color: "yellow",
  },
  {
    id: 3,
    category: "financial",
    title: "Anggaran Pemeliharaan Menipis",
    description: "Sisa anggaran pemeliharaan hanya 20% dari total alokasi",
    urgency: "high",
    detectedDate: "2024-06-18",
    targetValue: 50,
    actualValue: 20,
    icon: DollarSign,
    color: "red",
  },
  {
    id: 4,
    category: "asset",
    title: "Perawatan AC Ruang Kelas",
    description: "3 unit AC memerlukan perawatan segera",
    urgency: "medium",
    detectedDate: "2024-06-17",
    targetValue: 0,
    actualValue: 3,
    icon: Building,
    color: "yellow",
  },
  {
    id: 5,
    category: "teacher",
    title: "Evaluasi Kinerja Tertunda",
    description: "5 guru belum menyelesaikan evaluasi kinerja semester",
    urgency: "low",
    detectedDate: "2024-06-16",
    targetValue: 0,
    actualValue: 5,
    icon: Users,
    color: "blue",
  },
  {
    id: 6,
    category: "deadline",
    title: "Laporan Dinas Pending",
    description: "Laporan bulanan ke Dinas Pendidikan jatuh tempo 3 hari lagi",
    urgency: "critical",
    detectedDate: "2024-06-21",
    targetValue: 7,
    actualValue: 3,
    icon: Clock,
    color: "red",
  },
  {
    id: 7,
    category: "system",
    title: "Backup Data Gagal",
    description: "Proses backup otomatis gagal 2 hari berturut-turut",
    urgency: "high",
    detectedDate: "2024-06-20",
    targetValue: 0,
    actualValue: 2,
    icon: AlertCircle,
    color: "red",
  },
];

const urgencyConfig = {
  critical: {
    label: "Kritis",
    color: "bg-red-600 text-white",
    icon: AlertTriangle,
  },
  high: {
    label: "Tinggi",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    icon: AlertTriangle,
  },
  medium: {
    label: "Sedang", 
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    icon: AlertCircle,
  },
  low: {
    label: "Rendah",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    icon: AlertCircle,
  },
};

const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return "1 hari yang lalu";
  if (diffDays <= 7) return `${diffDays} hari yang lalu`;
  if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} minggu yang lalu`;
  return `${Math.ceil(diffDays / 30)} bulan yang lalu`;
};

export function EarlyWarnings() {
  const criticalWarnings = warningsData.filter(w => w.urgency === "critical").length;
  const highWarnings = warningsData.filter(w => w.urgency === "high").length;
  const totalWarnings = warningsData.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Peringatan Dini
            </CardTitle>
            <CardDescription>
              Sistem deteksi otomatis untuk identifikasi masalah
            </CardDescription>
          </div>
          <Badge variant="destructive" className="text-sm">
            {totalWarnings} peringatan
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 bg-red-50 dark:bg-red-950/20 rounded-lg">
            <p className="text-lg font-bold text-red-600">{criticalWarnings}</p>
            <p className="text-xs text-muted-foreground">Kritis</p>
          </div>
          <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
            <p className="text-lg font-bold text-yellow-600">{highWarnings}</p>
            <p className="text-xs text-muted-foreground">Tinggi</p>
          </div>
          <div className="text-center p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <p className="text-lg font-bold text-blue-600">{totalWarnings}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
        </div>

        {/* Warnings List */}
        <ScrollArea className="h-80">
          <div className="space-y-3">
            {warningsData.map((warning) => {
              const urgencyInfo = urgencyConfig[warning.urgency as keyof typeof urgencyConfig];
              const UrgencyIcon = urgencyInfo.icon;
              
              return (
                <div
                  key={warning.id}
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${
                        warning.urgency === 'critical' ? 'bg-red-100 dark:bg-red-950/20' :
                        warning.urgency === 'high' ? 'bg-red-50 dark:bg-red-950/10' :
                        warning.urgency === 'medium' ? 'bg-yellow-50 dark:bg-yellow-950/20' :
                        'bg-blue-50 dark:bg-blue-950/20'
                      }`}>
                        <warning.icon className={`h-4 w-4 ${
                          warning.urgency === 'critical' ? 'text-red-600' :
                          warning.urgency === 'high' ? 'text-red-500' :
                          warning.urgency === 'medium' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                            {warning.title}
                          </h4>
                          <Badge className={`text-xs ${urgencyInfo.color}`}>
                            {urgencyInfo.label}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {warning.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {getRelativeTime(warning.detectedDate)}
                          </span>
                          {warning.targetValue !== undefined && warning.actualValue !== undefined && (
                            <span className={`font-medium ${
                              warning.actualValue < warning.targetValue ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {warning.actualValue}
                              {warning.category === 'financial' || warning.category === 'attendance' ? '%' : ''}
                              {warning.targetValue > 0 && ` / ${warning.targetValue}`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        
        {/* Action Button */}
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full text-sm">
            Lihat Semua Peringatan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}