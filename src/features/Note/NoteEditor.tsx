// components/NoteEditor.tsx
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  X,
  Save,
  Hash,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Palette,
  Check,
} from "lucide-react";
import type { Note } from "../../type/NoteType";

interface NoteEditorProps {
  note: Partial<Note> | null;
  onSave: (note: Partial<Note>) => void;
  onClose: () => void;
}

// Define the color type
type ColorOption =
  | "default"
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink";

export default function NoteEditor({ note, onSave, onClose }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [color, setColor] = useState<ColorOption>(
    (note?.color as ColorOption) || "default",
  );
  const [showColorPicker, setShowColorPicker] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const insertFormatting = (format: string) => {
    if (!contentRef.current) return;

    const start = contentRef.current.selectionStart;
    const end = contentRef.current.selectionEnd;
    const selectedText = content.substring(start, end);

    let formattedText = "";
    switch (format) {
      case "bold":
        formattedText = `**${selectedText}**`;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        break;
      case "h1":
        formattedText = `# ${selectedText}`;
        break;
      case "h2":
        formattedText = `## ${selectedText}`;
        break;
      case "ul":
        formattedText = `- ${selectedText}`;
        break;
      case "ol":
        formattedText = `1. ${selectedText}`;
        break;
      default:
        return;
    }

    const newContent =
      content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      contentRef.current?.setSelectionRange(
        start + formattedText.length,
        start + formattedText.length,
      );
    }, 0);
  };

  const colors: Array<{ name: ColorOption; class: string }> = [
    { name: "default", class: "bg-primary-500" },
    { name: "red", class: "bg-red-500" },
    { name: "orange", class: "bg-orange-500" },
    { name: "yellow", class: "bg-yellow-500" },
    { name: "green", class: "bg-green-500" },
    { name: "blue", class: "bg-blue-500" },
    { name: "purple", class: "bg-purple-500" },
    { name: "pink", class: "bg-pink-500" },
  ];

  const handleSubmit = () => {
    onSave({
      title,
      content,
      tags,
      color: color !== "default" ? color : undefined,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-card rounded-xl border border-default w-full max-w-2xl max-h-[80vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-default">
          <h3 className="text-lg font-semibold text-primary">
            {note?.id ? "Edit Note" : "Quick Note"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-default rounded-lg transition-colors"
          >
            <X size={18} className="text-muted" />
          </button>
        </div>

        {/* Formatting toolbar */}
        <div className="flex items-center gap-1 p-2 border-b border-default bg-default/50">
          <button
            onClick={() => insertFormatting("bold")}
            className="p-1.5 rounded hover:bg-card text-muted hover:text-primary transition-colors"
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => insertFormatting("italic")}
            className="p-1.5 rounded hover:bg-card text-muted hover:text-primary transition-colors"
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <div className="w-px h-4 bg-default mx-1" />
          <button
            onClick={() => insertFormatting("h1")}
            className="p-1.5 rounded hover:bg-card text-muted hover:text-primary transition-colors"
            title="Heading 1"
          >
            <Heading1 size={16} />
          </button>
          <button
            onClick={() => insertFormatting("h2")}
            className="p-1.5 rounded hover:bg-card text-muted hover:text-primary transition-colors"
            title="Heading 2"
          >
            <Heading2 size={16} />
          </button>
          <div className="w-px h-4 bg-default mx-1" />
          <button
            onClick={() => insertFormatting("ul")}
            className="p-1.5 rounded hover:bg-card text-muted hover:text-primary transition-colors"
            title="Bullet list"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => insertFormatting("ol")}
            className="p-1.5 rounded hover:bg-card text-muted hover:text-primary transition-colors"
            title="Numbered list"
          >
            <ListOrdered size={16} />
          </button>
          <div className="flex-1" />

          {/* Color picker */}
          <div className="relative">
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-1.5 rounded hover:bg-card text-muted hover:text-primary transition-colors"
            >
              <Palette size={16} />
            </button>

            {showColorPicker && (
              <div className="absolute right-0 bottom-full mb-2 bg-card border border-default rounded-lg shadow-hard p-2 z-10">
                <div className="flex gap-1">
                  {colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setColor(c.name);
                        setShowColorPicker(false);
                      }}
                      className={`w-6 h-6 rounded-full ${c.class} transition-transform hover:scale-110 ${
                        color === c.name
                          ? "ring-2 ring-primary-500 ring-offset-2"
                          : ""
                      }`}
                      aria-label={`Set color to ${c.name}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-180px)]">
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title (optional)"
            className="w-full text-xl font-semibold bg-transparent border-b border-default pb-2 mb-4 focus:outline-none focus:border-primary-500 text-primary"
          />

          <textarea
            ref={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note here... (Markdown supported)"
            rows={8}
            className="w-full bg-transparent focus:outline-none text-primary resize-none leading-relaxed"
          />

          {/* Tags */}
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <Hash size={14} className="text-muted" />
              <span className="text-xs font-medium text-muted">TAGS</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2 py-1 bg-default rounded-lg text-xs text-primary"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-accent-red"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}

              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                  placeholder="Add tag..."
                  className="w-24 px-2 py-1 bg-transparent border border-default rounded-lg text-xs text-primary focus:outline-none focus:border-primary-500"
                />
                <button
                  onClick={addTag}
                  className="p-1 text-muted hover:text-primary-500"
                >
                  <Check size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-default">
          <button
            onClick={onClose}
            className="px-4 py-2 text-muted hover:text-primary transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            <Save size={16} />
            <span>Save Note</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
