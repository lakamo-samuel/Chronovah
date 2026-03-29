/** Strip markdown-ish syntax for short list/card previews (not full MD parsing). */
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
