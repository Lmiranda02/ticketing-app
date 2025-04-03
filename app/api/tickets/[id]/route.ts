import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ success: false, error: "ID de ticket no proporcionado" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("tickets").deleteOne({ id })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Ticket no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al eliminar ticket:", error)
    return NextResponse.json({ success: false, error: "Error al eliminar ticket" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const updates = await request.json()

    if (!id) {
      return NextResponse.json({ success: false, error: "ID de ticket no proporcionado" }, { status: 400 })
    }

    // Validar que solo se actualicen campos permitidos
    const allowedFields = ["status", "priority", "subject", "content"]
    const updateFields: Record<string, any> = {}

    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        updateFields[key] = updates[key]
      }
    })

    if (Object.keys(updateFields).length === 0) {
      return NextResponse.json(
        { success: false, error: "No se proporcionaron campos válidos para actualizar" },
        { status: 400 },
      )
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("tickets").updateOne({ id }, { $set: updateFields })

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "Ticket no encontrado" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al actualizar ticket:", error)
    return NextResponse.json({ success: false, error: "Error al actualizar ticket" }, { status: 500 })
  }
}

