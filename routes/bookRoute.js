import express from 'express'
import { addBook, deleteBook, getAllBooks, updateBook } from '../controllers/bookController.js'
import upload from '../middlewares/multer.js'

const bookRouter = express.Router()

bookRouter.post('/addBook', upload.single('coverImage'), addBook)
bookRouter.get('/getAll', getAllBooks)
bookRouter.delete('/delete/:id', deleteBook)
bookRouter.put('/update/:id', upload.single('coverImage'), updateBook);


export default bookRouter