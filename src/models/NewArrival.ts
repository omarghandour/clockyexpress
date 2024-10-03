import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the Product schema
interface INewArrival extends Document {
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
  img: string;
  createdAt: Date;
}

// Create the Product schema
const NewArrivalSchema: Schema<INewArrival> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    before: { type: Number, min: 0 },
    description: { type: String, required: true, trim: true },
    gender: { type: String, enum: ["men", "women", "unisex"] },
    caseColor: { type: String },
    dialColor: { type: String },
    movmentType: { type: String, enum: ["automatic", "quartz"] },
    attachment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
      },
    ],
    class: { type: String, required: true },
    countInStock: { type: Number, required: true, default: 0, min: 0 },
    img: { type: String, required: true },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Export the Product model
const NewArrival: Model<INewArrival> = mongoose.model<INewArrival>(
  "NewArrival",
  NewArrivalSchema
);

export default NewArrival;
