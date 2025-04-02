import express from 'express'
import { loginUser, logoutUser, registerUser, resendVerificationCode, verifyEmail } from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/verify', verifyEmail)
userRouter.post('/resend-verification', resendVerificationCode)
userRouter.post('/login', loginUser)
userRouter.post('/logout', logoutUser)

export default userRouter