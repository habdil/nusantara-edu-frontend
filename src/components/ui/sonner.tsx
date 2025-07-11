// src\components\ui\sonner.tsx

"use client"

import type React from "react"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-card-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:backdrop-blur-sm",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:hover:bg-primary/90",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:hover:bg-muted/80",
          success:
            "group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-emerald-50 group-[.toaster]:to-green-50 group-[.toaster]:text-emerald-900 group-[.toaster]:border-emerald-200 dark:group-[.toaster]:from-emerald-950/20 dark:group-[.toaster]:to-green-950/20 dark:group-[.toaster]:text-emerald-100 dark:group-[.toaster]:border-emerald-800/30",
          error:
            "group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-red-50 group-[.toaster]:to-rose-50 group-[.toaster]:text-red-900 group-[.toaster]:border-red-200 dark:group-[.toaster]:from-red-950/20 dark:group-[.toaster]:to-rose-950/20 dark:group-[.toaster]:text-red-100 dark:group-[.toaster]:border-red-800/30",
          warning:
            "group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-amber-50 group-[.toaster]:to-yellow-50 group-[.toaster]:text-amber-900 group-[.toaster]:border-amber-200 dark:group-[.toaster]:from-amber-950/20 dark:group-[.toaster]:to-yellow-950/20 dark:group-[.toaster]:text-amber-100 dark:group-[.toaster]:border-amber-800/30",
          info: "group-[.toaster]:bg-gradient-to-r group-[.toaster]:from-blue-50 group-[.toaster]:to-indigo-50 group-[.toaster]:text-blue-900 group-[.toaster]:border-blue-200 dark:group-[.toaster]:from-blue-950/20 dark:group-[.toaster]:to-indigo-950/20 dark:group-[.toaster]:text-blue-100 dark:group-[.toaster]:border-blue-800/30",
        },
      }}
      style={
        {
          "--normal-bg": "hsl(var(--card))",
          "--normal-border": "hsl(var(--border))",
          "--normal-text": "hsl(var(--card-foreground))",
          "--success-bg": "hsl(var(--primary))",
          "--success-border": "hsl(var(--primary))",
          "--success-text": "hsl(var(--primary-foreground))",
          "--error-bg": "hsl(var(--destructive))",
          "--error-border": "hsl(var(--destructive))",
          "--error-text": "hsl(var(--destructive-foreground))",
          "--warning-bg": "hsl(var(--secondary))",
          "--warning-border": "hsl(var(--secondary))",
          "--warning-text": "hsl(var(--secondary-foreground))",
          "--info-bg": "hsl(var(--accent))",
          "--info-border": "hsl(var(--accent))",
          "--info-text": "hsl(var(--accent-foreground))",
        } as React.CSSProperties
      }
      position="top-right"
      expand={true}
      richColors={true}
      closeButton={true}
      duration={4000}
      gap={8}
      offset={16}
      {...props}
    />
  )
}

export { Toaster }
