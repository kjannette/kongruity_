import type { Sticky as StickyType } from '../types/types';
import '../styles/sticky.css';

const COLOR_MAP: Record<string, string> = {
  yellow: '#fdfd96',
  blue: '#a2d2ff',
  green: '#b5ead7',
  pink: '#ffb7ce',
  purple: '#cdb4db',
  orange: '#ffc09f',
};

type StickyProps = {
  sticky: StickyType;
};

const Sticky = ({ sticky }: StickyProps) => {
  const backgroundColor = COLOR_MAP[sticky.color] || '#fdfd96';

  return (
    <div
      className="sticky-note"
      style={{
        backgroundColor,
        transform: `rotate(${Math.random() * 4 - 2}deg)`,
      }}
    >
      {sticky.text}
    </div>
  );
};

export default Sticky;
