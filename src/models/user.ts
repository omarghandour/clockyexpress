import mongoose, { Schema, Document, Model } from "mongoose";

// Define the interface for the User schema
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  cart?: mongoose.Types.ObjectId;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

// Create the User schema
const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    cart: { type: Schema.Types.ObjectId, ref: "Cart" },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Export the User model
const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
