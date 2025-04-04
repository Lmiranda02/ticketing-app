/*
  Este script crea un usuario en la base de datos.
  Para ejecutarlo:
  1. Asegúrate de tener las variables de entorno configuradas (MONGODB_URI, MONGODB_DB)
  2. Ejecuta: node scripts/create-user.js
*/

const { MongoClient } = require("mongodb")
const bcrypt = require("bcrypt")
const readline = require("readline")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Obtener variables de entorno
require("dotenv").config()

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB

if (!uri || !dbName) {
  console.error("Error: MONGODB_URI y MONGODB_DB deben estar definidos en las variables de entorno")
  process.exit(1)
}

async function createUser() {
  console.log("Creando usuario...")

  // Solicitar datos del usuario
  const name = await question("Nombre completo: ")
  const email = await question("Correo electrónico: ")
  const password = await question("Contraseña: ")
  const role = await question("Rol (admin/user): ")

  // Validar datos
  if (!name || !email || !password) {
    console.error("Error: Todos los campos son obligatorios")
    process.exit(1)
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    console.error("Error: Formato de email inválido")
    process.exit(1)
  }

  // Validar longitud de contraseña
  if (password.length < 6) {
    console.error("Error: La contraseña debe tener al menos 6 caracteres")
    process.exit(1)
  }

  // Validar rol
  const validRole = role === "admin" ? "admin" : "user"

  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Conectado a MongoDB")

    const db = client.db(dbName)
    const usersCollection = db.collection("users")

    // Verificar si el usuario ya existe
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      console.error("Error: El correo electrónico ya está registrado")
      process.exit(1)
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear el usuario
    const result = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      role: validRole,
      createdAt: new Date().toISOString(),
    })

    console.log(`Usuario creado con ID: ${result.insertedId}`)
    console.log(`Rol: ${validRole}`)
    console.log("Ahora puedes iniciar sesión con estas credenciales.")
  } catch (error) {
    console.error("Error al crear usuario:", error)
  } finally {
    await client.close()
    rl.close()
  }
}

function question(query) {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

createUser()

