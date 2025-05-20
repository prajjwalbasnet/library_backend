import express from "express";
import {
  cancelReservation,
  getAllReservations,
  getUserReservations,
  reserveBook,
} from "../controllers/reservationController.js";
import { authMiddleware, isAuthorised } from "../middlewares/authMiddleware.js";

export const reservationRouter = express.Router();

reservationRouter.post("/reserve", authMiddleware, reserveBook);
reservationRouter.delete(
  "/cancelReservation/:id",
  authMiddleware,
  cancelReservation
);
reservationRouter.get(
  "/allReservations",
  authMiddleware,
  isAuthorised,
  getAllReservations
);
reservationRouter.get("/userReservations", authMiddleware, getUserReservations);
