import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { TicketDashboard } from "@/components/dashboard/ticket-dashboard"
import { TicketProvider } from "@/contexts/ticket-context"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  return (
    <TicketProvider>
      <DashboardShell>
        <DashboardHeader heading="Panel de Tickets" text="Gestiona y monitorea todos los tickets de soporte." />
        <TicketDashboard />
      </DashboardShell>
    </TicketProvider>
  )
}

