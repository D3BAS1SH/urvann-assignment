import express from 'express';
import {
  createPlant,
  updatePlant,
  deletePlant,
  getPlants,
  getPlantById
} from '../controllers/plant.controller';

const router: express.Router = express.Router();
console.log('Plant routes initialized');

router.post('/', createPlant);
router.put('/:id', updatePlant);
router.delete('/:id', deletePlant);
router.get('/', getPlants);
router.get('/:id', getPlantById);

export default router;
