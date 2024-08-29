import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  const URI = process.env.MONGO_URI;

  if (!URI) {
    console.error(
      "MongoDB connection URI is not defined in environment variables."
    );
    process.exit(1);
  }

  try {
    await mongoose.connect(URI);
    console.log("MongoDB connected successfully");
  } catch (error: any) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
