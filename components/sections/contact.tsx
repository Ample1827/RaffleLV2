"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Phone, Clock, Banknote } from "lucide-react"
import { useState } from "react"

export function Contact() {
  const [message, setMessage] = useState("")
  const whatsappNumber = "5216642709153" // Format: country code + number (no + or spaces)

  const handleWhatsAppClick = () => {
    if (!message.trim()) {
      alert("Por favor escribe tu pregunta antes de enviar")
      return
    }

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  const handlePaymentSupportClick = () => {
    const paymentMessage = `Hola! Necesito información sobre métodos de pago.

📋 *MÉTODOS DE PAGO DISPONIBLES*

💳 *1. Transferencia Bancaria*
• Solicita los datos bancarios
• Realiza la transferencia desde tu banco
• Envía el comprobante por WhatsApp

💵 *2. Depósito en Efectivo*

🏪 *Tiendas de Conveniencia:*
• Oxxo
• 7-Eleven
• Kiosko
• Systienda

🛒 *Supermercados:*
• Soriana
• Chedraui

💊 *Farmacias:*
• Farmacias del Ahorro

📝 *PASOS PARA DEPOSITAR:*
1. Solicita la referencia de pago
2. Acude a cualquiera de estos establecimientos
3. Proporciona la referencia al cajero
4. Realiza el pago en efectivo
5. Guarda tu comprobante
6. Envíanos foto del comprobante por WhatsApp

¿En qué puedo ayudarte?`

    const encodedMessage = encodeURIComponent(paymentMessage)
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <section id="contact" className="py-20 bg-premium-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 font-serif">Contáctanos</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            ¿Tienes preguntas sobre nuestras rifas? Envíanos un mensaje por WhatsApp y te responderemos de inmediato.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <Card className="border-border shadow-xl premium-card slide-up">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-full">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground font-serif">Envíanos un Mensaje</h3>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                Escribe tu pregunta y te contactaremos directamente por WhatsApp.
              </p>

              <div className="space-y-6">
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Tu Pregunta
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Escribe tu pregunta aquí..."
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="resize-none"
                  />
                </div>

                <Button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg py-6 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Enviar por WhatsApp
                </Button>

                <Button
                  onClick={handlePaymentSupportClick}
                  variant="outline"
                  className="w-full border-2 border-gold text-gold hover:bg-gold hover:text-white text-lg py-6 font-semibold shadow-lg hover:shadow-xl transition-all bg-transparent"
                >
                  <Banknote className="mr-2 h-5 w-5" />
                  Información de Métodos de Pago
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8 slide-up">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6 font-serif">Información de Contacto</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Estamos aquí para ayudarte. Contáctanos por WhatsApp y te responderemos lo más pronto posible.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-card transition-colors">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-full flex-shrink-0">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">WhatsApp</h4>
                  <p className="text-muted-foreground">+52 1 664 270 9153</p>
                  <p className="text-sm text-muted-foreground/80">Respuesta inmediata</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-card transition-colors">
                <div className="bg-gradient-to-br from-gold to-gold-dark p-3 rounded-full flex-shrink-0">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">Llámanos</h4>
                  <p className="text-muted-foreground">+52 1 664 270 9153</p>
                  <p className="text-sm text-muted-foreground/80">Disponible 24/7</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-card transition-colors">
                <div className="bg-gradient-to-br from-gold to-gold-dark p-3 rounded-full flex-shrink-0">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1">Horario de Atención</h4>
                  <p className="text-muted-foreground">Soporte 24/7</p>
                  <p className="text-sm text-muted-foreground/80">Siempre disponibles para ti</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
