"use client"

import { useState, useEffect } from "react"
import { EvaluationHeader } from "./EvaluationHeader"
import { EvaluationStats } from "./EvaluationStats"
import { EvaluationFilters } from "./EvaluationFilters"
import { TeacherEvaluationTable } from "./TeacherEvaluationTable"
import {
  teacherEvaluationApi,
  type TeacherEvaluation,
  type EvaluationStats as StatsType,
} from "./api/teacher-evaluation-api"

interface FilterState {
  search: string
  academicYear: string
  evaluationPeriod: string
  subjectArea: string
  status: string
}

export function TeacherEvaluationDashboard() {
  const [evaluations, setEvaluations] = useState<TeacherEvaluation[]>([])
  const [stats, setStats] = useState<StatsType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isStatsLoading, setIsStatsLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    academicYear: "",
    evaluationPeriod: "",
    subjectArea: "",
    status: "",
  })

  // Load initial data
  useEffect(() => {
    loadEvaluations()
    loadStats()
  }, [])

  // Load evaluations when filters change
  useEffect(() => {
    loadEvaluations()
  }, [filters])

  const loadEvaluations = async () => {
    try {
      setIsLoading(true)
      const data = await teacherEvaluationApi.getEvaluations(filters)
      setEvaluations(data)
    } catch (error) {
      console.error("Error loading evaluations:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      setIsStatsLoading(true)
      const data = await teacherEvaluationApi.getEvaluationStats()
      setStats(data)
    } catch (error) {
      console.error("Error loading stats:", error)
    } finally {
      setIsStatsLoading(false)
    }
  }

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  const handleAddEvaluation = () => {
    // TODO: Implement add evaluation modal
    console.log("Add evaluation clicked")
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export clicked")
  }

  const handleViewDetails = (evaluation: TeacherEvaluation) => {
    // TODO: Implement view details modal
    console.log("View details:", evaluation)
  }

  const handleEdit = (evaluation: TeacherEvaluation) => {
    // TODO: Implement edit evaluation modal
    console.log("Edit evaluation:", evaluation)
  }

  const handleGenerateReport = (evaluation: TeacherEvaluation) => {
    // TODO: Implement report generation
    console.log("Generate report:", evaluation)
  }

  return (
    <div className="space-y-6">
      <EvaluationHeader
        onAddEvaluation={handleAddEvaluation}
        onExport={handleExport}
        onFilter={() => setShowFilters(!showFilters)}
      />

      {stats && <EvaluationStats stats={stats} isLoading={isStatsLoading} />}

      <EvaluationFilters
        onFiltersChange={handleFiltersChange}
        isVisible={showFilters}
        onClose={() => setShowFilters(false)}
      />

      <TeacherEvaluationTable
        evaluations={evaluations}
        isLoading={isLoading}
      />
    </div>
  )
}
