import jwt from 'jsonwebtoken'
import { userModel } from '../models/userModel.js'

const authMiddleware = async (req, res, next) => {

    try {
        
        const token = req.header('Authorization')?.replace('Bearer', '')

        if(!token){
            return res.status(401).json({
                success: false,
                message: 'No token, authorization denied'
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await userModel.findOne({
            _id: decoded.id,
            isActive: true
        })

        if(!user){
            return res.status(401).json({ 
                success: false, 
                message: 'User not found' 
              });
        }

        req.token = token
        req.user = user

        next()

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token' 
            });
            }
            
            if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Token expired' 
            });
            }

            res.status(500).json({ 
            success: false, 
            message: 'Server error during authentication' 
        });

    }
}

export default authMiddleware