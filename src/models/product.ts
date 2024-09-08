import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the Product schema
interface IProduct extends Document {
  name: string;
  price: number;
  before?: number;
  description: string;
  countInStock: number;
  img: string;
}

// Create the Product schema
const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    before: { type: Number, min: 0 },
    description: { type: String, required: true, trim: true },
    countInStock: { type: Number, required: true, default: 0, min: 0 },
    img: { type: String, required: true },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Export the Product model
const Product: Model<IProduct> = mongoose.model<IProduct>(
  "Product",
  ProductSchema
);

export default Product;
