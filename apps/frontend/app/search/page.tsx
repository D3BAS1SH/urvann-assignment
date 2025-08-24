import { Suspense } from 'react'
import SearchResults from '@/components/search/SearchResults'

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-pulse text-center">
                    <p className="text-muted-foreground">Loading search results...</p>
                </div>
            </div>
        }>
            <SearchResults />
        </Suspense>
    )
}
