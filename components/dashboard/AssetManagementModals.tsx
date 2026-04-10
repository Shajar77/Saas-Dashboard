"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/Modal"
import { TextField, SelectField } from "@/components/CustomFormElements"
import { useAssetStore } from "@/stores/assetStore"
import { useUIStore } from "@/stores/uiStore"

export function AssetManagementModals() {
  const { addAsset, updateAsset, deleteAsset } = useAssetStore()
  const {
    isModalOpen,
    editingAsset,
    closeModal,
    deleteModalOpen,
    assetToDelete,
    closeDeleteModal,
    formData,
    setFormData,
  } = useUIStore()

  const handleSave = () => {
    if (!formData.name) return // simple validation

    if (editingAsset) {
      updateAsset(editingAsset.id, formData)
    } else {
      addAsset(formData)
    }
    closeModal()
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

  return (
    <>
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
    </>
  )
}
