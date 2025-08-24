
import express from 'express';
import { getAllCategories, getSuggestions, filterPlants, searchPlants } from '../controllers/common.controller';

const router: express.Router = express.Router();
console.log('Common routes initialized');


// Get all categories (name and _id)
router.get('/categories', getAllCategories);
router.get('/suggest', getSuggestions);
router.get('/filter', filterPlants);
router.get('/search', searchPlants);

export default router;
