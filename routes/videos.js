var express = require("express");
var router = express.Router();
const { getPopularVids } = require("../controller/videosController");

router.get("/popular", getPopularVids);

router.post("/subcategories");

module.exports = router;
