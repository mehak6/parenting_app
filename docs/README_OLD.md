# Parenting Companion App

An AI-powered parenting companion that instantly suggests age-appropriate, low-effort activities for kids. It tailors suggestions based on the child’s age, current mood, and the parent’s available energy.

## 🚀 Key Features

*   **Smart Profiling:** Age-safe suggestions based on child profiles.
*   **"What Should I Do Now?":** Instant 3-tap activity recommendation engine.
*   **"I'm Tired" Mode:** Specialized low-energy, independent play ideas.
*   **Voice Input:** Speak to the app to get suggestions (India-friendly).
*   **Offline-First:** Works with spotty internet connections.

## 📂 Documentation

See [DESIGN_DOC.md](./DESIGN_DOC.md) for detailed architecture, user personas, and feature specifications.

## 🛠 Tech Stack (Proposed)

*   **Frontend:** Next.js (React) with PWA capabilities (for easy mobile access without store friction initially) OR React Native (Expo) for a native mobile experience.
    *   *Recommendation:* **Next.js (App Router) + Tailwind CSS + Shadcn/UI**. This allows for a rapid "Web App" launch that works on all devices, which can later be wrapped into a native app using Capacitor/Tauri if needed.
*   **Backend:** Next.js Server Actions (Serverless) + Supabase (PostgreSQL).
*   **AI:** OpenAI API or Gemini API for generating/matching activities.
*   **State Management:** React Context / Zustand.

## 📅 Implementation Plan

1.  **Setup & Scaffolding:** Initialize project structure.
2.  **Core UI Components:** Build the "Activity Card", "Profile Setup", and "Selection Buttons".
3.  **Logic Implementation:** Implement the matching logic (Mood + Energy + Age -> Activity).
4.  **AI Integration:** Connect to LLM for dynamic activity generation (or mock data for MVP).
5.  **Polishing:** "I'm Tired" mode styling and Voice Input (Web Speech API).
