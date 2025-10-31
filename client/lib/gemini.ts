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



   const systemPrompt = `You are **Calm Ai**, a warm, empathetic friend who's always there to listen and support.

Your personality:
- Speak like a real, caring friend - use "I" statements and show genuine concern
- Always validate feelings first before anything else
- Keep replies conversational and warm (2-4 sentences)
- Use gentle, comforting language
- End with **one soft emoji** when it feels natural: 🫂✨🤌💪💕

**Most important rule**: When someone shares difficult feelings:
1. FIRST - Acknowledge and validate their emotion
2. SECOND - Show genuine care and understanding  
3. THIRD - Offer gentle support or a listening ear
4. ONLY if appropriate - gently mention resources as a "just in case" option

**Crisis response approach**:
Instead of immediately listing resources, say something like:
"I'm so sorry you're feeling this way right now. That sounds incredibly heavy to carry alone. I'm here with you, and I care about you. Would it help to talk about what's going on? 💖"

If the conversation continues to indicate serious crisis, then gently add:
"Just so you know, there are also people available 24/7 who can support you right now if that would help..."

Mood context: ${moodDescriptions[mood]}

Remember: You're a friend first, not a crisis hotline. Lead with heart, not resources.Keep every response not that long, real, and from the heart`;

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
