// src/components/academics/api/grade-analysis-api.ts

import { apiClient } from "@/services/api"
import type {
  GradeDistributionItem,
  SubjectAverage,
  GetGradeDistributionParams,
  GetSubjectAveragesParams,
} from "@/types/academic";

/**
 * API service for grade analysis and distribution
 */
class GradeAnalysisApi {
  private readonly baseEndpoint = "/academic";

  constructor() {
    // Constructor can be empty or have initialization logic
  }

  /**
   * Get grade distribution by grade categories (A, B, C, D, E)
   */
  async getGradeDistribution(params?: GetGradeDistributionParams): Promise<GradeDistributionItem[]> {
    let queryParams: Record<string, string | number> | undefined;
    
    if (params) {
      queryParams = {};
      if (params.academicYear) queryParams.academicYear = params.academicYear;
      if (params.semester) queryParams.semester = params.semester;
      if (params.gradeLevel) queryParams.gradeLevel = params.gradeLevel;
    }

    const response = await apiClient.get<GradeDistributionItem[]>(
      `${this.baseEndpoint}/grade-distribution`,
      {
        params: queryParams,
        requireAuth: true,
      }
    );
    
    if (!response.data) {
      throw new Error('No data received from server');
    }
    
    return response.data;
  }

  /**
   * Get subject averages with trend analysis
   */
  async getSubjectAverages(params?: GetSubjectAveragesParams): Promise<SubjectAverage[]> {
    let queryParams: Record<string, string | number> | undefined;
    
    if (params) {
      queryParams = {};
      if (params.academicYear) queryParams.academicYear = params.academicYear;
      if (params.semester) queryParams.semester = params.semester;
      if (params.gradeLevel) queryParams.gradeLevel = params.gradeLevel;
    }

    const response = await apiClient.get<SubjectAverage[]>(
      `${this.baseEndpoint}/subject-averages`,
      {
        params: queryParams,
        requireAuth: true,
      }
    );
    
    if (!response.data) {
      throw new Error('No data received from server');
    }
    
    return response.data;
  }
}

// Create and export a single instance
const gradeAnalysisApi = new GradeAnalysisApi();

// Export the instance and individual methods
export { gradeAnalysisApi };
export const getGradeDistribution = (params?: GetGradeDistributionParams) => 
  gradeAnalysisApi.getGradeDistribution(params);
export const getSubjectAverages = (params?: GetSubjectAveragesParams) => 
  gradeAnalysisApi.getSubjectAverages(params);