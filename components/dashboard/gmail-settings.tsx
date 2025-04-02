"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Mail, RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function GmailSettings() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSyncEmails = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/gmail")
      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sincronización exitosa",
          description: `Se procesaron ${data.processed} correos nuevos.`,
        })
      } else {
        throw new Error(data.error || "Error desconocido")
      }
    } catch (error) {
      console.error("Error al sincronizar correos:", error)
      toast({
        variant: "destructive",
        title: "Error de sincronización",
        description: "No se pudieron sincronizar los correos. Intente nuevamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Configuración de Gmail
        </CardTitle>
        <CardDescription>Sincroniza manualmente los correos de Gmail para crear tickets.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          La sincronización automática ocurre cada 15 minutos. También puedes sincronizar manualmente haciendo clic en
          el botón a continuación.
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSyncEmails} disabled={isLoading} className="flex items-center gap-2">
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sincronizando...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              Sincronizar ahora
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

