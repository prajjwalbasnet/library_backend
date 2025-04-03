import express from 'express'
import { uploadToCloudinary } from '../config/cloudinary.js'
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