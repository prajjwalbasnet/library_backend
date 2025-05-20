import mongoose from "mongoose";
import { bookModel } from "../models/bookModel.js";
import { reservationModel } from "../models/reservationModel.js";
import { userModel } from "../models/userModel.js";

export const reserveBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;

    const book = await bookModel.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const existingReservation = await reservationModel.findOne({
      "user.id": userId,
      "book.id": bookId,
      status: "Active",
    });

    if (existingReservation) {
      return res.status(400).json({
        success: false,
        message: "You already have an active reservation for this book",
      });
    }

    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 3);

    const newReservation = new reservationModel({
      user: {
        id: userId,
        name: req.user.name,
        studentId: req.user.studentId || "N/A",
        email: req.user.email,
      },
      book: {
        id: book._id,
        title: book.title,
        coverImage: {
          url: book.coverImage.url,
        },
      },
      reservationDate: new Date(),
      expirationDate: expirationDate,
      status: "Active",
    });

    await newReservation.save();

    await userModel.findByIdAndUpdate(userId, {
      $push: {
        reservedBooks: {
          bookId: newReservation._id,
          bookTitle: book.title,
          reservationDate: new Date(),
          expirationDate: expirationDate,
          status: "Active",
        },
      },
    });

    return res.status(201).json({
      success: true,
      data: newReservation,
      message: `Book "${
        book.title
      }" reserved successfully until ${expirationDate.toDateString()}`,
    });
  } catch (error) {
    console.error("Error creating reservation:", error);

    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error creating reservation",
      error: error.message,
    });
  }
};

export const cancelReservation = async (req, res) => {
  try {
    const reservationId = req.params.id;
    const userId = req.user._id;

    // Use async/await without a callback
    const reservation = await reservationModel.findById(reservationId);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found",
      });
    }

    // Update reservation status
    reservation.status = "Cancelled";
    await reservation.save();

    // Update user's reservedBooks array - using async/await
    await userModel.findByIdAndUpdate(userId, {
      $pull: { reservedBooks: { bookId: reservationId } },
    });

    return res.status(200).json({
      success: true,
      message: "Reservation cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    return res.status(500).json({
      success: false,
      message: "Error cancelling reservation",
      error: error.message,
    });
  }
};

export const getAllReservations = async (req, res) => {
  try {
    //pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    // Status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Date range filter
    if (req.query.fromDate && req.query.toDate) {
      filter.reservationDate = {
        $gte: new Date(req.query.fromDate),
        $lte: new Date(req.query.toDate),
      };
    }

    // Book filter
    if (req.query.bookId) {
      filter["book.id"] = req.query.bookId;
    }

    // User filter (by name, email, or studentId)
    if (req.query.user) {
      filter.$or = [
        { "user.name": { $regex: req.query.user, $options: "i" } },
        { "user.email": { $regex: req.query.user, $options: "i" } },
        { "user.studentId": { $regex: req.query.user, $options: "i" } },
      ];
    }

    // Sort options
    const sortOptions = {};
    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
      sortOptions[sortField] = sortOrder;
    } else {
      // Default sort: most recent reservations first
      sortOptions.createdAt = -1;
    }

    // Execute query with pagination
    const reservations = await reservationModel
      .find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalCount = await reservationModel.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: reservations.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      data: reservations,
    });
  } catch (error) {
    console.error("Error fetching all reservations:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching all reservations",
      error: error.message,
    });
  }
};

export const getUserReservations = async (req, res) => {
  try {
    // Get user ID from authenticated user
    const userId = req.user._id;

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Base filter - only show this user's reservations
    const filter = { "user.id": userId };

    // Optional status filter
    if (req.query.status) {
      filter.status = req.query.status;
    }

    // Optional book title search
    if (req.query.bookTitle) {
      filter["book.title"] = { $regex: req.query.bookTitle, $options: "i" };
    }

    // Date range filter
    if (req.query.fromDate && req.query.toDate) {
      filter.reservationDate = {
        $gte: new Date(req.query.fromDate),
        $lte: new Date(req.query.toDate),
      };
    }

    // Sort options
    const sortOptions = {};
    if (req.query.sortBy) {
      const sortField = req.query.sortBy;
      const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
      sortOptions[sortField] = sortOrder;
    } else {
      // Default: Active reservations first, then by date (newest first)
      sortOptions.status = 1; // Active first (assuming 'Active' sorts before other statuses)
      sortOptions.reservationDate = -1; // Newest first
    }

    // Execute query with pagination
    const reservations = await reservationModel
      .find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const totalCount = await reservationModel.countDocuments(filter);

    return res.status(200).json({
      success: true,
      count: reservations.length,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      data: reservations,
    });
  } catch (error) {
    console.error("Error fetching user reservations:", error);

    if (error.name === "CastError" && error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error fetching user reservations",
      error: error.message,
    });
  }
};
