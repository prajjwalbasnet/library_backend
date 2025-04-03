import multer from "multer";

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {

    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error('Only image files are allowed!'), false)
    }
    cb(null, true)
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 
    },
    fileFilter: fileFilter
})

export default upload