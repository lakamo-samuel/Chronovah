import { useRef, useEffect, useCallback } from 'react';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Quote,
} from 'lucide-react';

interface AdvancedMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export default function AdvancedMarkdownEditor({
  value,
  onChange,
  placeholder = 'Write your content here... (Markdown supported)',
  rows = 10,
  className = '',
}: AdvancedMarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // Update selection when textarea is focused
  const updateSelection = useCallback(() => {
    if (!textareaRef.current) return;

    // const start = textareaRef.current.selectionStart;
    // const end = textareaRef.current.selectionEnd;

    // TODO: Use selection for future features
  }, [value]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.addEventListener('select', updateSelection);
    textarea.addEventListener('click', updateSelection);
    textarea.addEventListener('keyup', updateSelection);

    return () => {
      textarea.removeEventListener('select', updateSelection);
      textarea.removeEventListener('click', updateSelection);
      textarea.removeEventListener('keyup', updateSelection);
    };
  }, [updateSelection]);

  const insertFormatting = useCallback(
    (format: string) => {
      if (!textareaRef.current) return;

      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const selectedText = value.substring(start, end) || 'text';

      let formattedText = '';
      let cursorOffset = 0;

      switch (format) {
        case 'bold':
          formattedText = `**${selectedText}**`;
          cursorOffset = 2;
          break;
        case 'italic':
          formattedText = `*${selectedText}*`;
          cursorOffset = 1;
          break;
        case 'code':
          formattedText = `\`${selectedText}\``;
          cursorOffset = 1;
          break;
        case 'h1':
          formattedText = selectedText.includes('\n')
            ? selectedText
                .split('\n')
                .map((line) => `# ${line}`)
                .join('\n')
            : `# ${selectedText}`;
          cursorOffset = 2;
          break;
        case 'h2':
          formattedText = selectedText.includes('\n')
            ? selectedText
                .split('\n')
                .map((line) => `## ${line}`)
                .join('\n')
            : `## ${selectedText}`;
          cursorOffset = 3;
          break;
        case 'h3':
          formattedText = selectedText.includes('\n')
            ? selectedText
                .split('\n')
                .map((line) => `### ${line}`)
                .join('\n')
            : `### ${selectedText}`;
          cursorOffset = 4;
          break;
        case 'bullet':
          formattedText = selectedText.includes('\n')
            ? selectedText
                .split('\n')
                .map((line) => `- ${line}`)
                .join('\n')
            : `- ${selectedText}`;
          cursorOffset = 2;
          break;
        case 'numbered':
          formattedText = selectedText.includes('\n')
            ? selectedText
                .split('\n')
                .map((line, idx) => `${idx + 1}. ${line}`)
                .join('\n')
            : `1. ${selectedText}`;
          cursorOffset = 3;
          break;
        case 'quote':
          formattedText = selectedText.includes('\n')
            ? selectedText
                .split('\n')
                .map((line) => `> ${line}`)
                .join('\n')
            : `> ${selectedText}`;
          cursorOffset = 2;
          break;
        default:
          return;
      }

      const newContent =
        value.substring(0, start) + formattedText + value.substring(end);
      onChange(newContent);

      // Set cursor position after the opening syntax
      setTimeout(() => {
        if (textareaRef.current) {
          const newPosition = start + cursorOffset;
          textareaRef.current.setSelectionRange(newPosition, newPosition);
          textareaRef.current.focus();
          updateSelection();
        }
      }, 0);
    },
    [value, onChange, updateSelection]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Auto-increment numbered lists on Enter
      if (e.key === 'Enter') {
        e.preventDefault();

        // Get the current line
        const beforeCursor = value.substring(0, start);
        const lines = beforeCursor.split('\n');
        const currentLine = lines[lines.length - 1];

        // Check if current line is a numbered list item
        const numberedListMatch = currentLine.match(/^(\d+)\.\s/);
        if (numberedListMatch) {
          const number = parseInt(numberedListMatch[1], 10);
          const newContent =
            value.substring(0, start) +
            '\n' +
            (number + 1) +
            '. ' +
            value.substring(end);
          onChange(newContent);

          // Position cursor after the new list number
          setTimeout(() => {
            const newPosition = start + (number + 1).toString().length + 3;
            textarea.setSelectionRange(newPosition, newPosition);
            updateSelection();
          }, 0);
          return;
        }

        // Check if current line is a bullet point
        const bulletMatch = currentLine.match(/^(-\s|•\s|\*\s)/);
        if (bulletMatch) {
          // If the line only contains the bullet, remove it (empty bullet)
          if (currentLine.trim() === '-' || currentLine.trim() === '•' || currentLine.trim() === '*') {
            const newContent =
              value.substring(0, start - bulletMatch[0].length) +
              value.substring(end);
            onChange(newContent);

            setTimeout(() => {
              const newPosition = start - bulletMatch[0].length;
              textarea.setSelectionRange(newPosition, newPosition);
              updateSelection();
            }, 0);
            return;
          }

          // Otherwise, create a new bullet
          const newContent =
            value.substring(0, start) + '\n- ' + value.substring(end);
          onChange(newContent);

          setTimeout(() => {
            const newPosition = start + 3; // \n + '- '
            textarea.setSelectionRange(newPosition, newPosition);
            updateSelection();
          }, 0);
          return;
        }

        // Default: just insert newline
        const newContent =
          value.substring(0, start) + '\n' + value.substring(end);
        onChange(newContent);

        setTimeout(() => {
          textarea.setSelectionRange(start + 1, start + 1);
          updateSelection();
        }, 0);
      }

      // Handle Tab for indentation
      if (e.key === 'Tab') {
        e.preventDefault();
        const newContent =
          value.substring(0, start) + '  ' + value.substring(end);
        onChange(newContent);

        setTimeout(() => {
          textarea.setSelectionRange(start + 2, start + 2);
          updateSelection();
        }, 0);
      }
    },
    [value, onChange, updateSelection]
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      {/* Markdown Toolbar */}
      <div className="flex items-center gap-1 p-2 border border-default rounded-lg bg-default/50 overflow-x-auto">
        <button
          type="button"
          onClick={() => insertFormatting('bold')}
          className="p-1.5 rounded hover:bg-card text-muted hover:text-primary transition-colors flex-shrink-0"
          title="Bold (Ctrl+B)"
        >
          <Bold size={16} />
        </button>

        <button
          type="button"
          onClick={() => insertFormatting('italic')}
          className="p-1.5 rounded hover:bg-card text-muted hover:text-primary transition-colors flex-shrink-0"
          title="Italic (Ctrl+I)"
        >
          <Italic size={16} />
        </button>

        <button
          type="button"
          onClick={() => insertFormatting('code')}
          className="p-1.5 rounded hover:bg-card text-muted hover:text-primary transition-colors flex-shrink-0"
          title="Inline Code"
        >
          <Code size={16} />
        </button>

        <div className="w-px h-4 bg-default mx-1 flex-shrink-0" />

        <button
          type="button"
          onClick={() => insertFormatting('h1')}
          className="p-1.5 rounded hover:bg-card text-muted hover:text-primary transition-colors flex-shrink-0"
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>

        <button
          type="button"
          onClick={() => insertFormatting('h2')}
          className="p-1.5 rounded hover:bg-card text-muted hover:text-primary transition-colors flex-shrink-0"
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>

        <button
          type="button"
          onClick={() => insertFormatting('h3')}
          className="p-1.5 rounded hover:bg-card text-muted hover:text-primary transition-colors flex-shrink-0"
          title="Heading 3"
        >
          <Heading3 size={16} />
        </button>

        <div className="w-px h-4 bg-default mx-1 flex-shrink-0" />

        <button
          type="button"
          onClick={() => insertFormatting('bullet')}
          className="p-1.5 rounded hover:bg-card text-muted hover:text-primary transition-colors flex-shrink-0"
          title="Bullet List"
        >
          <List size={16} />
        </button>

        <button
          type="button"
          onClick={() => insertFormatting('numbered')}
          className="p-1.5 rounded hover:bg-card text-muted hover:text-primary transition-colors flex-shrink-0"
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>

        <button
          type="button"
          onClick={() => insertFormatting('quote')}
          className="p-1.5 rounded hover:bg-card text-muted hover:text-primary transition-colors flex-shrink-0"
          title="Quote"
        >
          <Quote size={16} />
        </button>
      </div>

      {/* Editor Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-3 py-2 bg-default border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/50 text-primary resize-none font-content-base leading-relaxed ${className}`}
      />

      {/* Helper text */}
      <p className="text-xs text-muted">
        Supports Markdown: *italic*, **bold**, `code`, # headings, - bullets, 1. numbered lists
      </p>
    </div>
  );
}
