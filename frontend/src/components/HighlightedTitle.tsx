import React, { useMemo } from 'react';

interface HighlightedTitleProps {
  title: string;
  query?: string;
  className?: string;
}

/**
 * Extracts distinct keyword phrases from a search query,
 * filtering out boolean operators (AND, OR, NOT) and common noise words.
 */
function extractKeywords(query?: string): string[] {
  if (!query) return [];

  // Remove boolean operators
  const stripped = query
    .replace(/\b(AND|OR|NOT|and|or|not)\b/g, ' ')
    .replace(/[()[\]"{}]/g, ' ')
    .trim();

  // Split into tokens/phrases
  const rawTokens = stripped.split(/\s+/).map((t) => t.trim()).filter((t) => t.length >= 3);

  // Deduplicate case-insensitively
  const unique = new Map<string, string>();
  for (const t of rawTokens) {
    const lower = t.toLowerCase();
    // Exclude common noise/stopwords
    if (!['the', 'and', 'for', 'with', 'from', 'this', 'that', 'via'].includes(lower)) {
      if (!unique.has(lower)) {
        unique.set(lower, t);
      }
    }
  }

  // Sort by length descending so longer phrases match first
  return Array.from(unique.values()).sort((a, b) => b.length - a.length);
}

/**
 * High-contrast, glowing academic keyword highlighter for paper titles.
 * Ensures the PhD committee sees searched keywords instantly highlighted in every paper title.
 */
export const HighlightedTitle: React.FC<HighlightedTitleProps> = ({
  title,
  query,
  className = '',
}) => {
  const keywords = useMemo(() => extractKeywords(query), [query]);

  if (!title) return null;
  if (!keywords || keywords.length === 0) {
    return <span className={className}>{title}</span>;
  }

  // Build safe regex pattern escaping special characters
  const escaped = keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const pattern = new RegExp(`(${escaped.join('|')})`, 'gi');

  const parts = title.split(pattern);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        const isMatch = keywords.some(
          (k) => k.toLowerCase() === part.toLowerCase()
        );
        if (isMatch) {
          return (
            <mark
              key={i}
              className="bg-[#ff4300]/25 text-[#ff8a50] border-b-2 border-[#ff4300] px-1 py-0.5 rounded font-semibold transition-all duration-200"
              style={{
                boxShadow: '0 0 10px rgba(255, 67, 0, 0.25)',
                textShadow: '0 0 8px rgba(255, 67, 0, 0.4)',
              }}
            >
              {part}
            </mark>
          );
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </span>
  );
};

export default HighlightedTitle;
