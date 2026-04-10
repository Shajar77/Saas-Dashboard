import * as React from "react"
import { type Asset } from "@/utils/api"

export interface DashboardStats {
  total: number
  active: number
  inactive: number
  hardware: number
  software: number
  licenseUtil: number
  licenseSeats: number
  valuation: number
  cloudSpend: number
  renewalHealth: number
  inventoryChart: { v: number }[]
  valuationChart: { v: number }[]
  cloudSpendChart: { m: string; v: number }[]
}

export function useDashboardStats(assets: Asset[]): DashboardStats {
  return React.useMemo(() => {
    const total = assets.length
    const active = assets.filter(a => a.status === "Active").length
    const inactive = assets.filter(a => a.status === "Inactive").length
    const hardware = assets.filter(a => a.category === "Hardware").length
    const software = assets.filter(a => a.category === "Software").length

    // License utilization (assume 500 max seats)
    const maxSeats = 500
    const licenseUtil = total > 0 ? Math.round((active / maxSeats) * 100) : 0

    // Asset valuation (actual: sum of price * quantity for all assets)
    const valuation = assets.reduce((sum, asset) => sum + ((asset.price || 0) * (asset.quantity || 1)), 0)

    // Cloud spend (monthly estimate: 10% of asset value for software, 2% for hardware)
    const cloudSpend = Math.round(assets.reduce((sum, asset) => {
      const monthlyRate = asset.category === "Software" ? 0.10 : 0.02
      return sum + ((asset.price || 0) * (asset.quantity || 1) * monthlyRate)
    }, 0))

    // Generate dynamic chart data based on assets
    const inventoryChart = [
      { v: Math.max(20, hardware * 5) },
      { v: Math.max(30, software * 8) },
      { v: Math.max(25, total * 3) },
      { v: Math.max(40, active * 4) },
      { v: Math.max(35, inactive * 10) },
      { v: Math.max(50, total * 5) },
      { v: Math.max(45, hardware * 6) },
      { v: Math.max(60, software * 7) },
    ]

    const valuationChart = [
      { v: Math.max(30, valuation / 10000) },
      { v: Math.max(40, hardware * 10) },
      { v: Math.max(35, software * 15) },
      { v: Math.max(50, total * 8) },
      { v: Math.max(45, active * 9) },
      { v: Math.max(70, inactive * 20) },
      { v: Math.max(60, hardware * 12) },
      { v: Math.max(80, software * 18) },
      { v: Math.max(75, total * 10) },
      { v: Math.max(95, valuation / 5000) },
    ]

    const cloudSpendChart = [
      { m: "Jan", v: cloudSpend * 0.8 },
      { m: "Feb", v: cloudSpend * 0.85 },
      { m: "Mar", v: cloudSpend * 0.9 },
      { m: "Apr", v: cloudSpend * 0.95 },
      { m: "May", v: cloudSpend },
      { m: "Jun", v: cloudSpend * 1.05 },
    ]

    return {
      total,
      active,
      inactive,
      hardware,
      software,
      licenseUtil: Math.min(licenseUtil, 100),
      licenseSeats: active,
      valuation,
      cloudSpend,
      renewalHealth: total > 0 ? Math.round((active / total) * 100) : 0,
      inventoryChart,
      valuationChart,
      cloudSpendChart,
    }
  }, [assets])
}
