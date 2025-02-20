import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the Product schema
interface IProduct extends Document {
  name: string;
  price: number;
  before?: number;
  description: string;
  countInStock: number;
  gender: string;
  brand: string;
  caseColor: string;
  caseSize: string;
  caseMaterial: string;
  features: string;
  modelNumber: string;
  brandClosure: string;
  faceDialShape: string;
  faceDialType: string;
  dialColor: string;
  movmentType: string;
  productClass: string;
  dialType: string;
  Bracelet: string;
  waterResistance: boolean;
  caseShape: string;
  Guarantee: string;
  // attachment: mongoose.Schema.Types.ObjectId[];
  img: string;
  otherImages: [{ type: String }];
}

// Create the Product schema
const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    before: { type: Number, min: 0 },
    description: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["men", "women", "unisex"] },
    brand: { type: String, trim: true },
    caseColor: { type: String },
    caseSize: { type: String, trim: true },
    caseMaterial: { type: String, trim: true },
    modelNumber: { type: String, trim: true },
    faceDialShape: { type: String, trim: true },
    faceDialType: { type: String, trim: true },
    brandClosure: { type: String, trim: true },
    features: { type: String, trim: true },
    dialColor: { type: String },
    dialType: { type: String, trim: true },
    Bracelet: { type: String, trim: true },
    movmentType: { type: String, enum: ["automatic", "quartz"] },
    productClass: { type: String },
    countInStock: { type: Number, required: true, default: 0 },
    img: { type: String, required: true },
    waterResistance: { type: Boolean, default: false },
    caseShape: { type: String, trim: true },
    Guarantee: { type: String, trim: true },
    otherImages: [{ type: String }],
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
