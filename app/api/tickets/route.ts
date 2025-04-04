import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const tickets = await db.collection("tickets").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(tickets)
  } catch (error) {
    console.error("Error al obtener tickets:", error)
    return NextResponse.json({ error: "Error al obtener tickets" }, { status: 500 })
  }
}

