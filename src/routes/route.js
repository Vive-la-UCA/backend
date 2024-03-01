const { Router } = require("express");
const { routePost, routeGet } = require("../controllers/route");

const router = Router();

router.get("/", routeGet);

router.post("/", routePost);

module.exports = router;
