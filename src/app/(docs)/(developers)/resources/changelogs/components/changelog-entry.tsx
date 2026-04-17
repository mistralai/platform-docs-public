'use client';

import { Bullet } from '@/components/ui/bullet';
import { formatDate } from '@/lib/date';
import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Prose } from '@/components/common/prose';
import { cn } from '@/lib/utils';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
type ChangelogEntryProps = {
  monthIndex: number;
  index: number;
  totalLength: number;
  isLastMonth: boolean;
  children: React.ReactNode;
  date: string;
};
export function ChangelogEntry(props: ChangelogEntryProps) {
  const { monthIndex, index, totalLength, isLastMonth, children, date } = props;
  const isFirstEntryEver = monthIndex === 0 && index === 0;
  const isLastInMonth = index === totalLength - 1;
  const isLastEntryOfLastMonth = isLastInMonth && isLastMonth;

  const renderLine = () => {
    const lineClassName =
      'absolute left-1/2 -translate-x-1/2 h-full top-3 w-[2px] bg-foreground/10';

    if (isLastEntryOfLastMonth) return <></>;

    if (isFirstEntryEver) {
      return (
        <div
          className={cn(
            lineClassName,
            'bg-gradient-to-b from-primary/50 to-foreground/10'
          )}
        />
      );
    }

    return <div className={lineClassName} />;
  };

  return (
    <div className="flex-1 relative">
      <Suspense>
        <FiltersChangelogEntry {...props} />
      </Suspense>
      <div
        id={`date-${date}`}
        key={index}
        className={'flex'}
        data-changelog-entry
      >
        <div className="relative flex items-start">
          <Bullet
            size={'lg'}
            variant="primary"
            className="z-10 translate-y-1.5 xl:translate-y-2"
          />
          {renderLine()}
        </div>

        <div
          className={cn(
            'flex-1 ml-4 xl:ml-6',
            !isLastInMonth ? 'pb-8' : 'pb-14'
          )}
        >
          <div className="flex items-center gap-4 my-0 pb-6">
            <h2 className="text-xl xl:text-2xl font-bold text-foreground !my-0">
              {formatDate(date)}
            </h2>
          </div>

          <Prose>{children}</Prose>
        </div>
      </div>
    </div>
  );
}

const _FiltersChangelogEntry = (props: ChangelogEntryProps) => {
  const [isLastVisible, setIsLastVisible] = useState(false);

  const params = useSearchParams();
  useEffect(() => {
    const checkIfLastVisible = () => {
      const allEntries = document.querySelectorAll('[data-changelog-entry]');
      const visibleEntries: Element[] = [];

      allEntries.forEach(entry => {
        const style = window.getComputedStyle(entry as HTMLElement);
        if (style.display !== 'none') {
          const listItems = entry.querySelectorAll('li');
          const hasVisibleItems = Array.from(listItems).some(li => {
            const liStyle = window.getComputedStyle(li);
            return liStyle.display !== 'none';
          });

          if (hasVisibleItems || listItems.length === 0) {
            visibleEntries.push(entry);
          }
        }
      });

      const isLast =
        visibleEntries.length > 0 &&
        visibleEntries[visibleEntries.length - 1] ===
          document.getElementById(`date-${props.date}`);

      setIsLastVisible(isLast);
    };

    checkIfLastVisible();

    const timeoutId = setTimeout(checkIfLastVisible, 100);

    const observer = new MutationObserver(() => {
      setTimeout(checkIfLastVisible, 50);
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['style'],
      subtree: true,
      childList: true,
    });

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [params]);

  return null;
};

const FiltersChangelogEntry = (props: ChangelogEntryProps) => {
  return (
    <NuqsAdapter>
      <_FiltersChangelogEntry {...props} />
    </NuqsAdapter>
  );
};
