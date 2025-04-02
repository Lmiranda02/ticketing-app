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

