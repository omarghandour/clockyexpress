import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
dotenv.config();
connectDB();

const app = express();
const swaggerDefinition = {
  info: {
    title: "E-commerce API",
    version: "0.1.0",
    description: "API for an e-commerce platform",
  },
  host: "localhost",
  basePath: "/api",
  schemes: ["http"],
};
const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.ts"], // Path to the API docs
};
const swaggerSpec = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware to parse JSON
app.use(express.json());
// app.get("/", (req, res) => {
//   res.json("success").status(201);
// });

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
