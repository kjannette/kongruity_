type ButtonProps = {
  onClick: () => void;
  isLoading: boolean;
  label: string;
};

const Button = ({ onClick, isLoading, label }: ButtonProps) => {
  return (
    <button onClick={onClick} disabled={isLoading}>
      {isLoading ? 'Working...' : label}
    </button>
  );
};

export default Button;
