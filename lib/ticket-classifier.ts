// Sistema de clasificación basado en palabras clave y reglas

export function classifyTicket(subject: string, content: string): { priority: string } {
  // Convertir a minúsculas para hacer la comparación insensible a mayúsculas
  const subjectLower = subject.toLowerCase()
  const contentLower = content.toLowerCase()
  const fullText = `${subjectLower} ${contentLower}`

  // Palabras clave que indican alta prioridad
  const highPriorityKeywords = [
    // Urgencia
    "urgente",
    "emergencia",
    "inmediato",
    "crítico",
    "grave",

    // Accidentes y problemas de vehículos
    "accidente",
    "choque",
    "colisión",
    "volcadura",
    "incendio",
    "robo",
    "robaron",
    "robado",
    "inmovilizado",
    "no arranca",
    "varado",
    "averiado",
    "grúa",
    "remolque",

    // Problemas de salud para mascotas
    "herido",
    "herida",
    "sangre",
    "sangrado",
    "vomitando",
    "no come",
    "no responde",
    "dificultad para respirar",
    "convulsiones",
    "envenenamiento",
    "atropellado",
    "cirugía urgente",

    // Plazos y tiempos críticos
    "vencido",
    "vencida",
    "expiró",
    "expirado",
    "mañana",
    "hoy mismo",
    "inmediatamente",
    "ya no puedo esperar",
  ]

  // Frases que indican alta prioridad
  const highPriorityPhrases = [
    "necesito ayuda urgente",
    "requiero asistencia inmediata",
    "no puede esperar",
    "situación grave",
    "necesito una solución hoy",
    "mi auto no funciona",
    "mi mascota está mal",
    "tuve un accidente",
  ]

  // Verificar palabras clave de alta prioridad
  for (const keyword of highPriorityKeywords) {
    if (fullText.includes(keyword)) {
      return { priority: "alta" }
    }
  }

  // Verificar frases de alta prioridad
  for (const phrase of highPriorityPhrases) {
    if (fullText.includes(phrase)) {
      return { priority: "alta" }
    }
  }

  // Si no se detecta alta prioridad, asignar prioridad media por defecto
  return { priority: "media" }
}

// Función auxiliar para extraer información adicional
export function extractTicketInfo(subject: string, content: string) {
  // Aquí podrías implementar lógica adicional para extraer:
  // - Tipo de seguro (auto/mascota)
  // - Número de póliza
  // - Información de contacto adicional
  // - etc.

  return {
    type: detectTicketType(subject, content),
    // Otros campos que quieras extraer
  }
}

// Detectar si es un ticket relacionado con auto o mascota
function detectTicketType(subject: string, content: string): string {
  const fullText = `${subject.toLowerCase()} ${content.toLowerCase()}`

  const autoKeywords = [
    "auto",
    "carro",
    "coche",
    "vehículo",
    "automóvil",
    "moto",
    "motocicleta",
    "camioneta",
    "seguro vehicular",
  ]
  const petKeywords = ["mascota", "perro", "gato", "animal", "veterinario", "mascota", "seguro de mascota"]

  for (const keyword of autoKeywords) {
    if (fullText.includes(keyword)) {
      return "auto"
    }
  }

  for (const keyword of petKeywords) {
    if (fullText.includes(keyword)) {
      return "mascota"
    }
  }

  return "general"
}

