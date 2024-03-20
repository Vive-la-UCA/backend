const { Router } = require("express");
const {
  locationPost,
  locationGet,
  locationGetOne,
} = require("../controllers/location");
const { validateJWT, validateFields, isAdminRole } = require("../middlewares");
const { check } = require("express-validator");
const { locationExistsById } = require("../helpers");
const { upload } = require("../middlewares/multer-file");

const router = Router();

// Get All Locations
router.get("/", [validateJWT, validateFields], locationGet);

// Get One Location
router.get(
  "/:id",
  [
    check("id", "Invalid id").isMongoId(),
    check("id").custom(locationExistsById),
    validateJWT,
    validateFields,
  ],
  locationGetOne
);

// Create Location
router.post(
  "/",
  [
    validateJWT,
    upload.single("image"),
    check("name", "name is required").not().isEmpty(),
    check("latitude", "latitude is required").not().isEmpty(),
    check("longitude", "longitude is required").not().isEmpty(),
    isAdminRole,
    validateFields,
  ],
  locationPost
);

module.exports = router;
