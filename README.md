# kongruity app

kongruity employs Large Language Model ("LLM") semantic grouping functionality to cluster large volumes of "to dos" or issue tags in development (or other) settings, according to thematic or topical similarity.

(To learn more about this topic, see, e.g., [Kozlowski A., Boutyline A., Semantic Structure in Large Language Model Embeddings Aug. 2025, arXiv:2508.10003v1:04 Aug 2025](https://arxiv.org/html/2508.10003v1)).

In the world of kongruity, these "to dos" are called "sticky notes."  kongruity's React/Vite UI views a board of seemingly chaotic "sticky notes".  But with one click, they are transformed into manageable, actionable groups, each with a header that explains the group semantic interrelation.

The backend is an Express API that serves "sticky note" data and proxies semantic grouping requests to Antrhopic Claude.  

Developers may feel free to install other LLM SDKs and alter the syntax at backend/services/clustering.service.js to experiment with any LLM model/platform they prefer.

## Prerequisites

- Node.js (v18 or later recommended)
- An [Anthropic API key](https://console.anthropic.com/)

## Setup

### 1. Unzip the project

```bash
unzip kongruity.zip
cd kongruity
```

### 2. Create an environment file

The backend expects a `.env` file containing an Anthropic API key in the root `backend/` directory. This file is git-ignored and must be created manually:

```bash
echo 'ANTHROPIC_API_KEY=<your Anthropic API key>' > backend/.env
```

Replace `<your Anthropic API key>` with your actual key.

### 3. Install dependencies

```bash
cd backend
npm install
```

```bash
cd frontend
npm install
```

## Run the app

### Start the backend - Production Mode

From the `backend/` directory:

```bash
npm run start
```

The API server starts on **http://localhost:3001** (configurable via the `PORT` environment variable).

### Start the backend - Development mode

To start using Nodemon for "hot reloads," if developing your own features:

```bash
npm run dev
```

### Build the frontend - Production mode

From the `frontend/` directory:

```bash
npm run build
```

### Start the frontend - Development mode

From the `frontend/` directory:

```bash
npm run dev
```
The Vite dev server starts on **http://localhost:5173** by default. Open that URL in a browser.

## Running tests

### Backend tests

From the `backend/` directory:

```bash
npm test
```
Backend tests use Supertest for HTTP assertions.

### Frontend tests

From the `frontend/` directory:

```bash
npm test
```

This runs `vitest run` with jsdom. For watch mode, during development:

```bash
npm run test:watch
```
