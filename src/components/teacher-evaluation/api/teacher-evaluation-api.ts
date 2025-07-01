// Real API client untuk Teacher Evaluation
// Menggantikan mock data dengan actual API calls

// Keep the same interfaces untuk backward compatibility
export interface TeacherEvaluation {
  id: number
  teacherId: number
  teacherName: string
  employeeId: string
  subjectArea: string
  position: string
  evaluationPeriod: string
  academicYear: string
  overallScore: number
  teachingQuality: number
  classroomManagement: number
  studentEngagement: number
  professionalDevelopment: number
  collaboration: number
  punctuality: number
  evaluatorId: number
  evaluatorName: string
  evaluationDate: string
  notes: string
  recommendations: string[]
  status: "draft" | "completed" | "reviewed" | "approved"
  developmentGoals: string[]
  attendanceRate: number
  profilePhoto?: string
}

export interface TeacherDevelopment {
  id: number
  teacherId: number
  programName: string
  programType: "workshop" | "training" | "certification" | "seminar"
  startDate: string
  endDate: string
  status: "planned" | "ongoing" | "completed" | "cancelled"
  certificateUrl?: string
  hours: number
  provider: string
  cost: number
}

export interface EvaluationStats {
  totalTeachers: number
  evaluatedTeachers: number
  pendingEvaluations: number
  averageScore: number
  excellentPerformers: number
  needsImprovement: number
  developmentPrograms: number
  completedTrainings: number
}

// ==================== API CONFIGURATION ====================
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const TEACHER_EVALUATION_BASE = `${BASE_URL}/api/teacher-evaluation`;

// ==================== HELPER FUNCTIONS ====================
const getAuthHeaders = (): HeadersInit => {
  // Sesuaikan dengan AuthService pattern yang sudah ada
  const token = typeof window !== 'undefined' ? 
    localStorage.getItem('nusantara_edu_token') || 
    document.cookie.split('; ').find(row => row.startsWith('nusantara_edu_token='))?.split('=')[1] : 
    null;
  
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const buildQueryString = (params: Record<string, any>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
};

const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      success: false,
      message: `HTTP Error: ${response.status} ${response.statusText}`,
      error: response.statusText,
    }));
    
    // Handle 401 Unauthorized - token mungkin expired
    if (response.status === 401) {
      // Clear auth data menggunakan pattern yang sama dengan AuthService
      if (typeof window !== 'undefined') {
        localStorage.removeItem('nusantara_edu_token');
        localStorage.removeItem('nusantara_edu_user');
        localStorage.removeItem('nusantara_edu_school');
        localStorage.removeItem('nusantara_edu_refresh_token');
        
        // Clear cookies
        document.cookie = "nusantara_edu_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie = "nusantara_edu_user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie = "nusantara_edu_school=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        
        // Redirect to login
        window.location.href = '/?error=session_expired';
      }
      
      throw new Error('Sesi telah berakhir. Silakan login kembali.');
    }
    
    throw new Error(errorData.message || 'Terjadi kesalahan pada server');
  }
  
  const data = await response.json();
  
  // Handle API response format dari dokumentasi
  if (data.success === false) {
    throw new Error(data.message || 'Terjadi kesalahan pada server');
  }
  
  return data;
};

// Helper function untuk transform API response ke format interface
const transformEvaluationResponse = (apiData: any): TeacherEvaluation => {
  // Handle jika apiData null atau undefined
  if (!apiData) {
    throw new Error('Invalid evaluation data received from API');
  }

  return {
    id: apiData.id || 0,
    teacherId: apiData.teacherId || apiData.teacher_id || 0,
    teacherName: apiData.teacherName || apiData.teacher_name || '',
    employeeId: apiData.employeeId || apiData.employee_id || '',
    subjectArea: apiData.subjectArea || apiData.subject_area || '',
    position: apiData.position || '',
    evaluationPeriod: apiData.evaluationPeriod || apiData.evaluation_period || '',
    academicYear: apiData.academicYear || apiData.academic_year || '',
    overallScore: apiData.overallScore || apiData.overall_score || 0,
    teachingQuality: apiData.teachingQuality || apiData.teaching_quality || 0,
    classroomManagement: apiData.classroomManagement || apiData.classroom_management || 0,
    studentEngagement: apiData.studentEngagement || apiData.student_engagement || 0,
    professionalDevelopment: apiData.professionalDevelopment || apiData.professional_development || 0,
    collaboration: apiData.collaboration || 0,
    punctuality: apiData.punctuality || 0,
    evaluatorId: apiData.evaluatorId || apiData.evaluator_id || 0,
    evaluatorName: apiData.evaluatorName || apiData.evaluator_name || '',
    evaluationDate: apiData.evaluationDate || apiData.evaluation_date || '',
    notes: apiData.notes || '',
    recommendations: apiData.recommendations || [],
    status: apiData.status || 'draft',
    developmentGoals: apiData.developmentGoals || apiData.development_goals || [],
    attendanceRate: apiData.attendanceRate || apiData.attendance_rate || 0,
    profilePhoto: apiData.profilePhoto || apiData.profile_photo,
  };
};

const transformDevelopmentResponse = (apiData: any): TeacherDevelopment => {
  // Handle jika apiData null atau undefined
  if (!apiData) {
    throw new Error('Invalid development program data received from API');
  }

  return {
    id: apiData.id || 0,
    teacherId: apiData.teacherId || apiData.teacher_id || 0,
    programName: apiData.programName || apiData.program_name || '',
    programType: apiData.programType || apiData.program_type || 'training',
    startDate: apiData.startDate || apiData.start_date || '',
    endDate: apiData.endDate || apiData.end_date || '',
    status: apiData.status || 'planned',
    certificateUrl: apiData.certificateUrl || apiData.certificate_url,
    hours: apiData.hours || 0,
    provider: apiData.provider || '',
    cost: apiData.cost || 0,
  };
};

// ==================== API FUNCTIONS ====================
export const teacherEvaluationApi = {
  // Get all evaluations
  getEvaluations: async (filters?: {
    academicYear?: string
    evaluationPeriod?: string
    subjectArea?: string
    status?: string
    search?: string
    page?: number
    limit?: number
  }): Promise<TeacherEvaluation[]> => {
    try {
      const queryString = filters ? buildQueryString(filters) : '';
      const url = `${TEACHER_EVALUATION_BASE}/evaluations${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      const data = await handleApiResponse<any>(response);
      
      // Debug logging untuk lihat struktur response
      console.log('API Response structure:', data);
      
      // Handle berbagai kemungkinan struktur response
      let evaluations: any[] = [];
      
      if (data.data && Array.isArray(data.data.evaluations)) {
        // Format: { success: true, data: { evaluations: [...] } }
        evaluations = data.data.evaluations;
      } else if (data.data && Array.isArray(data.data)) {
        // Format: { success: true, data: [...] }
        evaluations = data.data;
      } else if (Array.isArray(data)) {
        // Format langsung array: [...]
        evaluations = data;
      } else {
        console.warn('Unexpected API response format:', data);
        return [];
      }
      
      // Transform API response to match interface
      return evaluations.map(transformEvaluationResponse);
    } catch (error) {
      console.error('Failed to fetch evaluations:', error);
      throw error;
    }
  },

  // Get evaluation statistics
  getEvaluationStats: async (): Promise<EvaluationStats> => {
    try {
      const response = await fetch(`${TEACHER_EVALUATION_BASE}/stats`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      const data = await handleApiResponse<{
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
      }>(response);
      
      return data.data;
    } catch (error) {
      console.error('Failed to fetch evaluation stats:', error);
      throw error;
    }
  },

  // Get development programs
  getDevelopmentPrograms: async (teacherId?: number): Promise<TeacherDevelopment[]> => {
    try {
      const filters = teacherId ? { teacherId } : {};
      const queryString = buildQueryString(filters);
      const url = `${TEACHER_EVALUATION_BASE}/development-programs${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      const data = await handleApiResponse<any>(response);
      
      // Debug logging
      console.log('Development Programs API Response:', data);
      
      // Handle berbagai kemungkinan struktur response
      let programs: any[] = [];
      
      if (data.data && Array.isArray(data.data.programs)) {
        // Format: { success: true, data: { programs: [...] } }
        programs = data.data.programs;
      } else if (data.data && Array.isArray(data.data)) {
        // Format: { success: true, data: [...] }
        programs = data.data;
      } else if (Array.isArray(data)) {
        // Format langsung array: [...]
        programs = data;
      } else {
        console.warn('Unexpected API response format for development programs:', data);
        return [];
      }
      
      return programs.map(transformDevelopmentResponse);
    } catch (error) {
      console.error('Failed to fetch development programs:', error);
      throw error;
    }
  },

  // Get single evaluation by ID
  getEvaluationById: async (id: number): Promise<TeacherEvaluation> => {
    try {
      const response = await fetch(`${TEACHER_EVALUATION_BASE}/evaluations/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      const data = await handleApiResponse<{
        success: boolean;
        message: string;
        data: any;
      }>(response);
      
      return transformEvaluationResponse(data.data);
    } catch (error) {
      console.error('Failed to fetch evaluation:', error);
      throw error;
    }
  },

  // Get single development program by ID
  getDevelopmentProgramById: async (id: number): Promise<TeacherDevelopment> => {
    try {
      const response = await fetch(`${TEACHER_EVALUATION_BASE}/development-programs/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      const data = await handleApiResponse<{
        success: boolean;
        message: string;
        data: any;
      }>(response);
      
      return transformDevelopmentResponse(data.data);
    } catch (error) {
      console.error('Failed to fetch development program:', error);
      throw error;
    }
  },

  // Create new evaluation
  createEvaluation: async (evaluation: Omit<TeacherEvaluation, "id">): Promise<TeacherEvaluation> => {
    try {
      const response = await fetch(`${TEACHER_EVALUATION_BASE}/evaluations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(evaluation),
      });
      
      const data = await handleApiResponse<{
        success: boolean;
        message: string;
        data: any;
      }>(response);
      
      return transformEvaluationResponse(data.data);
    } catch (error) {
      console.error('Failed to create evaluation:', error);
      throw error;
    }
  },

  // Update evaluation
  updateEvaluation: async (id: number, updates: Partial<TeacherEvaluation>): Promise<TeacherEvaluation> => {
    try {
      const response = await fetch(`${TEACHER_EVALUATION_BASE}/evaluations/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      
      const data = await handleApiResponse<{
        success: boolean;
        message: string;
        data: any;
      }>(response);
      
      return transformEvaluationResponse(data.data);
    } catch (error) {
      console.error('Failed to update evaluation:', error);
      throw error;
    }
  },

  // Delete evaluation
  deleteEvaluation: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${TEACHER_EVALUATION_BASE}/evaluations/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      await handleApiResponse<{
        success: boolean;
        message: string;
      }>(response);
    } catch (error) {
      console.error('Failed to delete evaluation:', error);
      throw error;
    }
  },

  // Create new development program
  createDevelopmentProgram: async (program: Omit<TeacherDevelopment, "id">): Promise<TeacherDevelopment> => {
    try {
      const response = await fetch(`${TEACHER_EVALUATION_BASE}/development-programs`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(program),
      });
      
      const data = await handleApiResponse<{
        success: boolean;
        message: string;
        data: any;
      }>(response);
      
      return transformDevelopmentResponse(data.data);
    } catch (error) {
      console.error('Failed to create development program:', error);
      throw error;
    }
  },

  // Update development program
  updateDevelopmentProgram: async (id: number, updates: Partial<TeacherDevelopment>): Promise<TeacherDevelopment> => {
    try {
      const response = await fetch(`${TEACHER_EVALUATION_BASE}/development-programs/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates),
      });
      
      const data = await handleApiResponse<{
        success: boolean;
        message: string;
        data: any;
      }>(response);
      
      return transformDevelopmentResponse(data.data);
    } catch (error) {
      console.error('Failed to update development program:', error);
      throw error;
    }
  },

  // Delete development program
  deleteDevelopmentProgram: async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${TEACHER_EVALUATION_BASE}/development-programs/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      await handleApiResponse<{
        success: boolean;
        message: string;
      }>(response);
    } catch (error) {
      console.error('Failed to delete development program:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async (): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${BASE_URL}/../health`, {
        method: 'GET',
      });
      
      return handleApiResponse<{ success: boolean; message: string }>(response);
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },
};