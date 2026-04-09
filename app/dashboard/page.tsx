"use client"

import * as React from "react"
import { IconPackage, IconCpu, IconCode } from "@tabler/icons-react"

import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

import { StatCard } from "@/components/StatCard"
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

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "16rem",
        "--header-height": "3rem",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        
        <div className="flex flex-1 flex-col overflow-x-hidden">
          <div className="flex flex-1 flex-col gap-6 py-6 px-4 lg:px-6">
            
            {/* KPI Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                title="Total Assets"
                value={stats.total}
                icon={IconPackage}
                trend="up"
                description="+4% from last month"
              />
              <StatCard
                title="Active Hardware"
                value={stats.hardware}
                icon={IconCpu}
                trend="up"
                description="Deployed globally"
              />
              <StatCard
                title="Active Software"
                value={stats.software}
                icon={IconCode}
                trend="neutral"
                description="Currently licensed"
              />
            </div>

            {/* Interactive Chart */}
            <ChartAreaInteractive />

            {/* Table Header Controls */}
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
                <div className="w-full h-48 flex items-center justify-center border border-white/10 rounded-lg bg-black/20 text-muted-foreground">
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
