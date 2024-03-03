const { Router } = require("express");
const { usersPost, usersGet } = require("../controllers/user");
const { check } = require("express-validator");
const { emailExists } = require("../helpers");
const { validateFields, validateJWT } = require("../middlewares");

const router = Router();

router.get("/", [validateJWT, validateFields], usersGet);

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
