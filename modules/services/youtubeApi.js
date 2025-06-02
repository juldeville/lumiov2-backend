async function fetchVideos(extraParams = "", maxVideos = 30) {
  const apiKey = process.env.YT_API_KEY;
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
