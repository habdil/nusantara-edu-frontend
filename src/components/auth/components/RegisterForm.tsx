"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Lock, Phone, Building, Eye, EyeOff, Shield, Loader2, UserPlus, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { RegisterData } from "../types/auth.types"

interface RegisterFormProps {
  registerData: RegisterData
  setRegisterData: (data: RegisterData) => void
  showPassword: boolean
  setShowPassword: (show: boolean) => void
  showConfirmPassword: boolean
  setShowConfirmPassword: (show: boolean) => void
  passwordErrors: string[]
  isLoading: boolean
  onSubmit: (e: React.FormEvent) => void
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  registerData,
  setRegisterData,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  passwordErrors,
  isLoading,
  onSubmit,
}) => {
  const hasPasswordErrors = passwordErrors.length > 0

  return (
    <Card className="border-border/30 shadow-xl bg-card/95 backdrop-blur-md overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-secondary/15 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-primary/15 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
      
      <CardHeader className="space-y-3 pb-6 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl">
            <Sparkles className="h-5 w-5 text-secondary" />
          </div>
          <div>
            <CardTitle className="text-xl text-card-foreground font-semibold">
              Daftar Akun Kepala Sekolah
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Mulai transformasi digital sekolah Anda
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-5">
            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-foreground font-medium flex items-center space-x-2">
                <User className="h-4 w-4 text-secondary" />
                <span>Nama Lengkap</span>
              </Label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-200 group-hover:text-secondary" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Dr. Siti Nurhaliza, M.Pd"
                    value={registerData.fullName}
                    onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
                    className="pl-10 h-11 border-border/50 bg-background/50 focus:border-secondary focus:ring-secondary/20 transition-all duration-300 focus:shadow-lg focus:shadow-secondary/10 rounded-lg"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground font-medium flex items-center space-x-2">
                <Shield className="h-4 w-4 text-secondary" />
                <span>Username</span>
              </Label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-200 group-hover:text-secondary" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="username_unik"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                    className="pl-10 h-11 border-border/50 bg-background/50 focus:border-secondary focus:ring-secondary/20 transition-all duration-300 focus:shadow-lg focus:shadow-secondary/10 rounded-lg"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="register-email" className="text-foreground font-medium flex items-center space-x-2">
                <Mail className="h-4 w-4 text-secondary" />
                <span>Email</span>
              </Label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-200 group-hover:text-secondary" />
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="kepala.sekolah@sekolah.sch.id"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="pl-10 h-11 border-border/50 bg-background/50 focus:border-secondary focus:ring-secondary/20 transition-all duration-300 focus:shadow-lg focus:shadow-secondary/10 rounded-lg"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-foreground font-medium flex items-center space-x-2">
                <Phone className="h-4 w-4 text-secondary" />
                <span>Nomor Telepon</span>
              </Label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-200 group-hover:text-secondary" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="08123456789"
                    value={registerData.phoneNumber}
                    onChange={(e) => setRegisterData({ ...registerData, phoneNumber: e.target.value })}
                    className="pl-10 h-11 border-border/50 bg-background/50 focus:border-secondary focus:ring-secondary/20 transition-all duration-300 focus:shadow-lg focus:shadow-secondary/10 rounded-lg"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* NPSN Field */}
            <div className="space-y-2">
              <Label htmlFor="npsn" className="text-foreground font-medium flex items-center space-x-2">
                <Building className="h-4 w-4 text-secondary" />
                <span>NPSN Sekolah <span className="text-destructive">*</span></span>
              </Label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-200 group-hover:text-secondary" />
                  <Input
                    id="npsn"
                    type="text"
                    placeholder="12345678 (8 digit NPSN)"
                    value={registerData.npsn}
                    onChange={(e) => setRegisterData({ ...registerData, npsn: e.target.value })}
                    className="pl-10 h-11 border-border/50 bg-background/50 focus:border-secondary focus:ring-secondary/20 transition-all duration-300 focus:shadow-lg focus:shadow-secondary/10 rounded-lg"
                    maxLength={8}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Nomor Pokok Sekolah Nasional (8 digit). Hubungi Dinas Pendidikan jika tidak tahu.
              </p>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="register-password" className="text-foreground font-medium flex items-center space-x-2">
                <Lock className="h-4 w-4 text-secondary" />
                <span>Password</span>
              </Label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-200 group-hover:text-secondary" />
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 6 karakter"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="pl-10 pr-12 h-11 border-border/50 bg-background/50 focus:border-secondary focus:ring-secondary/20 transition-all duration-300 focus:shadow-lg focus:shadow-secondary/10 rounded-lg"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-secondary transition-all duration-200 p-1 rounded-md hover:bg-muted/50"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground font-medium flex items-center space-x-2">
                <Lock className="h-4 w-4 text-secondary" />
                <span>Konfirmasi Password</span>
              </Label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-200 group-hover:text-secondary" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Ulangi password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    className="pl-10 pr-12 h-11 border-border/50 bg-background/50 focus:border-secondary focus:ring-secondary/20 transition-all duration-300 focus:shadow-lg focus:shadow-secondary/10 rounded-lg"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-secondary transition-all duration-200 p-1 rounded-md hover:bg-muted/50"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {passwordErrors.length > 0 && (
                <div className="text-xs text-destructive space-y-1 bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                  {passwordErrors.map((error, index) => (
                    <p key={index}>• {error}</p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Register Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-secondary via-secondary/90 to-primary hover:from-secondary/90 hover:via-primary hover:to-secondary text-primary-foreground font-semibold shadow-lg hover:shadow-xl hover:shadow-secondary/25 transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none rounded-lg"
            disabled={isLoading || hasPasswordErrors}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Mendaftar...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-5 w-5" />
                Daftar Sekarang
              </>
            )}
          </Button>

          {/* Terms and Conditions */}
          <div className="text-center text-xs text-muted-foreground leading-relaxed bg-gradient-to-r from-muted/30 to-muted/10 p-4 rounded-lg border border-border/30">
            <p>
              Dengan mendaftar, Anda menyetujui{" "}
              <button
                type="button"
                className="text-secondary hover:text-primary hover:underline transition-colors duration-200 font-medium"
                onClick={() =>
                  toast.info("Syarat & Ketentuan", {
                    description: "Halaman Syarat & Ketentuan akan segera tersedia.",
                    duration: 3000,
                  })
                }
              >
                Syarat & Ketentuan
              </button>{" "}
              dan{" "}
              <button
                type="button"
                className="text-secondary hover:text-primary hover:underline transition-colors duration-200 font-medium"
                onClick={() =>
                  toast.info("Kebijakan Privasi", {
                    description: "Halaman Kebijakan Privasi akan segera tersedia.",
                    duration: 3000,
                  })
                }
              >
                Kebijakan Privasi
              </button>{" "}
              NusantaraEdu.
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}