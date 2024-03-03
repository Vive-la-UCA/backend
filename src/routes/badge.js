const { Router } = require("express");
const { badgeGet, badgePost } = require("../controllers/badge");
const { validateJWT, validateFields, isAdminRole } = require("../middlewares");
const { check } = require("express-validator");
const { routeExistsById } = require("../helpers");

const router = Router();

router.get("/", [validateJWT, validateFields], badgeGet);
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
