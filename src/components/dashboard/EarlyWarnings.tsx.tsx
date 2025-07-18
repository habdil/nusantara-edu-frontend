"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, AlertCircle, Clock, DollarSign, Users, BookOpen, Building, RefreshCw, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

// Import API client
import { apiClient } from "@/services/api";
import type { ApiResponse } from "@/services/api/types";

// Types
interface EarlyWarning {
  id: number;
  category: string;
  title: string;
  description: string;
  urgency: string;
  detectedDate: string;
  targetValue?: number;
  actualValue?: number;
  handlingStatus?: string;
  icon: string;
  color: string;
}

interface WarningStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  byCategory: Record<string, number>;
  recent?: number;
}

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const WARNINGS_API_ENDPOINT = `${API_BASE_URL}/api/early-warnings`;

// Icon mapping
const iconMap = {
  Users,
  BookOpen,
  DollarSign,
  Building,
  Clock,
  AlertCircle,
  AlertTriangle,
};

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
  
  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "1 hari yang lalu";
  if (diffDays <= 7) return `${diffDays} hari yang lalu`;
  if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} minggu yang lalu`;
  return `${Math.ceil(diffDays / 30)} bulan yang lalu`;
};

// API Service - Focus on Real Data Analysis
const warningApiService = {
  async getWarnings(): Promise<{ data: EarlyWarning[]; stats: WarningStats }> {
    try {
      console.log('📡 Fetching warnings from:', WARNINGS_API_ENDPOINT);
      
      const response: ApiResponse<{ data: EarlyWarning[]; stats: WarningStats }> = await apiClient.get(WARNINGS_API_ENDPOINT, {
        requireAuth: true,
      });
      
      console.log('📊 Warnings response:', response);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal mengambil peringatan dini");
      }
      
      // Handle different response formats
      if (Array.isArray(response.data)) {
        // If response is directly an array
        return {
          data: response.data,
          stats: {
            total: response.data.length,
            critical: response.data.filter((w: EarlyWarning) => w.urgency === 'critical').length,
            high: response.data.filter((w: EarlyWarning) => w.urgency === 'high').length,
            medium: response.data.filter((w: EarlyWarning) => w.urgency === 'medium').length,
            low: response.data.filter((w: EarlyWarning) => w.urgency === 'low').length,
            byCategory: {}
          }
        };
      }
      
      // Standard format with data and stats
      return {
        data: response.data.data || response.data,
        stats: response.data.stats || {
          total: 0,
          critical: 0,
          high: 0,
          medium: 0,
          low: 0,
          byCategory: {}
        }
      };
    } catch (error: any) {
      console.error('❌ Get warnings error:', error);
      throw new Error(error.message || 'Gagal memuat peringatan dini.');
    }
  },

  async analyzeSchoolData(): Promise<{ saved: number; generated: number; summary?: any }> {
    try {
      console.log('🔍 Starting school data analysis...');
      
      const response: ApiResponse<{ saved: number; generated: number; summary?: any }> = await apiClient.post(`${WARNINGS_API_ENDPOINT}/generate`, {}, {
        requireAuth: true,
      });
      
      console.log('🤖 Analysis response:', response);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal menganalisis data sekolah");
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Analysis error:', error);
      throw new Error(error.message || 'Gagal menganalisis data sekolah.');
    }
  }
};

export function EarlyWarnings() {
  const [warnings, setWarnings] = useState<EarlyWarning[]>([]);
  const [stats, setStats] = useState<WarningStats>({
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    byCategory: {}
  });
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🎯 EarlyWarnings component mounted');
    loadWarnings();
  }, []);

  const loadWarnings = async () => {
    try {
      console.log('📥 Loading warnings...');
      setLoading(true);
      setError(null);
      
      const result = await warningApiService.getWarnings();
      
      console.log('✅ Warnings loaded:', {
        warningsCount: result.data.length,
        stats: result.stats
      });
      
      setWarnings(result.data);
      setStats(result.stats);
      
    } catch (err: any) {
      console.error('💥 Load warnings error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeData = async () => {
    try {
      setAnalyzing(true);
      
      console.log('🔍 Starting data analysis...');
      const result = await warningApiService.analyzeSchoolData();
      
      if (result.saved > 0) {
        toast.success("Analisis Data Selesai", {
          description: `${result.saved} masalah potensial ditemukan dari analisis data sekolah.`,
        });
      } else {
        toast.success("Analisis Data Selesai", {
          description: "Semua indikator sekolah dalam kondisi baik, tidak ada masalah yang terdeteksi.",
        });
      }
      
      // Reload warnings
      await loadWarnings();
      
    } catch (err: any) {
      console.error('💥 Analysis error:', err);
      toast.error("Gagal Menganalisis Data", {
        description: err.message || 'Terjadi kesalahan saat menganalisis data sekolah',
      });
    } finally {
      setAnalyzing(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Peringatan Dini
          </CardTitle>
          <CardDescription>
            Sistem deteksi otomatis untuk identifikasi masalah
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-96">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Memuat peringatan dini...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error State
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            Peringatan Dini
          </CardTitle>
          <CardDescription>
            Sistem deteksi otomatis untuk identifikasi masalah
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={loadWarnings} className="w-full mt-4" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" /> Coba Lagi
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Main Content
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
              Analisis otomatis data sekolah untuk deteksi masalah potensial
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {stats.total > 0 ? (
              <Badge variant="destructive" className="text-sm">
                {stats.total} peringatan
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-sm text-green-700 bg-green-100">
                Semua baik
              </Badge>
            )}
            <Button size="sm" variant="outline" onClick={loadWarnings} disabled={loading}>
              <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {warnings.length === 0 ? (
          // Empty State - No Warnings Found
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">
              Kondisi Sekolah Baik
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              Sistem belum mendeteksi masalah pada data sekolah Anda. Klik tombol di bawah untuk 
              menganalisis data terbaru dan memastikan semua indikator dalam kondisi optimal.
            </p>
            <Button onClick={handleAnalyzeData} disabled={analyzing} className="w-full max-w-sm">
              {analyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Menganalisis Data...
                </>
              ) : (
                <>
                  🔍 Analisis Data Sekolah
                </>
              )}
            </Button>
            {analyzing && (
              <p className="text-xs text-muted-foreground mt-3">
                Sedang menganalisis kehadiran, akademik, keuangan, aset, dan data lainnya...
              </p>
            )}
          </div>
        ) : (
          // Warnings Found
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <p className="text-xl font-bold text-red-600">{stats.critical}</p>
                <p className="text-xs text-muted-foreground">Kritis</p>
              </div>
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <p className="text-xl font-bold text-orange-600">{stats.high}</p>
                <p className="text-xs text-muted-foreground">Tinggi</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                <p className="text-xl font-bold text-yellow-600">{stats.medium}</p>
                <p className="text-xs text-muted-foreground">Sedang</p>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <p className="text-xl font-bold text-blue-600">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>

            {/* Warnings List */}
            <ScrollArea className="h-[49rem]">
              <div className="space-y-3">
                {warnings.map((warning) => {
                  const urgencyInfo = urgencyConfig[warning.urgency as keyof typeof urgencyConfig];
                  const IconComponent = iconMap[warning.icon as keyof typeof iconMap] || AlertTriangle;
                  
                  return (
                    <div
                      key={warning.id}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`p-2 rounded-lg flex-shrink-0 ${
                          warning.urgency === 'critical' ? 'bg-red-100 dark:bg-red-950/30' :
                          warning.urgency === 'high' ? 'bg-orange-100 dark:bg-orange-950/30' :
                          warning.urgency === 'medium' ? 'bg-yellow-100 dark:bg-yellow-950/30' :
                          'bg-blue-100 dark:bg-blue-950/30'
                        }`}>
                          <IconComponent className={`h-5 w-5 ${
                            warning.urgency === 'critical' ? 'text-red-600' :
                            warning.urgency === 'high' ? 'text-orange-600' :
                            warning.urgency === 'medium' ? 'text-yellow-600' :
                            'text-blue-600'
                          }`} />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                              {warning.title}
                            </h4>
                            <Badge className={`text-xs flex-shrink-0 ${urgencyInfo.color}`}>
                              {urgencyInfo.label}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                            {warning.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {getRelativeTime(warning.detectedDate)}
                            </span>
                            {warning.targetValue !== undefined && warning.actualValue !== undefined && (
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Target: {warning.targetValue}%</span>
                                <span className={`font-semibold ${
                                  warning.actualValue < warning.targetValue ? 'text-red-600' : 'text-green-600'
                                }`}>
                                  Aktual: {warning.actualValue}%
                                </span>
                              </div>
                            )}
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
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleAnalyzeData} 
                disabled={analyzing}
              >
                {analyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menganalisis Ulang Data...
                  </>
                ) : (
                  <>
                    🔍 Analisis Ulang Data Sekolah
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}