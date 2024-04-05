const multer = require('multer')
const path = require('path')
var appRoot = require('app-root-path')
const fs = require('fs');

// Function to create a hierarchical folder structure based on date
function createImageDirectory(data) {
    const baseDirectory = appRoot + '/src/uploads/comment'; // Your base directory where images will be stored
    const userDirectory = data.nickname; // User-specific directory, change as needed

    const imagePath = path.join(baseDirectory, userDirectory)
    // Create the directory if it doesn't exist
    if (!fs.existsSync(imagePath)) {
        fs.mkdirSync(imagePath, { recursive: true }); // recursive: true creates parent directories if they don't exist
    }

    return imagePath;
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const imageDirectory = createImageDirectory(req.data);
        cb(null, imageDirectory)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));

    }

})
const imageFilter = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
let upload = multer({ storage: storage, fileFilter: imageFilter });
let uploadMultipleFiles = multer({ storage: storage, fileFilter: imageFilter }).array('multiple_images', 3);

module.exports = upload