import { Request, Response } from "express";
import Product from "../models/product";

const getProducts = async (req: Request, res: Response) => {
  const products = await Product.find();
  res.json(products).status(200);
};
const getProductById = async (req: Request, res: Response) => {
  const { PID } = req.params;
  const product = await Product.findById(PID);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product).status(200);
};

const addProduct = async (req: Request, res: Response) => {
  const { name, price, description, countInStock } = req.body;
  const product = new Product({
    name,
    price,
    description,
    countInStock,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};
const removeProduct = async (req: Request, res: Response) => {
  const { PID } = req.params;
  const product = await Product.findByIdAndDelete(PID);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted successfully" }).status(200);
};
export { getProducts, addProduct, getProductById, removeProduct };
