"use client"

import * as React from "react"
import { fetchAssetDetails, type AssetDetails } from "@/utils/api"

interface AssetDetailsPanelProps {
  assetId: number
  assetPrice?: number
  assetQty?: number
}

// Component to handle asset details fetching and display
export function AssetDetailsPanel({ assetId, assetPrice, assetQty }: AssetDetailsPanelProps) {
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
