async function extractSubcategories(prompt, retries = 3, delay = 1000) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          console.warn(`Rate limit encountered. Retrying in ${delay}ms... (Attempt ${attempt + 1}/${retries})`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          delay *= 2; // Double the delay each retry
          continue;
        } else {
          throw new Error(`HTTP Error: ${response.status}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (attempt === retries - 1) {
        console.error("Final attempt failed:", error);
        throw error;
      }
      console.warn(`Attempt ${attempt + 1} failed: ${error.message}. Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}
