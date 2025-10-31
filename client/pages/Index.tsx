import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MoodSelector } from "@/components/MoodSelector";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { getMiraMindReply, type Mood } from "@/lib/gemini";

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: number;
}

const STORAGE_KEY = "miramind_messages";
const MOOD_KEY = "miramind_mood";

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [mood, setMood] = useState<Mood>("neutral");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load messages and mood from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    const savedMood = localStorage.getItem(MOOD_KEY);

    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (error) {
        console.error("Failed to parse saved messages:", error);
      }
    }

    if (savedMood) {
      setMood(savedMood as Mood);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Save mood to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(MOOD_KEY, mood);
  }, [mood]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (userInput: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userInput,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setApiError(null);

    // Add loading message
    const loadingId = (Date.now() + 1).toString();

    try {
      const reply = await getMiraMindReply(userInput, mood);

      // Remove loading message and add actual response
      setMessages((prev) => [
        ...prev,
        {
          id: loadingId,
          role: "ai",
          content: reply,
          timestamp: Date.now(),
        },
      ]);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      setApiError(errorMessage);
      setMessages((prev) => [
        ...prev,
        {
          id: loadingId,
          role: "ai",
          content: `I'm having trouble right now. ${errorMessage}`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear all messages?")) {
      setMessages([]);
      setApiError(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-soft-lavender via-background to-soft-pink">
      <Header />

      <main className="flex-1 flex flex-col max-w-md w-full mx-auto px-4 py-4 sm:py-6 overflow-hidden">
        {/* Mood Selector */}
        <MoodSelector currentMood={mood} onMoodChange={setMood} />

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 rounded-2xl bg-white/50 backdrop-blur-sm p-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="text-5xl mb-4">🌸</div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Welcome to Calm AI
                
              </h2>
              <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                I'm here to listen and support you. Share what's on your mind,
                and let's talk things through together.
              </p>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                />
              ))}
              {isLoading && (
                <ChatMessage role="ai" content="" isLoading={true} />
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Error message */}
        {apiError && (
          <div className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-lg p-3 mb-4">
            {apiError}
          </div>
        )}

        {/* Chat Input */}
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />

        {/* Clear chat button */}
        {messages.length > 0 && (
          <button
            onClick={handleClearChat}
     className="text-sm font-bold text-gray-600 hover:text-purple-900 transition-colors duration-200 mt-3 self-center"
type="button"


          >
            Clear conversation
          </button>
        )}
      </main>

      <Footer />
    </div>
  );
}
