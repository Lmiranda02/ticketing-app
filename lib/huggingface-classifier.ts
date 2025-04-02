// Clasificador usando Hugging Face Inference API (capa gratuita)

export async function classifyTicket(subject: string, content: string): Promise<{ priority: string }> {
  try {
    // Combinar asunto y contenido
    const fullText = `${subject} ${content}`

    // Verificar si estamos en desarrollo
    if (process.env.NODE_ENV === "development" && !process.env.HUGGINGFACE_API_KEY) {
      console.log("Modo desarrollo: Clasificación simulada")

      // Simulamos la clasificación basada en palabras clave
      const urgentKeywords = ["urgente", "emergencia", "accidente", "grave", "inmediato", "ayuda"]
      const isUrgent = urgentKeywords.some((keyword) => fullText.toLowerCase().includes(keyword))

      return { priority: isUrgent ? "alta" : "media" }
    }

    // Llamar a la API de Hugging Face
    const response = await fetch(
      "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY || ""}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: fullText,
        }),
      },
    )

    const result = await response.json()

    // Interpretar los resultados
    // Este modelo específico clasifica sentimientos como POSITIVE/NEGATIVE
    // Podemos usar esto como proxy para urgencia (NEGATIVE = más urgente)
    if (Array.isArray(result) && result.length > 0) {
      // Encontrar la etiqueta con mayor puntuación
      const sortedLabels = result[0].sort((a, b) => b.score - a.score)
      const topLabel = sortedLabels[0].label

      // Asignar prioridad basada en el sentimiento
      // NEGATIVE generalmente indica problemas, quejas o urgencia
      return {
        priority: topLabel === "NEGATIVE" ? "alta" : "media",
      }
    }

    // Si hay algún problema con la respuesta, usar clasificación por palabras clave
    const urgentKeywords = ["urgente", "emergencia", "accidente", "grave", "inmediato", "ayuda"]
    const isUrgent = urgentKeywords.some((keyword) => fullText.toLowerCase().includes(keyword))

    return { priority: isUrgent ? "alta" : "media" }
  } catch (error) {
    console.error("Error al clasificar con Hugging Face:", error)

    // En caso de error, usar clasificación por palabras clave como respaldo
    const fullText = `${subject} ${content}`
    const urgentKeywords = ["urgente", "emergencia", "accidente", "grave", "inmediato", "ayuda"]
    const isUrgent = urgentKeywords.some((keyword) => fullText.toLowerCase().includes(keyword))

    return { priority: isUrgent ? "alta" : "media" }
  }
}

