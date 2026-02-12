import { useGetStickies, useClusterStickies } from '../api/api';
import type { Sticky as StickyType } from '../types/types';
import Sticky from './sticky';
import Button from './button';
import '../styles/stickies.css';

const Stickies = () => {
  const { data: stickies, isLoading, error } = useGetStickies();
  const { mutate: cluster, data: clusters, isPending } = useClusterStickies();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleCluster = () => {
    cluster();
  };

  const buildStickyMap = (): Map<string, StickyType> => {
    const map = new Map<string, StickyType>();
    stickies?.forEach((s) => map.set(s.id, s));
    return map;
  };

  if (clusters) {
    const stickyMap = buildStickyMap();

    return (
      <div>
        <div>
          <Button onClick={handleCluster} isLoading={isPending} label="Group Notes By Theme"/>
        </div>
        <div className="clusters-container">
          {clusters.map((group) => (
            <div key={group.label} className="cluster-group">
              <h3 className="cluster-label">{group.label}</h3>
              <div className="stickies-grid">
                {group.noteIds.map((id) => {
                  const sticky = stickyMap.get(id);
                  return sticky ? <Sticky key={sticky.id} sticky={sticky} /> : null;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div>
        <Button onClick={handleCluster} isLoading={isPending} label="Group Notes By Theme" />
      </div>
      <div className="stickies-grid">
        {stickies?.map((sticky) => (
          <Sticky key={sticky.id} sticky={sticky} />
        ))}
      </div>
    </div>
  );
};

export default Stickies;
