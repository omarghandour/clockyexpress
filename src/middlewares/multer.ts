import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define the uploads directory
const uploadsDir = path.join(__dirname, "uploads");

// Create the directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage: any = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    console.log(`Uploading to: ${uploadsDir}`); // Log the upload directory
    cb(null, uploadsDir);
  },
  filename: function (req: any, file: any, cb: any) {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});

// File filter to check if the uploaded file is an image
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, JPG, and PNG are allowed."));
  }
};

// Initialize multer
const upload: any = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB size limit
});

export default upload;
