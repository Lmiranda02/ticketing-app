import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { TicketsTable } from "@/components/dashboard/tickets-table"
import { TicketProvider } from "@/contexts/ticket-context"

export default async function TicketsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  return (
    <TicketProvider>
      <DashboardShell>
        <DashboardHeader heading="Tickets" text="Visualiza y gestiona todos los tickets en formato de tabla." />
        <TicketsTable />
      </DashboardShell>
    </TicketProvider>
  )
}

