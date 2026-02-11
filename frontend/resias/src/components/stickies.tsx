import { useGetStickies } from '../api/api';
import Sticky from './sticky';
import './stickies.css';

const Stickies = () => {
  const { data, isLoading, error } = useGetStickies();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="stickies-grid">
      {data?.map((sticky) => (
        <Sticky key={sticky.id} sticky={sticky} />
      ))}
    </div>
  );
};

export default Stickies;
