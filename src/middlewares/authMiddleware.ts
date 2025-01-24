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
      const user = await User.findById((decoded as any).id).select("-password");

      // Check if the user is an admin
      // && req.user.isAdmin
      if (user && user.isAdmin) {
        // console.log("User is admin");
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
const cookieMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.cookie;
  if (!authHeader) {
    return next();
  }
  const token = authHeader.split("=")[1];

  if (!token) {
    return next();
  }
  jwt.verify(token, process.env.JWT_SECRET!, (err, _) => {
    if (err) {
      return next();
    }
    next();
  });
};

export { authMiddleware, cookieMiddleware };
