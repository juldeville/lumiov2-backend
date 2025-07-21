function formatYoutubeVideo(video) {
  const snippet = video.snippet || {};
  const statistics = video.statistics || {};
  const thumbnails = snippet.thumbnails || {};
  const contentDetails = video.contentDetails || {};

  return {
    title: snippet.title || "Untitled",
    publishedDate: snippet.publishedAt || null,
    videoId: video.id,
    tags: snippet.tags || [],
    thumbnail: {
      url: thumbnails.medium?.url || "",
      width: thumbnails.medium?.width || 0,
      height: thumbnails.medium?.height || 0,
    },
    channel: {
      channelId: snippet.channelId || "",
      channelName: snippet.channelTitle || "",
    },
    statistics: {
      viewCount: Number(statistics.viewCount || 0),
      likeCount: Number(statistics.likeCount || 0),
      commentCount: Number(statistics.commentCount || 0),
    },
    contentDetails: {
      duration: contentDetails.duration || "",
      category: Number(snippet.categoryId || 0),
    },
  };
}

module.exports = { formatYoutubeVideo };
