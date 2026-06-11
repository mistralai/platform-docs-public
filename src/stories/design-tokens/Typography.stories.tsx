import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

function FontFamilies() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold mb-4 text-foreground">Sans-serif (Arial)</h3>
        <div className="space-y-2">
          <p className="font-sans font-normal text-base">
            Regular (400) — The quick brown fox jumps over the lazy dog
          </p>
          <p className="font-sans font-bold text-base">
            Bold (700) — The quick brown fox jumps over the lazy dog
          </p>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold mb-4 text-foreground">Monospace (SF Mono)</h3>
        <div className="space-y-2">
          <p className="font-mono font-normal text-base">
            Regular (400) — The quick brown fox jumps over the lazy dog
          </p>
          <p className="font-mono italic font-normal text-base">
            Regular Italic (400) — The quick brown fox jumps over the lazy dog
          </p>
          <p className="font-mono font-medium text-base">
            Medium (500) — The quick brown fox jumps over the lazy dog
          </p>
          <p className="font-mono italic font-medium text-base">
            Medium Italic (500) — The quick brown fox jumps over the lazy dog
          </p>
          <p className="font-mono font-semibold text-base">
            Semibold (600) — The quick brown fox jumps over the lazy dog
          </p>
          <p className="font-mono italic font-semibold text-base">
            Semibold Italic (600) — The quick brown fox jumps over the lazy dog
          </p>
          <p className="font-mono font-bold text-base">
            Bold (700) — The quick brown fox jumps over the lazy dog
          </p>
          <p className="font-mono italic font-bold text-base">
            Bold Italic (700) — The quick brown fox jumps over the lazy dog
          </p>
          <p className="font-mono font-extrabold text-base">
            Heavy (800) — The quick brown fox jumps over the lazy dog
          </p>
          <p className="font-mono italic font-extrabold text-base">
            Heavy Italic (800) — The quick brown fox jumps over the lazy dog
          </p>
        </div>
      </div>
    </div>
  );
}

const TEXT_SIZES = [
  { class: 'text-xs', label: 'text-xs', lineHeight: '1.4', letterSpacing: '-0.01em' },
  { class: 'text-sm', label: 'text-sm', lineHeight: '1.4', letterSpacing: '-0.015em' },
  { class: 'text-base', label: 'text-base', lineHeight: '1.5', letterSpacing: '-0.02em' },
  { class: 'text-lg', label: 'text-lg', lineHeight: '1.4', letterSpacing: '-0.02em' },
  { class: 'text-xl', label: 'text-xl', lineHeight: '1.2', letterSpacing: '-0.02em' },
  { class: 'text-2xl', label: 'text-2xl', lineHeight: '1.2', letterSpacing: '-0.02em' },
  { class: 'text-3xl', label: 'text-3xl', lineHeight: '1.2', letterSpacing: '-0.02em' },
  { class: 'text-4xl', label: 'text-4xl', lineHeight: '1.1', letterSpacing: '-0.02em' },
  { class: 'text-5xl', label: 'text-5xl', lineHeight: '1.1', letterSpacing: '-0.02em' },
  { class: 'text-6xl', label: 'text-6xl', lineHeight: '1.1', letterSpacing: '-0.04em' },
  { class: 'text-7xl', label: 'text-7xl', lineHeight: '1.1', letterSpacing: '-0.04em' },
  { class: 'text-8xl', label: 'text-8xl', lineHeight: '1.1', letterSpacing: '-0.04em' },
  { class: 'text-9xl', label: 'text-9xl', lineHeight: '1.1', letterSpacing: '-0.04em' },
] as const;

function TextScale() {
  return (
    <div className="space-y-6">
      {TEXT_SIZES.map((size) => (
        <div key={size.label} className="border-b border-border pb-4">
          <div className="flex items-baseline gap-4 mb-1">
            <code className="text-xs font-mono text-muted-foreground w-20 shrink-0">
              {size.label}
            </code>
            <span className="text-xs text-muted-foreground">
              lh: {size.lineHeight} &middot; ls: {size.letterSpacing}
            </span>
          </div>
          <p className={size.class}>Mistral AI Documentation</p>
        </div>
      ))}
    </div>
  );
}

function TypographyPage() {
  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-2xl font-bold mb-6 text-foreground">Font Families</h2>
        <FontFamilies />
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-6 text-foreground">Text Scale</h2>
        <TextScale />
      </section>
    </div>
  );
}

const meta: Meta = {
  title: 'Design Tokens/Typography',
  component: TypographyPage,
};

export default meta;
type Story = StoryObj;

export const Default: Story = {};
