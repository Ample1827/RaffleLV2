"use server"

import { createClient } from "@supabase/supabase-js"

function createAdminClient() {
  const supabaseUrl = process.env.SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function getAllPurchasesAdmin() {
  const supabase = createAdminClient()

  try {
    console.log("[v0] [Admin] Fetching all purchases")

    const { data, error } = await supabase.from("purchases").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] [Admin] Error fetching purchases:", error)
      throw error
    }

    console.log("[v0] [Admin] Fetched purchases:", data?.length || 0, "records")
    return data
  } catch (error) {
    console.error("[v0] [Admin] Unexpected error in getAllPurchasesAdmin:", error)
    throw error
  }
}

export async function getAvailableTicketsCount() {
  const supabase = createAdminClient()

  try {
    console.log("[v0] [Admin] Fetching available tickets count")

    const { count, error } = await supabase
      .from("tickets")
      .select("*", { count: "exact", head: true })
      .eq("is_available", true)

    if (error) {
      console.error("[v0] [Admin] Error fetching available tickets count:", error)
      throw error
    }

    console.log("[v0] [Admin] Available tickets count:", count)
    return count || 0
  } catch (error) {
    console.error("[v0] [Admin] Unexpected error in getAvailableTicketsCount:", error)
    throw error
  }
}

async function sendWhatsAppConfirmation(phone: string, reservationId: string) {
  try {
    // Format phone number (remove any non-digit characters)
    const cleanPhone = phone.replace(/\D/g, "")

    // Create the verification URL
    const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://tu-sitio.com"}/verify-tickets`

    // Create WhatsApp message
    const message = `¡Hola! 🎉\n\nTu pago fue confirmado exitosamente.\n\n📋 ID de Reserva: ${reservationId}\n\n✅ Puedes verificar tus boletos aquí:\n${verifyUrl}\n\n¡Mucha suerte! 🍀`

    // WhatsApp API URL (using WhatsApp Business API or a service like Twilio)
    // For now, we'll create a WhatsApp link that opens in the browser
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`

    console.log("[v0] [Admin] WhatsApp confirmation URL generated:", whatsappUrl)

    // In a production environment, you would use a service like Twilio to send the message automatically
    // For now, we'll return the URL so the admin can click it to send the message
    return { success: true, whatsappUrl }
  } catch (error) {
    console.error("[v0] [Admin] Error generating WhatsApp message:", error)
    return { success: false, error: "Error generando mensaje de WhatsApp" }
  }
}

export async function updatePurchaseStatusAdmin(purchaseId: string, status: "pending" | "approved") {
  const supabase = createAdminClient()

  try {
    console.log("[v0] [Admin] Updating purchase status:", { purchaseId, status })

    const { data: purchase, error: fetchError } = await supabase
      .from("purchases")
      .select("*")
      .eq("id", purchaseId)
      .single()

    if (fetchError) {
      console.error("[v0] [Admin] Error fetching purchase:", fetchError)
      throw new Error(`Error obteniendo la compra: ${fetchError.message}`)
    }

    console.log("[v0] [Admin] Found purchase:", purchase)

    const { data: updatedPurchase, error: updateError } = await supabase
      .from("purchases")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", purchaseId)
      .select()
      .single()

    if (updateError) {
      console.error("[v0] [Admin] Error updating purchase status:", updateError)
      throw new Error(`Error actualizando el estado: ${updateError.message}`)
    }

    console.log("[v0] [Admin] Purchase status updated successfully:", updatedPurchase)

    if (purchase.ticket_numbers && purchase.ticket_numbers.length > 0) {
      console.log("[v0] [Admin] Updating ticket availability for status:", status)

      const { error: ticketError } = await supabase
        .from("tickets")
        .update({ is_available: false })
        .in("ticket_number", purchase.ticket_numbers)

      if (ticketError) {
        console.error("[v0] [Admin] Error updating ticket availability:", ticketError)
        throw new Error(`Error actualizando disponibilidad de boletos: ${ticketError.message}`)
      }

      console.log("[v0] [Admin] Tickets updated successfully")
    }

    if (status === "approved" && purchase.buyer_phone && purchase.reservation_id) {
      console.log("[v0] [Admin] Generating WhatsApp confirmation for:", purchase.buyer_phone)
      const whatsappResult = await sendWhatsAppConfirmation(purchase.buyer_phone, purchase.reservation_id)

      if (whatsappResult.success && whatsappResult.whatsappUrl) {
        console.log("[v0] [Admin] WhatsApp URL generated:", whatsappResult.whatsappUrl)
        return { ...updatedPurchase, whatsappUrl: whatsappResult.whatsappUrl }
      }
    }

    console.log("[v0] [Admin] Purchase status updated successfully")
    return updatedPurchase
  } catch (error) {
    console.error("[v0] [Admin] Unexpected error in updatePurchaseStatusAdmin:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Error inesperado al actualizar el estado de la compra")
  }
}

export async function deletePurchaseAdmin(purchaseId: string) {
  const supabase = createAdminClient()

  try {
    console.log("[v0] [Admin] Deleting purchase:", purchaseId)

    const { data: purchase, error: fetchError } = await supabase
      .from("purchases")
      .select("*")
      .eq("id", purchaseId)
      .single()

    if (fetchError) {
      console.error("[v0] [Admin] Error fetching purchase:", fetchError)
      throw fetchError
    }

    // Mark tickets as available again
    if (purchase.ticket_numbers && purchase.ticket_numbers.length > 0) {
      console.log("[v0] [Admin] Releasing tickets:", purchase.ticket_numbers)

      const { error: ticketError } = await supabase
        .from("tickets")
        .update({ is_available: true })
        .in("ticket_number", purchase.ticket_numbers)

      if (ticketError) {
        console.error("[v0] [Admin] Error releasing tickets:", ticketError)
        throw ticketError
      }
    }

    // Delete the purchase
    const { error: deleteError } = await supabase.from("purchases").delete().eq("id", purchaseId)

    if (deleteError) {
      console.error("[v0] [Admin] Error deleting purchase:", deleteError)
      throw deleteError
    }

    console.log("[v0] [Admin] Purchase deleted successfully")
    return true
  } catch (error) {
    console.error("[v0] [Admin] Unexpected error in deletePurchaseAdmin:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Error inesperado al eliminar la compra")
  }
}
