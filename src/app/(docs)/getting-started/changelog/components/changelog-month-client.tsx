'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export function ChangelogMonthClient({
  monthId,
  filtersFromServer,
}: {
  monthId: string;
  filtersFromServer?: string[];
}) {
  const params = useSearchParams();
  const [isVisible, setIsVisible] = useState(true);

  const filters = useMemo(() => {
    if (filtersFromServer && filtersFromServer.length > 0)
      return filtersFromServer;
    const fromParam = params.get('filters');
    return fromParam ? fromParam.split(',').filter(Boolean) : [];
  }, [params, filtersFromServer]);

  useEffect(() => {
    const monthEl = document.getElementById(monthId);
    if (!monthEl) return;
    const entries = monthEl.querySelectorAll('[data-changelog-entry]');
    let visibleEntriesCount = 0;
    entries.forEach(entry => {
      const listItems = entry.querySelectorAll('li');
      let visibleItemsInEntry = 0;
      listItems.forEach(li => {
        if (filters.length === 0) {
          (li as HTMLElement).style.display = '';
          visibleItemsInEntry++;
          return;
        }
        const badges = li.querySelectorAll('[data-badge-type]');
        const hasBadgeInFilter = Array.from(badges).some(badge => {
          const badgeType = badge.getAttribute('data-badge-type');
          return badgeType && filters.includes(badgeType);
        });
        (li as HTMLElement).style.display = hasBadgeInFilter ? '' : 'none';
        if (hasBadgeInFilter) {
          visibleItemsInEntry++;
        }
      });
      (entry as HTMLElement).style.display =
        visibleItemsInEntry > 0 ? '' : 'none';
      if (visibleItemsInEntry > 0) {
        visibleEntriesCount++;
      }
    });
    setIsVisible(visibleEntriesCount > 0);
  }, [filters, monthId]);

  useEffect(() => {
    const el = document.getElementById(monthId);
    if (!el) return;
    (el as HTMLElement).style.display = isVisible ? '' : 'none';
  }, [isVisible, monthId]);

  return null;
}
