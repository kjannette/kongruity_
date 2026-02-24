# kongruity app

kongruity clusters large volumes of unstructured action items in development settings by their thematic or topical similarity.

In kongruity, "to dos", action items, agile tickets, Jira comments (appropriately tagged) ... all the myriad artifacts of the creative-engineering process, become thematic "sticky notes." 

kongruity's React/Vite UI displays a board of your team's seemingly chaotic "sticky notes" -  transformed into manageable, actionable groups, with headers that explain their semantic relation, and introduces  project management workflow: ranking temporal priority of clusters for future release.

The backend features an Express server/API that serves "sticky note" data and proxies semantic grouping requests to Large Language Models.

Developers may freely swap in other LLM SDKs and/or APIs... and alter prompt syntax at backend/services/clustering.service.js to complement R&D with any LLM model/platform they prefer.

## Prerequisites

- Node.js (v18 or later recommended)
- An LLM Platform API key

## Setup

### 1. Unzip the project

```bash
unzip kongruity.zip
cd kongruity
```

### 2. Create an environment file

The backend expects a `.env` file containing an Anthropic API key in the root `backend/` directory. This file is git-ignored and must be created manually:

```bash
echo 'LLM_API_KEY=<your LLM API key>' > backend/.env
```

Replace `<your LLM API key>` with your actual key.

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
