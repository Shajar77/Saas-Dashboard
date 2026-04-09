export type Asset = {
  id: number
  name: string
  category: "Hardware" | "Software"
  status: "Active" | "Inactive"
}

export async function fetchAssets(): Promise<Asset[]> {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=15")
    if (!response.ok) {
      throw new Error("Failed to fetch assets")
    }
    const data = await response.json()

    return data.map((item: any, index: number) => ({
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
