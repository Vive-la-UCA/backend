const { Router } = require("express");
const { check } = require("express-validator");
const { login, loginGoogle } = require("../controllers/auth");
const { validateFields, checkBearerToken } = require("../middlewares");

const router = Router();

router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password is required").not().isEmpty(),
    validateFields,
  ],
  login
);

router.post("/google", [checkBearerToken, validateFields], loginGoogle);

module.exports = router;
