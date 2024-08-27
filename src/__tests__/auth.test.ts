// src/__tests__/userRoutes.test.ts
import request from "supertest";
import express from "express";
import userRoutes from "../routes/userRoutes";
import User from "../models/user";
import generateToken from "../utils/generateToken";

// Mock the User model and utility functions
jest.mock("../models/user");
jest.mock("../utils/generateToken");

const app = express();
app.use(express.json());
app.use("/api/users", userRoutes);

describe("User Routes", () => {
  it("should register a new user and match snapshot", async () => {
    const newUser = {
      _id: "1",
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    };

    (User.findOne as jest.Mock).mockResolvedValue(null);
    (User.prototype.save as jest.Mock).mockResolvedValue(newUser);
    (generateToken as jest.Mock).mockReturnValue("fakeToken");

    const res = await request(app).post("/api/users/register").send({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchSnapshot(); // This will generate and compare the snapshot
  });
  it("should login a user", async () => {
    const user = {
      _id: "1",
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
      isAdmin: false,
      matchPassword: jest.fn().mockResolvedValue(true),
    };

    (User.findOne as jest.Mock).mockResolvedValue(user);
    (user.matchPassword as jest.Mock).mockResolvedValue(true);
    (generateToken as jest.Mock).mockReturnValue("fakeToken");

    const res = await request(app).post("/api/users/login").send({
      email: "john@example.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.token).toBe("fakeToken");
  });
  // Add more tests here
});
