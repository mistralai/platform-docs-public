'use client';

import React, { useState, useMemo } from 'react';
import { SearchIcon } from '@/components/icons/pixel';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { glossaryData } from './glossary-data';

const LETTERS = ['All', ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];

function slugify(input: string) {
    return input
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
}

export function InteractiveGlossary() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLetter, setSelectedLetter] = useState('All');

    const filteredTerms = useMemo(() => {
        return glossaryData.filter(item => {
            const matchesSearch = item.term.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesLetter = selectedLetter === 'All' || item.term.toUpperCase().startsWith(selectedLetter);
            return matchesSearch && matchesLetter;
        });
    }, [searchQuery, selectedLetter]);

    return (
        <div className="flex flex-col gap-6 my-8 w-full">
            {/* Search and Filter Controls */}
            <div className="sticky top-16 z-10 -mx-4 px-4 py-4 md:static md:mx-0 md:p-0 md:bg-transparent bg-background/80 backdrop-blur-sm">
                <div className="relative mb-4">
                    <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search glossary terms... (e.g. RAG, Fine-tuning)"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            if (e.target.value) setSelectedLetter('All');
                        }}
                        className="pl-10 h-12 text-lg shadow-sm w-full bg-background"
                    />
                </div>

                {/* Letter Quick Filters */}
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x">
                    {LETTERS.map(letter => {
                        const hasTerms = letter === 'All' || glossaryData.some(t => t.term.toUpperCase().startsWith(letter));
                        if (!hasTerms) return null;

                        return (
                            <Badge
                                key={letter}
                                variant={selectedLetter === letter ? 'default' : 'outline'}
                                className={`snap-start cursor-pointer transition-all hover:bg-primary/90 text-sm whitespace-nowrap px-3 py-1.5 ${selectedLetter === letter ? 'shadow-md scale-105' : 'hover:scale-105'
                                    }`}
                                onClick={() => {
                                    setSelectedLetter(letter);
                                    if (letter !== 'All') setSearchQuery('');
                                }}
                            >
                                {letter}
                            </Badge>
                        );
                    })}
                </div>
            </div>

            {/* Results */}
            {filteredTerms.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center justify-center opacity-70">
                    <p className="text-xl font-medium text-muted-foreground">No terms found matching &quot;{searchQuery}&quot;</p>
                    <p className="mt-2 text-sm text-muted-foreground">Try adjusting your filters or search query.</p>
                </div>
            ) : (
                <Accordion type="multiple" className="w-full not-prose">
                    {filteredTerms.map((item) => {
                        const value = slugify(item.term);
                        return (
                            <AccordionItem key={item.term} value={value} className="group border-none">
                                <AccordionTrigger
                                    id={value}
                                    className="flex w-full items-center justify-between gap-4 rounded-none py-3 text-left hover:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 [&[data-state=open]>div_svg]:rotate-180"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <span className="font-bold text-base text-foreground leading-tight">
                                            {item.term}
                                        </span>
                                        <div className="flex flex-wrap gap-1">
                                            {item.categories.map(cat => (
                                                <span key={cat} className="inline-flex items-center rounded-sm bg-muted px-1.5 py-0.5 text-[10px] uppercase font-medium text-muted-foreground">
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-1 pb-3 border-t border-foreground/10">
                                    <div className="text-sm text-muted-foreground leading-relaxed">
                                        {item.definition}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        );
                    })}
                </Accordion>
            )}
        </div>
    );
}
