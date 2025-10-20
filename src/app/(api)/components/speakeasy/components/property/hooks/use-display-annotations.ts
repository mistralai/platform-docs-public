import { PropertyAnnotations } from '@/app/(api)/types/shared';
import { useMemo } from 'react';

export function useDisplayAnnotations(
  typeAnnotations: PropertyAnnotations[] | undefined
): {
  isRequired: boolean;
  annotations: PropertyAnnotations[];
} {
  const customAnnotations = ['required'];
  const displayAnnotations = useMemo(() => {
    return typeAnnotations?.filter(
      annotation => !customAnnotations.includes(annotation.title)
    );
  }, [typeAnnotations]);
  const isRequired = useMemo(() => {
    return (
      typeAnnotations?.some(annotation => annotation.title === 'required') ||
      false
    );
  }, [typeAnnotations]);

  return {
    isRequired,
    annotations: displayAnnotations || [],
  };
}
