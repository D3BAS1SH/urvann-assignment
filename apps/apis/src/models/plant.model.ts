import mongoose, { Document } from "mongoose";

interface IPlants extends Document {
    name: string;
    price: number;
    category: mongoose.Schema.Types.ObjectId;
    images: string[];
    availability: number;
    instruction: string[];
    benefits: string[]
}

const plantsSchema = new mongoose.Schema<IPlants>(
    {
        name:{
            type: String,
            minlength: [2, "Name of the plant can't be less than 2 characters"],
            maxlength: [100, "Name of the plant can't exceed 100 characters"],
            trim: true,
            uppercase: true,
            unique: true,
            required: true
        },
        price: {
            type: Number,
            default: 0,
            min: [0, "Price can't be negative"],
            required: true
        },
        images: {
            type: [String],
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        availability: {
            type: Number,
            min: [0, "Can't be in negative"],
            default: 0
        },
        instruction: {
            type: [String],
            default: []
        },
        benefits: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
)

plantsSchema.index({name:'text'});
plantsSchema.index({availability: 1});

export default mongoose.model<IPlants>("Plant", plantsSchema);