var express = require("express");
const { getChannelInfo } = require("../controller/channelController");
var router = express.Router();

router.get("/:id", getChannelInfo);

module.exports = router;
