import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import JSZip from 'jszip';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';


async function callGemini(model, prompt) {
  try {
    const res = await fetch(`${GEMINI_BASE}/${model}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await res.json();

    if (!res.ok) {
      console.error('Gemini API error:', data);
      return 'Error: Gemini API failed.';
    }

    const parts = data.candidates?.[0]?.content?.parts || [];
    return parts.map(p => p.text).join('\n') || 'No response.';
  } catch (err) {
    console.error('Gemini fetch error:', err);
    return 'Error: Unable to reach Gemini API.';
  }
}


app.post('/api/summarize', async (req, res) => {
  const { code } = req.body;
  const prompt = `
You are a React code reviewer.

Analyze the following legacy React code and summarize its key issues.
Focus on deprecated lifecycle methods, outdated class syntax, and non-hook logic.

Code:
${code}

Respond in 4–6 clear bullet points.
`;
  const summary = await callGemini('gemini-1.5-flash', prompt);
  res.json({ text: summary });
});


app.post('/api/transform', async (req, res) => {
  const { code } = req.body;
  const prompt = `
Convert this legacy React code into modern React with hooks and TypeScript (.tsx).

Rules:
- Convert class components → functional components
- Replace this.state → useState
- Replace lifecycle methods with useEffect
- Remove constructors, bind calls
- Simplify props and state typing
- Ensure JSX is clean and idiomatic

Code:
${code}
`;
  const transformedCode = await callGemini('gemini-1.5-pro', prompt);
  res.json({ transformedCode });
});


app.post('/api/notes', async (req, res) => {
  const { code, transformed } = req.body;

  const prompt = `
You are an expert React migration auditor.

Compare these two snippets:
LEGACY:
${code}

MODERN:
${transformed}

Write detailed **migration notes** describing all detected improvements.
Use this exact format:
[Improvement made]
[Partial or optional change]
[Helpful observation or tip]

Be specific — mention function names, hooks, and removed patterns if possible.
`;
  const notesText = await callGemini('gemini-1.5-pro', prompt);

  const notes = notesText
    .split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => line.trim());

  res.json({ notes });
});

app.post('/api/export', async (req, res) => {
  const { files } = req.body;
  const zip = new JSZip();
  for (const [name, content] of Object.entries(files)) {
    zip.file(name, content);
  }
  const buffer = await zip.generateAsync({ type: 'nodebuffer' });
  res.set('Content-Disposition', 'attachment; filename="modernized.zip"');
  res.send(buffer);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`React Modernizer backend running at http://localhost:${PORT}`)
);
