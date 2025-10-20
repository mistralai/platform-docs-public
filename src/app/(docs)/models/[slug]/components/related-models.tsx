'use client';
import { SectionTab } from '@/components/layout/section-tab';
import { ModelCard } from '@/components/model/model-card';
import { Model, ModelKey } from '@/schema/models';
import React, { useState, useMemo } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/icons/pixel';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence, usePresenceData } from 'framer-motion';
import { models } from '@/schema';
import { cn } from '@/lib/utils';

// Separate component for animated content that uses usePresenceData
const AnimatedModels = React.forwardRef<HTMLDivElement, { models: Model[] }>(
  function AnimatedModels({ models }, ref) {
    const direction = usePresenceData() as number;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: direction > 0 ? '100%' : '-100%' }}
        animate={{
          opacity: 1,
          x: 0,
          transition: { duration: 0.4, ease: 'easeInOut' },
        }}
        exit={{
          opacity: 0,
          x: direction > 0 ? '-100%' : '100%',
          transition: { duration: 0.4, ease: 'easeInOut' },
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full"
      >
        {models.map(model => (
          <ModelCard
            model={model}
            variant="mini"
            key={model?.name}
            showParameters={false}
          />
        ))}
      </motion.div>
    );
  }
);

export default function RelatedModels({
  initialModels,
  currentModelName,
  className,
}: {
  initialModels?: ModelKey[] | ModelKey[];
  currentModelName?: string;
  className?: string;
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const modelsPerPage = 3;
  const maxTotalModels = 9;

  // Generate the complete models list (limited to 9 total)
  const allAvailableModels = useMemo(() => {
    // Start with related models from props
    const relatedModels =
      initialModels
        ?.map(modelName => models.find(m => m.name === modelName))
        .filter(Boolean) || [];

    // Get other models (excluding current model and already selected related models)
    const relatedModelNames = new Set(initialModels || []);
    const otherModels = models.filter(
      model =>
        model.name !== currentModelName &&
        !relatedModelNames.has(model.name as ModelKey)
    );

    // Combine: related models first, then others, but limit to maxTotalModels
    const combinedModels = [...relatedModels, ...otherModels].slice(
      0,
      maxTotalModels
    );

    return combinedModels.filter(
      (model): model is NonNullable<typeof model> => model !== null
    );
  }, [initialModels, currentModelName]);

  // Calculate pagination
  const totalPages = Math.ceil(allAvailableModels.length / modelsPerPage);
  const startIndex = currentPage * modelsPerPage;
  const currentModels = allAvailableModels.slice(
    startIndex,
    startIndex + modelsPerPage
  );

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentPage(currentPage === 0 ? totalPages - 1 : currentPage - 1);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentPage(currentPage === totalPages - 1 ? 0 : currentPage + 1);
  };

  // Don't render if no models available
  if (allAvailableModels.length === 0) {
    return null;
  }

  return (
    <div className={cn('w-full', className)}>
      <SectionTab className="border-none pl-2" variant="secondary">
        Other Models
      </SectionTab>
      <div className="relative overflow-clip border border-secondary rounded-lg p-1 flex items-center w-full">
        <AnimatePresence mode="popLayout" custom={direction} initial={false}>
          <AnimatedModels key={currentPage} models={currentModels} />
        </AnimatePresence>
      </div>
      {totalPages > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            className="absolute -left-2 -translate-x-full bottom-6.5"
          >
            <ChevronLeftIcon className="size-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="absolute -right-2 translate-x-full bottom-6.5"
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </>
      )}
    </div>
  );
}
