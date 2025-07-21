var express = require("express");
var router = express.Router();
const { getPopularVids, getSubcategories, getTrends } = require("../controller/videosController");
const { checkBody } = require("../middleware/checkBody");

router.get("/popular", getPopularVids);
router.post("/subcategories", checkBody(["topCategoryData"]), getSubcategories);
router.post("/trends", checkBody(["topCategoryData"]), getTrends);

module.exports = router;
