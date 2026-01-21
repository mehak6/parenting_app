import { NextResponse } from 'next/server';
import { genAI } from '@/lib/gemini';

// Helper for timeout
const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms))
  ]);
};

export async function POST(req: Request) {
  if (!genAI) {
    return NextResponse.json({ error: "API Key missing" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { ageGroup, mood, energy, time, context, materials, type } = body; // unified params

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    let prompt = "";
    
    if (type === 'remix') {
       // Remix Prompt logic
       const { currentActivity, modification } = body;
       prompt = `
        You are an expert parenting coach. MODIFY the following activity:
        Name: ${currentActivity.name}
        Instructions: ${currentActivity.instructions.join('. ')}
        Request: ${modification}
        Output strictly valid JSON matching the Activity interface.
       `;
    } else {
       // Generate Prompt logic
       prompt = `
        Suggest ONE unique activity for a child (${ageGroup}).
        Mood: ${mood}, Energy: ${energy}, Time: ${time}.
        ${context ? `Context: ${context}` : ''}
        ${materials ? `Use: ${materials}` : ''}
        Output strictly valid JSON matching the Activity interface.
       `;
    }

    const result = await withTimeout(model.generateContent(prompt), 8000);
    const text = result.response.text();
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    // Simplified parsing for brevity, assuming standard response
    const firstOpen = jsonStr.indexOf('{');
    const lastClose = jsonStr.lastIndexOf('}');
    const cleanJson = jsonStr.substring(firstOpen, lastClose + 1);
    
    return NextResponse.json(JSON.parse(cleanJson));

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
  }
}
