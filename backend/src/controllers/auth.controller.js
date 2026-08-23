import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Check required fields
  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email and password are required");
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    phone,
  });

  // Return safe user data
  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

export default registerUser