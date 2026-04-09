"use client"

import * as React from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

import { CustomTable } from "@/components/CustomTable"
import { Modal } from "@/components/Modal"
import { TextField, SelectField } from "@/components/CustomFormElements"

import { fetchAssets, type Asset } from "@/utils/api"

export default function DashboardPage() {
  const [assets, setAssets] = React.useState<Asset[]>([])
  const [loading, setLoading] = React.useState(true)

  // Filters
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filterCategory, setFilterCategory] = React.useState("All")

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingAsset, setEditingAsset] = React.useState<Asset | null>(null)

  // Form State
  const [formData, setFormData] = React.useState({
    name: "",
    category: "Hardware" as "Hardware" | "Software",
    status: "Active" as "Active" | "Inactive",
  })

  React.useEffect(() => {
    async function loadData() {
      const data = await fetchAssets()
      setAssets(data)
      setLoading(false)
    }
    loadData()
  }, [])

  const filteredAssets = React.useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = filterCategory === "All" || asset.category === filterCategory
      return matchesSearch && matchesCategory
    })
  }, [assets, searchQuery, filterCategory])

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset)
    setFormData({
      name: asset.name,
      category: asset.category,
      status: asset.status,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (asset: Asset) => {
    if (confirm(`Are you sure you want to delete ${asset.name}?`)) {
      setAssets((prev) => prev.filter((a) => a.id !== asset.id))
    }
  }

  const handleOpenAdd = () => {
    setEditingAsset(null)
    setFormData({ name: "", category: "Hardware", status: "Active" })
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!formData.name) return // simple validation
    
    if (editingAsset) {
      setAssets((prev) =>
        prev.map((a) => (a.id === editingAsset.id ? { ...a, ...formData } : a))
      )
    } else {
      const newAsset: Asset = {
        id: Math.max(0, ...assets.map((a) => a.id)) + 1,
        ...formData,
      }
      setAssets([newAsset, ...assets])
    }
    setIsModalOpen(false)
  }

  const columns = [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Asset Name", sortable: true },
    { key: "category", label: "Category", sortable: true },
    { key: "status", label: "Status", sortable: true },
  ]

  const stats = {
    total: assets.length,
    hardware: assets.filter((a) => a.category === "Hardware" && a.status === "Active").length,
    software: assets.filter((a) => a.category === "Software" && a.status === "Active").length,
  }

  // Calculate financial metrics from assets
  const activeAssetsCount = assets.filter((a) => a.status === "Active").length
  const formatCurrency = (val: number) =>
    val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const balance = formatCurrency(assets.length * 1500)
  const income = formatCurrency(activeAssetsCount * 800)
  const expenses = formatCurrency((assets.length - activeAssetsCount) * 450)

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "16rem",
        "--header-height": "3rem",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="bg-[#0a0a0a]">
        <SiteHeader />

        <div className="flex flex-1 flex-col overflow-x-hidden">
          <div className="flex flex-1 flex-col gap-6 py-6 px-4 lg:px-6">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <p className="text-xs text-gray-400 mb-1">Good morning</p>
                <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
                  Dashboard
                </h1>
              </div>
              <div className="flex gap-6 sm:gap-10">
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">Balance</p>
                  <p className="text-2xl sm:text-3xl font-medium text-white tracking-tight">
                    {balance} $
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">Income</p>
                  <p className="text-2xl sm:text-3xl font-medium text-white tracking-tight">
                    {income} $
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">Expenses</p>
                  <p className="text-2xl sm:text-3xl font-medium text-white tracking-tight">
                    {expenses} $
                  </p>
                </div>
              </div>
            </div>

            {/* Top Bento Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left 1/3 - Stacked Percentage Cards */}
              <div className="flex flex-col gap-4">
                <div className="rounded-3xl p-5 bg-[#2A2B2F] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-4xl sm:text-5xl font-medium tracking-tight text-white">
                      65%
                    </span>
                    <span className="text-xs mt-1 text-gray-400">Transfer</span>
                  </div>
                  <span className="text-xs text-gray-500">29/user</span>
                </div>
                <div className="rounded-3xl p-5 bg-[#D3FF33] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-4xl sm:text-5xl font-medium tracking-tight text-black">
                      31%
                    </span>
                    <span className="text-xs mt-1 text-black/70">Receive</span>
                  </div>
                  <span className="text-xs text-black/50">8/user</span>
                </div>
              </div>

              {/* Right 2/3 - Analytics Blue Card */}
              <div className="lg:col-span-2 rounded-3xl p-6 bg-[#1A66FF] flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-white/70 mb-1">Analytics</p>
                    <div className="flex items-center gap-3">
                      <span className="text-5xl sm:text-6xl font-medium tracking-tight text-white">
                        78%
                      </span>
                      <div className="flex flex-col">
                        <span className="text-xs text-white/90 bg-white/20 px-2 py-1 rounded">
                          Increase
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* CSS Donut Placeholder */}
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32">
                    <div className="absolute inset-0 rounded-full border-[8px] border-white/20"></div>
                    <div
                      className="absolute inset-0 rounded-full border-[8px] border-white"
                      style={{
                        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                        transform: "rotate(-90deg)",
                      }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm text-white font-medium">78%</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <span className="text-[10px] text-white/80 bg-white/10 px-3 py-1.5 rounded-full">
                    Year-end storage improvements
                  </span>
                  <span className="text-[10px] text-white/80 bg-white/10 px-3 py-1.5 rounded-full">
                    Increase in the property investment branch
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Bento Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Cash Card */}
              <div className="rounded-3xl p-5 bg-[#2A2B2F] flex flex-col justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Cash</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-medium tracking-tight text-white">
                      {stats.total * 1200 + 2500}
                    </span>
                    <span className="text-xs text-[#D3FF33]">USD</span>
                  </div>
                  <p className="text-lg text-white font-medium mt-1">+36%</p>
                  <p className="text-[10px] text-gray-500">grow since last week</p>
                </div>
                {/* Mini bar chart */}
                <div className="flex items-end gap-1 mt-4 h-16">
                  <div className="w-4 bg-[#3A3B3F] rounded-sm h-6"></div>
                  <div className="w-4 bg-[#3A3B3F] rounded-sm h-10"></div>
                  <div className="w-4 bg-white rounded-sm h-14"></div>
                  <div className="w-4 bg-[#1A66FF] rounded-sm h-16"></div>
                </div>
              </div>

              {/* Period Analytic White Card */}
              <div className="rounded-3xl p-5 bg-white flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Period Analytic</p>
                    <p className="text-[10px] text-gray-400">3 Month</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#D3FF33] flex items-center justify-center">
                    <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 mb-1">User Authorized</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-medium tracking-tight text-black">
                      18,785
                    </span>
                    <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Payment Transaction Card */}
              <div className="rounded-3xl p-5 bg-[#2A2B2F] flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#3A3B3F] flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Payment</p>
                    <p className="text-xs text-white">Transaction</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {assets.slice(0, 3).map((asset) => (
                    <div key={asset.id} className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 truncate max-w-[120px]">
                        {asset.name}
                      </span>
                      <span className="text-xs text-white">{(asset.id * 120).toLocaleString()} $</span>
                    </div>
                  ))}
                  {assets.length === 0 && (
                    <p className="text-xs text-gray-500">No transactions</p>
                  )}
                </div>
              </div>
            </div>

            {/* Data Area - Search, Filter, Add Button, Table */}
            <div className="mt-4 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <TextField
                    label=""
                    placeholder="Search assets..."
                    value={searchQuery}
                    onChange={setSearchQuery}
                  />
                  <div className="w-48 mt-[-8px]">
                    <SelectField
                      label=""
                      value={filterCategory}
                      onChange={setFilterCategory}
                      options={[
                        { label: "All Categories", value: "All" },
                        { label: "Hardware", value: "Hardware" },
                        { label: "Software", value: "Software" },
                      ]}
                    />
                  </div>
                </div>
                <Button onClick={handleOpenAdd} className="w-full sm:w-auto">
                  Add Asset
                </Button>
              </div>

              {/* Centralized Table Component */}
              {loading ? (
                <div className="w-full h-48 flex items-center justify-center border border-white/10 rounded-3xl bg-[#1c1c1e] text-gray-400">
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
                />
              )}
            </div>
          </div>
        </div>

        {/* Centralized Reusable Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
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
              error={!formData.name && isModalOpen && editingAsset === undefined ? "Name is required" : undefined}
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
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!formData.name}>
                Save Asset
              </Button>
            </div>
          </div>
        </Modal>
      </SidebarInset>
    </SidebarProvider>
  )
}
