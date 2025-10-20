import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ComponentPropsWithoutRef, ElementType } from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type AsProp<C extends ElementType> = { as?: C };

export type PolymorphicComponentProps<C extends ElementType, Props> = Props &
  AsProp<C> &
  Omit<ComponentPropsWithoutRef<C>, keyof (AsProp<C> & Props)>;

export type PolymorphicRef<C extends ElementType> =
  ComponentPropsWithoutRef<C>['ref'];
