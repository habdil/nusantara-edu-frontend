import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Users, Brain } from "lucide-react"

export default function SolutionOverview() {
  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Solusi Komprehensif dalam Satu Platform
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="h-16 w-16 text-primary mx-auto mb-4" />
              <CardTitle>Dashboard Eksekutif</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Real-time KPI dan monitoring performa sekolah dalam satu tampilan</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <CardTitle>Manajemen Terintegrasi</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Kelola semua sumber daya sekolah dari guru hingga fasilitas</p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Brain className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <CardTitle>AI Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Prediksi dan rekomendasi cerdas untuk optimasi operasional</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
