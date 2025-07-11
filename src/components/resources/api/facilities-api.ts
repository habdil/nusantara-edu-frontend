import type { Facility, ConditionStatus } from "@/types/resources"

const mockFacilities: Facility[] = [
  {
    id: 1,
    schoolId: 1,
    facilityName: "Ruang Kelas 6A",
    facilityType: "Classroom",
    capacity: 30,
    location: "Lantai 2, Gedung Utama",
    condition: "good" as ConditionStatus,
    notes: "Ruang kelas dengan fasilitas lengkap",
    facilityPhoto: "/placeholder.svg?height=300&width=400",
    createdAt: new Date("2023-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: 2,
    schoolId: 1,
    facilityName: "Laboratorium Komputer",
    facilityType: "Laboratory",
    capacity: 25,
    location: "Lantai 1, Gedung Utama",
    condition: "good" as ConditionStatus,
    notes: "Lab komputer dengan 25 unit PC",
    facilityPhoto: "/placeholder.svg?height=300&width=400",
    createdAt: new Date("2023-02-15"),
    updatedAt: new Date("2024-02-15"),
  },
  {
    id: 3,
    schoolId: 1,
    facilityName: "Perpustakaan",
    facilityType: "Library",
    capacity: 50,
    location: "Lantai 1, Gedung Utama",
    condition: "minor_damage" as ConditionStatus,
    notes: "Perlu perbaikan rak buku bagian belakang",
    facilityPhoto: "/placeholder.svg?height=300&width=400",
    createdAt: new Date("2022-12-01"),
    updatedAt: new Date("2024-03-01"),
  },
  {
    id: 4,
    schoolId: 1,
    facilityName: "Lapangan Olahraga",
    facilityType: "Sports Field",
    capacity: 100,
    location: "Area Belakang Sekolah",
    condition: "good" as ConditionStatus,
    notes: "Lapangan serbaguna untuk berbagai olahraga",
    facilityPhoto: "/placeholder.svg?height=300&width=400",
    createdAt: new Date("2023-03-20"),
    updatedAt: new Date("2024-03-20"),
  },
]

export const facilitiesApi = {
  // Get all facilities
  getFacilities: async (): Promise<Facility[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return mockFacilities
  },

  // Get facility by ID
  getFacilityById: async (id: number): Promise<Facility | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return mockFacilities.find((facility) => facility.id === id) || null
  },

  // Get facilities by type
  getFacilitiesByType: async (type: string): Promise<Facility[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return mockFacilities.filter((facility) => facility.facilityType === type)
  },

  // Add new facility
  addFacility: async (facility: Omit<Facility, "id" | "createdAt" | "updatedAt">): Promise<Facility> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const newFacility: Facility = {
      ...facility,
      id: mockFacilities.length + 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockFacilities.push(newFacility)
    return newFacility
  },

  // Update facility
  updateFacility: async (id: number, updates: Partial<Facility>): Promise<Facility | null> => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const index = mockFacilities.findIndex((facility) => facility.id === id)
    if (index === -1) return null

    mockFacilities[index] = { ...mockFacilities[index], ...updates, updatedAt: new Date() }
    return mockFacilities[index]
  },

  // Delete facility
  deleteFacility: async (id: number): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const index = mockFacilities.findIndex((facility) => facility.id === id)
    if (index === -1) return false

    mockFacilities.splice(index, 1)
    return true
  },
}
