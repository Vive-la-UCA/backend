const { Router } = require("express");
const { testGet } = require("../controllers/test");

const router = Router();

router.get("/", testGet);

module.exports = router;
