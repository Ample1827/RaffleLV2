"use server"

import { createClient } from "@supabase/supabase-js"

function getServiceRoleClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

export async function createPurchaseAction({
  ticketNumbers,
  totalAmount,
  buyerName,
  buyerPhone,
  buyerState,
}: {
  ticketNumbers: number[]
  totalAmount: number
  buyerName?: string
  buyerPhone?: string
  buyerState?: string
}) {
  const supabase = getServiceRoleClient()

  try {
    const { data: existingTickets, error: checkError } = await supabase
      .from("tickets")
      .select("ticket_number, is_available")
      .in("ticket_number", ticketNumbers)

    if (checkError) {
      throw new Error(`Error verificando boletos: ${checkError.message}`)
    }

    if (!existingTickets || existingTickets.length !== ticketNumbers.length) {
      throw new Error("Algunos boletos no existen")
    }

    const unavailableTickets = existingTickets.filter((t) => !t.is_available)

    if (unavailableTickets.length > 0) {
      throw new Error(
        `Los siguientes boletos ya no están disponibles: ${unavailableTickets
          .map((t) => t.ticket_number)
          .slice(0, 5)
          .join(", ")}${unavailableTickets.length > 5 ? ` y ${unavailableTickets.length - 5} más` : ""}`,
      )
    }

    const { error: updateError } = await supabase
      .from("tickets")
      .update({ is_available: false })
      .in("ticket_number", ticketNumbers)

    if (updateError) {
      throw new Error(`Error reservando boletos: ${updateError.message}`)
    }

    const timestamp = Date.now().toString().slice(-6)
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase()
    const reservationId = `TKT-${timestamp}-${randomSuffix}`

    const { data: purchase, error: purchaseError } = await supabase
      .from("purchases")
      .insert({
        ticket_numbers: ticketNumbers,
        total_amount: totalAmount,
        status: "pending",
        user_id: null,
        buyer_name: buyerName,
        buyer_phone: buyerPhone,
        buyer_state: buyerState,
        reservation_id: reservationId,
      })
      .select()
      .single()

    if (purchaseError) {
      await supabase.from("tickets").update({ is_available: true }).in("ticket_number", ticketNumbers)

      throw new Error(`Error creando la compra: ${purchaseError.message}`)
    }

    return { success: true, purchase }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}

export async function getPurchaseByReservationIdAction(reservationId: string) {
  const supabase = getServiceRoleClient()

  try {
    const { data: purchase, error } = await supabase
      .from("purchases")
      .select("*")
      .eq("reservation_id", reservationId)
      .single()

    if (error) {
      return {
        success: false,
        error: "No se encontró la reserva con ese ID",
      }
    }

    return { success: true, purchase }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}

export async function getPurchaseByIdAction(purchaseId: string) {
  const supabase = getServiceRoleClient()

  try {
    const { data: purchase, error } = await supabase.from("purchases").select("*").eq("id", purchaseId).single()

    if (error) {
      return {
        success: false,
        error: "No se encontró la reserva con ese ID",
      }
    }

    return { success: true, purchase }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}
