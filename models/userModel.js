import mongoose from "mongoose";

const userSchema = mongoose.Schema({

    name: {type: String, required:true},
    studentId: {type: String, required:true, unique:true},
    email: {type: String, required:true, unique:true},
    password: {type: String, required:true, select:false},
    isActive: {type:Boolean, default:false},
    role: {type: String, enum:['Admin', 'User'], default: 'User'},
    borrowedBooks: [{
        bookId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Borrow',
        },
        returned: {
            type:Boolean,
            default: false
        },
        bookTitle: String,
        borrowedDate : Date,
        dueDate : Date
    }],
    verificationCode: Number,
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,


}, {minimize:false}, {timestamp:true})

export const userModel = mongoose.models.user || mongoose.model('user', userSchema) 