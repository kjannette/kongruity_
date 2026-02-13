import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  fetchMock.mockReturnValue(
    Promise.resolve({ ok: true, json: () => Promise.resolve([]) } as Response)
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

const renderApp = (initialRoute = '/') => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <App />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('App routing', () => {

  it('should render the Home page on "/"', async () => {
    renderApp('/');
    expect(await screen.findByText('kongruity')).toBeInTheDocument();
  });

  it('should redirect unknown routes to Home', async () => {
    renderApp('/some/random/path');
    expect(await screen.findByText('kongruity')).toBeInTheDocument();
  });
});
