const { Router } = require("express");
const { check } = require("express-validator");
const { login, loginGoogle, checkToken } = require("../controllers/auth");
const {
  validateFields,
  checkBearerToken,
  validateJWT,
} = require("../middlewares");
const { usersPost } = require("../controllers/user");

const router = Router();

router.post(
  "/login",
  [
    check("email", "Enter a valid email").isEmail(),
    check("password", "Password is required").not().isEmpty(),
    validateFields,
  ],
  login
);

router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Enter a valid email").isEmail(),
    check("password", "Password is required").not().isEmpty(),
    validateFields,
  ],
  usersPost
);

router.post("/google", [checkBearerToken, validateFields], loginGoogle);

router.get("/check-token", [validateJWT, validateFields], checkToken);

module.exports = router;
