import Category from '../models/category.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';

export const createCategory = asyncHandler(async (req, res) => {
    const category = await Category.create(req.body);
    res.status(201).json(category);
});

export const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) throw new ApiError(404, 'Category not found');
    res.json({ message: 'Category deleted' });
});
