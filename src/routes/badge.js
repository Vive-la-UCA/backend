const { Router } = require("express");
const {
  badgeGet,
  badgePost,
  badgeGetOne,
  badgePut,
} = require("../controllers/badge");
const { validateJWT, validateFields, isAdminRole } = require("../middlewares");
const { check } = require("express-validator");
const { badgeExistsById } = require("../helpers");
const { upload } = require("../middlewares/multer-file");

const router = Router();

// Get All Badges
router.get("/", [validateJWT, validateFields], badgeGet);

// Get One Badge
router.get(
  "/:id",
  [
    check("id", "Invalid id").isMongoId(),
    check("id").custom(badgeExistsById),
    validateJWT,
    validateFields,
  ],
  badgeGetOne
);

// Create Badge
router.post(
  "/",
  [
    validateJWT,
    upload.single("image"),
    check("name", "name is required").not().isEmpty(),
    check("route", "Invalid route").isMongoId(),
    isAdminRole,
    validateFields,
  ],
  badgePost
);

router.put(
  "/:id",
  [
    validateJWT,
    upload.single("image"),
    check("id", "Invalid id").isMongoId(),
    check("id").custom(badgeExistsById),
    check("name", "name is required").not().isEmpty(),
    check("route", "Invalid route").isMongoId(),
    isAdminRole,
    validateFields,
  ],
  badgePut
);

module.exports = router;
