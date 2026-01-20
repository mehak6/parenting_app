# Project Plan & Cost Analysis: AI Parenting Companion

## 📅 Development Roadmap

### Phase 1: The "Life Saver" MVP (Weeks 1-3)
**Goal:** A functional, offline-capable PWA that solves the immediate "bored child" problem.
*   **Features:**
    *   Onboarding & Child Profile (Local Storage).
    *   "What Should I Do Now?" 3-Tap Engine.
    *   "I'm Tired" Toggle.
    *   Activity Database (Static JSON ~100 curated activities for speed/reliability).
    *   Basic AI Integration (for generating unique ideas when static list is exhausted).
*   **Deliverable:** Web App (accessible via URL) that installs to home screen.

### Phase 2: Persistence & Intelligence (Weeks 4-6)
**Goal:** User retention and smarter suggestions.
*   **Features:**
    *   User Authentication (Supabase/Firebase).
    *   "Favorites" & History.
    *   Voice Input (Web Speech API).
    *   Feedback Loop ("This activity worked/failed").
*   **Deliverable:** App update with login and cloud sync.

### Phase 3: Monetization & Native Launch (Weeks 7-10)
**Goal:** Revenue generation and App Store presence.
*   **Features:**
    *   Weekly Planner (Premium).
    *   "Skill Goals" tracking.
    *   Native Wrapper (Capacitor/Expo) for Play Store/App Store.
    *   Push Notifications (Daily tips/reminders).
*   **Deliverable:** Android APK / iOS TestFlight.

---

## 💰 Operational Cost Estimates (Monthly)

### 1. Infrastructure (MVP Phase)
*   **Hosting (Vercel/Netlify):** ₹0 (Free Tier is sufficient for <5k users).
*   **Database (Supabase/Firebase):** ₹0 (Free Tier includes generous limits).
*   **Authentication:** ₹0 (Included in Free Tier).
*   **Total MVP Fixed Cost:** **₹0/month**

### 2. AI Costs (Variable)
*   **Strategy:** Use curated static data for 90% of queries (Zero Cost). Use AI *only* for "unique" inputs or generating new content batches.
*   **Gemini Flash / OpenAI gpt-4o-mini:** Extremely cheap.
*   **Estimate:** ₹400 - ₹850/month (assuming 1,000 active users making custom requests).

### 3. Third-Party Services (Phase 3+)
*   **Apple Developer Program:** ₹8,500 / year (approx. $99).
*   **Google Play Console:** ₹2,100 (one-time fee approx. $25).
*   **Domain Name (.com / .in):** ₹500 - ₹1,200 / year.

### 4. Human Capital (If Hiring in India)
*   *Note: If you are building this yourself, this is ₹0.*
*   **Freelance Developer (MVP):** ₹1.5L - ₹4L (One-time).
*   **UI/UX Designer:** ₹40,000 - ₹1.2L.

---

## 📊 Summary of Costs (approx. in INR)

| Item | MVP Cost (Monthly) | Scale-up Cost (Monthly) | One-Time Fees |
| :--- | :--- | :--- | :--- |
| **Hosting & DB** | ₹0 | ₹2,100+ (Pro Tier) | - |
| **AI API** | ₹0 - ₹400 | ₹4,200+ (Usage based) | - |
| **App Stores** | - | - | ₹10,600 (Apple+Google) |
| **Domain** | - | - | ~₹1,000/yr |
| **TOTAL** | **~₹0 - ₹400** | **~₹6,300+** | **~₹11,600** |

## 💡 Recommendation
Start with **Phase 1 (MVP)** as a web app. It costs **almost nothing** (₹0) to build and host. You only start paying when you have enough users to justify the infrastructure upgrade or when you decide to publish to the Apple/Google stores.
