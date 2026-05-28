'use client';
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

let globalActiveElement: HTMLElement | null = null;
const activeProviders = new Set<() => void>();

const notifyProviders = () => {
  activeProviders.forEach(callback => callback());
};

export const ConnectingCellContext = createContext<{
  isHovering: boolean;
  setIsHovering: (isHovering: boolean) => void;
}>({
  isHovering: false,
  setIsHovering: () => {},
});

export const useConnectingCellContext = () => {
  return useContext(ConnectingCellContext);
};

export const ConnectingCellProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const childrenWithRef = Children.map(children, child => {
    if (isValidElement(child)) {
      // @ts-ignore
      return cloneElement(child, { ref });
    }
    return child;
  });

  const updateHoverState = () => {
    setIsHovering(globalActiveElement === ref.current);
  };

  useEffect(() => {
    activeProviders.add(updateHoverState);
    return () => {
      activeProviders.delete(updateHoverState);
    };
  }, []);

  useEffect(() => {
    if (ref.current) {
      const handleMouseEnter = (e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement;
        globalActiveElement = target;
        notifyProviders();
      };

      const handleMouseLeave = (e: MouseEvent) => {
        const relatedTarget = e.relatedTarget as HTMLElement;
        if (!ref.current?.contains(relatedTarget)) {
          globalActiveElement = null;
          notifyProviders();
        }
      };

      ref.current.addEventListener('mouseenter', handleMouseEnter);
      ref.current.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        if (ref.current) {
          ref.current.removeEventListener('mouseenter', handleMouseEnter);
          ref.current.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
    }
  }, []);

  const scrollStoppedScrollingTimeout = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const onScroll = () => {
      globalActiveElement = null;
      notifyProviders();
      if (scrollStoppedScrollingTimeout.current) {
        clearTimeout(scrollStoppedScrollingTimeout.current);
      }
      scrollStoppedScrollingTimeout.current = setTimeout(() => {
        globalActiveElement = null;
        notifyProviders();
      }, 100);
    };
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <ConnectingCellContext.Provider value={{ isHovering, setIsHovering }}>
      {childrenWithRef}
    </ConnectingCellContext.Provider>
  );
};
