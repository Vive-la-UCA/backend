const checkBearerToken = require("./check-bearer-token");
const validateFields = require("./validate-fields");
const validateJWT = require("./validate-jwt");

module.exports = {
  ...checkBearerToken,
  ...validateFields,
  ...validateJWT,
};
