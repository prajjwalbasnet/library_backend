import { bookModel } from "../models/bookModel.js";
import { borrowModel } from "../models/borrowModel.js";
import { userModel } from "../models/userModel.js";
import { calculateFine } from "../utils/fineCalculator.js";

export const recordBorrowedBooks = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const book = await bookModel.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book Not found.",
      });
    }

    const user = await userModel.findOne({ email, isActive: true });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not found.",
      });
    }

    if (book.availableCopies === 0) {
      return res.status(400).json({
        success: false,
        message: "Book not available.",
      });
    }

    const isAlreadyBorrowed = user.borrowedBooks.find(
      (b) => b.bookId.toString() === id && b.returned === false
    );

    if (isAlreadyBorrowed) {
      return res.status(400).json({
        success: false,
        message: "Already borrowed.",
      });
    }

    book.availableCopies -= 1;
    book.availability = book.availableCopies > 0;
    await book.save();

    user.borrowedBooks.push({
      bookId: book._id,
      bookTitle: book.title,
      borrowedDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    await user.save();

    const newBorrowRecord = {
      user: {
        id: user._id,
        name: user.name,
        studentId: user.studentId,
        email: user.email,
      },
      book: {
        id: id,
        title: book.title,
      }, // Just the ObjectId, not an object with id and title
      borrowDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };

    // Create the record
    const createdBorrow = await borrowModel.create(newBorrowRecord);
    console.log("Borrow record created:", createdBorrow._id);
  } catch (error) {
    console.error("Error creating borrowed book:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create borrowed book.",
      error: error.message,
    });
  }
};

export const returnBorrowedBooks = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    const book = await bookModel.findById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book Not found.",
      });
    }

    const user = await userModel.findOne({ email, isActive: true });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not found.",
      });
    }

    const borrowedBook = user.borrowedBooks.find(
      (b) => b.bookId.toString() === id && b.returned === false
    );
    
    if (!borrowedBook) {
      return res.status(401).json({
        success: false,
        message: "This user has not borrowed this book",
      });
    }

    borrowedBook.returned = true;
    await user.save();

    book.availableCopies += 1;
    book.availability = book.availableCopies > 0;
    await book.save();

    const borrow = await borrowModel.findOne({
      book: id,
      "user.email": email,
      returnDate: null,
    });
    if (!borrow) {
      return res.status(401).json({
        success: false,
        message: "This user has not borrowed this book",
      });
    }

    borrow.returnDate = new Date();
    const fine = calculateFine(borrow.dueDate);
    borrow.fine = fine;
    await borrow.save();

    res.status(200).json({
      success: true,
      message:
        fine !== 0
          ? `Book returned successfully. You must pay ${fine}$`
          : "Book returned successfully.",
    });
  } catch (error) {
    console.error("Error returning borrowed book:", error);
    res.status(500).json({
      success: false,
      message: "Failed to return borrowed book.",
      error: error.message,
    });
  }
};

export const borrowedBooks = async (req, res) => {
  try {
    const { borrowedBooks } = req.user;

    res.status(200).json({
      success: true,
      borrowedBooks,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getBorrowedBooksForAdmin = async (req, res) => {
  try {
    const borrowedBooks = await borrowModel.find();

    res.status(200).json({
      success: true,
      borrowedBooks,
    });
  } catch (error) {
    console.log(error);
  }
};
