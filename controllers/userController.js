import jwt from "jsonwebtoken";
import { userModel } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { sendVerification } from "../utils/sendVerification.js";

//---generate verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

//-----generate Token------
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, studentId } = req.body;

    // validate required fields
    if (!name || !email || !password || !studentId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required field" });
    }

    // check if user exists
    const userExists = await userModel.findOne({
      $or: [{ email }, { studentId }],
    });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User with this email or student ID already exists",
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

    const verificationCode = generateVerificationCode();
    const verificationCodeExpire = new Date(Date.now() + 5 * 60 * 1000);

    // ---------Create User----------
    const newUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
      studentId,
      verificationCode,
      verificationCodeExpire,
    });

    const emailSent = await sendVerification(email, verificationCode, name);

    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      token,
      message: emailSent
        ? "Registration successful. Please check your email for verification code."
        : "Registration successful but verification email could not be sent. Please contact support.",
      userId: newUser._id,
    });
  } catch (error) {
    console.log("Registration error", error);
    res.status(500).json({
      success: false,
      error,
    });
  }
};

// ------- Verify Email--------
export const verifyEmail = async (req, res) => {
  try {
    const { userId, verificationCode } = req.body;

    if (!userId || !verificationCode) {
      return res.status(400).json({
        success: false,
        message: "User ID or verification code missing.",
      });
    }

    // ------find User-----
    const user = await userModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    // ----chcek if user is already verified-------
    if (user.isActive) {
      return res
        .status(400)
        .json({ success: false, message: "User is already verified" });
    }

    // ---check verification code is corret and not expired-----
    if (
      user.verificationCode !== parseInt(verificationCode) ||
      user.verificationCodeExpire < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
    }

    // ----update user to verified-----
    user.isActive = true;
    user.verificationCode = undefined;
    user.verificationCodeExpire = undefined;
    await user.save();

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        studentId: user.studentId,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during verification",
    });
  }
};

export const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required field" });
    }

    // -----find user-------
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    // --check if user is verified------
    if (user.isActive) {
      return res
        .status(400)
        .json({ success: false, message: "User is already verified" });
    }

    const verificationCode = generateVerificationCode();
    const verificationCodeExpire = new Date(Date.now() + 5 * 60 * 1000);

    user.verificationCode = verificationCode;
    user.verificationCodeExpire = verificationCodeExpire;
    await user.save();

    const emailSent = await sendVerification(
      email,
      verificationCode,
      user.name
    );

    if (!emailSent) {
      return res
        .status(500)
        .json({ success: false, message: "Error sending verification email" });
    }

    return res.status(200).json({
      success: true,
      message: "Verification code sent successfully",
      userId: user._id,
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during resend verification",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Missing field." });
    }

    const user = await userModel
      .findOne({ email, isActive: true })
      .select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      message: "Login Successful",
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
    });
  }
};

// ----------Logout User----------
export const logoutUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during logout",
    });
  }
};

// ---------- get User---------
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching user data",
    });
  }
};
