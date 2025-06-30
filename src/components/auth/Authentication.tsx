"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Sparkles } from "lucide-react"
import { useAuthContext } from "@/middleware/AuthContext"
import { toast } from "sonner"
import { AuthenticationProps } from "./types/auth.types"
import { useAuthForm } from "./hooks/useAuthForm"
import { validateLoginData, validateRegisterData } from "./utils/validation"
import { LoginForm } from "./components/LoginForm"
import { RegisterForm } from "./components/RegisterForm"
import Image from "next/image"

export default function Authentication({ trigger, defaultTab = "login", onSuccess }: AuthenticationProps) {
  const router = useRouter()
  const { login, register, isLoading, error, clearError, isAuthenticated } = useAuthContext()

  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(defaultTab)

  const {
    showPassword,
    setShowPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    loginData,
    setLoginData,
    registerData,
    setRegisterData,
    resetForms,
    getPasswordValidationErrors,
  } = useAuthForm()

  // Close dialog if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setIsOpen(false)
    }
  }, [isAuthenticated])

  // Clear error when switching tabs - memoized to prevent infinite loops
  const handleTabChange = useCallback(
    (value: string) => {
      setActiveTab(value as "login" | "register")
      clearError()
    },
    [clearError],
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!validateLoginData(loginData)) return

    try {
      const response = await login({
        username: loginData.username.trim(),
        password: loginData.password,
      })

      if (response.success) {
        toast.success("Login Berhasil! 🎉", {
          description: `Selamat datang kembali, ${response.data.user.fullName}! Mengalihkan ke dashboard...`,
          duration: 2000,
        })

        setLoginData({ username: "", password: "" })
        setIsOpen(false)

        setTimeout(() => {
          if (onSuccess) {
            onSuccess()
          } else {
            window.location.href = "/dashboard"
          }
        }, 500)
      }
    } catch (err: any) {
      const errorMessage = err.message || "Terjadi kesalahan saat login"
      toast.error("Login Gagal", {
        description: errorMessage,
        duration: 4000,
      })
      console.error("Login error:", err)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()

    if (!validateRegisterData(registerData)) return

    try {
      const response = await register({
        username: registerData.username.trim(),
        email: registerData.email.trim(),
        password: registerData.password,
        fullName: registerData.fullName.trim(),
        phoneNumber: registerData.phoneNumber.trim() || undefined,
        npsn: registerData.npsn.trim(),
      })

      if (response.success) {
        toast.success("Registrasi Berhasil! 🎉", {
          description: `Selamat datang di NusantaraEdu, ${response.data.user.fullName}! Mengalihkan ke dashboard...`,
          duration: 2000,
        })

        setRegisterData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          fullName: "",
          phoneNumber: "",
          npsn: "",
        })

        setIsOpen(false)

        setTimeout(() => {
          if (onSuccess) {
            onSuccess()
          } else {
            window.location.href = "/dashboard"
          }
        }, 500)
      }
    } catch (err: any) {
      const errorMessage = err.message || "Terjadi kesalahan saat mendaftar"
      toast.error("Registrasi Gagal", {
        description: errorMessage,
        duration: 4000,
      })
      console.error("Register error:", err)
    }
  }

  const passwordErrors = getPasswordValidationErrors()

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open)
        if (!open) resetForms()
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm border-border/50 text-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 shadow-sm hover:shadow-md group"
          >
            <Shield className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
            Masuk
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg max-h-[95vh] overflow-y-auto border-border/50 bg-card/95 backdrop-blur-md">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-primary/20 via-secondary/10 to-transparent rounded-full -translate-y-20 translate-x-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-secondary/20 via-primary/10 to-transparent rounded-full translate-y-16 -translate-x-16"></div>
        
        <DialogHeader className="text-center space-y-6 relative z-10">
          {/* Logo and Brand Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-secondary/30 to-primary/30 rounded-2xl blur-xl scale-110 animate-pulse"></div>
              
              {/* Logo container */}
              <div className="relative bg-gradient-to-br from-background via-background/90 to-background/80 p-4 rounded-2xl shadow-2xl border border-border/50 backdrop-blur-sm">
                <Image
                  src="/logo.svg"
                  alt="NusantaraEdu Logo"
                  width={56}
                  height={56}
                  className="w-14 h-14 object-contain"
                  priority
                />
                
                {/* Sparkle effects */}
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="h-4 w-4 text-secondary animate-pulse" />
                </div>
                <div className="absolute -bottom-1 -left-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
                </div>
              </div>
            </div>
            
            {/* Brand name with enhanced styling */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-gradient bg-300% relative">
                NusantaraEdu
                {/* Subtle underline effect */}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60"></div>
              </h1>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                Platform Digital Terdepan untuk Manajemen Sekolah Dasar di Indonesia
              </p>
            </div>
          </div>

          {/* Dynamic Title and Description */}
          <div className="space-y-3">
            <DialogTitle className="text-2xl font-bold text-foreground">
              {activeTab === "login" ? (
                <span className="flex items-center justify-center space-x-2">
                  <Shield className="h-6 w-6 text-primary" />
                  <span>Selamat Datang Kembali</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2">
                  <Sparkles className="h-6 w-6 text-secondary" />
                  <span>Bergabung dengan NusantaraEdu</span>
                </span>
              )}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground leading-relaxed max-w-md mx-auto">
              {activeTab === "login"
                ? "Akses dashboard komprehensif untuk mengelola seluruh aspek sekolah Anda dengan teknologi terdepan"
                : "Mulai transformasi digital sekolah Anda dengan platform manajemen yang telah dipercaya ribuan kepala sekolah"}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full relative z-10">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted/50 p-1.5 rounded-xl backdrop-blur-sm border border-border/30">
            <TabsTrigger
              value="login"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300 rounded-lg font-medium"
            >
              <Shield className="mr-2 h-4 w-4" />
              Masuk
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-secondary data-[state=active]:to-secondary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300 rounded-lg font-medium"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Daftar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4">
            <LoginForm
              loginData={loginData}
              setLoginData={setLoginData}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              isLoading={isLoading}
              onSubmit={handleLogin}
            />
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <RegisterForm
              registerData={registerData}
              setRegisterData={setRegisterData}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              showConfirmPassword={showConfirmPassword}
              setShowConfirmPassword={setShowConfirmPassword}
              passwordErrors={passwordErrors}
              isLoading={isLoading}
              onSubmit={handleRegister}
            />
          </TabsContent>
        </Tabs>

        {/* Enhanced Footer */}
        <div className="text-center mt-6 relative z-10">
          <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-border"></div>
            <p className="whitespace-nowrap">© 2025 NusantaraEdu - Transformasi Digital Pendidikan</p>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-border"></div>
          </div>
        </div>
      </DialogContent>

      {/* Custom styles for gradient animation */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
        .bg-300\\% {
          background-size: 300% 300%;
        }
      `}</style>
    </Dialog>
  )
}