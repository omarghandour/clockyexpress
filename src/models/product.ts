import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the Product schema
interface IProduct extends Document {
  name: string;
  price: number;
  before?: number;
  description: string;
  countInStock: number;
  gender: string;
  caseColor: string;
  dialColor: string;
  movmentType: string;
  class: string;
  attachment: mongoose.Schema.Types.ObjectId[];
  img: string; // File path for the uploaded image
}

// Create the Product schema
const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    before: { type: Number, min: 0 },
    description: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["men", "women", "unisex"], required: true },
    caseColor: { type: String },
    dialColor: { type: String },
    movmentType: {
      type: String,
      enum: ["automatic", "quartz"],
      required: true,
    },
    attachment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File", // Assuming "File" is a model for attachments (like additional product images or files)
      },
    ],
    class: { type: String },
    countInStock: { type: Number, required: true, default: 0, min: 0 },
    img: { type: String, required: true }, // File path for the uploaded image
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
