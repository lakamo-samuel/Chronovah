import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import type { Components } from "react-markdown";

export type MarkdownContentProps = {
  children: string;
  className?: string;
  /** "sm" renders slightly smaller text — useful inside modals/cards */
  size?: "sm" | "base";
  /** Rendered when children is empty or whitespace-only */
  emptyFallback?: string;
};

const components: Components = {
  // Open all links in a new tab
  a({ children, href, ...props }) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  },

  // Fenced code blocks with syntax highlighting; inline code stays plain
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || "");
    const isBlock = !!match;
    const code = String(children).replace(/\n$/, "");

    if (isBlock) {
      return (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          customStyle={{
            margin: 0,
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            fontFamily:
              '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          }}
        >
          {code}
        </SyntaxHighlighter>
      );
    }

    return (
      <code className="md-inline-code" {...props}>
        {children}
      </code>
    );
  },

  // Task-list checkboxes (GFM)
  input({ type, checked, ...props }) {
    if (type === "checkbox") {
      return (
        <input
          type="checkbox"
          checked={checked}
          readOnly
          className="md-task-checkbox"
          {...props}
        />
      );
    }
    return <input type={type} {...props} />;
  },
};

export default function MarkdownContent({
  children,
  className = "",
  size = "base",
  emptyFallback,
}: MarkdownContentProps) {
  const raw = children ?? "";
  const source = raw.trim() ? raw : (emptyFallback ?? "");

  return (
    <div className={`md-content ${size === "sm" ? "md-content-sm" : ""} ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {source}
      </ReactMarkdown>
    </div>
  );
}
