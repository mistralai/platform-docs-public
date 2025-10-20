import { PropertyAnnotations } from "../types/shared";

export const isRequired = (typeAnnotations: PropertyAnnotations[] | undefined) => {
  return typeAnnotations?.some((annotation) => annotation.title === 'required');
};