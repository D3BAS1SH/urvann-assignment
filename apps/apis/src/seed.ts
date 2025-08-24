import mongoose from 'mongoose';
import dotenv from 'dotenv';
import plantsData from './config/plants.json';
import categoriesData from './config/category.json';
import Category from './models/category.model';
import Plant from './models/plant.model';
import connectDB from './config/db';

dotenv.config();

const seed = async () => {
    try {
        await connectDB();
        await Category.deleteMany();
        await Plant.deleteMany();

        // Insert categories
        const categories = await Category.insertMany(
            categoriesData.plant_categories.map((cat: any) => ({
                category: cat.category || cat.category_name,
                description: cat.description || '',
            }))
        );

        // Map category name/id to MongoDB _id
        const categoryMap: Record<number, mongoose.Types.ObjectId> = {};
        categories.forEach((cat: any, idx: number) => {
            const jsonCat = categoriesData.plant_categories[idx];
            if (jsonCat && typeof jsonCat.id === 'number') {
                categoryMap[jsonCat.id] = cat._id;
            }
        });

        // Insert plants
        const plants = plantsData.plants.map((plant: any) => ({
            name: plant.name,
            price: plant.price || 0,
            images: plant.images || [],
            category: Array.isArray(plant.category) && plant.category.length > 0
                ? plant.category.map((catId: number) => categoryMap[catId]).filter(Boolean)[0] // use first valid category
                : null,
            availability: plant.availability,
            instruction: plant.instruction,
            benefits: plant.benefits,
            description: plant.description || '',
        }));
        await Plant.insertMany(plants);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding error:', error);
        process.exit(1);
    }
};

seed();
