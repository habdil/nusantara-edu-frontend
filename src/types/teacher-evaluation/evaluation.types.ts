// Types untuk Teacher Evaluation API responses dan requests
// Berdasarkan dokumentasi API: http://localhost:5000/api/teacher-evaluation

// ==================== RESPONSE TYPES ====================

// Response untuk GET /teacher-evaluation/stats
export interface EvaluationStatsResponse {
  success: boolean;
  message: string;
  data: {
    totalTeachers: number;
    evaluatedTeachers: number;
    pendingEvaluations: number;
    averageScore: number;
    excellentPerformers: number;
    needsImprovement: number;
    developmentPrograms: number;
    completedTrainings: number;
  };
}

// Data evaluation untuk list dan single evaluation
export interface TeacherEvaluationData {
  id: number;
  teacherId: number;
  teacherName: string;
  employeeId: string;
  subjectArea: string;
  position: string;
  evaluationPeriod: string;
  academicYear: string;
  overallScore: number;
  teachingQuality: number;
  classroomManagement: number;
  studentEngagement: number;
  professionalDevelopment: number;
  collaboration: number;
  punctuality: number;
  evaluatorId: number;
  evaluatorName: string;
  evaluationDate: string;
  notes: string;
  recommendations: string[];
  status: 'pending' | 'completed' | 'approved' | 'rejected';
  developmentGoals: string[];
  attendanceRate: number;
  createdAt?: string;
  updatedAt?: string;
}

// Response untuk GET /teacher-evaluation/evaluations (list)
export interface EvaluationListResponse {
  success: boolean;
  message: string;
  data: {
    evaluations: TeacherEvaluationData[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// Response untuk GET /teacher-evaluation/evaluations/:id (single)
export interface SingleEvaluationResponse {
  success: boolean;
  message: string;
  data: TeacherEvaluationData;
}

// ==================== REQUEST TYPES ====================

// Payload untuk POST /teacher-evaluation/evaluations
export interface CreateEvaluationRequest {
  teacherId: number;
  evaluationPeriod: string;
  academicYear: string;
  teachingQuality: number;
  classroomManagement: number;
  studentEngagement: number;
  professionalDevelopment: number;
  collaboration: number;
  punctuality: number;
  notes: string;
  recommendations: string[];
  developmentGoals: string[];
  status: 'pending' | 'completed' | 'approved' | 'rejected';
}

// Payload untuk PUT /teacher-evaluation/evaluations/:id (partial update)
export interface UpdateEvaluationRequest {
  teachingQuality?: number;
  classroomManagement?: number;
  studentEngagement?: number;
  professionalDevelopment?: number;
  collaboration?: number;
  punctuality?: number;
  notes?: string;
  recommendations?: string[];
  developmentGoals?: string[];
  status?: 'pending' | 'completed' | 'approved' | 'rejected';
}

// ==================== QUERY/FILTER TYPES ====================

// Query parameters untuk GET /teacher-evaluation/evaluations
export interface EvaluationFilters {
  academicYear?: string;
  evaluationPeriod?: string;
  teacherId?: number;
  status?: 'pending' | 'completed' | 'approved' | 'rejected';
  page?: number;
  limit?: number;
}

// ==================== COMMON TYPES ====================

// Base API response structure
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Error response structure
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

// Evaluation status options
export type EvaluationStatus = 'pending' | 'completed' | 'approved' | 'rejected';

// Evaluation period options
export type EvaluationPeriod = 'Semester 1' | 'Semester 2' | 'Tahunan';

// Academic year format (contoh: "2024/2025")
export type AcademicYear = string;