import express from 'express'
import { recordBorrowedBooks } from '../controllers/borrowController.js'

export const borrowRouter = express.Router()

borrowRouter.post('/record/:id', recordBorrowedBooks)