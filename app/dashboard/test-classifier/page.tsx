"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DashboardShell } from "@/components/dashboard/shell"
import { DashboardHeader } from "@/components/dashboard/header"

export default function TestClassifierPage() {
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [result, setResult] = useState<{ priority: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleTest = async () => {
    if (!subject || !content) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/test-classifier", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, content }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error al probar el clasificador:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Probar Clasificador"
        text="Prueba el clasificador de tickets para verificar su funcionamiento."
      />

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Prueba de Clasificación</CardTitle>
          <CardDescription>Ingresa un asunto y contenido para probar cómo se clasificaría un ticket.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Asunto del correo
            </label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ej: Problema con mi póliza de seguro"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Contenido del correo
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Ej: Hola, tuve un accidente con mi auto y necesito ayuda urgente..."
              rows={5}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4">
          <Button onClick={handleTest} disabled={isLoading || !subject || !content}>
            {isLoading ? "Clasificando..." : "Probar Clasificación"}
          </Button>

          {result && (
            <div className="w-full pt-4 border-t">
              <h3 className="text-sm font-medium mb-2">Resultado:</h3>
              <div className="flex items-center">
                <span className="mr-2">Prioridad:</span>
                <Badge
                  className={result.priority === "alta" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}
                >
                  {result.priority === "alta" ? "Alta" : "Media"}
                </Badge>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </DashboardShell>
  )
}

