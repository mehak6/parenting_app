'use server';

import { genAI } from '../lib/gemini';
import { Activity, AgeGroup, Mood, ParentEnergy, TimeAvailable } from '../types';

interface GenerateRequest {
  ageGroup: AgeGroup;
  mood: Mood;
  energy: ParentEnergy;
  time: TimeAvailable;
  materials?: string[]; // Optional: what user has on hand
  context?: string; // e.g., "in a car", "at a restaurant"
}

export async function generateActivity(req: GenerateRequest): Promise<Activity | null> {
  if (!genAI) {
    console.warn("GOOGLE_API_KEY is not set.");
    return null;
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      You are an expert parenting assistant. Suggest ONE unique, age-appropriate activity for a child.
      
      **Constraints:**
      - Child Age Group: ${req.ageGroup}
      - Child Mood: ${req.mood}
      - Parent Energy Available: ${req.energy}
      - Time Available: ${req.time}
      ${req.context ? `- **CRITICAL CONTEXT**: The activity MUST happen ${req.context}. Ensure it fits this environment perfectly (e.g., if "in a car", NO loose pieces, NO running; if "restaurant", quiet and seated).` : ''}
      
      **Safety & Appropriateness Protocol:**
      - STRICTLY ensure the activity is safe for a child of age group ${req.ageGroup}.
      - For toddlers (18-24m, 2-3y): NO small objects (choking hazards), sharp items, or complex steps.
      - Ensure all materials are common household items.
      - The tone should be fun, encouraging, and playful.
      
      **Output Format:**
      Return strictly valid JSON matching this interface:
      {
        "name": "string (fun title)",
        "minAge": number (months),
        "maxAge": number (months),
        "moods": ["${req.mood}"],
        "parentEnergy": "${req.energy}",
        "timeRequired": "${req.time}",
        "materials": ["string", "string"],
        "instructions": ["step 1", "step 2", "step 3"],
        "skillFocus": ["string", "string"],
        "isLowEnergy": boolean,
        "proTip": "string (A short educational fact about why this helps child development)"
      }
      
      Do not include markdown code blocks like 
      . Just the raw JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean up if the model adds markdown
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const activityData = JSON.parse(jsonStr);

    return {
      ...activityData,
      id: `ai-${Date.now()}`, // Generate a temp ID
    };

  } catch (error) {
    console.error("AI Generation Error:", error);
    return null;
  }
}
