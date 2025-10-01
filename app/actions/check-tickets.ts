"use server"

import { createClient } from "@supabase/supabase-js"

export async function checkTicketCount() {
  try {
    console.log("[v0] Checking ticket count with service role")

    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("[v0] Missing Supabase credentials")
      return { success: false, error: "Missing credentials", count: 0 }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const { count, error } = await supabase.from("tickets").select("*", { count: "exact", head: true })

    if (error) {
      console.error("[v0] Error counting tickets:", error)
      return { success: false, error: error.message, count: 0 }
    }

    console.log("[v0] Total tickets in database:", count)
    return { success: true, count: count || 0 }
  } catch (error: any) {
    console.error("[v0] Unexpected error checking tickets:", error)
    return { success: false, error: error.message, count: 0 }
  }
}
