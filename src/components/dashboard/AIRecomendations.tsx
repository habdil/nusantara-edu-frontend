"use client";

import { useState, useEffect } from "react";
import { Brain, TrendingUp, Target, Lightbulb, ArrowRight, Sparkles, RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

// Menggunakan apiClient yang sudah ada untuk konsistensi
import { apiClient } from "@/services/api";
import type { ApiResponse } from "@/services/api/types";

// Types
interface AIRecommendation {
  id: number;
  category: string;
  title: string;
  description: string;
  supportingData: any;
  confidenceLevel: number;
  generatedDate: string;
  predictedImpact: string;
  implementationStatus: string;
  principalFeedback?: string;
  icon: string;
  color: string;
  urgencyLevel: string;
}

interface RecommendationStats {
  total: number;
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
  byUrgency: Record<string, number>;
  averageConfidence: number;
  recentCount: number;
}

interface RecommendationsResponse {
  data: AIRecommendation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  stats: RecommendationStats;
}

// Icon mapping
const iconMap = {
  Target,
  TrendingUp,
  Lightbulb,
  Brain,
};

// Status config
const statusConfig = {
  pending: {
    label: "Menunggu",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  in_progress: {
    label: "Berlangsung",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  },
  approved: {
    label: "Disetujui",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  completed: {
    label: "Selesai",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  },
  rejected: {
    label: "Ditolak",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
};

// Perbaikan: Menggunakan NEXT_PUBLIC_API_BASE_URL yang konsisten
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';
const AI_API_ENDPOINT = `${API_BASE_URL}/api/ai-recommendations`;

// Helper Functions
const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return "1 hari yang lalu";
  if (diffDays <= 7) return `${diffDays} hari yang lalu`;
  return `${Math.ceil(diffDays / 7)} minggu yang lalu`;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// API service dengan debug logs yang lebih lengkap
const apiService = {
  async getAllRecommendations(): Promise<RecommendationsResponse> {
    try {
      console.log('🔍 Starting getAllRecommendations...');
      console.log('API Endpoint:', AI_API_ENDPOINT);
      
      let allRecommendations: AIRecommendation[] = [];
      let currentPage = 1;
      let totalPages = 1;
      let stats: RecommendationStats | null = null;

      // Loop untuk mengambil semua halaman data
      do {
        console.log(`📄 Fetching page ${currentPage}...`);
        
        const response: ApiResponse<any> = await apiClient.get(AI_API_ENDPOINT, {
          params: { 
            limit: '100',
            page: currentPage.toString(),
          },
          requireAuth: true,
        });
        
        console.log('📡 Raw API Response:', response);
        
        if (!response.success) {
          console.error('❌ API Error:', response.message);
          throw new Error(response.message || "Gagal mengambil rekomendasi");
        }

        // 🔧 FIX: Cek apakah response.data adalah object atau sudah array
        let responseData;
        if (response.data && typeof response.data === 'object') {
          // Case 1: Response wrapper {data: [], pagination: {}, stats: {}}
          if (Array.isArray(response.data.data)) {
            responseData = {
              data: response.data.data,
              pagination: response.data.pagination,
              stats: response.data.stats
            };
          }
          // Case 2: Response langsung {data: [], pagination: {}, stats: {}}
          else if (Array.isArray(response.data)) {
            responseData = {
              data: response.data,
              pagination: { page: currentPage, limit: 100, total: response.data.length, totalPages: 1 },
              stats: null
            };
          }
          // Case 3: Response success: true, data: {data: [], pagination: {}, stats: {}}
          else {
            responseData = {
              data: response.data.data || [],
              pagination: response.data.pagination || { page: currentPage, limit: 100, total: 0, totalPages: 1 },
              stats: response.data.stats || null
            };
          }
        } else {
          console.error('❌ Unexpected response format:', response);
          throw new Error("Format response tidak valid");
        }
        
        console.log('🔧 Processed response data:', {
          dataLength: responseData.data?.length || 0,
          pagination: responseData.pagination,
          stats: responseData.stats
        });
        
        // Kumpulkan data dari response
        const pageData = responseData.data || [];
        allRecommendations = [...allRecommendations, ...pageData];
        
        // Update stats dari response pertama
        if (currentPage === 1) {
          stats = responseData.stats;
          totalPages = responseData.pagination?.totalPages || 1;
          console.log('📈 Stats from first page:', stats);
          console.log('📚 Total Pages:', totalPages);
        }
        
        currentPage++;
      } while (currentPage <= totalPages);

      console.log('✅ Final result:', {
        totalRecommendations: allRecommendations.length,
        firstFewRecommendations: allRecommendations.slice(0, 3),
        stats
      });

      // Return semua data yang telah dikumpulkan
      return {
        data: allRecommendations,
        pagination: {
          page: 1,
          limit: allRecommendations.length,
          total: allRecommendations.length,
          totalPages: 1,
        },
        stats: stats || {
          total: allRecommendations.length,
          byCategory: {},
          byStatus: {},
          byUrgency: {},
          averageConfidence: 0,
          recentCount: 0,
        },
      };
    } catch (error: any) {
      console.error('💥 getAllRecommendations error:', error);
      
      // Handle berbagai tipe error dengan lebih spesifik
      if (error.status === 401 || error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        throw new Error('Sesi Anda telah berakhir, silakan login kembali.');
      }
      
      if (error.status === 403 || error.message?.includes('403')) {
        throw new Error('Anda tidak memiliki akses untuk melihat rekomendasi AI.');
      }
      
      if (error.status === 404 || error.message?.includes('404')) {
        throw new Error('Endpoint rekomendasi AI tidak ditemukan.');
      }
      
      if (error.status >= 500 || error.message?.includes('500')) {
        throw new Error('Terjadi kesalahan server, silakan coba lagi nanti.');
      }
      
      throw new Error(error.message || 'Gagal memuat rekomendasi AI.');
    }
  },

  async generateRecommendations(): Promise<{ saved: number }> {
    try {
      console.log('🚀 Generating recommendations...');
      
      const response: ApiResponse<{ saved: number }> = await apiClient.post(`${AI_API_ENDPOINT}/generate`, {}, {
        requireAuth: true,
      });
      
      console.log('📡 Generate response:', response);
      
      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal membuat rekomendasi baru");
      }
      
      console.log('✅ Generate successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('💥 Generate recommendations error:', error);
      
      // Handle berbagai tipe error
      if (error.status === 401 || error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        throw new Error('Sesi Anda telah berakhir, silakan login kembali.');
      }
      
      if (error.status === 403 || error.message?.includes('403')) {
        throw new Error('Anda tidak memiliki akses untuk membuat rekomendasi AI.');
      }
      
      if (error.status >= 500 || error.message?.includes('500')) {
        throw new Error('Terjadi kesalahan server saat membuat rekomendasi.');
      }
      
      throw new Error(error.message || 'Gagal membuat rekomendasi baru.');
    }
  },

  async updateRecommendationStatus(id: number, status: string, feedback?: string): Promise<AIRecommendation> {
    try {
      const payload = {
        implementationStatus: status,
        ...(feedback && { principalFeedback: feedback }),
      };
      
      const response: ApiResponse<AIRecommendation> = await apiClient.put(`${AI_API_ENDPOINT}/${id}`, payload, {
        requireAuth: true,
      });
      
      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal memperbarui status rekomendasi");
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Update recommendation status error:', error);
      
      // Handle berbagai tipe error
      if (error.status === 401 || error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        throw new Error('Sesi Anda telah berakhir, silakan login kembali.');
      }
      
      if (error.status === 403 || error.message?.includes('403')) {
        throw new Error('Anda tidak memiliki akses untuk memperbarui rekomendasi.');
      }
      
      if (error.status === 404 || error.message?.includes('404')) {
        throw new Error('Rekomendasi tidak ditemukan.');
      }
      
      throw new Error(error.message || 'Gagal memperbarui status rekomendasi.');
    }
  }
};

export function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [stats, setStats] = useState<RecommendationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🎯 Component mounted, loading recommendations...');
    loadAllRecommendations();
  }, []);

  const loadAllRecommendations = async (showLoadingState = true) => {
    try {
      console.log('📥 loadAllRecommendations called, showLoadingState:', showLoadingState);
      
      if (showLoadingState) setLoading(true);
      setError(null);

      console.log('📞 Calling apiService.getAllRecommendations...');
      const response = await apiService.getAllRecommendations();
      
      console.log('📤 Service response received:', {
        dataLength: response.data?.length || 0,
        statsTotal: response.stats?.total || 0,
        hasStats: !!response.stats
      });
      
      // FIX: Provide a fallback to an empty array for recommendations
      const recommendationsData = response.data || [];
      const statsData = response.stats || null;
      
      console.log('💾 Setting state with:', {
        recommendationsCount: recommendationsData.length,
        stats: statsData
      });
      
      setRecommendations(recommendationsData); 
      setStats(statsData);
      
      console.log('✅ State updated successfully');

    } catch (err: any) {
      console.error('💥 Load all recommendations error:', err);
      setError(err.message);
    } finally {
      if (showLoadingState) {
        console.log('🏁 Setting loading to false');
        setLoading(false);
      }
    }
  };

  const handleGenerateRecommendations = async () => {
    try {
      setGenerating(true);
      
      const response = await apiService.generateRecommendations();
      
      toast.success("Rekomendasi Berhasil Dibuat", {
        description: `${response.saved} rekomendasi baru telah dibuat.`,
      });
      
      // Reload semua data setelah generate
      await loadAllRecommendations(false);
    } catch (err: any) {
      console.error('Generate recommendations error:', err);
      toast.error("Gagal Generate Rekomendasi", {
        description: err.message || 'Terjadi kesalahan tidak diketahui',
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await apiService.updateRecommendationStatus(id, status);
      
      toast.success("Status Berhasil Diperbarui");
      
      setRecommendations(prev => 
        prev.map(rec => 
          rec.id === id 
            ? { ...rec, implementationStatus: status }
            : rec
        )
      );
    } catch (err: any) {
      console.error('Update status error:', err);
      toast.error("Gagal Memperbarui Status", {
        description: err.message || 'Terjadi kesalahan tidak diketahui',
      });
    }
  };

  const pendingRecommendations = stats ? (stats.byStatus.pending || 0) : 0;
  const highConfidenceRecs = recommendations.filter(r => r.confidenceLevel >= 0.8).length;

  // Debug logs untuk render
  console.log('🎨 Rendering component with:', {
    loading,
    error,
    recommendationsLength: recommendations.length,
    stats
  });

  if (loading) {
    console.log('⏳ Rendering loading state');
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" /> Rekomendasi AI
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-94">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Memuat semua rekomendasi...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    console.log('❌ Rendering error state:', error);
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" /> Rekomendasi AI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={() => loadAllRecommendations()} className="w-full mt-4" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" /> Coba Lagi
          </Button>
        </CardContent>
      </Card>
    );
  }

  console.log('🎯 Rendering main content with', recommendations.length, 'recommendations');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" /> Rekomendasi AI
            </CardTitle>
            <CardDescription>Semua rekomendasi berbasis analisis data dan machine learning</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              <Sparkles className="h-3 w-3 mr-1" /> {recommendations.length} total rekomendasi
            </Badge>
            <Button size="sm" variant="outline" onClick={() => loadAllRecommendations()} disabled={loading}>
              <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {recommendations.length === 0 ? (
          <div className="text-center py-12">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium">Belum Ada Rekomendasi</h3>
            <p className="text-sm text-muted-foreground mb-4">Generate rekomendasi AI berdasarkan data sekolah Anda.</p>
            <Button onClick={handleGenerateRecommendations} disabled={generating}>
              {generating ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Membuat...</>
              ) : (
                <><Sparkles className="h-4 w-4 mr-2" /> Generate Rekomendasi</>
              )}
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                📊 Menampilkan <span className="font-semibold">{recommendations.length}</span> rekomendasi total
                {highConfidenceRecs > 0 && (
                  <> • <span className="font-semibold">{highConfidenceRecs}</span> dengan akurasi tinggi (≥80%)</>
                )}
              </p>
            </div>
            
            <ScrollArea className="h-[37rem] pr-3">
              <div className="space-y-3">
                {recommendations.map((rec) => {
                  const statusInfo = statusConfig[rec.implementationStatus as keyof typeof statusConfig] || statusConfig.pending;
                  const IconComponent = iconMap[rec.icon as keyof typeof iconMap] || Target;
                  
                  return (
                    <div key={rec.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${
                          rec.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/50' :
                          rec.color === 'green' ? 'bg-green-100 dark:bg-green-900/50' :
                          rec.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/50' :
                          'bg-orange-100 dark:bg-orange-900/50'
                        }`}>
                          <IconComponent className={`h-4 w-4 ${
                            rec.color === 'blue' ? 'text-blue-600' :
                            rec.color === 'green' ? 'text-green-600' :
                            rec.color === 'purple' ? 'text-purple-600' :
                            'text-orange-600'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{rec.title}</h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">{rec.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span>{getRelativeTime(rec.generatedDate)}</span>
                            <span>&middot;</span>
                            <Badge variant="outline" className={`font-medium ${
                              rec.confidenceLevel >= 0.9 ? 'text-green-600 border-green-200' :
                              rec.confidenceLevel >= 0.8 ? 'text-blue-600 border-blue-200' : 'text-yellow-600 border-yellow-200'
                            }`}>
                              Akurasi {Math.round(rec.confidenceLevel * 100)}%
                            </Badge>
                            <span>&middot;</span>
                            <Badge variant="secondary" className={statusInfo.color}>
                              {statusInfo.label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <div className="mt-4 pt-4 border-t space-y-2">
              <Button variant="outline" className="w-full" onClick={handleGenerateRecommendations} disabled={generating}>
                {generating ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Membuat...</>
                ) : (
                  <><Sparkles className="h-4 w-4 mr-2" /> Generate Rekomendasi Baru</>
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}