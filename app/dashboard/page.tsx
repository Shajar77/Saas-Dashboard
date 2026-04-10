"use client"

import * as React from "react"
import { Suspense } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

import { Button } from "@/components/ui/button"
import { CustomTable } from "@/components/CustomTable"
import { Modal } from "@/components/Modal"
import { TextField, SelectField } from "@/components/CustomFormElements"

import { fetchAssetDetails, type Asset, type AssetDetails } from "@/utils/api"
import { useAssetStore } from "@/stores/assetStore"
import { useUIStore } from "@/stores/uiStore"

// Component to handle asset details fetching and display
function AssetDetailsPanel({ assetId, assetPrice, assetQty }: { assetId: number; assetPrice?: number; assetQty?: number }) {
  const [details, setDetails] = React.useState<AssetDetails | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchAssetDetails(assetId).then(data => {
      if (!cancelled) {
        setDetails(data)
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [assetId])

  if (loading) {
    return (
      <div className="p-4 md:p-6 bg-gray-50 dark:bg-[#0a0a0a]/50 border-t border-gray-200 dark:border-white/5">
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm">Loading asset details...</span>
        </div>
      </div>
    )
  }

  if (!details) return null

  return (
    <div className="bg-gray-50/50 dark:bg-[#0a0a0a]/30 border-t border-gray-200 dark:border-white/5">
      <div className="flex flex-wrap items-center gap-6 md:gap-10 px-4 md:px-6 py-4">
        {/* Price - from asset data */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs text-gray-500 dark:text-gray-400">Price</span>
          <span className="text-base font-semibold text-gray-900 dark:text-white">${(assetPrice || details.price).toLocaleString()}</span>
        </div>
        {/* Divider */}
        <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-white/10"></div>
        {/* Quantity - from asset data */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs text-gray-500 dark:text-gray-400">Qty</span>
          <span className="text-base font-semibold text-gray-900 dark:text-white">{assetQty || details.quantity}</span>
        </div>
        {/* Divider */}
        <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-white/10"></div>
        {/* Vendor */}
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs text-gray-500 dark:text-gray-400">Vendor</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{details.vendor}</span>
        </div>
        {/* Divider */}
        <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-white/10"></div>
        {/* Warranty & Purchase Date - Right aligned */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>{details.warrantyMonths}mo warranty</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{details.purchaseDate}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function DashboardPage() {
  // URL State for filters
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get("search") || ""
  const filterCategory = searchParams.get("category") || "All"

  // Update URL params helper
  const updateSearchParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "All") {
        params.delete(key)
      } else {
        params.set(key, value)
      }
    })
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const setSearchQuery = (query: string) => updateSearchParams({ search: query })
  const setFilterCategory = (category: string) => updateSearchParams({ category })

  // Zustand Stores
  const { assets, loading, fetchAssetsFromApi, addAsset, updateAsset, deleteAsset } = useAssetStore()
  const {
    isModalOpen,
    editingAsset,
    openAddModal,
    openEditModal,
    closeModal,
    deleteModalOpen,
    assetToDelete,
    openDeleteModal,
    closeDeleteModal,
    formData,
    setFormData,
  } = useUIStore()

  // Load assets on mount
  React.useEffect(() => {
    fetchAssetsFromApi()
  }, [fetchAssetsFromApi])

  const filteredAssets = React.useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = filterCategory === "All" || asset.category === filterCategory
      return matchesSearch && matchesCategory
    })
  }, [assets, searchQuery, filterCategory])

  // Dynamic statistics based on assets
  const stats = React.useMemo(() => {
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

  const handleEdit = (asset: Asset) => {
    openEditModal(asset)
  }

  const handleDelete = (asset: Asset) => {
    openDeleteModal(asset)
  }

  const confirmDelete = () => {
    if (assetToDelete) {
      deleteAsset(assetToDelete.id)
      closeDeleteModal()
    }
  }

  const cancelDelete = () => {
    closeDeleteModal()
  }

  const handleOpenAdd = () => {
    openAddModal()
  }

  const handleSave = () => {
    if (!formData.name) return // simple validation

    if (editingAsset) {
      updateAsset(editingAsset.id, formData)
    } else {
      addAsset(formData)
    }
    closeModal()
  }

  const columns = [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Assets", sortable: true },
    { key: "category", label: "Category", sortable: true },
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row: Asset) => (
        <span
          className={`inline-flex items-center px-2 md:px-3 py-0.5 md:py-1 text-[10px] md:text-xs font-medium rounded-full border w-max whitespace-nowrap ${
            row.status === "Active"
              ? "bg-[#D3FF33]/10 text-[#D3FF33] border-[#D3FF33]/20"
              : "bg-red-500/10 text-red-500 border-red-500/20"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ]

  return (
    <div className="flex flex-1 flex-col gap-4 py-4 md:py-6 px-4 lg:px-6">
            {/* Top Bento Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left 4 cols - Stacked Cards */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                {/* Card 1: License Utilization */}
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
                {/* Card 2: Inventory */}
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
              </div>

              {/* Right 8 cols - Cloud Infrastructure Spend */}
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
            </div>

            {/* Bottom Bento Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Card 4: Asset Valuation - 4 cols */}
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

              {/* Card 5: Renewal Health - 4 cols */}
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

              {/* Card 6: Top Asset Spend - 4 cols */}
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
                  {[
                    { name: "AWS Infrastructure", cost: "$1,240", pct: 100 },
                    { name: "Salesforce CRM", cost: "$860", pct: 70 },
                    { name: "GitHub Enterprise", cost: "$420", pct: 35 },
                    { name: "Slack Pro", cost: "$310", pct: 25 },
                  ].map((item, idx) => (
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
            </div>

            {/* Data Area - Search, Filter, Add Button, Table */}
            <div className="mt-4 space-y-4">
              {/* Sleek Controls Container */}
              <div className="bg-white dark:bg-[#1c1c1e]/80 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-gray-200 dark:border-white/10 shadow-xl">
                <div className="flex flex-col gap-3">
                  {/* Top row: Search and Add button */}
                  <div className="flex items-center gap-2">
                    {/* Search with icon */}
                    <div className="flex-1 min-w-0">
                      <div className="relative group">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#D3FF33] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          type="text"
                          placeholder="Search assets..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-gray-100 dark:bg-[#0a0a0a]/80 border border-gray-300 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 focus:outline-none focus:border-[#D3FF33]/50 focus:ring-1 focus:ring-[#D3FF33]/20 transition-all"
                        />
                      </div>
                    </div>
                    {/* Add Button - Icon only on mobile */}
                    <Button
                      onClick={handleOpenAdd}
                      className="bg-[#D3FF33] text-black hover:bg-[#b8e62c] hover:scale-105 active:scale-95 rounded-xl h-10 w-10 sm:h-11 sm:w-auto sm:px-5 font-semibold shrink-0 transition-all duration-200 flex items-center justify-center"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="hidden sm:inline ml-1.5 text-sm">Add Asset</span>
                    </Button>
                  </div>
                  {/* Bottom row: Filter */}
                  <div className="w-full sm:w-44">
                    <div className="relative">
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="w-full bg-gray-100 dark:bg-[#0a0a0a]/80 border border-gray-300 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-gray-900 dark:text-white appearance-none cursor-pointer focus:outline-none focus:border-[#D3FF33]/50 transition-all hover:border-gray-400 dark:hover:border-white/20"
                      >
                        <option value="All">All Categories</option>
                        <option value="Hardware">Hardware</option>
                        <option value="Software">Software</option>
                      </select>
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Centralized Table Component */}
              {loading ? (
                <div className="w-full h-48 flex items-center justify-center border border-gray-200 dark:border-white/10 rounded-3xl bg-gray-100 dark:bg-[#1c1c1e] text-gray-500 dark:text-gray-400">
                  Loading assets...
                </div>
              ) : (
                <CustomTable
                  data={filteredAssets}
                  columns={columns}
                  sortable={true}
                  pagination={true}
                  pageSize={10}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  expandable={true}
                  renderExpanded={(row: Asset) => (
                    <AssetDetailsPanel assetId={row.id} assetPrice={row.price} assetQty={row.quantity} />
                  )}
                />
              )}
            </div>
        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => closeModal()}
          title={editingAsset ? "Edit Asset" : "Add New Asset"}
          description={editingAsset ? "Modify the details for this asset." : "Fill out the fields to register a new asset."}
        >
          <div className="space-y-4 pt-4">
            <TextField
              label="Asset Name"
              value={formData.name}
              onChange={(val) => setFormData((prev) => ({ ...prev, name: val }))}
              placeholder="e.g. MacBook Pro M3"
              required
            />
            <SelectField
              label="Category"
              value={formData.category}
              onChange={(val: any) => setFormData((prev) => ({ ...prev, category: val }))}
              options={[
                { label: "Hardware", value: "Hardware" },
                { label: "Software", value: "Software" },
              ]}
              required
            />
            <SelectField
              label="Status"
              value={formData.status}
              onChange={(val: any) => setFormData((prev) => ({ ...prev, status: val }))}
              options={[
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
              ]}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <TextField
                label="Unit Price ($)"
                type="number"
                value={formData.price.toString()}
                onChange={(val) => setFormData((prev) => ({ ...prev, price: parseInt(val) || 0 }))}
                placeholder="e.g. 999"
                required
              />
              <TextField
                label="Quantity"
                type="number"
                value={formData.quantity.toString()}
                onChange={(val) => setFormData((prev) => ({ ...prev, quantity: parseInt(val) || 1 }))}
                placeholder="e.g. 5"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => closeModal()}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!formData.name}>
                Save Asset
              </Button>
            </div>
          </div>
        </Modal>
        
        {/* Delete Confirmation Modal */}
        <Modal isOpen={deleteModalOpen} onClose={cancelDelete} title="Confirm Delete">
          <div className="space-y-4">
            <p className="text-gray-400">
              Are you sure you want to delete <span className="text-white font-medium">{assetToDelete?.name}</span>?
            </p>
            <p className="text-sm text-gray-500">This action cannot be undone.</p>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button 
                onClick={confirmDelete} 
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
    </div>
  )
}

// Wrapper with Suspense for useSearchParams
export default function DashboardPageWrapper() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center">Loading...</div>}>
      <DashboardPage />
    </Suspense>
  )
}
