import { Suspense } from 'react';
import { ChangelogMonthClient } from './changelog-month-client';

export function ChangelogMonthWrapper({
  monthId,
  children,
  filters,
}: {
  monthId: string;
  children: React.ReactNode;
  filters?: string[];
}) {
  return (
    <>
      <Suspense>
        <ChangelogMonthClient monthId={monthId} filtersFromServer={filters} />
      </Suspense>
      <div id={monthId} className="relative flex flex-1">
        {children}
      </div>
    </>
  );
}
