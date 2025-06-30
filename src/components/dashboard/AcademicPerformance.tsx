"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Dummy data berdasarkan ERD academic_records dan subjects
const academicPerformanceData = [
  { subject: "Matematika", kelas1: 78, kelas2: 82, kelas3: 85, kelas4: 80, kelas5: 88, kelas6: 86 },
  { subject: "Bahasa Indonesia", kelas1: 85, kelas2: 87, kelas3: 89, kelas4: 86, kelas5: 90, kelas6: 89 },
  { subject: "IPA", kelas1: 76, kelas2: 79, kelas3: 83, kelas4: 81, kelas5: 85, kelas6: 87 },
  { subject: "IPS", kelas1: 82, kelas2: 84, kelas3: 86, kelas4: 83, kelas5: 87, kelas6: 88 },
  { subject: "Bahasa Inggris", kelas1: 74, kelas2: 77, kelas3: 81, kelas4: 79, kelas5: 83, kelas6: 85 },
];

const semesterComparisonData = [
  { period: "Semester 1", matematika: 82, bahasaIndonesia: 87, ipa: 81, ips: 85, bahasaInggris: 79 },
  { period: "Semester 2", matematika: 85, bahasaIndonesia: 89, ipa: 83, ips: 86, bahasaInggris: 81 },
  { period: "Target", matematika: 85, bahasaIndonesia: 85, ipa: 85, ips: 85, bahasaInggris: 80 },
];

const gradeColors = {
  kelas1: "#ef4444", // red
  kelas2: "#f97316", // orange
  kelas3: "#eab308", // yellow
  kelas4: "#22c55e", // green
  kelas5: "#3b82f6", // blue
  kelas6: "#8b5cf6", // purple
};

const subjectColors = {
  matematika: "#ef4444",
  bahasaIndonesia: "#3b82f6",
  ipa: "#22c55e",
  ips: "#f97316",
  bahasaInggris: "#8b5cf6",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {`${entry.dataKey}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function AcademicPerformance() {
  const overallAverage = 84.2;
  const nationalAverage = 80.5;
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Performa Akademik</CardTitle>
            <CardDescription>
              Rata-rata nilai siswa per mata pelajaran dan kelas
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant="secondary"
              className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
            >
              Rata-rata: {overallAverage}
            </Badge>
            <Badge 
              variant={overallAverage >= nationalAverage ? "secondary" : "destructive"}
              className={overallAverage >= nationalAverage ? 
                "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : ""
              }
            >
              Target: {nationalAverage}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="by-grade" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="by-grade">Per Kelas</TabsTrigger>
            <TabsTrigger value="by-semester">Per Semester</TabsTrigger>
          </TabsList>
          
          <TabsContent value="by-grade">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={academicPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis 
                    dataKey="subject" 
                    className="text-gray-600 dark:text-gray-400"
                    fontSize={12}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    className="text-gray-600 dark:text-gray-400"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="kelas1" fill={gradeColors.kelas1} name="Kelas 1" />
                  <Bar dataKey="kelas2" fill={gradeColors.kelas2} name="Kelas 2" />
                  <Bar dataKey="kelas3" fill={gradeColors.kelas3} name="Kelas 3" />
                  <Bar dataKey="kelas4" fill={gradeColors.kelas4} name="Kelas 4" />
                  <Bar dataKey="kelas5" fill={gradeColors.kelas5} name="Kelas 5" />
                  <Bar dataKey="kelas6" fill={gradeColors.kelas6} name="Kelas 6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="by-semester">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={semesterComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                  <XAxis 
                    dataKey="period" 
                    className="text-gray-600 dark:text-gray-400"
                    fontSize={12}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    className="text-gray-600 dark:text-gray-400"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="matematika" fill={subjectColors.matematika} name="Matematika" />
                  <Bar dataKey="bahasaIndonesia" fill={subjectColors.bahasaIndonesia} name="Bahasa Indonesia" />
                  <Bar dataKey="ipa" fill={subjectColors.ipa} name="IPA" />
                  <Bar dataKey="ips" fill={subjectColors.ips} name="IPS" />
                  <Bar dataKey="bahasaInggris" fill={subjectColors.bahasaInggris} name="Bahasa Inggris" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Performance Summary */}
        <div className="mt-6 grid grid-cols-5 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Matematika</p>
            <p className="text-lg font-semibold text-red-600">82.3</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">B. Indonesia</p>
            <p className="text-lg font-semibold text-blue-600">87.1</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">IPA</p>
            <p className="text-lg font-semibold text-green-600">81.8</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">IPS</p>
            <p className="text-lg font-semibold text-orange-600">85.2</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">B. Inggris</p>
            <p className="text-lg font-semibold text-purple-600">79.7</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}