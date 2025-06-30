import Navigation from "@/components/landingPage/Navigation"
import HeroSection from "@/components/landingPage/HeroSection"
import CTASection from "@/components/landingPage/CTASection"
import Footer from "@/components/landingPage/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <CTASection />
      <Footer />
    </div>
  )
}
