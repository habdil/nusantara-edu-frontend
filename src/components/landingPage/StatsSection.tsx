"use client"

import { useEffect, useState } from "react"
import { School, TrendingUp, MapPin, Clock, Users, Award, Shield, Zap } from "lucide-react"

export default function StatsSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    const section = document.getElementById('stats-section')
    if (section) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  interface AnimatedNumberProps {
    end: number
    duration?: number
    suffix?: string
  }

  const AnimatedNumber = ({ end, duration = 2000, suffix = "" }: AnimatedNumberProps) => {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
      if (!isVisible) return

      let start = 0
      const increment = end / (duration / 16)
      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCurrent(end)
          clearInterval(timer)
        } else {
          setCurrent(Math.floor(start))
        }
      }, 16)

      return () => clearInterval(timer)
    }, [isVisible, end, duration])

    return (
      <span>
        {current}
        {suffix}
      </span>
    )
  }

  const stats = [
    {
      icon: School,
      value: 100,
      suffix: "+",
      label: "Sekolah Terdaftar",
      description: "SD Negeri & Swasta",
      color: "text-orange-400",
      bgColor: "bg-orange-400/10",
      borderColor: "border-orange-400/20"
    },
    {
      icon: TrendingUp,
      value: 85,
      suffix: "%",
      label: "Peningkatan Efisiensi",
      description: "Operasional Sekolah",
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      borderColor: "border-green-400/20"
    },
    {
      icon: MapPin,
      value: 5,
      suffix: "",
      label: "Provinsi di Indonesia",
      description: "Jangkauan Nasional",
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      borderColor: "border-blue-400/20"
    },
    {
      icon: Clock,
      value: 60,
      suffix: "%",
      label: "Pengurangan Waktu Admin",
      description: "Lebih Fokus Mengajar",
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      borderColor: "border-purple-400/20"
    }
  ]

  return (
    <section 
      id="stats-section"
      className="py-24 px-4 bg-gradient-to-br from-primary via-primary/95 to-chart-3 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-400/20 rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-400/10 rounded-full blur-lg"></div>

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-white/90 text-sm font-medium mb-6">
            <Award className="w-4 h-4 mr-2 text-yellow-300" />
            Pencapaian & Dampak Nyata
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Transformasi yang 
            <span className="block text-orange-300">Terukur & Terbukti</span>
          </h2>
          
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Angka-angka ini bukan sekedar statistik, tetapi bukti nyata bagaimana NusantaraEdu 
            mengubah cara kerja sekolah-sekolah di Indonesia menjadi lebih efisien dan modern.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div
                key={index}
                className={`
                  bg-white/15 backdrop-blur-md rounded-2xl p-8 border ${stat.borderColor}
                  hover:bg-white/20 hover:scale-105 transition-all duration-500
                  ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}
                `}
                style={{
                  animationDelay: `${index * 200}ms`
                }}
              >
                {/* Icon */}
                <div className={`
                  w-16 h-16 ${stat.bgColor} rounded-2xl flex items-center justify-center mb-6
                  group-hover:scale-110 transition-transform duration-300
                `}>
                  <IconComponent className={`h-8 w-8 ${stat.color}`} />
                </div>

                {/* Number */}
                <div className="text-5xl md:text-6xl font-bold text-white mb-3 leading-none">
                  {isVisible ? (
                    <AnimatedNumber end={stat.value} suffix={stat.suffix} />
                  ) : (
                    `0${stat.suffix}`
                  )}
                </div>

                {/* Label */}
                <h3 className="text-xl font-semibold text-white/95 mb-2 leading-tight">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-white/70 text-sm leading-relaxed">
                  {stat.description}
                </p>

                {/* Progress Bar */}
                <div className="mt-4 bg-white/20 rounded-full h-2">
                  <div 
                    className={`h-2 bg-gradient-to-r from-${stat.color.split('-')[1]}-400 to-${stat.color.split('-')[1]}-300 rounded-full transition-all duration-1000 ${isVisible ? 'w-full' : 'w-0'}`}
                    style={{ 
                      transitionDelay: `${(index * 200) + 800}ms`
                    }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h4 className="text-2xl font-bold text-white mb-2">99.9%</h4>
            <p className="text-white/80 font-medium mb-1">Uptime Sistem</p>
            <p className="text-white/60 text-sm">Keandalan sistem terjamin</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h4 className="text-2xl font-bold text-white mb-2">5,000+</h4>
            <p className="text-white/80 font-medium mb-1">Pengguna Aktif</p>
            <p className="text-white/60 text-sm">Guru & staff sekolah</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
            <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h4 className="text-2xl font-bold text-white mb-2">24/7</h4>
            <p className="text-white/80 font-medium mb-1">Support Premium</p>
            <p className="text-white/60 text-sm">Tim support siaga</p>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-white/90 text-lg mb-4">
            Ingin sekolah Anda menjadi bagian dari statistik ini?
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 rounded-lg text-white font-semibold transition-colors cursor-pointer">
            Bergabung Sekarang
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  )
}