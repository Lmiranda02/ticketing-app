import { NextResponse } from "next/server"
import { google } from "googleapis"
import { connectToDatabase } from "@/lib/mongodb"
import { v4 as uuidv4 } from "uuid"
import { addHours } from "date-fns"
import { classifyTicket, trainClassifier } from "@/lib/natural-classifier"

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

// Asegurarse de que el clasificador esté entrenado al iniciar
trainClassifier()

export async function GET() {
  try {
    // Verificamos si estamos en desarrollo y si tenemos los tokens necesarios
    const isDevelopment = process.env.NODE_ENV === "development"
    const hasValidTokens =
      process.env.GMAIL_REFRESH_TOKEN && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET

    let processedTickets = []

    // Si estamos en desarrollo y no tenemos tokens válidos, usamos datos de ejemplo
    if (isDevelopment && !hasValidTokens) {
      console.log("Modo desarrollo: Usando datos de ejemplo en lugar de conectar a Gmail")

      const now = new Date()
      processedTickets = [
        {
          id: uuidv4(),
          messageId: "sample-message-1",
          subject: "Problema con mi póliza de seguro",
          sender: "cliente@ejemplo.com",
          content: "Hola, tengo un problema con mi póliza de seguro. Necesito ayuda urgente.",
          priority: "alta",
          status: "pendiente",
          createdAt: now.toISOString(),
          slaDeadline: addHours(now, 24).toISOString(),
        },
      ]

      // Intentamos guardar en la base de datos si está disponible
      try {
        const { db } = await connectToDatabase()
        await db.collection("tickets").insertOne(processedTickets[0])
      } catch (dbError) {
        console.log("No se pudo guardar en la base de datos:", dbError)
      }

      return NextResponse.json({
        success: true,
        processed: processedTickets.length,
        tickets: processedTickets,
        mode: "development-sample",
      })
    }

    // Si tenemos tokens válidos, intentamos conectar a Gmail
    // Obtener mensajes no leídos
    const response = await gmail.users.messages.list({
      userId: "me",
      q: "is:unread",
      maxResults: 10,
    })

    const messages = response.data.messages || []

    for (const message of messages) {
      if (!message.id) continue

      // Obtener detalles completos del mensaje
      const fullMessage = await gmail.users.messages.get({
        userId: "me",
        id: message.id,
      })

      // Extraer datos del mensaje
      const headers = fullMessage.data.payload?.headers || []
      const subject = headers.find((h) => h.name === "Subject")?.value || "Sin asunto"
      const from = headers.find((h) => h.name === "From")?.value || "Desconocido"

      // Extraer el cuerpo del mensaje
      let content = ""
      if (fullMessage.data.payload?.parts) {
        // Mensaje con partes (multipart)
        for (const part of fullMessage.data.payload.parts) {
          if (part.mimeType === "text/plain" && part.body?.data) {
            content = Buffer.from(part.body.data, "base64").toString("utf-8")
            break
          }
        }
      } else if (fullMessage.data.payload?.body?.data) {
        // Mensaje simple
        content = Buffer.from(fullMessage.data.payload.body.data, "base64").toString("utf-8")
      }

      // Clasificar el ticket usando Natural.js
      const classification = classifyTicket(subject, content)
      console.log(`Clasificación para ticket "${subject}": ${classification.priority}`)

      // Determinar SLA basado en la prioridad
      const now = new Date()
      const slaDeadline =
        classification.priority === "alta" ? addHours(now, 24).toISOString() : addHours(now, 48).toISOString()

      // Crear ticket en la base de datos
      const ticketData = {
        id: uuidv4(),
        messageId: message.id,
        subject,
        sender: from,
        content,
        priority: classification.priority,
        status: "pendiente",
        createdAt: now.toISOString(),
        slaDeadline,
      }

      try {
        const { db } = await connectToDatabase()
        await db.collection("tickets").insertOne(ticketData)
      } catch (dbError) {
        console.error("Error al guardar en la base de datos:", dbError)
      }

      processedTickets.push(ticketData)

      // Marcar el mensaje como leído solo si no estamos en desarrollo
      if (!isDevelopment) {
        try {
          await gmail.users.messages.modify({
            userId: "me",
            id: message.id,
            requestBody: {
              removeLabelIds: ["UNREAD"],
            },
          })
        } catch (modifyError) {
          console.error("Error al marcar mensaje como leído:", modifyError)
        }
      } else {
        console.log("Modo desarrollo: Omitiendo marcar mensaje como leído")
      }
    }

    return NextResponse.json({
      success: true,
      processed: processedTickets.length,
      tickets: processedTickets,
    })
  } catch (error) {
    console.error("Error al procesar correos:", error)
    return NextResponse.json({ success: false, error: "Error al procesar correos" }, { status: 500 })
  }
}

