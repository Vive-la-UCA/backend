const { Router } = require("express");
const {
  locationPost,
  locationGet,
  locationGetOne,
} = require("../controllers/location");
const { validateJWT, validateFields, isAdminRole } = require("../middlewares");
const { check } = require("express-validator");
const { locationExistsById } = require("../helpers");

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
    check("name", "name is required").not().isEmpty(),
    check("coordinates", "coordinates are required").isArray(),
    validateJWT,
    isAdminRole,
    validateFields,
  ],
  locationPost
);

module.exports = router;
