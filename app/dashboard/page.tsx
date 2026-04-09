"use client"

import * as React from "react"
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis } from "recharts"

import { AppSidebar, Logo } from "@/components/app-sidebar"
import { TopNav } from "@/components/TopNav"
import { Button } from "@/components/ui/button"

import { CustomTable } from "@/components/CustomTable"
import { Modal } from "@/components/Modal"
import { TextField, SelectField } from "@/components/CustomFormElements"

import { fetchAssets, type Asset } from "@/utils/api"

const mockAssets: Asset[] = [
  { id: 1, name: "MacBook Pro M3", category: "Hardware", status: "Active" },
  { id: 2, name: "Adobe Creative Suite", category: "Software", status: "Active" },
  { id: 3, name: "Dell Monitor 27\"", category: "Hardware", status: "Active" },
  { id: 4, name: "Office 365 License", category: "Software", status: "Active" },
  { id: 5, name: "iPhone 15 Pro", category: "Hardware", status: "Inactive" },
  { id: 6, name: "Slack Premium", category: "Software", status: "Active" },
  { id: 7, name: "Webcam HD Pro", category: "Hardware", status: "Active" },
  { id: 8, name: "AWS Credits", category: "Software", status: "Active" },
  { id: 9, name: "Standing Desk", category: "Hardware", status: "Inactive" },
  { id: 10, name: "Zoom Pro", category: "Software", status: "Active" },
]

export default function DashboardPage() {
  const [assets, setAssets] = React.useState<Asset[]>([])
  const [loading, setLoading] = React.useState(true)

  // Filters
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filterCategory, setFilterCategory] = React.useState("All")

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [editingAsset, setEditingAsset] = React.useState<Asset | null>(null)
  
  // Delete Confirmation State
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false)
  const [assetToDelete, setAssetToDelete] = React.useState<Asset | null>(null)

  // Form State
  const [formData, setFormData] = React.useState({
    name: "",
    category: "Hardware" as "Hardware" | "Software",
    status: "Active" as "Active" | "Inactive",
  })

  React.useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchAssets()
        setAssets(data.length > 0 ? data : mockAssets)
      } catch (error) {
        console.error("Failed to load assets:", error)
        setAssets(mockAssets)
      } finally {
        setLoading(false)
      }
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
    setAssetToDelete(asset)
    setDeleteModalOpen(true)
  }
  
  const confirmDelete = () => {
    if (assetToDelete) {
      setAssets((prev) => prev.filter((a) => a.id !== assetToDelete.id))
      setAssetToDelete(null)
      setDeleteModalOpen(false)
    }
  }
  
  const cancelDelete = () => {
    setAssetToDelete(null)
    setDeleteModalOpen(false)
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
    {
      key: "status",
      label: "Status",
      sortable: true,
      render: (row: Asset) => (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border w-max ${
            row.status === "Active"
              ? "bg-[#D3FF33]/10 text-[#D3FF33] border-[#D3FF33]/20"
              : "bg-red-500/10 text-red-500 border-red-500/20"
          }`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              row.status === "Active" ? "bg-[#D3FF33]" : "bg-red-500"
            }`}
          />
          {row.status}
        </span>
      ),
    },
  ]

  const stats = {
    total: assets.length,
    hardware: assets.filter((a) => a.category === "Hardware" && a.status === "Active").length,
    software: assets.filter((a) => a.category === "Software" && a.status === "Active").length,
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Logo />
      <AppSidebar />
      
      {/* TopNav aligned with cards */}
      <div className="ml-32 pt-4 px-4 lg:px-6">
        <TopNav />
      </div>
      
      <main className="ml-32 min-h-screen">
        <div className="flex flex-1 flex-col gap-6 py-6 px-4 lg:px-6">
            {/* Top Bento Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Left 1/3 - Stacked Cards */}
              <div className="flex flex-col gap-4">
                {/* Card 1: License Utilization */}
                <div className="rounded-3xl p-5 bg-[#2A2B2F]/80 backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <div className="flex flex-col flex-1">
                    <span className="text-3xl sm:text-4xl font-medium tracking-tight text-white">
                      82%
                    </span>
                    <span className="text-xs mt-1 text-gray-400">License Utilization</span>
                    <span className="text-[10px] text-gray-500 mt-1">412 / 500 Seats</span>
                  </div>
                  <div className="w-20 h-12">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[{v:30},{v:45},{v:35},{v:60},{v:55},{v:82},{v:78}]}>
                        <defs>
                          <linearGradient id="utilGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="v" stroke="#9CA3AF" strokeWidth={2} fill="url(#utilGrad)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                {/* Card 2: Hardware Distribution */}
                <div className="rounded-3xl p-5 bg-[#D3FF33]/90 backdrop-blur-md border border-white/20 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-3xl sm:text-4xl font-medium tracking-tight text-black">
                      128
                    </span>
                    <span className="text-xs mt-1 text-black/70">Inventory</span>
                    <span className="text-[10px] text-black/50 mt-1">Items Assigned</span>
                  </div>
                  <div className="w-16 h-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[{v:45},{v:80},{v:60}]}>
                        <Bar dataKey="v" fill="#000000" radius={[4,4,0,0]} barSize={12} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Right 2/3 - Cloud Infrastructure Spend */}
              <div className="lg:col-span-2 rounded-3xl p-6 bg-[#1A66FF]/85 backdrop-blur-md border border-white/15 flex flex-col justify-between">
                <div className="flex items-start justify-between h-full">
                  <div className="flex-1 pr-4">
                    <p className="text-xs text-white/70 mb-1">Cloud Infrastructure Spend</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-medium tracking-tight text-white">
                        $42,800
                      </span>
                      <span className="text-xs text-white/80">12% increase</span>
                    </div>
                    {/* Area Chart */}
                    <div className="w-full h-24 mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[{m:'Jun',v:32},{m:'Jul',v:35},{m:'Aug',v:38},{m:'Sep',v:40},{m:'Oct',v:39},{m:'Nov',v:42.8}]}>
                          <defs>
                            <linearGradient id="cloudGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="v" stroke="#FFFFFF" strokeWidth={2} fill="url(#cloudGradient)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  {/* Lifecycle Status Donut */}
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-[10px] text-white/70 mb-3">Lifecycle Status</p>
                    <div className="relative w-24 h-24">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie 
                            data={[{v:65},{v:35}]} 
                            dataKey="v" 
                            innerRadius={32} 
                            outerRadius={40} 
                            startAngle={90} 
                            endAngle={-270}
                            stroke="none"
                          >
                            <Cell fill="#D3FF33" />
                            <Cell fill="rgba(255,255,255,0.15)" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-semibold text-white">65%</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-white/50 mt-2">Active</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Bento Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Card 4: Asset Valuation */}
              <div className="rounded-3xl p-5 bg-[#2A2B2F]/80 backdrop-blur-md border border-white/10 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Asset Valuation</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-medium tracking-tight text-white">
                      $205,400
                    </span>
                    <span className="text-xs text-[#D3FF33]">USD</span>
                  </div>
                  <p className="text-sm text-white/80 mt-1">+4.2% Growth</p>
                </div>
                {/* Gradient Bar Chart */}
                <div className="w-full h-12 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[{v:40},{v:55},{v:45},{v:70},{v:60},{v:85}]}>
                      <defs>
                        <linearGradient id="valGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#D3FF33" />
                          <stop offset="100%" stopColor="#1A66FF" />
                        </linearGradient>
                      </defs>
                      <Bar dataKey="v" fill="url(#valGrad)" radius={[2,2,0,0]} barSize={6} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Card 5: Renewal Health */}
              <div className="rounded-3xl p-5 bg-white/95 backdrop-blur-md border border-white/30 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Renewal Health</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl sm:text-6xl font-medium tracking-tight text-black">
                      94
                    </span>
                    <span className="text-lg text-gray-400">/100</span>
                  </div>
                </div>
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#D3FF33] rounded-full" style={{ width: '94%' }} />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2">8 assets need attention</p>
                </div>
              </div>

              {/* Card 6: Top Asset Spend */}
              <div className="rounded-3xl p-5 bg-[#2A2B2F]/80 backdrop-blur-md border border-white/10 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#D3FF33] flex items-center justify-center">
                    <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-white font-medium">Top Asset Spend</p>
                    <p className="text-[10px] text-gray-400">Monthly SaaS Costs</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "AWS Infrastructure", cost: "$1,240" },
                    { name: "Salesforce CRM", cost: "$860" },
                    { name: "GitHub Enterprise", cost: "$420" },
                    { name: "Slack Pro", cost: "$310" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-xs text-gray-400 truncate max-w-[120px]">
                        {item.name}
                      </span>
                      <span className="text-xs text-[#D3FF33] font-medium">{item.cost}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Data Area - Search, Filter, Add Button, Table */}
            <div className="mt-4 space-y-4">
              {/* Sleek Controls Container */}
              <div className="bg-[#1c1c1e] p-4 rounded-3xl border border-white/5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    {/* Search with rounded styling */}
                    <div className="flex-1 sm:w-64">
                      <TextField
                        label=""
                        placeholder="Search assets..."
                        value={searchQuery}
                        onChange={setSearchQuery}
                      />
                    </div>
                    {/* Filter with rounded styling */}
                    <div className="w-40 mt-[-8px]">
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
                  {/* Branded Add Button */}
                  <Button
                    onClick={handleOpenAdd}
                    className="bg-[#1A66FF] text-white hover:bg-blue-600 rounded-xl h-10 px-6 font-medium w-full sm:w-auto"
                  >
                    + Add Asset
                  </Button>
                </div>
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

        {/* Modal */}
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
      </main>
    </div>
  )
}
