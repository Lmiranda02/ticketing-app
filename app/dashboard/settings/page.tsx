import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { GmailSettings } from "@/components/dashboard/gmail-settings"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Configuración" text="Administra la configuración de la aplicación." />
      <div className="grid gap-6">
        <GmailSettings />
      </div>
    </DashboardShell>
  )
}

