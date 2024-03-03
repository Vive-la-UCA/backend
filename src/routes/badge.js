const { Router } = require("express");
const { badgeGet, badgePost, badgeGetOne } = require("../controllers/badge");
const { validateJWT, validateFields, isAdminRole } = require("../middlewares");
const { check } = require("express-validator");
const { badgeExistsById } = require("../helpers");

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

router.post(
  "/",
  [
    check("name", "name is required").not().isEmpty(),
    check("route", "Invalid route").isMongoId(),
    validateJWT,
    isAdminRole,
    validateFields,
  ],
  badgePost
);

module.exports = router;
