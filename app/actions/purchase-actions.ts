"use server"

import { createClient } from "@supabase/supabase-js"

// Create a Supabase client with service role for elevated permissions
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
}: {
  ticketNumbers: number[]
  totalAmount: number
}) {
  console.log("[v0] Server action - Creating purchase with elevated permissions")
  console.log("[v0] Ticket numbers:", ticketNumbers)
  console.log("[v0] Total amount:", totalAmount)

  const supabase = getServiceRoleClient()

  try {
    // Check if tickets are available
    console.log("[v0] Checking ticket availability...")
    const { data: existingTickets, error: checkError } = await supabase
      .from("tickets")
      .select("ticket_number, is_available")
      .in("ticket_number", ticketNumbers)

    if (checkError) {
      console.error("[v0] Error checking tickets:", checkError)
      throw new Error(`Error verificando boletos: ${checkError.message}`)
    }

    if (!existingTickets || existingTickets.length !== ticketNumbers.length) {
      throw new Error("Algunos boletos no existen")
    }

    const unavailableTickets = existingTickets.filter((t) => !t.is_available)
    if (unavailableTickets.length > 0) {
      throw new Error(
        `Los siguientes boletos ya no están disponibles: ${unavailableTickets.map((t) => t.ticket_number).join(", ")}`,
      )
    }

    console.log("[v0] All tickets are available, proceeding with reservation...")

    // Mark tickets as unavailable (reserved)
    const { error: updateError } = await supabase
      .from("tickets")
      .update({ is_available: false })
      .in("ticket_number", ticketNumbers)

    if (updateError) {
      console.error("[v0] Error reserving tickets:", updateError)
      throw new Error(`Error reservando boletos: ${updateError.message}`)
    }

    console.log("[v0] Tickets reserved, creating purchase record...")

    const { data: purchase, error: purchaseError } = await supabase
      .from("purchases")
      .insert({
        ticket_numbers: ticketNumbers,
        total_amount: totalAmount,
        status: "pending",
        user_id: null, // Guest purchase
      })
      .select()
      .single()

    if (purchaseError) {
      console.error("[v0] Error creating purchase:", purchaseError)
      // Rollback: make tickets available again
      console.log("[v0] Rolling back ticket reservation...")
      await supabase.from("tickets").update({ is_available: true }).in("ticket_number", ticketNumbers)

      throw new Error(`Error creando la compra: ${purchaseError.message}`)
    }

    console.log("[v0] Purchase created successfully:", purchase)
    return { success: true, purchase }
  } catch (error) {
    console.error("[v0] Server action error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    }
  }
}
