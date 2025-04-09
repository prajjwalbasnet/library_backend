import express from "express";
import {
  borrowedBooks,
  getBorrowedBooksForAdmin,
  recordBorrowedBooks,
  returnBorrowedBooks,
} from "../controllers/borrowController.js";
import { isAuthorised, authMiddleware } from "../middlewares/authMiddleware.js";

export const borrowRouter = express.Router();

borrowRouter.post(
  "/record/:id",
  authMiddleware,
  isAuthorised,
  recordBorrowedBooks
);

borrowRouter.put(
  "/return-borrowed-book/:id",
  authMiddleware,
  isAuthorised,
  returnBorrowedBooks
);

borrowRouter.get("/my-borrowed-books", authMiddleware, borrowedBooks);

borrowRouter.get(
  "/borrowed-books-by-users",
  authMiddleware,
  isAuthorised,
  getBorrowedBooksForAdmin
);
