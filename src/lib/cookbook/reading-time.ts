import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';

const WORDS_PER_MINUTE = 200;

/**
 * Extracts clean text from markdown content
 */
function extractTextFromMarkdown(content: string): string {
  try {
    const tree = remark().use(remarkGfm).parse(content);

    const textParts: string[] = [];

    visit(tree, (node: any) => {
      // Extract text from text nodes, but skip code blocks
      if (node.type === 'text') {
        textParts.push(node.value);
      } else if (node.type === 'inlineCode') {
        // Include inline code in word count
        textParts.push(node.value);
      }
    });

    return textParts.join(' ').replace(/\s+/g, ' ').trim();
  } catch (error) {
    console.warn('Failed to extract text from markdown:', error);
    return content
      .replace(/[#*_`\[\]()]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

/**
 * Extracts clean text from Jupyter notebook content
 */
function extractTextFromNotebook(notebookJson: string): string {
  try {
    const notebook = JSON.parse(notebookJson);
    const textParts: string[] = [];

    if (notebook.cells && Array.isArray(notebook.cells)) {
      for (const cell of notebook.cells) {
        if (cell.cell_type === 'markdown' && cell.source) {
          // Handle markdown cells
          const markdownText = Array.isArray(cell.source)
            ? cell.source.join('')
            : cell.source;
          textParts.push(extractTextFromMarkdown(markdownText));
        } else if (cell.cell_type === 'code' && cell.source) {
          // Include code in word count (comments and meaningful variable names)
          const codeText = Array.isArray(cell.source)
            ? cell.source.join('')
            : cell.source;
          // Extract comments and strings from code
          const commentMatches = codeText.match(/#.*$/gm) || [];
          const stringMatches = codeText.match(/["']([^"'\\]|\\.)*["']/g) || [];
          textParts.push(commentMatches.concat(stringMatches).join(' '));
        }
      }
    }

    return textParts.join(' ').replace(/\s+/g, ' ').trim();
  } catch (error) {
    console.warn('Failed to extract text from notebook:', error);
    // Fallback: try to extract any readable text
    return notebookJson
      .replace(/[{}[\]",:]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

/**
 * Counts words in a text string
 */
function countWords(text: string): number {
  if (!text || text.trim().length === 0) return 0;

  // Split by whitespace and filter out empty strings
  const words = text
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0);
  return words.length;
}

/**
 * Calculates reading time in minutes for given content
 */
export function calculateReadingTime(
  content: string,
  isNotebook: boolean = false
): {
  minutes: number;
  words: number;
  text: string;
} {
  const cleanText = isNotebook
    ? extractTextFromNotebook(content)
    : extractTextFromMarkdown(content);

  const wordCount = countWords(cleanText);
  const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));

  const readingTimeText = minutes === 1 ? `1' read` : `${minutes}' read`;

  return {
    minutes,
    words: wordCount,
    text: readingTimeText,
  };
}
