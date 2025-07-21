const popularVids = require("../mockData/flow1/popularVids.json");
const popularByCategory = require("../mockData/flow1/popularByCategory.json");
const {
  generateSubcategoryPrompt,
} = require("../modules/services/openAi/prompts/generateSubcategoryPrompt");
const { queryOpenAI } = require("../modules/services/openAi/openAiApi");
const {
  searchVideoIds,
  getVideoData,
  fetchPopular,
} = require("../modules/services/youtube/youtubeApi");
const { generateTrendPrompt } = require("../modules/services/openAi/prompts/generateTrendPrompt");
const { formatYoutubeVideo } = require("../modules/utils/formatYoutubeVideo");

async function getPopularVids(req, res) {
  console.log("yo");
  try {
    if (req.query.categories) {
      return res.json({ data: popularByCategory });
    }
    console.log("Calling YouTube API for /videos/popular...");

    const popularVideos = await fetchPopular();
    const formattedVideos = popularVideos.map(formatYoutubeVideo); // ← works perfectly
    res.json({ videos: formattedVideos });
  } catch (err) {
    res.json({ result: false, err: err.message });
  }
}
async function getSubcategories(req, res) {
  try {
    const prompt = generateSubcategoryPrompt(req.body.topCategoryData);
    const { subcategories: subCategories } = await queryOpenAI(prompt);
    res.json({ result: true, subCategories });
  } catch (err) {
    res.json({ result: false, error: err.message });
  }
}

async function getTrends(req, res) {
  try {
    const subcategoryPrompt = generateSubcategoryPrompt(req.body.topCategoryData);
    const { subcategories: subCategories } = await queryOpenAI(subcategoryPrompt);
    console.log("subcategories are", subCategories);
    const videoDataBySubcategory = await Promise.all(
      subCategories.map(async (subCategory) => {
        const ids = await searchVideoIds(subCategory);
        const videos = await getVideoData(ids);
        return { subCategory, videos };
      })
    );
    const trendPrompt = generateTrendPrompt(videoDataBySubcategory);
    const trends = await queryOpenAI(trendPrompt);
    const enrichedTrends = trends.map(({ subCategory, topics }) => {
      const entry = videoDataBySubcategory.find(
        (v) => v.subCategory.trim().toLowerCase() === subCategory.trim().toLowerCase()
      );
      return {
        subCategory,
        topics,
        videos: entry?.videos || [],
      };
    });

    res.json({ trends: enrichedTrends });
  } catch (err) {
    console.error("Trend extraction failed:", err.message);
    res.status(500).json({ result: false, error: err.message });
  }
}
module.exports = { getPopularVids, getSubcategories, getTrends };
