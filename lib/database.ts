import { createClient } from "@/lib/supabase/client"

export interface Purchase {
  id: string
  user_id: string
  item_id: string | null
  ticket_numbers: string[]
  quantity: number
  total_amount: number
  status: "pending" | "bought"
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

export async function updatePurchaseStatus(purchaseId: string, status: "pending" | "bought") {
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
    console.log("[v0] Creating purchase without auth:", purchaseData)

    // Generate unique ticket ID
    const ticketId = `TKT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 999999) + 1).padStart(6, "0")}`

    const { data, error } = await supabase
      .from("purchases")
      .insert({
        user_id: null, // No user authentication required
        ticket_numbers: purchaseData.ticket_numbers,
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
    return { ...data, ticketId }
  } catch (error) {
    console.error("[v0] Unexpected error in createPurchaseWithoutAuth:", error)
    throw error
  }
}

export async function updatePurchaseStatusAndTickets(purchaseId: string, status: "pending" | "bought") {
  const supabase = createClient()

  try {
    console.log("[v0] Updating purchase status and tickets:", { purchaseId, status })

    // First, get the purchase to find ticket numbers
    const { data: purchase, error: fetchError } = await supabase
      .from("purchases")
      .select("*")
      .eq("id", purchaseId)
      .single()

    if (fetchError) {
      console.error("[v0] Error fetching purchase:", fetchError)
      throw fetchError
    }

    // Update purchase status
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

    // If status is "bought", mark tickets as unavailable
    if (status === "bought" && purchase.ticket_numbers && purchase.ticket_numbers.length > 0) {
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

    // If status is "pending", mark tickets as available again
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

    // First, get the purchase to find ticket numbers
    const { data: purchase, error: fetchError } = await supabase
      .from("purchases")
      .select("*")
      .eq("id", purchaseId)
      .single()

    if (fetchError) {
      console.error("[v0] Error fetching purchase:", fetchError)
      throw fetchError
    }

    // Mark tickets as available again
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

    // Delete the purchase
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
