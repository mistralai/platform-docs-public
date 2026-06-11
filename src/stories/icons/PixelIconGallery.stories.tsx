import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import * as PixelIcons from '@/components/icons/pixel';

type IconEntry = {
  name: string;
  Component: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const iconEntries: IconEntry[] = Object.entries(PixelIcons)
  .filter(([, value]) => typeof value === 'function' || typeof value === 'object')
  .map(([name, Component]) => ({
    name,
    Component: Component as React.ComponentType<React.SVGProps<SVGSVGElement>>,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

function IconGallery() {
  const [search, setSearch] = useState('');

  const filtered = iconEntries.filter((icon) =>
    icon.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search icons..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <span className="text-sm text-muted-foreground">
          {filtered.length} of {iconEntries.length} icons
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {filtered.map(({ name, Component }) => (
          <div
            key={name}
            className="flex flex-col items-center gap-2 rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Component className="size-4" />
              <Component className="size-6" />
              <Component className="size-8" />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground text-center leading-tight truncate w-full">
              {name}
            </span>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-muted-foreground text-sm py-8 text-center">
          No icons found matching &quot;{search}&quot;
        </p>
      )}
    </div>
  );
}

const meta: Meta = {
  title: 'Icons/Pixel Icons',
  component: IconGallery,
};

export default meta;
type Story = StoryObj;

export const Gallery: Story = {};
