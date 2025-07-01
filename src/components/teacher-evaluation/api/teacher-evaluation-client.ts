// Teacher Evaluation API Client
// Handles all API calls untuk Teacher Evaluation endpoints

import type {
  // Evaluation Types
  EvaluationStatsResponse,
  EvaluationListResponse,
  SingleEvaluationResponse,
  CreateEvaluationRequest,
  UpdateEvaluationRequest,
  EvaluationFilters,
  
  // Development Program Types
  DevelopmentProgramListResponse,
  SingleDevelopmentProgramResponse,
  CreateDevelopmentProgramRequest,
  UpdateDevelopmentProgramRequest,
  DevelopmentProgramFilters,
  CreateDevelopmentProgramResponse,
  
  // Common Types
  ApiErrorResponse,
} from '@/types/teacher-evaluation';

// Base configuration
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
const TEACHER_EVALUATION_BASE = `${BASE_URL}/teacher-evaluation`;

// Helper function untuk build query string
const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
};

// Helper function untuk get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token'); // atau sesuai dengan pattern auth kamu
  
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function untuk handle API response
const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData: ApiErrorResponse = await response.json().catch(() => ({
      success: false,
      message: `HTTP Error: ${response.status} ${response.statusText}`,
      error: response.statusText,
    }));
    
    throw new Error(errorData.message || 'Terjadi kesalahan pada server');
  }
  
  return response.json();
};

// ==================== TEACHER EVALUATION API CLIENT ====================
export class TeacherEvaluationClient {
  
  // ==================== EVALUATION ENDPOINTS ====================
  
  /**
   * Get evaluation statistics
   * GET /teacher-evaluation/stats
   */
  static async getEvaluationStats(): Promise<EvaluationStatsResponse> {
    const response = await fetch(`${TEACHER_EVALUATION_BASE}/stats`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return handleApiResponse<EvaluationStatsResponse>(response);
  }
  
  /**
   * Get list of evaluations with optional filters
   * GET /teacher-evaluation/evaluations
   */
  static async getEvaluations(filters?: EvaluationFilters): Promise<EvaluationListResponse> {
    const queryString = filters ? buildQueryString(filters) : '';
    const url = `${TEACHER_EVALUATION_BASE}/evaluations${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return handleApiResponse<EvaluationListResponse>(response);
  }
  
  /**
   * Get single evaluation by ID
   * GET /teacher-evaluation/evaluations/:id
   */
  static async getEvaluationById(id: number): Promise<SingleEvaluationResponse> {
    const response = await fetch(`${TEACHER_EVALUATION_BASE}/evaluations/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return handleApiResponse<SingleEvaluationResponse>(response);
  }
  
  /**
   * Create new evaluation
   * POST /teacher-evaluation/evaluations
   */
  static async createEvaluation(data: CreateEvaluationRequest): Promise<SingleEvaluationResponse> {
    const response = await fetch(`${TEACHER_EVALUATION_BASE}/evaluations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    return handleApiResponse<SingleEvaluationResponse>(response);
  }
  
  /**
   * Update existing evaluation
   * PUT /teacher-evaluation/evaluations/:id
   */
  static async updateEvaluation(
    id: number, 
    data: UpdateEvaluationRequest
  ): Promise<SingleEvaluationResponse> {
    const response = await fetch(`${TEACHER_EVALUATION_BASE}/evaluations/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    return handleApiResponse<SingleEvaluationResponse>(response);
  }
  
  /**
   * Delete evaluation
   * DELETE /teacher-evaluation/evaluations/:id
   */
  static async deleteEvaluation(id: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${TEACHER_EVALUATION_BASE}/evaluations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    return handleApiResponse<{ success: boolean; message: string }>(response);
  }
  
  // ==================== DEVELOPMENT PROGRAM ENDPOINTS ====================
  
  /**
   * Get list of development programs with optional filters
   * GET /teacher-evaluation/development-programs
   */
  static async getDevelopmentPrograms(
    filters?: DevelopmentProgramFilters
  ): Promise<DevelopmentProgramListResponse> {
    const queryString = filters ? buildQueryString(filters) : '';
    const url = `${TEACHER_EVALUATION_BASE}/development-programs${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return handleApiResponse<DevelopmentProgramListResponse>(response);
  }
  
  /**
   * Get single development program by ID
   * GET /teacher-evaluation/development-programs/:id
   */
  static async getDevelopmentProgramById(id: number): Promise<SingleDevelopmentProgramResponse> {
    const response = await fetch(`${TEACHER_EVALUATION_BASE}/development-programs/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    return handleApiResponse<SingleDevelopmentProgramResponse>(response);
  }
  
  /**
   * Create new development program
   * POST /teacher-evaluation/development-programs
   */
  static async createDevelopmentProgram(
    data: CreateDevelopmentProgramRequest
  ): Promise<CreateDevelopmentProgramResponse> {
    const response = await fetch(`${TEACHER_EVALUATION_BASE}/development-programs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    return handleApiResponse<CreateDevelopmentProgramResponse>(response);
  }
  
  /**
   * Update existing development program
   * PUT /teacher-evaluation/development-programs/:id
   */
  static async updateDevelopmentProgram(
    id: number,
    data: UpdateDevelopmentProgramRequest
  ): Promise<SingleDevelopmentProgramResponse> {
    const response = await fetch(`${TEACHER_EVALUATION_BASE}/development-programs/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    return handleApiResponse<SingleDevelopmentProgramResponse>(response);
  }
  
  /**
   * Delete development program
   * DELETE /teacher-evaluation/development-programs/:id
   */
  static async deleteDevelopmentProgram(id: number): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${TEACHER_EVALUATION_BASE}/development-programs/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    return handleApiResponse<{ success: boolean; message: string }>(response);
  }
  
  // ==================== UTILITY METHODS ====================
  
  /**
   * Health check endpoint
   * GET ../health
   */
  static async healthCheck(): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${BASE_URL}/../health`, {
      method: 'GET',
    });
    
    return handleApiResponse<{ success: boolean; message: string }>(response);
  }
}

// Export default instance untuk convenience
export default TeacherEvaluationClient;