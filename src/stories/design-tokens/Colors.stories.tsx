import type { Meta, StoryObj } from '@storybook/react';
import React, { useEffect, useState } from 'react';

function ColorSwatch({
  variable,
  tailwind,
}: {
  variable: string;
  tailwind: string;
}) {
  const [computed, setComputed] = useState('');

  useEffect(() => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue(variable)
      .trim();
    setComputed(value || '—');
  }, [variable]);

  return (
    <div className="flex items-center gap-3 py-1.5">
      <div
        className="w-10 h-10 rounded-md border border-border shrink-0"
        style={{ backgroundColor: `var(${variable})` }}
      />
      <div className="min-w-0">
        <p className="font-mono text-xs text-foreground">{variable}</p>
        <p className="font-mono text-xs text-muted-foreground">{tailwind}</p>
        <p className="font-mono text-[10px] text-muted-foreground/60 truncate">
          {computed}
        </p>
      </div>
    </div>
  );
}

function ColorSection({
  title,
  colors,
}: {
  title: string;
  colors: { variable: string; tailwind: string }[];
}) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold mb-3 text-foreground">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-1">
        {colors.map((c) => (
          <ColorSwatch key={c.variable} {...c} />
        ))}
      </div>
    </div>
  );
}

function AllColors() {
  return (
    <div>
      <ColorSection
        title="Core Semantic"
        colors={[
          { variable: '--background', tailwind: 'bg-background' },
          { variable: '--foreground', tailwind: 'text-foreground' },
          { variable: '--primary', tailwind: 'bg-primary' },
          { variable: '--primary-soft', tailwind: 'bg-primary-soft' },
          { variable: '--primary-foreground', tailwind: 'text-primary-foreground' },
          { variable: '--primary-soft-foreground', tailwind: 'text-primary-soft-foreground' },
          { variable: '--secondary', tailwind: 'bg-secondary' },
          { variable: '--secondary-foreground', tailwind: 'text-secondary-foreground' },
          { variable: '--tertiary', tailwind: 'bg-tertiary' },
          { variable: '--tertiary-foreground', tailwind: 'text-tertiary-foreground' },
          { variable: '--accent', tailwind: 'bg-accent' },
          { variable: '--accent-foreground', tailwind: 'text-accent-foreground' },
          { variable: '--muted', tailwind: 'bg-muted' },
          { variable: '--muted-foreground', tailwind: 'text-muted-foreground' },
          { variable: '--destructive', tailwind: 'bg-destructive' },
        ]}
      />
      <ColorSection
        title="Surfaces"
        colors={[
          { variable: '--card', tailwind: 'bg-card' },
          { variable: '--card-foreground', tailwind: 'text-card-foreground' },
          { variable: '--popover', tailwind: 'bg-popover' },
          { variable: '--popover-foreground', tailwind: 'text-popover-foreground' },
          { variable: '--input', tailwind: 'bg-input' },
          { variable: '--code-background', tailwind: 'bg-code-background' },
          { variable: '--code-foreground', tailwind: 'text-code-foreground' },
        ]}
      />
      <ColorSection
        title="Border & Ring"
        colors={[
          { variable: '--border', tailwind: 'border-border' },
          { variable: '--ring', tailwind: 'ring-ring' },
        ]}
      />
      <ColorSection
        title="Sidebar"
        colors={[
          { variable: '--sidebar', tailwind: 'bg-sidebar' },
          { variable: '--sidebar-foreground', tailwind: 'text-sidebar-foreground' },
          { variable: '--sidebar-primary', tailwind: 'bg-sidebar-primary' },
          { variable: '--sidebar-primary-foreground', tailwind: 'text-sidebar-primary-foreground' },
          { variable: '--sidebar-accent', tailwind: 'bg-sidebar-accent' },
          { variable: '--sidebar-accent-foreground', tailwind: 'text-sidebar-accent-foreground' },
          { variable: '--sidebar-border', tailwind: 'border-sidebar-border' },
          { variable: '--sidebar-ring', tailwind: 'ring-sidebar-ring' },
        ]}
      />
      <ColorSection
        title="Charts"
        colors={[
          { variable: '--chart-1', tailwind: 'bg-chart-1' },
          { variable: '--chart-2', tailwind: 'bg-chart-2' },
          { variable: '--chart-3', tailwind: 'bg-chart-3' },
          { variable: '--chart-4', tailwind: 'bg-chart-4' },
          { variable: '--chart-5', tailwind: 'bg-chart-5' },
        ]}
      />
      <ColorSection
        title="Model Colors (Primary)"
        colors={[
          { variable: '--model-pink', tailwind: 'bg-model-pink' },
          { variable: '--model-red', tailwind: 'bg-model-red' },
          { variable: '--model-orange', tailwind: 'bg-model-orange' },
          { variable: '--model-yellow', tailwind: 'bg-model-yellow' },
          { variable: '--model-green', tailwind: 'bg-model-green' },
          { variable: '--model-blue', tailwind: 'bg-model-blue' },
          { variable: '--model-purple', tailwind: 'bg-model-purple' },
        ]}
      />
      <ColorSection
        title="Model Colors (Subtle)"
        colors={[
          { variable: '--model-yellow-subtle', tailwind: 'bg-model-yellow-subtle' },
          { variable: '--model-amber-subtle', tailwind: 'bg-model-amber-subtle' },
          { variable: '--model-orange-subtle', tailwind: 'bg-model-orange-subtle' },
          { variable: '--model-red-subtle', tailwind: 'bg-model-red-subtle' },
          { variable: '--model-rose-subtle', tailwind: 'bg-model-rose-subtle' },
          { variable: '--model-fuschia-subtle', tailwind: 'bg-model-fuschia-subtle' },
          { variable: '--model-pink-subtle', tailwind: 'bg-model-pink-subtle' },
          { variable: '--model-purple-subtle', tailwind: 'bg-model-purple-subtle' },
          { variable: '--model-violet-subtle', tailwind: 'bg-model-violet-subtle' },
          { variable: '--model-indigo-subtle', tailwind: 'bg-model-indigo-subtle' },
          { variable: '--model-blue-subtle', tailwind: 'bg-model-blue-subtle' },
          { variable: '--model-sky-subtle', tailwind: 'bg-model-sky-subtle' },
          { variable: '--model-cyan-subtle', tailwind: 'bg-model-cyan-subtle' },
          { variable: '--model-teal-subtle', tailwind: 'bg-model-teal-subtle' },
          { variable: '--model-emerald-subtle', tailwind: 'bg-model-emerald-subtle' },
          { variable: '--model-green-subtle', tailwind: 'bg-model-green-subtle' },
          { variable: '--model-lime-subtle', tailwind: 'bg-model-lime-subtle' },
          { variable: '--model-beige-subtle', tailwind: 'bg-model-beige-subtle' },
        ]}
      />
      <ColorSection
        title="API & Brand"
        colors={[
          { variable: '--api-light-blue', tailwind: '—' },
          { variable: '--api-orange', tailwind: '—' },
          { variable: '--api-violet', tailwind: '—' },
        ]}
      />
      <ColorSection
        title="Mistral Gradient"
        colors={[
          { variable: '--mistral-color-1', tailwind: '—' },
          { variable: '--mistral-color-2', tailwind: '—' },
          { variable: '--mistral-color-3', tailwind: '—' },
          { variable: '--mistral-color-4', tailwind: '—' },
        ]}
      />
      <ColorSection
        title="Type Indicators"
        colors={[
          { variable: '--types-string', tailwind: 'bg-types-string' },
          { variable: '--types-number', tailwind: 'bg-types-number' },
          { variable: '--types-boolean', tailwind: 'bg-types-boolean' },
          { variable: '--types-array', tailwind: 'bg-types-array' },
          { variable: '--types-enum', tailwind: 'bg-types-enum' },
          { variable: '--types-object', tailwind: 'bg-types-object' },
          { variable: '--types-union', tailwind: 'bg-types-union' },
        ]}
      />
    </div>
  );
}

const meta: Meta = {
  title: 'Design Tokens/Colors',
  component: AllColors,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
