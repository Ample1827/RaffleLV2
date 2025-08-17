"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Eye } from "lucide-react"
import { generateStatusUpdateWhatsAppMessage, openWhatsApp } from "@/lib/whatsapp"

interface StatusUpdateWhatsAppProps {
  userName: string
  userPhone: string
  ticketCount: number
  ticketNumbers: string[]
  status: "approved" | "denied"
}

export function StatusUpdateWhatsApp({
  userName,
  userPhone,
  ticketCount,
  ticketNumbers,
  status,
}: StatusUpdateWhatsAppProps) {
  const [showPreview, setShowPreview] = useState(false)

  const message = generateStatusUpdateWhatsAppMessage({
    userName,
    ticketCount,
    status,
    ticketNumbers,
  })

  const handleSendWhatsApp = () => {
    openWhatsApp(userPhone, message)
    setShowPreview(false)
  }

  return (
    <Dialog open={showPreview} onOpenChange={setShowPreview}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 bg-transparent"
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          Notificar por WhatsApp
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Vista Previa del Mensaje
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
            <p className="text-sm text-slate-600 mb-2">Para: {userPhone}</p>
            <Textarea value={message} readOnly className="min-h-[200px] bg-white border-slate-200 text-sm" />
          </div>

          <div className="flex gap-2">
            <Button onClick={() => setShowPreview(false)} variant="outline" className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleSendWhatsApp} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white">
              <MessageCircle className="h-4 w-4 mr-2" />
              Enviar WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
