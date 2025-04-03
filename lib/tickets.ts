"use server"

import { connectToDatabase } from "@/lib/mongodb"
import type { Ticket } from "@/types/ticket"

export async function getTickets(): Promise<Ticket[]> {
  try {
    const { db } = await connectToDatabase()
    const tickets = await db.collection("tickets").find({}).sort({ createdAt: -1 }).toArray()

    return JSON.parse(JSON.stringify(tickets))
  } catch (error) {
    console.error("Error al obtener tickets:", error)
    return []
  }
}

export async function getTicketById(id: string): Promise<Ticket | null> {
  try {
    const { db } = await connectToDatabase()
    const ticket = await db.collection("tickets").findOne({ id })

    if (!ticket) {
      return null
    }

    return JSON.parse(JSON.stringify(ticket))
  } catch (error) {
    console.error("Error al obtener ticket por ID:", error)
    return null
  }
}

export async function updateTicketStatus(id: string, status: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase()
    const result = await db.collection("tickets").updateOne({ id }, { $set: { status } })

    return result.modifiedCount > 0
  } catch (error) {
    console.error("Error al actualizar estado del ticket:", error)
    return false
  }
}

export async function deleteTicket(id: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase()
    const result = await db.collection("tickets").deleteOne({ id })

    return result.deletedCount > 0
  } catch (error) {
    console.error("Error al eliminar ticket:", error)
    return false
  }
}

// Función para marcar un correo como leído
export async function markEmailAsRead(messageId: string): Promise<boolean> {
  try {
    // Usar la URL absoluta con window.location.origin
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
    const response = await fetch(`${baseUrl}/api/gmail/mark-read`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messageId }),
    })

    const data = await response.json()
    return data.success
  } catch (error) {
    console.error("Error al marcar correo como leído:", error)
    return false
  }
}

// Función para actualizar un ticket
export async function updateTicket(id: string, updates: Partial<Ticket>): Promise<boolean> {
  try {
    // Usar la URL absoluta con window.location.origin
    const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
    const response = await fetch(`${baseUrl}/api/tickets/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    })

    const data = await response.json()
    return data.success
  } catch (error) {
    console.error("Error al actualizar ticket:", error)
    return false
  }
}

