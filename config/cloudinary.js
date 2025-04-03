// config/cloudinary.js
import {v2 as cloudinary} from 'cloudinary'
import { Readable } from 'stream'

export const connectCloudinary = async() => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY,
    })
}

export const uploadToCloudinary = (buffer, options={}) => {
    return new Promise((resolve, reject) => {
        const stream = Readable.from(buffer)

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'CiheLibrary',
                ...options
            },
            (error, result) => {
                if (error) return reject(error)
                return resolve(result)
            }
        )
        stream.pipe(uploadStream)
    })
}

export {cloudinary}