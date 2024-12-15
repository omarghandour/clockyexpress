import mongoose, { Schema, Document, Model } from "mongoose";

interface ratings extends Document {
  rating: number;
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
}

const RatingSchema = new Schema<ratings>(
  {
    rating: { type: Number, min: 1, max: 5, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  },
  {
    timestamps: true,
  }
);
const Ratings: Model<ratings> = mongoose.model<ratings>(
  "Ratings",
  RatingSchema
);

export default Ratings;
