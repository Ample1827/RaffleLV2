import { createClient } from "@/lib/supabase/client"

export interface Purchase {
  id: string
  user_id: string
  item_id: string | null
  ticket_numbers: string[]
  quantity: number
  total_amount: number
  status: "pending" | "approved"
  created_at: string
  updated_at: string
}

export async function createPurchase(purchaseData: {
  ticket_numbers: string[]
  quantity: number
  total_amount: number
}) {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      console.error("[v0] User not authenticated for purchase creation")
      throw new Error("User not authenticated")
    }

    console.log("[v0] Creating purchase for user:", user.id, purchaseData)

    const { data, error } = await supabase
      .from("purchases")
      .insert({
        user_id: user.id,
        item_id: null,
        ticket_numbers: purchaseData.ticket_numbers,
        quantity: purchaseData.quantity,
        total_amount: purchaseData.total_amount,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating purchase:", error)
      throw error
    }

    console.log("[v0] Purchase created successfully:", data)
    return data
  } catch (error) {
    console.error("[v0] Unexpected error in createPurchase:", error)
    throw error
  }
}

export async function getUserPurchases() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const { data, error } = await supabase
    .from("purchases")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data as Purchase[]
}

export async function getAllPurchases() {
  const supabase = createClient()

  try {
    console.log("[v0] Fetching all purchases for admin")

    const { data, error } = await supabase.from("purchases").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching purchases:", error)
      throw error
    }

    console.log("[v0] Fetched purchases:", data?.length || 0, "records")
    return data
  } catch (error) {
    console.error("[v0] Unexpected error in getAllPurchases:", error)
    throw error
  }
}

export async function updatePurchaseStatus(purchaseId: string, status: "pending" | "approved") {
  const supabase = createClient()

  try {
    console.log("[v0] Updating purchase status:", { purchaseId, status })

    const { data, error } = await supabase
      .from("purchases")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", purchaseId)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating purchase status:", error)
      throw error
    }

    console.log("[v0] Purchase status updated successfully:", data)
    return data
  } catch (error) {
    console.error("[v0] Unexpected error in updatePurchaseStatus:", error)
    throw error
  }
}

export async function getAllTickets() {
  const supabase = createClient()

  try {
    console.log("[v0] Fetching all tickets")

    const { data, error } = await supabase.from("tickets").select("*").order("ticket_number", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching tickets:", error)
      throw error
    }

    console.log("[v0] Fetched tickets:", data?.length || 0, "records")
    return data
  } catch (error) {
    console.error("[v0] Unexpected error in getAllTickets:", error)
    throw error
  }
}

export async function getTicketsByRange(startNumber: number, endNumber: number) {
  const supabase = createClient()

  try {
    console.log("[v0] Fetching tickets in range:", startNumber, "-", endNumber)

    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .gte("ticket_number", startNumber)
      .lte("ticket_number", endNumber)
      .order("ticket_number", { ascending: true })

    if (error) {
      console.error("[v0] Error fetching tickets by range:", error)
      throw error
    }

    console.log("[v0] Fetched tickets in range:", data?.length || 0, "records")
    return data
  } catch (error) {
    console.error("[v0] Unexpected error in getTicketsByRange:", error)
    throw error
  }
}

export async function createPurchaseWithoutAuth(purchaseData: {
  ticket_numbers: number[]
  total_amount: number
}) {
  const supabase = createClient()

  try {
    console.log("[v0] Creating purchase without auth - START")
    console.log("[v0] Purchase data:", JSON.stringify(purchaseData, null, 2))
    console.log("[v0] Ticket numbers count:", purchaseData.ticket_numbers.length)
    console.log("[v0] Total amount:", purchaseData.total_amount)

    const ticketId = `TKT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999) + 1).padStart(6, "0")}`
    console.log("[v0] Generated ticket ID:", ticketId)

    console.log("[v0] Checking ticket availability...")
    const { data: existingTickets, error: checkError } = await supabase
      .from("tickets")
      .select("ticket_number, is_available")
      .in("ticket_number", purchaseData.ticket_numbers)

    if (checkError) {
      console.error("[v0] Error checking ticket availability:", checkError)
      throw new Error(`Error verificando disponibilidad: ${checkError.message}`)
    }

    console.log("[v0] Found tickets:", existingTickets?.length)
    const unavailableTickets = existingTickets?.filter((t) => !t.is_available) || []
    if (unavailableTickets.length > 0) {
      console.error("[v0] Some tickets are not available:", unavailableTickets)
      throw new Error(
        `Algunos boletos ya no están disponibles: ${unavailableTickets.map((t) => t.ticket_number).join(", ")}`,
      )
    }

    console.log("[v0] Reserving tickets...")
    const { error: ticketError } = await supabase
      .from("tickets")
      .update({ is_available: false })
      .in("ticket_number", purchaseData.ticket_numbers)

    if (ticketError) {
      console.error("[v0] Error reserving tickets:", ticketError)
      console.error("[v0] Ticket error details:", JSON.stringify(ticketError, null, 2))
      throw new Error(`Error reservando boletos: ${ticketError.message}`)
    }

    console.log("[v0] Tickets reserved successfully")

    console.log("[v0] Creating purchase record...")
    const { data, error } = await supabase
      .from("purchases")
      .insert({
        user_id: null,
        ticket_numbers: purchaseData.ticket_numbers,
        total_amount: purchaseData.total_amount,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating purchase:", error)
      console.error("[v0] Purchase error code:", error.code)
      console.error("[v0] Purchase error message:", error.message)
      console.error("[v0] Purchase error details:", JSON.stringify(error, null, 2))

      console.log("[v0] Rolling back ticket reservation...")
      await supabase.from("tickets").update({ is_available: true }).in("ticket_number", purchaseData.ticket_numbers)

      throw new Error(`Error creando la compra: ${error.message}`)
    }

    console.log("[v0] Purchase created successfully:", data)
    console.log("[v0] Purchase ID:", data.id)
    return { ...data, ticketId }
  } catch (error) {
    console.error("[v0] Unexpected error in createPurchaseWithoutAuth:", error)
    if (error instanceof Error) {
      console.error("[v0] Error name:", error.name)
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)
    }
    throw error
  }
}

export async function updatePurchaseStatusAndTickets(purchaseId: string, status: "pending" | "approved") {
  const supabase = createClient()

  try {
    console.log("[v0] Updating purchase status and tickets:", { purchaseId, status })

    const { data: purchase, error: fetchError } = await supabase
      .from("purchases")
      .select("*")
      .eq("id", purchaseId)
      .single()

    if (fetchError) {
      console.error("[v0] Error fetching purchase:", fetchError)
      throw fetchError
    }

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
      console.error("[v0] Error updating purchase status:", updateError)
      throw updateError
    }

    if (status === "approved" && purchase.ticket_numbers && purchase.ticket_numbers.length > 0) {
      console.log("[v0] Marking tickets as unavailable:", purchase.ticket_numbers)

      const { error: ticketError } = await supabase
        .from("tickets")
        .update({ is_available: false })
        .in("ticket_number", purchase.ticket_numbers)

      if (ticketError) {
        console.error("[v0] Error updating ticket availability:", ticketError)
        throw ticketError
      }
    }

    if (status === "pending" && purchase.ticket_numbers && purchase.ticket_numbers.length > 0) {
      console.log("[v0] Marking tickets as available:", purchase.ticket_numbers)

      const { error: ticketError } = await supabase
        .from("tickets")
        .update({ is_available: true })
        .in("ticket_number", purchase.ticket_numbers)

      if (ticketError) {
        console.error("[v0] Error updating ticket availability:", ticketError)
        throw ticketError
      }
    }

    console.log("[v0] Purchase status and tickets updated successfully")
    return updatedPurchase
  } catch (error) {
    console.error("[v0] Unexpected error in updatePurchaseStatusAndTickets:", error)
    throw error
  }
}

export async function deletePurchase(purchaseId: string) {
  const supabase = createClient()

  try {
    console.log("[v0] Deleting purchase:", purchaseId)

    const { data: purchase, error: fetchError } = await supabase
      .from("purchases")
      .select("*")
      .eq("id", purchaseId)
      .single()

    if (fetchError) {
      console.error("[v0] Error fetching purchase:", fetchError)
      throw fetchError
    }

    if (purchase.ticket_numbers && purchase.ticket_numbers.length > 0) {
      console.log("[v0] Releasing tickets:", purchase.ticket_numbers)

      const { error: ticketError } = await supabase
        .from("tickets")
        .update({ is_available: true })
        .in("ticket_number", purchase.ticket_numbers)

      if (ticketError) {
        console.error("[v0] Error releasing tickets:", ticketError)
        throw ticketError
      }
    }

    const { error: deleteError } = await supabase.from("purchases").delete().eq("id", purchaseId)

    if (deleteError) {
      console.error("[v0] Error deleting purchase:", deleteError)
      throw deleteError
    }

    console.log("[v0] Purchase deleted successfully")
    return true
  } catch (error) {
    console.error("[v0] Unexpected error in deletePurchase:", error)
    throw error
  }
}

export async function updateTicketAvailability(ticketNumber: number, isAvailable: boolean) {
  const supabase = createClient()

  try {
    console.log("[v0] Updating ticket availability:", { ticketNumber, isAvailable })

    const { data, error } = await supabase
      .from("tickets")
      .update({ is_available: isAvailable })
      .eq("ticket_number", ticketNumber)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating ticket availability:", error)
      throw error
    }

    console.log("[v0] Ticket availability updated successfully")
    return data
  } catch (error) {
    console.error("[v0] Unexpected error in updateTicketAvailability:", error)
    throw error
  }
}

export async function getPurchaseDetails(purchaseId: string) {
  const supabase = createClient()

  try {
    console.log("[v0] Fetching purchase details:", purchaseId)

    const { data, error } = await supabase.from("purchases").select("*").eq("id", purchaseId).single()

    if (error) {
      console.error("[v0] Error fetching purchase details:", error)
      throw error
    }

    console.log("[v0] Purchase details fetched successfully")
    return data
  } catch (error) {
    console.error("[v0] Unexpected error in getPurchaseDetails:", error)
    throw error
  }
}
