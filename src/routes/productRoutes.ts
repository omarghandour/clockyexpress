/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management API
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieves a list of products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
import { Router } from "express";
import {
  getProducts,
  addProduct,
  removeProduct,
  getProductById,
  updateProduct,
  cartProduct,
  addToCart,
} from "../controllers/productController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.route("/").get(getProducts).post(addProduct);
router
  .route("/:PID")
  .get(getProductById)
  .delete(removeProduct)
  .put(updateProduct);
// cart
router.route("/cart/:id").get(cartProduct).post(addToCart);
export default router;
