"use client";

import { 
  Clock, 
  User, 
  FileText, 
  DollarSign, 
  Users, 
  BookOpen, 
  Settings,
  AlertTriangle,
  CheckCircle,
  Upload,
  Download,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "../ui/button";

// Dummy data berdasarkan ERD activity_logs
const recentActivities = [
  {
    id: 1,
    userId: 1,
    userName: "Budi Santoso",
    userRole: "Kepala Sekolah",
    activity: "Export laporan akademik semester 1",
    description: "Mengunduh laporan nilai siswa kelas 1-6 periode Januari-Juni 2024",
    module: "academic",
    timestamp: "2024-06-25T08:30:00Z",
    icon: Download,
    color: "blue",
    avatar: "BS"
  },
  {
    id: 2,
    userId: 2,
    userName: "Siti Rahayu",
    userRole: "Guru Kelas 3A",
    activity: "Input nilai ulangan matematika",
    description: "Menambahkan 28 nilai ulangan harian matematika untuk kelas 3A",
    module: "academic",
    timestamp: "2024-06-25T07:45:00Z",
    icon: BookOpen,
    color: "green",
    avatar: "SR"
  },
  {
    id: 3,
    userId: 1,
    userName: "Budi Santoso",
    userRole: "Kepala Sekolah",
    activity: "Persetujuan anggaran pemeliharaan",
    description: "Menyetujui pengajuan anggaran pemeliharaan AC ruang kelas sebesar Rp 5.5M",
    module: "financial",
    timestamp: "2024-06-25T07:15:00Z",
    icon: DollarSign,
    color: "orange",
    avatar: "BS"
  },
  {
    id: 4,
    userId: 3,
    userName: "Ahmad Wijaya",
    userRole: "Staff Administrasi",
    activity: "Update data siswa",
    description: "Memperbarui data kontak orang tua untuk 12 siswa kelas 1 dan 2",
    module: "student_management",
    timestamp: "2024-06-25T06:30:00Z",
    icon: Users,
    color: "purple",
    avatar: "AW"
  },
  {
    id: 5,
    userId: 4,
    userName: "Rina Susanti",
    userRole: "Guru Kelas 5B",
    activity: "Evaluasi kinerja selesai",
    description: "Menyelesaikan form evaluasi kinerja semester 1 dengan skor 87/100",
    module: "teacher_evaluation",
    timestamp: "2024-06-24T16:20:00Z",
    icon: CheckCircle,
    color: "green",
    avatar: "RS"
  },
  {
    id: 6,
    userId: 1,
    userName: "Budi Santoso",
    userRole: "Kepala Sekolah",
    activity: "Konfigurasi sistem peringatan",
    description: "Mengatur threshold peringatan dini untuk tingkat kehadiran siswa (< 90%)",
    module: "system_config",
    timestamp: "2024-06-24T15:45:00Z",
    icon: Settings,
    color: "gray",
    avatar: "BS"
  },
  {
    id: 7,
    userId: 5,
    userName: "Dedi Kurniawan",
    userRole: "Staff TU",
    activity: "Upload dokumen inventaris",
    description: "Mengunggah 15 foto dan dokumentasi aset baru untuk inventaris sekolah",
    module: "asset_management",
    timestamp: "2024-06-24T14:30:00Z",
    icon: Upload,
    color: "blue",
    avatar: "DK"
  },
  {
    id: 8,
    userName: "Sistem Otomatis",
    userRole: "System",
    activity: "Backup data harian",
    description: "Proses backup otomatis database sekolah berhasil dilakukan",
    module: "system",
    timestamp: "2024-06-24T02:00:00Z",
    icon: AlertTriangle,
    color: "green",
    avatar: "SYS"
  },
  {
    id: 9,
    userId: 6,
    userName: "Maya Sari",
    userRole: "Guru Kelas 4A",
    activity: "Jadwal remedial dibuat",
    description: "Membuat jadwal remedial IPA untuk 8 siswa yang belum mencapai KKM",
    module: "academic",
    timestamp: "2024-06-24T10:15:00Z",
    icon: Calendar,
    color: "yellow",
    avatar: "MS"
  },
  {
    id: 10,
    userId: 1,
    userName: "Budi Santoso",
    userRole: "Kepala Sekolah",
    activity: "Review laporan keuangan",
    description: "Meninjau laporan penggunaan anggaran bulan Mei 2024",
    module: "financial",
    timestamp: "2024-06-24T09:30:00Z",
    icon: FileText,
    color: "orange",
    avatar: "BS"
  }
];

const colorClasses = {
  blue: "text-blue-600 dark:text-blue-400",
  green: "text-green-600 dark:text-green-400",
  orange: "text-orange-600 dark:text-orange-400",
  purple: "text-purple-600 dark:text-purple-400",
  gray: "text-gray-600 dark:text-gray-400",
  yellow: "text-yellow-600 dark:text-yellow-400",
};

const moduleLabels = {
  academic: "Akademik",
  financial: "Keuangan",
  teacher_evaluation: "Evaluasi Guru",
  student_management: "Data Siswa",
  asset_management: "Aset",
  system_config: "Konfigurasi",
  system: "Sistem",
};

const getRelativeTime = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return "Baru saja";
  if (diffMins < 60) return `${diffMins} menit yang lalu`;
  if (diffHours < 24) return `${diffHours} jam yang lalu`;
  if (diffDays === 1) return "Kemarin";
  return `${diffDays} hari yang lalu`;
};

export function RecentActivities() {
  const todayActivities = recentActivities.filter(activity => {
    const activityDate = new Date(activity.timestamp);
    const today = new Date();
    return activityDate.toDateString() === today.toDateString();
  }).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-600" />
              Aktivitas Terkini
            </CardTitle>
            <CardDescription>
              Log aktivitas pengguna dan sistem
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-sm">
            {todayActivities} hari ini
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-80">
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={activity.id}
                className={`flex items-start gap-3 pb-4 ${
                  index !== recentActivities.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''
                }`}
              >
                {/* Avatar */}
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={`/avatar-${activity.avatar?.toLowerCase()}.jpg`} />
                  <AvatarFallback className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    {activity.avatar}
                  </AvatarFallback>
                </Avatar>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <activity.icon className={`h-4 w-4 ${colorClasses[activity.color as keyof typeof colorClasses]}`} />
                    <span className="font-medium text-sm text-gray-900 dark:text-white truncate">
                      {activity.activity}
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-900 dark:text-white">
                        {activity.userName}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {activity.userRole}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {getRelativeTime(activity.timestamp)}
                    </span>
                  </div>
                  
                  {activity.module && (
                    <div className="mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {moduleLabels[activity.module as keyof typeof moduleLabels] || activity.module}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {/* View all button */}
        <div className="mt-4 pt-4 border-t">
          <Button className="w-full text-sm text-muted-foreground hover:text-gray-900 dark:hover:text-white transition-colors">
            Lihat Semua Aktivitas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}