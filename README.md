# AI-Powered Parenting Companion

An offline-first, mobile-friendly application that suggests age-appropriate, low-prep activity ideas for kids based on their mood and the parent's energy level.

## 🚀 Features

- **Smart Child Profile:** Tailored suggestions based on age group.
- **3-Tap Engine:** Quick decision tree to find activities in seconds.
- **"I'm Tired" Mode:** Instant low-energy engagement ideas for when you just can't move.
- **Offline-First:** Works without an internet connection using local storage.
- **Privacy Focused:** Your data stays on your device.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **State Management:** React Hooks + LocalStorage
- **Deployment:** Vercel (PWA ready)

## 📂 Project Structure

- `src/types`: TypeScript definitions for profiles and activities.
- `src/data`: Static activity database.
- `src/components`: Reusable UI components (Onboarding, Engine, Activity Card).
- `src/app`: Main page and layout.

## 📅 Roadmap

- [x] Phase 1: MVP with static database and local profiles.
- [ ] Phase 2: User Authentication (Supabase) and Cloud Sync.
- [ ] Phase 3: AI-generated activities for unique requests.
- [ ] Phase 4: Native Mobile App (Capacitor/Tauri).
