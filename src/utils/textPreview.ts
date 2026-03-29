/**
 * Produce a plain-text, single-line preview by removing common markdown-like syntax and truncating to a maximum length.
 *
 * Removes fenced code blocks (```...```), inline code (`...`), common markdown punctuation characters, collapses newlines and repeated whitespace, and trims the result.
 *
 * @param content - The input text that may contain markdown-like syntax
 * @param maxLength - Maximum allowed length of the returned preview; defaults to 120
 * @returns The cleaned, single-line preview string; returns an empty string if nothing remains after stripping, and appends `...` when the result is truncated to `maxLength`
 */
export function stripMarkdownForPreview(
  content: string,
  maxLength = 120,
): string {
  const plainText = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/[#*`_~[\]()]/g, "")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plainText) return "";
  return plainText.length > maxLength
    ? `${plainText.slice(0, maxLength)}...`
    : plainText;
}
