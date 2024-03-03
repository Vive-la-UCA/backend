const { Router } = require("express");
const { routePost, routeGet } = require("../controllers/route");
const { validateJWT, validateFields, isAdminRole } = require("../middlewares");
const { check } = require("express-validator");

const router = Router();

router.get("/", [validateJWT, validateFields], routeGet);

router.post(
  "/",

  [
    check("name", "name is required").not().isEmpty(),
    check("locations", "locations are required")
      .isArray()
      .withMessage("locations must be an array of strings"),
    validateJWT,
    isAdminRole,
    validateFields,
  ],
  routePost
);

module.exports = router;
