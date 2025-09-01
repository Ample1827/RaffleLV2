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

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("User not authenticated")

  const { data, error } = await supabase
    .from("purchases")
    .insert({
      user_id: user.id,
      item_id: null, // Can be used for specific items later
      ticket_numbers: purchaseData.ticket_numbers,
      quantity: purchaseData.quantity,
      total_amount: purchaseData.total_amount,
      status: "pending",
    })
    .select()
    .single()

  if (error) throw error
  return data
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

  const { data, error } = await supabase
    .from("purchases")
    .select(`
      *,
      user:auth.users(email)
    `)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function updatePurchaseStatus(purchaseId: string, status: "pending" | "bought") {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("purchases")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", purchaseId)
    .select()
    .single()

  if (error) throw error
  return data
}
