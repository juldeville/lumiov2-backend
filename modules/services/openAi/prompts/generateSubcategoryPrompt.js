function generateSubcategoryPrompt(videos) {
  const formattedVideos = videos
    .map((video, index) => {
      const tags = video.tags?.length ? video.tags.join(", ") : "(none)";
      const description = video.description?.trim() || "(none)";
      return `${index + 1}. **Title:** "${video.title}"\n   **Tags:** ${tags}\n   **Description:** "${description}"`;
    })
    .join("\n\n");

  const prompt = `
You are a categorization assistant. Given a list of YouTube video details from a specific category, determine the **top 4 most relevant subcategories** based on recurring themes in the titles, tags, and descriptions.

### **Instructions:**
- Identify dominant subcategories based on recurring words, topics, and context.
- Choose from relevant subcategories for **${videos[0].categoryName}**, such as:
  - **Football (Soccer)**
  - **Basketball**
  - **Tennis**
  - **Martial Arts (MMA, Boxing, UFC)**
  - **Extreme Sports (Skateboarding, BMX, Parkour)**
  - **Track & Field (Olympics, Running, Sprinting)**
  - **Esports (FIFA, NBA 2K, Madden, etc.)**
  - **Other (if applicable, specify)**

### **Video Data:**
${formattedVideos}

**Based on these video details, list the top 4 subcategories that best represent the recurring themes in the dataset.**

**Output Format (JSON) WITHOUT code block or formatting:**
{
  "subcategories": ["Subcategory 1", "Subcategory 2", "Subcategory 3", "Subcategory 4"]
}
`;

  return prompt;
}
