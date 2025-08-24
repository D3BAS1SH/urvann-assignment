const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export interface Plant {
    _id: string
    name: string
    price: number
    images: string[]
    category: {
        _id: string
        category: string
        description?: string
    }
    availability: number
    instruction?: string[]
    benefits?: string[]
    createdAt?: string
    updatedAt?: string
}

// Payload type for creating a plant
export type PlantCreate = Omit<Plant, "_id" | "createdAt" | "updatedAt" | "category"> & { category: string };

export interface Category {
    _id: string
    category: string
    description?: string
}

export interface Suggestion {
    type: string
    value: string
}

export const api = {
    // Get all plants
    getPlants: async (): Promise<Plant[]> => {
        const response = await fetch(`${API_BASE_URL}/api/plants/`)
        if (!response.ok) throw new Error("Failed to fetch plants")
        return response.json()
    },

    // Get plant by ID with detailed info
    getPlantById: async (id: string): Promise<Plant> => {
        const response = await fetch(`${API_BASE_URL}/api/plants/${id}`)
        if (!response.ok) throw new Error("Failed to fetch plant")
        return response.json()
    },

    // Add new plant
    addPlant: async (plantData: PlantCreate): Promise<Plant> => {
        const response = await fetch(`${API_BASE_URL}/api/plants/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(plantData),
        })
        if (!response.ok) throw new Error("Failed to add plant")
        return response.json()
    },

    // Delete plant
    deletePlant: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/api/plants/${id}`, {
        method: "DELETE",
        })
        if (!response.ok) throw new Error("Failed to delete plant")
    },

    // Get suggestions
    getSuggestions: async (query: string): Promise<Suggestion[]> => {
        const response = await fetch(`${API_BASE_URL}/api/common/suggest?q=${encodeURIComponent(query)}`)
        if (!response.ok) throw new Error("Failed to fetch suggestions")
        return response.json()
    },

    // Get all categories
    getCategories: async (): Promise<Category[]> => {
        const response = await fetch(`${API_BASE_URL}/api/common/categories`)
        if (!response.ok) throw new Error("Failed to fetch categories")
        return response.json()
    },

    // Filter plants
    filterPlants: async (filters: {
        category?: string
        minPrice?: number
        maxPrice?: number
        available?: number
    }): Promise<Plant[]> => {
        const params = new URLSearchParams()
        if (filters.category) params.append("category", filters.category)
        if (filters.minPrice !== undefined) params.append("minPrice", filters.minPrice.toString())
        if (filters.maxPrice !== undefined) params.append("maxPrice", filters.maxPrice.toString())
        if (filters.available !== undefined) params.append("available", filters.available.toString())

        const response = await fetch(`${API_BASE_URL}/api/common/filter?${params}`)
        if (!response.ok) throw new Error("Failed to filter plants")
        return response.json()
    },
}
