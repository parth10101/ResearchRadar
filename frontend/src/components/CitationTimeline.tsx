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
  abstract?: string;
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
  const [summaryViewMode, setSummaryViewMode] = useState<'summary' | 'abstract'>('summary');

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

  // Corpus papers in descending order of citation count
  const sortedCorpusPapers: Stage5Paper[] = useMemo(() => {
    return [...allPapers].sort((a, b) => (b.global_cits ?? 0) - (a.global_cits ?? 0));
  }, [allPapers]);

  // Scroll to selected paper if opened with targetPaperId
  useEffect(() => {
    if (viewMode === 'deepdive' && selectedPaperId) {
      const el = document.getElementById(`paper-row-${selectedPaperId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [viewMode, selectedPaperId]);

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
    const title = (currentMilestone.paper.title || '').trim();
    const tldr = (currentMilestone.paper.tldr || '').trim();
    const abstract = (currentMilestone.paper.abstract || '').trim();
    const breakthrough = (currentMilestone.breakthrough || '').trim();

    const isTitleDuplicate = tldr.toLowerCase() === title.toLowerCase() || tldr.length <= 15;

    if (!isTitleDuplicate && tldr && tldr.length > 35) {
      return tldr;
    }

    if (abstract && abstract.length > 40) {
      // Extract primary contribution sentences from abstract
      const sentences = abstract.split(/(?<=[.!?])\s+/);
      const contrib = sentences.find((s) =>
        /we propose|we introduce|we develop|this paper|in this|our approach|results show|demonstrates/i.test(s)
      );
      if (contrib && contrib.length > 30) {
        return contrib;
      }
      return sentences.slice(0, 2).join(' ');
    }

    if (breakthrough && breakthrough !== 'None') {
      return breakthrough;
    }

    return tldr || 'Methodological summary unavailable for this publication.';
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

                  {/* Single Unified Methodological Summary / TLDR & Full Abstract */}
                  <div className="focal-summary-block">
                    <div className="focal-summary-header font-mono flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="focal-summary-pip" />
                        <span>{summaryViewMode === 'abstract' ? 'ORIGINAL PUBLICATION ABSTRACT' : 'METHODOLOGICAL SUMMARY'}</span>
                      </div>
                      {currentMilestone.paper.abstract && (
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <button
                            type="button"
                            onClick={() => setSummaryViewMode('summary')}
                            className={`px-2 py-0.5 rounded transition-all cursor-pointer font-mono ${
                              summaryViewMode === 'summary'
                                ? 'bg-[#ff4300]/25 text-[#ff8a50] font-bold border border-[#ff4300]/50'
                                : 'text-zinc-400 hover:text-white bg-white/[0.04]'
                            }`}
                          >
                            Summary
                          </button>
                          <button
                            type="button"
                            onClick={() => setSummaryViewMode('abstract')}
                            className={`px-2 py-0.5 rounded transition-all cursor-pointer font-mono ${
                              summaryViewMode === 'abstract'
                                ? 'bg-[#ff4300]/25 text-[#ff8a50] font-bold border border-[#ff4300]/50'
                                : 'text-zinc-400 hover:text-white bg-white/[0.04]'
                            }`}
                          >
                            Full Abstract
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="focal-summary-text">
                      <HighlightedTitle
                        title={
                          summaryViewMode === 'abstract' && currentMilestone.paper.abstract
                            ? currentMilestone.paper.abstract
                            : currentMilestoneSummary
                        }
                        query={searchQuery}
                      />
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
      {/* MODE 2: PUBLICATION DEEP DIVE — CORPUS PAPERS (DESCENDING CITATIONS)      */}
      {/* Central-aligned Apple-grade glassmorphic layout                           */}
      {/* ========================================================================= */}
      {viewMode === 'deepdive' && (
        <main className="citation-integrated-layout">
          <section
            className="research-instrument-panel apple-glass-card custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Navigation & Header Bar */}
            <div className="instrument-top-bar">
              {/* Left: Journey return button */}
              <div className="stage-and-return-group">
                <button
                  onClick={() => setViewMode('journey')}
                  className="return-to-journey-btn font-mono"
                  title="Return to the full-screen Citation Journey timeline"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Journey</span>
                </button>
              </div>

              {/* Center/Right: Deep Dive Title and Count Badge */}
              <div className="deepdive-header-meta font-mono">
                <span className="deepdive-header-title">CORPUS PUBLICATIONS</span>
                <span className="deepdive-header-badge">
                  {sortedCorpusPapers.length} Papers · Ranked by Citation Count
                </span>
              </div>
            </div>

            {/* Precision Hairline Separator */}
            <div className="instrument-divider" />

            {/* Plain List of Corpus Papers in Descending Order of Citation Count */}
            <div className="corpus-papers-list">
              {sortedCorpusPapers.map((paper, index) => {
                const actionMeta = resolveActionMeta(paper.arxiv_url, paper.action_label);
                const isSelected = selectedPaperId === paper.id;

                return (
                  <article
                    key={paper.id || `paper-${index}`}
                    id={`paper-row-${paper.id}`}
                    className={`corpus-paper-row ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedPaperId(paper.id)}
                  >
                    <div className="corpus-paper-rank-col font-mono">
                      <span className="corpus-paper-rank">#{index + 1}</span>
                    </div>

                    <div className="corpus-paper-main-col">
                      <div className="corpus-paper-top-row">
                        <div className="corpus-paper-cits-pill font-mono">
                          <span className="cits-count">
                            {paper.global_cits.toLocaleString()}
                          </span>
                          <span className="cits-label">
                            {paper.global_cits === 1 ? 'CITATION' : 'CITATIONS'}
                          </span>
                          {paper.ref_count > 0 && (
                            <>
                              <span className="cits-sep">·</span>
                              <span className="refs-count">
                                {paper.ref_count} REFERENCES
                              </span>
                            </>
                          )}
                        </div>

                        {paper.arxiv_url && paper.arxiv_url !== '#' && (
                          <a
                            href={paper.arxiv_url}
                            target="_blank"
                            rel="noreferrer"
                            className="corpus-paper-action-btn font-mono"
                            title="Open publication document"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FileText className="h-3.5 w-3.5 text-amber-400" />
                            <span>{actionMeta.label}</span>
                            <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                          </a>
                        )}
                      </div>

                      <h2 className="corpus-paper-title">
                        {paper.arxiv_url && paper.arxiv_url !== '#' ? (
                          <a
                            href={paper.arxiv_url}
                            target="_blank"
                            rel="noreferrer"
                            className="corpus-title-link"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <HighlightedTitle title={paper.title} query={searchQuery} />
                          </a>
                        ) : (
                          <HighlightedTitle title={paper.title} query={searchQuery} />
                        )}
                      </h2>

                      <div className="corpus-paper-byline font-mono">
                        <span className="corpus-authors-text">{paper.authors}</span>
                        <span className="corpus-byline-sep">·</span>
                        <span className="corpus-year-text">{paper.year}</span>
                        {paper.venue && (
                          <>
                            <span className="corpus-byline-sep">·</span>
                            <span className="corpus-venue-text">{paper.venue}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </main>
      )}

    </div>
  );
};

export default CitationTimeline;
