import { create } from "zustand"
import { persist } from "zustand/middleware"
import { fetchAssets, type Asset } from "@/utils/api"

const mockAssets: Asset[] = [
  { id: 1, name: "MacBook Pro M3", category: "Hardware", status: "Active", price: 2499, quantity: 5 },
  { id: 2, name: "Adobe Creative Suite", category: "Software", status: "Active", price: 599, quantity: 10 },
  { id: 3, name: "Dell Monitor 27\"", category: "Hardware", status: "Active", price: 450, quantity: 8 },
  { id: 4, name: "Office 365 License", category: "Software", status: "Active", price: 99, quantity: 25 },
  { id: 5, name: "iPhone 15 Pro", category: "Hardware", status: "Inactive", price: 1199, quantity: 3 },
  { id: 6, name: "Slack Premium", category: "Software", status: "Active", price: 150, quantity: 20 },
  { id: 7, name: "Webcam HD Pro", category: "Hardware", status: "Active", price: 129, quantity: 12 },
  { id: 8, name: "AWS Credits", category: "Software", status: "Active", price: 500, quantity: 1 },
  { id: 9, name: "Standing Desk", category: "Hardware", status: "Inactive", price: 350, quantity: 4 },
  { id: 10, name: "Zoom Pro", category: "Software", status: "Active", price: 180, quantity: 15 },
]

interface AssetState {
  assets: Asset[]
  loading: boolean
  fetchAssetsFromApi: () => Promise<void>
  addAsset: (asset: Omit<Asset, "id">) => void
  updateAsset: (id: number, updates: Partial<Asset>) => void
  deleteAsset: (id: number) => void
}

export const useAssetStore = create<AssetState>()(
  persist(
    (set, get) => ({
      assets: [],
      loading: true,

      fetchAssetsFromApi: async () => {
        try {
          const data = await fetchAssets()
          const assetsWithDefaults = data.map((asset, index) => ({
            ...asset,
            price: mockAssets[index % mockAssets.length]?.price || 500,
            quantity: mockAssets[index % mockAssets.length]?.quantity || 1,
          }))
          set({ assets: assetsWithDefaults.length > 0 ? assetsWithDefaults : mockAssets, loading: false })
        } catch (error) {
          console.error("Failed to fetch assets:", error)
          set({ assets: mockAssets, loading: false })
        }
      },

      addAsset: (asset) => {
        const { assets } = get()
        const newAsset: Asset = {
          id: Math.max(0, ...assets.map((a) => a.id)) + 1,
          ...asset,
        }
        set({ assets: [newAsset, ...assets] })
      },

      updateAsset: (id, updates) => {
        const { assets } = get()
        set({
          assets: assets.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        })
      },

      deleteAsset: (id) => {
        const { assets } = get()
        set({ assets: assets.filter((a) => a.id !== id) })
      },
    }),
    {
      name: "dashboard_assets",
    }
  )
)
