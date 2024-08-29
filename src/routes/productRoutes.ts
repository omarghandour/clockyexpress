import { Router } from "express";
import {
  getProducts,
  addProduct,
  removeProduct,
  getProductById,
  updateProduct,
  cartProduct,
} from "../controllers/productController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.route("/").get(getProducts).post(authMiddleware, addProduct);
router
  .route("/:PID")
  .get(getProductById)
  .delete(authMiddleware, removeProduct)
  .put(authMiddleware, updateProduct);
// cart
router.route("/cart/all").get(cartProduct);
export default router;
