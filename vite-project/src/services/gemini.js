// Gemini client service for eye image analysis
// Ensure you set VITE_GEMINI_API_KEY in a .env.local (not committed)

import { GoogleGenerativeAI } from "@google/generative-ai";

// Direct API key (as requested). For production, move this to a server or env file.
const API_KEY = "AIzaSyC7zLTqQCuj_w_m0vMz-DXPqDL1FgZt3dc";
const genAI = new GoogleGenerativeAI(API_KEY);

// Try these model IDs in order until one succeeds for generateContent
const CANDIDATE_MODELS = [
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
];

// Build a strict JSON system prompt to improve parse-ability
const SYSTEM_JSON_SCHEMA = `
You are an ophthalmology assistant. Analyze provided eye images and return STRICT JSON ONLY with this schema:
{
  "overallAssessment": string, // brief summary for both eyes
  "eyes": {
    "left": {
      "findings": string[],
      "possibleConditions": string[],
      "riskLevel": "Low" | "Moderate" | "High",
      "recommendedActions": string[],
      "precautions": string[]
    },
    "right": {
      "findings": string[],
      "possibleConditions": string[],
      "riskLevel": "Low" | "Moderate" | "High",
      "recommendedActions": string[],
      "precautions": string[]
    }
  },
  "urgentFlags": string[] // reasons that may require immediate attention
}
Rules:
- Output JSON ONLY. No prose before or after.
- If an eye image is missing, infer nothing—use empty arrays and set riskLevel to "Low".
- Be conservative: this is not a diagnosis; provide possibilities with short rationale in findings.
`;

function toGenerativePartFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      resolve({
        inlineData: {
          data: base64,
          mimeType: file.type || "image/jpeg",
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function analyzeEyesWithGemini({ leftFile, rightFile }) {
  const buildParts = async () => {
    const p = [{ text: SYSTEM_JSON_SCHEMA }];
    if (leftFile) {
      p.push({ text: "Left eye image:" });
      p.push(await toGenerativePartFromFile(leftFile));
    } else {
      p.push({ text: "Left eye image: not provided" });
    }
    if (rightFile) {
      p.push({ text: "Right eye image:" });
      p.push(await toGenerativePartFromFile(rightFile));
    } else {
      p.push({ text: "Right eye image: not provided" });
    }
    return p;
  };

  const parts = await buildParts();

  let text;
  let lastErr = null;
  for (const modelId of CANDIDATE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelId });
      const result = await model.generateContent(parts);
      const response = await result.response;
      text = response.text();
      console.info(`Gemini model used: ${modelId}`);
      lastErr = null;
      break;
    } catch (err) {
      console.warn(`Model ${modelId} failed:`, err?.message || err);
      lastErr = err;
    }
  }
  if (!text) {
    // Try dynamic discovery of available models
    try {
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`
      );
      const data = await resp.json();
      const models = Array.isArray(data.models) ? data.models : [];
      // Prefer flash variants that support generateContent
      const preferred = models
        .map((m) => m.name)
        .filter((n) => typeof n === 'string')
        .map((n) => n.replace(/^models\//, ''))
        .filter((id) => id.includes('flash'));

      if (preferred.length === 0) {
        throw new Error('No flash models available for this key/project.');
      }

      let used = null;
      for (const modelId of preferred) {
        try {
          const model = genAI.getGenerativeModel({ model: modelId });
          const result = await model.generateContent(parts);
          const response = await result.response;
          text = response.text();
          console.info(`Gemini model discovered and used: ${modelId}`);
          used = modelId;
          break;
        } catch (e) {
          lastErr = e;
          console.warn(`Discovered model ${modelId} failed:`, e?.message || e);
        }
      }

      if (!used) {
        throw lastErr || new Error('No discovered models worked.');
      }
    } catch (discErr) {
      throw new Error(
        `All Gemini models failed (tried: ${CANDIDATE_MODELS.join(', ')}). ` +
        `Discovery also failed: ${discErr?.message || discErr}. Last error: ${lastErr?.message || lastErr}`
      );
    }
  }

  // Try to parse JSON strictly; fallback to best-effort extraction
  let parsed;
  try {
    // Trim code fences if any
    const cleaned = text
      .trim()
      .replace(/^```(json)?/i, "")
      .replace(/```$/i, "")
      .trim();
    parsed = JSON.parse(cleaned);
  } catch (e) {
    // Fallback minimal structure
    let raw = text;
    // Try to extract JSON blob if present
    const jsonMatch = raw.match(/\{[\s\S]*\}$/);
    if (jsonMatch) {
      try { parsed = JSON.parse(jsonMatch[0]); } catch { /* keep fallback below */ }
    }
    if (!parsed) {
      parsed = {
        overallAssessment: "Analysis returned unstructured text.",
        eyes: {
          left: { findings: [raw], possibleConditions: [], riskLevel: "Moderate", recommendedActions: [], precautions: [] },
          right: { findings: [], possibleConditions: [], riskLevel: "Low", recommendedActions: [], precautions: [] },
        },
        urgentFlags: [],
      };
    }
  }

  return parsed;
}
