import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const proseSize = {
  sm: "prose prose-sm dark:prose-invert max-w-none font-content-sm prose-headings:font-ui-bold prose-headings:font-ui prose-p:leading-relaxed [&_code]:font-mono [&_pre]:font-mono",
  base: "prose dark:prose-invert max-w-none font-content-base prose-headings:font-ui-bold prose-headings:font-ui prose-p:leading-relaxed [&_code]:font-mono [&_pre]:font-mono",
} as const;

/**
 * Render a syntax-highlighted code block.
 *
 * @param language - The Prism language identifier used for syntax highlighting (e.g., "javascript", "python").
 * @param value - The source code to render inside the highlighted block.
 * @returns A JSX element containing the highlighted code block
 */
function CodeBlock({ language, value }: { language: string; value: string }) {
  return (
    <SyntaxHighlighter
      style={vscDarkPlus}
      language={language}
      PreTag="div"
      customStyle={{
        margin: 0,
        borderRadius: "0.5rem",
        fontSize: "0.875rem",
        fontFamily:
          '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
      }}
    >
      {value}
    </SyntaxHighlighter>
  );
}

export type MarkdownContentProps = {
  children: string;
  size?: keyof typeof proseSize;
  className?: string;
  /** When `children` is empty or whitespace-only, render this as markdown instead. */
  emptyFallback?: string;
};

/**
 * Render Markdown source with selectable typography presets and syntax-highlighted fenced code blocks.
 *
 * Renders `children` (or `emptyFallback` when `children` is empty or whitespace) through ReactMarkdown,
 * applying the `proseSize` typography preset specified by `size`. Fenced code blocks with a `language-...`
 * class are rendered with syntax highlighting; other inline code is rendered with monospace styling.
 *
 * @param children - The Markdown source string to render. If empty or whitespace-only, `emptyFallback` is used.
 * @param size - Typography preset key to apply to the container (`"sm"` or `"base"`).
 * @param className - Additional CSS classes to append to the wrapper element.
 * @param emptyFallback - Optional Markdown string to render when `children` is empty or whitespace-only.
 * @returns A JSX element containing the rendered Markdown with highlighted code blocks and styled inline code.
 */
export default function MarkdownContent({
  children,
  size = "base",
  className = "",
  emptyFallback,
}: MarkdownContentProps) {
  const raw = children ?? "";
  const source = raw.trim() ? raw : (emptyFallback ?? "");

  return (
    <div className={`${proseSize[size]} ${className}`}>
      <ReactMarkdown
        components={{
          code({ className: codeClass, children }) {
            const match = /language-(\w+)/.exec(codeClass || "");
            const language = match ? match[1] : "text";
            const code = String(children).replace(/\n$/, "");

            return match ? (
              <CodeBlock language={language} value={code} />
            ) : (
              <code className="rounded bg-default px-1 py-0.5 font-mono text-sm">
                {children}
              </code>
            );
          },
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
