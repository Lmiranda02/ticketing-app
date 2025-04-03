import type React from "react"

interface DashboardHeaderProps {
  heading: string
  text?: string
  children?: React.ReactNode
}

export function DashboardHeader({ heading, text, children }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-2 mb-6">
      <div className="grid gap-1 text-center sm:text-left mb-4 sm:mb-0">
        <h1 className="text-2xl font-bold tracking-wide">{heading}</h1>
        {text && <p className="text-muted-foreground">{text}</p>}
      </div>
      {children && <div className="flex justify-center sm:justify-end">{children}</div>}
    </div>
  )
}

