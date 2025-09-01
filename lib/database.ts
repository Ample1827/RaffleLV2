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
