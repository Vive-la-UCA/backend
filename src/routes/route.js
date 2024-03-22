const { Router } = require("express");
const { routePost, routeGet, routeGetOne } = require("../controllers/route");
const { validateJWT, validateFields, isAdminRole } = require("../middlewares");
const { check } = require("express-validator");
const { isValidObjectId } = require("mongoose");
const { routeExistsById } = require("../helpers");
const { upload } = require("../middlewares/multer-file");

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
    validateJWT,
    upload.single("image"),
    check("name", "name is required").not().isEmpty(),
    isAdminRole,
    validateFields,
  ],
  routePost
);

module.exports = router;
