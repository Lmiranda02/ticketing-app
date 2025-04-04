import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// Función auxiliar para validar el ID del ticket
async function getTicketById(db: any, id: string) {
  try {
    const ticketById = await db.collection("tickets").findOne({ id })
    if (ticketById) return ticketById

    if (ObjectId.isValid(id)) {
      const ticketByObjectId = await db.collection("tickets").findOne({ _id: new ObjectId(id) })
      return ticketByObjectId
    }

    return null
  } catch (error) {
    console.error("Error al buscar ticket:", error)
    return null
  }
}

// GET - Obtener un ticket específico
export async function GET(request: Request, context: Promise<{ params: { id: string } }>) {
  const { params } = await context
  const id = params.id

  try {
    if (!id) {
      return NextResponse.json({ success: false, error: "ID de ticket no proporcionado" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const ticket = await getTicketById(db, id)

    if (!ticket) {
      return NextResponse.json({ success: false, error: "Ticket no encontrado" }, { status: 404 })
    }

    return NextResponse.json(ticket)
  } catch (error) {
    console.error("Error al obtener ticket:", error)
    return NextResponse.json({ success: false, error: "Error al obtener ticket" }, { status: 500 })
  }
}

// DELETE - Eliminar un ticket
export async function DELETE(request: Request, context: Promise<{ params: { id: string } }>) {
  const { params } = await context
  const id = params.id

  try {
    if (!id) {
      return NextResponse.json({ success: false, error: "ID de ticket no proporcionado" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const ticket = await getTicketById(db, id)

    if (!ticket) {
      return NextResponse.json({ success: false, error: "Ticket no encontrado" }, { status: 404 })
    }

    const result = await db.collection("tickets").deleteOne({ id })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "No se pudo eliminar el ticket" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Ticket eliminado correctamente",
    })
  } catch (error) {
    console.error("Error al eliminar ticket:", error)
    return NextResponse.json({ success: false, error: "Error al eliminar ticket" }, { status: 500 })
  }
}

// PATCH - Actualizar un ticket
export async function PATCH(request: Request, context: Promise<{ params: { id: string } }>) {
  const { params } = await context
  const id = params.id

  try {
    if (!id) {
      return NextResponse.json({ success: false, error: "ID de ticket no proporcionado" }, { status: 400 })
    }

    const updates = await request.json()

    const allowedFields = ["status", "priority", "subject", "content"]
    const updateFields: Record<string, any> = {}

    for (const key of Object.keys(updates)) {
      if (allowedFields.includes(key)) {
        updateFields[key] = updates[key]
      }
    }

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { success: false, error: "No se proporcionaron campos válidos para actualizar" },
        { status: 400 }
      )
    }

    const { db } = await connectToDatabase()
    const ticket = await getTicketById(db, id)

    if (!ticket) {
      return NextResponse.json({ success: false, error: "Ticket no encontrado" }, { status: 404 })
    }

    const result = await db.collection("tickets").updateOne({ id }, { $set: updateFields })

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "No se pudo actualizar el ticket" }, { status: 500 })
    }

    const updatedTicket = await getTicketById(db, id)

    return NextResponse.json({
      success: true,
      message: "Ticket actualizado correctamente",
      ticket: updatedTicket,
    })
  } catch (error) {
    console.error("Error al actualizar ticket:", error)
    return NextResponse.json({ success: false, error: "Error al actualizar ticket" }, { status: 500 })
  }
}
