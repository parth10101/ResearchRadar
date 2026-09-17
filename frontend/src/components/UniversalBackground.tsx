import React from 'react';
import { AstraParticleWorld } from '../particles/AstraParticleWorld';
import { Points3DData } from '../types';

interface UniversalBackgroundProps {
  viewMode?: 'hero' | 'studio';
  isTransitioning?: boolean;
  activeTab?: string;
  selectedClusterId?: string;
  onSelectCluster?: (id: string) => void;
  autoRotate?: boolean;
  activeLayer?: 1 | 2 | 3;
  points3dData?: Points3DData | null;
}

export const UniversalBackground: React.FC<UniversalBackgroundProps> = ({
  viewMode = 'hero',
  isTransitioning = false,
  activeTab = 'archipelago',
  selectedClusterId = '1',
  onSelectCluster,
  activeLayer = 1,
  points3dData,
}) => {
  return (
    <AstraParticleWorld
      viewMode={viewMode}
      isTransitioning={isTransitioning}
      activeTab={activeTab}
      selectedClusterId={selectedClusterId}
      onSelectCluster={onSelectCluster}
      activeLayer={activeLayer}
      points3dData={points3dData}
    />
  );
};
