const checkBearerToken = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ msg: "Bearer Token not provided or in the correct format" });
  }

  const token = authHeader.split(" ")[1];
  req.token = token;

  next();
};

module.exports = {
  checkBearerToken,
};
