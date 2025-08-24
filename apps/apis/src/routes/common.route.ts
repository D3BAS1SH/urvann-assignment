
import express from 'express';
import { getAllCategories, getSuggestions, filterPlants } from '../controllers/common.controller';

const router: express.Router = express.Router();


// Get all categories (name and _id)
router.get('/categories', getAllCategories);
router.get('/suggest', getSuggestions);
router.get('/filter', filterPlants);

export default router;
