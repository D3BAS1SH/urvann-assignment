export interface Suggestion {
    type: 'plant' | 'category';
    value: string;
}

export interface SearchResponse {
    plants: Plant[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    }
}

export interface Category {
    _id: string;
    category: string;
    description?: string;
}

export interface SearchFilters {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    available?: boolean;
    page?: number;
    limit?: number;
}

export interface Plant {
    _id: string;
    name: string;
    price: number;
    images: string[];
    category: {
        _id: string;
        category: string;
        description?: string;
    };
    availability: number;
    instruction?: string[];
    benefits?: string[];
    createdAt?: string;
    updatedAt?: string;
}
