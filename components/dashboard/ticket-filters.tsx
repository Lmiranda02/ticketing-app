"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TicketFiltersProps {
  selectedPriority: string
  selectedStatus: string
  onFilterChange: (priority: string, status: string) => void
}

export function TicketFilters({ selectedPriority, selectedStatus, onFilterChange }: TicketFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Prioridad:</span>
        <Select value={selectedPriority} onValueChange={(value) => onFilterChange(value, selectedStatus)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todas las prioridades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="media">Media</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Estado:</span>
        <Select value={selectedStatus} onValueChange={(value) => onFilterChange(selectedPriority, value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pendiente">Pendiente</SelectItem>
            <SelectItem value="en_progreso">En progreso</SelectItem>
            <SelectItem value="resuelto">Resuelto</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button variant="outline" onClick={() => onFilterChange("all", "all")} className="ml-auto">
        Limpiar filtros
      </Button>
    </div>
  )
}

