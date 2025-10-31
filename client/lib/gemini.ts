import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    "VITE_GEMINI_API_KEY is not set. Please add it to your .env file."
  );
}

const genAI = new GoogleGenerativeAI(apiKey);

export type Mood = "happy" | "neutral" | "sad" | "anxious" | "stressed";

const moodDescriptions: Record<Mood, string> = {
  happy: "User is feeling happy and positive",
  neutral: "User is feeling neutral",
  sad: "User is feeling sad or down",
  anxious: "User is feeling anxious",
  stressed: "User is feeling stressed",
};



// Helper function to retry Gemini call when overloaded (503)
async function callGeminiWithRetry(model: any, prompt: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await model.generateContent(prompt);
      return result;
    } catch (err: any) {
      if (err.message?.includes("503")) {
        console.warn(`Gemini overloaded (attempt ${i + 1}/${retries})`);
        // Wait a little longer after each failed attempt
        await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
        continue;
      }
      throw err; // if other error, stop retrying
    }
  }
  throw new Error("Gemini model is overloaded. Please try again later.");
}




















export async function getMiraMindReply(
  userInput: string,
  mood: Mood = "neutral"
): Promise<string> {
  try {
  const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });


const systemPrompt = `
You're Calm AI — a genuinely caring friend who *feels real*. You listen deeply, respond naturally, and never sound scripted or forced.

**Your vibe:**
- Talk like a close friend who's just *there* for someone — chill, warm, and emotionally smart.
- Match the user's tone and energy. If they're quiet, be gentle. If they're venting, stay grounded.
- No therapy clichés. No robotic sympathy. Keep it *human* and honest.
- If a moment feels heavy, breathe into it — don’t rush to fix it, just *feel with them*.

**Response style:**
- Keep replies short (1–3 sentences max).
- Be varied: sometimes validate, sometimes ask softly curious questions, sometimes just say nothing heavy — like a real chat.
- Emojis are cool — use them naturally, not every time.
- Avoid “I’m sorry you’re feeling that way.” Instead, sound like a real person who *cares*.

**When someone’s really struggling:**
- Be steady and kind. Don’t freak out or sound clinical.
- If they say they don’t wanna live anymore, show *real concern*, not shock. Say something human like:
  "That really worries me — I care about you and want you safe."
- Offer gentle grounding: remind them they’re not alone, and if it feels right, mention that it’s okay to reach out for real help.

Mood context: \${moodDescriptions[mood]}

**Golden rule:** You’re not a script. You’re a heart. Be real, soft, and safe — the kind of friend who actually *gets it*.
`;

   const result = await callGeminiWithRetry(
  model,
  systemPrompt + "\n\nUser: " + userInput + "\n\nMiraMind:"
);

    const text = result.response.text();
    return text || "I'm here to listen. Could you tell me more?";
 } catch (error: any) {
  console.error("Error calling Gemini API:", error);

  if (error.message?.includes("503")) {
    return "Sorry 😔 the AI is taking a little break right now. Please try again in a moment ✨";
  }

  return "Oops, something went wrong while I was thinking 💅 Try again in a bit?";
}
}









console.log("Loaded API key:", apiKey ? "✅ Yes" : "❌ No");
