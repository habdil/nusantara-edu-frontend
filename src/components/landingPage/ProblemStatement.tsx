import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Database, TrendingUp } from "lucide-react"

export default function ProblemStatement() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Tantangan Kepala Sekolah di Era Digital
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center border-red-200 bg-red-50/50">
            <CardHeader>
              <Clock className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-red-700">15-20 jam/minggu</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">untuk tugas administratif yang seharusnya bisa dioptimalkan</p>
            </CardContent>
          </Card>

          <Card className="text-center border-orange-200 bg-orange-50/50">
            <CardHeader>
              <Database className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <CardTitle className="text-orange-700">Data Tersebar</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Data sekolah tersebar di berbagai sistem dan sulit diakses</p>
            </CardContent>
          </Card>

          <Card className="text-center border-yellow-200 bg-yellow-50/50">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <CardTitle className="text-yellow-700">Keputusan Lambat</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Pengambilan keputusan lambat karena kurangnya insight data</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
