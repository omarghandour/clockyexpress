import { Request, Response } from "express";
import Product from "../models/product";
import Cart from "../models/Cart";
import User from "../models/user";
import Favorite from "../models/AddToFavorite";
import NewArrival from "../models/NewArrival";
import CheckOuts from "../models/CheckOuts";
// import Cart from "../models/Cart";

const getProducts = async (req: Request, res: Response) => {
  try {
    // Get the current date
    const currentDate = new Date();

    // Fetch new arrivals
    const newArrivals = await NewArrival.find();

    // Filter out and delete products older than 1 week
    for (const arrival of newArrivals) {
      const oneWeekAgo = new Date(currentDate);
      oneWeekAgo.setDate(currentDate.getDate() - 7);

      // Check if the product creation date is older than 7 days
      if (arrival.createdAt < oneWeekAgo) {
        await NewArrival.findByIdAndDelete(arrival._id); // Delete from NewArrival
      }
    }

    // Fetch all products after cleaning up old arrivals
    const products = await Product.find();

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve products" });
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
    const featuredProducts = await Product.find({ class: "Featured" });
    res.status(200).json(featuredProducts);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve featured products" });
  }
};
const getNewArrivals = async (req: Request, res: Response) => {
  try {
    const newArrivals = await NewArrival.find();
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
      before,
      gender,
      caseColor,
      dialColor,
    } = req.body;
    // console.log(req.body);
    const newArrival = new NewArrival({
      name,
      price,
      before,
      gender,
      caseColor,
      dialColor,
      description,
      countInStock,
      img,
    });
    const product = new Product({
      name,
      price,
      before,
      gender,
      caseColor,
      dialColor,
      description,
      countInStock,
      img,
    });

    const createdProduct = await product.save();
    const newArrivaled = await newArrival.save();
    res.status(201).json({ products: createdProduct, new: newArrivaled });
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
  const { name, price, description, countInStock, img } = req.body;

  try {
    const { PID } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(
      PID,
      {
        name,
        price,
        description,
        countInStock,
        img,
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
    // Find the cart for the user and populate the product details
    let cart = await Cart.findOne({ user: id }).populate("products.product");

    if (!cart) {
      // make an empty cart
      const newCart = new Cart({ user: id });
      await newCart.save();
      cart = newCart;
    }

    // Return the populated products in the cart
    res.status(200).json(cart.products);
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to retrieve products in cart",
      error: error.message,
    });
  }
};
interface ICartProduct {
  product: string;
  quantity: number;
}
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
  const { userId, products, totalPrice, paymentMethod, shippingAddress } =
    req.body;
  try {
    // Validate required fields
    if (
      !userId ||
      !products ||
      !totalPrice ||
      !paymentMethod ||
      !shippingAddress
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new checkout instance
    const newCheckout = new CheckOuts({
      userId,
      products,
      totalPrice,
      paymentMethod,
      shippingAddress,
    });

    // Save the checkout to the database
    const savedCheckout = await newCheckout.save();

    res.status(201).json({
      message: "Checkout completed successfully",
      checkout: savedCheckout,
    });
  } catch (error) {
    console.error("Error creating checkout:", error);
    res.status(500).json({ error: "Server error during checkout" });
  }
};

// Favorites
const AddToFavorite = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ProductId } = req.body;
  try {
    // find user by id
    // const user = await User.findById(id);
    // const product = Product.findById(ProductId);
    const favorite = await Favorite.find({ user: id });
    if (favorite) {
      const favorite = new Favorite({
        user: id,
        Product: ProductId,
      });

      await favorite.save();
    }
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Failed to add to favorite" });
  }
};
const isFavorite = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ProductId } = req.body;
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
  const { id } = req.params;
  const { ProductId } = req.body;
  try {
    const favorite = await Favorite.findOneAndDelete({
      user: id,
      products: ProductId,
    });
    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }
    res.status(200).json({ message: "Favorite deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete favorite" });
  }
};
export {
  getProducts,
  getSearch,
  getFeatured,
  getNewArrivals,
  getGender,
  addProduct,
  getProductById,
  removeProduct,
  updateProduct,
  cartProduct,
  addToCart,
  AddToFavorite,
  isFavorite,
  RemoveFromFavorite,
  createCheckout,
};
