import mongoose, { Schema, Document, Model } from "mongoose";

// Define the schema interface
interface IFavorite extends Document {
  user: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
}

// Define the schema
const FavoriteSchema = new Schema<IFavorite>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
});

// Create the model
const Favorite: Model<IFavorite> = mongoose.model<IFavorite>(
  "Favorite",
  FavoriteSchema
);

export default Favorite;
