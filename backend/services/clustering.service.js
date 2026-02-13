import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const buildPrompt = (notes) => {
  const notesJson = JSON.stringify(notes, null, 2);

  return `You are an expert at analyzing text for semantic similarity and thematic patterns.

Below is a JSON array of sticky notes. Each note has an "id" and a "text" field. Analyze the "text" field of every note and group them into meaningful thematic clusters.

For each cluster, return ONLY a valid JSON array with the below exact structure — no markdown, no explanation, no extra text - where the value for the "label" key is a name you create to describe the cluster's theme and the value for the "noteIds" key is an array containing the Ids of the notes that fit into that cluster theme.

[
  {
    "label": "Short descriptive theme name for cluster",
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
