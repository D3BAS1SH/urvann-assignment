
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
const app: Express = express();

// Middleware
console.log('Initializing middleware...');
app.use(cors());
app.use(helmet());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
	res.json({ message: 'API is running!' });
});

import plantRoutes from './routes/plant.route';
import categoryRoutes from './routes/category.route';
import commonRoutes from './routes/common.route';

console.log('Registering routes...');
app.use('/api/plants', plantRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/common', commonRoutes);

export default app;