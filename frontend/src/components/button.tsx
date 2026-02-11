type ClusterButtonProps = {
  onClick: () => void;
  isLoading: boolean;
};

const ClusterButton = ({ onClick, isLoading }: ClusterButtonProps) => {
  return (
    <button onClick={onClick} disabled={isLoading}>
      {isLoading ? 'Clustering...' : 'Run Clustering'}
    </button>
  );
};

export default ClusterButton;
