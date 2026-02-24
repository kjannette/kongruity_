import { VoyageAIClient } from "voyageai";

const client = new VoyageAIClient({
  apiKey: process.env.VOYAGEAI_API_KEY,
});

/**
 * @param {Array<{id: string, text: string}>} notes
 * @returns {Promise<Map<string, number[]>>} noteId → embedding vector
 */
export const embedNotes = async (notes) => {
  const texts = notes.map((n) => n.text);

  const response = await client.embed({
    input: texts,
    model: "voyage-3-lite",
  });

  const embeddingMap = new Map();
  response.data.forEach((item, i) => {
    embeddingMap.set(notes[i].id, item.embedding);
  });

  return embeddingMap;
};
