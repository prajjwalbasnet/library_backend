import express from 'express'
import {addBook,getAllBooks} from '../controllers/bookController.js'
import upload from '../middlewares/multer.js'

const bookRouter = express.Router()

bookRouter.post('/addBook', upload.single('coverImage'), addBook)
bookRouter.get('/getAll', getAllBooks)


export default bookRouter