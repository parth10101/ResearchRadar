export interface DatasetInfo {
  id: string;
  name: string;
  description: string;
  query: string;
  paper_count: number;
  has_archipelago: boolean;
  has_milestones: boolean;
  has_gaps: boolean;
  has_narration: boolean;
}

export interface Point3D {
  id: string;
  x: number;
  y: number;
  z: number;
  cluster_id: number;
  cluster_name: string;
  color: string;
  title: string;
  authors: string[];
  year: number;
  citations: number;
  venue: string;
  tldr: string;
  abstract: string;
  doi?: string;
}

export interface Cluster3D {
  cluster_id: number;
  name: string;
  color: string;
  point_count: number;
  centroid: { x: number; y: number; z: number };
  points: Point3D[];
}

export interface Gap3D {
  gap_id: string;
  rank: number;
  title: string;
  method: string;
  dataset: string;
  limitation: string;
  score: number;
  uzzi_z_score: number;
  description: string;
  source_cluster: number;
  target_cluster: number;
  centroid: { x: number; y: number; z: number };
}

export interface Points3DData {
  total_points: number;
  clusters: Cluster3D[];
  gaps_3d: Gap3D[];
  bounds: {
    min_x: number;
    max_x: number;
    min_y: number;
    max_y: number;
    min_z: number;
    max_z: number;
  };
}

export interface ArchipelagoPillar {
  id: string;
  title: string;
  authors: string[];
  year: number;
  citations: number;
  venue: string;
  tldr: string;
  abstract?: string;
  doi?: string;
}

export interface MacroCluster {
  cluster_id: number;
  name: string;
  keywords: string[];
  color: string;
  glow: string;
  x: number;
  y: number;
  radius: number;
  paper_count: number;
  pillars: ArchipelagoPillar[];
}

export interface MacroFilament {
  source_id: number;
  target_id: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  volume: number;
  width: number;
}

export interface ArchipelagoGap {
  gap_id: string;
  rank: number;
  title: string;
  method: string;
  dataset: string;
  limitation: string;
  breakthrough_score: number;
  uzzi_z_score: number;
  is_center_top?: boolean;
  macro_x: number;
  macro_y: number;
  role?: string;
  description: string;
  hypothesis?: string;
  anchor_a?: ArchipelagoPillar;
  anchor_b?: ArchipelagoPillar;
  realized?: boolean;
  verifying_paper_title?: string;
  verifying_paper_year?: number;
  rouge_l?: number;
}

export interface ArchipelagoData {
  macro_clusters: MacroCluster[];
  macro_filaments?: MacroFilament[];
  gaps?: ArchipelagoGap[];
}

export interface MilestoneItem {
  year: number;
  paper: {
    id: string;
    title: string;
    authors: any;
    venue: string;
    year: number;
    global_cits: number;
    abstract?: string;
    tldr?: string;
    doi?: string;
    arxiv_url?: string;
  };
}

export interface CitationData {
  cards: any[];
  milestones: MilestoneItem[];
}

export interface ResearchGap {
  gap_type: string;
  title: string;
  method: string;
  dataset: string;
  limitation: string;
  score: number;
  specificity_score?: number;
  literature_tier?: string;
  operational_hypothesis?: {
    task: string;
    task_plain?: string;
    methodology: string;
    method_plain?: string;
    dataset: string;
    dataset_plain?: string;
    constraint: string;
    constraint_plain?: string;
    epistemic_boundary: string;
    epistemic_plain?: string;
    hypothesis_statement: string;
    specificity_score: number;
    is_admissible: boolean;
    specificity_evaluation?: any;
  };
  uzzi_z_score: number;
  expected_cooccur: number;
  scientific_basis?: {
    paper: string;
    doi: string;
    formula: string;
    referee_verdict?: string;
    specificity_rigor?: string;
  };
  global_verification?: {
    is_unexplored: boolean;
    global_hit_count: number;
    confidence_score: number;
    literature_tier?: string;
    counterexamples: any[];
    verification_urls: {
      google_scholar: string;
      openalex: string;
      semantic_scholar: string;
      exact_search_query: string;
    };
    verification_notes: string;
  };
  domain_feasibility?: {
    is_compatible: boolean;
    rationale: string;
  };
  description: string;
  description_plain?: string;
  description_rigor?: string;
  papers_involved: string[];
  author_evidence?: {
    quoted_limitation: string;
    paper_title: string;
    paper_year: number;
    doi?: string;
    pdf_url?: string;
    donor_technique: string;
    donor_paper_title: string;
    donor_doi?: string;
    temporal_validation?: {
      status: string;
      badge: string;
      realizing_paper_title?: string;
      realizing_paper_year?: number;
    };
    wang_2026_fas_score: number;
    google_scholar_url: string;
  };
  realized?: boolean;
  verifying_paper_title?: string;
  verifying_paper_year?: number;
  rouge_l?: number;
}

export interface EvidencePaper {
  index: number;
  id: string;
  title: string;
  year: number;
  url?: string;
  venue?: string;
}

export interface NarratedGap extends ResearchGap {
  llm_narration: string;
  llm_model: string;
  llm_provider: string;
  evidence_papers?: EvidencePaper[];
  suggested_title?: string;
  c_obs?: string | number;
}

export interface PipelineProgressEvent {
  stage: number;
  stage_name: string;
  progress_pct: number;
  message: string;
  timestamp?: number;
  is_terminal?: boolean;
  status?: string;
  dataset_id?: string;
}
