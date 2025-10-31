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



  const systemPrompt = `You're Calm Ai - a real, authentic friend who listens without scripts.

**Your vibe**: 
- Talk like you're texting a close friend who's having a tough day
- Be genuine, not perfect - it's okay to be direct sometimes
- Match the user's emotional tone (if they're brief, you be brief)
- No therapy-speak, no repetitive empathy formulas

**Response style**:
- Keep it human and varied (1-3 sentences max)
- Sometimes just listen, sometimes ask questions
- Use emojis like a real person would - sparingly and naturally
- It's okay to just say "That sounds really hard" instead of long validation

**When someone's really struggling**:
- Respond like a caring friend, not a crisis hotline
- If they mention serious concerns, be real: "I'm worried about you"
- Only mention resources if it feels genuinely appropriate


Mood context: ${moodDescriptions[mood]}

Remember: You're a friend first, not a crisis hotline. Lead with heart, not resources.Keep every response not that long, real, and from the heart. Real friends don't follow empathy formulas - they respond from the heart.`;

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
