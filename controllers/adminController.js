import { userModel } from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const getAllUser = async (req, res) => {
  try {
    const users = await userModel.find();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Users not found",
    });
  }
};

export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // validate required fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required field" });
    }

    // check if user exists
    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered.",
      });
    }

    if (password.length < 8 || password.length > 16) {
      return res.json({
        success: false,
        message: "Plassword must be between 8 to 16 characters.",
      });
    }
    // hash password --------
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ---------Create Admin----------
    const newAdmin = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: "Admin",
      isActive: true,
    });

    const token = generateToken(newAdmin._id);

    res.status(201).json({
      success: true,
      token,
    });
  } catch (error) {
    console.log("Registration error", error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};
