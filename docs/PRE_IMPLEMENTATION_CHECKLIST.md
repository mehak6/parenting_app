# 🛑 Pre-Implementation Checklist & Critical Considerations

Before we write a single line of code, these are the critical "gotchas" we must align on.

## 1. 🛡️ Privacy & Legal (Child Data is Sensitive)
*   **The Golden Rule:** Treat all child data as toxic waste. Do not store it if you don't have to.
*   **India DPDP Act & Global Standards:** Since we are dealing with minors, we must be extremely careful.
    *   *Decision:* For the MVP, we will store **all child profiles locally on the device**. No data leaves the parent's phone.
    *   *Action:* We will add a clear "Privacy Promise" screen during onboarding stating: "Your child's data never leaves this phone."

## 2. ⚠️ Content Safety (The "Zero Hallucination" Policy)
*   **The Risk:** AI can sometimes hallucinate unsafe advice (e.g., "Use a plastic bag for a parachute").
*   **The Fix:**
    *   **Layer 1 (Static):** The core 100 activities will be manually vetted and hardcoded (JSON).
    *   **Layer 2 (AI):** If we use AI later, it will be "Constrained AI" – picking from a pre-approved list rather than generating text from scratch.
    *   **Disclaimer:** Every activity card needs a tiny "Parental supervision required" footer.

## 3. 🇮🇳 Cultural Localization (The "Dal & Rice" Factor)
*   **Materials:** Western apps say "pipe cleaners" and "mason jars". We must say "rubber bands", "steel bowls", "dal", "newspapers", "dupatta".
*   **Space:** Many users live in apartments. We must prioritize low-space activities.
*   **Language:** The UI will be English, but activity instructions should be simple enough to be read in Hinglish mental translation.

## 4. 🧠 User Psychology (Guilt-Free UI)
*   **Tone:** Parenting is hard. The app should never sound judgmental.
    *   *Bad:* "You should play more with your child."
    *   *Good:* "Here is a quick win for you both!"
*   **"I'm Tired" Mode:** This must be framed as "Self-care" or "Independent Play Building," not "Lazy Parenting."

## 5. 📱 Technical Constraints (India Market)
*   **Android First:** The UI needs to look good on mid-range Android devices (Moto G, Redmi, Samsung A-series).
*   **Offline First:** The app *must* load instantly even if the Jio/Airtel data connection is flaky.
*   **App Size:** Keep the initial download small. Don't bundle heavy video assets.

## 6.  monetization Strategy (Trust First)
*   **Don't Gate Safety:** Never charge for safety features.
*   **Ads:** Avoid ads in the "Kids" section to prevent accidental clicks.

---
**Action Item:** If you agree with these principles, we will bake "Local Storage Only" and "Vetted Content" into the code structure from Day 1.
