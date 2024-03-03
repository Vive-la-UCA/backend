const { Router } = require("express");
const { routePost, routeGet, routeGetOne } = require("../controllers/route");
const { validateJWT, validateFields, isAdminRole } = require("../middlewares");
const { check } = require("express-validator");
const { isValidObjectId } = require("mongoose");
const { routeExistsById } = require("../helpers");

const router = Router();

// Get All Routes
router.get("/", [validateJWT, validateFields], routeGet);

// Get One Route
router.get(
  "/:id",
  [
    check("id", "Invalid id").isMongoId(),
    check("id").custom(routeExistsById),
    validateJWT,
    validateFields,
  ],
  routeGetOne
);

// Create Route
router.post(
  "/",

  [
    check("name", "name is required").not().isEmpty(),
    check("locations", "locations are required")
      .isArray()
      .custom((location) => location.every(isValidObjectId))
      .withMessage("check locations are valid ObjectId's"),
    validateJWT,
    isAdminRole,
    validateFields,
  ],
  routePost
);

module.exports = router;
