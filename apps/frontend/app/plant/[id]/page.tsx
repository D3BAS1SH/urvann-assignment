"use client";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Leaf, Info, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { api } from "@/lib/api"
import { toast } from "sonner"

export interface PageProps {
    params: { id: string }
    searchParams?: { [key: string]: string | string[] | undefined }
}

import { useEffect, useState } from "react";

function PlantDetails({ id }: { id: string }) {
    const [plant, setPlant] = useState<import("@/lib/api").Plant | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.getPlantById(id)
            .then(setPlant)
            .catch((err) => {
                console.error(err);
                setError("Plant not found or failed to load.");
                toast.error("Failed to load plant details");
            });
    }, [id]);

    const getAvailabilityColor = (availability: number) => {
        if (availability > 100) return "bg-accent text-accent-foreground";
        if (availability > 50) return "bg-primary text-primary-foreground";
        if (availability > 20) return "bg-yellow-500 text-white";
        return "bg-destructive text-destructive-foreground";
    };

    const getAvailabilityText = (availability: number) => {
        if (availability > 100) return "High Stock";
        if (availability > 50) return "In Stock";
        if (availability > 20) return "Low Stock";
        return "Limited";
    };

    if (error) {
        return (
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center py-12">
                    <p className="text-muted-foreground">{error}</p>
                    <Link href="/">
                        <Button className="mt-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Plants
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (!plant) {
        return null;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Button */}
            <Link href="/">
                <Button variant="ghost" className="mb-6">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Plants
                </Button>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Plant Image */}
                <div className="space-y-4">
                    <div className="aspect-square relative bg-muted rounded-lg overflow-hidden">
                        {plant.images && plant.images.length > 0 ? (
                            <Image src={plant.images[0] || "/placeholder.svg"} alt={plant.name} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
                                    <span className="text-4xl">🌱</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Plant Info */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-foreground">{plant.name}</h1>
                            <Badge className={`${getAvailabilityColor(plant.availability)} text-sm`}>
                                {getAvailabilityText(plant.availability)}
                            </Badge>
                        </div>
                        <p className="text-lg text-muted-foreground mb-4">{plant.category.category}</p>
                        {plant.category.description && <p className="text-muted-foreground mb-4">{plant.category.description}</p>}
                        {plant.price > 0 && <p className="text-2xl font-bold text-primary mb-4">₹{plant.price}</p>}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Availability:</span>
                            <span className="font-medium">{plant.availability} units</span>
                        </div>
                    </div>

                    {/* Care Instructions */}
                    {plant.instruction && plant.instruction.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Info className="h-5 w-5 text-primary" />
                                    Care Instructions
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {plant.instruction.map((instruction: string, index: number) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <Leaf className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">{instruction}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    {/* Benefits */}
                    {plant.benefits && plant.benefits.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Heart className="h-5 w-5 text-primary" />
                                    Benefits
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {plant.benefits.map((benefit: string, index: number) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <Heart className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}


function LoadingPlantDetails() {
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
            <div className="h-10 bg-muted rounded w-32 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded-lg"></div>
            <div className="space-y-6">
                <div className="h-8 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-6 bg-muted rounded w-1/4"></div>
                <div className="space-y-4">
                <div className="h-32 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
                </div>
            </div>
            </div>
        </div>
        </div>
    )
}

export default function PlantPage({ params }: PageProps) {
    const { id } = params;
    return (
        <div className="min-h-screen bg-background">
            <Suspense fallback={<LoadingPlantDetails />}>
                <PlantDetails id={id} />
            </Suspense>
        </div>
    );
}
