import React, { useState } from 'react';
import { Points3DData, ResearchGap } from '../types';
import { OmniScopeL1ClusterSpace } from './OmniScopeL1ClusterSpace';
import { GapMatrix } from './GapMatrix';
import { ObservatoryStandby } from './ObservatoryStandby';

interface OmniScopeStudioProps {
  data3d?: Points3DData | null;
  datasetName?: string;
  onNavigateToGrant?: (gapTitle: string) => void;
  onNavigateToHero?: () => void;
  onSelectPaper?: (paperId: string) => void;
  selectedClusterId?: string;
  onSelectCluster?: (id: string) => void;
  activeLayer?: 1 | 2 | 3;
  onSelectLayer?: (layer: 1 | 2 | 3) => void;
  gaps?: ResearchGap[];
  hasDataset?: boolean;
  activeQuery?: string;
  onOpenBenchmark?: () => void;
}

export const OmniScopeStudio: React.FC<OmniScopeStudioProps> = ({
  data3d,
  onNavigateToGrant,
  onNavigateToHero,
  onSelectPaper,
  selectedClusterId,
  onSelectCluster,
  activeLayer = 1,
  gaps = [],
  hasDataset = false,
  activeQuery,
  onOpenBenchmark,
}) => {
  const [localClusterId, setLocalClusterId] = useState<string>('');

  const curClusterId = selectedClusterId !== undefined ? selectedClusterId : localClusterId;

  const handleSelectCluster = (id: string) => {
    if (onSelectCluster) onSelectCluster(id);
    setLocalClusterId(id);
  };

  if (!hasDataset && (!data3d || data3d.clusters.length === 0)) {
    return (
      <ObservatoryStandby
        stageNumber="01"
        stageName="Domain Clusters"
        description="No literature corpus currently initialized. Run a research inquiry or choose a curated topic from the search deck to generate high-dimensional thematic clusters."
        onLaunchSearch={onNavigateToHero || (() => {})}
      />
    );
  }

  return (
    <div className="w-full h-full text-slate-100 flex flex-col font-sans overflow-hidden bg-transparent">
      <main className="relative flex-1 w-full h-full overflow-hidden">
        {activeLayer === 3 ? (
          <div className="w-full h-full overflow-y-auto px-6 py-4 max-w-[1560px] mx-auto bg-[#07090e]/85 backdrop-blur-xl">
            <GapMatrix 
              gaps={gaps || []} 
              onSelectGapForGrant={onNavigateToGrant || (() => {})} 
              onOpenBenchmark={onOpenBenchmark}
            />
          </div>
        ) : (
          <OmniScopeL1ClusterSpace
            data3d={data3d}
            selectedClusterId={curClusterId}
            onSelectCluster={handleSelectCluster}
            onSelectPaper={onSelectPaper}
            onNavigateToHero={onNavigateToHero}
            activeQuery={activeQuery}
          />
        )}
      </main>
    </div>
  );
};

export default OmniScopeStudio;
