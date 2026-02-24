export type Sticky = {
  id: string;
  text: string;
  x: number;
  y: number;
  author: string;
  color: string;
};

export type Cluster = {
  label: string;
  noteIds: string[];
};

export type ClusterResponse = {
  clusters: Cluster[];
  score: number;
};

export type RankedCluster = Cluster & {
  rank: number;
};
