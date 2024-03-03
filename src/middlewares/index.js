const checkBearerToken = require("./check-bearer-token");
const validateFields = require("./validate-fields");
const validateJWT = require("./validate-jwt");
const validateRole = require("./validate-role");

module.exports = {
  ...checkBearerToken,
  ...validateFields,
  ...validateJWT,
  ...validateRole,
};
