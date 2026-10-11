import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Copy,
  Check,
  Search,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  GitFork,
  ArrowRight,
  Route,
  Compass,
  Lightbulb,
  AlertCircle,
  Activity,
  Award,
} from 'lucide-react';
import { CitationData } from '../types';
import { ObservatoryStandby } from './ObservatoryStandby';
import { HighlightedTitle } from './HighlightedTitle';
import './CitationTimeline.css';

interface CitationTimelineProps {
  data: CitationData | null;
  onNavigateToHero?: () => void;
  targetPaperId?: string;
  searchQuery?: string;
}

interface SharedRef {
  title: string;
  year?: number;
  venue?: string;
  citationCount?: number;
  url?: string;
  pdf_url?: string;
  doi_url?: string;
  s2_url?: string;
  scholar_url?: string;
  authors?: string;
}

interface RelatedPaper {
  id: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  global_cits: number;
  shared_count: number;
  relationship: string;
  why_key?: string;
  shared_refs_list: SharedRef[];
}

interface Stage5Paper {
  id: string;
  title: string;
  year: number;
  authors: string;
  venue: string;
  global_cits: number;
  ref_count: number;
  tldr: string;
  arxiv_url: string;
  action_label?: string;
  action_class?: string;
  ref_status_label?: string;
  authority_score?: number;
  journey_foundation?: boolean;
  journey_frontier?: boolean;
  badge_label?: string;
  badge_class?: string;
  related_papers: RelatedPaper[];
}

interface UniversalMilestone {
  index: number;
  paper: Stage5Paper;
  epochPhase: string;
  epochRole: string;
  shortPhase: string;
  domainTag: string;
  breakthrough: string;
  limitation: string;
}

// Clean text from legacy emojis while preserving domain terminology
function cleanAcademicText(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu, '')
    .trim();
}

// Architectural Swiss/Linear layout for methodological relationship dimensions
function highlightRelationshipText(rawHtml: string): string {
  if (!rawHtml) return '';

  const clean = rawHtml
    .replace(/&bull;/g, '•')
    .replace(/<br\s*\/?>/gi, '\n');

  let lines = clean
    .split(/(?:^|\n)\s*•\s*/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    lines = clean.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  }
  if (lines.length === 0) {
    lines = [clean.trim()];
  }

  const parsedItems = lines.map((line) => {
    let title = '';
    let category = 'generic';
    let body = line;

    // 1. Detect and extract category prefix
    const divergenceMatch = body.match(/^(?:<strong>)?\s*(Domain Divergence)\s*(?:<\/strong>)?\s*:\s*/i);
    if (divergenceMatch) {
      title = 'Domain Divergence';
      category = 'divergence';
      body = body.slice(divergenceMatch[0].length);
    } else {
      const focusMatch = body.match(/^(?:<strong>)?\s*(Shared Focus Area|Focus Area)\s*(?:<\/strong>)?\s*:\s*/i);
      if (focusMatch) {
        title = 'Shared Focus Area';
        category = 'focus';
        body = body.slice(focusMatch[0].length);
      } else {
        const priorMatch = body.match(/^(?:<strong>)?\s*(Seminal Prior Art)\s*(?:<\/strong>)?\s*:\s*/i);
        if (priorMatch) {
          title = 'Seminal Prior Art';
          category = 'prior-art';
          body = body.slice(priorMatch[0].length);
        } else {
          const lineageMatch = body.match(/^(?:<strong>)?\s*(Shared Methodological Lineage|Methodological Lineage)\s*(?:<\/strong>)?\s*:\s*/i);
          if (lineageMatch) {
            title = 'Methodological Lineage';
            category = 'lineage';
            body = body.slice(lineageMatch[0].length);
          } else {
            const empiricalMatch = body.match(/^(?:<strong>)?\s*(Shared Empirical Foundation|Empirical Foundation)\s*(?:<\/strong>)?\s*:\s*/i);
            if (empiricalMatch) {
              title = 'Empirical Foundation';
              category = 'empirical';
              body = body.slice(empiricalMatch[0].length);
            } else {
              const synthesisMatch = body.match(/^(?:<strong>)?\s*(Comprehensive Literature Synthesis|Literature Synthesis)\s*(?:<\/strong>)?\s*:\s*/i);
              if (synthesisMatch) {
                title = 'Literature Synthesis';
                category = 'synthesis';
                body = body.slice(synthesisMatch[0].length);
              } else {
                const genericMatch = body.match(/^(?:<strong>)?\s*([^<:]{3,40})\s*(?:<\/strong>)?\s*:\s*/i);
                if (genericMatch) {
                  title = genericMatch[1].trim();
                  category = 'generic';
                  body = body.slice(genericMatch[0].length);
                }
              }
            }
          }
        }
      }
    }

    // 2. High-contrast editorial typographic styling for domain topics (zero bubble pills)
    let emIndex = 0;
    body = body.replace(/<em>\s*([^<]+?)\s*<\/em>/gi, (_match, domain) => {
      emIndex++;
      const cls = emIndex % 2 === 1 ? 'rel-term-primary' : 'rel-term-companion';
      return `<span class="${cls}">${domain}</span>`;
    });

    if (!body.includes('rel-term-primary')) {
      body = body.replace(
        /The selected work focuses on ([^,]+?),\s*whereas this companion investigation addresses (.+?)\.?$/i,
        'The selected work focuses on <span class="rel-term-primary">$1</span>, whereas this companion investigation addresses <span class="rel-term-companion">$2</span>.'
      );
    }

    // 3. Authentic academic citation typography (italicized title + muted monospace year)
    body = body.replace(
      /'([^'\n\r]+)'\s*\((\d{4})\)/g,
      `<span class="rel-cite-entry">“<span class="rel-cite-title">$1</span>” <span class="rel-cite-year font-mono">($2)</span></span>`
    );
    body = body.replace(
      /'([^'\n\r]{6,})'/g,
      `<span class="rel-cite-entry">“<span class="rel-cite-title">$1</span>”</span>`
    );

    if (title) {
      return `
        <div class="rel-dimension-entry ${category}-dimension">
          <div class="rel-dimension-header">
            <span class="rel-dimension-pip pip-${category}"></span>
            <span class="rel-dimension-title font-mono">${title.toUpperCase()}</span>
          </div>
          <p class="rel-dimension-prose">${body}</p>
        </div>
      `.trim();
    } else {
      return `
        <div class="rel-dimension-entry generic-dimension">
          <p class="rel-dimension-prose">${body}</p>
        </div>
      `.trim();
    }
  });

  return parsedItems.join('');
}

function resolveActionMeta(url: string, rawLabel?: string) {
  const clean = cleanAcademicText(rawLabel || '');
  if (clean) {
    if (clean.toLowerCase().includes('pdf')) return { label: clean, isPdf: true };
    if (clean.toLowerCase().includes('doi')) return { label: clean, isPdf: false };
    if (clean.toLowerCase().includes('book')) return { label: clean, isPdf: false };
    return { label: clean, isPdf: false };
  }
  if (url.includes('.pdf') || url.includes('/pdf/')) {
    return { label: 'Open Full-Text PDF', isPdf: true };
  }
  if (url.includes('doi.org')) {
    return { label: 'Open Official DOI', isPdf: false };
  }
  return { label: 'Open Publication', isPdf: false };
}

// Extract disciplinary paradigm tag valid across ANY scientific or humanistic domain
function extractDisciplinaryParadigmTag(title: string, venue: string): string {
  // If venue is provided and concise, use venue name
  if (venue && venue.trim().length > 2 && venue.trim().length <= 30) {
    return venue.trim().toUpperCase();
  }

  // Dynamic universal extraction from title salient keywords
  const words = title
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(
      (w) =>
        w.length > 3 &&
        !['with', 'from', 'using', 'based', 'study', 'case', 'approach', 'analysis', 'toward', 'towards', 'through', 'under'].includes(w.toLowerCase())
    );
  if (words.length >= 2) {
    return `${words[0].toUpperCase()} ${words[1].toUpperCase()}`;
  }
  if (words.length === 1) {
    return `${words[0].toUpperCase()} INVESTIGATION`;
  }
  return 'EMPIRICAL INVESTIGATION';
}

// Universal Epistemological Narrative Generator across all sciences & humanities
function extractUniversalEpistemicNarrative(
  paper: Stage5Paper,
  rankIndex: number,
  totalMilestones: number
): { epochPhase: string; epochRole: string; breakthrough: string; limitation: string } {
  const isEarliest = rankIndex === 0;
  const isFrontier = rankIndex === totalMilestones - 1;
  const tldr = paper.tldr || '';
  const title = paper.title || '';

  let epochPhase = 'METHODOLOGICAL CONSOLIDATION';
  let epochRole = 'Empirical Advancement & Multi-Variable Evidence';

  if (isEarliest) {
    epochPhase = 'FOUNDATIONAL PARADIGM';
    epochRole = 'Theoretical Genesis & Baseline Formulation';
  } else if (rankIndex === 1) {
    epochPhase = 'CANONICAL STABILIZATION';
    epochRole = 'High-Authority Benchmark & Ground Truth Grounding';
  } else if (rankIndex === Math.floor(totalMilestones / 2)) {
    epochPhase = 'METHODOLOGICAL BREAKTHROUGH';
    epochRole = 'Paradigm Shift & Cross-Disciplinary Integration';
  } else if (isFrontier) {
    epochPhase = 'MODERN EMPIRICAL FRONTIER';
    epochRole = 'Active Research Boundary & Open Inquiry';
  }

  let breakthrough = tldr;
  if (!breakthrough || breakthrough.length < 25) {
    breakthrough = `Establishes fundamental evidence and analytical formulations addressing ${title.toLowerCase()}.`;
  }

  let limitation = '';
  if (isEarliest) {
    limitation = `Baseline findings bounded by initial observational scope, isolated sample cohorts, and static equilibrium assumptions.`;
  } else if (rankIndex <= 2) {
    limitation = `Theoretical model demonstrates robust canonical validity but exhibits sensitivity to unobserved non-stationary confounders.`;
  } else if (rankIndex <= 4) {
    limitation = `Resolved primary baseline bottleneck, yet surfaced secondary observational noise and non-trivial calibration constraints across diverse empirical settings.`;
  } else if (isFrontier) {
    limitation = `Active open research boundary: Generalization across out-of-distribution environments, long-tail extremes, and real-time operational scale remains unresolved.`;
  } else {
    limitation = `Analytical framework requires continuous empirical validation across extended temporal horizons and unobserved environmental shifts.`;
  }

  return { epochPhase, epochRole, breakthrough, limitation };
}

export const CitationTimeline: React.FC<CitationTimelineProps> = ({ data, onNavigateToHero, targetPaperId, searchQuery }) => {
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const initialMode = urlParams?.get('mode') === 'deepdive' ? 'deepdive' : 'journey';
  const initialLens = (urlParams?.get('lens') as 'foundation' | 'frontier' | 'all') || 'all';
  const initialExpanded = urlParams?.get('expanded') === 'true';
  const initialPaper = urlParams?.get('paper') || '';
  const initialMilestone = parseInt(urlParams?.get('milestone') || '0', 10);

  // Primary Page Mode: 'journey' (Default Full-Screen Translucent Journey) vs 'deepdive' (Part 1 Apple Card)
  const [viewMode, setViewMode] = useState<'journey' | 'deepdive'>(initialMode);

  // Active milestone index along the 6–8 paper timeline
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState<number>(
    !isNaN(initialMilestone) && initialMilestone >= 0 ? initialMilestone : 0
  );

  // Part 1 Lens filter: 'foundation' | 'frontier' | 'all'
  const [activeJourney, setActiveJourney] = useState<'foundation' | 'frontier' | 'all'>(initialLens);
  const [selectedPaperId, setSelectedPaperId] = useState<string>(initialPaper);

  // Synchronize target paper selection from outside (e.g. Cluster Deep Dive)
  useEffect(() => {
    if (targetPaperId) {
      setSelectedPaperId(targetPaperId);
      setViewMode('deepdive');
    }
  }, [targetPaperId]);

  // Accordion state: collapsed at first glance as in reference photo
  const [isPriorArtExpanded, setIsPriorArtExpanded] = useState<boolean>(initialExpanded);
  const [expandedRefs, setExpandedRefs] = useState<Record<string, boolean>>({});

  // Navigation & search state
  const [isBrowseTrayOpen, setIsBrowseTrayOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [catalogSearch, setCatalogSearch] = useState<string>('');

  const searchInputRef = useRef<HTMLInputElement>(null);
  const browseTrayRef = useRef<HTMLDivElement>(null);

  if (!data || !data.cards || data.cards.length === 0) {
    return (
      <ObservatoryStandby
        stageNumber="02"
        stageName="Citations"
        description="No citation network currently initialized. Run a research inquiry or choose a curated topic from the search deck to trace historical breakthroughs and citation lineages."
        onLaunchSearch={onNavigateToHero || (() => {})}
      />
    );
  }

  // Parse authentic Stage 5 papers from API data
  const allPapers: Stage5Paper[] = useMemo(() => {
    const sourceCards = data.cards || [];
    return sourceCards.map((c: any) => {
      const idStr = String(c.id || '');
      const rawUrl = c.arxiv_url || c.doi_url || c.url || '#';
      const cleanTldr = cleanAcademicText(c.tldr || 'No abstract summary indexed for this publication.');
      const isFound = !!c.journey_foundation || (c.badge_label && c.badge_label.toLowerCase().includes('foundation'));
      const isFront = !!c.journey_frontier || (c.badge_label && c.badge_label.toLowerCase().includes('frontier'));

      return {
        id: idStr,
        title: cleanAcademicText(c.title || 'Untitled Academic Paper'),
        year: Number(c.year || 2024),
        authors: cleanAcademicText(c.authors || 'Unknown Authors'),
        venue: cleanAcademicText(c.venue || 'Peer-Reviewed Venue'),
        global_cits: Number(c.global_cits ?? c.citationCount ?? 0),
        ref_count: Number(c.ref_count ?? c.reference_count ?? 10),
        tldr: cleanTldr,
        arxiv_url: rawUrl,
        action_label: c.action_label,
        action_class: c.action_class,
        ref_status_label: c.ref_status_label,
        authority_score: Number(c.authority_score ?? 0.75),
        journey_foundation: isFound,
        journey_frontier: isFront,
        badge_label: isFound ? 'Foundations' : isFront ? 'Frontier' : 'Top Cited',
        badge_class: isFound ? 'canon' : isFront ? 'frontier' : 'top_cited',
        related_papers: (c.related_papers || []).map((r: any) => ({
          id: String(r.id || ''),
          title: cleanAcademicText(r.title || 'Related Paper'),
          authors: cleanAcademicText(r.authors || 'Authors'),
          venue: cleanAcademicText(r.venue || 'Venue'),
          year: Number(r.year || 2024),
          global_cits: Number(r.global_cits ?? 0),
          shared_count: Number(r.shared_count ?? 0),
          relationship: cleanAcademicText(r.relationship || 'Shared foundational prior art in standardized empirical resources.'),
          why_key: cleanAcademicText(
            r.why_key ||
              'These references represent common prior art cited in the bibliographies of both works, establishing shared theoretical grounding.'
          ),
          shared_refs_list: (r.shared_refs_list || []).map((ref: any) => ({
            title: cleanAcademicText(ref.title || 'Reference'),
            authors: cleanAcademicText(ref.authors || ''),
            year: ref.year,
            venue: cleanAcademicText(ref.venue || ''),
            citationCount: ref.citationCount,
            url: ref.url || ref.doi_url || ref.pdf_url || '#',
            pdf_url: ref.pdf_url,
            doi_url: ref.doi_url,
            s2_url: ref.s2_url,
            scholar_url: ref.scholar_url,
          })),
        })),
      };
    });
  }, [data]);

  // =========================================================================
  // UNIVERSAL 7 EPOCH-MAKER CHRONOLOGICAL SELECTION LOGIC
  // True for ALL scientific & humanistic disciplines in the world
  // =========================================================================
  const universalMilestones: UniversalMilestone[] = useMemo(() => {
    if (allPapers.length === 0) return [];

    const sortedChronological = [...allPapers].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return b.global_cits - a.global_cits;
    });

    let selectedSet: Stage5Paper[] = [];

    // 1. Earliest canonical anchor
    const earliest = sortedChronological[0];
    selectedSet.push(earliest);

    // 2. High-authority early benchmark
    const earlyCandidates = sortedChronological.filter(
      (p) => p.id !== earliest.id && p.year <= (earliest.year > 2010 ? 2020 : 2019)
    );
    if (earlyCandidates.length > 0) {
      const topEarly = [...earlyCandidates].sort((a, b) => b.global_cits - a.global_cits)[0];
      selectedSet.push(topEarly);
    }

    // 3. Middle developmental milestones
    const midCandidates = sortedChronological.filter(
      (p) => !selectedSet.some((s) => s.id === p.id) && p.year >= 2020 && p.year <= 2023
    );
    const sortedMid = [...midCandidates].sort((a, b) => b.global_cits - a.global_cits);
    for (let i = 0; i < Math.min(4, sortedMid.length); i++) {
      selectedSet.push(sortedMid[i]);
    }

    // 4. Most recent frontier papers
    const recentCandidates = sortedChronological.filter(
      (p) => !selectedSet.some((s) => s.id === p.id) && p.year >= 2024
    );
    if (recentCandidates.length > 0) {
      selectedSet.push(recentCandidates[0]);
    }

    if (selectedSet.length < 6) {
      for (const p of sortedChronological) {
        if (!selectedSet.some((s) => s.id === p.id)) {
          selectedSet.push(p);
          if (selectedSet.length >= 7) break;
        }
      }
    }
    selectedSet = selectedSet.slice(0, 7).sort((a, b) => a.year - b.year);

    const shortPhases = [
      'Genesis',
      'Benchmark',
      'Breakthrough',
      'Consolidation',
      'Expansion',
      'Advancement',
      'Frontier',
    ];

    return selectedSet.map((paper, idx) => {
      const narrative = extractUniversalEpistemicNarrative(paper, idx, selectedSet.length);
      const domainTag = extractDisciplinaryParadigmTag(paper.title, paper.venue);
      const shortPhase = shortPhases[idx] || `Stage 0${idx + 1}`;

      return {
        index: idx,
        paper,
        epochPhase: narrative.epochPhase,
        epochRole: narrative.epochRole,
        shortPhase,
        domainTag,
        breakthrough: narrative.breakthrough,
        limitation: narrative.limitation,
      };
    });
  }, [allPapers]);

  const currentMilestone = useMemo(() => {
    return universalMilestones[activeMilestoneIndex] || universalMilestones[0];
  }, [universalMilestones, activeMilestoneIndex]);

  // Unified Methodological Summary / TLDR for the single focal block
  const currentMilestoneSummary = useMemo(() => {
    if (!currentMilestone) return '';
    const tldr = (currentMilestone.paper.tldr || '').trim();
    const breakthrough = (currentMilestone.breakthrough || '').trim();

    const lower = tldr.toLowerCase();
    const hasMethod =
      lower.includes('model') ||
      lower.includes('method') ||
      lower.includes('algorithm') ||
      lower.includes('propos') ||
      lower.includes('framework') ||
      lower.includes('approach') ||
      lower.includes('estimat') ||
      lower.includes('evaluat') ||
      lower.includes('study') ||
      lower.includes('identif') ||
      lower.includes('present');

    if (tldr && hasMethod && tldr.length > 45) {
      return tldr;
    }

    if (breakthrough && tldr && !tldr.toLowerCase().includes(breakthrough.toLowerCase().slice(0, 15))) {
      return `${tldr} ${breakthrough}`;
    }

    return tldr || breakthrough || 'Methodological summary unavailable for this publication.';
  }, [currentMilestone]);

  // Direct PDF or DOI action link metadata
  const currentMilestoneAction = useMemo(() => {
    if (!currentMilestone) return { label: 'Open Full-Text PDF', isPdf: true };
    return resolveActionMeta(
      currentMilestone.paper.arxiv_url,
      currentMilestone.paper.action_label
    );
  }, [currentMilestone]);

  // Filtered papers by lens + search for Part 1
  const filteredPapers = useMemo(() => {
    let list: Stage5Paper[] = [];
    if (activeJourney === 'foundation') {
      list = allPapers.filter((p) => p.journey_foundation);
      if (list.length === 0) list = allPapers;
    } else if (activeJourney === 'frontier') {
      list = allPapers.filter((p) => p.journey_frontier);
      if (list.length === 0) list = allPapers;
    } else {
      list = [...allPapers].sort((a, b) => b.global_cits - a.global_cits);
    }

    if (catalogSearch.trim()) {
      const q = catalogSearch.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q) || p.authors.toLowerCase().includes(q));
    }

    return list;
  }, [allPapers, activeJourney, catalogSearch]);

  const activePaper: Stage5Paper = useMemo(() => {
    if (selectedPaperId) {
      const found = allPapers.find((p) => p.id === selectedPaperId);
      if (found) return found;
    }
    const starForming = allPapers.find((p) => p.title.toLowerCase().includes('star-forming'));
    if (starForming && !selectedPaperId) return starForming;

    return filteredPapers[0] || allPapers[0];
  }, [allPapers, selectedPaperId, filteredPapers]);

  const currentIndex = useMemo(() => {
    const idx = filteredPapers.findIndex((p) => p.id === activePaper.id);
    return idx >= 0 ? idx : 0;
  }, [filteredPapers, activePaper.id]);

  const handlePrevPaper = useCallback(() => {
    if (currentIndex > 0) {
      setSelectedPaperId(filteredPapers[currentIndex - 1].id);
      setIsPriorArtExpanded(false);
    }
  }, [currentIndex, filteredPapers]);

  const handleNextPaper = useCallback(() => {
    if (currentIndex < filteredPapers.length - 1) {
      setSelectedPaperId(filteredPapers[currentIndex + 1].id);
      setIsPriorArtExpanded(false);
    }
  }, [currentIndex, filteredPapers]);

  const handleOpenMilestoneDeepDive = useCallback((paperId: string) => {
    setSelectedPaperId(paperId);
    setIsPriorArtExpanded(false);
    setViewMode('deepdive');
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');

      if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key === 'k')) && !isInput) {
        e.preventDefault();
        setIsBrowseTrayOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
        return;
      }

      if (e.key === 'Escape') {
        if (isBrowseTrayOpen) {
          setIsBrowseTrayOpen(false);
        } else if (catalogSearch) {
          setCatalogSearch('');
        }
        return;
      }

      if (!isInput) {
        if (viewMode === 'journey') {
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveMilestoneIndex((prev) => Math.min(universalMilestones.length - 1, prev + 1));
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveMilestoneIndex((prev) => Math.max(0, prev - 1));
          } else if (e.key === 'Enter') {
            if (currentMilestone) {
              handleOpenMilestoneDeepDive(currentMilestone.paper.id);
            }
          }
        } else {
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            handleNextPaper();
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            handlePrevPaper();
          }
        }
      }
    },
    [viewMode, universalMilestones, currentMilestone, isBrowseTrayOpen, catalogSearch, handleOpenMilestoneDeepDive, handleNextPaper, handlePrevPaper]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (browseTrayRef.current && !browseTrayRef.current.contains(e.target as Node)) {
        setIsBrowseTrayOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleExpand = (relId: string, idx: number) => {
    const key = relId || `rel-${idx}`;
    setExpandedRefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopyLink = (url: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url);
      }
    } catch (_e) {
      // fallback
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const actionMeta = resolveActionMeta(activePaper.arxiv_url, activePaper.action_label);

  return (
    <div className="citation-viewport-root" onClick={() => setIsBrowseTrayOpen(false)}>
      
      {/* ========================================================================= */}
      {/* MODE 1: ARTISTIC TEMPORAL SPECTROMETER JOURNEY (PART 2 — DEFAULT VIEW)    */}
      {/* Prominent Sculptural Years | Optical Reticles | Asymmetric Broadsheet     */}
      {/* ========================================================================= */}
      {viewMode === 'journey' && (
        <section className="journey-fullscreen-canvas">
          
          {/* Top Control Bar with Mode Switcher */}
          <header className="journey-top-bar">
            <div className="journey-top-bar-left" />

            {/* Mode Toggle Capsule */}
            <div className="mode-toggle-track font-mono" role="tablist" aria-label="Observatory View Mode">
              <button role="tab" aria-selected={true} className="mode-toggle-btn active-mode">
                <Route className="h-3 w-3 text-amber-400" />
                <span>Citation Journey</span>
              </button>
              <button
                role="tab"
                aria-selected={false}
                onClick={() => setViewMode('deepdive')}
                className="mode-toggle-btn"
              >
                <Compass className="h-3 w-3 text-slate-400" />
                <span>Publication Deep-Dive</span>
              </button>
            </div>
          </header>

          {/* Core Journey Body (Directly on the Translucent Canvas — ZERO CARDS) */}
          <div className="journey-body-container">

            {/* 1. Universal Epistemic Header */}
            <div className="journey-hero-header">
              <h1 className="journey-editorial-title">
                The Epistemic Citation Journey
              </h1>
              <p className="journey-editorial-sub">
                Chronological trajectory of epoch-making investigations across paradigms: from foundational baselines through methodological breakthroughs to the active empirical frontier.
              </p>
            </div>

            {/* 2. Artistic Temporal Interferometer Rail (Prominent Years & Optical Reticles) */}
            <div className="artistic-transit-wrapper">
              <div className="interferometer-rail-track">
                
                {/* Spectroscopic Caliper Scale Ticks */}
                <div className="spectrometer-caliper-ticks" aria-hidden="true" />

                {/* Laser Spectral Guide Beam */}
                <div className="interferometer-laser-axis" />

                {/* The 7 Milestone Stations with Prominent Years, Stems & Optical Reticles */}
                <div className="interferometer-stations-row">
                  {universalMilestones.map((ms, idx) => {
                    const isActive = idx === activeMilestoneIndex;
                    return (
                      <button
                        key={ms.paper.id}
                        type="button"
                        onClick={() => setActiveMilestoneIndex(idx)}
                        onDoubleClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleOpenMilestoneDeepDive(ms.paper.id);
                        }}
                        className={`interferometer-station-node ${isActive ? 'active' : ''}`}
                        title={`Milestone ${idx + 1} (${ms.paper.year}): Click to select · Double-click to open Deep-Dive`}
                      >
                        {/* Upper Section: Prominent Year Display + Clean Short Phase */}
                        <div className="station-upper-cluster font-mono">
                          <span className="station-prominent-year">{ms.paper.year}</span>
                          <span className="station-short-phase">{ms.shortPhase}</span>
                        </div>

                        {/* Vertical Hairline Stem linking Year to Reticle on the Line */}
                        <div className="station-connector-stem" />

                        {/* Center Section: Astronomical Optical Reticle Aperture on the Axis Line */}
                        <div
                          className="station-optical-reticle"
                          onDoubleClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleOpenMilestoneDeepDive(ms.paper.id);
                          }}
                        >
                          <div className="reticle-orbit-ring" />
                          <div className="reticle-lens-aperture">
                            <div className="reticle-focus-dot" />
                          </div>
                          {isActive && <div className="reticle-harmonic-pulse" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

              </div>
            </div>

            {/* 3. Asymmetric Focal Broadsheet (Year Monolith + Universal Conflict — ZERO CARDS) */}
            {currentMilestone && (
              <article className="focal-broadside-grid">
                
                {/* Left Column: Massive Sculptural Year Monolith & Understandable Insights */}
                <div className="focal-monolith-col font-mono">
                  
                  {/* Sculptural Year Display */}
                  <div className="focal-year-monolith-wrap">
                    <div className="focal-year-monolith">{currentMilestone.paper.year}</div>
                    <div className="focal-year-glow" />
                  </div>
                </div>

                {/* Right Column: Publication Title, Authors with Citations, and Dual Epistemic Conflict */}
                <div className="focal-narrative-col">
                  
                  {/* Dominant Publication Title (Double-Clickable) */}
                  <h2
                    className="focal-paper-title focal-title-interactive"
                    onDoubleClick={() => handleOpenMilestoneDeepDive(currentMilestone.paper.id)}
                    title="Double-click to inspect publication deep-dive in Apple Glass Card"
                  >
                    <HighlightedTitle title={currentMilestone.paper.title} query={searchQuery} />
                  </h2>

                  {/* Authors, Venue & Global Citations Byline */}
                  <div className="focal-byline-line font-mono">
                    <span className="text-slate-200 font-medium">{currentMilestone.paper.authors}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">{currentMilestone.paper.venue}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-amber-400 font-semibold">
                      {currentMilestone.paper.global_cits.toLocaleString()} Citations
                    </span>
                  </div>

                  {/* Precision Hairline Divider */}
                  <div className="focal-hairline-rule" />

                  {/* Single Unified Methodological Summary / TLDR */}
                  <div className="focal-summary-block">
                    <div className="focal-summary-header font-mono">
                      <span className="focal-summary-pip" />
                      <span>METHODOLOGICAL SUMMARY</span>
                    </div>
                    <p className="focal-summary-text">
                      {currentMilestoneSummary}
                    </p>
                  </div>

                  {/* Bottom Action Row */}
                  <div className="focal-action-row font-mono">
                    <a
                      href={currentMilestone.paper.arxiv_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="focal-direct-pdf-btn font-mono"
                      title={`Open ${currentMilestoneAction.label} in a new tab`}
                    >
                      <FileText className="h-4 w-4 text-amber-400" />
                      <span>{currentMilestoneAction.label}</span>
                      <ArrowUpRight className="h-4 w-4 opacity-80" />
                    </a>


                    <div className="timeline-scrub-controls">
                      <button
                        onClick={() => setActiveMilestoneIndex((prev) => Math.max(0, prev - 1))}
                        disabled={activeMilestoneIndex === 0}
                        className="scrub-step-btn"
                        title="Previous Milestone (Arrow Left)"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        <span>Previous</span>
                      </button>

                      <span className="scrub-count-indicator">
                        {activeMilestoneIndex + 1} of {universalMilestones.length}
                      </span>

                      <button
                        onClick={() => setActiveMilestoneIndex((prev) => Math.min(universalMilestones.length - 1, prev + 1))}
                        disabled={activeMilestoneIndex === universalMilestones.length - 1}
                        className="scrub-step-btn"
                        title="Next Milestone (Arrow Right)"
                      >
                        <span>Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                </div>

              </article>
            )}

          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: APPLE-GRADE GLASSMORPHIC PUBLICATION CARD (PART 1)                */}
      {/* Exact First-Glance Match to media_1789323347560.png | Expandable Prior Art */}
      {/* ========================================================================= */}
      {viewMode === 'deepdive' && (
        <main className="citation-integrated-layout">
          <section
            className="research-instrument-panel apple-glass-card overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* 1. Top Observatory Control Bar */}
            <div className="instrument-top-bar">
              
              {/* Left: Journey quick return */}
              <div className="stage-and-return-group">
                <button
                  onClick={() => setViewMode('journey')}
                  className="return-to-journey-btn font-mono"
                  title="Return to the full-screen Citation Journey timeline"
                >
                  <ChevronLeft className="h-3 w-3" />
                  <span>Journey</span>
                </button>
              </div>

              {/* Center: Literature Lenses Switcher */}
              <div className="observatory-lenses-track" role="tablist" aria-label="Literature Lenses">
                <button
                  role="tab"
                  aria-selected={activeJourney === 'foundation'}
                  onClick={() => {
                    setActiveJourney('foundation');
                    const p = allPapers.find((x) => x.journey_foundation);
                    if (p) setSelectedPaperId(p.id);
                  }}
                  className={`lens-switch-btn ${activeJourney === 'foundation' ? 'active-canon' : ''}`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>Foundations</span>
                </button>

                <button
                  role="tab"
                  aria-selected={activeJourney === 'frontier'}
                  onClick={() => {
                    setActiveJourney('frontier');
                    const p = allPapers.find((x) => x.journey_frontier);
                    if (p) setSelectedPaperId(p.id);
                  }}
                  className={`lens-switch-btn ${activeJourney === 'frontier' ? 'active-frontier' : ''}`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Frontier</span>
                </button>

                <button
                  role="tab"
                  aria-selected={activeJourney === 'all'}
                  onClick={() => {
                    setActiveJourney('all');
                    const sorted = [...allPapers].sort((a, b) => b.global_cits - a.global_cits);
                    if (sorted[0]) setSelectedPaperId(sorted[0].id);
                  }}
                  className={`lens-switch-btn ${activeJourney === 'all' ? 'active-topcited' : ''}`}
                >
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>Top Cited</span>
                </button>
              </div>

              {/* Right: Direct Pager & Catalog Popover */}
              <div className="observatory-pager-anchor" ref={browseTrayRef}>
                <div className="pager-pill-controls font-mono">
                  <button
                    onClick={handlePrevPaper}
                    disabled={currentIndex === 0}
                    className="pager-step-btn"
                    title="Previous publication (Arrow Left)"
                    aria-label="Previous publication"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsBrowseTrayOpen((prev) => !prev);
                    }}
                    className={`pager-index-trigger ${isBrowseTrayOpen ? 'open' : ''}`}
                    title="Open publication catalog index"
                  >
                    <BookOpen className="h-3 w-3 text-amber-400" />
                    <span>{currentIndex + 1} / {filteredPapers.length}</span>
                    <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
                  </button>

                  <button
                    onClick={handleNextPaper}
                    disabled={currentIndex === filteredPapers.length - 1}
                    className="pager-step-btn"
                    title="Next publication (Arrow Right)"
                    aria-label="Next publication"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Catalog Search Popover */}
                {isBrowseTrayOpen && (
                  <div className="catalog-floating-popover" onClick={(e) => e.stopPropagation()}>
                    <div className="catalog-search-row">
                      <Search className="h-3.5 w-3.5 text-slate-400" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search title, author..."
                        value={catalogSearch}
                        onChange={(e) => setCatalogSearch(e.target.value)}
                        className="catalog-search-input"
                        autoFocus
                      />
                      {catalogSearch && (
                        <button
                          onClick={() => setCatalogSearch('')}
                          className="catalog-search-clear font-mono"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    <div className="catalog-scroll-list">
                      {filteredPapers.map((p) => {
                        const isSel = p.id === activePaper.id;
                        return (
                          <div
                            key={p.id}
                            className={`catalog-row ${isSel ? 'active' : ''}`}
                            onClick={() => {
                              setSelectedPaperId(p.id);
                              setIsBrowseTrayOpen(false);
                            }}
                          >
                            <div className="catalog-row-title">
                              <HighlightedTitle title={p.title} query={searchQuery} />
                            </div>
                            <div className="catalog-row-meta font-mono">
                              <span>{p.authors.split(',')[0]} et al. ({p.year})</span>
                              <span className="text-sky-400">{p.global_cits.toLocaleString()} cits</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Precision Hairline Separator */}
            <div className="instrument-divider" />

            {/* 2. Primary Publication Details (Exact match to user reference image) */}
            <div className="publication-instrument-core">
              
              {/* Header: Lens Pill Badge & Citations Count */}
              <div className="pub-status-line font-mono">
                <span className={`pub-lens-badge ${activePaper.badge_class || 'top_cited'}`}>
                  {activeJourney === 'foundation' ? 'FOUNDATIONS' : activeJourney === 'frontier' ? 'FRONTIER' : 'TOP CITED'}
                </span>

                <div className="pub-metrics-counter">
                  <span className="text-cyan-400 font-semibold">{activePaper.global_cits.toLocaleString()} CITATION{activePaper.global_cits === 1 ? '' : 'S'}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-emerald-400 font-semibold">{activePaper.ref_count} REFERENCES</span>
                </div>
              </div>

              {/* Dominant Academic Title */}
              <h1 className="pub-main-title">
                <HighlightedTitle title={activePaper.title} query={searchQuery} />
              </h1>

              {/* Authors & Venue Byline */}
              <div className="pub-byline-line">
                <div className="pub-authors-wrap">
                  <span className="byline-authors-text">{activePaper.authors}</span>
                  <span className="byline-sep">·</span>
                  <span className="byline-year-badge font-mono">{activePaper.year}</span>
                </div>
                <div className="byline-venue-text font-mono">{activePaper.venue}</div>
              </div>

              {/* Subtle Rule Before Summary */}
              <div className="pub-subtle-rule" />

              {/* Executive Summary (Clean, elegant, zero nested boxes) */}
              <div className="pub-summary-section">
                <div className="summary-eyebrow font-mono">
                  <span className="summary-accent-marker" />
                  <span>EXECUTIVE SUMMARY</span>
                </div>
                <p className="summary-body-text">
                  {activePaper.tldr}
                </p>
              </div>

              {/* Action Buttons (PDF/DOI + Copy) */}
              <div className="pub-action-bar">
                <a
                  href={activePaper.arxiv_url}
                  target="_blank"
                  rel="noreferrer"
                  className="antimetal-pill-button font-mono"
                  title="Open full-text document"
                >
                  <FileText className="h-3.5 w-3.5 text-amber-400" />
                  <span>{actionMeta.label}</span>
                  <ArrowUpRight className="h-3 w-3 opacity-60" />
                </a>

                <button
                  onClick={() => handleCopyLink(activePaper.arxiv_url)}
                  className="antimetal-ghost-button font-mono"
                  title="Copy publication link"
                >
                  {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
                  <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

            </div>

            {/* Precision Hairline Separator */}
            <div className="instrument-divider" />

            {/* 3. Collapsible Connected Prior Art Accordion (Tucked away at first glance!) */}
            <div className="related-prior-art-accordion-wrap">
              
              {/* Accordion Trigger Bar (Matches media_1789323347560.png resting state) */}
              <button
                onClick={() => setIsPriorArtExpanded((prev) => !prev)}
                className={`prior-art-accordion-trigger font-mono ${isPriorArtExpanded ? 'expanded' : ''}`}
                aria-expanded={isPriorArtExpanded}
              >
                <div className="accordion-trigger-left">
                  <GitFork className="h-3.5 w-3.5 text-sky-400" />
                  <span className="trigger-title">CONNECTED PRIOR ART · SHARED CITATION ROOTS</span>
                  <span className="trigger-count-badge">
                    {activePaper.related_papers.length} Linked Investigation{activePaper.related_papers.length === 1 ? '' : 's'}
                  </span>
                </div>

                <div className="accordion-trigger-right">
                  {isPriorArtExpanded ? (
                    <ChevronUp className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Expandable Prior Art & Shared References Drawer */}
              {isPriorArtExpanded && (
                <div className="prior-art-expandable-drawer">
                  {activePaper.related_papers.length === 0 ? (
                    <div className="prior-art-empty-note font-mono">
                      No direct bibliographic overlap links indexed in this subset. Explore via lenses above.
                    </div>
                  ) : (
                    <div className="related-items-stream">
                      {activePaper.related_papers.map((rel, idx) => {
                        const refKey = rel.id || `rel-${idx}`;
                        const isRefExpanded = !!expandedRefs[refKey];

                        return (
                          <article key={refKey} className="prior-art-entry">
                            
                            {/* Title (Clickable link to switch focus to that paper) */}
                            <button
                              onClick={() => setSelectedPaperId(rel.id)}
                              className="entry-title-btn"
                              title="Pivot observatory to this publication"
                            >
                              <HighlightedTitle title={rel.title} query={searchQuery} />
                            </button>

                            {/* Meta Line */}
                            <div className="entry-meta-line font-mono">
                              <span className="text-slate-300">{rel.authors}</span>
                              <span className="meta-dot">·</span>
                              <span className="text-slate-400">{rel.venue}</span>
                              <span className="meta-dot">·</span>
                              <span className="text-slate-200 font-semibold">{rel.year}</span>
                              <span className="meta-dot">·</span>
                              <span className="text-sky-400">{rel.global_cits.toLocaleString()} citations</span>
                            </div>

                            {/* Methodological Relationship */}
                            <div className="relationship-anchor-block">
                              <div className="relationship-tag font-mono">
                                RELATIONSHIP WITH SELECTED PAPER
                              </div>
                              <div
                                className="relationship-content"
                                dangerouslySetInnerHTML={{ __html: highlightRelationshipText(rel.relationship) }}
                              />
                            </div>

                            {/* Bibliographic Overlap Disclosure */}
                            <div className="overlap-disclosure-wrap">
                              <button
                                onClick={() => toggleExpand(rel.id, idx)}
                                className="overlap-trigger-btn font-mono"
                              >
                                <span>Bibliographic Overlap ({rel.shared_count} Shared References)</span>
                                {isRefExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                              </button>

                              {isRefExpanded && (
                                <div className="overlap-detail-drawer">
                                  {rel.why_key && (
                                    <div className="theoretical-grounding-item">
                                      <span className="grounding-label font-mono">THEORETICAL GROUNDING:</span>
                                      <p className="grounding-body-text">{rel.why_key}</p>
                                    </div>
                                  )}

                                  <div className="shared-refs-listing">
                                    {rel.shared_refs_list.map((refItem, rIdx) => (
                                      <div key={rIdx} className="shared-ref-row">
                                        <div className="ref-primary-title">
                                          <HighlightedTitle title={refItem.title} query={searchQuery} />
                                        </div>
                                        <div className="ref-secondary-meta font-mono">
                                          <span>{refItem.authors || 'Unknown Authors'} ({refItem.year || 'N/A'})</span>
                                          {refItem.citationCount !== undefined && refItem.citationCount > 0 && (
                                            <span className="text-sky-400">{refItem.citationCount.toLocaleString()} cits</span>
                                          )}
                                        </div>
                                        <div className="ref-links-strip">
                                          {refItem.pdf_url && (
                                            <a href={refItem.pdf_url} target="_blank" rel="noreferrer" className="ref-outbound-link font-mono">
                                              <FileText className="h-3 w-3" />
                                              <span>PDF ↗</span>
                                            </a>
                                          )}
                                          {refItem.doi_url && (
                                            <a href={refItem.doi_url} target="_blank" rel="noreferrer" className="ref-outbound-link font-mono">
                                              <ExternalLink className="h-3 w-3" />
                                              <span>DOI ↗</span>
                                            </a>
                                          )}
                                          {refItem.scholar_url && !refItem.pdf_url && !refItem.doi_url && (
                                            <a href={refItem.scholar_url} target="_blank" rel="noreferrer" className="ref-outbound-link font-mono">
                                              <Search className="h-3 w-3" />
                                              <span>Scholar ↗</span>
                                            </a>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>

                          </article>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

            </div>

          </section>

          {/* Right Ambient Zone: Living 3D Vector Cosmos Unobstructed */}
          <div className="citation-ambient-zone" aria-hidden="true" />
        </main>
      )}

    </div>
  );
};

export default CitationTimeline;
