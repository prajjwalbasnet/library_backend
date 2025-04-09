import express from "express";
import {
  addBook,
  deleteBook,
  getAllBooks,
  updateBook,
} from "../controllers/bookController.js";
import upload from "../middlewares/multer.js";
import { authMiddleware, isAuthorised } from "../middlewares/authMiddleware.js";

const bookRouter = express.Router();

// Add authMiddleware before isAuthorised
bookRouter.post(
  "/addBook",
  upload.single("coverImage"),
  authMiddleware,
  isAuthorised,
  addBook
);
bookRouter.get("/getAll", getAllBooks);
bookRouter.delete("/delete/:id", authMiddleware, isAuthorised, deleteBook);
bookRouter.put(
  "/update/:id",
  upload.single("coverImage"),
  authMiddleware,
  isAuthorised,
  updateBook
);

export default bookRouter;
