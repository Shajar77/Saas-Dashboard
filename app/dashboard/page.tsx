"use client"

import * as React from "react"
import { Suspense } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { CustomTable, type TableColumn } from "@/components/CustomTable"
import { Modal } from "@/components/Modal"
import { TextField, SelectField } from "@/components/CustomFormElements"

import { type Asset } from "@/utils/api"
import { useAssetStore } from "@/stores/assetStore"
import { useUIStore } from "@/stores/uiStore"
import { useDashboardStats } from "@/hooks/useDashboardStats"
import { AssetDetailsPanel } from "@/components/dashboard/AssetDetailsPanel"
import {
  LicenseUtilizationCard,
  InventoryCard,
  CloudSpendCard,
  AssetValuationCard,
  RenewalHealthCard,
  TopAssetSpendCard,
} from "@/components/dashboard/StatCards"

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
  const stats = useDashboardStats(assets)

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

  const columns: TableColumn<Asset>[] = [
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
                <LicenseUtilizationCard stats={stats} />
                <InventoryCard stats={stats} />
              </div>

              {/* Right 8 cols - Cloud Infrastructure Spend */}
              <CloudSpendCard stats={stats} />
            </div>

            {/* Bottom Bento Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <AssetValuationCard stats={stats} />
              <RenewalHealthCard stats={stats} />
              <TopAssetSpendCard />
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
              onChange={(val: string) => setFormData((prev) => ({ ...prev, category: val as "Hardware" | "Software" }))}
              options={[
                { label: "Hardware", value: "Hardware" },
                { label: "Software", value: "Software" },
              ]}
              required
            />
            <SelectField
              label="Status"
              value={formData.status}
              onChange={(val: string) => setFormData((prev) => ({ ...prev, status: val as "Active" | "Inactive" }))}
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
            <p className="text-gray-500 dark:text-gray-400">
              Are you sure you want to delete <span className="text-gray-900 dark:text-white font-semibold">{assetToDelete?.name}</span>?
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
