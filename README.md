# React Moderniser Chrome Extension

> **Modernise Legacy React Code Instantly Using Google Gemini AI**

---

## Overview

**React Moderniser** is a Chrome Extension that utilises **Google Gemini AI APIs** to automatically analyse, modernise, and document legacy React components.  
It helps developers migrate old React projects faster by leveraging **Summarizer**, **Rewriter**, and **Writer** APIs directly from Chrome.

---

## Problem Statement

Modernising large, legacy React codebases is a **time-consuming, error-prone process**.  
Many projects still rely on outdated **class components, lifecycle methods, and untyped JavaScript**.  
Manual migration to modern React 18+ patterns (functional components, hooks, and TypeScript) can take hours or days.

**React Moderniser** solves this by letting developers:
- Paste old React code into a Chrome popup.
- Instantly **analyse**, **rewrite**, and **annotate** it using Gemini’s built-in AI models.
- Export clean, modernised TypeScript code — right from the browser.

---

## Features

- Summarises legacy React code  
- Detects outdated patterns (e.g., `componentWillMount`, class state)  
- Converts to modern Hooks & TypeScript (.tsx)  
- Generates migration notes with inline documentation  
- Side-by-side Monaco editor diff UI  
- One-click export of modernised files  

---

## APIs Used

| API | Purpose |
|-----|----------|
| **Summarizer API** | Summarises and explains legacy React components |
| **Rewriter API** | Transforms old React code to modern functional syntax |
| **Writer API** | Creates developer-friendly migration documentation |

All APIs interact with **Chrome’s built-in Gemini Nano model** via local backend calls.

---

## How to Run Locally

### Clone the Repository
```bash
git clone https://github.com/bulufishh/react-modernizer-extension.git
cd react-modernizer-extension
```

2)install dependencies at terminal
```bash
npm install
```

3)Set up Environment Variables
Create a .env file in the root directory:
```bash
GEMINI_API_KEY=your_google_api_key_here
PORT=3000
```

4) Start the Backend
```bash
 node server.mjs
```
You should see:
```bash
Server running on http://localhost:3000
```

5)Load the Chrome Extension
  \n 1.Open Google Chrome
  \n 2.Go to chrome://extensions
  \n 3.Enable Developer Mode
  \n 4.Click Load unpacked
  \n 5.Select the extension/ folder in this project
