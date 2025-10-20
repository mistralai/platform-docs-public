import fs from 'node:fs/promises';
import path from 'node:path';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import cookbookData from '@/../cookbooks.config.json';
import {
  calculateReadingTime,
  getColabUrl,
  getGithubUrl,
  getCookbookContentWithTitle,
} from '@/lib/cookbook';
import {
  type CookbookEntry,
  type Cookbook,
  type CookbookSaved,
  getCookbookAuthor,
} from '@/schema/cookbook';

const execAsync = promisify(exec);

export function generateCookbookSlug(p: string): string {
  return p
    .replace(/\.(ipynb|md)$/i, '')
    .replace(/\//g, '-')
    .toLowerCase();
}

function getCookbookType(p: string): 'ipynb' | 'md' {
  return p.endsWith('.ipynb') ? 'ipynb' : 'md';
}

async function getFirstCommitDate(
  filePath: string
): Promise<string | undefined> {
  try {
    const { stdout } = await execAsync(
      `cd static/cookbooks && git log --reverse --pretty=format:"%ad %H" -- "${filePath}" | head -1`
    );

    const fullOutput = stdout.trim();
    if (!fullOutput) {
      console.log(`[DEBUG] No git history for ${filePath}`);
      return undefined;
    }

    const [dayName, month, day, time, year] = fullOutput.split(' ');
    console.log(month, year);
    return `${month} ${year}`;
  } catch (error) {
    console.warn(`Could not get first commit date for ${filePath}:`, error);
    return undefined;
  }
}

async function main() {
  const OUT_DIR = path.join(process.cwd(), 'public');
  const OUT_PATH = path.join(OUT_DIR, 'complete-cookbook.json');

  // Update filter to check availableInDocs.page instead of string comparison
  const allCookbooks = (cookbookData as CookbookEntry[]).filter(
    entry => entry.availableInDocs.page === true
  );

  const result: Cookbook[] = [];

  await Promise.all(
    allCookbooks.map(async cookbook => {
      const type = getCookbookType(cookbook.path);
      const githubUrl = getGithubUrl(cookbook.path);
      const colabUrl =
        type === 'ipynb' ? getColabUrl(cookbook.path) : undefined;

      const [contentData, firstCommitDate] = await Promise.all([
        getCookbookContentWithTitle(cookbook.path),
        getFirstCommitDate(cookbook.path),
      ]);

      const slug = generateCookbookSlug(cookbook.path);
      const title =
        cookbook.title || contentData.title || contentData.titleFromSlug;

      if (!title) {
        console.warn(`No title found for ${cookbook.path}`);
      }

      const item: CookbookSaved = {
        slug,
        title: title ?? '',
        path: cookbook.path,
        integrations: cookbook.labels.integrations,
        useCases: cookbook.labels.useCases,
        featured: cookbook.mainSection.featured === 'True',
        latest: cookbook.mainSection.latest === 'True',
        link: `/cookbook/${slug}`,
        type,
        date: cookbook.date ?? firstCommitDate ?? undefined,
        displayDate: cookbook.displayDate !== false,
        // Add displayed property from availableInDocs.displayed
        displayed: cookbook.availableInDocs.displayed,
        readingTime: calculateReadingTime(
          contentData.contentWithoutTitle ?? contentData.content ?? '',
          type === 'ipynb'
        ),
        githubUrl,
        colabUrl,
        author: cookbook.author
          ? await getCookbookAuthor(cookbook.author)
          : undefined,
      };

      result.push(item);
    })
  );

  await fs.mkdir(OUT_DIR, { recursive: true });
  await fs.writeFile(OUT_PATH, JSON.stringify(result));
  console.log(
    `Wrote ${result.length} cookbooks → ${path.relative(
      process.cwd(),
      OUT_PATH
    )}`
  );
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});