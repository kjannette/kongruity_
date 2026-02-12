import app from './app.js';
import config from './config/index.js';

const PORT = config.port || 3001;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});