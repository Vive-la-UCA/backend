const { Router } = require("express");
const { locationPost, locationGet } = require("../controllers/location");

const router = Router();

router.get("/", locationGet);

router.post("/", locationPost);

module.exports = router;
