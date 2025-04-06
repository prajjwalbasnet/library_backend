import { bookModel } from "../models/bookModel.js"
import { borrowModel } from "../models/borrowModel.js"
import { userModel } from '../models/userModel.js'


export const recordBorrowedBooks = async (req, res) => {

    try {
        
        const {id} = req.params 
        const {email} = req.body 

        const book = await bookModel.findById(id)

        if(!book){
            return res.status(404).json({
                success:false,
                message: 'Book Not found.'
            })
        }

        const user = await userModel.findOne({email})

        if(!user){
            return res.status(404).json({
                success:false,
                message: 'User Not found.'
            })
        }

        if(book.availableCopies === 0){
            return res.status(400).json({
                success:false,
                message: 'Book not available.'
            })
        }

        const isAlreadyBorrowed = user.borrowedBooks.find(
            b=> b.bookId.toString() === id && b.returned === false
        )

        if(isAlreadyBorrowed){
            return res.status(400).json({
                success:false,
                message: 'Already borrowed.'
            })
        }

        book.availableCopies -= 1
        book.availability = book.availableCopies > 0 
        await book.save()

        user.borrowedBooks.push({
            bookId: book._id,
            bookTitle: book.title ,
            borrowedDate: new Date(),
            dueDate: new Date(Date.now() + 7*24*60*60*1000)
        })

        await user.save()

        const newBorrowRecord = {
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            },
            book: book._id,  // Just the ObjectId, not an object with id and title
            borrowDate: new Date(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        };        
          
          // For debugging
          console.log("Creating borrow record:", newBorrowRecord);
          
          // Create the record
          const createdBorrow = await borrowModel.create(newBorrowRecord);
          console.log("Borrow record created:", createdBorrow._id);
          
          

    } catch (error) {
        console.error('Error creating borrowed book:', error);
        res.status(500).json({
        success: false,
        message: 'Failed to create borrowed book.',
        error: error.message
        });
    }

}

export const borrowedBooks = async (req, res) => {

}

export const getBorrowedBooks = async (req, res) => {

}

export const returnBorrowedBooks = async (req, res) => {

}

