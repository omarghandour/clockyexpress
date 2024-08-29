import { Request, Response } from "express";
import User from "../models/user";
import generateToken from "../utils/generateToken";
import bcrypt from "bcryptjs";

const registerUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const userExists = await User.findOne({ email });
  const hashedPassword = await bcrypt.hash(password, salt);

  if (userExists) {
    res.status(400).json({ message: "User already exists" });
    return;
  }
  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  const createdUser = await user.save();
  res.status(201).json({
    _id: createdUser._id,
    name: createdUser.name,
    email: createdUser.email,
    isAdmin: createdUser.isAdmin,
    token: generateToken(createdUser._id as string),
  });
};

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (user) {
    res.json({
      _id: user._id as string,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id as string),
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
};

export { registerUser, loginUser };
