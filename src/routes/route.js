const { Router } = require("express");
const { routePost, routeGet } = require("../controllers/route");
const { validateJWT, validateFields, isAdminRole } = require("../middlewares");
const { check } = require("express-validator");
const { isValidObjectId } = require("mongoose");

const router = Router();

router.get("/", [validateJWT, validateFields], routeGet);

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
