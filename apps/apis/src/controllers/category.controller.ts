import Category from '../models/category.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';

export const createCategory = asyncHandler(async (req, res) => {
    console.log('createCategory called with body:', req.body);
    const category = await Category.create(req.body);
    res.status(201).json(category);
    console.log('Category created:', category._id);
});

export const deleteCategory = asyncHandler(async (req, res) => {
    console.log('deleteCategory called for id:', req.params.id);
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) throw new ApiError(404, 'Category not found');
    res.json({ message: 'Category deleted' });
    console.log('Category deleted:', req.params.id);
});
