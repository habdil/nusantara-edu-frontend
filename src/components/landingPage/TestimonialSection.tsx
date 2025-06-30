import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star } from "lucide-react"

export default function TestimonialSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Apa Kata Kepala Sekolah</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <CardTitle className="text-lg">Ibu Sari Wijaya</CardTitle>
              <CardDescription>Kepala SD Nusantara 1, Jakarta</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground italic">
                "NusantaraEdu benar-benar mengubah cara kami mengelola sekolah. Waktu administratif berkurang drastis
                dan keputusan bisa diambil lebih cepat."
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <CardTitle className="text-lg">Bapak Ahmad Hidayat</CardTitle>
              <CardDescription>Kepala SD Merdeka, Bandung</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground italic">
                "Dashboard analytics sangat membantu dalam monitoring performa sekolah. Fitur AI-nya juga memberikan
                insight yang tidak pernah terpikirkan sebelumnya."
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <CardTitle className="text-lg">Ibu Dewi Kartika</CardTitle>
              <CardDescription>Kepala SD Harapan, Surabaya</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground italic">
                "Sistem peringatan dini sangat membantu dalam mencegah masalah sebelum terjadi. Tim support juga sangat
                responsif dan helpful."
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
