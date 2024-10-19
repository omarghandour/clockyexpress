import mongoose, { Schema, Document, Model } from "mongoose";

interface IFile extends Document {
  name: string;
  data: Buffer;
  contentType: string;
  path: string; // Add path if storing the file location
}

// Define the schema for storing files
const fileSchema: Schema<IFile> = new Schema(
  {
    name: { type: String, required: true }, // File name (e.g., 'image.jpg')
    data: { type: Buffer }, // File data (Buffer) - use only if storing files in DB
    contentType: { type: String, required: true }, // MIME type (e.g., 'image/jpeg')
    path: { type: String }, // File path (if using file storage instead of buffer)
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

const File: Model<IFile> = mongoose.model<IFile>("File", fileSchema);

export default File;
