
import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
const app: Express = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
	res.json({ message: 'API is running!' });
});

export default app;