import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Sticky from '../components/sticky';
import type { Sticky as StickyType } from '../types/types';

const baseStickyNote: StickyType = {
  id: 'note_001',
  text: 'Login flow feels confusing',
  x: 193,
  y: 191,
  author: 'user_5',
  color: 'yellow',
};

describe('Sticky', () => {

  it('should render the note text', () => {
    render(<Sticky sticky={baseStickyNote} />);
    expect(screen.getByText('Login flow feels confusing')).toBeInTheDocument();
  });

  it('should apply the correct background color for a known color', () => {
    render(<Sticky sticky={{ ...baseStickyNote, color: 'blue' }} />);
    const el = screen.getByText('Login flow feels confusing');
    expect(el.style.backgroundColor).toBe('rgb(162, 210, 255)'); // #a2d2ff
  });

  it('should fall back to yellow for an unknown color', () => {
    render(<Sticky sticky={{ ...baseStickyNote, color: 'magenta' }} />);
    const el = screen.getByText('Login flow feels confusing');
    expect(el.style.backgroundColor).toBe('rgb(253, 253, 150)'); // #fdfd96
  });
});
