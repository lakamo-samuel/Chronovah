import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const proseSize = {
  sm: "prose prose-sm dark:prose-invert max-w-none font-content-sm prose-headings:font-ui-bold prose-headings:font-ui prose-p:leading-relaxed [&_code]:font-mono [&_pre]:font-mono",
  base: "prose dark:prose-invert max-w-none font-content-base prose-headings:font-ui-bold prose-headings:font-ui prose-p:leading-relaxed [&_code]:font-mono [&_pre]:font-mono",
} as const;

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
