import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer id="kontak" className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="container mx-auto px-4 py-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.svg" 
                alt="NusantaraEdu Logo" 
                className="w-12 h-12"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-bold leading-tight">
                  Nusantara<span className="text-orange-400">Edu</span>
                </span>
                <span className="text-xs text-slate-400 leading-tight">
                  Management Information System
                </span>
              </div>
            </div>
            
            <p className="text-slate-300 leading-relaxed max-w-sm">
              Platform MIS terintegrasi yang dirancang khusus untuk transformasi digital pendidikan Indonesia dengan teknologi AI terdepan.
            </p>
            
            {/* Newsletter Signup */}
            <div className="space-y-3">
              <h5 className="font-semibold text-white">Dapatkan Update Terbaru</h5>
              <div className="flex space-x-2">
                <input 
                  type="email" 
                  placeholder="Email Anda"
                  className="flex-1 px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white px-4">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-all duration-300 group">
                <Facebook className="h-5 w-5 text-slate-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-all duration-300 group">
                <Twitter className="h-5 w-5 text-slate-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-all duration-300 group">
                <Instagram className="h-5 w-5 text-slate-400 group-hover:text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-orange-500 rounded-lg flex items-center justify-center transition-all duration-300 group">
                <Linkedin className="h-5 w-5 text-slate-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-semibold text-white text-lg">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#fitur" className="text-slate-300 hover:text-orange-400 transition-colors duration-300 flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Fitur Unggulan
                </a>
              </li>
              <li>
                <a href="#harga" className="text-slate-300 hover:text-orange-400 transition-colors duration-300 flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Paket Harga
                </a>
              </li>
              <li>
                <a href="#kontak" className="text-slate-300 hover:text-orange-400 transition-colors duration-300 flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Hubungi Kami
                </a>
              </li>
              <li>
                <a href="#blog" className="text-slate-300 hover:text-orange-400 transition-colors duration-300 flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Blog & Artikel
                </a>
              </li>
              <li>
                <a href="#demo" className="text-slate-300 hover:text-orange-400 transition-colors duration-300 flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Demo Platform
                </a>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div className="space-y-6">
            <h4 className="font-semibold text-white text-lg">Solusi Produk</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-slate-300 hover:text-orange-400 transition-colors duration-300 flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Dashboard Analytics
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-orange-400 transition-colors duration-300 flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Manajemen SDM
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-orange-400 transition-colors duration-300 flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  AI Assistant
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-orange-400 transition-colors duration-300 flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Mobile Application
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-300 hover:text-orange-400 transition-colors duration-300 flex items-center group">
                  <ArrowRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  Sistem Pelaporan
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="font-semibold text-white text-lg">Hubungi Kami</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500 transition-colors">
                  <Phone className="h-5 w-5 text-slate-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-slate-300">Telepon</p>
                  <p className="text-white font-medium">+62 21 1234 5678</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 group">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500 transition-colors">
                  <Mail className="h-5 w-5 text-slate-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-slate-300">Email</p>
                  <p className="text-white font-medium">info@nusantaraedu.id</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 group">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500 transition-colors">
                  <MapPin className="h-5 w-5 text-slate-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-slate-300">Kantor</p>
                  <p className="text-white font-medium">Jakarta Pusat, Indonesia</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-orange-500/20 to-blue-500/20 p-4 rounded-lg border border-orange-500/30">
              <h5 className="font-semibold text-white mb-2">Siap Memulai?</h5>
              <p className="text-sm text-slate-300 mb-3">Jadwalkan demo gratis dengan tim kami</p>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                Hubungi Sales
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-slate-400">
              <span>&copy; 2024 NusantaraEdu. All rights reserved.</span>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-slate-400 hover:text-orange-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-400 hover:text-orange-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-slate-400 hover:text-orange-400 transition-colors">
                Syarat & Ketentuan
              </a>
            </div>
            
            <div className="flex items-center space-x-2 text-slate-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>in Indonesia</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}