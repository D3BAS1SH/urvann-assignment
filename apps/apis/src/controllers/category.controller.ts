
import Category from '../models/category.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';

const allowedRegex = /^[\w\s,\.\-!'’]+$/;


/**
 * Create a new category.
 * Validates required fields, regex, and uniqueness.
 * @route POST /categories
 * @param {string} category - Category name (required, 3-100 chars, unique, regex)
 * @param {string} description - Description (required, 30-500 chars, regex)
 * @returns {object} 201 - Created category object
 * @throws 400 if validation fails, 409 if duplicate
 */
export const createCategory = asyncHandler(async (req, res) => {
    console.log('createCategory called with body:', req.body);
    const { category, description } = req.body;
    // Validate presence
    if (!category || typeof category !== 'string') {
        throw new ApiError(400, 'Category name is required and must be a string.');
    }
    if (!description || typeof description !== 'string') {
        throw new ApiError(400, 'Description is required and must be a string.');
    }
    // Validate length
    if (category.length < 3 || category.length > 100) {
        throw new ApiError(400, 'Category name must be 3-100 characters.');
    }
    if (description.length < 30 || description.length > 500) {
        throw new ApiError(400, 'Description must be 30-500 characters.');
    }
    // Validate regex
    if (!allowedRegex.test(category)) {
        throw new ApiError(400, 'Category name contains invalid characters.');
    }
    if (!allowedRegex.test(description)) {
        throw new ApiError(400, 'Description contains invalid characters.');
    }
    // Check for duplicate
    const existing = await Category.findOne({ category: { $regex: `^${category}$`, $options: 'i' } });
    if (existing) {
        throw new ApiError(409, 'Category already exists.');
    }
    const newCategory = await Category.create({ category, description });
    res.status(201).json(newCategory);
    console.log('Category created:', newCategory._id);
});


/**
 * Delete a category by ID.
 * @route DELETE /categories/:id
 * @param {string} id - Category ID (URL param)
 * @returns {object} 200 - Success message
 * @throws 404 if category not found
 */
export const deleteCategory = asyncHandler(async (req, res) => {
    console.log('deleteCategory called for id:', req.params.id);
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) throw new ApiError(404, 'Category not found');
    res.json({ message: 'Category deleted' });
    console.log('Category deleted:', req.params.id);
});
