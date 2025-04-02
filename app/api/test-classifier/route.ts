import { NextResponse } from "next/server"
import { classifyTicket } from "@/lib/natural-classifier"

export async function POST(request: Request) {
  try {
    const { subject, content } = await request.json()

    if (!subject || !content) {
      return NextResponse.json({ error: "Se requiere asunto y contenido" }, { status: 400 })
    }

    const result = classifyTicket(subject, content)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error al probar el clasificador:", error)
    return NextResponse.json({ error: "Error al clasificar el ticket" }, { status: 500 })
  }
}

