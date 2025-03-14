// models/Checkout.ts
import mongoose, { Document, Schema } from "mongoose";
import { Coupon } from "./Coupon";

interface ICheckout extends Document {
  userId?: string; // ID of the user making the purchase
  products: {
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
  }[];
  totalPrice: number;
  paymentMethod: string; // E.g., "Cash on Delivery" or "Pay with Card"
  status: string; // E.g., "Pending", "Completed", "Cancelled"
  shippingAddress: {
    fullName: string;
    firstName: string;
    lastName: string;
    address: string;
    email: string;
    city: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  paymentStatus: string;
  orderId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CheckoutSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    products: [
      {
        productId: {
          type: String,
          ref: "Product",
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash on Delivery", "Pay with Card"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },
    couponCode: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      required: false,
    },
    orderId: {
      type: String,
      required: false,
    },
    paymentStatus: {
      type: String,
      required: false,
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      lastName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      governorate: { type: String, required: true },
      email: { type: String, required: true },
      // postalCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: { type: String, required: true },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export default mongoose.model<ICheckout>("Checkout", CheckoutSchema);
