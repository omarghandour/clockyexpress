import { Request, Response } from "express";
import Product from "../models/product";
import Cart from "../models/Cart";
import User from "../models/user";
import Favorite from "../models/AddToFavorite";
// import Cart from "../models/Cart";

const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve products" });
  }
};

const getProductById = async (req: Request, res: Response) => {
  try {
    const { PID } = req.params;
    const product = await Product.findById(PID);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve product" });
  }
};

const addProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, description, countInStock, img } = req.body;
    // console.log(req.body);

    const product = new Product({
      name,
      price,
      description,
      countInStock,
      img,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
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
    const cart = await Cart.findOne({ user: id }).populate("products.product");

    if (!cart) {
      return res.status(404).json({ message: "No cart found for this user" });
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

const addToCart = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { product, quantity } = req.body;
  try {
    // Find the user's cart
    let cart = await Cart.findOne({ user: id });

    if (cart) {
      // Check if the product is already in the cart
      const existingProduct = cart.products.find(
        (p) => p.product.toString() === product
      );

      if (existingProduct) {
        // Update the quantity if the product already exists
        existingProduct.quantity += quantity;
      } else {
        // Add the new product to the cart
        cart.products.push({ product, quantity });
      }
    } else {
      // Create a new cart if the user doesn't have one
      cart = new Cart({
        user: id,
        products: [{ product, quantity }],
      });
    }

    const updatedCart = await cart.save();
    res.status(201).json(updatedCart);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to add to cart", error: error.message });
  }
};

// Favorites
const AddtoFavorite = async (req: Request, res: Response) => {
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
  addProduct,
  getProductById,
  removeProduct,
  updateProduct,
  cartProduct,
  addToCart,
  AddtoFavorite,
  RemoveFromFavorite,
};
