"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Leaf, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { api } from "@/lib/api"

interface Suggestion {
    type: string
    value: string
}

export function Navbar() {
    const [searchQuery, setSearchQuery] = useState("")
    const [suggestions, setSuggestions] = useState<Suggestion[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [loading, setLoading] = useState(false)

    // Debounce search suggestions
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length > 0) {
                setLoading(true)
                try {
                    const data = await api.getSuggestions(searchQuery)
                    setSuggestions(data)
                    setShowSuggestions(true)
                } catch (error) {
                    console.error("Error fetching suggestions:", error)
                    setSuggestions([])
                } finally {
                    setLoading(false)
                }
            } else {
                setSuggestions([])
                setShowSuggestions(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery])


    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = `/search?query=${encodeURIComponent(searchQuery)}`;
        }
    }

    const handleSuggestionClick = (suggestion: Suggestion) => {
        setSearchQuery(suggestion.value);
        setShowSuggestions(false);
        window.location.href = `/search?query=${encodeURIComponent(suggestion.value)}`;
    }

    return (
        <nav className="bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
                <Leaf className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-foreground">Urvann</span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8 relative">
                <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                    type="text"
                    placeholder="Search plants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="pl-10 pr-4"
                    />
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && (loading || suggestions.length > 0) && (
                    <div className="absolute top-full left-0 right-0 bg-popover border border-border rounded-md shadow-lg mt-1 z-50">
                        {loading ? (
                            <div className="flex items-center justify-center p-4">
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                            </div>
                        ) : suggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="w-full text-left px-4 py-2 hover:bg-accent hover:text-accent-foreground text-sm"
                            >
                                <span className="text-xs text-muted-foreground uppercase">{suggestion.type}</span>
                                <div>{suggestion.value}</div>
                            </button>
                        ))}
                    </div>
                )}
                </form>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
                <Link href="/" className="text-foreground hover:text-primary">
                Home
                </Link>
                <Link href="/admin" className="text-foreground hover:text-primary">
                Admin
                </Link>
            </div>
            </div>
        </div>
        </nav>
    )
}
