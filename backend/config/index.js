import dotenv from 'dotenv';

dotenv.config({ path: '.secrets' });

const config = {
  port: process.env.PORT || 3001,
  openaiApiKey: process.env.OPENAI_API_KEY,
};

export default config;
