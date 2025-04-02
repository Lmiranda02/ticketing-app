"use client"

import { useState } from "react"
import { format } from "date-fns"
import type { Ticket } from "@/types/ticket"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SlaCountdown } from "@/components/dashboard/sla-countdown"
import { TicketDetailDialog } from "@/components/dashboard/ticket-detail-dialog"
import { cn } from "@/lib/utils"

interface TicketsTableProps {
  tickets: Ticket[]
}

export function TicketsTable({ tickets }: TicketsTableProps) {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  const priorityColor = {
    alta: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    media: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  }

  const statusColor = {
    pendiente: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    en_progreso: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    resuelto: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  }

  const statusText = {
    pendiente: "Pendiente",
    en_progreso: "En progreso",
    resuelto: "Resuelto",
  }

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setIsDetailOpen(true)
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Asunto</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>SLA</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No hay tickets disponibles
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">#{ticket.id.substring(0, 8)}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{ticket.subject}</TableCell>
                  <TableCell>
                    <Badge className={cn(priorityColor[ticket.priority as keyof typeof priorityColor])}>
                      {ticket.priority === "alta" ? "Alta" : "Media"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={cn(statusColor[ticket.status as keyof typeof statusColor])}>
                      {statusText[ticket.status as keyof typeof statusText]}
                    </Badge>
                  </TableCell>
                  <TableCell>{format(new Date(ticket.createdAt), "dd/MM/yyyy HH:mm")}</TableCell>
                  <TableCell>
                    {ticket.status !== "resuelto" ? (
                      <SlaCountdown deadline={ticket.slaDeadline} />
                    ) : (
                      <span className="text-sm text-muted-foreground">Completado</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleTicketClick(ticket)}>
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedTicket && (
        <TicketDetailDialog ticket={selectedTicket} open={isDetailOpen} onOpenChange={setIsDetailOpen} />
      )}
    </div>
  )
}

