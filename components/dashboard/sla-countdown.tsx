"use client"

import { useEffect, useState, useRef } from "react"
import { differenceInMilliseconds } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"

interface SlaCountdownProps {
  deadline: string
}

export function SlaCountdown({ deadline }: SlaCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const deadlineDate = useRef(new Date(deadline)).current

  useEffect(() => {
    const calculateTimeLeft = () => {
      const diff = differenceInMilliseconds(deadlineDate, new Date())
      setTimeLeft(Math.max(0, diff))
    }

    // Calcular inicialmente
    calculateTimeLeft()

    // Configurar el intervalo
    const timer = setInterval(calculateTimeLeft, 1000)

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(timer)
  }, [deadlineDate]) // Solo se ejecuta cuando cambia deadlineDate

  const hours = Math.floor(timeLeft / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

  const isExpired = timeLeft === 0
  const isWarning = hours < 4 && !isExpired

  return (
    <Badge
      variant="outline"
      className={cn(
        "flex items-center gap-1 mt-1",
        isExpired
          ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          : isWarning
            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
            : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      )}
    >
      <Clock className="h-3 w-3" />
      {isExpired ? (
        <span>SLA vencido</span>
      ) : (
        <span>
          {hours}h {minutes}m
        </span>
      )}
    </Badge>
  )
}

