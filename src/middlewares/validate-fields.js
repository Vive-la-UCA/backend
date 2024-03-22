const { validationResult } = require("express-validator");

const validateFields = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // If there's an error, delete the uploaded image
    if (req.file) {
      fs.unlinkSync(req.file.path); // Delete the uploaded file
    }
    return res.status(400).json(errors);
  }

  next();
};

module.exports = {
  validateFields,
};
