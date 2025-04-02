import natural from "natural"
import { removeStopwords, spa } from "stopword"

// Inicializar el tokenizador y el clasificador
const tokenizer = new natural.WordTokenizer()
let classifier = new natural.BayesClassifier()

// Entrenar el clasificador con ejemplos
export function trainClassifier() {
  // Ejemplos de alta prioridad
  classifier.addDocument("Mi auto tuvo un accidente necesito ayuda urgente", "alta")
  classifier.addDocument("Tuve un choque y mi carro no arranca", "alta")
  classifier.addDocument("Mi perro está muy enfermo y necesita atención inmediata", "alta")
  classifier.addDocument("Emergencia con mi mascota está sangrando", "alta")
  classifier.addDocument("Urgente mi coche fue robado", "alta")
  classifier.addDocument("Accidente grave necesito asistencia inmediata", "alta")
  classifier.addDocument("Mi auto está inmovilizado en la carretera", "alta")
  classifier.addDocument("Mi gato tiene dificultad para respirar", "alta")
  classifier.addDocument("Necesito una grúa urgentemente", "alta")
  classifier.addDocument("Mi póliza venció ayer y tuve un accidente", "alta")

  // Añade más ejemplos específicos para tu negocio
  classifier.addDocument("Mi vehículo fue impactado por otro conductor", "alta")
  classifier.addDocument("Mi mascota ingirió algo tóxico y está vomitando", "alta")
  classifier.addDocument("Choqué mi auto contra un poste", "alta")
  classifier.addDocument("Mi perro fue atropellado", "alta")
  classifier.addDocument("Necesito asistencia en carretera inmediatamente", "alta")
  classifier.addDocument("Mi auto se quedó sin frenos", "alta")
  classifier.addDocument("Mi gato no puede caminar", "alta")
  classifier.addDocument("Tuve un accidente y hay heridos", "alta")
  classifier.addDocument("Mi vehículo fue vandalizado", "alta")
  classifier.addDocument("Mi mascota tiene convulsiones", "alta")

  // Ejemplos de prioridad media
  classifier.addDocument("Tengo una consulta sobre mi póliza de seguro", "media")
  classifier.addDocument("Quisiera saber los detalles de cobertura", "media")
  classifier.addDocument("Información sobre renovación de seguro", "media")
  classifier.addDocument("Cuándo vence mi póliza actual", "media")
  classifier.addDocument("Necesito actualizar mis datos de contacto", "media")
  classifier.addDocument("Consulta sobre el costo de mi seguro", "media")
  classifier.addDocument("Quiero añadir un vehículo a mi póliza", "media")
  classifier.addDocument("Información sobre vacunas para mi mascota", "media")
  classifier.addDocument("Cambio de dirección en mi póliza", "media")
  classifier.addDocument("Cuáles son los beneficios de mi seguro", "media")

  // Añade más ejemplos específicos para tu negocio
  classifier.addDocument("Quisiera saber si mi seguro cubre chequeos preventivos", "media")
  classifier.addDocument("Necesito una copia de mi póliza", "media")
  classifier.addDocument("¿Puedo incluir a otro conductor en mi seguro?", "media")
  classifier.addDocument("¿Cuánto cuesta añadir otra mascota a mi plan?", "media")
  classifier.addDocument("Quiero cambiar mi forma de pago", "media")
  classifier.addDocument("¿Ofrecen descuentos por múltiples vehículos?", "media")
  classifier.addDocument("¿Cuál es el proceso para renovar mi seguro?", "media")
  classifier.addDocument("Necesito un certificado de mi seguro", "media")
  classifier.addDocument("¿Cubren tratamientos dentales para mascotas?", "media")
  classifier.addDocument("¿Puedo modificar mi plan actual?", "media")

  // Entrenar el clasificador
  classifier.train()
  console.log("Clasificador entrenado correctamente")
}

// Preprocesar el texto
function preprocessText(text: string): string[] {
  // Convertir a minúsculas
  const lowerText = text.toLowerCase()

  // Tokenizar
  const tokens = tokenizer.tokenize(lowerText) || []

  // Eliminar stopwords (palabras comunes que no aportan significado)
  const filteredTokens = removeStopwords(tokens, spa)

  return filteredTokens
}

// Clasificar un ticket
export function classifyTicket(subject: string, content: string): { priority: string } {
  // Asegurarse de que el clasificador esté entrenado
  if (!classifier.trained) {
    trainClassifier()
  }

  // Combinar asunto y contenido
  const fullText = `${subject} ${content}`

  // Preprocesar el texto
  const processedText = preprocessText(fullText).join(" ")

  // Si el texto procesado está vacío, devolver prioridad media por defecto
  if (!processedText) {
    return { priority: "media" }
  }

  // Clasificar el texto
  const classification = classifier.classify(processedText)

  return { priority: classification }
}

// Guardar el clasificador entrenado (opcional)
export function saveClassifier(filename: string) {
  classifier.save(filename, (err) => {
    if (err) {
      console.error(err)
    } else {
      console.log(`Clasificador guardado en ${filename}`)
    }
  })
}

// Cargar un clasificador previamente entrenado (opcional)
export function loadClassifier(filename: string, callback: () => void) {
  natural.BayesClassifier.load(filename, null, (err, loadedClassifier) => {
    if (err) {
      console.error(err)
    } else if (loadedClassifier) {
      // Usar el clasificador cargado
      classifier = loadedClassifier
      callback()
    }
  })
}

