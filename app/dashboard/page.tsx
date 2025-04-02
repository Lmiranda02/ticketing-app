import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { TicketDashboard } from "@/components/dashboard/ticket-dashboard"
import { getTickets } from "@/lib/tickets"
import { getSampleTickets } from "@/lib/sample-data"

export default async function DashboardPage() {
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
      <DashboardHeader heading="Panel de Tickets" text="Gestiona y monitorea todos los tickets de soporte." />
      <TicketDashboard tickets={tickets} />
    </DashboardShell>
  )
}

