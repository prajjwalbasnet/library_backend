import express from "express";
import { authMiddleware, isAuthorised } from "../middlewares/authMiddleware.js";
import { getAllUser, registerAdmin } from "../controllers/adminController.js";

export const adminRouter = express.Router();

adminRouter.get("/getAllUsers", authMiddleware, isAuthorised, getAllUser);
adminRouter.post("/registerAdmin", registerAdmin);
