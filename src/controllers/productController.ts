import { Request, Response } from "express";
import Product from "../models/product";
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
    const { name, price, description, countInStock } = req.body;
    const product = new Product({
      name,
      price,
      description,
      countInStock,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
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
  try {
    const { PID } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(PID, req.body, {
      new: true,
      runValidators: true,
    });
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
  console.log(req.body);
  res.status(200).json({ message: "Cart product endpoint" });
};

const addToCart = async (req: Request, res: Response) => {
  res.status(200).json({ message: "Add to cart endpoint" });
};

export {
  getProducts,
  addProduct,
  getProductById,
  removeProduct,
  updateProduct,
  cartProduct,
  addToCart,
};
