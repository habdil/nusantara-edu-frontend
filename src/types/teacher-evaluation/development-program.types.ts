// Types untuk Teacher Development Program API responses dan requests
// Berdasarkan dokumentasi API: http://localhost:5000/api/teacher-evaluation/development-programs

// ==================== RESPONSE TYPES ====================

// Data development program untuk list dan single program
export interface DevelopmentProgramData {
  id: number;
  teacherId: number;
  teacherName?: string;
  employeeId?: string;
  programName: string;
  programType: 'training' | 'workshop' | 'seminar' | 'certification' | 'conference' | 'mentoring';
  startDate: string;
  endDate: string;
  hours: number;
  provider: string;
  cost: number;
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  certificateUrl?: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

// Response untuk GET /teacher-evaluation/development-programs (list)
export interface DevelopmentProgramListResponse {
  success: boolean;
  message: string;
  data: {
    programs: DevelopmentProgramData[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// Response untuk GET /teacher-evaluation/development-programs/:id (single)
export interface SingleDevelopmentProgramResponse {
  success: boolean;
  message: string;
  data: DevelopmentProgramData;
}

// Response untuk POST /teacher-evaluation/development-programs (create)
export interface CreateDevelopmentProgramResponse {
  success: boolean;
  message: string;
  data: DevelopmentProgramData;
}

// ==================== REQUEST TYPES ====================

// Payload untuk POST /teacher-evaluation/development-programs
export interface CreateDevelopmentProgramRequest {
  teacherId: number;
  programName: string;
  programType: 'training' | 'workshop' | 'seminar' | 'certification' | 'conference' | 'mentoring';
  startDate: string; // Format: YYYY-MM-DD
  endDate: string; // Format: YYYY-MM-DD
  hours: number;
  provider: string;
  cost: number;
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  certificateUrl?: string;
  description: string;
}

// Payload untuk PUT /teacher-evaluation/development-programs/:id (partial update)
export interface UpdateDevelopmentProgramRequest {
  programName?: string;
  programType?: 'training' | 'workshop' | 'seminar' | 'certification' | 'conference' | 'mentoring';
  startDate?: string;
  endDate?: string;
  hours?: number;
  provider?: string;
  cost?: number;
  status?: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  certificateUrl?: string;
  description?: string;
}

// ==================== QUERY/FILTER TYPES ====================

// Query parameters untuk GET /teacher-evaluation/development-programs
export interface DevelopmentProgramFilters {
  teacherId?: number;
  programType?: 'training' | 'workshop' | 'seminar' | 'certification' | 'conference' | 'mentoring';
  status?: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  provider?: string;
  startDate?: string; // Filter by start date (>=)
  endDate?: string; // Filter by end date (<=)
  page?: number;
  limit?: number;
}

// ==================== STATISTICS TYPES ====================

// Statistics untuk development programs (jika ada endpoint khusus)
export interface DevelopmentProgramStats {
  totalPrograms: number;
  completedPrograms: number;
  ongoingPrograms: number;
  plannedPrograms: number;
  cancelledPrograms: number;
  totalHours: number;
  totalCost: number;
  averageCostPerProgram: number;
  programsByType: {
    training: number;
    workshop: number;
    seminar: number;
    certification: number;
    conference: number;
    mentoring: number;
  };
}

// Response untuk development program statistics
export interface DevelopmentProgramStatsResponse {
  success: boolean;
  message: string;
  data: DevelopmentProgramStats;
}

// ==================== COMMON TYPES ====================

// Program type options
export type ProgramType = 'training' | 'workshop' | 'seminar' | 'certification' | 'conference' | 'mentoring';

// Program status options
export type ProgramStatus = 'planned' | 'ongoing' | 'completed' | 'cancelled';

// Program provider categories (common providers in Indonesia)
export type ProgramProvider = 
  | 'Kemendikbud'
  | 'LPMP'
  | 'Universitas'
  | 'Lembaga Training'
  | 'Internal'
  | 'External'
  | string; // Allow custom providers

// Date range filter
export interface DateRangeFilter {
  startDate?: string;
  endDate?: string;
}

// Program summary for reports
export interface ProgramSummary {
  teacherId: number;
  teacherName: string;
  totalPrograms: number;
  completedPrograms: number;
  totalHours: number;
  totalCost: number;
  lastProgramDate?: string;
}