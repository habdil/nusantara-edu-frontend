import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, BookOpen, Package, UserCheck, AlertTriangle, MessageCircle } from "lucide-react"

export default function FeaturesHighlight() {
  return (
    <section id="fitur" className="py-20 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Fitur Lengkap untuk Manajemen Sekolah</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <DollarSign className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Manajemen Keuangan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Kelola anggaran, pembayaran, dan laporan keuangan sekolah</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Performa Akademik</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Pantau prestasi siswa dan efektivitas pembelajaran</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Package className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Inventarisasi Aset</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Kelola aset dan fasilitas sekolah secara digital</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <UserCheck className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle>Evaluasi Kinerja Guru</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Sistem penilaian dan pengembangan SDM pendidik</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <AlertTriangle className="h-8 w-8 text-red-600 mb-2" />
              <CardTitle>Sistem Peringatan Dini</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Deteksi masalah potensial sebelum menjadi kritis</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <MessageCircle className="h-8 w-8 text-indigo-600 mb-2" />
              <CardTitle>Chat AI Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Bantuan cerdas untuk pertanyaan dan analisis data</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
