import { Request, Response } from "express";
import multer from "multer";
import File from "../models/Files"; // Assuming you have a File model in Mongoose
import { Buffer } from "buffer";

// Express route to handle file upload
const filesUpload = async (req: Request, res: Response) => {
  const { file } = req;
  const { id: task } = req.params;

  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    // Log the file type
    console.log("File type:", file.mimetype);

    // Create a new File instance
    const newFile = new File({
      name: file.originalname,
      data: file.buffer,
      contentType: file.mimetype,
    });

    // Save the file to MongoDB
    const savedFile = await newFile.save();

    res.status(201).json(savedFile);
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Error uploading file.");
  }
};
export { filesUpload };
