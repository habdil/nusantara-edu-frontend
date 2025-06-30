import { useState, useCallback } from "react"
import { LoginData, RegisterData } from "../types/auth.types"

export const useAuthForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Login form state
  const [loginData, setLoginData] = useState<LoginData>({
    username: "",
    password: "",
  })

  // Register form state
  const [registerData, setRegisterData] = useState<RegisterData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phoneNumber: "",
    npsn: "",
  })

  // Memoized form reset function
  const resetForms = useCallback(() => {
    setLoginData({ username: "", password: "" })
    setRegisterData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      phoneNumber: "",
      npsn: "",
    })
    setShowPassword(false)
    setShowConfirmPassword(false)
  }, [])

  const getPasswordValidationErrors = () => {
    const errors = []
    if (registerData.password.length > 0 && registerData.password.length < 6) {
      errors.push("Password minimal 6 karakter")
    }
    if (registerData.confirmPassword && registerData.password !== registerData.confirmPassword) {
      errors.push("Password dan konfirmasi password tidak cocok")
    }
    return errors
  }

  return {
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
  }
}
