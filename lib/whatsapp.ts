interface WhatsAppMessageData {
  userName: string
  ticketCount: number
  totalAmount: number
  supportPhone: string
  paymentInfoUrl: string
}

interface StatusUpdateData {
  userName: string
  ticketCount: number
  status: "approved" | "denied"
  ticketNumbers: string[]
}

export function generatePurchaseWhatsAppMessage(data: WhatsAppMessageData): string {
  const message = `Hola ${data.userName}, welcome to RafflePro

Información de compra:
- Titular: ${data.userName}
- Número de boletos comprados: ${data.ticketCount}
- Total a pagar: $${data.totalAmount}
- Link para ver información de pago: ${data.paymentInfoUrl}
- Número de soporte: ${data.supportPhone}

Cuando la transferencia bancaria esté completa, por favor envía una captura de pantalla. El pago será procesado dentro de 24 horas.`

  return message
}

export function generateStatusUpdateWhatsAppMessage(data: StatusUpdateData): string {
  const statusText = data.status === "approved" ? "APROBADO" : "RECHAZADO"
  const statusEmoji = data.status === "approved" ? "✅" : "❌"

  let message = `${statusEmoji} Estado de Boletos Actualizado ${statusEmoji}

Hola ${data.userName},

Tu compra de ${data.ticketCount} boletos ha sido ${statusText}.`

  if (data.status === "approved") {
    message += `

¡Felicidades! Tus boletos están confirmados:
${data.ticketNumbers.join(", ")}

¡Buena suerte en el sorteo! 🍀`
  } else {
    message += `

Por favor contacta a soporte para más información sobre el rechazo de tu pago.

Número de soporte: +52 1 221 625 0235`
  }

  return message
}

export function createWhatsAppUrl(phoneNumber: string, message: string): string {
  // Remove any non-numeric characters from phone number
  const cleanPhone = phoneNumber.replace(/\D/g, "")

  // Ensure phone number starts with country code
  const formattedPhone = cleanPhone.startsWith("52") ? cleanPhone : `52${cleanPhone}`

  const encodedMessage = encodeURIComponent(message)
  return `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`
}

export function openWhatsApp(phoneNumber: string, message: string): void {
  const url = createWhatsAppUrl(phoneNumber, message)
  window.open(url, "_blank")
}

export const SUPPORT_PHONE = "+52 1 221 625 0235"
export const SUPPORT_PHONE_CLEAN = "5212216250235"
