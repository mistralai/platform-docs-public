import fs from 'fs';
import path from 'path';

export interface TimelineMonth {
  month: string;
  href: string;
}

export interface TimelineYear {
  year: string;
  months: TimelineMonth[];
}

export function generateTimelineData(): TimelineYear[] {
  const changelogDir = path.join(process.cwd(), 'changelog');

  if (!fs.existsSync(changelogDir)) {
    return [];
  }

  const files = fs.readdirSync(changelogDir);
  const mdxFiles = files.filter(file => file.endsWith('.mdx'));

  const yearMonthMap = new Map<string, Set<string>>();

  mdxFiles.forEach(file => {
    const dateMatch = file.match(/(\d{4})-(\d{2})-\d{2}\.mdx$/);
    if (dateMatch) {
      const year = dateMatch[1];
      const monthNum = parseInt(dateMatch[2]);
      const monthName = new Date(2024, monthNum - 1)
        .toLocaleDateString('en-US', { month: 'long' })
        .toLowerCase();

      if (!yearMonthMap.has(year)) {
        yearMonthMap.set(year, new Set());
      }
      yearMonthMap.get(year)?.add(monthName);
    }
  });

  const timeline: TimelineYear[] = [];

  const sortedYears = Array.from(yearMonthMap.keys()).sort(
    (a, b) => parseInt(b) - parseInt(a)
  );

  sortedYears.forEach(year => {
    const months = Array.from(yearMonthMap.get(year) || []);

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
}
