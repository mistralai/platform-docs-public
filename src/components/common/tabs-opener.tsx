'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TabOption {
    id: string;
    title: string;
    icon?: React.ElementType;
    logo?: string;
    color?: string;
    bgColor?: string;
    borderColor?: string;
    activeBorder?: string;
}

export interface TabsOpenerProps {
    options: TabOption[];
    activeId: string | null;
    onChange: (id: string) => void;
    layoutIdPrefix?: string;
    className?: string;
}

export function TabsOpener({ options, activeId, onChange, layoutIdPrefix = 'tabs-opener', className }: TabsOpenerProps) {
    const colsClass = options.length === 2 ? 'md:grid-cols-2' : options.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';

    return (
        <div className={cn("grid grid-cols-1 gap-3 w-full", colsClass, className)}>
            {options.map((option) => {
                const isActive = activeId === option.id;
                const Icon = option.icon ?? null;
                return (
                    <button
                        key={option.id}
                        onClick={() => onChange(option.id)}
                        className={cn(
                            'group flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-300 w-full relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                            isActive
                                ? `bg-card border-border shadow-md ring-1 ring-border`
                                : 'bg-transparent border-transparent hover:bg-card/50 hover:border-border/50 hover:shadow-sm'
                        )}
                    >
                        {/* Active Indicator Background Glow */}
                        {isActive && (
                            <motion.div
                                layoutId={`${layoutIdPrefix}-bg`}
                                className="absolute inset-0 bg-gradient-to-br from-card to-card opacity-50 z-0"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                            />
                        )}

                        <div className="relative z-10 flex flex-col items-center gap-3 w-full">
                            {option.logo ? (
                                <Image
                                    src={option.logo}
                                    alt={option.title}
                                    width={36}
                                    height={36}
                                    className={cn(
                                        'rounded-lg transition-opacity',
                                        isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-80'
                                    )}
                                />
                            ) : Icon ? (
                                <div
                                    className={cn(
                                        'p-2 rounded-lg transition-colors',
                                        isActive ? (option.bgColor || 'bg-primary/10') : 'bg-muted group-hover:bg-muted/80'
                                    )}
                                >
                                    <Icon className={cn('size-5', isActive ? (option.color || 'text-primary') : 'text-muted-foreground')} />
                                </div>
                            ) : null}
                            <h3
                                className={cn(
                                    'text-base font-semibold transition-colors',
                                    isActive ? 'text-foreground' : 'text-foreground/80'
                                )}
                            >
                                {option.title}
                            </h3>

                            {/* Arrow for active state */}
                            {isActive && (
                                <motion.div
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute -bottom-4 animate-bounce hidden md:block"
                                >
                                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-foreground/20"></div>
                                </motion.div>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
