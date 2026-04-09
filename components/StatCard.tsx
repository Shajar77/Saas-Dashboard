import * as React from "react"
import { IconTrendingUp, IconTrendingDown, IconMinus } from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export interface StatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  description?: string
  trend?: "up" | "down" | "neutral"
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: StatCardProps) {
  return (
    <Card className="bg-black/20 backdrop-blur-md border-white/10 overflow-hidden relative">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
            {trend === "up" && <IconTrendingUp className="w-3 h-3 text-emerald-500" />}
            {trend === "down" && <IconTrendingDown className="w-3 h-3 text-rose-500" />}
            {trend === "neutral" && <IconMinus className="w-3 h-3 text-slate-500" />}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
