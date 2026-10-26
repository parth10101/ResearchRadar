import React, { useMemo } from 'react';

interface HighlightedTitleProps {
  title: string;
  query?: string;
  className?: string;
}

interface TermHighlight {
  phrase: string;
  regex: RegExp;
  colorIdx: number;
}

const COLOR_STYLES = [
  {
    // Term 1: High-energy warm amber / flame
    bg: 'bg-[#ff4300]/25',
    text: 'text-[#ff8a50]',
    border: 'border-[#ff4300]',
    boxShadow: '0 0 10px rgba(255, 67, 0, 0.3)',
    textShadow: '0 0 8px rgba(255, 67, 0, 0.4)',
  },
  {
    // Term 2: Electric cyan / neon sky
    bg: 'bg-[#0284c7]/25',
    text: 'text-[#38bdf8]',
    border: 'border-[#38bdf8]',
    boxShadow: '0 0 10px rgba(56, 189, 248, 0.3)',
    textShadow: '0 0 8px rgba(56, 189, 248, 0.4)',
  },
  {
    // Term 3: Phosphor emerald
    bg: 'bg-[#059669]/25',
    text: 'text-[#34d399]',
    border: 'border-[#34d399]',
    boxShadow: '0 0 10px rgba(52, 211, 153, 0.3)',
    textShadow: '0 0 8px rgba(52, 211, 153, 0.4)',
  },
];

/**
 * Extracts distinct intact concept phrases from a search query,
 * preserving multi-word phrases across Boolean operators (AND, OR, NOT, &).
 */
function extractIntactPhrases(query?: string): TermHighlight[] {
  if (!query) return [];

  const q = query.trim();
  if (!q) return [];

  // Exclude terms from negative NOT clauses so only positive search targets are highlighted
  const notSplit = q.split(/\bNOT\b/i);
  const positivePart = notSplit[0] || q;

  const rawClauses: string[] = [];

  // 1. Check if positive query has explicit quotes
  const quotedMatches = positivePart.match(/\"([^\"]+)\"|\'([^\']+)\'/g);
  if (quotedMatches && quotedMatches.length > 0) {
    for (const qm of quotedMatches) {
      const clean = qm.replace(/[\"']/g, '').trim();
      if (clean) rawClauses.push(clean);
    }
  }

  // 2. Split on top-level Boolean operators (AND, OR, &)
  const opSplit = positivePart.split(/\b(?:AND|OR)\b|\s+&\s+/i);
  for (const part of opSplit) {
    const cleaned = part.replace(/[()[\]"{}]/g, ' ').trim();
    if (cleaned.length >= 2) {
      rawClauses.push(cleaned);
    }
  }

  // Deduplicate case-insensitively while preserving priority
  const seen = new Set<string>();
  const uniquePhrases: string[] = [];

  for (const clause of rawClauses) {
    const lower = clause.toLowerCase();
    // Exclude lone operators / stopwords
    if (['and', 'or', 'not', 'the', 'for', 'with', 'from', 'via', 'into'].includes(lower)) {
      continue;
    }
    if (!seen.has(lower)) {
      seen.add(lower);
      uniquePhrases.push(clause);
    }
  }

  // For 3+ word phrases (e.g. "Hyperspectral Image Processing"), also include core 2-word concept ("Hyperspectral Image")
  const expandedPhrases: string[] = [...uniquePhrases];
  for (const p of uniquePhrases) {
    const tokens = p.split(/\s+/);
    if (tokens.length >= 3) {
      const head = tokens.slice(0, 2).join(' ');
      if (!seen.has(head.toLowerCase())) {
        seen.add(head.toLowerCase());
        expandedPhrases.push(head);
      }
    }
  }

  // Sort by length descending so longer composite phrases match before shorter substrings
  expandedPhrases.sort((a, b) => b.length - a.length);

  return expandedPhrases.map((phrase, idx) => {
    // Build inflection & morphology-tolerant regex for matching the phrase in titles.
    // Handles all hyphens (-), en-dashes (–), em-dashes (—), underscores (_), and plurals (s, es, ies)
    const words = phrase.split(/[\s\-_–—]+/).filter(Boolean).map((w) => {
      const cleanW = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const lower = cleanW.toLowerCase();

      // Common acronym expansions
      if (/^gnns?$/i.test(lower)) {
        return '(?:gnns?|graph[\\s\\-_–—]+neural[\\s\\-_–—]+networks?)';
      }
      if (/^cnns?$/i.test(lower)) {
        return '(?:cnns?|convolutional[\\s\\-_–—]+neural[\\s\\-_–—]+networks?)';
      }
      if (/^vits?$/i.test(lower)) {
        return '(?:vits?|vision[\\s\\-_–—]+transformers?)';
      }
      if (/^kgs?$/i.test(lower)) {
        return '(?:kgs?|knowledge[\\s\\-_–—]+graphs?)';
      }

      // Morphological domain variants
      if (/^image(?:s|ry)?$/i.test(lower)) {
        return '(?:image|images|imagery)';
      }
      if (/^classif(?:y|ication|ications|ying|ied)?$/i.test(lower)) {
        return '(?:classification|classifications|classify|classifying)';
      }
      if (/^segment(?:ation|ations|ing|ed)?$/i.test(lower)) {
        return '(?:segmentation|segmentations|segment|segmenting)';
      }

      // Universal English singular / plural root:
      // 1. -ies <-> -y (e.g. "trajectories" <-> "trajectory", "methodologies" <-> "methodology", "properties" <-> "property")
      let base = cleanW;
      if (base.length > 4 && base.toLowerCase().endsWith('ies')) {
        const rootY = base.slice(0, -3);
        return `${rootY}(?:y|ies)`;
      }

      // 2. -es and -s stripping (e.g. "graphs" -> "graph", "networks" -> "network", "transformers" -> "transformer")
      if (base.length > 3 && base.toLowerCase().endsWith('es')) {
        base = base.slice(0, -2);
      } else if (base.length > 3 && base.toLowerCase().endsWith('s')) {
        base = base.slice(0, -1);
      }

      return `${base}(?:s|es)?`;
    });
    // Join with pattern matching spaces, hyphens, en-dashes, em-dashes, and underscores
    const patternStr = `\\b${words.join('[\\s\\-_–—]+')}\\b`;
    return {
      phrase,
      regex: new RegExp(patternStr, 'i'),
      colorIdx: idx % COLOR_STYLES.length,
    };
  });
}

/**
 * High-contrast, multi-phrase glowing academic keyword highlighter for paper titles.
 * Renders distinct color highlights for each Boolean term (e.g. "Deep learning" in Flame Amber,
 * "Image processing" in Cyan), proving exact phrase and semantic presence.
 */
export const HighlightedTitle: React.FC<HighlightedTitleProps> = ({
  title,
  query,
  className = '',
}) => {
  const phraseHighlights = useMemo(() => extractIntactPhrases(query), [query]);

  if (!title) return null;
  if (!phraseHighlights || phraseHighlights.length === 0) {
    return <span className={className}>{title}</span>;
  }

  // Combine all phrase regexes into a single capturing pattern
  const combinedPattern = new RegExp(
    `(${phraseHighlights.map((ph) => ph.regex.source).join('|')})`,
    'gi'
  );

  const parts = title.split(combinedPattern);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (!part) return null;

        // Check which phrase matched this token
        const matchObj = phraseHighlights.find((ph) => ph.regex.test(part));
        if (matchObj) {
          const style = COLOR_STYLES[matchObj.colorIdx];
          return (
            <mark
              key={i}
              className={`${style.bg} ${style.text} border-b-2 ${style.border} px-1.5 py-0.5 rounded font-semibold transition-all duration-200 inline-block`}
              style={{
                boxShadow: style.boxShadow,
                textShadow: style.textShadow,
              }}
              title={`Boolean Concept: "${matchObj.phrase}"`}
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
