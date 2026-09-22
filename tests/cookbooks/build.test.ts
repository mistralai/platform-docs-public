import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  getContent: vi.fn(),
  writeFile: vi.fn(),
  mkdir: vi.fn(),
}));

vi.mock('../../cookbooks.config.json', () => ({
  default: [{
    path: 'missing-cookbook.ipynb',
    title: 'A configured title must not hide a missing source',
    labels: { integrations: [], useCases: [] },
    availableInDocs: { page: true, displayed: true },
    mainSection: { featured: 'False', latest: 'False' },
  }],
}));

vi.mock('node:fs/promises', () => ({
  default: { mkdir: mocks.mkdir, writeFile: mocks.writeFile },
}));

vi.mock('@/lib/cookbook', () => ({
  getCookbookContentWithTitle: mocks.getContent,
  getGithubUrl: () => 'https://github.com/mistralai/cookbook',
  getColabUrl: () => undefined,
  calculateReadingTime: () => ({ minutes: 1, words: 10, text: "1' read" }),
}));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.spyOn(process, 'exit').mockImplementation(() => undefined as never);
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('cookbook build source validation', () => {
  it.each([
    ['missing', null, null],
    ['empty', '', ''],
    ['whitespace-only', '  \n', '  \n'],
    ['title-only', '# Title', ''],
  ])('fails for a %s source without writing the index', async (_, content, body) => {
    mocks.getContent.mockResolvedValue({
      content,
      contentWithoutTitle: body,
      title: null,
      titleFromSlug: null,
    });

    await import('../../src/scripts/build-complete-cookbook');

    await vi.waitFor(() => expect(process.exit).toHaveBeenCalledWith(1));
    expect(console.error).toHaveBeenCalledWith(expect.objectContaining({
      message: expect.stringContaining('Cannot build cookbook missing-cookbook.ipynb'),
    }));
    expect(mocks.writeFile).not.toHaveBeenCalled();
  });

  it('writes the index when source content is available', async () => {
    const content = JSON.stringify({
      cells: [{ cell_type: 'markdown', source: ['A working cookbook.'] }],
    });
    mocks.getContent.mockResolvedValue({
      content,
      contentWithoutTitle: content,
      title: 'A working cookbook',
      titleFromSlug: 'Missing Cookbook',
    });

    await import('../../src/scripts/build-complete-cookbook');

    await vi.waitFor(() => expect(mocks.writeFile).toHaveBeenCalledOnce());
    const entries = JSON.parse(mocks.writeFile.mock.calls[0][1]);
    expect(entries).toHaveLength(1);
    expect(entries[0].slug).toBe('missing-cookbook');
    expect(process.exit).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });
});
