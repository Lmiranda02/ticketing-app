"use client"

import { useState } from "react"
import { formatDistanceToNow, format } from "date-fns"
import { es } from "date-fns/locale"
import type { Ticket } from "@/types/ticket"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SlaCountdown } from "@/components/dashboard/sla-countdown"
import { updateTicketStatus } from "@/lib/tickets"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface TicketDetailDialogProps {
  ticket: Ticket
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TicketDetailDialog({ ticket, open, onOpenChange }: TicketDetailDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [currentTicket, setCurrentTicket] = useState<Ticket>(ticket)

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

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true)
    try {
      const result = await updateTicketStatus(currentTicket.id, newStatus)
      if (result) {
        setCurrentTicket({
          ...currentTicket,
          status: newStatus,
        })
      }
    } catch (error) {
      console.error("Error al actualizar el estado del ticket:", error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Ticket #{currentTicket.id.substring(0, 8)}</span>
            <Badge className={cn(priorityColor[currentTicket.priority as keyof typeof priorityColor])}>
              {currentTicket.priority === "alta" ? "Alta" : "Media"}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Creado{" "}
            {formatDistanceToNow(new Date(currentTicket.createdAt), {
              addSuffix: true,
              locale: es,
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{currentTicket.subject}</h3>
            <p className="text-sm text-muted-foreground">De: {currentTicket.sender}</p>
          </div>

          <div className="border rounded-md p-4 bg-muted/30">
            <p className="whitespace-pre-line">{currentTicket.content}</p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Estado:</span>
              <Badge className={cn(statusColor[currentTicket.status as keyof typeof statusColor])}>
                {statusText[currentTicket.status as keyof typeof statusText]}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Fecha de creación:</span>
              <span className="text-sm">{format(new Date(currentTicket.createdAt), "dd/MM/yyyy HH:mm")}</span>
            </div>
            {currentTicket.status !== "resuelto" && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Tiempo restante SLA:</span>
                <SlaCountdown deadline={currentTicket.slaDeadline} />
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {currentTicket.status === "pendiente" && (
            <Button
              onClick={() => handleStatusChange("en_progreso")}
              disabled={isUpdating}
              className="w-full sm:w-auto"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                "Marcar en progreso"
              )}
            </Button>
          )}
          {currentTicket.status !== "resuelto" && (
            <Button onClick={() => handleStatusChange("resuelto")} disabled={isUpdating} className="w-full sm:w-auto">
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                "Marcar como resuelto"
              )}
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

