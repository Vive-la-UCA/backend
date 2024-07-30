const multer = require('multer')

// Configure storage for uploaded files
const storage = multer.diskStorage({
  // Set the destination directory for uploaded files
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // 'uploads/' is the directory where files will be stored
  },
  // Set the filename for uploaded files
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    // Generate a unique filename using the current timestamp and a random number
    cb(null, file.fieldname + '-' + uniqueSuffix + '.png')
  }
})
// Create an upload middleware instance with the storage configuration
const upload = multer({ storage: storage })

module.exports = {
  upload
}
