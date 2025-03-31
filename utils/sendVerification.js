import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
    
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})

export const sendVerification = async (email, verificationCode, name) => {

    try {
        
        const mailOptions = {
            from: `"CIHE-Library" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'CIHE-Library - Verify Your Email.',
            html : `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
                <h2 style="color: #1e40af; text-align: center;">CIHE Library Account Verification</h2>
                <p>Hello ${name},</p>
                <p>Thank you for registering with the CIHE Library System. Please use the verification code below to complete your registration:</p>
                <div style="background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
                    ${verificationCode}
                </div>
                <p>This code will expire in 5 minutes.</p>
                <p>If you did not request this verification, please ignore this email.</p>
                <p>Regards,<br>CIHE Library Team</p>
            </div>
            `
        }
        const info = await transporter.sendMail(mailOptions)
        console.log(`Verification email sent`)
        return true
    } catch (error) {
        console.log(`Error sending verification email: `, error)
        return false
    }
}

