import request from "supertest";
import express from "express";
import productRoutes from "../routes/productRoutes";
import Product from "../models/product";
import { authMiddleware } from "../middlewares/authMiddleware";
jest.mock("../middlewares/authMiddleware", () => ({
  authMiddleware: jest.fn(),
}));
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
  it("should return a Product by ID", async () => {
    const product = {
      _id: "123abc",
      name: "Product 1",
      price: 100,
      description: "Test product",
      countInStock: 10,
    };

    (Product.findById as jest.Mock).mockResolvedValue(product);

    const res = await request(app).get(`/api/products/${product._id}`);

    expect(res.status).toBe(200);
    expect(res.body).toMatchSnapshot();
  });
  it("should delete a Product by ID", async () => {
    const product = {
      _id: "123abc",
      name: "Product 1",
      price: 100,
      description: "Test product",
      countInStock: 10,
    };

    (Product.findByIdAndDelete as jest.Mock).mockResolvedValue(product);
    (authMiddleware as jest.Mock).mockImplementation((req, res, next) => {
      req.user = { _id: "123", isAdmin: true }; // Simulate an admin user
      next();
    });

    const res = await request(app)
      .delete(`/api/products/${product._id}`)
      .set("Authorization", "Bearer fakeToken"); // Simulate a token being sent

    expect(res.status).toBe(200);
    expect(res.body).toMatchSnapshot();
  });
  it("should create a new product with valid token", async () => {
    const product = {
      _id: "1",
      name: "Sample Product",
      price: 99.99,
      description: "This is a sample product",
      countInStock: 10,
    };

    (Product.create as jest.Mock).mockResolvedValue(product);

    // Mock the implementation of authMiddleware
    (authMiddleware as jest.Mock).mockImplementation((req, res, next) => {
      req.user = { _id: "123", isAdmin: true }; // Simulate an admin user
      next();
    });

    const res = await request(app)
      .post("/api/products")
      .set("Authorization", "Bearer fakeToken") // Simulate a token being sent
      .send({
        name: "Sample Product",
        price: 99.99,
        description: "This is a sample product",
        countInStock: 10,
      });

    expect(res.status).toBe(201);
    expect(res.body).toMatchSnapshot(); // Compare the response with the snapshot
  });

  it("should return 401 if no token is provided", async () => {
    (authMiddleware as jest.Mock).mockImplementation((req, res, next) => {
      res.status(401).json({ message: "Not authorized, no token" });
    });

    const res = await request(app).post("/api/products").send({
      name: "Sample Product",
      price: 99.99,
      description: "This is a sample product",
      countInStock: 10,
    });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Not authorized, no token" });
  });
  // Add more tests here
});
