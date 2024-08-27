import mongoose, { Schema, Document } from "mongoose";

interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  countInStock: number;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  countInStock: { type: Number, required: true, default: 0 },
});

export default mongoose.model<IProduct>("Product", ProductSchema);
