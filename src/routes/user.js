const { Router } = require("express");
const { usersPost, usersGet, usersGetOne } = require("../controllers/user");
const { check } = require("express-validator");
const { emailExists, userExistsById } = require("../helpers");
const { validateFields, validateJWT } = require("../middlewares");

const router = Router();

// Get All Users
router.get("/", [validateJWT, validateFields], usersGet);

// Get One User
router.get(
  "/:id",
  [
    check("id", "Invalid id").isMongoId(),
    check("id").custom(userExistsById),
    validateJWT,
    validateFields,
  ],
  usersGetOne
);

// Create User
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is required").isEmail(),
    check("email").custom(emailExists),
    check(
      "password",
      "Password is required and greater than 8 digits"
    ).isLength({ min: 8 }),
    validateFields,
  ],
  usersPost
);

module.exports = router;
