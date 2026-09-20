/**
 * ResearchRadar — SpatialJourneyController
 * ========================================
 * Core orchestration state machine for post-Epistemic cinematic spatial exploration.
 *
 * Scales:
 *   universe ◄► cluster ◄► paper ◄► citation ◄► evidence ◄► gap ◄► deep
 *
 * GUARANTEES:
 * - Completely inactive and locked during Home observatory and the 2.4s Home -> Epistemic transition.
 * - Zero particle mutations. Zero shader alterations. Zero analytical coordinate modifications.
 * - Single source of truth for post-Epistemic spatial scale, selection context, and transition progress.
 */

import { useState, useEffect } from 'react';

export type SpatialScale =
  | 'universe'
  | 'cluster'
  | 'paper'
  | 'citation'
  | 'evidence'
  | 'gap'
  | 'deep';

export const SPATIAL_SCALE_SEQUENCE: readonly SpatialScale[] = [
  'universe',
  'cluster',
  'paper',
  'citation',
  'evidence',
  'gap',
  'deep',
] as const;

export interface JourneySelectionContext {
  clusterId: string | null;
  paperId: string | null;
  citationId: string | null;
  evidenceId: string | null;
  gapId: string | null;
}

export interface SpatialJourneyState {
  currentScale: SpatialScale;
  targetScale: SpatialScale | null;
  isTransitioning: boolean;
  progress: number; // 0.0 to 1.0
  direction: 'forward' | 'reverse' | 'idle';
  context: JourneySelectionContext;
  isHomeLocked: boolean; // True during Stage 00 and Home -> Epistemic transition
}

export type JourneyListener = (state: SpatialJourneyState) => void;

class SpatialJourneyController {
  private state: SpatialJourneyState = {
    currentScale: 'universe',
    targetScale: null,
    isTransitioning: false,
    progress: 1.0,
    direction: 'idle',
    context: {
      clusterId: null,
      paperId: null,
      citationId: null,
      evidenceId: null,
      gapId: null,
    },
    isHomeLocked: true, // Initially locked until Epistemic mode is active and settled
  };

  private listeners: Set<JourneyListener> = new Set();
  private animFrameId: number | null = null;
  private transitionStartTime: number = 0;
  private transitionDuration: number = 2400; // ms

  // Subscribe to state updates
  public subscribe(listener: JourneyListener): () => void {
    this.listeners.add(listener);
    listener(this.getSnapshot());
    return () => this.listeners.delete(listener);
  }

  // Get current state snapshot
  public getSnapshot(): SpatialJourneyState {
    return {
      ...this.state,
      context: { ...this.state.context },
    };
  }

  private notify() {
    const snapshot = this.getSnapshot();
    this.listeners.forEach((fn) => fn(snapshot));

    // Also dispatch lightweight custom event for decoupled systems
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('rr-journey-state-change', {
          detail: snapshot,
        })
      );
    }
  }

  // Set Home lock status (called from App.tsx / stage orchestrator)
  public setHomeLocked(locked: boolean) {
    if (this.state.isHomeLocked === locked) return;
    this.state.isHomeLocked = locked;
    if (locked) {
      this.cancelTransition();
      this.state.currentScale = 'universe';
      this.state.targetScale = null;
      this.state.isTransitioning = false;
      this.state.progress = 1.0;
      this.state.direction = 'idle';
    }
    this.notify();
  }

  // Set contextual selection identities
  public setContext(partial: Partial<JourneySelectionContext>) {
    this.state.context = {
      ...this.state.context,
      ...partial,
    };
    this.notify();
  }

  // Select a specific cluster and optionally navigate to 'cluster' scale
  public selectCluster(clusterId: string | null, autoNavigate: boolean = false) {
    this.state.context.clusterId = clusterId;
    if (!clusterId) {
      this.state.context.paperId = null;
    }
    this.notify();
    if (autoNavigate && clusterId && !this.state.isHomeLocked) {
      this.navigateTo('cluster');
    }
  }

  // Select a specific paper and optionally navigate to 'paper' scale
  public selectPaper(paperId: string | null, autoNavigate: boolean = false) {
    this.state.context.paperId = paperId;
    this.notify();
    if (autoNavigate && paperId && !this.state.isHomeLocked) {
      this.navigateTo('paper');
    }
  }

  // Select a research gap and optionally navigate to 'gap' scale
  public selectGap(gapId: string | null, autoNavigate: boolean = false) {
    this.state.context.gapId = gapId;
    this.notify();
    if (autoNavigate && gapId && !this.state.isHomeLocked) {
      this.navigateTo('gap');
    }
  }

  // Navigate to a specific spatial scale
  public navigateTo(
    targetScale: SpatialScale,
    contextUpdate?: Partial<JourneySelectionContext>,
    durationMs: number = 2400
  ): boolean {
    // Strictly prevent navigation if Home is locked
    if (this.state.isHomeLocked) {
      return false;
    }

    if (targetScale === this.state.currentScale && !this.state.isTransitioning) {
      if (contextUpdate) {
        this.setContext(contextUpdate);
      }
      return true;
    }

    const currentIdx = SPATIAL_SCALE_SEQUENCE.indexOf(this.state.currentScale);
    const targetIdx = SPATIAL_SCALE_SEQUENCE.indexOf(targetScale);
    if (targetIdx === -1) return false;

    // Determine journey direction
    const direction: 'forward' | 'reverse' = targetIdx >= currentIdx ? 'forward' : 'reverse';

    // Cancel any active animation frame
    this.cancelTransition();

    if (contextUpdate) {
      this.state.context = {
        ...this.state.context,
        ...contextUpdate,
      };
    }

    this.state.targetScale = targetScale;
    this.state.isTransitioning = true;
    this.state.direction = direction;
    this.state.progress = 0.0;
    this.transitionDuration = durationMs;
    this.transitionStartTime = performance.now();

    this.notify();
    this.runTransitionLoop();
    return true;
  }

  // Step forward to the next scale in sequence
  public next(contextUpdate?: Partial<JourneySelectionContext>): boolean {
    if (this.state.isHomeLocked) return false;
    const currentIdx = SPATIAL_SCALE_SEQUENCE.indexOf(
      this.state.targetScale || this.state.currentScale
    );
    if (currentIdx < SPATIAL_SCALE_SEQUENCE.length - 1) {
      const nextScale = SPATIAL_SCALE_SEQUENCE[currentIdx + 1];
      return this.navigateTo(nextScale, contextUpdate);
    }
    return false;
  }

  // Step backward to the previous scale in sequence (return journey)
  public previous(): boolean {
    if (this.state.isHomeLocked) return false;
    const currentIdx = SPATIAL_SCALE_SEQUENCE.indexOf(
      this.state.targetScale || this.state.currentScale
    );
    if (currentIdx > 0) {
      const prevScale = SPATIAL_SCALE_SEQUENCE[currentIdx - 1];
      return this.navigateTo(prevScale);
    }
    return false;
  }

  // Reset journey to macro universe overview
  public resetToUniverse(): boolean {
    if (this.state.isHomeLocked) return false;
    return this.navigateTo('universe', {
      clusterId: null,
      paperId: null,
      citationId: null,
      evidenceId: null,
      gapId: null,
    });
  }

  // Cancel transition safely
  public cancelTransition() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    if (this.state.isTransitioning) {
      this.state.isTransitioning = false;
      this.state.targetScale = null;
      this.state.direction = 'idle';
    }
  }

  // Smooth frame-driven progress loop
  private runTransitionLoop = () => {
    const now = performance.now();
    const elapsed = now - this.transitionStartTime;
    const rawProgress = Math.min(1.0, Math.max(0.0, elapsed / this.transitionDuration));

    // Quintic S-Curve Easing (6t^5 - 15t^4 + 10t^3) matching project motion standard
    const easedProgress =
      rawProgress * rawProgress * rawProgress * (rawProgress * (rawProgress * 6.0 - 15.0) + 10.0);

    this.state.progress = easedProgress;

    // Dispatch progress tick
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('rr-journey-progress', {
          detail: {
            progress: easedProgress,
            rawProgress,
            currentScale: this.state.currentScale,
            targetScale: this.state.targetScale,
            direction: this.state.direction,
          },
        })
      );
    }

    if (rawProgress >= 1.0) {
      // Settle transition
      this.state.currentScale = this.state.targetScale || this.state.currentScale;
      this.state.targetScale = null;
      this.state.isTransitioning = false;
      this.state.progress = 1.0;
      this.state.direction = 'idle';
      this.animFrameId = null;
      this.notify();
    } else {
      this.animFrameId = requestAnimationFrame(this.runTransitionLoop);
    }
  };
}

// Global Singleton Instance
export const spatialJourneyController = new SpatialJourneyController();

// React Hook for declarative UI consumption
export function useSpatialJourney() {
  const [journeyState, setJourneyState] = useState<SpatialJourneyState>(() =>
    spatialJourneyController.getSnapshot()
  );

  useEffect(() => {
    return spatialJourneyController.subscribe((next) => {
      setJourneyState(next);
    });
  }, []);

  return {
    ...journeyState,
    navigateTo: spatialJourneyController.navigateTo.bind(spatialJourneyController),
    next: spatialJourneyController.next.bind(spatialJourneyController),
    previous: spatialJourneyController.previous.bind(spatialJourneyController),
    resetToUniverse: spatialJourneyController.resetToUniverse.bind(spatialJourneyController),
    selectCluster: spatialJourneyController.selectCluster.bind(spatialJourneyController),
    selectPaper: spatialJourneyController.selectPaper.bind(spatialJourneyController),
    selectGap: spatialJourneyController.selectGap.bind(spatialJourneyController),
    setContext: spatialJourneyController.setContext.bind(spatialJourneyController),
    setHomeLocked: spatialJourneyController.setHomeLocked.bind(spatialJourneyController),
  };
}
