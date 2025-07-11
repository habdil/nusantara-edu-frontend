import { Button } from "@/components/ui/button"
import { BarChart3, Users, Brain, ArrowRight, CheckCircle, Clock, TrendingUp } from "lucide-react"

export default function HeroSection() {
  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-background via-blue-50/30 to-orange-50/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[80vh]">
          
          {/* Left Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary">
              <TrendingUp className="w-4 h-4 mr-2" />
              Transformasi Digital Pendidikan #1 di Indonesia
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Sistem Informasi
                <span className="block text-secondary">Terintegrasi</span>
                <span className="block">untuk Kepala Sekolah</span>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                Mengurangi beban administratif hingga <span className="font-semibold text-secondary">60%</span> dengan 
                AI-powered dashboard, analytics cerdas, dan sistem pelaporan otomatis.
              </p>
            </div>

            {/* Key Benefits */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-muted-foreground">Dashboard real-time dengan AI insights</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-muted-foreground">Otomatisasi laporan ke Dinas Pendidikan</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-muted-foreground">Manajemen SDM dan aset terintegrasi</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="text-lg px-8 py-4 bg-primary hover:bg-primary/90 shadow-lg">
                Mulai Gratis Sekarang
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-primary/20 hover:bg-primary/5">
                <Clock className="mr-2 h-5 w-5" />
                Jadwalkan Demo
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center space-x-8 pt-8 border-t border-border/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">3</div>
                <div className="text-sm text-muted-foreground">Sekolah</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">60%</div>
                <div className="text-sm text-muted-foreground">Efisiensi</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">1 Provinsi</div>
                <div className="text-sm text-muted-foreground">Jangkauan</div>
              </div>
            </div>
          </div>

          {/* Right Content - 3D Image */}
          <div className="relative">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl scale-110"></div>
            
            {/* Main Image Container */}
            <div className="relative">
              <img 
                src="/image/hero-section.png" 
                alt="NusantaraEdu - Sistem Manajemen Sekolah" 
                className="w-full h-auto object-contain drop-shadow-2xl"
              />
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 bg-card border border-border rounded-xl p-3 shadow-lg animate-bounce">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl p-3 shadow-lg animate-pulse">
                <Brain className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div id="fitur" className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Fitur Unggulan NusantaraEdu
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Solusi komprehensif yang dirancang khusus untuk kebutuhan kepala sekolah dasar di Indonesia
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Dashboard Analytics</h3>
              <p className="text-muted-foreground leading-relaxed">
                Visualisasi data real-time dengan insight AI untuk pengambilan keputusan yang lebih baik dan cepat.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-secondary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Manajemen SDM</h3>
              <p className="text-muted-foreground leading-relaxed">
                Kelola data guru, evaluasi kinerja, dan pengembangan profesional dalam satu platform terintegrasi.
              </p>
            </div>

            <div className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="bg-accent/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Brain className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">AI Assistant</h3>
              <p className="text-muted-foreground leading-relaxed">
                Asisten cerdas yang memberikan rekomendasi, prediksi, dan otomatisasi laporan administrasi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}