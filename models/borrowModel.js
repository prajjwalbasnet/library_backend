import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    user : {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'books',
        required: true
    },
    fine: {
        type: Number,
        default: 0
    },
    borrowDate : {
        type: Date,
        required: true
    },
    dueDate : {
        type: Date,
        required: true
    },
    returnDate : {
        type: Date,
    },
    returned: {
        type: Boolean,
        default: false
    },
    notified: {
        type: Boolean,
        default: false
    }
}, 
{timestamps: true})

export const borrowModel = mongoose.models.borrow || mongoose.model('borrow', bookSchema)