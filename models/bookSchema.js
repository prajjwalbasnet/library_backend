import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({

    title: {
        type:String,
        reduired:true,
        trim: true
    },
    author: {
        type:String,
        required: true,
        trim: true
    },
    description: {
        type:String,
        required: true,
    },
    genre: {
        type: String,
        enum: [
          'Fiction', 'Non-Fiction', 'Science Fiction', 
          'Mystery', 'Biography', 'History', 
          'Science', 'Self-Help', 'Technology', 'Business'
        ]
    },
    totalCopies: {
        type:Number,
        required: true,
    },
    availableCopies: {
        type:Number,
    },
    availability: {
        type:Boolean,
        default: true,
    },
    coverImage: {
        url: {
          type: String,
          required: [true, 'Please add a cover image']
        },
        cloudinaryId: {
          type: String,
          required: true
        }    
    }

})

export const bookModel = mongoose.models.books || mongoose.model('books', bookSchema) 