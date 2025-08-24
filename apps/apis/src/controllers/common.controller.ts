
import Plant from '../models/plant.model';
import Category from '../models/category.model';
import { asyncHandler } from '../utils/asyncHandler';

/**
 * Get all categories (name and _id only)
 * @route GET /common/categories
 * @returns {object[]} 200 - Array of categories with _id and category name
 */
export const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({}, { _id: 1, category: 1 });
    res.json(categories);
});

export const getSuggestions = asyncHandler(async (req, res) => {
    const q = req.query.q as string;
    if (!q) return res.json([]);
    const plantResults = await Plant.find({ name: { $regex: q, $options: 'i' } }).limit(7).select('name');
    const categoryResults = await Category.find({ category: { $regex: q, $options: 'i' } }).limit(7).select('category');
    const suggestions = [
        ...plantResults.map(p => ({ type: 'plant', value: p.name })),
        ...categoryResults.map(c => ({ type: 'category', value: c.category }))
    ].slice(0, 7);
    res.json(suggestions);
});

export const filterPlants = asyncHandler(async (req, res) => {
    const { category, minPrice, maxPrice, available } = req.query;
    const filter: any = {};
    if (category) filter.category = category;
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
    if (available !== undefined) filter.availability = { $gt: 0 };
    const plants = await Plant.find(filter);
    res.json(plants);
});
