# React Modernizer Chrome Extension

This Chrome extension enables developers to paste or upload legacy React code, analyse it using Gemini APIs, and automatically modernise it with Hooks, TypeScript, and inline documentation.

## Features
- Summarises legacy React code
- Detects outdated patterns (e.g., `componentWillMount`, class state)
- Converts to Hooks & TSX
- Generates migration notes
- Side-by-side Monaco editor diff UI

## How to Run

### Backend
```bash
npm install
cp .env.example .env   # Add your Gemini API key
node server.mjs

