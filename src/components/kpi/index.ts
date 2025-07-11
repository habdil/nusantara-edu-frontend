// File: src/components/kpi/index.ts
// Export all KPI components for easier importing

export { KPIOverview } from './KPIOverview'
export { KPIStats } from './KPIStats'
export { KPICharts } from './KPIChart'
export { KPIComparison } from './KPIComparison'
export { KPITargets } from './KPITargets'

// Export API
export * from './api/kpi-api'

// Re-export types
export * from '@/types/kpi'