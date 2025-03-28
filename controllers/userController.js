import jwt from "jsonwebtoken"
import { userModel } from "../models/userModel.js"
import bcrypt from 'bcrypt'


//---generate verification code
const generateVerificationCode = () => {
    return Math.floor( 10000 + Math.random()*90000)
}

//-----generate Token------
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn : '1d'
    })
}

export  const registerUser = async (req, res) => {

    try {

        const {name, email, password, studentId} = req.body

        // validate required fields
        if (!name || !email || !password || !studentID){
            return res.status(400).json({success:false, message: 'Missing required field'})
        }

        // check if user exists
        const userExists = await userModel.findOne({
            $or: [
                {email},
                {studentId}
            ]
        })
        if (userExists){
            return res.status(400).json({success:false, message:'User with this email or student ID already exists'})
        }

        if (password.length < 8 || password.length > 16){
            return res.json({success:false, message:'Plassword must be between 8 to 16 characters.'})
        }
        // hash password --------
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        
        const verificationCode = generateVerificationCode()
        const verificationCodeExpire = new Date(Date.now()+ 5*60*1000)

        // ---------Create User----------
        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
            studentId,
            verificationCode,
            verificationCodeExpire
        })

        const user = await newUser.save()
        const token =  generateToken(user._id)

        res.status(201).json({
            success:true, token
        })

    } catch (error) {
        console.log('Registration error', error)
        res.status(500).json({
            success:false, error
        })
        
    }
    
}
