import useSWR from "swr"
import { getTicketsByRange, getAllTickets } from "@/lib/database"

// Fetcher function for SWR
const ticketRangeFetcher = async ([_, startNum, endNum]: [string, number, number]) => {
  return await getTicketsByRange(startNum, endNum)
}

const allTicketsFetcher = async () => {
  return await getAllTickets()
}

// Hook to fetch tickets by range with real-time updates
export function useTicketsByRange(startNum: number, endNum: number, enabled = true) {
  const { data, error, isLoading, mutate } = useSWR(
    enabled ? ["tickets-range", startNum, endNum] : null,
    ticketRangeFetcher,
    {
      refreshInterval: 5000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 3000,
    },
  )

  return {
    tickets: data || [],
    availableCount: data?.filter((t) => t.is_available).length || 0,
    isLoading,
    error,
    mutate,
  }
}

// Hook to fetch all tickets with real-time updates
export function useAllTickets() {
  const { data, error, isLoading, mutate } = useSWR("all-tickets", allTicketsFetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
  })

  // Calculate available count for each section
  const sectionCounts = Array.from({ length: 10 }, (_, i) => {
    const startNum = i * 1000
    const endNum = startNum + 999
    const sectionTickets = data?.filter((t) => t.ticket_number >= startNum && t.ticket_number <= endNum) || []
    const availableCount = sectionTickets.filter((t) => t.is_available).length
    return {
      section: i,
      total: 1000,
      available: availableCount,
    }
  })

  const totalAvailable = data?.filter((t) => t.is_available).length || 0

  return {
    tickets: data || [],
    sectionCounts,
    totalAvailable,
    isLoading,
    error,
    mutate,
  }
}
