"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Lock, Eye, EyeOff, Loader2, ShieldCheck, LogIn } from "lucide-react"
import { toast } from "sonner"
import { LoginData } from "../types/auth.types"

interface LoginFormProps {
  loginData: LoginData
  setLoginData: (data: LoginData) => void
  showPassword: boolean
  setShowPassword: (show: boolean) => void
  isLoading: boolean
  onSubmit: (e: React.FormEvent) => void
}

export const LoginForm: React.FC<LoginFormProps> = ({
  loginData,
  setLoginData,
  showPassword,
  setShowPassword,
  isLoading,
  onSubmit,
}) => {
  return (
    <Card className="border-border/30 shadow-xl bg-card/95 backdrop-blur-md overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/15 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/15 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
      
      <CardHeader className="space-y-3 pb-6 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl text-card-foreground font-semibold">
              Masuk ke Akun
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Akses dashboard manajemen sekolah Anda
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10">
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="login-username" className="text-foreground font-medium flex items-center space-x-2">
              <User className="h-4 w-4 text-primary" />
              <span>Username</span>
            </Label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
                <Input
                  id="login-username"
                  type="text"
                  placeholder="Masukkan username Anda"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  className="pl-10 h-12 border-border/50 bg-background/50 focus:border-primary focus:ring-primary/20 transition-all duration-300 focus:shadow-lg focus:shadow-primary/10 rounded-lg"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="login-password" className="text-foreground font-medium flex items-center space-x-2">
              <Lock className="h-4 w-4 text-primary" />
              <span>Password</span>
            </Label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-200 group-hover:text-primary" />
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password Anda"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="pl-10 pr-12 h-12 border-border/50 bg-background/50 focus:border-primary focus:ring-primary/20 transition-all duration-300 focus:shadow-lg focus:shadow-primary/10 rounded-lg"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-all duration-200 p-1 rounded-md hover:bg-muted/50"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-gradient-to-r from-primary via-primary/90 to-secondary hover:from-primary/90 hover:via-secondary hover:to-primary text-primary-foreground font-semibold shadow-lg hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none rounded-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Memproses Masuk...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" />
                Masuk ke Dashboard
              </>
            )}
          </Button>

          {/* Forgot Password */}
          <div className="text-center pt-2">
            <button
              type="button"
              className="text-sm text-primary hover:text-secondary hover:underline transition-all duration-200 font-medium"
              onClick={() => {
                toast.info("Hubungi Administrator", {
                  description: "Untuk reset password, silakan hubungi administrator sistem di sekolah Anda.",
                  duration: 5000,
                })
              }}
              disabled={isLoading}
            >
              Lupa password? Hubungi Administrator
            </button>
          </div>
        </form>

        {/* Security Notice */}
        <div className="mt-6 p-3 bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg border border-border/30">
          <div className="flex items-start space-x-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="leading-relaxed">
              <span className="font-medium text-foreground">Keamanan Terjamin:</span> Login dilindungi dengan enkripsi tingkat enterprise dan autentikasi multi-layer.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}