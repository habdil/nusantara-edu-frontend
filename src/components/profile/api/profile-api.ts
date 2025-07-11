// Real API client untuk Profile Management
// Hanya bagian GET endpoints saja

// Keep the same interfaces untuk backward compatibility
export interface UserProfile {
  id: number
  username: string
  email: string
  role: "admin" | "principal" | "teacher" | "school_admin_staff" | "education_department"
  fullName: string
  phoneNumber?: string
  profilePicture?: string
  lastLogin?: string
  createdAt: string
  updatedAt?: string
  isActive: boolean
}

export interface SchoolInfo {
  id: number
  npsn: string
  schoolName: string
  fullAddress: string
  postalCode?: string
  phoneNumber?: string
  email?: string
  website?: string
  totalStudents?: number
  totalTeachers?: number
  totalStaff?: number
  establishedYear?: number
  accreditation?: string
  logoUrl?: string
  latitude?: number
  longitude?: number
}

export interface ProfileResponse {
  id: number
  username: string
  email: string
  role: string
  fullName: string
  phoneNumber?: string
  profilePicture?: string
  lastLogin?: string
  createdAt: string
  school?: SchoolInfo
}

// ==================== API CONFIGURATION ====================
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const PROFILE_BASE = `${BASE_URL}/api/auth`;

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
const transformProfileResponse = (apiData: any): UserProfile => {
  if (!apiData) {
    throw new Error('Invalid profile data received from API');
  }

  return {
    id: apiData.id || 0,
    username: apiData.username || '',
    email: apiData.email || '',
    role: apiData.role || 'principal',
    fullName: apiData.fullName || apiData.full_name || '',
    phoneNumber: apiData.phoneNumber || apiData.phone_number,
    profilePicture: apiData.profilePicture || apiData.profile_picture,
    lastLogin: apiData.lastLogin || apiData.last_login,
    createdAt: apiData.createdAt || apiData.created_at || '',
    updatedAt: apiData.updatedAt || apiData.updated_at,
    isActive: apiData.isActive !== undefined ? apiData.isActive : apiData.is_active !== undefined ? apiData.is_active : true,
  };
};

const transformSchoolResponse = (apiData: any): SchoolInfo => {
  if (!apiData) {
    throw new Error('Invalid school data received from API');
  }

  return {
    id: apiData.id || 0,
    npsn: apiData.npsn || '',
    schoolName: apiData.schoolName || apiData.school_name || '',
    fullAddress: apiData.fullAddress || apiData.full_address || '',
    postalCode: apiData.postalCode || apiData.postal_code,
    phoneNumber: apiData.phoneNumber || apiData.phone_number,
    email: apiData.email,
    website: apiData.website,
    totalStudents: apiData.totalStudents || apiData.total_students,
    totalTeachers: apiData.totalTeachers || apiData.total_teachers,
    totalStaff: apiData.totalStaff || apiData.total_staff,
    establishedYear: apiData.establishedYear || apiData.established_year,
    accreditation: apiData.accreditation,
    logoUrl: apiData.logoUrl || apiData.logo_url,
    latitude: apiData.latitude,
    longitude: apiData.longitude,
  };
};

// ==================== API FUNCTIONS ====================
export const profileApi = {
  // Get user profile
  getProfile: async (): Promise<{ profile: UserProfile; school?: SchoolInfo }> => {
    try {
      const response = await fetch(`${PROFILE_BASE}/profile`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      
      const data = await handleApiResponse<{
        success: boolean;
        message: string;
        data: ProfileResponse;
      }>(response);
      
      // Debug logging untuk lihat struktur response
      console.log('Profile API Response:', data);
      
      // Transform API response sesuai dengan format yang diharapkan
      const profile = transformProfileResponse(data.data);
      const school = data.data.school ? transformSchoolResponse(data.data.school) : undefined;
      
      return { profile, school };
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  },

};