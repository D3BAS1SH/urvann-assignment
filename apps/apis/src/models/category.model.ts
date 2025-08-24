import mongoose, { Document } from "mongoose";

interface ICategory extends Document {
    category: string;
    description: string;
}

const allowedRegex = /^[\w\s,\.\-!'’]+$/;

const categorySchema = new mongoose.Schema<ICategory>(
    {
        category: {
            type: String,
            minlength: [3, "Category of the plant must be at least or more than 3 characters"],
            maxlength: [100, "A Categories name can not exceed 100 characters"],
            trim: true,
            unique: true,
            validate: {
                validator: (v: string) => allowedRegex.test(v),
                message: "Category can only contain letters, numbers, whitespace, underscore, comma, period, and exclamation mark."
            }
        },
        description: {
            type: String,
            minlength: [30, "Category description can not be less than 30"],
            maxlength: [500, "Category description can not exceed 500 characters"],
            validate: {
                validator: (v: string) => allowedRegex.test(v),
                message: "Description can only contain letters, numbers, whitespace, underscore, comma, period, and exclamation mark."
            }
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model<ICategory>("Category", categorySchema);

categorySchema.index({category:'text'});