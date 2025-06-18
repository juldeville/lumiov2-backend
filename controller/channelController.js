const API_KEY = process.env.YT_API_KEY;

async function getChannelInfo(req, res) {
  try {
    if (!req.params.id) {
      return res.json({ result: false, error: "missing channel ID" });
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${req.params.id}&key=${API_KEY}`
    );

    const data = await response.json();

    if (data.pageInfo.totalResults === 0) {
      return res.json({ result: false, error: "No results found" });
    }
    const item = data.items[0];
    const channelInfo = {
      id: item.id,
      name: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      customUrl: item.snippet.customUrl,
      country: item.snippet.country,
      subscribers: item.statistics.subscriberCount,
      totalViews: item.statistics.viewCount,
      videoCount: item.statistics.videoCount,
    };
    return res.json({ result: true, channelInfo });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
}

module.exports = { getChannelInfo };
