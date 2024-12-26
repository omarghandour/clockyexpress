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
  getFavoriteProducts,
  getBrand,
  getUniqueFilters,
  getAllOrders,
  addProductToCart,
  productQuantity,
  getProductsDashboard,
  addToCartAll,
  getRatings,
  addRatings,
  getUserRating, // Add this
} from "../controllers/productController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.route("/").get(getProducts).post(authMiddleware, addProduct);
router.route("/brand/:brand").get(getBrand);
router.route("/search").get(getSearch);
router.route("/featured").get(getFeatured);
router.route("/newArrival").get(getNewArrivals);
router.route("/gender").get(getGender);
router.route("/dashboard").get(authMiddleware, getProductsDashboard);
router.get("/unique-filters", getUniqueFilters);
router
  .route("/:PID")
  .get(getProductById)
  .delete(authMiddleware, removeProduct)
  .put(authMiddleware, updateProduct);
// cart
router
  .route("/cart/:id")
  .get(authMiddleware, cartProduct)
  .post(addToCart)
  .put(productQuantity);
router.route("/cart/add/one").post(addProductToCart);
router.route("/cart/all/:id").post(addToCartAll);
// checkouts
router.route("/checkout").post(createCheckout);
router.route("/orders/all").get(authMiddleware, getAllOrders);
// Favorites
router
  .route("/favorites/:id")
  .post(AddToFavorite)
  .delete(RemoveFromFavorite)
  .get(authMiddleware, getFavoriteProducts); // Use the new getFavoriteProducts function here
// ratings
router.route("/:id/ratings").get(getRatings).patch(addRatings);
router.route("/:id/rating").get(getUserRating);
router.route("/isFavorite/:id").post(isFavorite);
export default router;
