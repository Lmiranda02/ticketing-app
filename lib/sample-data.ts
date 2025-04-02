import type { Ticket } from "@/types/ticket"
import { addHours } from "date-fns"

// Función para generar datos de ejemplo para desarrollo
export function getSampleTickets(): Ticket[] {
  const now = new Date()

  return [
    {
      id: "sample-ticket-1",
      subject: "Problema con mi póliza de seguro de auto",
      content:
        "Hola, he tenido un accidente menor y necesito saber cómo proceder con mi reclamo. Mi número de póliza es ABC123.",
      sender: "cliente1@ejemplo.com",
      priority: "alta",
      status: "pendiente",
      createdAt: new Date(now.getTime() - 3600000).toISOString(), // 1 hora atrás
      slaDeadline: addHours(now, 23).toISOString(), // 23 horas restantes
    },
    {
      id: "sample-ticket-2",
      subject: "Consulta sobre cobertura para mi mascota",
      content: "Quisiera saber qué cubre exactamente mi seguro para mascotas en caso de una cirugía programada.",
      sender: "cliente2@ejemplo.com",
      priority: "media",
      status: "en_progreso",
      createdAt: new Date(now.getTime() - 86400000).toISOString(), // 1 día atrás
      slaDeadline: addHours(now, 24).toISOString(), // 24 horas restantes
    },
    {
      id: "sample-ticket-3",
      subject: "Renovación de póliza vencida",
      content: "Mi póliza de seguro automotriz venció hace una semana. Quisiera renovarla lo antes posible.",
      sender: "cliente3@ejemplo.com",
      priority: "alta",
      status: "resuelto",
      createdAt: new Date(now.getTime() - 172800000).toISOString(), // 2 días atrás
      slaDeadline: addHours(now, 0).toISOString(), // Ya cumplido
    },
  ]
}

