"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { Ticket } from "@/types/ticket"

interface TicketContextType {
  tickets: Ticket[]
  loading: boolean
  error: string | null
  refreshTickets: () => Promise<void>
}

const TicketContext = createContext<TicketContextType | undefined>(undefined)

export function TicketProvider({ children }: { children: React.ReactNode }) {
  // En la función TicketProvider, inicializar tickets como un array vacío
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Y asegurarnos de que siempre devolvamos un array, incluso en caso de error
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true)
      const baseUrl = window.location.origin
      const response = await fetch(`${baseUrl}/api/tickets`)

      if (!response.ok) {
        throw new Error("Error al cargar tickets")
      }

      const data = await response.json()
      setTickets(data || []) // Asegurarnos de que siempre sea un array
      setError(null)
    } catch (err) {
      console.error("Error al cargar tickets:", err)
      setError("No se pudieron cargar los tickets. Por favor, intente nuevamente.")
      setTickets([]) // Establecer un array vacío en caso de error
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshTickets = useCallback(async () => {
    await fetchTickets()
  }, [fetchTickets])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  return <TicketContext.Provider value={{ tickets, loading, error, refreshTickets }}>{children}</TicketContext.Provider>
}

export function useTickets() {
  const context = useContext(TicketContext)
  if (context === undefined) {
    throw new Error("useTickets debe ser usado dentro de un TicketProvider")
  }
  return context
}

