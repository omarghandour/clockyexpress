import { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ICoupon extends Document {
  code: string;
  discount: number; // Percentage or fixed amount
  expiresAt: Date;
  maxUsage: number;
  usedCount: number;
  valid: boolean;
}

const couponSchema = new Schema<ICoupon>({
  code: { type: String, default: () => uuidv4(), unique: true },
  discount: { type: Number, required: true },
  //   expiresAt: { type: Date, required: true },
  valid: { type: Boolean, default: false },
  maxUsage: { type: Number, required: true },
  usedCount: { type: Number, default: 0 },
});

export const Coupon = model<ICoupon>("Coupon", couponSchema);
