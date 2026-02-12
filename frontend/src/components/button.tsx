import '../styles/button.css';

type ButtonProps = {
  onClick: () => void;
  isLoading: boolean;
  label: string;
};

const Button = ({ onClick, isLoading, label }: ButtonProps) => {
  return (
    <button className="primaryButton" onClick={onClick} disabled={isLoading}>
      {isLoading ? 'Working...' : label}
    </button>
  );
};

export default Button;
