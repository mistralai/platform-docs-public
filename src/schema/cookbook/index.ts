// Cookbook entry from JSON structure
export interface CookbookEntry {
  /** File path to the cookbook */
  path: string;
  /** Optional publication date (for display) */
  date?: string;
  displayDate: boolean;
  /** Labels for categorization */
  labels: {
    /** Integration technologies used */
    integrations: string[];
    /** Use cases demonstrated */
    useCases: string[];
  };
  /** Whether the cookbook is available in docs */
  availableInDocs: {
    page: boolean;
    displayed: boolean;
  };
  /** Optional title override */
  title?: string;
  /** Main section placement */
  mainSection: {
    /** Whether to feature in featured section */
    featured: 'True' | 'False';
    /** Whether to show in latest section */
    latest: 'True' | 'False';
  };
  /* Author (Ability to display an author { img, name, url? } / @mistral / undefined / null) */
  author?:
    | {
        img?: string;
        name?: string;
        url?: string;
      }
    | string
    | null;
}

// Full cookbook with all metadata
export interface Cookbook {
  /** Unique identifier */
  slug: string;
  /** Display title */
  title: string;
  /** File path to the cookbook */
  path: string;
  /** Integration technologies */
  integrations: string[];
  /** Use cases */
  useCases: string[];
  /** Whether featured */
  featured: boolean;
  /** Whether latest */
  latest: boolean;
  /** Link to cookbook page */
  link: string;
  /** File type */
  type: 'ipynb' | 'md';
  /** Optional publication date (for display) - YYYY-MM-DD */
  date?: string;
  displayDate: boolean;
  /** Full content or metadata */
  content?: string;
  /** Estimated reading time */
  readingTime: {
    minutes: number;
    words: number;
    text: string;
  };
  /** Difficulty level */
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  /** Tags for additional categorization */
  tags?: string[];
  /** Github URL */
  githubUrl?: string;
  /** Colab URL */
  colabUrl?: string;
  /** Author information */
  author?: CookbookAuthor;

  displayed: boolean;
}

export interface CookbookSaved extends Omit<Cookbook, 'content'> {}

// Utility functions
export function generateCookbookSlug(path: string): string {
  return path
    .replace(/\.(ipynb|md)$/, '')
    .replace(/\//g, '-')
    .toLowerCase();
}

type CookbookAuthor = { img?: string; name: string; url?: string } | null;

export async function getCookbookAuthor(
  author: string | { img?: string; name?: string; url?: string } | null
): Promise<CookbookAuthor> {
  if (typeof author === 'string') {
    // fetch from github
    // ensure it don't have an @ at first [0]
    const username = author.replace(/^@/, '');

    // get the name from the github api
    const { name, url, img } = await fetch(
      `https://api.github.com/users/${username}`
    )
      .then(res => res.json())
      .then(data => ({
        name: data.name,
        url: data.html_url,
        img: data.avatar_url,
      }));
    if (!name) {
      return null;
    }
    return { name: name, url: url, img: img };
  }
  if (typeof author === 'object') {
    if (!author?.name)
      throw new Error('If author is an object, author name is required');
    return author as CookbookAuthor;
  }
  return author;
}

export function getCookbookType(path: string): 'ipynb' | 'md' {
  return path.endsWith('.ipynb') ? 'ipynb' : 'md';
}
