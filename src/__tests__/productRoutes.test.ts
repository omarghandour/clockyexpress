import request from "supertest";
import express from "express";
import productRoutes from "../routes/productRoutes";
import Product from "../models/product";

// Mock the Product model
jest.mock("../models/product");

const app = express();
app.use(express.json());
app.use("/api/products", productRoutes);

describe("Product Routes", () => {
  it("should return a list of products and match snapshot", async () => {
    const products = [
      {
        name: "Product 1",
        price: 100,
        description: "Test product",
        countInStock: 10,
      },
      {
        name: "Product 2",
        price: 200,
        description: "Test product 2",
        countInStock: 5,
      },
    ];

    (Product.find as jest.Mock).mockResolvedValue(products);

    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body).toMatchSnapshot();
  });

  // Add more tests here
});
