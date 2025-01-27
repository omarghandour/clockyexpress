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
  faceMaterial: string;
  features: string;
  modelNumber: string;
  brandClosure: string;
  faceDialShape: string;
  faceDialType: string;
  dialColor: string;
  movmentType: string;
  productClass: string;
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
    faceMaterial: { type: String, trim: true },
    modelNumber: { type: String, trim: true },
    faceDialShape: { type: String, trim: true },
    faceDialType: { type: String, trim: true },
    brandClosure: { type: String, trim: true },
    features: { type: String, trim: true },
    dialColor: { type: String },
    movmentType: { type: String, enum: ["automatic", "quartz"] },
    // attachment: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "File",
    //   },
    // ],
    productClass: { type: String },
    countInStock: { type: Number, required: true, default: 0, min: 0 },
    img: { type: String, required: true },
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
