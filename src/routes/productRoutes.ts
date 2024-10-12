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
  AddToFavorite,
  RemoveFromFavorite,
  createCheckout,
  getFeatured,
  getNewArrivals,
  getGender,
  getSearch,
  isFavorite,
} from "../controllers/productController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.route("/").get(getProducts).post(authMiddleware, addProduct);
router.route("/search").get(getSearch);
router.route("/featured").get(getFeatured);
router.route("/newArrival").get(getNewArrivals);
router.route("/gender").get(getGender);
router.route("/dashboard").get(authMiddleware, getProducts);

router
  .route("/:PID")
  .get(getProductById)
  .delete(authMiddleware, removeProduct)
  .put(authMiddleware, updateProduct);
// cart
router.route("/cart/:id").get(cartProduct).post(addToCart);
// checkouts
router.route("/checkout").post(createCheckout);
// Favorites
router
  .route("/favorites/:id")
  .post(authMiddleware, AddToFavorite)
  .delete(authMiddleware, RemoveFromFavorite);
router.route("/isFavorite/:id").post(isFavorite);
export default router;
