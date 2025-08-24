
import Plant from '../models/plant.model';
import Category from '../models/category.model';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * Search plants by query matching name or category with pagination
 * @route GET /api/common/search
 * @param {string} q - Search query to match against plant names and categories
 * @param {number} [page=1] - Page number for pagination
 * @param {number} [limit=8] - Number of items per page
 * @returns {Object} Object containing plants array and pagination metadata
 * @returns {Array} .plants - Array of plants matching the search criteria
 * @returns {Object} .pagination - Pagination metadata
 * @returns {number} .pagination.currentPage - Current page number
 * @returns {number} .pagination.totalPages - Total number of pages
 * @returns {number} .pagination.totalItems - Total number of matching items
 * @returns {number} .pagination.itemsPerPage - Number of items per page
 */
export const searchPlants = asyncHandler(async (req, res) => {
    console.log('searchPlants called with query:', req.query);
    const { q, page = '1', limit = '8' } = req.query;
    if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: 'Search query is required' });
    }

    const pageNumber = Math.max(parseInt(page as string) || 1, 1);
    const limitNumber = Math.max(parseInt(limit as string) || 8, 1);
    const skip = (pageNumber - 1) * limitNumber;

    const [plants, totalCount] = await Promise.all([
        Plant.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: '$category'
            },
            {
                $match: {
                    $or: [
                        { name: { $regex: q, $options: 'i' } },
                        { 'category.category': { $regex: q, $options: 'i' } }
                    ]
                }
            },
            {
                $skip: skip
            },
            {
                $limit: limitNumber
            }
        ]),
        Plant.aggregate([
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: '$category'
            },
            {
                $match: {
                    $or: [
                        { name: { $regex: q, $options: 'i' } },
                        { 'category.category': { $regex: q, $options: 'i' } }
                    ]
                }
            },
            {
                $count: 'total'
            }
        ]).then(result => (result[0]?.total || 0))
    ]);

    const totalPages = Math.ceil(totalCount / limitNumber);

    res.json({
        plants,
        pagination: {
            currentPage: pageNumber,
            totalPages,
            totalItems: totalCount,
            itemsPerPage: limitNumber
        }
    });
    console.log('searchPlants returned', plants.length, 'plants, page', pageNumber, 'of', totalPages);
});

/**
 * Get all categories (name and _id only)
 * @route GET /common/categories
 * @returns {object[]} 200 - Array of categories with _id and category name
 */
export const getAllCategories = asyncHandler(async (req, res) => {
    console.log('getAllCategories called');
    const categories = await Category.find({}, { _id: 1, category: 1 });
    res.json(categories);
    console.log('getAllCategories returned', categories.length, 'categories');
});

export const getSuggestions = asyncHandler(async (req, res) => {
    console.log('getSuggestions called with query:', req.query.q);
    const q = req.query.q as string;
    if (!q) return res.json([]);
    const plantResults = await Plant.find({ name: { $regex: q, $options: 'i' } }).limit(7).select('name');
    const categoryResults = await Category.find({ category: { $regex: q, $options: 'i' } }).limit(7).select('category');
    const suggestions = [
        ...plantResults.map(p => ({ type: 'plant', value: p.name })),
        ...categoryResults.map(c => ({ type: 'category', value: c.category }))
    ].slice(0, 7);
    res.json(suggestions);
    console.log('getSuggestions returned', suggestions.length, 'suggestions');
});

export const filterPlants = asyncHandler(async (req, res) => {
    console.log('filterPlants called with query:', req.query);
    const { category, minPrice, maxPrice, available } = req.query;
    const filter: any = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
    if (available !== undefined) filter.availability = { $gt: 0 };
    const plants = await Plant.find(filter);
    res.json(plants);
    console.log('filterPlants returned', plants.length, 'plants');
});
