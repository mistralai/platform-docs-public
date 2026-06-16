'use client';

import * as React from 'react';
import { useParams, usePathname } from 'next/navigation';

type ActiveElementHashContextType = {
  activeElementHash: string;
};

const ActiveElementHashContext =
  React.createContext<ActiveElementHashContextType | null>(null);

export const useActiveElementHash = () => {
  const context = React.useContext(ActiveElementHashContext);
  if (!context) {
    return null;
  }
  return context;
};

export const ActiveElementHashProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const params = useParams();
  const pathname = usePathname();
  const [activeElementHash, setActiveElementHash] = React.useState('');
  const observerRef = React.useRef<IntersectionObserver | null>(null);
  const visibleSectionsRef = React.useRef<Set<string>>(new Set());

  React.useLayoutEffect(() => {
    setActiveElementHash(window.location.hash);
  }, []);

  React.useEffect(() => {
    setActiveElementHash('');
  }, [pathname]);

  React.useEffect(() => {
    const updateActiveHash = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      if (scrollTop < 10) {
        setActiveElementHash(prev => (prev !== '' ? '' : prev));
        return;
      }

      if (visibleSectionsRef.current.size === 0) return;

      // Find the topmost visible element
      const visibleIds = Array.from(visibleSectionsRef.current)
        .map(id => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null)
        .sort(
          (a, b) =>
            a.getBoundingClientRect().top - b.getBoundingClientRect().top
        );
      let topMostElement: Element | undefined = visibleIds[0];
      if (topMostElement && topMostElement.id) {
        const newHash = `#${topMostElement.id}`;
        setActiveElementHash(prev => (prev !== newHash ? newHash : prev));
      }
    };

    const setupObserver = () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (!entry.target) return;
            const elementFocusing = entry.target;
            const h2Element = elementFocusing.querySelector(
              '[data-type="operation-summary-title"] h2'
            );
            const id = h2Element?.id;
            if (!id) return;

            if (entry.isIntersecting) {
              visibleSectionsRef.current.add(id);
            } else {
              visibleSectionsRef.current.delete(id);
            }
          });
          updateActiveHash();
        },
        {
          rootMargin: '-20% 0px -70% 0px',
          threshold: 0,
        }
      );

      const elements = document.querySelectorAll(
        '[data-type="operation"]:has([data-type="operation-summary-title"] h2)'
      );

      elements.forEach(element => {
        if (observerRef.current) {
          observerRef.current.observe(element);
        }
      });
    };

    const handleScroll = () => {
      updateActiveHash();
    };

    const timeoutId = setTimeout(() => {
      setupObserver();
      window.addEventListener('scroll', handleScroll, { passive: true });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      visibleSectionsRef.current.clear();
    };
    // Intentionally omit `activeElementHash` from deps: it was causing
    // the observer to be torn down and re-created on every scroll-driven
    // hash update, which flickered the active section and reset the
    // visible-sections set during a 100ms blind window.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const contextValue = React.useMemo(
    () => ({
      activeElementHash,
    }),
    [activeElementHash]
  );

  return (
    <ActiveElementHashContext.Provider value={contextValue}>
      {children}
    </ActiveElementHashContext.Provider>
  );
};

// Backward compatibility component
export const HashAutoChange = () => <></>;
