import { useQuery, useMutation } from '@tanstack/react-query';
import type { Sticky, ClusterResponse } from '../types/types';

const API_BASE = `${import.meta.env.VITE_API_BASE}/v1/notes`;

const fetchStickies = async (): Promise<Sticky[]> => {
  const response = await fetch(API_BASE);
  if (!response.ok) {
    throw new Error('Failed to fetch stickies');
  }
  return response.json();
};

const fetchClusters = async (): Promise<ClusterResponse> => {
  const response = await fetch(`${API_BASE}/cluster`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to cluster stickies');
  }
  return response.json();
};

export const useGetStickies = () => {
  return useQuery<Sticky[]>({
    queryKey: ['stickies'],
    queryFn: fetchStickies,
  });
};

export const useClusterStickies = () => {
  return useMutation<ClusterResponse>({
    mutationFn: fetchClusters,
  });
};
