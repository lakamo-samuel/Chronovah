// pages/NoteDetail.tsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Trash2,
  Star,
  Pin,
  Clock,
  Image,
  Link2,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  MoreVertical,
  Eye,
  Edit2,
  Copy,
  Share2,
  Download,
  FileText,
  Check,
  X,
  Palette,
  Paperclip,
  Hash,
} from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Note, NoteColor } from "../../type/NoteType";
import { db } from "../../Database/db";

// Create a wrapper component for SyntaxHighlighter to fix type issues
const CodeBlock = ({
  language,
  value,
}: {
  language: string;
  value: string;
}) => {
  return (
    <SyntaxHighlighter
      style={vscDarkPlus}
      language={language}
      PreTag="div"
      customStyle={{
        margin: 0,
        borderRadius: "0.5rem",
        fontSize: "0.875rem",
      }}
    >
      {value}
    </SyntaxHighlighter>
  );
};

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const noteId = Number(id);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<Partial<Note>>({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  const note = useLiveQuery(() => db.notes.get(noteId), [noteId]);

  // Initialize draft with note data
  useEffect(() => {
    if (note) {
      setDraft({
        ...note,
        tags: note.tags || [],
      });
    }
  }, [note]);

  // Auto-save functionality
  useEffect(() => {
    if (!isEditing || !note?.id) return;

    const saveTimer = setTimeout(async () => {
      if (JSON.stringify(draft) !== JSON.stringify(note)) {
        setIsSaving(true);
        try {
          await db.notes.update(note.id as number, {
            ...draft,
            updatedAt: new Date().toISOString(),
            wordCount: draft.content?.split(/\s+/).filter(Boolean).length || 0,
            readTime: Math.max(
              1,
              Math.ceil(
                (draft.content?.split(/\s+/).filter(Boolean).length || 0) / 200,
              ),
            ),
          });
          setLastSaved(new Date());
        } catch (error) {
          console.error("Failed to save note:", error);
        } finally {
          setIsSaving(false);
        }
      }
    }, 2000);

    return () => clearTimeout(saveTimer);
  }, [draft, note, isEditing]);

  const handleContentChange = (
    field: keyof Note,
    value: string | string[] | NoteColor | undefined,
  ) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!note?.id) return;

    setIsSaving(true);
    try {
      await db.notes.update(note.id, {
        ...draft,
        updatedAt: new Date().toISOString(),
        wordCount: draft.content?.split(/\s+/).filter(Boolean).length || 0,
        readTime: Math.max(
          1,
          Math.ceil(
            (draft.content?.split(/\s+/).filter(Boolean).length || 0) / 200,
          ),
        ),
      });
      setLastSaved(new Date());
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (note?.id) {
      await db.notes.delete(note.id);
      navigate("/notes");
    }
  };

  const togglePinned = async () => {
    if (note?.id) {
      await db.notes.update(note.id, {
        isPinned: !note.isPinned,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const toggleFavorite = async () => {
    if (note?.id) {
      await db.notes.update(note.id, {
        isFavorite: !note.isFavorite,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !draft.tags?.includes(tagInput.trim())) {
      setDraft((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setDraft((prev) => ({
      ...prev,
      tags: (prev.tags || []).filter((tag) => tag !== tagToRemove),
    }));
  };

  const insertFormatting = (format: string) => {
    if (!editorRef.current) return;

    const start = editorRef.current.selectionStart;
    const end = editorRef.current.selectionEnd;
    const selectedText = draft.content?.substring(start, end) || "";

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
      (draft.content || "").substring(0, start) +
      formattedText +
      (draft.content || "").substring(end);
    handleContentChange("content", newContent);

    // Reset cursor position
    setTimeout(() => {
      editorRef.current?.setSelectionRange(
        start + formattedText.length,
        start + formattedText.length,
      );
    }, 0);
  };

  const colors: Array<{ name: NoteColor; class: string }> = [
    { name: "default", class: "bg-primary-500" },
    { name: "red", class: "bg-red-500" },
    { name: "orange", class: "bg-orange-500" },
    { name: "yellow", class: "bg-yellow-500" },
    { name: "green", class: "bg-green-500" },
    { name: "blue", class: "bg-blue-500" },
    { name: "purple", class: "bg-purple-500" },
    { name: "pink", class: "bg-pink-500" },
  ];

  if (!note) {
    return (
      <div className="min-h-screen bg-default pt-20 px-4">
        <div className="max-w-4xl mx-auto text-center py-20">
          <FileText size={48} className="mx-auto text-muted mb-4" />
          <h2 className="text-xl font-semibold text-primary mb-2">
            Note not found
          </h2>
          <button
            onClick={() => navigate("/notes")}
            className="text-primary-500 hover:text-primary-600"
          >
            Back to notes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-default pt-20 pb-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/notes")}
              className="p-2 hover:bg-card rounded-lg transition-colors"
            >
              <ArrowLeft size={20} className="text-muted" />
            </button>

            <div className="flex items-center gap-1">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={togglePinned}
                className={`p-2 rounded-lg transition-colors ${
                  note.isPinned
                    ? "text-primary-500 bg-primary-500/10"
                    : "text-muted hover:text-primary-500"
                }`}
              >
                <Pin size={18} className={note.isPinned ? "rotate-45" : ""} />
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleFavorite}
                className={`p-2 rounded-lg transition-colors ${
                  note.isFavorite
                    ? "text-accent-yellow bg-accent-yellow/10"
                    : "text-muted hover:text-accent-yellow"
                }`}
              >
                <Star
                  size={18}
                  fill={note.isFavorite ? "currentColor" : "none"}
                />
              </motion.button>

              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="p-2 rounded-lg text-muted hover:text-primary-500 transition-colors"
                >
                  <Palette size={18} />
                </button>

                {/* Color picker dropdown */}
                <AnimatePresence>
                  {showColorPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-1 bg-card border border-default rounded-xl shadow-hard p-2 z-50"
                    >
                      <div className="flex gap-1">
                        {colors.map((color) => (
                          <button
                            key={color.name}
                            onClick={() => {
                              handleContentChange("color", color.name);
                              setShowColorPicker(false);
                            }}
                            className={`w-6 h-6 rounded-full ${color.class} transition-transform hover:scale-110 ${
                              draft.color === color.name
                                ? "ring-2 ring-primary-500 ring-offset-2"
                                : ""
                            }`}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Metadata */}
            <div className="hidden sm:flex items-center gap-3 ml-2 text-xs text-muted border-l border-default pl-3">
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>
                  Updated{" "}
                  {new Date(note.updatedAt || note.createdAt).toLocaleString()}
                </span>
              </div>
              {note.wordCount && (
                <>
                  <span>•</span>
                  <span>{note.wordCount} words</span>
                </>
              )}
              {note.readTime && (
                <>
                  <span>•</span>
                  <span>{note.readTime} min read</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isSaving && (
              <div className="flex items-center gap-1 text-xs text-muted">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-500" />
                <span>Saving...</span>
              </div>
            )}

            {lastSaved && !isSaving && (
              <div className="text-xs text-muted">
                Saved {new Date(lastSaved).toLocaleTimeString()}
              </div>
            )}

            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                >
                  <Save size={16} />
                  <span>Save</span>
                </button>
                <button
                  onClick={() => {
                    setDraft(note);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 text-muted hover:text-primary transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-card hover:bg-default text-primary rounded-lg transition-colors border border-default"
                >
                  <Edit2 size={16} />
                  <span>Edit</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="p-2 text-muted hover:text-primary transition-colors"
                  >
                    <MoreVertical size={18} />
                  </button>

                  <AnimatePresence>
                    {showShareMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-card border border-default rounded-xl shadow-hard overflow-hidden z-50"
                      >
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setShowShareMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-default transition-colors"
                        >
                          <Copy size={14} />
                          <span>Copy link</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowShareMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-default transition-colors"
                        >
                          <Share2 size={14} />
                          <span>Share</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowShareMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-primary hover:bg-default transition-colors"
                        >
                          <Download size={14} />
                          <span>Export</span>
                        </button>
                        <div className="border-t border-default my-1" />
                        <button
                          onClick={() => {
                            setShowDeleteConfirm(true);
                            setShowShareMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-accent-red hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                        >
                          <Trash2 size={14} />
                          <span>Delete</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Hash size={14} className="text-muted" />
          {(draft.tags || []).map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-2 py-1 bg-card border border-default rounded-lg text-xs text-primary"
            >
              <span>{tag}</span>
              {isEditing && (
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:text-accent-red"
                >
                  <X size={12} />
                </button>
              )}
            </span>
          ))}
          {isEditing && (
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
          )}
        </div>

        {/* Note content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-default overflow-hidden"
          style={{
            borderColor:
              draft.color && draft.color !== "default"
                ? `var(--color-${draft.color}-500)`
                : undefined,
          }}
        >
          {/* Formatting toolbar (only in edit mode) */}
          {isEditing && (
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
              <button
                onClick={() => setIsPreview(!isPreview)}
                className={`p-1.5 rounded transition-colors ${
                  isPreview
                    ? "bg-primary-500 text-white"
                    : "text-muted hover:text-primary"
                }`}
                title="Toggle preview"
              >
                <Eye size={16} />
              </button>
            </div>
          )}

          <div className="p-6 md:p-8">
            {/* Title */}
            {isEditing ? (
              <input
                ref={titleRef}
                type="text"
                value={draft.title || ""}
                onChange={(e) => handleContentChange("title", e.target.value)}
                placeholder="Note title..."
                className="w-full text-2xl md:text-3xl font-bold bg-transparent border-b border-default pb-2 mb-4 focus:outline-none focus:border-primary-500 text-primary"
                autoFocus
              />
            ) : (
              <h1 className="text-2xl md:text-3xl font-bold text-primary mb-4">
                {note.title || "Untitled"}
              </h1>
            )}

            {/* Content */}
            {isEditing && !isPreview ? (
              <textarea
                ref={editorRef}
                value={draft.content || ""}
                onChange={(e) => handleContentChange("content", e.target.value)}
                placeholder="Write your note here... (Markdown supported)"
                rows={20}
                className="w-full bg-transparent focus:outline-none text-primary resize-none leading-relaxed font-mono text-sm"
              />
            ) : (
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    code({ className, children }) {
                      const match = /language-(\w+)/.exec(className || "");
                      const language = match ? match[1] : "text";
                      const code = String(children).replace(/\n$/, "");

                      return match ? (
                        <CodeBlock language={language} value={code} />
                      ) : (
                        <code className="bg-default px-1 py-0.5 rounded text-sm">
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {isEditing && isPreview
                    ? draft.content || ""
                    : note.content || ""}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </motion.div>

        {/* Attachments section */}
        {note.attachments && note.attachments.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-muted mb-3 flex items-center gap-2">
              <Paperclip size={14} />
              Attachments
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {note.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="bg-card border border-default rounded-lg p-3 flex items-center gap-2"
                >
                  {attachment.type === "image" ? (
                    <Image size={16} className="text-primary-500" />
                  ) : attachment.type === "link" ? (
                    <Link2 size={16} className="text-primary-500" />
                  ) : (
                    <FileText size={16} className="text-primary-500" />
                  )}
                  <span className="text-xs text-primary truncate">
                    {attachment.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-xl border border-default p-6 max-w-md w-full"
            >
              <h3 className="text-lg font-semibold text-primary mb-2">
                Delete Note
              </h3>
              <p className="text-muted mb-6">
                Are you sure you want to delete "{note.title || "Untitled"}"?
                This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-muted hover:text-primary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-accent-red hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
