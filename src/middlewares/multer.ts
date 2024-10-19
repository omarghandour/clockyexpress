import multer from "multer";

const storageMulter = multer({
  storage: multer.memoryStorage(),
  // Comment out the limits and fileFilter temporarily
  // limits: { fileSize: 1024 * 1024 * 5 },
  // fileFilter: (req, file, cb) => {
  //   const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  //   if (allowedTypes.includes(file.mimetype)) {
  //     cb(null, true);
  //   } else {
  //     cb(new Error("Invalid file type. Only JPEG, JPG, and PNG are allowed."));
  //   }
  // },
});

export default storageMulter;
