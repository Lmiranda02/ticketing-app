"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { TicketIcon, HomeIcon, SettingsIcon, SearchIcon } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: HomeIcon,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/tickets",
      label: "Tickets",
      icon: TicketIcon,
      active: pathname === "/dashboard/tickets",
    },
    {
      href: "/dashboard/test-classifier",
      label: "Probar Clasificador",
      icon: SearchIcon,
      active: pathname === "/dashboard/test-classifier",
    },
    {
      href: "/dashboard/settings",
      label: "Configuración",
      icon: SettingsIcon,
      active: pathname === "/dashboard/settings",
    },
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-primary" : "text-muted-foreground",
          )}
        >
          <route.icon className="mr-2 h-4 w-4" />
          {route.label}
        </Link>
      ))}
    </nav>
  )
}

