var express = require("express");
var router = express.Router();
const popularVids = require("../mockData/flow1/popularVids.json");
const USE_MOCKS = true;

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

module.exports = router;
