function generateTrendPrompt(videoDataBySubcategory) {
  const promptSections = videoDataBySubcategory.map(({ subCategory, videos }) => {
    const formatted = videos
      .map((video, i) => {
        const title = video.snippet?.title || "(no title)";
        const tags = video.snippet?.tags?.join(", ") || "(none)";
        const description = video.snippet?.description?.trim() || "(none)";
        return `${
          i + 1
        }. **Title:** "${title}"\n   **Tags:** ${tags}\n   **Description:** "${description}"`;
      })
      .join("\n\n");

    return `### Subcategory: ${subCategory}\n\n${formatted}`;
  });

  return `
You are a trend analysis assistant. Analyze the following YouTube video data grouped by subcategory.

For each subcategory:
- Identify the **top 3 to 5 trending topics** that are mentioned or implied across titles, tags, and descriptions.
- Topics should be specific (e.g., "NBA Playoffs", not just "Basketball").

### Output Format:
Return an array of objects like:
[
  {
    "subCategory": "Other",
    "topics": ["Kai Cenat Reactions", "AMP Guest Moments", "Funny Edits"]
  },
  {
    "subCategory": "Entertainment",
    "topics": ["Lisa BLACKPINK", "Reaction Mashups", "Teasing Moments"]
  }
]

### Subcategory Data:
${promptSections.join("\n\n")}
`;
}

module.exports = { generateTrendPrompt };
