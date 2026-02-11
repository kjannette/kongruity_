import Anthropic from "@anthropic-ai/sdk";
import anthropicApiKey from "../.secrets";

const client = new Anthropic({
  apiKey: anthropicApiKey 
});

const prompt = `You are a helpful assistant that analyzes notes for semantic similarity. Each note is a json object with the 
various attributes. For clustering purposes, the relvant attribute is "text". Analze the text attributes of the notes and return a json object with the following structure: {{$notes}}`;

export const clusterNotes = async (notes) => {
  const response = await client.messages.create({
  model: "claude-opus-4-6",
    messages: [
      { role: "user", content: `${prompt}`}
    ]
  });
  return response.content[0].text;
};