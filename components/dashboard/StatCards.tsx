"use client"

import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { type DashboardStats } from "@/hooks/useDashboardStats"

// ========================================
// Card 1: License Utilization
// ========================================
export function LicenseUtilizationCard({ stats }: { stats: DashboardStats }) {
  return (
    <div className="rounded-3xl p-4 md:p-5 bg-white dark:bg-[#2A2B2F]/80 backdrop-blur-md border border-gray-200 dark:border-white/10 flex items-center justify-between min-h-[100px]">
      <div className="flex flex-col flex-1 min-w-0">
        <span className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
          {stats.licenseUtil}%
        </span>
        <span className="text-xs mt-0.5 text-gray-500 dark:text-gray-400">License Utilization</span>
        <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{stats.licenseSeats} / 500 Seats</span>
      </div>
      <div className="w-24 md:w-28 h-14 md:h-16 ml-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={[{v:30},{v:45},{v:35},{v:60},{v:55},{v:82},{v:78}]} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
            <defs>
              <linearGradient id="utilGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D3FF33" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#D3FF33" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke="#D3FF33" strokeWidth={2.5} fill="url(#utilGrad)" animationDuration={1500} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ========================================
// Card 2: Inventory
// ========================================
export function InventoryCard({ stats }: { stats: DashboardStats }) {
  return (
    <div className="rounded-3xl p-4 md:p-5 bg-gradient-to-br from-[#D3FF33] to-[#b8e62c] backdrop-blur-md border border-[#D3FF33]/40 flex items-center justify-between min-h-[100px] shadow-lg shadow-[#D3FF33]/10">
      <div className="flex flex-col min-w-0">
        <span className="text-3xl md:text-4xl font-bold tracking-tight text-black">
          {stats.total}
        </span>
        <span className="text-[10px] font-medium text-black/60 uppercase tracking-wider mt-1">Inventory</span>
        <span className="text-[10px] text-black/50 mt-0.5">{stats.active} Active · {stats.inactive} Inactive</span>
      </div>
      <div className="w-24 md:w-28 h-14 md:h-16 ml-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.inventoryChart} margin={{ top: 5, right: 0, bottom: 2, left: 0 }} barCategoryGap="1%">
            <defs>
              <linearGradient id="invGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#000000" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#000000" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
            <Bar dataKey="v" fill="url(#invGrad)" radius={[2,2,0,0]} barSize={7} animationDuration={1200} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ========================================
// Card 3: Cloud Infrastructure Spend
// ========================================
export function CloudSpendCard({ stats }: { stats: DashboardStats }) {
  return (
    <div className="lg:col-span-8 rounded-3xl p-4 md:p-6 bg-gradient-to-br from-[#1A66FF] to-[#0d52d9] backdrop-blur-md border border-white/20 flex flex-col min-h-[216px]">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-white/80 mb-1">Cloud Infrastructure Spend</p>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-3xl md:text-5xl font-semibold tracking-tight text-white">
              ${stats.cloudSpend.toLocaleString()}
            </span>
            <span className="text-xs text-[#D3FF33] bg-[#D3FF33]/10 px-2 py-0.5 rounded-full">+12%</span>
          </div>
        </div>
        {/* Status Donut - Shows Active Assets % */}
        <div className="flex flex-col items-center justify-center ml-4">
          <div className="relative w-20 h-20 md:w-24 md:h-24">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={[{v:stats.renewalHealth},{v:100-stats.renewalHealth}]} 
                  dataKey="v" 
                  innerRadius={28} 
                  outerRadius={36} 
                  startAngle={90} 
                  endAngle={-270}
                  stroke="none"
                  paddingAngle={2}
                >
                  <Cell fill="#FFFFFF" />
                  <Cell fill="rgba(255,255,255,0.15)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm md:text-base font-semibold text-white">{stats.renewalHealth}%</span>
            </div>
          </div>
        </div>
      </div>
      {/* Area Chart */}
      <div className="flex-1 w-full min-h-[80px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={stats.cloudSpendChart} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="cloudGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.35}/>
                <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="v" stroke="#FFFFFF" strokeWidth={2.5} fill="url(#cloudGradient)" animationDuration={2000} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ========================================
// Card 4: Asset Valuation
// ========================================
export function AssetValuationCard({ stats }: { stats: DashboardStats }) {
  return (
    <div className="lg:col-span-4 rounded-3xl p-4 md:p-5 bg-white dark:bg-[#2A2B2F]/80 backdrop-blur-md border border-gray-200 dark:border-white/10 flex flex-col min-h-[200px] md:min-h-[250px]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Asset Valuation</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              ${stats.valuation.toLocaleString()}
            </span>
            <span className="text-xs text-[#D3FF33]">USD</span>
          </div>
        </div>
        <span className="text-xs text-[#D3FF33] bg-[#D3FF33]/10 px-2 py-1 rounded-full">+4.2%</span>
      </div>
      {/* Gradient Bar Chart */}
      <div className="flex-1 w-full min-h-[80px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.valuationChart} margin={{ top: 5, right: 0, bottom: 5, left: 0 }} barCategoryGap="1%">
            <defs>
              <linearGradient id="valGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D3FF33" />
                <stop offset="100%" stopColor="#1A66FF" />
              </linearGradient>
            </defs>
            <Bar dataKey="v" fill="url(#valGrad)" radius={[3,3,0,0]} barSize={12} animationDuration={1200} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ========================================
// Card 5: Renewal Health
// ========================================
export function RenewalHealthCard({ stats }: { stats: DashboardStats }) {
  return (
    <div className="lg:col-span-4 rounded-3xl p-4 md:p-5 bg-white dark:bg-white/95 backdrop-blur-md border border-gray-200 dark:border-white/30 flex flex-col min-h-[200px] md:min-h-[250px]">
      <div>
        <p className="text-xs text-gray-600 dark:text-gray-500 mb-1">Renewal Health</p>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl md:text-5xl font-semibold tracking-tight text-gray-900 dark:text-black">
            {stats.renewalHealth}
          </span>
          <span className="text-sm text-gray-400 dark:text-gray-400">/100</span>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mt-auto pt-4">
        <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 mb-1">
          <span>Health Score</span>
          <span>{stats.renewalHealth >= 90 ? 'Excellent' : stats.renewalHealth >= 70 ? 'Good' : 'Needs Attention'}</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#D3FF33] to-[#a8cc29] rounded-full transition-all duration-1000" style={{ width: `${stats.renewalHealth}%` }} />
        </div>
        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
          {stats.inactive} assets need attention
        </p>
      </div>
    </div>
  )
}

// ========================================
// Card 6: Top Asset Spend
// ========================================
const topSpendItems = [
  { name: "AWS Infrastructure", cost: "$1,240", pct: 100 },
  { name: "Salesforce CRM", cost: "$860", pct: 70 },
  { name: "GitHub Enterprise", cost: "$420", pct: 35 },
  { name: "Slack Pro", cost: "$310", pct: 25 },
]

export function TopAssetSpendCard() {
  return (
    <div className="lg:col-span-4 rounded-3xl p-4 md:p-5 bg-white dark:bg-[#2A2B2F]/80 backdrop-blur-md border border-gray-200 dark:border-white/10 flex flex-col min-h-[200px] md:min-h-[250px]">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-[#D3FF33] flex items-center justify-center">
          <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-xs text-gray-900 dark:text-white font-medium">Top Asset Spend</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">Monthly SaaS Costs</p>
        </div>
      </div>
      {/* Mini horizontal bar chart */}
      <div className="flex-1 flex flex-col justify-center gap-2">
        {topSpendItems.map((item, idx) => (
          <div key={idx} className="group">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500 dark:text-gray-400 truncate max-w-[100px]">{item.name}</span>
              <span className="text-[#D3FF33] font-medium">{item.cost}</span>
            </div>
            <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#D3FF33] to-[#1A66FF] rounded-full transition-all duration-700"
                style={{ width: `${item.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
