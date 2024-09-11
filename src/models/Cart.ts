import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the Cart schema
interface ICartProduct {
  product: string;
  quantity: number;
}

interface ICart extends Document {
  products: ICartProduct[];
  user: mongoose.Types.ObjectId;
}

// Create the Cart schema
const CartSchema: Schema<ICart> = new Schema(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Export the Cart model
const Cart: Model<ICart> = mongoose.model<ICart>("Cart", CartSchema);

export default Cart;
