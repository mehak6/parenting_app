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

// Helper for timeout
const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms))
  ]);
};

export async function generateActivity(req: GenerateRequest): Promise<Activity | null> {
  if (!genAI) {
    console.warn("GOOGLE_API_KEY is not set.");
    return createFallback(req);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert parenting assistant. Suggest ONE unique, age-appropriate activity for a child.
      
      **Constraints:**
      - Child Age Group: ${req.ageGroup}
      - Child Mood: ${req.mood}
      - Parent Energy Available: ${req.energy}
      - Time Available: ${req.time}
      ${req.context ? `- **CRITICAL CONTEXT**: The activity MUST happen ${req.context}. Ensure it fits this environment perfectly (e.g., if "in a car", NO loose pieces, NO running; if "restaurant", quiet and seated). If the context specifies "using [Material]", the activity MUST use that material as the primary tool.` : ''}
      
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

    const result = await withTimeout(model.generateContent(prompt), 8000);
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
    return createFallback(req);
  }
}

function createFallback(req: GenerateRequest): Activity {
  const isTravel = req.context?.toLowerCase().includes('car') || req.context?.toLowerCase().includes('plane');
  const isRestaurant = req.context?.toLowerCase().includes('restaurant');

  if (isTravel) {
    return {
      id: `fallback-travel-${Date.now()}`,
      name: "I Spy (Travel Edition)",
      minAge: 36,
      maxAge: 120,
      moods: ["Calm", "Learning"],
      parentEnergy: "Low",
      timeRequired: "10min",
      materials: ["None"],
      instructions: [
        "Look out the window or around the car.",
        "Say 'I spy with my little eye something... [Color]'.",
        "Take turns guessing!"
      ],
      skillFocus: ["Observation", "Vocabulary"],
      isLowEnergy: true,
      proTip: "Verbal games are perfect for travel as they require no packing and keep kids engaged."
    };
  }

  if (isRestaurant) {
    return {
      id: `fallback-restaurant-${Date.now()}`,
      name: "The Missing Object",
      minAge: 36,
      maxAge: 120,
      moods: ["Calm", "Learning"],
      parentEnergy: "Low",
      timeRequired: "10min",
      materials: ["Table items (spoon, shaker, packet)"],
      instructions: [
        "Place 3 items on the table.",
        "Have your child close their eyes.",
        "Remove one item. Ask: 'What's missing?'"
      ],
      skillFocus: ["Memory", "Attention"],
      isLowEnergy: true,
      proTip: "Memory games help pass time quietly while waiting for food."
    };
  }

  // Material-based Fallback
  const contextMaterial = req.context?.match(/using (.*)/i)?.[1];
  const item = (req.materials && req.materials.length > 0) ? req.materials[0] : contextMaterial;

  if (item) {
    return {
      id: `fallback-material-${Date.now()}`,
      name: `Instant ${item} Fun`,
      minAge: 18,
      maxAge: 120,
      moods: ["Creative", "Active"],
      parentEnergy: "Low",
      timeRequired: "10min",
      materials: [item, "Imagination"],
      instructions: [
        `Invent a new game using just the ${item}.`,
        `Challenge: Can you balance it? Can you hide it?`,
        `See who can come up with the silliest use for it.`
      ],
      skillFocus: ["Creativity", "Improvisation"],
      isLowEnergy: false,
      proTip: `Open-ended play with a single object like a ${item} boosts divergent thinking.`
    };
  }

  // Default Fallback
  return {
    id: `fallback-${Date.now()}`,
    name: `Instant ${req.mood} Play`,
    minAge: 12,
    maxAge: 120,
    moods: [req.mood],
    parentEnergy: req.energy,
    timeRequired: req.time,
    materials: ["Household items", "Imagination"],
    instructions: [
      `Since we couldn't connect to the cloud, let's try a classic:`,
      `Find 3 objects that are ${req.mood === 'Active' ? 'red' : 'soft'}.`,
      `Invent a story or game using just those items.`
    ],
    skillFocus: ["Creativity", "Resilience"],
    isLowEnergy: req.energy === 'Low',
    proTip: "Sometimes the best games come from boredom and limited resources!"
  };
}

export async function remixActivity(currentActivity: Activity, modification: 'Easier' | 'Harder' | 'NoMaterials'): Promise<Activity | null> {
  if (!genAI) return null;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      You are an expert parenting coach. MODIFY the following activity based on the user's request.
      
      **Original Activity:**
      Name: ${currentActivity.name}
      Materials: ${currentActivity.materials.join(', ')}
      Instructions: ${currentActivity.instructions.join('. ')}
      
      **Modification Request:** ${modification === 'Easier' ? 'Make it simpler for a younger or tired child.' : modification === 'Harder' ? 'Make it more challenging/complex.' : 'Suggest alternative materials using common household items because I do not have the listed ones.'}
      
      **Output Format:**
      Return strictly valid JSON matching this interface (keep the ID unique):
      {
        "name": "string (Modified Title)",
        "minAge": number,
        "maxAge": number,
        "moods": ["string"],
        "parentEnergy": "string",
        "timeRequired": "string",
        "materials": ["string", "string"],
        "instructions": ["step 1", "step 2", "step 3"],
        "skillFocus": ["string"],
        "isLowEnergy": boolean,
        "proTip": "string (Why this modification helps)"
      }
      Do not use markdown.
    `;

    const result = await withTimeout(model.generateContent(prompt), 8000);
    const response = await result.response;
    const text = response.text();

    console.log("Remix Raw Response:", text); // Debug log

    // Attempt to extract JSON using regex if simple replace fails
    let jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Fallback: Find the first '{' and last '}'
    const firstOpen = jsonStr.indexOf('{');
    const lastClose = jsonStr.lastIndexOf('}');
    if (firstOpen !== -1 && lastClose !== -1) {
      jsonStr = jsonStr.substring(firstOpen, lastClose + 1);
    }
    
    const newActivity = JSON.parse(jsonStr);
    return {
      ...newActivity,
      id: `remix-${Date.now()}`
    };
  } catch (error) {
    console.error("Remix Error:", error);
    
    // Fallback: Generate a simple modification locally if AI fails
    const modified = { ...currentActivity };
    modified.id = `remix-fallback-${Date.now()}`;
    
    if (modification === 'Easier') {
      modified.name = `${currentActivity.name} (Simplified)`;
      modified.instructions = [
        "Let's make this simpler!",
        ...currentActivity.instructions.slice(0, 2), // Fewer steps
        "Focus on having fun rather than following rules perfectly."
      ];
      modified.parentEnergy = 'Low';
      modified.proTip = "Simplifying the rules helps build confidence and reduces frustration.";
    } else if (modification === 'Harder') {
      modified.name = `${currentActivity.name} (Challenge Mode)`;
      modified.instructions = [
        ...currentActivity.instructions,
        "Bonus Challenge: Try doing this with one hand or standing on one leg!",
        "Time yourself to see how fast you can do it."
      ];
      modified.skillFocus = [...currentActivity.skillFocus, "Resilience"];
      modified.proTip = "Adding constraints or time limits boosts executive function and focus.";
    } else if (modification === 'NoMaterials') {
      modified.name = `${currentActivity.name} (Imagination Mode)`;
      modified.materials = ["Your Imagination", "Invisible props"];
      modified.instructions = [
        "Pretend you have the items needed.",
        ...currentActivity.instructions.map(s => s.replace(/ball|paper|toy/gi, "imaginary object")),
        "Act it out with big gestures!"
      ];
      modified.proTip = "Pretend play is the highest form of thinking in early childhood.";
    }
    
    return modified;
  }
}
