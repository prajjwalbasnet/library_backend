import express from 'express'
import { loginUser, logoutUser, registerUser, resendVerificationCode, verifyEmail } from '../controllers/userController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/verify', verifyEmail)
userRouter.post('/resend-verification', resendVerificationCode)
userRouter.post('/login', loginUser)
userRouter.post('/logout', authMiddleware ,logoutUser)

export default userRouter