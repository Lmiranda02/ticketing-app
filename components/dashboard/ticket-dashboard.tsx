"use client"

import { useState, useEffect } from "react"
import type { Ticket } from "@/types/ticket"
import { TicketList } from "@/components/dashboard/ticket-list"
import { TicketFilters } from "@/components/dashboard/ticket-filters"
import { useTickets } from "@/contexts/ticket-context"
import { Loader2 } from "lucide-react"

export function TicketDashboard() {
  const { tickets, loading, error } = useTickets()
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([])
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  useEffect(() => {
    if (tickets) {
      handleFilterChange(selectedPriority, selectedStatus)
    }
  }, [tickets, selectedPriority, selectedStatus])

  const handleFilterChange = (priority: string, status: string) => {
    setSelectedPriority(priority)
    setSelectedStatus(status)

    let filtered = [...tickets]

    if (priority !== "all") {
      filtered = filtered.filter((ticket) => ticket.priority === priority)
    }

    if (status !== "all") {
      filtered = filtered.filter((ticket) => ticket.status === status)
    }

    setFilteredTickets(filtered)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-40 text-destructive">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex justify-center w-full">
        <TicketFilters
          selectedPriority={selectedPriority}
          selectedStatus={selectedStatus}
          onFilterChange={handleFilterChange}
        />
      </div>
      <TicketList tickets={filteredTickets} />
    </div>
  )
}

