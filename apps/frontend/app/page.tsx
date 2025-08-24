"use client"

import { useState, useEffect } from "react"
import { PlantCard } from "@/components/plant-card"
import { api } from "@/lib/api"
import { Loader2 } from "lucide-react"

import type { Plant } from "@/lib/api"

export default function HomePage() {
  const [plants, setPlants] = useState<Plant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true)
        const data = await api.getPlants()
        setPlants(data)
      } catch (err) {
        setError("Failed to fetch plants. Please try again later.")
        console.error("Error fetching plants:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPlants()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Loading plants...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Discover Beautiful Plants</h1>
        <p className="text-muted-foreground text-lg">Find the perfect plants for your home and garden</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {plants.map((plant) => (
          <PlantCard key={plant._id} plant={plant} />
        ))}
      </div>

      {plants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No plants found.</p>
        </div>
      )}
    </div>
  )
}
