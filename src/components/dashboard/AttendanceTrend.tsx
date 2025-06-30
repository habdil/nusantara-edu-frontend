"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Dummy data untuk tren kehadiran berdasarkan ERD student_attendance dan teacher_attendance
const attendanceData = [
  { month: "Jan", siswa: 92.5, guru: 96.2, target: 95 },
  { month: "Feb", siswa: 94.2, guru: 95.8, target: 95 },
  { month: "Mar", siswa: 91.8, guru: 97.1, target: 95 },
  { month: "Apr", siswa: 95.3, guru: 94.5, target: 95 },
  { month: "Mei", siswa: 93.7, guru: 96.8, target: 95 },
  { month: "Jun", siswa: 96.1, guru: 98.2, target: 95 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-medium">{`Bulan: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {`${entry.dataKey === 'siswa' ? 'Kehadiran Siswa' : 
               entry.dataKey === 'guru' ? 'Kehadiran Guru' : 'Target'}: ${entry.value}%`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function AttendanceTrend() {
  const currentAttendance = {
    siswa: 94.2,
    guru: 96.8,
    target: 95,
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Tren Kehadiran</CardTitle>
            <CardDescription>
              Persentase kehadiran siswa dan guru per bulan
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant={currentAttendance.siswa >= currentAttendance.target ? "secondary" : "destructive"}
              className={currentAttendance.siswa >= currentAttendance.target ? 
                "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : ""
              }
            >
              Siswa: {currentAttendance.siswa}%
            </Badge>
            <Badge 
              variant={currentAttendance.guru >= currentAttendance.target ? "secondary" : "destructive"}
              className={currentAttendance.guru >= currentAttendance.target ? 
                "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : ""
              }
            >
              Guru: {currentAttendance.guru}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={attendanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis 
                dataKey="month" 
                className="text-gray-600 dark:text-gray-400"
                fontSize={12}
              />
              <YAxis 
                domain={[85, 100]}
                className="text-gray-600 dark:text-gray-400"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#94a3b8"
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Target (95%)"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="siswa"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Kehadiran Siswa"
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2, fill: "#fff" }}
              />
              <Line
                type="monotone"
                dataKey="guru"
                stroke="#10b981"
                strokeWidth={3}
                name="Kehadiran Guru"
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2, fill: "#fff" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Summary Stats */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Rata-rata Siswa</p>
            <p className="text-lg font-semibold text-blue-600">94.2%</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Rata-rata Guru</p>
            <p className="text-lg font-semibold text-green-600">96.4%</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Target Nasional</p>
            <p className="text-lg font-semibold text-gray-600">95.0%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}