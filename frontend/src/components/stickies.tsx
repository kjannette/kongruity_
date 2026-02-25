import { useState, useEffect, useRef } from 'react';
import type { DragEvent } from 'react';
import { useGetStickies, useClusterStickies } from '../api/api';
import type { Sticky as StickyType, RankedCluster } from '../types/types';
import Sticky from './sticky';
import Button from './button';
import '../styles/stickies.css';

const scoreLabel = (score: number): string => {
  if (score >= 0.7) return 'Strong';
  if (score >= 0.4) return 'Moderate';
  if (score >= 0.1) return 'Weak';
  return 'Poor';
};

const Stickies = () => {
  const { data: stickies, isLoading, error } = useGetStickies();
  const { mutate: cluster, data: clusterResponse, isPending } = useClusterStickies();

  const [rankedClusters, setRankedClusters] = useState<RankedCluster[]>([]);
  const dragIndex = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    if (clusterResponse?.clusters) {
      setRankedClusters(
        clusterResponse.clusters.map((c, i) => ({ ...c, rank: i + 1 }))
      );
    }
  }, [clusterResponse]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const score = clusterResponse?.score;

  const handleCluster = () => {
    cluster();
  };

  const buildStickyMap = (): Map<string, StickyType> => {
    const map = new Map<string, StickyType>();
    stickies?.forEach((s) => map.set(s.id, s));
    return map;
  };

  const stickyMap = buildStickyMap();

  const renderStickies = (items: StickyType[]) =>
    items?.map((sticky) => <Sticky key={sticky.id} sticky={sticky} />);

  const handleDragStart = (index: number) => {
    dragIndex.current = index;
  };

  const handleDragOver = (e: DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (targetIndex: number) => {
    const sourceIndex = dragIndex.current;
    if (sourceIndex === null || sourceIndex === targetIndex) {
      dragIndex.current = null;
      setDragOverIndex(null);
      return;
    }

    const reordered = [...rankedClusters];
    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    setRankedClusters(reordered.map((c, i) => ({ ...c, rank: i + 1 })));
    dragIndex.current = null;
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    dragIndex.current = null;
    setDragOverIndex(null);
  };

  return (
    <div className="stickies-container">
      <Button onClick={handleCluster} isLoading={isPending} label="Group Stickies By Topic" />
      {rankedClusters.length > 0 ? (
        <div className="clusters-container">
          {score != null && (
            <div className="cohesion-score">
              Cluster cohesion: <strong>{score.toFixed(2)}</strong> — {scoreLabel(score)}
            </div>
          )}
          {rankedClusters.map((group, index) => (
            <div
              key={group.label}
              className={`cluster-group cluster-draggable${dragOverIndex === index ? ' cluster-drag-over' : ''}`}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragLeave={handleDragLeave}
              onDrop={() => handleDrop(index)}
              onDragEnd={handleDragEnd}
            >
              <div className="cluster-header">
                <span className="cluster-rank" aria-label={`Priority ${group.rank}`}>
                  {group.rank}
                </span>
                {group.rank === 1 && (
                  <span className="cluster-reorder-hint">Drag and drop to reorganize cluster priority</span>
                )}
                <h3 className="cluster-label">{group.label}</h3>
                <span className="cluster-drag-handle" aria-hidden="true">⠿</span>
              </div>
              <div className="stickies-grid">
                {renderStickies(
                  group?.noteIds
                    .map((id) => stickyMap?.get(id))
                    .filter((s): s is StickyType => !!s)
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="stickies-grid">
          {renderStickies(stickies ?? [])}
        </div>
      )}
    </div>
  );
};

export default Stickies;
