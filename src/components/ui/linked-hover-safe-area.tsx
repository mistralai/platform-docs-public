'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';

// Types for the compound component
interface LinkedHoverSafeAreaContextValue {
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  targetRef: React.RefObject<HTMLElement | null>;
  hoverDelayEnter: number;
  hoverDelayLeave: number;
  hoverTimeoutRef: React.MutableRefObject<NodeJS.Timeout | null>;
  targetRect: DOMRect | null;
}

const LinkedHoverSafeAreaContext =
  React.createContext<LinkedHoverSafeAreaContextValue | null>(null);

export const useLinkedHoverSafeArea = () => {
  const context = React.useContext(LinkedHoverSafeAreaContext);
  if (!context) {
    throw new Error(
      'LinkedHoverSafeArea components must be used within LinkedHoverSafeArea.Root'
    );
  }
  return context;
};

// Safe Area component that renders a triangular safe area and manages its own mouse tracking
const SafeArea: React.FC<{
  triggerRef: React.RefObject<HTMLElement | null>;
  targetRect: DOMRect | null;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}> = ({ triggerRef, targetRect, isActive, onMouseEnter, onMouseLeave }) => {
  const [triggerRect, setTriggerRect] = React.useState<DOMRect | null>(null);
  const [mousePosition, setMousePosition] = React.useState<{
    x: number;
    y: number;
  } | null>(null);
  const [lastMousePosition, setLastMousePosition] = React.useState<{
    x: number;
    y: number;
  } | null>(null);
  const [hasLeftTrigger, setHasLeftTrigger] = React.useState(false);

  // Reset hasLeftTrigger when safe area becomes inactive
  React.useEffect(() => {
    if (!isActive) {
      setHasLeftTrigger(false);
    }
  }, [isActive]);

  // Update trigger rect and set up mouse tracking
  React.useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger || !targetRect || !isActive) return;

    // Update trigger rect
    const updateTriggerRect = () => {
      setTriggerRect(trigger.getBoundingClientRect());
    };
    updateTriggerRect();

    // Track mouse movement over the trigger
    const handleMouseMove = (e: MouseEvent) => {
      const rect = trigger.getBoundingClientRect();
      // Check if mouse is within trigger bounds
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        const newPosition = { x: e.clientX, y: e.clientY };
        setMousePosition(newPosition);
        setLastMousePosition(newPosition);
      }
    };

    const handleMouseLeave = () => {
      // Keep the last position for the cone effect
      setMousePosition(lastMousePosition);
      // Enable pointer events on safe area when mouse leaves trigger
      setHasLeftTrigger(true);
    };

    // Set initial mouse position on mount
    const handleMouseEnter = (e: MouseEvent) => {
      const newPosition = { x: e.clientX, y: e.clientY };
      setMousePosition(newPosition);
      setLastMousePosition(newPosition);
      // Reset the hasLeftTrigger state when mouse re-enters trigger
      setHasLeftTrigger(false);
    };

    trigger.addEventListener('mouseenter', handleMouseEnter);
    trigger.addEventListener('pointermove', handleMouseMove);
    trigger.addEventListener('mouseleave', handleMouseLeave);

    // Update on scroll/resize
    const handleUpdate = () => updateTriggerRect();
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);

    return () => {
      trigger.removeEventListener('mouseenter', handleMouseEnter);
      trigger.removeEventListener('pointermove', handleMouseMove);
      trigger.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [triggerRef, targetRect, isActive, lastMousePosition]);

  // Calculate the triangle points
  const points = React.useMemo(() => {
    if (!isActive || !triggerRect || !targetRect || !mousePosition) return '';

    // Determine the relative position of target to trigger
    const triggerCenterX = triggerRect.left + triggerRect.width / 2;
    const triggerCenterY = triggerRect.top + triggerRect.height / 2;
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;

    // Calculate the angle between centers to determine primary direction
    const deltaX = targetCenterX - triggerCenterX;
    const deltaY = targetCenterY - triggerCenterY;

    // Determine which two corners of the target to use based on position
    let targetPoint1: { x: number; y: number };
    let targetPoint2: { x: number; y: number };

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal alignment is primary
      if (deltaX > 0) {
        // Target is to the right of trigger - use left edge of target
        targetPoint1 = {
          x: targetRect.left,
          y: targetRect.top,
        };
        targetPoint2 = {
          x: targetRect.left,
          y: targetRect.bottom,
        };
      } else {
        // Target is to the left of trigger - use right edge of target
        targetPoint1 = {
          x: targetRect.right,
          y: targetRect.top,
        };
        targetPoint2 = {
          x: targetRect.right,
          y: targetRect.bottom,
        };
      }
    } else {
      // Vertical alignment is primary
      if (deltaY > 0) {
        // Target is below trigger - use top edge of target
        targetPoint1 = {
          x: targetRect.left,
          y: targetRect.top,
        };
        targetPoint2 = {
          x: targetRect.right,
          y: targetRect.top,
        };
      } else {
        // Target is above trigger - use bottom edge of target
        targetPoint1 = {
          x: targetRect.left,
          y: targetRect.bottom,
        };
        targetPoint2 = {
          x: targetRect.right,
          y: targetRect.bottom,
        };
      }
    }

    // Create the 3-point triangle: mouse position + two target corners
    const trianglePoints = [
      `${mousePosition.x},${mousePosition.y}`,
      `${targetPoint1.x},${targetPoint1.y}`,
      `${targetPoint2.x},${targetPoint2.y}`,
    ];

    return trianglePoints.join(' ');
  }, [isActive, triggerRect, targetRect, mousePosition]);

  // Early return after all hooks
  if (!isActive || !points) return null;

  return (
    <svg
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <polygon
        points={points}
        fill="transparent"
        style={{ pointerEvents: hasLeftTrigger ? 'auto' : 'none' }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    </svg>
  );
};

interface LinkedHoverSafeAreaRootProps {
  children: React.ReactNode;
  hoverDelayEnter?: number;
  hoverDelayLeave?: number;
}

export const Root: React.FC<LinkedHoverSafeAreaRootProps> = ({
  children,
  hoverDelayEnter = 300,
  hoverDelayLeave = 150,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const triggerRef = React.useRef<HTMLElement | null>(null);
  const targetRef = React.useRef<HTMLElement | null>(null);
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Track target rect for safe area rendering
  const [targetRect, setTargetRect] = React.useState<DOMRect | null>(null);

  // Update target position when hovered
  React.useEffect(() => {
    if (!isHovered) {
      setTargetRect(null);
      return;
    }

    const updateTargetRect = () => {
      if (targetRef.current) {
        setTargetRect(targetRef.current.getBoundingClientRect());
      }
    };

    updateTargetRect();

    // Update on scroll/resize
    const handleUpdate = () => updateTargetRect();
    window.addEventListener('scroll', handleUpdate, true);
    window.addEventListener('resize', handleUpdate);

    return () => {
      window.removeEventListener('scroll', handleUpdate, true);
      window.removeEventListener('resize', handleUpdate);
    };
  }, [isHovered]);

  const handleSafeAreaMouseEnter = () => {
    // Cancel any pending leave timeout when mouse enters safe area
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const handleSafeAreaMouseLeave = () => {
    // Start leave timeout when mouse leaves safe area
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, hoverDelayLeave);
  };

  const contextValue: LinkedHoverSafeAreaContextValue = {
    isHovered,
    setIsHovered,
    triggerRef,
    targetRef,
    hoverDelayEnter,
    hoverDelayLeave,
    hoverTimeoutRef,
    targetRect,
  };

  return (
    <LinkedHoverSafeAreaContext.Provider value={contextValue}>
      {children}
      <SafeArea
        triggerRef={triggerRef}
        targetRect={targetRect}
        isActive={isHovered}
        onMouseEnter={handleSafeAreaMouseEnter}
        onMouseLeave={handleSafeAreaMouseLeave}
      />
    </LinkedHoverSafeAreaContext.Provider>
  );
};

interface LinkedHoverSafeAreaTriggerProps extends React.ComponentProps<'div'> {
  asChild?: boolean;
}

export const Trigger = React.forwardRef<
  HTMLDivElement,
  LinkedHoverSafeAreaTriggerProps
>(
  (
    { children, asChild = false, onMouseEnter, onMouseLeave, ...props },
    forwardedRef
  ) => {
    const {
      setIsHovered,
      triggerRef,
      hoverDelayEnter,
      hoverDelayLeave,
      hoverTimeoutRef,
    } = useLinkedHoverSafeArea();

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      onMouseEnter?.(e);

      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(true);
      }, hoverDelayEnter);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      onMouseLeave?.(e);

      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      // Start timeout to close safe area - will be cancelled if mouse enters safe area
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, hoverDelayLeave);
    };

    const Comp = asChild ? Slot : 'div';

    return (
      <Comp
        ref={(node: HTMLDivElement | null) => {
          // Handle both forwarded ref and internal ref
          if (typeof forwardedRef === 'function') {
            forwardedRef(node);
          } else if (forwardedRef) {
            forwardedRef.current = node;
          }
          triggerRef.current = node;
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Trigger.displayName = 'LinkedHoverSafeAreaTrigger';

interface LinkedHoverSafeAreaTargetProps extends React.ComponentProps<'div'> {
  asChild?: boolean;
}

export const Target = React.forwardRef<
  HTMLDivElement,
  LinkedHoverSafeAreaTargetProps
>(({ children, asChild = false, ...props }, forwardedRef) => {
  const { isHovered, targetRef, hoverTimeoutRef } =
    useLinkedHoverSafeArea();

  const handleMouseEnter = () => {
    // Cancel any pending leave timeout when mouse enters target
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      ref={(node: HTMLDivElement | null) => {
        // Handle both forwarded ref and internal ref
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          forwardedRef.current = node;
        }
        targetRef.current = node;
      }}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {children}
    </Comp>
  );
});

Target.displayName = 'LinkedHoverSafeAreaTarget';
