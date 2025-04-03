import type React from "react"
import { MainNav } from "@/components/dashboard/main-nav"
import { UserAccountNav } from "@/components/dashboard/user-account-nav"

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4 max-w-5xl mx-auto px-4">
          <MainNav />
          <UserAccountNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container max-w-5xl mx-auto py-6 px-4">
          <div className="grid gap-6 md:gap-8">{children}</div>
        </div>
      </main>
    </div>
  )
}

