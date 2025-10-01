"use server"

import { createClient } from "@supabase/supabase-js"

export async function seedTickets() {
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // Check if tickets already exist
    const { count } = await supabase.from("tickets").select("*", { count: "exact", head: true })

    if (count && count > 0) {
      return { success: false, message: `La base de datos ya tiene ${count} boletos.` }
    }

    // Generate all 10,000 tickets
    const tickets = []
    for (let i = 0; i < 10000; i++) {
      tickets.push({
        ticket_number: i,
        is_available: true,
      })
    }

    // Insert in batches of 1000
    const batchSize = 1000
    for (let i = 0; i < tickets.length; i += batchSize) {
      const batch = tickets.slice(i, i + batchSize)
      const { error } = await supabase.from("tickets").insert(batch)

      if (error) {
        console.error("Error inserting batch:", error)
        throw error
      }
    }

    return { success: true, message: "¡10,000 boletos creados exitosamente!" }
  } catch (error) {
    console.error("Error seeding tickets:", error)
    return { success: false, message: "Error al crear los boletos. Por favor intenta de nuevo." }
  }
}
