import { toast } from "sonner"
import { LoginData, RegisterData } from "../types/auth.types"

export const validateLoginData = (loginData: LoginData): boolean => {
  if (!loginData.username.trim()) {
    toast.error("Username Diperlukan", {
      description: "Silakan masukkan username Anda.",
      duration: 3000,
    })
    return false
  }

  if (!loginData.password.trim()) {
    toast.error("Password Diperlukan", {
      description: "Silakan masukkan password Anda.",
      duration: 3000,
    })
    return false
  }

  return true
}

export const validateRegisterData = (registerData: RegisterData): boolean => {
  if (!registerData.fullName.trim()) {
    toast.error("Nama Lengkap Diperlukan", {
      description: "Silakan masukkan nama lengkap Anda.",
      duration: 3000,
    })
    return false
  }

  if (!registerData.username.trim()) {
    toast.error("Username Diperlukan", {
      description: "Silakan masukkan username yang unik.",
      duration: 3000,
    })
    return false
  }

  if (!registerData.email.trim()) {
    toast.error("Email Diperlukan", {
      description: "Silakan masukkan alamat email yang valid.",
      duration: 3000,
    })
    return false
  }

  if (registerData.password.length < 6) {
    toast.warning("Password Terlalu Pendek", {
      description: "Password harus minimal 6 karakter.",
      duration: 4000,
    })
    return false
  }

  if (registerData.password !== registerData.confirmPassword) {
    toast.error("Password Tidak Cocok", {
      description: "Password dan konfirmasi password harus sama.",
      duration: 4000,
    })
    return false
  }

  if (!registerData.npsn || registerData.npsn.length !== 8) {
    toast.warning("NPSN Tidak Valid", {
      description: "NPSN harus 8 digit. Hubungi Dinas Pendidikan jika tidak tahu.",
      duration: 4000,
    })
    return false
  }

  return true
}