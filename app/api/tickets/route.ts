import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

// GET - Obtener todos los tickets
export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const tickets = await db.collection("tickets").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(tickets)
  } catch (error) {
    console.error("Error al obtener tickets:", error)
    return NextResponse.json({ success: false, error: "Error al obtener tickets" }, { status: 500 })
  }
}

// POST - Crear un nuevo ticket (si lo necesitas en el futuro)
export async function POST(request: Request) {
  try {
    const ticketData = await request.json()

    // Validar datos mínimos requeridos
    if (!ticketData.subject || !ticketData.content || !ticketData.sender) {
      return NextResponse.json({ success: false, error: "Faltan datos requeridos" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const result = await db.collection("tickets").insertOne(ticketData)

    if (!result.insertedId) {
      return NextResponse.json({ success: false, error: "No se pudo crear el ticket" }, { status: 500 })
    }

    // Obtener el ticket recién creado
    const newTicket = await db.collection("tickets").findOne({ _id: result.insertedId })

    return NextResponse.json({
      success: true,
      message: "Ticket creado correctamente",
      ticket: newTicket,
    })
  } catch (error) {
    console.error("Error al crear ticket:", error)
    return NextResponse.json({ success: false, error: "Error al crear ticket" }, { status: 500 })
  }
}

