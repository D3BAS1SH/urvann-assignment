"use client"

import { useState, useCallback, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { SearchFilters as SearchFiltersComponent } from '@/components/search/SearchFilters'
import { api } from '@/lib/api'
import type { SearchResponse, SearchFilters } from '@/lib/types'

const ITEMS_PER_PAGE = 8

export default function SearchResults() {
    const searchParams = useSearchParams()
    const query = searchParams.get('query') || ''
    
    const [loading, setLoading] = useState(false)
    const [searchResults, setSearchResults] = useState<SearchResponse | null>(null)
    const [filters, setFilters] = useState<SearchFilters>({
        category: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        available: false,
        page: 1,
        limit: ITEMS_PER_PAGE
    })

    // Load search results
    const loadSearchResults = useCallback(async () => {
        if (!query) return
        
        setLoading(true)
        try {
            const results = await api.searchPlants(query, filters)
            setSearchResults(results)
        } catch (error) {
            console.error('Error searching plants:', error)
        } finally {
            setLoading(false)
        }
    }, [query, filters])

    useEffect(() => {
        loadSearchResults()
    }, [loadSearchResults])

    // Handle filter changes
    const handleFilterChange = (newFilters: SearchFilters) => {
        setFilters({ ...newFilters, page: 1 }) // Reset to first page on filter change
    }

    // Load more results
    const handleLoadMore = () => {
        if (!searchResults) return
        
        const nextPage = (filters.page || 1) + 1
        if (nextPage <= searchResults.pagination.totalPages) {
            setFilters({ ...filters, page: nextPage })
        }
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <div className="w-full md:w-64">
                    <SearchFiltersComponent 
                        filters={filters}
                        onFilterChange={handleFilterChange}
                    />
                </div>

                {/* Search Results */}
                <div className="flex-1">
                    <h1 className="text-2xl font-bold mb-6">
                        Search Results for "{query}"
                    </h1>

                    {loading && !searchResults ? (
                        <div className="flex items-center justify-center min-h-[200px]">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : !searchResults || searchResults.plants.length === 0 ? (
                        <p className="text-muted-foreground">No plants found.</p>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {searchResults.plants.map((plant) => (
                                    <Link key={plant._id} href={`/plant/${plant._id}`}>
                                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                                            <CardHeader>
                                                <CardTitle>{plant.name}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="aspect-square relative bg-muted rounded-lg overflow-hidden mb-2">
                                                    {plant.images && plant.images.length > 0 ? (
                                                        <img 
                                                            src={plant.images[0]} 
                                                            alt={plant.name}
                                                            className="object-cover w-full h-full" 
                                                        />
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

                            {/* Load More Button */}
                            {searchResults.pagination.currentPage < searchResults.pagination.totalPages && (
                                <div className="flex justify-center mt-8">
                                    <Button
                                        variant="outline"
                                        onClick={handleLoadMore}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Loading...
                                            </>
                                        ) : (
                                            'Load More'
                                        )}
                                    </Button>
                                </div>
                            )}

                            {/* Results Summary */}
                            <p className="text-sm text-muted-foreground text-center mt-4">
                                Showing {searchResults.plants.length} of {searchResults.pagination.totalItems} results
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
