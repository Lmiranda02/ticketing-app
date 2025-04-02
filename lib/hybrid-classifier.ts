// Sistema híbrido de clasificación de tickets

// 1. Clasificación basada en reglas
function ruleBasedClassification(subject: string, content: string): string {
  const fullText = `${subject.toLowerCase()} ${content.toLowerCase()}`

  // Palabras clave de alta prioridad
  const highPriorityKeywords = [
    "urgente",
    "emergencia",
    "accidente",
    "grave",
    "inmediato",
    "crítico",
    "herido",
    "inmovilizado",
    "robo",
    "robado",
  ]

  // Verificar palabras clave
  for (const keyword of highPriorityKeywords) {
    if (fullText.includes(keyword)) {
      return "alta"
    }
  }

  return "" // Sin decisión
}

// 2. Análisis de sentimiento simple
function sentimentAnalysis(text: string): string {
  // Lista de palabras negativas que pueden indicar urgencia
  const negativeWords = [
    "problema",
    "error",
    "falla",
    "mal",
    "terrible",
    "horrible",
    "preocupado",
    "preocupación",
    "miedo",
    "asustado",
    "dolor",
    "molesto",
    "enojado",
    "frustrado",
    "insatisfecho",
    "decepcionado",
  ]

  // Contar palabras negativas
  let negativeCount = 0
  const words = text.toLowerCase().split(/\s+/)

  for (const word of words) {
    if (negativeWords.includes(word)) {
      negativeCount++
    }
  }

  // Si hay muchas palabras negativas, podría ser urgente
  if (negativeCount >= 3 || (negativeCount > 0 && words.length < 20)) {
    return "alta"
  }

  return "" // Sin decisión
}

// 3. Análisis de longitud y estructura
function structureAnalysis(content: string): string {
  // Mensajes muy cortos a menudo indican urgencia
  if (content.length < 50 && content.includes("?")) {
    return "alta"
  }

  // Mensajes con muchos signos de exclamación o mayúsculas
  const exclamationCount = (content.match(/!/g) || []).length
  const uppercaseRatio = content.split("").filter((c) => c >= "A" && c <= "Z").length / content.length

  if (exclamationCount >= 2 || uppercaseRatio > 0.3) {
    return "alta"
  }

  return "" // Sin decisión
}

// 4. Análisis de tiempo
function timeAnalysis(subject: string, content: string): string {
  const fullText = `${subject.toLowerCase()} ${content.toLowerCase()}`

  // Palabras que indican urgencia temporal
  const timeUrgencyWords = [
    "hoy",
    "ahora",
    "inmediatamente",
    "pronto",
    "urgente",
    "mañana",
    "cuanto antes",
    "ya",
    "rápido",
    "enseguida",
  ]

  for (const word of timeUrgencyWords) {
    if (fullText.includes(word)) {
      return "alta"
    }
  }

  return "" // Sin decisión
}

// Función principal de clasificación híbrida
export function classifyTicket(subject: string, content: string): { priority: string } {
  // Aplicar cada método de clasificación
  const ruleResult = ruleBasedClassification(subject, content)
  const sentimentResult = sentimentAnalysis(`${subject} ${content}`)
  const structureResult = structureAnalysis(content)
  const timeResult = timeAnalysis(subject, content)

  // Si cualquier método indica alta prioridad, clasificar como alta
  if (ruleResult === "alta" || sentimentResult === "alta" || structureResult === "alta" || timeResult === "alta") {
    return { priority: "alta" }
  }

  // Por defecto, asignar prioridad media
  return { priority: "media" }
}

// Función para extraer información adicional
export function extractTicketInfo(subject: string, content: string) {
  const fullText = `${subject.toLowerCase()} ${content.toLowerCase()}`

  // Detectar tipo de seguro
  let type = "general"

  const autoKeywords = ["auto", "carro", "coche", "vehículo", "automóvil"]
  const petKeywords = ["mascota", "perro", "gato", "animal", "veterinario"]

  for (const keyword of autoKeywords) {
    if (fullText.includes(keyword)) {
      type = "auto"
      break
    }
  }

  if (type === "general") {
    for (const keyword of petKeywords) {
      if (fullText.includes(keyword)) {
        type = "mascota"
        break
      }
    }
  }

  // Intentar extraer número de póliza (formato común: letras seguidas de números)
  const policyNumberMatch = fullText.match(/[a-z]{2,5}[-\s]?\d{4,8}/i)
  const policyNumber = policyNumberMatch ? policyNumberMatch[0] : null

  return {
    type,
    policyNumber,
  }
}

