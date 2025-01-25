import { Request, Response } from "express";
import Product from "../models/product";
import Cart from "../models/Cart";
import User from "../models/user";
import Favorite from "../models/AddToFavorite";
import NewArrival from "../models/NewArrival";
import CheckOuts from "../models/CheckOuts";
import jwt from "jsonwebtoken";
import Ratings from "../models/Ratings";

// import Cart from "../models/Cart";
interface GetProductParams {
  sortBy?: string;
  order?: "asc" | "desc";
  limit?: string;
  page?: string;
  brand?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  caseColor?: string;
  dialColor?: string;
}
// {
//   const totalProducts = await Product.countDocuments({});
//   const totalUsers = await User.countDocuments({});
//   const totalCarts = await Cart.countDocuments({});
//   const totalFavorites = await Favorite.countDocuments({});
//   const totalNewArrivals = await NewArrival.countDocuments({});
//   const totalCheckouts = await CheckOuts.countDocuments({});

//   res.json({
//     totalProducts,
//     totalUsers,
//     totalCarts,
//     totalFavorites,
//     totalNewArrivals,
//     totalCheckouts,
//     totalPages: Math.ceil(totalProducts)
//   });
// }
// Helper function for pagination
const getPagination = (limit: string, page: string): any => {
  const limitNumber = Math.min(parseInt(limit, 10) || 10, 100);
  const pageNumber = parseInt(page, 10) || 1;
  return { limit: limitNumber, page: pageNumber };
};
const getProductsDashboard = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {}
};
const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      sortBy = "name",
      order = "asc",
      limit = "10",
      page = "1",
      brand,
      category,
      minPrice,
      maxPrice,
      caseColor,
      dialColor,
    } = req.query as GetProductParams;

    const sortOrder = order === "desc" ? -1 : 1;
    const allowedSortFields = ["name", "price", "createdAt", "brand"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "name";

    const { limit: limitNumber, page: pageNumber } = getPagination(limit, page);
    const sortOptions: any = { [sortField]: sortOrder };

    const filters: any = {};
    if (brand && brand !== "All") filters.brand = brand;
    if (category && category !== "All") filters.category = category;
    if (minPrice) filters.price = { ...filters.price, $gte: Number(minPrice) };
    if (maxPrice) filters.price = { ...filters.price, $lte: Number(maxPrice) };
    if (caseColor && caseColor !== "All") filters.caseColor = caseColor;
    if (dialColor && dialColor !== "All") filters.dialColor = dialColor;

    const products = await Product.find(filters)
      .sort(sortOptions)
      .limit(limitNumber)
      .skip((pageNumber - 1) * limitNumber);

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Server error while fetching products",
    });
  }
};

const getUniqueFilters = async (req: Request, res: Response) => {
  try {
    const uniqueBrands = await Product.distinct("brand");
    const uniqueCategories = await Product.distinct("category");
    const uniqueCaseColors = await Product.distinct("caseColor");
    const uniqueDialColors = await Product.distinct("dialColor");

    res.json({
      brands: uniqueBrands,
      categories: uniqueCategories,
      caseColors: uniqueCaseColors,
      dialColors: uniqueDialColors,
    });
  } catch (error) {
    console.error("Error fetching unique filters:", error);
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Server error while fetching unique filters",
    });
  }
};
const getBrand = async (req: Request, res: Response) => {
  const { brand } = req.params;

  if (brand === undefined || brand === null) {
    return res.status(400).json({ message: "Invalid brand provided" });
  }

  const LowerCaseBrand = brand.toLowerCase();
  try {
    const products = await Product.find({ brand: LowerCaseBrand });
    res.status(200).json(products);
  } catch (error: any) {
    console.log(error.message);
    res.status(500).json({ message: "Failed to retrieve products by brand" });
  }
};
const getSearch = async (req: Request, res: Response) => {
  const { keyword } = req.query;

  if (keyword === undefined || keyword === null) {
    return res.status(400).json({ message: "Invalid keyword provided" });
  }

  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve products by keyword" });
  }
};
const getFeatured = async (req: Request, res: Response) => {
  try {
    const featuredProducts = await Product.find({ productClass: "Featured" });
    res.status(200).json(featuredProducts);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve featured products" });
  }
};
const getNewArrivals = async (req: Request, res: Response) => {
  try {
    const newArrivals = await Product.find()
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .limit(5); // Limit the result to 5 items
    res.status(200).json(newArrivals);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve new arrivals" });
  }
};

const getGender = async (req: Request, res: Response) => {
  const gender = req.query.gender;
  // console.log(req.params);

  if (gender === undefined || gender === null) {
    return res.status(400).json({ message: "Invalid gender provided" });
  }
  try {
    if (gender !== "men" && gender !== "women" && gender !== "unisex") {
      return res.status(400).json({ message: "Invalid gender provided" });
    }
    const products = await Product.find({ gender });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve products by gender" });
  }
};
const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { PID } = req.params;

    // Find product in both Product and NewArrival collections
    const product =
      (await Product.findById(PID)) || (await NewArrival.findById(PID));

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    // Respond with the found product
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve product" });
  }
};

const addProduct = async (req: Request, res: Response) => {
  try {
    const {
      name,
      price,
      description,
      countInStock,
      img,
      images,
      before,
      gender,
      movmentType,
      caseColor,
      dialColor,
      brand,
      caseSize,
      faceMaterial,
      features,
      modelNumber,
      brandClosure,
      faceDialShape,
      faceDialType,
      productClass,
    } = req.body;

    const product = new Product({
      name,
      price,
      before,
      gender,
      caseColor,
      dialColor,
      movmentType,
      description,
      countInStock,
      img,
      otherImages: images,
      brand,
      caseSize,
      faceMaterial,
      features,
      modelNumber,
      brandClosure,
      faceDialShape,
      faceDialType,
      productClass,
    });

    const createdProduct = await product.save();
    res.status(201).json({ products: createdProduct });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to add product" });
  }
};

const removeProduct = async (req: Request, res: Response) => {
  try {
    const { PID } = req.params;
    const product = await Product.findByIdAndDelete(PID);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};

const updateProduct = async (req: Request, res: Response) => {
  const {
    name,
    price,
    description,
    countInStock,
    img,
    before,
    gender,
    movmentType,
    caseColor,
    dialColor,
    brand,
    caseSize,
    faceMaterial,
    features,
    modelNumber,
    brandClosure,
    faceDialShape,
    faceDialType,
    productClass,
  } = req.body;

  try {
    const { PID } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(
      PID,
      {
        name,
        price,
        before,
        gender,
        caseColor,
        dialColor,
        movmentType,
        description,
        countInStock,
        img,
        otherImages: req.body.images,
        brand,
        caseSize,
        faceMaterial,
        features,
        modelNumber,
        brandClosure,
        faceDialShape,
        faceDialType,
        productClass,
        // attachment,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Failed to update product" });
  }
};

// cart
const cartProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Find the cart with populated products
    let cart = await Cart.findOne({ user: id }).populate({
      path: "products.product",
      model: "Product", // Explicitly specify the model for safety
    });

    // Create new cart if none exists
    if (!cart) {
      const newCart = new Cart({ user: id, products: [] });
      await newCart.save();
      return res.status(200).json(newCart.products);
    }

    // Track original length for cleanup reporting
    const originalProductCount = cart.products.length;

    // Filter out products with missing/null product references
    cart.products = cart.products.filter(
      (item: any) => item.product && item.product._id && !item.product.deletedAt
    );

    // Check if we need to update the cart
    if (cart.products.length !== originalProductCount) {
      await cart.save();
    }

    // Convert to plain object and remove internal version key
    const responseProducts = cart.products.map((product: any) => {
      const pojo = product;
      delete pojo.__v;
      return pojo;
    });
    // console.log(cleanupPerformed);

    res.status(200).json({
      products: responseProducts,
      cleanupPerformed: originalProductCount !== cart.products.length,
      removedItems: originalProductCount - cart.products.length,
    });
  } catch (error: any) {
    console.error(`Cart retrieval error for user ${id}:`, error);
    res.status(500).json({
      message: "Failed to retrieve cart products",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
interface ICartProduct {
  product: string;
  quantity: number;
}
const addProductToCart = async (req: Request, res: Response) => {
  const { userId, productId, quantity } = req.body;

  try {
    // Find the user's cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // If the cart doesn't exist, create a new cart for the user
      cart = new Cart({
        user: userId,
        products: [],
      });
    }

    // Check if the product already exists in the cart
    const existingProductIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (existingProductIndex > -1) {
      // If the product exists, increase the quantity
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // If the product doesn't exist, add it to the cart
      cart.products.push({ product: productId, quantity });
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Failed to add product to cart" });
  }
};
const addToCartAll = async (req: Request, res: Response) => {
  const { cart: products } = req.body;
  const { id: userId } = req.params;

  try {
    // Validate products array format
    if (!Array.isArray(products)) {
      return res.status(400).json({ message: "Invalid products data format" });
    }

    // Initial filter for invalid products in the request
    const validRequestProducts = products.filter(
      (p) => p != null && p.product != null && p.product._id != null
    );

    // Extract product IDs from valid products
    const productIds = validRequestProducts.map((p) => p.product._id);

    // Find existing products in database
    const existingProducts = await Product.find({
      _id: { $in: productIds },
    });

    // Create lookup set of valid product IDs
    const validProductIds = new Set(
      existingProducts.map((p: any) => p._id.toString())
    );

    // Final filter of products that exist in database
    const validCartProducts = validRequestProducts.filter((p) =>
      validProductIds.has(p.product._id.toString())
    );

    // Find or create user's cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        products: validCartProducts,
      });
    } else {
      // Replace existing cart products with validated ones
      cart.products = validCartProducts;
    }

    await cart.save();

    res.status(200).json({
      message: "Cart updated successfully",
      removedCount: products.length - validCartProducts.length,
    });
  } catch (error) {
    console.error("Cart update error:", error);
    res.status(500).json({ message: "Failed to update cart" });
  }
};
const productQuantity = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { productId, change } = req.body;

  try {
    // Find the user's cart
    let cart = await Cart.findOne({ user: id });
    // console.log(cart);

    if (!cart) {
      // If the cart doesn't exist, return an empty array
      return res.status(200).json([]);
    }
    // Find the product in the cart
    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (productIndex === -1) {
      // If the product doesn't exist, return an empty array
      return res.status(200).json([]);
    }

    const product = cart.products[productIndex];

    // Update the quantity
    product.quantity += change;

    if (product.quantity <= 0) {
      // Remove the product if quantity is 0 or less
      cart.products.splice(productIndex, 1);
    }

    // Save the updated cart
    await cart.save();
    res.status(200).json(cart.products);
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Failed to update product quantity" });
  }
};

const addToCart = async (req: Request, res: Response) => {
  const { id } = req.params; // The user ID
  const { products } = req.body; // Array of products with product ID and quantity

  if (!Array.isArray(products)) {
    return res.status(400).json({ message: "Invalid products format" });
  }

  try {
    // Find the user's cart
    let cart = await Cart.findOne({ user: id });

    if (!cart) {
      // If the cart doesn't exist, create a new cart for the user
      cart = new Cart({
        user: id,
        products: [],
      });
    }

    // Update the cart's products
    const updatedProducts = products.reduce(
      (
        acc: ICartProduct[],
        { _id, quantity }: { _id: string; quantity: number }
      ) => {
        if (quantity > 0) {
          // Check if the product already exists in the cart
          const existingProductIndex = acc.findIndex(
            (p) => p.product.toString() === _id
          );
          if (existingProductIndex > -1) {
            // Update the quantity if the product exists
            acc[existingProductIndex].quantity = quantity;
          } else {
            // Add new product to the cart
            acc.push({ product: _id, quantity });
          }
        }
        return acc;
      },
      []
    );

    // Remove products with quantity of 0
    cart.products = updatedProducts;

    // Save the updated cart
    await cart.save();

    res.status(200).json(cart);
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update cart", error: error.message });
  }
};
//  checkout

const createCheckout = async (req: Request, res: Response) => {
  const { userId, totalPrice, paymentMethod, shippingAddress } = req.body;

  try {
    // Validate required fields
    if (!userId || !totalPrice || !paymentMethod || !shippingAddress) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Fetch the user's cart
    const userCart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );
    if (!userCart || userCart.products.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    // Extract products from the cart
    const products: any = userCart.products.map((item: any) => ({
      productId: item.product._id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price, // Assuming the product schema has a 'price' field
    }));

    // Create the checkout object
    const newCheckoutData: any = {
      userId,
      products,
      totalPrice,
      paymentMethod,
      shippingAddress,
    };

    // Create a new checkout instance
    const newCheckout = new CheckOuts(newCheckoutData);

    // Save the checkout to the database
    const savedCheckout = await newCheckout.save();

    // Lower the product quantities
    for (const item of userCart.products) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock -= item.quantity;
        await product.save();
      }
    }

    await Cart.findOneAndUpdate({ user: userId }, { products: [] });

    res.status(201).json({
      message: "Checkout completed successfully",
      checkout: savedCheckout,
    });
  } catch (error) {
    console.error("Error creating checkout:", error);
    res.status(500).json({ error: "Server error during checkout" });
  }
};
const getAllOrders = async (req: Request, res: Response) => {
  try {
    // Fetch all checkouts
    const checkouts = await CheckOuts.find();
    if (!checkouts || checkouts.length === 0) {
      return res.status(404).json({ message: "No checkouts found" });
    }
    return res.status(200).json(checkouts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: `Internal server error: ${error}` });
  }
};
const orderStatusUpdate = async (req: Request, res: Response) => {
  const { status } = req.body;
  const { id } = req.params;
  // console.log(status, id);
  try {
    // Find the checkout with the given ID
    const checkout = await CheckOuts.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    return res.status(200).json(checkout);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
// Controller to fetch favorite products
const getFavoriteProducts = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Fetch the user's favorite products
    const favorite = await Favorite.findOne({ user: id }).populate("products");

    if (!favorite || favorite.products.length === 0) {
      return res.status(404).json({ message: "No favorite products found" });
    }

    return res.status(200).json(favorite.products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const AddToFavorite = async (req: Request, res: Response) => {
  const { id } = req.params; // User ID
  const { ProductId } = req.body; // Product ID
  if (!id || id === undefined || id === null || id === "10") {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    // Find the user's favorites
    let favorite = await Favorite.findOne({ user: id });

    if (!favorite) {
      // If no favorite document exists for the user, create one
      favorite = new Favorite({
        user: id,
        products: [ProductId],
      });
    } else {
      // Check if the product is already in the user's favorites
      if (favorite.products.includes(ProductId)) {
        return res
          .status(400)
          .json({ message: "Product is already in favorites" });
      }

      // Add the product to the favorites array
      favorite.products.push(ProductId);
    }

    // Save the updated favorites document
    await favorite.save();
    res.status(200).json({ message: "Added to favorites" });
  } catch (error) {
    console.error("Failed to add to favorites:", error);
    res.status(500).json({ message: "Failed to add to favorites" });
  }
};

const isFavorite = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ProductId } = req.body;
  if (!id || id === undefined || id === null || id === "10") {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const favorite = await Favorite.findOne({
      user: id,
      products: ProductId,
    });
    if (favorite) {
      res.status(200).json({ isFavorite: true });
    } else {
      res.status(200).json({ isFavorite: false });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to check if favorite" });
  }
};
const RemoveFromFavorite = async (req: Request, res: Response) => {
  const { id } = req.params; // User ID
  const { ProductId } = req.body; // Product ID
  if (!id || id === undefined || id === null || id === "10") {
    throw new Error("User ID is required");
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    // Find the user's favorites
    const favorite = await Favorite.findOne({ user: id });

    if (!favorite || !favorite.products.includes(ProductId)) {
      return res
        .status(404)
        .json({ message: "Product not found in favorites" });
    }

    // Remove the product from the favorites array
    favorite.products = favorite.products.filter(
      (product) => product.toString() !== ProductId
    );

    // Save the updated document
    await favorite.save();
    res.status(200).json({ message: "Removed from favorites" });
  } catch (error) {
    console.error("Failed to remove from favorites:", error);
    res.status(500).json({ message: "Failed to remove from favorites" });
  }
};
const getUserRating = async (req: Request, res: Response) => {
  const { id } = req.params; // Product ID
  const authHeader = req.headers.cookie; // Get the 'Authorization' header
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }
  // console.log(authHeader);

  const token = authHeader.split("=")[1]; // Extract the token from the 'Bearer token' format
  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }
  // console.log(token);
  // Validate the token using the JWT secret
  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid token" });
  }
  // Fetch the rating from Ratings Schema
  try {
    const rating = await Ratings.findOne({ product: id, user: decoded.id });
    if (!rating) {
      return res.status(404).json({ message: "No rating found" });
    }
    return res.status(200).json({ rating });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const getRatings = async (req: Request, res: Response) => {
  const { id } = req.params; // Product ID
  try {
    const ratings = await Ratings.find({ product: id });
    if (!ratings || ratings.length === 0) {
      return res.status(404).json({ message: "No ratings found" });
    }
    // calculate the averageRating
    const sumRatings = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = sumRatings / ratings.length;
    return res.status(200).json({ ratings: ratings, averageRating });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const addRatings = async (req: Request, res: Response) => {
  const { id } = req.params; // Product ID
  const authHeader = req.headers.cookie; // Get the 'Authorization' header
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }
  // console.log(authHeader);

  const token = authHeader.split("=")[1]; // Extract the token from the 'Bearer token' format
  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }
  // console.log(token);
  // Validate the token using the JWT secret
  const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid token" });
  }
  const { rating } = req.body; // Rating and review data
  if (!rating || rating === undefined || rating === null) {
    return res.status(400).json({ message: "Rating is required" });
  }
  const PID = decoded?.id;
  try {
    // Check if the product already has a rating by the user
    const existingRating = await Ratings.findOne({
      product: id,
      user: PID,
    });
    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
      return res.status(200).json({ message: "Rating updated successfully" });
    }
    // Create a new rating document
    const newRating = new Ratings({
      product: id,
      user: PID,
      rating,
      review: req.body.review,
    });
    // Save the rating document
    await newRating.save();
    return res.status(200).json({ message: "Rating added successfully" });
  } catch (error) {
    console.error("Failed to add rating:", error);
    return res.status(500).json({ message: "Failed to add rating" });
  }
};

export {
  getProductsDashboard,
  getProducts,
  getUniqueFilters,
  getBrand,
  getSearch,
  getFeatured,
  getNewArrivals,
  getGender,
  addProduct,
  getProductById,
  removeProduct,
  updateProduct,
  cartProduct,
  productQuantity,
  addProductToCart,
  addToCart,
  addToCartAll,
  AddToFavorite,
  getFavoriteProducts,
  isFavorite,
  RemoveFromFavorite,
  createCheckout,
  getAllOrders,
  orderStatusUpdate,
  getRatings,
  addRatings,
  getUserRating,
};
