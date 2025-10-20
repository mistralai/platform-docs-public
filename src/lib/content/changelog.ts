import fs from 'fs';
import path from 'path';
import { ChangelogEntry } from '@/schema/content/changelog';

export interface TimelineData {
  year: string;
  months: { month: string; href: string }[];
}

function parseTags(tagsValue: any): string[] {
  if (!tagsValue) return [];

  if (Array.isArray(tagsValue)) {
    return tagsValue;
  }

  if (typeof tagsValue === 'string') {
    if (tagsValue.startsWith('[') && tagsValue.endsWith(']')) {
      const content = tagsValue.slice(1, -1);
      return content.split(',').map(tag => tag.trim());
    }
    return [tagsValue];
  }

  return [];
}

export async function getAllChangelogEntries(
  importFunc?: (file: string) => Promise<{ metadata: any; default: any }>
): Promise<ChangelogEntry[]> {
  const doImport = importFunc
    ? importFunc
    : (file: string) => import(`../../../changelog/${file}`);
  const changelogDir = path.join(process.cwd(), 'changelog');

  if (!fs.existsSync(changelogDir)) {
    return [];
  }

  const files = fs.readdirSync(changelogDir);
  const mdxFiles = files.filter(file => file.endsWith('.mdx'));

  const entryPromises: Promise<ChangelogEntry>[] = mdxFiles.map(async file => {
    const { metadata, default: Component } = await doImport(file);
    const slug = file.replace('.mdx', '');

    let date = metadata.date;
    if (!date) {
      const dateMatch = slug.match(/(\d{4}-\d{2}-\d{2})/);
      if (dateMatch) {
        date = dateMatch[1];
      }
    }

    const tags = parseTags(metadata.tags);

    return {
      slug,
      date: date || slug,
      title: metadata.title || `Changelog ${slug}`,
      metadata: {
        ...metadata,
        tags,
      },
      Component,
    };
  });

  const entries = await Promise.all(entryPromises);

  return entries.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime();
  });
}

export function getMonthFromDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'long', year: '2-digit' });
}

export async function generateTimelineFromChangelogs(
  importFunc?: (file: string) => Promise<{ metadata: any; default: any }>
): Promise<TimelineData[]> {
  try {
    const entries = await getAllChangelogEntries(importFunc);

    const timelineMap = new Map<string, Set<string>>();

    entries.forEach(entry => {
      const date = new Date(entry.date);
      const year = date.getFullYear().toString();
      const month = date
        .toLocaleDateString('en-US', { month: 'long' })
        .toLowerCase();

      if (!timelineMap.has(year)) {
        timelineMap.set(year, new Set());
      }
      timelineMap.get(year)?.add(month);
    });

    const timeline: TimelineData[] = [];

    const sortedYears = Array.from(timelineMap.keys()).sort(
      (a, b) => parseInt(b) - parseInt(a)
    );

    sortedYears.forEach(year => {
      const months = Array.from(timelineMap.get(year) || []);

      const monthOrder = [
        'december',
        'november',
        'october',
        'september',
        'august',
        'july',
        'june',
        'may',
        'april',
        'march',
        'february',
        'january',
      ];
      const sortedMonths = months.sort(
        (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
      );

      timeline.push({
        year,
        months: sortedMonths.map(month => ({
          month,
          href: `/getting-started/changelog#${month}-${year}`,
        })),
      });
    });

    return timeline;
  } catch (error) {
    console.error('Error generating timeline:', error);
    return [];
  }
}
