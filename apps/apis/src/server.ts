
import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db';
import app from './app';

const PORT = process.env.API_PORT || 4000;

connectDB().then(() => {
	console.log('Database connected, starting server...');
	app.listen(PORT, () => {
		console.log(`Server listening on http://localhost:${PORT}`);
	});
});
