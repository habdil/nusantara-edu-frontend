// Custom React Hooks untuk Teacher Evaluation API
// Menggunakan teacherEvaluationApi yang sudah ada dengan structure hooks yang proper

import { useState, useEffect, useCallback } from 'react';
import { teacherEvaluationApi, type TeacherEvaluation, type TeacherDevelopment, type EvaluationStats } from './teacher-evaluation-api';

// ==================== BASE HOOK TYPES ====================
interface BaseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface BaseListState<T> {
  data: T[];
  loading: boolean;
  error: string | null;
}

// ==================== EVALUATION HOOKS ====================

/**
 * Hook untuk mendapatkan statistik evaluasi
 */
export const useEvaluationStats = () => {
  const [state, setState] = useState<BaseApiState<EvaluationStats>>({
    data: null,
    loading: true,
    error: null,
  });

  const fetchStats = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const data = await teacherEvaluationApi.getEvaluationStats();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Gagal memuat statistik evaluasi' 
      });
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    ...state,
    refetch: fetchStats,
  };
};

/**
 * Hook untuk mendapatkan list evaluasi dengan filtering
 */
export const useEvaluations = (initialFilters?: {
  academicYear?: string;
  evaluationPeriod?: string;
  subjectArea?: string;
  status?: string;
  search?: string;
}) => {
  const [state, setState] = useState<BaseListState<TeacherEvaluation> & {
    filters: typeof initialFilters;
    selectedItems: number[];
  }>({
    data: [],
    loading: true,
    error: null,
    filters: initialFilters || {},
    selectedItems: [],
  });

  const fetchEvaluations = useCallback(async (filters?: typeof initialFilters) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const data = await teacherEvaluationApi.getEvaluations(filters || state.filters);
      setState(prev => ({
        ...prev,
        data,
        loading: false,
        error: null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        data: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Gagal memuat data evaluasi',
      }));
    }
  }, [state.filters]);

  const updateFilters = useCallback((newFilters: Partial<typeof initialFilters>) => {
    const updatedFilters = { ...state.filters, ...newFilters };
    setState(prev => ({ ...prev, filters: updatedFilters }));
    fetchEvaluations(updatedFilters);
  }, [state.filters, fetchEvaluations]);

  const setSelectedItems = useCallback((items: number[]) => {
    setState(prev => ({ ...prev, selectedItems: items }));
  }, []);

  const clearFilters = useCallback(() => {
    const emptyFilters = {};
    setState(prev => ({ ...prev, filters: emptyFilters }));
    fetchEvaluations(emptyFilters);
  }, [fetchEvaluations]);

  useEffect(() => {
    fetchEvaluations();
  }, [fetchEvaluations]);

  return {
    evaluations: state.data,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    selectedItems: state.selectedItems,
    refetch: fetchEvaluations,
    updateFilters,
    setSelectedItems,
    clearFilters,
  };
};

/**
 * Hook untuk mendapatkan single evaluation by ID
 */
export const useEvaluation = (id: number | null) => {
  const [state, setState] = useState<BaseApiState<TeacherEvaluation>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchEvaluation = useCallback(async () => {
    if (!id) return;
    
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      // Karena API mock tidak ada getById, kita ambil dari getEvaluations dan filter
      const evaluations = await teacherEvaluationApi.getEvaluations();
      const evaluation = evaluations.find(e => e.id === id);
      
      if (evaluation) {
        setState({ data: evaluation, loading: false, error: null });
      } else {
        setState({ data: null, loading: false, error: 'Evaluasi tidak ditemukan' });
      }
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Gagal memuat data evaluasi' 
      });
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchEvaluation();
    }
  }, [fetchEvaluation, id]);

  return {
    evaluation: state.data,
    loading: state.loading,
    error: state.error,
    refetch: fetchEvaluation,
  };
};

/**
 * Hook untuk create/update evaluation dengan optimistic updates
 */
export const useEvaluationMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createEvaluation = useCallback(async (data: Omit<TeacherEvaluation, 'id'>) => {
    try {
      setLoading(true);
      setError(null);
      const newEvaluation = await teacherEvaluationApi.createEvaluation(data);
      setLoading(false);
      return newEvaluation;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal membuat evaluasi';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  }, []);

  const updateEvaluation = useCallback(async (id: number, data: Partial<TeacherEvaluation>) => {
    try {
      setLoading(true);
      setError(null);
      const updatedEvaluation = await teacherEvaluationApi.updateEvaluation(id, data);
      setLoading(false);
      return updatedEvaluation;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Gagal mengupdate evaluasi';
      setError(errorMessage);
      setLoading(false);
      throw new Error(errorMessage);
    }
  }, []);

  return {
    createEvaluation,
    updateEvaluation,
    loading,
    error,
    clearError: () => setError(null),
  };
};

// ==================== DEVELOPMENT PROGRAM HOOKS ====================

/**
 * Hook untuk mendapatkan list development programs
 */
export const useDevelopmentPrograms = (teacherId?: number) => {
  const [state, setState] = useState<BaseListState<TeacherDevelopment>>({
    data: [],
    loading: true,
    error: null,
  });

  const fetchPrograms = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const data = await teacherEvaluationApi.getDevelopmentPrograms(teacherId);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Gagal memuat data program pengembangan',
      });
    }
  }, [teacherId]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms]);

  return {
    programs: state.data,
    loading: state.loading,
    error: state.error,
    refetch: fetchPrograms,
  };
};

/**
 * Hook untuk mendapatkan development programs by teacher ID
 */
export const useTeacherDevelopmentPrograms = (teacherId: number | null) => {
  const [state, setState] = useState<BaseListState<TeacherDevelopment>>({
    data: [],
    loading: false,
    error: null,
  });

  const fetchPrograms = useCallback(async () => {
    if (!teacherId) return;
    
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const data = await teacherEvaluationApi.getDevelopmentPrograms(teacherId);
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({
        data: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Gagal memuat program pengembangan guru',
      });
    }
  }, [teacherId]);

  useEffect(() => {
    if (teacherId) {
      fetchPrograms();
    }
  }, [fetchPrograms, teacherId]);

  return {
    programs: state.data,
    loading: state.loading,
    error: state.error,
    refetch: fetchPrograms,
  };
};

// ==================== UTILITY HOOKS ====================

/**
 * Hook untuk mendapatkan options untuk filter dropdown
 */
export const useEvaluationFilterOptions = () => {
  const [options, setOptions] = useState({
    academicYears: [] as string[],
    evaluationPeriods: [] as string[],
    subjectAreas: [] as string[],
    statuses: [] as string[],
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const evaluations = await teacherEvaluationApi.getEvaluations();
        
        const academicYears = [...new Set(evaluations.map(e => e.academicYear))];
        const evaluationPeriods = [...new Set(evaluations.map(e => e.evaluationPeriod))];
        const subjectAreas = [...new Set(evaluations.map(e => e.subjectArea))];
        const statuses = [...new Set(evaluations.map(e => e.status))];
        
        setOptions({
          academicYears,
          evaluationPeriods,
          subjectAreas,
          statuses,
        });
      } catch (error) {
        console.error('Failed to fetch filter options:', error);
      }
    };

    fetchOptions();
  }, []);

  return options;
};

/**
 * Hook untuk search functionality
 */
export const useEvaluationSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<TeacherEvaluation[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const results = await teacherEvaluationApi.getEvaluations({ search: term });
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      search(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, search]);

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    loading,
    clearSearch: () => {
      setSearchTerm('');
      setSearchResults([]);
    },
  };
};