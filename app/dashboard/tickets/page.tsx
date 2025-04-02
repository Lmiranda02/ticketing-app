import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { TicketsTable } from "@/components/dashboard/tickets-table"
import { getTickets } from "@/lib/tickets"
import { getSampleTickets } from "@/lib/sample-data"

export default async function TicketsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  // Durante el desarrollo, podemos usar datos de ejemplo
  // En producción, usaríamos getTickets()
  let tickets
  try {
    tickets = await getTickets()
    // Si no hay tickets en la base de datos, usamos los de ejemplo
    if (!tickets || tickets.length === 0) {
      tickets = getSampleTickets()
    }
  } catch (error) {
    console.error("Error al obtener tickets:", error)
    tickets = getSampleTickets()
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Tickets" text="Visualiza y gestiona todos los tickets en formato de tabla." />
      <TicketsTable tickets={tickets} />
    </DashboardShell>
  )
}

