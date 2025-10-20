'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const HEIGHT = 72;
export default function BackGradient() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // Show gradient after scrolling the height from top
      const shouldShowForScroll = scrollY > HEIGHT;

      // Find footer element and check if it's touching the top of the screen
      const footer = document.querySelector('footer');
      let shouldHideForFooter = false;

      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        // Hide when footer touches the top of the viewport
        shouldHideForFooter = footerRect.top <= 100;
      }

      setIsVisible(shouldShowForScroll && !shouldHideForFooter);
    };

    const handleResize = () => {
      // Trigger scroll handler on resize to recalculate positions
      handleScroll();
    };

    // Initial check
    handleScroll();

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="pointer-events-none fixed top-0 w-full left-0 h-20 bg-gradient-to-b from-40% from-background to-background/0 z-50"
        />
      )}
    </AnimatePresence>
  );
}
