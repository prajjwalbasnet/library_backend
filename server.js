import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import {connectCloudinary} from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import bookRouter from './routes/bookRoute.js'
import { borrowRouter } from './routes/borrowRoute.js'


const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }));

app.get('/', (req,res)=> {
    res.send("API Working")
})


// api endpopints
app.use('/api/user', userRouter)
app.use('/api/book', bookRouter)
app.use('/api/borrow', borrowRouter)



app.listen(port, ()=> {
    console.log(`server started on ${port}.`)
})
