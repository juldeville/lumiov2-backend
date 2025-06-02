const popularVids = require("../mockData/flow1/popularVids.json");
const popularByCategory = require("../mockData/flow1/popularByCategory.json");
function getPopularVids(req, res) {
  try {
    if (req.query.categories) {
      return res.json({ data: popularByCategory });
    }
    res.json({ videos: popularVids.videos });
  } catch (err) {
    res.json({ result: false, err: err.message });
  }
}

function getSubcategories(req, res) {
  try {
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
}

module.exports = { getPopularVids };
