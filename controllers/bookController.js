import express from 'express'
import { cloudinary, uploadToCloudinary } from '../config/cloudinary.js'
import { bookModel } from '../models/bookSchema.js'


export const addBook = async (req, res) => {
    
    try {
        
        const { title, author, description, genre, totalCopies, } = req.body 

        if(!req.file){
            return res.status(400).json({
                success:false,
                message: 'Pleased upload the cover image'
            })
        }

        const result = await uploadToCloudinary(req.file.buffer, {
            public_id: `books/${Date.now()}-${req.file.originalname.split('.')[0]}`
        })

        const book = new bookModel({
            title,
            author,
            description,
            genre,
            totalCopies,
            coverImage: {
              url: result.secure_url,
              cloudinaryId: result.public_id
            }
          });
      
          // Save book to database
          const savedBook = await book.save();

          return res.status(201).json({
            success: true,
            data: savedBook,
            message: "Books added successfully"
          });
      

    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({
        success: false,
        message: 'Failed to create book',
        error: error.message
        });
    }
}

export const getAllBooks = async(req, res) => {

    const allBooks = await bookModel.find({})
    return res.status(200).json({
        success:true,
        data: allBooks
    })
}

export const updateBook = async (req, res) => {
    try {
        const {id} = req.params
        const { title, author, description, genre, totalCopies } = req.body;

        const book = await bookModel.findById(id)

        if(!book){
            return res.status(404).json({
                success: false,
                message: 'Book not found'
              });
        }

        const updateData = {
            title,
            author,
            description,
            genre,
            totalCopies
        }

        if(req.file){
            if (book.coverImage && book.coverImage.cloudinaryId){
                await cloudinary.uploader.destroy(book.coverImage.cloudinaryId)
            }

            const result = await uploadToCloudinary(req.file.buffer, {
                public_id: `books/${Date.now()}-${req.file.originalname.split('.')[0]}`
            })

            updateData.coverImage = {
                url: result.secure_url,
                cloudinaryId: result.public_id
            }
        }

        const updatedBook = await bookModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )


        return res.status(200).json({
            success: true,
            data: updatedBook,
            message: "Book updated successfully"
        })
      
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to update book',
          error: error.message
        });
    }
}

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params
    
    // Find the book to get the cloudinary image ID
    const book = await bookModel.findById(id)
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      })
    }

    // Delete image from cloudinary if it exists
    if (book.coverImage && book.coverImage.cloudinaryId) {
      await cloudinary.uploader.destroy(book.coverImage.cloudinaryId)
    }

    // Delete the book
    await book.deleteOne()

    return res.status(200).json({
      success: true,
      message: "Book deleted successfully"
    })
    
  } catch (error) {
    console.error('Error deleting book:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to delete book',
      error: error.message
    })
  }
}