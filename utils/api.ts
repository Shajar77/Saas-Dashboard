export type Asset = {
  id: number
  name: string
  category: "Hardware" | "Software"
  status: "Active" | "Inactive"
  price?: number
  quantity?: number
  details?: AssetDetails
}

export type AssetDetails = {
  id: number
  assetId: number
  price: number
  quantity: number
  description: string
  vendor: string
  purchaseDate: string
  warrantyMonths: number
}

interface JsonPlaceholderPost {
  id: number
  userId: number
  title: string
  body: string
}

export async function fetchAssets(): Promise<Asset[]> {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=15")
    if (!response.ok) {
      throw new Error("Failed to fetch assets")
    }
    const data: JsonPlaceholderPost[] = await response.json()

    return data.map((item, index) => ({
      id: item.id,
      name: item.title.slice(0, 30), // Shorten the title for cleaner UI
      category: index % 2 === 0 ? "Hardware" : "Software",
      status: "Active",
    }))
  } catch (error) {
    console.error("Error fetching assets:", error)
    return []
  }
}

// Fetch detailed asset info from JSON placeholder (using posts endpoint with asset ID)
export async function fetchAssetDetails(assetId: number): Promise<AssetDetails> {
  try {
    // Using JSON placeholder posts endpoint - in real app this would be your asset details API
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${assetId}`)
    if (!response.ok) {
      throw new Error("Failed to fetch asset details")
    }
    const data = await response.json()

    // Generate consistent mock data based on asset ID
    const seed = assetId * 100
    const categories = ["Dell Technologies", "HP Inc.", "Apple Inc.", "Microsoft", "Adobe", "Cisco", "Lenovo", "Logitech"]

    return {
      id: data.id,
      assetId: assetId,
      price: Math.floor((seed % 5000) + 500), // Random price between $500-$5500
      quantity: Math.floor((seed % 50) + 1), // Random quantity 1-50
      description: data.body.slice(0, 150), // Use post body as description
      vendor: categories[assetId % categories.length],
      purchaseDate: new Date(Date.now() - (seed % 31536000000)).toISOString().split('T')[0], // Random date within last year
      warrantyMonths: Math.floor((seed % 36) + 12), // Warranty 12-48 months
    }
  } catch (error) {
    console.error("Error fetching asset details:", error)
    throw error
  }
}
