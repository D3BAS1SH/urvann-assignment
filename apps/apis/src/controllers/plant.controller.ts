import Plant from '../models/plant.model';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/apiError';

/**
 * Create a new plant in the database.
 * Validates request body fields before creation.
 * @route POST /plants
 * @param {string} name - Name of the plant (2-100 chars, required)
 * @param {number} price - Price of the plant (non-negative)
 * @param {string[]} images - Array of image URLs
 * @param {string} category - Category ID (required)
 * @param {number} availability - Number of plants available (non-negative)
 * @param {string[]} instruction - Care instructions
 * @param {string[]} benefits - Benefits of the plant
 * @returns {object} 201 - Created plant object
 */
export const createPlant = asyncHandler(async (req, res) => {
    console.log('createPlant called with body:', req.body);
    const { name, price, images, category, availability, instruction, benefits } = req.body;
    if (!name || typeof name !== 'string' || name.length < 2 || name.length > 100) {
        throw new ApiError(400, 'Name is required and must be 2-100 characters.');
    }
    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
        throw new ApiError(400, 'Price must be a non-negative number.');
    }
    if (!category) {
        throw new ApiError(400, 'Category is required.');
    }
    if (availability !== undefined && (typeof availability !== 'number' || availability < 0)) {
        throw new ApiError(400, 'Availability must be a non-negative number.');
    }
    if (images && !Array.isArray(images)) {
        throw new ApiError(400, 'Images must be an array.');
    }
    if (instruction && !Array.isArray(instruction)) {
        throw new ApiError(400, 'Instruction must be an array.');
    }
    if (benefits && !Array.isArray(benefits)) {
        throw new ApiError(400, 'Benefits must be an array.');
    }
    const plant = await Plant.create({ name, price, images, category, availability, instruction, benefits });
    console.log('Plant created:', plant._id);
    res.status(201).json(plant);
});

/**
 * Update an existing plant by ID.
 * Validates and updates only provided fields.
 * @route PUT /plants/:id
 * @param {string} id - Plant ID (URL param)
 * @param {string} [name] - Name of the plant (2-100 chars)
 * @param {number} [price] - Price of the plant (non-negative)
 * @param {string[]} [images] - Array of image URLs
 * @param {string} [category] - Category ID
 * @param {number} [availability] - Number of plants available (non-negative)
 * @param {string[]} [instruction] - Care instructions
 * @param {string[]} [benefits] - Benefits of the plant
 * @returns {object} 200 - Updated plant object
 * @throws 404 if plant not found
 */
export const updatePlant = asyncHandler(async (req, res) => {
    console.log('updatePlant called for id:', req.params.id, 'with body:', req.body);
    const update: any = {};
    if ('name' in req.body) {
        if (typeof req.body.name !== 'string' || req.body.name.length < 2 || req.body.name.length > 100) {
        throw new ApiError(400, 'Name must be 2-100 characters.');
        }
        update.name = req.body.name;
    }
    if ('price' in req.body) {
        if (typeof req.body.price !== 'number' || req.body.price < 0) {
        throw new ApiError(400, 'Price must be a non-negative number.');
        }
        update.price = req.body.price;
    }
    if ('category' in req.body) {
        if (!req.body.category) {
        throw new ApiError(400, 'Category is required.');
        }
        update.category = req.body.category;
    }
    if ('availability' in req.body) {
        if (typeof req.body.availability !== 'number' || req.body.availability < 0) {
        throw new ApiError(400, 'Availability must be a non-negative number.');
        }
        update.availability = req.body.availability;
    }
    if ('images' in req.body) {
        if (!Array.isArray(req.body.images)) {
        throw new ApiError(400, 'Images must be an array.');
        }
        update.images = req.body.images;
    }
    if ('instruction' in req.body) {
        if (!Array.isArray(req.body.instruction)) {
        throw new ApiError(400, 'Instruction must be an array.');
        }
        update.instruction = req.body.instruction;
    }
    if ('benefits' in req.body) {
        if (!Array.isArray(req.body.benefits)) {
        throw new ApiError(400, 'Benefits must be an array.');
        }
        update.benefits = req.body.benefits;
    }
    const plant = await Plant.findByIdAndUpdate(
        req.params.id,
        update,
        { new: true, runValidators: true }
    );
    if (plant) {
        console.log('Plant updated:', plant._id);
    }
    if (!plant) throw new ApiError(404, 'Plant not found');
    res.json(plant);
});

/**
 * Delete a plant by ID.
 * @route DELETE /plants/:id
 * @param {string} id - Plant ID (URL param)
 * @returns {object} 200 - Success message
 * @throws 404 if plant not found
 */
export const deletePlant = asyncHandler(async (req, res) => {
    console.log('deletePlant called for id:', req.params.id);
    const plant = await Plant.findByIdAndDelete(req.params.id);
    if (!plant) throw new ApiError(404, 'Plant not found');
    res.json({ message: 'Plant deleted' });
    console.log('Plant deleted:', req.params.id);
});

/**
 * Get a paginated list of plants.
 * @route GET /plants
 * @query {number} [page=1] - Page number
 * @returns {object[]} 200 - Array of plant objects (basic fields)
 */
export const getPlants = asyncHandler(async (req, res) => {
    console.log('getPlants called with query:', req.query);
    const page = parseInt(req.query.page as string) || 1;
    const limit = 16;
    const skip = (page - 1) * limit;
    const plants = await Plant.find()
        .select('_id name price images category availability')
        .populate('category', 'category')
        .skip(skip)
        .limit(limit);
    res.json(plants);
    console.log('getPlants returned', plants.length, 'plants');
});

/**
 * Get a plant by its ID.
 * @route GET /plants/:id
 * @param {string} id - Plant ID (URL param)
 * @returns {object} 200 - Plant object (with populated category)
 * @throws 404 if plant not found
 */
export const getPlantById = asyncHandler(async (req, res) => {
    console.log('getPlantById called for id:', req.params.id);
    const plant = await Plant.findById(req.params.id).populate('category');
    if (!plant) throw new ApiError(404, 'Plant not found');
    res.json(plant);
    console.log('getPlantById returned plant:', plant?._id);
});
