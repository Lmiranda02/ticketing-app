import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI as string
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!process.env.MONGODB_URI) {
  throw new Error("Por favor, añada su URI de MongoDB a las variables de entorno.")
}

if (process.env.NODE_ENV === "development") {
  // En desarrollo, usamos una variable global para preservar el valor
  // entre recargas de módulos causadas por HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // En producción, es mejor no usar una variable global.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function connectToDatabase() {
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB)

  return { client, db }
}

// Exportamos una promesa de cliente MongoDB que puede ser reutilizada
// en diferentes contextos (API routes, Server Components, etc.)
export default clientPromise

