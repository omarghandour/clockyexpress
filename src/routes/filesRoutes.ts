import { Router } from "express";
import { filesUpload } from "../controllers/filesControllers";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(), // Store the file in memory temporarily
});
const router = Router();
router.post("/s/:id").post("/upload/:id", upload.single("file"), filesUpload);
