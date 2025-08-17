"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { openWhatsApp } from "@/lib/whatsapp"

interface WhatsAppButtonProps {
  phoneNumber: string
  message: string
  children?: React.ReactNode
  className?: string
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  size?: "default" | "sm" | "lg" | "icon"
}

export function WhatsAppButton({
  phoneNumber,
  message,
  children,
  className = "",
  variant = "default",
  size = "default",
}: WhatsAppButtonProps) {
  const handleClick = () => {
    openWhatsApp(phoneNumber, message)
  }

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={`${className} bg-emerald-500 hover:bg-emerald-600 text-white`}
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      {children || "Enviar por WhatsApp"}
    </Button>
  )
}
