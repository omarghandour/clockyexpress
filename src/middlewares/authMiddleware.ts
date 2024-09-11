import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/user";

interface AuthRequest extends Request {
  user?: any;
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      req.user = await User.findById((decoded as any).id).select("-password");

      // Check if the user is an admin
      if (req.user && req.user.isAdmin) {
        console.log("User is admin");

        next();
      } else {
        res.status(403).json({ message: "Access denied. Admins only." });
      }
    } catch (error) {
      console.log(error);

      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    console.log("no token");

    res.status(401).json({ message: "Not authorized, no token" });
  }
};

export { authMiddleware };
