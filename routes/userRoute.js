import express from 'express'
import { registerUser, resendVerificationCode, verifyEmail } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/verify', verifyEmail)
userRouter.post('/resend-verification', resendVerificationCode)

export default userRouter