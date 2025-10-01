"use server"

import { createClient } from "@supabase/supabase-js"

export async function seedTickets() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    console.log("[v0] Seeding tickets - checking environment variables...")
    console.log("[v0] SUPABASE_URL exists:", !!supabaseUrl)
    console.log("[v0] SUPABASE_SERVICE_ROLE_KEY exists:", !!supabaseServiceKey)

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("[v0] Missing Supabase environment variables")
      return {
        success: false,
        message: "Error: Faltan variables de entorno de Supabase. Por favor verifica la configuración.",
      }
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if tickets already exist
    console.log("[v0] Checking if tickets already exist...")
    const { count, error: countError } = await supabase.from("tickets").select("*", { count: "exact", head: true })

    if (countError) {
      console.error("[v0] Error checking ticket count:", countError)
      return { success: false, message: `Error al verificar boletos: ${countError.message}` }
    }

    console.log("[v0] Current ticket count:", count)

    if (count && count > 0) {
      return { success: false, message: `La base de datos ya tiene ${count} boletos.` }
    }

    // Generate all 10,000 tickets
    console.log("[v0] Generating 10,000 tickets...")
    const tickets = []
    for (let i = 0; i < 10000; i++) {
      tickets.push({
        ticket_number: i,
        is_available: true,
      })
    }

    console.log("[v0] Inserting tickets in batches...")
    // Insert in batches of 1000
    const batchSize = 1000
    for (let i = 0; i < tickets.length; i += batchSize) {
      const batch = tickets.slice(i, i + batchSize)
      console.log(`[v0] Inserting batch ${i / batchSize + 1} of ${tickets.length / batchSize}...`)

      const { error } = await supabase.from("tickets").insert(batch)

      if (error) {
        console.error("[v0] Error inserting batch:", error)
        return { success: false, message: `Error al insertar boletos: ${error.message}` }
      }
    }

    console.log("[v0] Successfully seeded 10,000 tickets!")
    return { success: true, message: "¡10,000 boletos creados exitosamente!" }
  } catch (error) {
    console.error("[v0] Error seeding tickets:", error)
    return {
      success: false,
      message: `Error al crear los boletos: ${error instanceof Error ? error.message : "Error desconocido"}`,
    }
  }
}
