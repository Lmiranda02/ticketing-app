"use client"

import { useState } from "react"
import type { Ticket } from "@/types/ticket"
import { TicketList } from "@/components/dashboard/ticket-list"
import { TicketFilters } from "@/components/dashboard/ticket-filters"

interface TicketDashboardProps {
  tickets: Ticket[]
}

export function TicketDashboard({ tickets }: TicketDashboardProps) {
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(tickets)
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

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

  return (
    <div className="space-y-4">
      <TicketFilters
        selectedPriority={selectedPriority}
        selectedStatus={selectedStatus}
        onFilterChange={handleFilterChange}
      />
      <TicketList tickets={filteredTickets} />
    </div>
  )
}

