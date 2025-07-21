const { search } = require("../../../routes/videos");

const apiKey = process.env.YT_API_KEY;

async function fetchPopular(extraParams = "", maxVideos = 30) {
  let videos = [];
  let fetchCount = 0;
  let nextPageToken = "";
  const ytVideoUrl = "https://www.googleapis.com/youtube/v3/videos";

  while (videos.length < maxVideos && fetchCount < 5) {
    const fullUrl = `${ytVideoUrl}?key=${apiKey}&chart=mostPopular&maxResults=${maxVideos}&part=snippet,statistics,contentDetails&regionCode=US&pageToken=${nextPageToken}${extraParams}`;
    try {
      const response = await fetch(fullUrl);
      const data = await response.json();
      if (data.error) {
        console.error("YouTube API Error:", data.error);
        if (data.error.errors[0].reason === "quotaExceeded") {
          return []; // Return empty to avoid crashing
        }
        throw new Error(data.error.message);
      }

      if (!data.items || data.items.length === 0) break;

      videos = [...videos, ...data.items];
      nextPageToken = data.nextPageToken || "";

      if (videos.length >= maxVideos) break;
      fetchCount++;
      if (!nextPageToken) break;
    } catch (err) {
      console.error("FetchVideos crashed:", err.message);
      return [];
    }
  }

  return videos.slice(0, maxVideos);
}

async function searchVideoIds(query, maxVideos = 5, extraParams = "") {
  let results = [];
  let nextPageToken = "";
  let fetchCount = 0;

  while (results.length < maxVideos && fetchCount < 5) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${maxVideos}&q=${encodeURIComponent(
      query
    )}&key=${apiKey}&regionCode=US&hl=en${extraParams}&pageToken=${nextPageToken}`;

    const res = await fetch(url);
    const data = await res.json();
    if (data.error) {
      console.error("YouTube Search Error:", data.error);
      break;
    }

    results.push(...(data.items || []));
    nextPageToken = data.nextPageToken || "";
    fetchCount++;
    if (!nextPageToken) break;
  }

  return results.map((item) => item.id?.videoId).filter(Boolean);
}

async function getVideoData(videoIds) {
  if (!videoIds.length) return [];

  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds.join(
    ","
  )}&key=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.error) {
    console.error("YouTube Video Detail Error:", data.error);
    return [];
  }

  return data.items || [];
}

module.exports = { fetchPopular, searchVideoIds, getVideoData };
