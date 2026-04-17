'use client';

import React from 'react';
import Link from 'next/link';
import ArrowRightIcon from '@/components/icons/pixel/arrow-right';
import ClockIcon from '@/components/icons/pixel/clock';
import { cn } from '@/lib/utils';
import { LinkCard, UsefullLinkContainer } from '@/components/common/link-card';

export interface QuickstartItem {
    title: string;
    description: string;
    time: string;
    href: string;
    icon: React.ElementType;
}

export function QuickstartsGrid({ quickstarts }: { quickstarts: QuickstartItem[] }) {
    return (
        <div className="flex flex-col gap-8 my-8 w-full">
            <div className="text-muted-foreground text-base max-w-2xl">
                Choose a quickstart to begin.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-2">
                {quickstarts.map((qs, i) => {
                    const Icon = qs.icon;
                    return (
                        <Link
                            key={i}
                            href={qs.href}
                            className={cn(
                                'group relative overflow-hidden rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:-translate-y-1 flex flex-col no-underline hover:no-underline',
                                'hover:border-[#FF8205]/50'
                            )}
                            style={{
                                boxShadow: '0 4px 20px -10px rgba(0,0,0,0.1)'
                            }}
                        >
                            {/* Hover glow effect */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-transparent to-current" />

                            <div className="flex flex-col h-full gap-3 relative z-10">
                                <div className="flex items-start justify-between gap-4">
                                    <div className={cn('p-2 rounded-md bg-[#FF8205]/10 text-[#FF8205] mb-2')}>
                                        <Icon className="size-5" />
                                    </div>
                                    <div className="shrink-0 flex items-center justify-center size-8 rounded-full bg-secondary text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors transition-transform duration-300 group-hover:scale-110">
                                        <ArrowRightIcon className="size-4 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                    </div>
                                </div>
                                <h3 className="font-semibold text-[1.1rem] leading-tight text-foreground group-hover:text-primary transition-colors">
                                    {qs.title}
                                </h3>

                                <p className="text-muted-foreground text-sm leading-relaxed flex-1 mt-1">
                                    {qs.description}
                                </p>

                                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/50">
                                    <ClockIcon className="size-3.5 text-muted-foreground/70" />
                                    <span className="text-xs font-medium text-muted-foreground tracking-wide uppercase">
                                        {qs.time} to complete
                                    </span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
