import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
