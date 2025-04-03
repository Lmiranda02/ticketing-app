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
import { updateTicketStatus, deleteTicket } from "@/lib/tickets"
import { cn } from "@/lib/utils"
import { Loader2, Mail, Check, Trash2, Edit, AlertTriangle } from "lucide-react"
import { TicketEditDialog } from "@/components/dashboard/ticket-edit-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"

interface TicketDetailDialogProps {
  ticket: Ticket
  open: boolean
  onOpenChange: (open: boolean) => void
  onTicketUpdated?: () => void
}

export function TicketDetailDialog({ ticket, open, onOpenChange, onTicketUpdated }: TicketDetailDialogProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [currentTicket, setCurrentTicket] = useState<Ticket>(ticket)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

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
        if (onTicketUpdated) {
          onTicketUpdated()
        }
        toast({
          title: "Estado actualizado",
          description: `El ticket ha sido marcado como ${statusText[newStatus as keyof typeof statusText]}.`,
        })
      }
    } catch (error) {
      console.error("Error al actualizar el estado del ticket:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el estado del ticket.",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleMarkAsRead = async () => {
    if (!currentTicket.messageId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se puede marcar como leído: ID de mensaje no disponible.",
      })
      return
    }

    setIsUpdating(true)
    try {
      // Llamar directamente a la API en lugar de usar la función del servidor
      const baseUrl = window.location.origin
      const response = await fetch(`${baseUrl}/api/gmail/mark-read`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messageId: currentTicket.messageId }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Correo marcado como leído",
          description: "El correo ha sido marcado como leído en Gmail.",
        })
      } else {
        throw new Error("No se pudo marcar el correo como leído")
      }
    } catch (error) {
      console.error("Error al marcar como leído:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo marcar el correo como leído.",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    setIsUpdating(true)
    try {
      const result = await deleteTicket(currentTicket.id)
      if (result) {
        setIsDeleteDialogOpen(false)
        onOpenChange(false)
        if (onTicketUpdated) {
          onTicketUpdated()
        }
        toast({
          title: "Ticket eliminado",
          description: "El ticket ha sido eliminado correctamente.",
        })
      } else {
        throw new Error("No se pudo eliminar el ticket")
      }
    } catch (error) {
      console.error("Error al eliminar el ticket:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el ticket.",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleTicketUpdated = () => {
    if (onTicketUpdated) {
      onTicketUpdated()
    }
    // Recargar el ticket actual
    setCurrentTicket((prev) => ({ ...prev, ...currentTicket }))
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
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

          <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
            <div>
              <h3 className="font-semibold text-lg">{currentTicket.subject}</h3>
              <p className="text-sm text-muted-foreground">De: {currentTicket.sender}</p>
            </div>

            <div className="border rounded-md p-4 bg-muted/30 overflow-y-auto flex-1 max-h-[300px] transition-all">
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

          <DialogFooter className="flex-col sm:flex-row gap-2 mt-4 pt-4 border-t">
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {currentTicket.status === "pendiente" && (
                <Button
                  onClick={() => handleStatusChange("en_progreso")}
                  disabled={isUpdating}
                  className="flex-1 sm:flex-none"
                  variant="secondary"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      En progreso
                    </>
                  )}
                </Button>
              )}
              {currentTicket.status !== "resuelto" && (
                <Button
                  onClick={() => handleStatusChange("resuelto")}
                  disabled={isUpdating}
                  className="flex-1 sm:flex-none"
                  variant="default"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Resolver
                    </>
                  )}
                </Button>
              )}
              <Button
                onClick={handleMarkAsRead}
                disabled={isUpdating}
                className="flex-1 sm:flex-none"
                variant="outline"
              >
                <Mail className="mr-2 h-4 w-4" />
                Marcar como leído
              </Button>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={() => setIsEditDialogOpen(true)}
                disabled={isUpdating}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
              <Button
                onClick={() => setIsDeleteDialogOpen(true)}
                disabled={isUpdating}
                variant="destructive"
                className="flex-1 sm:flex-none"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TicketEditDialog
        ticket={currentTicket}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onTicketUpdated={handleTicketUpdated}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
              Confirmar eliminación
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar este ticket? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isUpdating}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

