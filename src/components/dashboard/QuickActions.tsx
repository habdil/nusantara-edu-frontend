"use client";

import { 
  Plus, 
  FileText, 
  Download, 
  Upload, 
  Calculator, 
  Users, 
  Calendar,
  MessageSquare,
  Bell,
  Settings,
  BarChart3,
  Clock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Quick action items berdasarkan fitur NusantaraEdu
const quickActions = [
  {
    id: 1,
    title: "Input Nilai Siswa",
    description: "Tambah nilai ujian atau tugas",
    icon: Plus,
    color: "blue",
    urgency: false,
    path: "/dashboard/academic/grades/input",
  },
  {
    id: 2,
    title: "Buat Laporan",
    description: "Generate laporan otomatis",
    icon: FileText,
    color: "green",
    urgency: false,
    path: "/dashboard/reports/create",
  },
  {
    id: 3,
    title: "Rekap Absensi",
    description: "Lihat rekap kehadiran hari ini",
    icon: Clock,
    color: "purple",
    urgency: true,
    badge: "Hari ini",
    path: "/dashboard/attendance/daily",
  },
  {
    id: 4,
    title: "Transaksi Keuangan",
    description: "Input pengeluaran/pemasukan",
    icon: Calculator,
    color: "orange",
    urgency: false,
    path: "/dashboard/management/transactions/input",
  },
  {
    id: 5,
    title: "Evaluasi Guru",
    description: "Isi form evaluasi kinerja",
    icon: Users,
    color: "red",
    urgency: true,
    badge: "3 pending",
    path: "/dashboard/teachers/evaluation",
  },
  {
    id: 6,
    title: "Jadwal Kegiatan",
    description: "Lihat jadwal hari ini",
    icon: Calendar,
    color: "blue",
    urgency: false,
    path: "/dashboard/schedule",
  },
  {
    id: 7,
    title: "Chat AI Assistant",
    description: "Tanya AI tentang sekolah",
    icon: MessageSquare,
    color: "purple",
    urgency: false,
    path: "/dashboard/ai/assistant",
  },
  {
    id: 8,
    title: "Export Data",
    description: "Download data dalam Excel",
    icon: Download,
    color: "green",
    urgency: false,
    path: "/dashboard/export",
  },
  {
    id: 9,
    title: "Import Data",
    description: "Upload data dari Excel",
    icon: Upload,
    color: "blue",
    urgency: false,
    path: "/dashboard/import",
  },
  {
    id: 10,
    title: "Analisis KPI",
    description: "Lihat dashboard KPI",
    icon: BarChart3,
    color: "orange",
    urgency: false,
    path: "/dashboard/kpi",
  },
  {
    id: 11,
    title: "Notifikasi",
    description: "Pesan dan pengumuman",
    icon: Bell,
    color: "red",
    urgency: true,
    badge: "12 baru",
    path: "/dashboard/notifications",
  },
  {
    id: 12,
    title: "Pengaturan",
    description: "Konfigurasi sistem",
    icon: Settings,
    color: "gray",
    urgency: false,
    path: "/dashboard/settings",
  },
];

const colorClasses = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/20",
    text: "text-blue-600 dark:text-blue-400",
    hover: "hover:bg-blue-100 dark:hover:bg-blue-950/30",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-950/20",
    text: "text-green-600 dark:text-green-400",
    hover: "hover:bg-green-100 dark:hover:bg-green-950/30",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/20",
    text: "text-purple-600 dark:text-purple-400",
    hover: "hover:bg-purple-100 dark:hover:bg-purple-950/30",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-950/20",
    text: "text-orange-600 dark:text-orange-400",
    hover: "hover:bg-orange-100 dark:hover:bg-orange-950/30",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-950/20",
    text: "text-red-600 dark:text-red-400",
    hover: "hover:bg-red-100 dark:hover:bg-red-950/30",
  },
  gray: {
    bg: "bg-gray-50 dark:bg-gray-950/20",
    text: "text-gray-600 dark:text-gray-400",
    hover: "hover:bg-gray-100 dark:hover:bg-gray-950/30",
  },
};

export function QuickActions() {
  const urgentActions = quickActions.filter(action => action.urgency).length;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Aksi Cepat</CardTitle>
            <CardDescription>
              Shortcut untuk tugas sehari-hari
            </CardDescription>
          </div>
          {urgentActions > 0 && (
            <Badge variant="destructive" className="text-sm">
              {urgentActions} urgent
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => {
            const colorClass = colorClasses[action.color as keyof typeof colorClasses];
            
            return (
              <Button
                key={action.id}
                variant="ghost"
                className={`
                  relative h-auto p-3 flex flex-col items-start text-left 
                  ${colorClass.bg} ${colorClass.hover} 
                  border border-gray-200 dark:border-gray-700
                  transition-all duration-200 hover:shadow-sm
                `}
                onClick={() => {
                  // Navigate to the specified path
                  console.log(`Navigate to: ${action.path}`);
                }}
              >
                {/* Urgent indicator */}
                {action.urgency && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                )}
                
                <div className="flex items-center gap-2 mb-1 w-full">
                  <action.icon className={`h-4 w-4 ${colorClass.text} flex-shrink-0`} />
                  <span className="font-medium text-sm text-gray-900 dark:text-white truncate">
                    {action.title}
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {action.description}
                </p>
                
                {action.badge && (
                  <Badge 
                    variant={action.urgency ? "destructive" : "secondary"}
                    className="text-xs self-start"
                  >
                    {action.badge}
                  </Badge>
                )}
              </Button>
            );
          })}
        </div>
        
        {/* Show more actions button */}
        <div className="mt-4 pt-4 border-t">
          <Button variant="outline" className="w-full text-sm">
            Lihat Semua Aksi
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}