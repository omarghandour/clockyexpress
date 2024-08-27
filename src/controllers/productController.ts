import { Request, Response } from "express";
import Product from "../models/product";

const getProducts = async (req: Request, res: Response) => {
  const products = await Product.find();
  res.json(products).status(200);
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

export { getProducts, addProduct };
