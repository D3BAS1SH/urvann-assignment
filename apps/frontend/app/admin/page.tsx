"use client"

import type React from "react"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Leaf } from "lucide-react"
import { api, type Plant, type Category, type PlantCreate } from "@/lib/api"
import { toast } from "sonner"

export default function AdminPage() {
  const [plants, setPlants] = useState<Plant[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    images: "",
    category: "",
    availability: "",
    instruction: "",
    benefits: "",
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [plantsData, categoriesData] = await Promise.all([api.getPlants(), api.getCategories()])
      setPlants(plantsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error(error);
  toast.error("Failed to load data")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const plantData: PlantCreate = {
        name: formData.name,
        price: Number.parseFloat(formData.price) || 0,
        images: formData.images ? formData.images.split(",").map((img) => img.trim()) : [],
        category: formData.category, // category is _id string
        availability: Number.parseInt(formData.availability) || 0,
        instruction: formData.instruction ? formData.instruction.split("\n").filter((i) => i.trim()) : [],
        benefits: formData.benefits ? formData.benefits.split("\n").filter((b) => b.trim()) : [],
      }

      await api.addPlant(plantData)

  toast.success("Plant added successfully")

      // Reset form
      setFormData({
        name: "",
        price: "",
        images: "",
        category: "",
        availability: "",
        instruction: "",
        benefits: "",
      })

      // Reload plants
      loadData()
    } catch (error) {
      console.error(error);
  toast.error("Failed to add plant")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plant?")) return

    try {
      await api.deletePlant(id)
  toast.success("Plant deleted successfully")
      loadData()
    } catch (error) {
      console.error(error);
  toast.error("Failed to delete plant")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-muted rounded"></div>
              <div className="h-96 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">Manage plants and categories</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Plant Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Plant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Plant Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="images">Images (comma-separated URLs)</Label>
                  <Input
                    id="images"
                    value={formData.images}
                    onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="availability">Availability</Label>
                  <Input
                    id="availability"
                    type="number"
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="instruction">Care Instructions (one per line)</Label>
                  <Textarea
                    id="instruction"
                    value={formData.instruction}
                    onChange={(e) => setFormData({ ...formData, instruction: e.target.value })}
                    placeholder="Water regularly&#10;Place in indirect sunlight&#10;Fertilize monthly"
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="benefits">Benefits (one per line)</Label>
                  <Textarea
                    id="benefits"
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    placeholder="Purifies air&#10;Low maintenance&#10;Beautiful foliage"
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Plant
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Plants List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                Manage Plants ({plants.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {plants.map((plant) => (
                  <div
                    key={plant._id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium">{plant.name}</h3>
                      <p className="text-sm text-muted-foreground">{typeof plant.category === 'object' ? plant.category.category : plant.category}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          Stock: {plant.availability}
                        </Badge>
                        {plant.price > 0 && (
                          <Badge variant="outline" className="text-xs">
                            ₹{plant.price}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(plant._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
