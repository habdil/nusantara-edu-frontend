import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, BarChart3, TrendingUp, Brain } from "lucide-react"

export default function KeyBenefits() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Mengapa 100+ Sekolah Memilih NusantaraEdu
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center bg-blue-50 border-blue-200">
            <CardHeader>
              <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-blue-700">Hemat 60% Waktu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Administratif otomatis dan efisien</p>
            </CardContent>
          </Card>

          <Card className="text-center bg-green-50 border-green-200">
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-green-700">Keputusan Berbasis Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analytics mendalam untuk insight akurat</p>
            </CardContent>
          </Card>

          <Card className="text-center bg-purple-50 border-purple-200">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle className="text-purple-700">Monitoring Real-time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Pantau performa sekolah secara langsung</p>
            </CardContent>
          </Card>

          <Card className="text-center bg-orange-50 border-orange-200">
            <CardHeader>
              <Brain className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle className="text-orange-700">Prediksi AI</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Optimasi sumber daya dengan AI</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
