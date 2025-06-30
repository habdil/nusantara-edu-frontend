"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Mail, Phone, CheckCircle, Star, Users, Zap, Shield } from "lucide-react"
import { useState } from "react"

export default function CTASection() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Reset form
    setEmail("")
    setIsSubmitting(false)

    // You can add actual form submission logic here
    console.log("Email submitted:", email)
  }

  return (
    <section className="py-24 px-4 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-primary/90">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 via-transparent to-slate-900/50"></div>
      
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,white_1px,transparent_1px)] bg-[length:50px_50px] animate-pulse"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-white/10 rounded-full animate-bounce"></div>
      <div className="absolute top-40 right-20 w-6 h-6 bg-orange-400/20 rounded-full animate-bounce delay-1000"></div>
      <div className="absolute bottom-20 left-20 w-3 h-3 bg-white/20 rounded-full animate-bounce delay-500"></div>

      <div className="container mx-auto text-center relative z-10 max-w-6xl">
        
        {/* Header Section */}
        <div className="mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-white/90 text-sm font-medium mb-6">
            <Star className="w-4 h-4 mr-2 text-yellow-300" />
            Dipercaya 100+ Sekolah se-Indonesia
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Transformasi Digital
            <span className="block text-orange-300">Dimulai Dari Sini</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed">
            Bergabunglah dengan revolusi pendidikan Indonesia. Dapatkan sistem yang 
            <span className="font-semibold text-orange-300"> menghemat 60% waktu administratif</span> Anda.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 max-w-5xl mx-auto">
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-4xl font-bold text-orange-300 mb-2">60%</div>
            <div className="text-white/80 text-sm font-medium">Efisiensi Waktu</div>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-4xl font-bold text-orange-300 mb-2">24/7</div>
            <div className="text-white/80 text-sm font-medium">Support Premium</div>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-4xl font-bold text-orange-300 mb-2">100%</div>
            <div className="text-white/80 text-sm font-medium">Gratis Trial</div>
          </div>
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
            <div className="text-4xl font-bold text-orange-300 mb-2">5★</div>
            <div className="text-white/80 text-sm font-medium">Rating Pengguna</div>
          </div>
        </div>

        {/* Main CTA Form */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-white/98 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-white/30 relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-orange-500/20 rounded-3xl blur-xl scale-105 -z-10"></div>
            
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-foreground mb-3">
                Dapatkan Demo Eksklusif 
                <span className="text-primary"> Gratis</span>
              </h3>
              <p className="text-lg text-muted-foreground">
                Lihat langsung transformasi yang akan terjadi di sekolah Anda dalam 30 menit demo personal
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-left block text-foreground font-semibold text-lg">
                  Email Kepala Sekolah
                </Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="kepala.sekolah@sekolahanda.sch.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-12 h-14 text-lg bg-background border-2 border-border focus:ring-2 focus:ring-primary focus:border-primary rounded-xl"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  className="flex-1 h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                      Memproses Demo...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-3 h-5 w-5" />
                      Daftar Demo Gratis
                      <ArrowRight className="ml-3 h-5 w-5" />
                    </>
                  )}
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 text-lg font-bold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 rounded-xl px-8"
                >
                  <Phone className="mr-3 h-5 w-5" />
                  Hubungi Langsung
                </Button>
              </div>
            </div>

            {/* Benefits List */}
            <div className="mt-8 pt-8 border-t border-border/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-muted-foreground">Setup dalam 24 jam</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-muted-foreground">Data aman & terjamin</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span className="text-muted-foreground">Training tim gratis</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators & Testimonials */}
        <div className="space-y-8">
          <div className="text-center">
            <p className="text-white/90 mb-6 text-xl font-medium">
              Dipercaya oleh sekolah-sekolah terdepan di Indonesia
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/80 font-medium">SD Nusantara Jakarta</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                  <span className="text-white/80 font-medium">SD Merdeka Bandung</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse delay-600"></div>
                  <span className="text-white/80 font-medium">SD Harapan Surabaya</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse delay-900"></div>
                  <span className="text-white/80 font-medium">SD Pancasila Yogya</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Testimonial */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="flex items-center justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-white/90 text-lg italic mb-4">
                "NusantaraEdu benar-benar mengubah cara kami mengelola sekolah. Yang tadinya butuh 3 jam untuk laporan, 
                sekarang hanya 30 menit!"
              </blockquote>
              <cite className="text-orange-300 font-medium">
                - Ibu Sari Dewi, Kepala Sekolah SD Harapan Bangsa
              </cite>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}