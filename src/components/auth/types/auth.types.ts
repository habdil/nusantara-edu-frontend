export interface AuthenticationProps {
  trigger?: React.ReactNode
  defaultTab?: "login" | "register"
  onSuccess?: () => void
}

export interface LoginData {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  confirmPassword: string
  fullName: string
  phoneNumber: string
  npsn: string
}
