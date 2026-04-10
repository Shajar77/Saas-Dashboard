import { create } from "zustand"
import { type Asset } from "@/utils/api"

interface FormData {
  name: string
  category: "Hardware" | "Software"
  status: "Active" | "Inactive"
  price: number
  quantity: number
}

interface UIState {
  // Modal State
  isModalOpen: boolean
  editingAsset: Asset | null
  openAddModal: () => void
  openEditModal: (asset: Asset) => void
  closeModal: () => void

  // Delete Modal State
  deleteModalOpen: boolean
  assetToDelete: Asset | null
  openDeleteModal: (asset: Asset) => void
  closeDeleteModal: () => void

  // Form State
  formData: FormData
  setFormData: (data: Partial<FormData> | ((prev: FormData) => Partial<FormData>)) => void
  resetFormData: () => void
}

const defaultFormData: FormData = {
  name: "",
  category: "Hardware",
  status: "Active",
  price: 500,
  quantity: 1,
}

export const useUIStore = create<UIState>()((set) => ({
  // Modal State
  isModalOpen: false,
  editingAsset: null,
  openAddModal: () => set({
    isModalOpen: true,
    editingAsset: null,
    formData: defaultFormData,
  }),
  openEditModal: (asset) => set({
    isModalOpen: true,
    editingAsset: asset,
    formData: {
      name: asset.name,
      category: asset.category,
      status: asset.status,
      price: asset.price || (asset.category === "Hardware" ? 2000 : 500),
      quantity: asset.quantity || 1,
    },
  }),
  closeModal: () => set({ isModalOpen: false, editingAsset: null }),

  // Delete Modal State
  deleteModalOpen: false,
  assetToDelete: null,
  openDeleteModal: (asset) => set({ deleteModalOpen: true, assetToDelete: asset }),
  closeDeleteModal: () => set({ deleteModalOpen: false, assetToDelete: null }),

  // Form State
  formData: defaultFormData,
  setFormData: (data) => set((state) => {
    const updates = typeof data === "function" ? data(state.formData) : data
    return { formData: { ...state.formData, ...updates } }
  }),
  resetFormData: () => set({ formData: defaultFormData }),
}))
