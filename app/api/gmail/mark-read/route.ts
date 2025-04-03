import { NextResponse } from "next/server"
import { google } from "googleapis"
import { connectToDatabase } from "@/lib/mongodb"

// Configuración de OAuth2
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
)

// Establecer credenciales
oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
})

// Crear cliente de Gmail
const gmail = google.gmail({ version: "v1", auth: oauth2Client })

export async function POST(request: Request) {
  try {
    const { messageId } = await request.json()

    if (!messageId) {
      return NextResponse.json({ success: false, error: "ID de mensaje no proporcionado" }, { status: 400 })
    }

    // Verificar si estamos en desarrollo
    const isDevelopment = process.env.NODE_ENV === "development"
    const hasValidTokens =
      process.env.GMAIL_REFRESH_TOKEN && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET

    // Si estamos en desarrollo y no tenemos tokens válidos, simulamos el éxito
    if (isDevelopment && !hasValidTokens) {
      console.log(`Modo desarrollo: Simulando marcar mensaje ${messageId} como leído`)

      // Actualizar el ticket en la base de datos
      try {
        const { db } = await connectToDatabase()
        await db
          .collection("tickets")
          .updateOne({ messageId }, { $set: { markedAsRead: true, readAt: new Date().toISOString() } })
      } catch (dbError) {
        console.error("Error al actualizar el ticket:", dbError)
      }

      return NextResponse.json({
        success: true,
        mode: "development-simulation",
      })
    }

    // Si tenemos tokens válidos, intentamos marcar el mensaje como leído en Gmail
    await gmail.users.messages.modify({
      userId: "me",
      id: messageId,
      requestBody: {
        removeLabelIds: ["UNREAD"],
      },
    })

    // Actualizar el ticket en la base de datos
    try {
      const { db } = await connectToDatabase()
      await db
        .collection("tickets")
        .updateOne({ messageId }, { $set: { markedAsRead: true, readAt: new Date().toISOString() } })
    } catch (dbError) {
      console.error("Error al actualizar el ticket:", dbError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error al marcar mensaje como leído:", error)
    return NextResponse.json({ success: false, error: "Error al marcar mensaje como leído" }, { status: 500 })
  }
}

