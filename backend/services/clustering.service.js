import Anthropic from "@anthropic-ai/sdk";
import { anthropicApiKey } from "../.secrets.js";

const client = new Anthropic({
  apiKey: anthropicApiKey,
});

const buildPrompt = (notes) => {
  const notesJson = JSON.stringify(notes, null, 2);

  return `You are an expert at analyzing text for semantic similarity and thematic patterns.

Below is a JSON array of sticky notes. Each note has an "id" and a "text" field. Analyze the "text" field of every note and group them into meaningful thematic clusters.

Return ONLY a valid JSON array with this exact structure — no markdown, no explanation, no extra text:

[
  {
    "label": "Short descriptive theme name",
    "noteIds": ["note_001", "note_002"]
  }
]

Rules:
- Every note must appear in exactly one cluster
- Each cluster must have a concise, descriptive label
- Group by semantic meaning, not by keywords
- Aim for the most natural number of groups given the data

Here are the notes:

${notesJson}`;
};

export const clusterNotes = async (notes) => {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      { role: "user", content: buildPrompt(notes) },
    ],
  });

  const raw = response.content[0].text;
  return JSON.parse(raw);
};
