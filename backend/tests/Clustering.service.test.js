import { describe, it, expect, vi, beforeEach } from 'vitest';

const { createMock } = vi.hoisted(() => {
  return { createMock: vi.fn() };
});

vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: class MockAnthropic {
      constructor() {
        this.messages = { create: createMock };
      }
    },
  };
});

import { clusterNotes } from '../services/clustering.service.js';

const MOCK_NOTES = [
  { id: 'note_001', text: 'Login is broken' },
  { id: 'note_002', text: 'Export fails' },
];

const MOCK_CLUSTERS = [
  { label: 'Auth Issues', noteIds: ['note_001'] },
  { label: 'Export Issues', noteIds: ['note_002'] },
];


describe('clusterNotes service', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call Anthropic messages.create with the correct model', async () => {
    createMock.mockResolvedValue({
      content: [{ type: 'text', text: JSON.stringify(MOCK_CLUSTERS) }],
    });

    await clusterNotes(MOCK_NOTES);

    expect(createMock).toHaveBeenCalledOnce();
    const callArgs = createMock.mock.calls[0][0];
    expect(callArgs.model).toBe('claude-sonnet-4-20250514');
    expect(callArgs.max_tokens).toBe(4096);
  });

  it('should include all note texts in prompt sent to the LLM API', async () => {
    createMock.mockResolvedValue({
      content: [{ type: 'text', text: JSON.stringify(MOCK_CLUSTERS) }],
    });

    await clusterNotes(MOCK_NOTES);

    const prompt = createMock.mock.calls[0][0].messages[0].content;
    expect(prompt).toContain('note_001');
    expect(prompt).toContain('Login is broken');
    expect(prompt).toContain('note_002');
    expect(prompt).toContain('Export fails');
  });

  it('should parse and return the clustered JSON from the API response', async () => {
    createMock.mockResolvedValue({
      content: [{ type: 'text', text: JSON.stringify(MOCK_CLUSTERS) }],
    });

    const result = await clusterNotes(MOCK_NOTES);

    expect(result).toEqual(MOCK_CLUSTERS);
  });

  it('should throw error when the API returns non-JSON', async () => {
    createMock.mockResolvedValue({
      content: [{ type: 'text', text: 'An unknown error occured when generting structured response.' }],
    });

    await expect(clusterNotes(MOCK_NOTES)).rejects.toThrow('non-JSON response');
  });

  it('should throw error when the API response has no text content', async () => {
    createMock.mockResolvedValue({ content: [] });

    await expect(clusterNotes(MOCK_NOTES)).rejects.toThrow('no text content returned');
  });

  it('should throw error when Anthropic API authentication fails', async () => {
    createMock.mockRejectedValue(new Error('401 Unauthorized'));

    await expect(clusterNotes(MOCK_NOTES)).rejects.toThrow('401 Unauthorized');
  });
});
