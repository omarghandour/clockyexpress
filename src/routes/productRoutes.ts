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
/**
 * @swagger
 * /products/favorites/{id}:
 *   get:
 *     summary: Retrieve user's favorite products
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user
 *     responses:
 *       200:
 *         description: List of favorite products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: No favorite products found for the user
 *       500:
 *         description: Internal server error
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
  getFavoriteProducts, // Add this
} from "../controllers/productController";
import { authMiddleware } from "../middlewares/authMiddleware";
import upload from "../middlewares/multer"; // The multer middleware

const router = Router();

router
  .route("/")
  .get(getProducts)
  .post(authMiddleware, upload.single("img"), addProduct);
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
  .post(AddToFavorite)
  .delete(RemoveFromFavorite)
  .get(authMiddleware, getFavoriteProducts); // Use the new getFavoriteProducts function here

router.route("/isFavorite/:id").post(isFavorite);
export default router;
