"use client"

import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import type { Ticket } from "@/types/ticket"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SlaCountdown } from "@/components/dashboard/sla-countdown"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface TicketCardProps {
  ticket: Ticket
  onClick: () => void
  index: number
}

export function TicketCard({ ticket, onClick, index }: TicketCardProps) {
  const priorityColor = {
    alta: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    media: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  }

  const statusColor = {
    pendiente: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    en_progreso: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    resuelto: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  }

  const statusText = {
    pendiente: "Pendiente",
    en_progreso: "En progreso",
    resuelto: "Resuelto",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="overflow-hidden transition-all hover:shadow-md cursor-pointer h-full" onClick={onClick}>
        <CardHeader className="p-4 pb-0">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground">Ticket #{ticket.id.substring(0, 8)}</p>
              <h3 className="font-semibold mt-1 line-clamp-1">{ticket.subject}</h3>
            </div>
            <Badge className={cn(priorityColor[ticket.priority as keyof typeof priorityColor])}>
              {ticket.priority === "alta" ? "Alta" : "Media"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground line-clamp-3">{ticket.content}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <Badge variant="outline" className={cn(statusColor[ticket.status as keyof typeof statusColor])}>
            {statusText[ticket.status as keyof typeof statusText]}
          </Badge>
          <div className="flex flex-col items-end">
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(ticket.createdAt), {
                addSuffix: true,
                locale: es,
              })}
            </p>
            {ticket.status !== "resuelto" && <SlaCountdown deadline={ticket.slaDeadline} />}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

