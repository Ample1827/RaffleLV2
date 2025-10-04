"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Phone, Clock, Banknote } from "lucide-react"
import { useState } from "react"

export function Contact() {
  const [message, setMessage] = useState("")
  const whatsappNumber = "5216642709153"

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
    <section id="contact" className="py-8 md:py-12 lg:py-16 bg-premium-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 md:mb-12 fade-in">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2 md:mb-4 font-serif">
            Contáctanos
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            ¿Tienes preguntas sobre nuestras rifas? Envíanos un mensaje por WhatsApp y te responderemos de inmediato.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4 md:gap-8">
          <Card className="border-border shadow-xl premium-card slide-up">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center gap-2 mb-3 md:mb-4">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-full">
                  <MessageCircle className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-foreground font-serif">Envíanos un Mensaje</h3>
              </div>

              <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 leading-relaxed">
                Escribe tu pregunta y te contactaremos directamente por WhatsApp.
              </p>

              <div className="space-y-3 md:space-y-4">
                <div>
                  <label htmlFor="message" className="block text-xs md:text-sm font-medium text-foreground mb-1.5">
                    Tu Pregunta
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Escribe tu pregunta aquí..."
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="resize-none text-sm"
                  />
                </div>

                <Button
                  onClick={handleWhatsAppClick}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm md:text-base py-4 md:py-5 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Enviar por WhatsApp
                </Button>

                <Button
                  onClick={handlePaymentSupportClick}
                  variant="outline"
                  className="w-full border-2 border-gold text-gold hover:bg-gold hover:text-white text-sm md:text-base py-4 md:py-5 font-semibold shadow-lg hover:shadow-xl transition-all bg-transparent"
                >
                  <Banknote className="mr-2 h-4 w-4" />
                  Información de Métodos de Pago
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4 md:space-y-6 slide-up">
            <div>
              <h3 className="text-lg md:text-xl font-bold text-foreground mb-3 md:mb-4 font-serif">
                Información de Contacto
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground mb-4 md:mb-6 leading-relaxed">
                Estamos aquí para ayudarte. Contáctanos por WhatsApp y te responderemos lo más pronto posible.
              </p>
            </div>

            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start gap-2 md:gap-3 p-2.5 md:p-3 rounded-lg hover:bg-card transition-colors">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-1.5 md:p-2 rounded-full flex-shrink-0">
                  <MessageCircle className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-xs md:text-sm text-foreground mb-0.5">WhatsApp</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">+52 1 664 270 9153</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground/80">Respuesta inmediata</p>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3 p-2.5 md:p-3 rounded-lg hover:bg-card transition-colors">
                <div className="bg-gradient-to-br from-gold to-gold-dark p-1.5 md:p-2 rounded-full flex-shrink-0">
                  <Phone className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-xs md:text-sm text-foreground mb-0.5">Llámanos</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">+52 1 664 270 9153</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground/80">Disponible 24/7</p>
                </div>
              </div>

              <div className="flex items-start gap-2 md:gap-3 p-2.5 md:p-3 rounded-lg hover:bg-card transition-colors">
                <div className="bg-gradient-to-br from-gold to-gold-dark p-1.5 md:p-2 rounded-full flex-shrink-0">
                  <Clock className="h-4 w-4 md:h-5 md:w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-xs md:text-sm text-foreground mb-0.5">Horario de Atención</h4>
                  <p className="text-xs md:text-sm text-muted-foreground">Soporte 24/7</p>
                  <p className="text-[10px] md:text-xs text-muted-foreground/80">Siempre disponibles para ti</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
