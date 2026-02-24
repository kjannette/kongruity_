# kongruity

kongruity pulls in the unstructured artifacts of the creative-engineering process -- to-dos, action items, agile tickets, Jira comment threads, retrospective notes -- and synthesizes them into semantically coherent, prioritized clusters ready for implementation planning.

In kongruity world, these artifacts are "sticky notes." A board full of them looks chaotic. With one click, an LLM analyzes their meaning and groups them into thematic clusters, each with a descriptive header. 

An independent embedding-based evaluation scores clustering quality, so the output is data-backed. From there, teams can cimply drag-and-rank clusters by implementation priority, turning a wall of noise into an actionable workflow.

## How it works

1. **Ingest** — Sticky notes are loaded and displayed on a board.
2. **Cluster** — An LLM reads every note and groups them by semantic similarity (not keywords).
3. **Evaluate** — In parallel, a separate embedding model (Voyage AI) generates vector representations of each note. A silhouette-based cohesion score measures how well-separated and internally consistent clusters are. The score is displayed alongside the results.
4. **Validate** — Structural checks confirm every note is assigned to exactly one cluster, no clusters are empty, and labels are present.
5. **Prioritize** — Clusters appear ranked and are drag-reorderable. Teams set implementation priority by dragging clusters into position.

## Dev implementation note

Developers may swap in other LLM SDKs/APIs and alter prompt syntax in `backend/services/clustering.service.js` to experiment with any model or platform.

## Prerequisites

- Node.js (v18 or later recommended)
- An [Anthropic API key](https://console.anthropic.com/) (or other LLM platform, for clustering)
- A [Voyage AI API key](https://dash.voyageai.com/) (for embedding-based evaluation)

## Setup

### 1. Unzip the project

```bash
unzip kongruity.zip
cd kongruity
```

### 2. Create an environment file

The backend expects a `.env` file in the `backend/` directory. This file is git-ignored and must be created manually:

```bash
cat > backend/.env << 'EOF'
ANTHROPIC_API_KEY=<your Anthropic API key>
VOYAGEAI_API_KEY=<your Voyage AI API key>
EOF
```

Replace placeholder values with your actual keys.

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

### Start the backend — Production mode

From the `backend/` directory:

```bash
npm run start
```

The API server starts on **http://localhost:3001** (configurable via the `PORT` environment variable).

### Start the backend — Development mode

To start using Nodemon for hot reloads while developing:

```bash
npm run dev
```

### Build the frontend — Production mode

From the `frontend/` directory:

```bash
npm run build
```

### Start the frontend — Development mode

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

Backend tests use Vitest with Supertest for HTTP assertions.

### Frontend tests

From the `frontend/` directory:

```bash
npm test
```

This runs Vitest with jsdom. For watch mode during development:

```bash
npm run test:watch
```
