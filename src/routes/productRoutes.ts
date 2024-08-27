import { Router } from "express";
import {
  getProducts,
  addProduct,
  removeProduct,
  getProductById,
} from "../controllers/productController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.route("/").get(getProducts).post(authMiddleware, addProduct);
router.route("/:PID").get(getProductById).delete(authMiddleware, removeProduct);
export default router;
