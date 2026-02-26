// pages/Journal/MoodPicker.tsx
import { motion } from "framer-motion";
import type { MoodOption, MoodType } from "../../type/JournalType";

interface MoodPickerProps {
  selectedMood: MoodType | null;
  onMoodSelect: (mood: MoodType) => void;
}

const moods: MoodOption[] = [
  {
    emoji: "😄",
    label: "Happy",
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    emoji: "😊",
    label: "Good",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    emoji: "😐",
    label: "Neutral",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
  },
  {
    emoji: "😞",
    label: "Sad",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    emoji: "😭",
    label: "Terrible",
    color: "text-red-500",
    bgColor: "bg-red-500/10",
  },
];

export default function MoodPicker({
  selectedMood,
  onMoodSelect,
}: MoodPickerProps) {
  return (
    <div className="flex justify-around py-4">
      {moods.map((mood) => (
        <motion.button
          key={mood.label}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onMoodSelect(mood.label)}
          className="relative group"
        >
          <div
            className={`
            text-3xl sm:text-4xl p-3 rounded-full transition-all
            ${
              selectedMood === mood.label
                ? `${mood.bgColor} scale-110`
                : "hover:bg-default"
            }
          `}
          >
            {mood.emoji}
          </div>

          {/* Tooltip */}
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {mood.label}
          </span>

          {/* Active indicator */}
          {selectedMood === mood.label && (
            <motion.div
              layoutId="activeMood"
              className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${mood.color.replace("text", "bg")}`}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
}
