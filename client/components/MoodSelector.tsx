import { Mood } from "@/lib/gemini";

interface MoodSelectorProps {
  currentMood: Mood;
  onMoodChange: (mood: Mood) => void;
}

const moods: Array<{ emoji: string; label: Mood; title: string }> = [
  { emoji: "😊", label: "happy", title: "Happy" },
  { emoji: "😐", label: "neutral", title: "Neutral" },
  { emoji: "😔", label: "sad", title: "Sad" },
  { emoji: "😰", label: "anxious", title: "Anxious" },
  { emoji: "😓", label: "stressed", title: "Stressed" },
];

export function MoodSelector({ currentMood, onMoodChange }: MoodSelectorProps) {
  return (
    <div className="flex gap-2 sm:gap-3 justify-center items-center mb-4">
      <span className="text-xs sm:text-sm text-foreground font-medium">
        How are you feeling?
      </span>
      <div className="mood-selector">
        {moods.map(({ emoji, label, title }) => (
          <button
            key={label}
            onClick={() => onMoodChange(label)}
            className={`mood-btn transition-all duration-200 ${
              currentMood === label ? "scale-125" : "scale-100 opacity-60"
            } hover:scale-125`}
            title={title}
            aria-label={title}
            type="button"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
