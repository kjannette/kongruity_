import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Stickies from '../components/stickies';
import { createTestWrapper } from './test-wrapper';

const MOCK_STICKIES = [
  { id: 'note_001', text: 'Login flow feels confusing', x: 193, y: 191, author: 'user_5', color: 'yellow' },
  { id: 'note_002', text: 'Export takes too long', x: 798, y: 211, author: 'user_2', color: 'green' },
];

const MOCK_CLUSTERS = [
  { label: 'Auth Issues', noteIds: ['note_001'] },
  { label: 'Export Issues', noteIds: ['note_002'] },
];

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  globalThis.fetch = fetchMock as unknown as typeof fetch;
});

afterEach(() => {
  vi.restoreAllMocks();
});

const mockFetchOk = (data: unknown) =>
  Promise.resolve({ ok: true, json: () => Promise.resolve(data) } as Response);

const mockFetchFail = () =>
  Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve({}) } as Response);

describe('Stickies', () => {

  it('should show a loading indicator while fetching notes', () => {
    fetchMock.mockReturnValue(new Promise(() => {}));
    const { Wrapper } = createTestWrapper();
    render(<Stickies />, { wrapper: Wrapper });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render all sticky notes after fetch succeeds', async () => {
    fetchMock.mockReturnValue(mockFetchOk(MOCK_STICKIES));
    const { Wrapper } = createTestWrapper();

    render(<Stickies />, { wrapper: Wrapper });

    expect(await screen.findByText('Login flow feels confusing')).toBeInTheDocument();
    expect(screen.getByText('Export takes too long')).toBeInTheDocument();
  });

  it('should render the cluster button', async () => {
    fetchMock.mockReturnValue(mockFetchOk(MOCK_STICKIES));
    const { Wrapper } = createTestWrapper();

    render(<Stickies />, { wrapper: Wrapper });

    expect(await screen.findByRole('button', { name: 'Group Stickies By Topic' })).toBeInTheDocument();
  });

  it('should show an error message when fetching notes fails', async () => {
    fetchMock.mockReturnValue(mockFetchFail());
    const { Wrapper } = createTestWrapper();

    render(<Stickies />, { wrapper: Wrapper });

    expect(await screen.findByText(/Error:/)).toBeInTheDocument();
  });

  it('should show cluster labels after clustering succeeds', async () => {
    // First call = GET notes, second call = POST cluster
    fetchMock
      .mockReturnValueOnce(mockFetchOk(MOCK_STICKIES))
      .mockReturnValueOnce(mockFetchOk(MOCK_CLUSTERS));

    const { Wrapper } = createTestWrapper();
    render(<Stickies />, { wrapper: Wrapper });

    const btn = await screen.findByRole('button', { name: 'Group Stickies By Topic' });
    await userEvent.click(btn);

    await waitFor(() => {
      expect(screen.getByText('Auth Issues')).toBeInTheDocument();
      expect(screen.getByText('Export Issues')).toBeInTheDocument();
    });
  });

  it('should still render sticky note text inside clusters', async () => {
    fetchMock
      .mockReturnValueOnce(mockFetchOk(MOCK_STICKIES))
      .mockReturnValueOnce(mockFetchOk(MOCK_CLUSTERS));

    const { Wrapper } = createTestWrapper();
    render(<Stickies />, { wrapper: Wrapper });

    const btn = await screen.findByRole('button', { name: 'Group Stickies By Topic' });
    await userEvent.click(btn);

    expect(await screen.findByText('Login flow feels confusing')).toBeInTheDocument();
    expect(screen.getByText('Export takes too long')).toBeInTheDocument();
  });
});
