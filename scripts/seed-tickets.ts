import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function seedTickets() {
  console.log("🎫 Starting ticket seeding process...")

  try {
    // Check if tickets already exist
    const { count, error: countError } = await supabase.from("tickets").select("*", { count: "exact", head: true })

    if (countError) {
      console.error("❌ Error checking existing tickets:", countError)
      throw countError
    }

    if (count && count > 0) {
      console.log(`⚠️  Database already has ${count} tickets. Skipping seed.`)
      return
    }

    console.log("📝 Preparing to insert 10,000 tickets...")

    // Create array of all tickets (0-9999)
    const tickets = []
    for (let i = 0; i < 10000; i++) {
      tickets.push({
        ticket_number: i,
        is_available: true,
      })
    }

    // Insert in batches of 1000 to avoid timeout
    const batchSize = 1000
    for (let i = 0; i < tickets.length; i += batchSize) {
      const batch = tickets.slice(i, i + batchSize)
      console.log(`📤 Inserting tickets ${i} to ${i + batch.length - 1}...`)

      const { error } = await supabase.from("tickets").insert(batch)

      if (error) {
        console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, error)
        throw error
      }

      console.log(`✅ Batch ${i / batchSize + 1} inserted successfully`)
    }

    console.log("🎉 Successfully seeded 10,000 tickets!")

    // Verify the count
    const { count: finalCount } = await supabase.from("tickets").select("*", { count: "exact", head: true })

    console.log(`✅ Final ticket count: ${finalCount}`)
  } catch (error) {
    console.error("❌ Error seeding tickets:", error)
    throw error
  }
}

seedTickets()
