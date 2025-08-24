import { api, Plant } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Suspense } from "react";

interface SearchPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function fetchPlants(query: string): Promise<Plant[]> {
  if (!query) return [];
  // Use filterPlants API for search
  return api.filterPlants({ category: undefined, available: undefined, minPrice: undefined, maxPrice: undefined, ...(query ? { category: query } : {}) });
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = await searchParams;
  const query = typeof resolvedSearchParams?.query === "string"
    ? resolvedSearchParams.query
    : Array.isArray(resolvedSearchParams?.query)
    ? resolvedSearchParams?.query[0]
    : "";
  const plants = query
    ? await api.getPlants().then((plants) =>
        plants.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Search Results for "{query}"</h1>
      {plants.length === 0 ? (
        <p className="text-muted-foreground">No plants found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {plants.map((plant) => (
            <Link key={plant._id} href={`/plant/${plant._id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>{plant.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square relative bg-muted rounded-lg overflow-hidden mb-2">
                    {plant.images && plant.images.length > 0 ? (
                      <img src={plant.images[0]} alt={plant.name} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl">🌱</span>
                      </div>
                    )}
                  </div>
                  <Badge>{plant.category.category}</Badge>
                  <div className="mt-2 font-bold text-primary">₹{plant.price}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
