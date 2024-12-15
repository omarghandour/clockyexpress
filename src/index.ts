import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();

// Define allowed origins for CORS
const allowedOrigins = [
  "https://www.clockyeg.com",
  "http://localhost:3000",
  "https://clockyeg.netlify.app",
];

// Configure CORS options
const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: any, allow?: boolean) => void
  ) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error("Not allowed by CORS")); // Deny the request
    }
  },
  methods: "GET,POST,OPTIONS,PUT,DELETE,PATCH", // Specify allowed methods
  // allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  credentials: true, // Allow credentials (cookies, authorization headers)
};

// Enable CORS with the specified options
// app.use(cors(corsOptions));
app.use(
  cors({
    origin: "https://www.clockyeg.com/", // Replace with your frontend domain
    credentials: true, // Allow credentials (cookies)
  })
);

// Swagger setup
const swaggerDefinition = {
  info: {
    title: "E-commerce API",
    version: "0.1.0",
    description: "API for an e-commerce platform",
  },
  host: "localhost", // Update this if deploying to a production environment
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

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

// Handle preflight requests (OPTIONS)
app.options("*", cors(corsOptions)); // Enable preflight for all routes

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
