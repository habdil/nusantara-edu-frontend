import { Button } from "@/components/ui/button"
import Authentication from "@/components/auth/Authentication"

export default function Navigation() {
  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Logo SVG dari public/logo.svg */}
          <img 
            src="/logo.svg" 
            alt="NusantaraEdu Logo" 
            className="w-10 h-10"
          />
          
          {/* Brand Name */}
          <div className="flex flex-col">
            <span className="text-xl font-bold text-foreground leading-tight">
              Nusantara<span className="text-primary">Edu</span>
            </span>
            <span className="text-xs text-muted-foreground leading-tight">
              Management Information System
            </span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <a href="#home" className="text-muted-foreground hover:text-foreground transition-colors">
            Beranda
          </a>
          <a href="#fitur" className="text-muted-foreground hover:text-foreground transition-colors">
            Fitur
          </a>
          <a href="#kontak" className="text-muted-foreground hover:text-foreground transition-colors">
            Kontak
          </a>
          <Authentication trigger={<Button variant="outline">Masuk</Button>} defaultTab="login" />
          <Authentication trigger={<Button>Daftar Gratis</Button>} defaultTab="register" />
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="sm">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </div>
      </div>
    </nav>
  )
}