import { useQuery } from '@tanstack/react-query';


const fetchStickies = async () => {
    const response = await fetch('https://<backend-url>/v1/stickies');
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

    return <div>{data?.map((sticky: any) => <div key={sticky.id}>{sticky.text}</div>)}</div>;
  };

  export default Stickies;