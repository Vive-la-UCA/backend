const { Router } = require("express");
const { locationPost, locationGet } = require("../controllers/location");
const { validateJWT, validateFields, isAdminRole } = require("../middlewares");
const { check } = require("express-validator");

const router = Router();

router.get("/", [validateJWT, validateFields], locationGet);

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
