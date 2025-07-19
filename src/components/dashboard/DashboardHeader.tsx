"use client";

import { Calendar, Bell, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Dummy data
const currentDate = new Date().toLocaleDateString("id-ID", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const schoolInfo = {
  name: "SD Nusantara 01",
  npsn: "20100001",
  semester: "Semester 1",
  academicYear: "2024/2025",
};

export function 
DashboardHeader() {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
      {/* Left side - Welcome & School Info */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard Eksekutif
          </h1>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            {schoolInfo.semester}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-blue-600 dark:text-blue-400">
            {schoolInfo.name} • NPSN: {schoolInfo.npsn}
          </p>
          <p className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {currentDate} • Tahun Ajaran {schoolInfo.academicYear}
          </p>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-3">
      </div>
    </div>
  );
}