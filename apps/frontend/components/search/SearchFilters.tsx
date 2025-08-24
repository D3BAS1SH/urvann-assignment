"use client"

import { useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import type { SearchFilters } from '@/lib/types'
import { debounce } from 'lodash'

interface SearchFiltersProps {
    filters: SearchFilters
    onFilterChange: (filters: SearchFilters) => void
}

export function SearchFilters({ filters, onFilterChange }: SearchFiltersProps) {
    // Debounce price changes to avoid too many API calls
    const debouncedPriceChange = useCallback(
        debounce((newFilters: SearchFilters) => {
            onFilterChange(newFilters)
        }, 500),
        [onFilterChange]
    )

    const handlePriceChange = (key: 'minPrice' | 'maxPrice', value: string) => {
        const numberValue = value ? Number(value) : undefined
        const newFilters = { ...filters, [key]: numberValue }
        debouncedPriceChange(newFilters)
    }

    const handleAvailableChange = (checked: boolean) => {
        onFilterChange({ ...filters, available: checked })
    }

    const handleReset = () => {
        onFilterChange({
            category: undefined,
            minPrice: undefined,
            maxPrice: undefined,
            available: undefined,
            page: 1
        })
    }

    return (
        <Card className="sticky top-20">
            <CardHeader>
                <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="minPrice">Minimum Price</Label>
                        <Input
                            type="number"
                            id="minPrice"
                            placeholder="Min price"
                            value={filters.minPrice || ''}
                            onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="maxPrice">Maximum Price</Label>
                        <Input
                            type="number"
                            id="maxPrice"
                            placeholder="Max price"
                            value={filters.maxPrice || ''}
                            onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            id="available"
                            checked={filters.available || false}
                            onCheckedChange={handleAvailableChange}
                        />
                        <Label htmlFor="available">In Stock Only</Label>
                    </div>
                </div>
                <Button variant="outline" className="w-full" onClick={handleReset}>
                    Reset Filters
                </Button>
            </CardContent>
        </Card>
    )
}
