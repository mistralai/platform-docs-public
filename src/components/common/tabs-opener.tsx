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
    hoverBorder?: string;
    hoverText?: string;
}

export interface TabsOpenerProps {
    options: TabOption[];
    onChange?: (id: string) => void;
    className?: string;
}

export function TabsOpener({ options, onChange, className }: TabsOpenerProps) {
    const colsClass = options.length === 2 ? 'md:grid-cols-2' : options.length === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';

    return (
        <div className={cn("grid grid-cols-1 gap-3 w-full", colsClass, className)}>
            {options.map((option) => {
                const Icon = option.icon ?? null;
                return (
                    <motion.button
                        key={option.id}
                        onClick={() => onChange?.(option.id)}
                        whileHover={{ y: -3, scale: 1.02 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className={cn(
                            "group flex flex-col items-center justify-center p-5 rounded-xl border border-border/40 bg-transparent text-center w-full relative overflow-hidden cursor-pointer hover:bg-card/50 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            option.hoverBorder ?? "hover:border-border/70"
                        )}
                    >
                        <div className="relative z-10 flex flex-col items-center w-full">
                            {option.logo ? (
                                <Image
                                    src={option.logo}
                                    alt={option.title}
                                    width={64}
                                    height={64}
                                    className="rounded-lg transition-all duration-200 opacity-55 group-hover:opacity-100 group-hover:scale-105"
                                />
                            ) : Icon ? (
                                <div className="p-2 rounded-lg transition-colors bg-muted group-hover:bg-muted/80">
                                    <Icon className={cn('size-5', option.color || 'text-muted-foreground')} />
                                </div>
                            ) : null}
                            <h3 className={cn(
                                "text-base font-semibold transition-colors mt-3 mb-0 text-center text-foreground/80",
                                option.hoverText ?? "group-hover:text-foreground"
                            )}>
                                {option.title}
                            </h3>
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
}
