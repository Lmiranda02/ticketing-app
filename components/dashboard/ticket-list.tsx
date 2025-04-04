"use client"

import { useState } from "react"
import type { Ticket } from "@/types/ticket"
import { TicketCard } from "@/components/dashboard/ticket-card"
import { TicketDetailDialog } from "@/components/dashboard/ticket-detail-dialog"

interface TicketListProps {
  tickets: Ticket[]
}

export function TicketList({ tickets }: TicketListProps) {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setIsDetailOpen(true)
  }

  return (
    <div className="w-full">
      {!tickets || tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">No hay tickets</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
              No se encontraron tickets con los filtros seleccionados.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mx-auto">
          {tickets.map((ticket, index) => (
            <TicketCard key={ticket.id} ticket={ticket} onClick={() => handleTicketClick(ticket)} index={index} />
          ))}
        </div>
      )}

      {selectedTicket && (
        <TicketDetailDialog ticket={selectedTicket} open={isDetailOpen} onOpenChange={setIsDetailOpen} />
      )}
    </div>
  )
}

