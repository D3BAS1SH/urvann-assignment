import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

interface Plant {
    _id: string
    name: string
    price: number
    images: string[]
    category: {
        _id: string
        category: string
    }
    availability: number
}

interface PlantCardProps {
    plant: Plant
}

export function PlantCard({ plant }: PlantCardProps) {
    const getAvailabilityColor = (availability: number) => {
        if (availability > 100) return "bg-accent text-accent-foreground"
        if (availability > 50) return "bg-primary text-primary-foreground"
        if (availability > 20) return "bg-yellow-500 text-white"
        return "bg-destructive text-destructive-foreground"
    }

    const getAvailabilityText = (availability: number) => {
        if (availability > 100) return "High Stock"
        if (availability > 50) return "In Stock"
        if (availability > 20) return "Low Stock"
        return "Limited"
    }

    return (
        <Link href={`/plant/${plant._id}`}>
        <Card className="group hover:shadow-lg transition-shadow duration-200 cursor-pointer relative overflow-hidden">
            {/* Availability Badge */}
            <div className="absolute top-2 left-2 z-10">
            <Badge className={`${getAvailabilityColor(plant.availability)} text-xs`}>
                {getAvailabilityText(plant.availability)} ({plant.availability})
            </Badge>
            </div>

            <CardContent className="p-0">
            {/* Plant Image */}
            <div className="aspect-square relative bg-muted">
                {plant.images && plant.images.length > 0 ? (
                <Image
                    src={plant.images[0] || "/placeholder.svg"}
                    alt={plant.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
                ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🌱</span>
                    </div>
                </div>
                )}
            </div>

            {/* Plant Info */}
            <div className="p-4">
                <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                {plant.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">{plant.category.category}</p>
                {plant.price > 0 && <p className="text-lg font-bold text-primary">₹{plant.price}</p>}
            </div>
            </CardContent>
        </Card>
        </Link>
    )
}
