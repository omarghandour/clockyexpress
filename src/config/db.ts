import mongoose from "mongoose";

const connectDB = async () => {
  const URI: any = process.env.MONGO_URI;

  try {
    await mongoose.connect(URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }
};

export default connectDB;
