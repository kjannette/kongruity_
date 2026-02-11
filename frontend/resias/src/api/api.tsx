import { useQuery } from '@tanstack/react-query';
import type { Sticky } from '../types/types';

const fetchStickies = async (): Promise<Sticky[]> => {
  const response = await fetch('http://localhost:3001/v1/notes');
  if (!response.ok) {
    throw new Error('Failed to fetch stickies');
  }
  return response.json();
};

export const useGetStickies = () => {
  return useQuery<Sticky[]>({
    queryKey: ['stickies'],
    queryFn: fetchStickies,
  });
};
