import { useQuery } from '@tanstack/react-query';
import type { Sticky } from '../types/types';

const fetchStickies = async (): Promise<Sticky[]> => {
    const response = await fetch('http://localhost:3001/api/notes');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const Stickies = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['stickies'],
        queryFn: fetchStickies,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return <div>{data?.map((sticky) => <div key={sticky.id}>{sticky.text}</div>)}</div>;
  };

  export default Stickies;