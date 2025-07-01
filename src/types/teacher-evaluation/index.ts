// Barrel export untuk semua Teacher Evaluation types
// Mempermudah import di komponen dan API clients

import { CreateDevelopmentProgramRequest, DateRangeFilter, DevelopmentProgramData, DevelopmentProgramFilters, ProgramStatus, ProgramType } from './development-program.types';
import { CreateEvaluationRequest, EvaluationFilters, EvaluationStatus, TeacherEvaluationData } from './evaluation.types';

// ==================== EVALUATION TYPES ====================
export type {
  // Response Types
  EvaluationStatsResponse,
  TeacherEvaluationData,
  EvaluationListResponse,
  SingleEvaluationResponse,
  
  // Request Types
  CreateEvaluationRequest,
  UpdateEvaluationRequest,
  
  // Query/Filter Types
  EvaluationFilters,
  
  // Common Types
  ApiResponse,
  ApiErrorResponse,
  EvaluationStatus,
  EvaluationPeriod,
  AcademicYear,
} from './evaluation.types';

// ==================== DEVELOPMENT PROGRAM TYPES ====================
export type {
  // Response Types
  DevelopmentProgramData,
  DevelopmentProgramListResponse,
  SingleDevelopmentProgramResponse,
  CreateDevelopmentProgramResponse,
  
  // Request Types
  CreateDevelopmentProgramRequest,
  UpdateDevelopmentProgramRequest,
  
  // Query/Filter Types
  DevelopmentProgramFilters,
  
  // Statistics Types
  DevelopmentProgramStats,
  DevelopmentProgramStatsResponse,
  
  // Common Types
  ProgramType,
  ProgramStatus,
  ProgramProvider,
  DateRangeFilter,
  ProgramSummary,
} from './development-program.types';

// ==================== COMBINED/UTILITY TYPES ====================

// Combined filter untuk dashboard yang menggabungkan evaluation dan program filters
export interface TeacherEvaluationDashboardFilters {
  // Teacher filters
  teacherId?: number;
  
  // Time filters
  academicYear?: string;
  evaluationPeriod?: string;
  dateRange?: DateRangeFilter;
  
  // Status filters
  evaluationStatus?: EvaluationStatus;
  programStatus?: ProgramStatus;
  
  // Program filters
  programType?: ProgramType;
  
  // Pagination
  page?: number;
  limit?: number;
}

// Combined stats untuk dashboard overview
export interface TeacherEvaluationOverviewStats {
  evaluations: {
    total: number;
    completed: number;
    pending: number;
    averageScore: number;
  };
  programs: {
    total: number;
    completed: number;
    ongoing: number;
    totalHours: number;
    totalCost: number;
  };
  teachers: {
    total: number;
    evaluated: number;
    needsImprovement: number;
    excellentPerformers: number;
  };
}

// Combined response untuk dashboard overview
export interface TeacherEvaluationOverviewResponse {
  success: boolean;
  message: string;
  data: TeacherEvaluationOverviewStats;
}

// Teacher profile dengan evaluation dan program history
export interface TeacherEvaluationProfile {
  teacher: {
    id: number;
    name: string;
    employeeId: string;
    subjectArea: string;
    position: string;
  };
  evaluations: {
    latest: TeacherEvaluationData | null;
    history: TeacherEvaluationData[];
    averageScore: number;
    trend: 'improving' | 'declining' | 'stable';
  };
  programs: {
    completed: DevelopmentProgramData[];
    ongoing: DevelopmentProgramData[];
    planned: DevelopmentProgramData[];
    totalHours: number;
    totalCost: number;
  };
  recommendations: string[];
  goals: string[];
}

// Form state types untuk UI components
export interface EvaluationFormState {
  isLoading: boolean;
  isSubmitting: boolean;
  errors: Record<string, string>;
  data: Partial<CreateEvaluationRequest>;
}

export interface ProgramFormState {
  isLoading: boolean;
  isSubmitting: boolean;
  errors: Record<string, string>;
  data: Partial<CreateDevelopmentProgramRequest>;
}

// Table/List state types
export interface EvaluationTableState {
  data: TeacherEvaluationData[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: EvaluationFilters;
  selectedItems: number[];
}

export interface ProgramTableState {
  data: DevelopmentProgramData[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: DevelopmentProgramFilters;
  selectedItems: number[];
}