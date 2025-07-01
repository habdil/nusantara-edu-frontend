// src/components/academics/api/attendance-analysis-api.ts

import { apiClient } from "@/services/api"
import type {
  AttendanceSummary,
  GetAttendanceSummaryParams,
} from "@/types/academic";

/**
 * API service for attendance analysis and reporting
 */
class AttendanceAnalysisApi {
  private readonly baseEndpoint = "/academic";

  constructor() {
    // Constructor can be empty or have initialization logic
  }

  /**
   * Get attendance summary with overall stats and class breakdown
   */
  async getAttendanceSummary(params?: GetAttendanceSummaryParams): Promise<AttendanceSummary> {
    let queryParams: Record<string, string | number> | undefined;
    
    if (params) {
      queryParams = {};
      if (params.academicYear) queryParams.academicYear = params.academicYear;
      if (params.semester) queryParams.semester = params.semester;
    }

    const response = await apiClient.get<AttendanceSummary>(
      `${this.baseEndpoint}/attendance-summary`,
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
const attendanceAnalysisApi = new AttendanceAnalysisApi();

// Export the instance and individual methods
export { attendanceAnalysisApi };
export const getAttendanceSummary = (params?: GetAttendanceSummaryParams) => 
  attendanceAnalysisApi.getAttendanceSummary(params);