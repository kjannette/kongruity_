import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../components/button';

describe('Button', () => {

  it('should render with the provided label', () => {
    render(<Button onClick={() => {}} isLoading={false} label="Click Me" />);
    expect(screen.getByRole('button', { name: 'Click Me' })).toBeInTheDocument();
  });

  it('should show "Working..." when isLoading is true', () => {
    render(<Button onClick={() => {}} isLoading={true} label="Click Me" />);
    expect(screen.getByRole('button', { name: 'Working...' })).toBeInTheDocument();
  });

  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} isLoading={false} label="Click Me" />);

    await userEvent.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledOnce();
  });

});
