interface ChatMessageProps {
  role: "user" | "ai";
  content: string;
  isLoading?: boolean;
}

export function ChatMessage({
  role,
  content,
  isLoading = false,
}: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {!isUser && (
        <div className="mr-2 flex-shrink-0 w-8 h-8 flex items-center justify-center">
          <span className="text-xl">🪷</span>
        </div>
      )}

      <div
        className={`chat-bubble ${
          isUser ? "chat-bubble-user" : "chat-bubble-ai"
        } ${isLoading ? "min-h-12 flex items-center" : ""}`}
      >
        {isLoading ? (
          <div className="loading-dots">
            <div className="loading-dot animate-pulse-dot"></div>
            <div className="loading-dot animate-pulse-dot" style={{ animationDelay: "0.2s" }}></div>
            <div className="loading-dot animate-pulse-dot" style={{ animationDelay: "0.4s" }}></div>
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        )}
      </div>

      {isUser && (
        <div className="ml-2 flex-shrink-0 w-8 h-8 flex items-center justify-center">
          <span className="text-xl">👤</span>
        </div>
      )}
    </div>
  );
}
