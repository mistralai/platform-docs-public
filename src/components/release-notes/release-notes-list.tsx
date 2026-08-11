'use client';

import { useMemo, useState } from 'react';
import type { Locale } from '@/i18n/config';
import { ReleaseNoteCard } from './release-note-card';
import type { ReleaseNote } from './types';

type ReleaseNoteSort = 'newest' | 'oldest';
type ReleaseNoteFilterField = 'type' | 'area' | 'availability' | 'hosting';
type ReleaseNoteFilterValue = ReleaseNote[ReleaseNoteFilterField];
type ReleaseNoteFilters = Record<ReleaseNoteFilterField, string>;

const FILTER_FIELDS: { id: ReleaseNoteFilterField; label: string }[] = [
  { id: 'type', label: 'Type' },
  { id: 'area', label: 'Area' },
  { id: 'availability', label: 'Availability' },
  { id: 'hosting', label: 'Hosting' },
];

const SORTS: { id: ReleaseNoteSort; label: string }[] = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
];

const defaultFilters: ReleaseNoteFilters = {
  type: 'all',
  area: 'all',
  availability: 'all',
  hosting: 'all',
};

function getFilterOptions(notes: ReleaseNote[], field: ReleaseNoteFilterField) {
  return Array.from(new Set(notes.map(note => note[field]))).sort() as ReleaseNoteFilterValue[];
}

export function ReleaseNotesList({ notes, locale = 'en' }: { notes: ReleaseNote[]; locale?: Locale }) {
  const [filters, setFilters] = useState<ReleaseNoteFilters>(defaultFilters);
  const [sort, setSort] = useState<ReleaseNoteSort>('newest');

  const filterOptions = useMemo(
    () => Object.fromEntries(FILTER_FIELDS.map(field => [field.id, getFilterOptions(notes, field.id)])) as Record<ReleaseNoteFilterField, ReleaseNoteFilterValue[]>,
    [notes]
  );

  const visibleNotes = useMemo(() => {
    const filtered = notes.filter(note =>
      FILTER_FIELDS.every(field => {
        const value = filters[field.id];
        return value === 'all' || note[field.id] === value;
      })
    );

    return [...filtered].sort((a, b) => {
      const result = b.date.localeCompare(a.date);
      return sort === 'newest' ? result : -result;
    });
  }, [filters, notes, sort]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
        <div className="grid gap-3 md:grid-cols-4">
          {FILTER_FIELDS.map(field => (
            <label key={field.id} className="flex flex-col gap-1.5">
              <span className="font-mono text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {field.label}
              </span>
              <select
                value={filters[field.id]}
                onChange={event =>
                  setFilters(current => ({ ...current, [field.id]: event.target.value }))
                }
                className="h-9 cursor-pointer rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition-colors hover:bg-accent focus:border-foreground/40"
              >
                <option value="all">All</option>
                {filterOptions[field.id].map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 md:justify-end">
          {SORTS.map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSort(item.id)}
              className={sort === item.id
                ? 'cursor-pointer rounded-full border border-foreground bg-foreground px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-background transition-colors'
                : 'cursor-pointer rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {visibleNotes.map(note => (
          <ReleaseNoteCard key={`${note.date}-${note.title}`} note={note} locale={locale} />
        ))}
      </div>
    </div>
  );
}
